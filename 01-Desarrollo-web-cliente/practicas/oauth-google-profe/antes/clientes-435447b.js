import { Router } from "express";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { enviarEmailBienvenida } from "../mail/mailer.js";

export const routerClientes = Router();

/*
 * El driver nativo comparte la misma conexión que mongoose: no hace falta
 * crear un segundo MongoClient. mongoose.connection.getClient() devuelve
 * el cliente real que ya está conectado.
 */
function db() {
  return mongoose.connection
    .getClient()
    .db(process.env.MONGODB_DBNAME ?? "pccomponentes");
}

routerClientes.post("/api/Cliente/Registro", async (req, res) => {
  try {
    // en req.body express.json() ha metido { nombre, email, password }
    const { nombre, email, password } = req.body;

    // 1º paso: comprobar si ya existe un usuario con ese email
    // OJO: en clase ponían 'cuenta.emaail' (typo): con ese campo la
    // búsqueda NUNCA encuentra nada y el registro duplicado pasaría
    const _clienteExiste = await db()
      .collection("clientes")
      .findOne({ "cuenta.email": email });
    if (_clienteExiste) throw new Error("Ya existe un usuario con ese email");

    // 2º paso: hashear la password y guardar el documento en "clientes"
    const _resultadoInsert = await db().collection("clientes").insertOne({
      nombre: nombre,
      apellidos: "",
      cuenta: {
        email: email,
        password: bcrypt.hashSync(password, 10), // hash con 10 rondas de sal
        activada: false,
        telefono: "",
      },
      direcciones: [],
      listaFavoritos: [],
      pedidos: [],
    });
    console.log("Resultado de la insercion en la BD: ", _resultadoInsert);
    if (!_resultadoInsert.insertedId)
      throw new Error("No se ha podido insertar el cliente en la BD");

    // 3º paso: email de confirmación (fire and forget: no tumbar el registro)
    enviarEmailBienvenida({ nombre, email }).catch((err) =>
      console.error("[mail] error al enviar el email:", err.message),
    );

    // 4º paso: respuesta al cliente
    res.status(200).send({
      codigo: 0,
      mensaje:
        "Cliente registrado correctamente, revisa tu bandeja de entrada para confirmar tu cuenta",
    });
  } catch (error) {
    console.log(`Error al registrar cliente en la BD: ${error}`);
    res
      .status(200)
      .send({ codigo: 1, mensaje: `Error al registrar cliente en la BD: ${error}` });
  }
});
