import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Usuario } from "../models/Usuario.js";
import { validarAuth } from "../middleware/validaciones.js";
import { enviarVerificacion } from "../config/mailer.js";

export const routerAuth = Router();

// bcrypt es lento a propósito (~100 ms): ese coste es lo que hace caro un
// ataque por fuerza bruta. Subirlo hace más segura la base y más lenta la
// respuesta; bajarlo destruye la única protección que tenía.
const SALT_ROUNDS = 10;

/** Convierte una excepción en un error con la forma que entiende app.js. */
function httpError(status, codigo, mensaje) {
  const err = new Error(mensaje);
  err.status = status;
  err.codigo = codigo;
  return err;
}

/** En un JWT nunca va la contraseña, ni el hash. Solo identificadores. */
function firmarToken(usuario) {
  return jwt.sign(
    { sub: usuario.id, email: usuario.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN ?? "2h" },
  );
}

/** Token de verificación: corto, de un solo uso lógico y con propósito marcado. */
function firmarTokenVerificacion(usuario) {
  return jwt.sign(
    { sub: usuario.id, email: usuario.email, proposito: "verificar-email" },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_VERIFY_EXPIRES_IN ?? "15m" },
  );
}

function datosPublicos(usuario) {
  return { id: usuario.id, nombre: usuario.nombre, email: usuario.email };
}

/*
 * POST /api/auth/register
 *
 * Orden: validar -> normalizar -> comprobar duplicado -> hashear -> insertar.
 * El paso del duplicado es una cortesía para dar un mensaje amigable; la
 * garantía real es el índice único (y su E11000, convertido a 409 en
 * app.js). Este código seguiría siendo correcto sin ese chequeo.
 */
routerAuth.post(
  "/api/auth/register",
  validarAuth({ conNombre: true }),
  async (req, res) => {
    const email = req.body.email.trim().toLowerCase();

    const yaExiste = await Usuario.findOne({ email });
    if (yaExiste) {
      throw httpError(409, "EMAIL_DUPLICADO", "Ese email ya está registrado.");
    }

    // se hashea ANTES de insertar: nunca debe existir un momento en el que
    // la contraseña esté en la base en texto plano
    const hash = await bcrypt.hash(req.body.password, SALT_ROUNDS);

    const usuario = await Usuario.create({
      nombre: req.body.nombre.trim(),
      email,
      password: hash,
    });

    // Sin sesión todavía: se firma un token corto de verificación y se manda
    // por correo. Hasta que no se pinche el enlace, el login queda bloqueado.
    const tokenVerificacion = firmarTokenVerificacion(usuario);
    const enlace = `${process.env.FRONT_URL ?? "http://localhost:5173"}/verificar?token=${tokenVerificacion}`;
    await enviarVerificacion(email, usuario.nombre, enlace);

    res.status(201).json({
      ok: true,
      mensaje: "Revisa tu correo para confirmar tu cuenta.",
    });
  },
);

/*
 * POST /api/auth/login
 *
 * El mismo error (texto Y codigo) para "no existe" y "contraseña mala".
 * Si respondieras distinto, cualquiera podría descubrir qué emails tienen
 * cuenta en la tienda: sería un oráculo, no un login.
 */
routerAuth.post(
  "/api/auth/login",
  validarAuth({ conNombre: false }),
  async (req, res) => {
    const email = req.body.email.trim().toLowerCase();

    // password tiene select: false, así que sin esto llegaría undefined y
    // bcrypt.compare fallaría con un error que no menciona las contraseñas
    const usuario = await Usuario.findOne({ email }).select("+password");

    // un solo `if` para las dos causas: así es imposible que los mensajes
    // acaben distintos, que es justo la fuga que hay que evitar
    const correcta = usuario
      ? await bcrypt.compare(req.body.password, usuario.password)
      : false;

    if (!correcta) {
      throw httpError(401, "CREDENCIALES", "Credenciales incorrectas.");
    }

    // Cuenta creada pero correo sin confirmar: no hay sesión hasta que se
    // pinche el enlace (los usuarios viejos sin campo también caen aquí).
    if (!usuario.verificado) {
      throw httpError(
        403,
        "NO_VERIFICADO",
        "Confirma tu correo antes de entrar. Revisa tu bandeja.",
      );
    }

    res.json({
      ok: true,
      usuario: datosPublicos(usuario),
      token: firmarToken(usuario),
    });
  },
);

/*
 * GET /api/auth/verificar?token=...
 *
 * El token trae proposito "verificar-email" y caduca en 15 minutos. Se usa
 * 400 (no 401) para que el front NO borre la sesión al pinchar el enlace.
 */
routerAuth.get("/api/auth/verificar", async (req, res) => {
  const { token } = req.query;

  if (!token || typeof token !== "string") {
    throw httpError(400, "TOKEN_INVALIDO", "Enlace de verificación inválido.");
  }

  let datos;
  try {
    datos = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    const codigo =
      err.name === "TokenExpiredError" ? "TOKEN_CADUCADO" : "TOKEN_INVALIDO";
    throw httpError(
      400,
      codigo,
      codigo === "TOKEN_CADUCADO"
        ? "El enlace caducó, regístrate de nuevo."
        : "Enlace de verificación inválido.",
    );
  }

  if (datos.proposito !== "verificar-email") {
    throw httpError(400, "TOKEN_INVALIDO", "Enlace de verificación inválido.");
  }

  const usuario = await Usuario.findById(datos.sub);
  if (!usuario) {
    throw httpError(400, "TOKEN_INVALIDO", "Enlace de verificación inválido.");
  }

  usuario.verificado = true;
  await usuario.save();

  res.json({ ok: true, mensaje: "Cuenta confirmada, ya puedes entrar." });
});
