import { Router } from "express";
import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import jsonwebtoken from "jsonwebtoken";
import { Cliente } from "../models/Cliente.js";

export const routerClientes = Router();

// ---------------------------------------------------------------------------
// Cliente OAuth2 (google-auth-library). Se configura con las credenciales de
// Google Cloud Console (OAuth 2.0 Client ID) que vienen del .env.
// ---------------------------------------------------------------------------
const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_OAUTH_CLIENT,
  process.env.GOOGLE_OAUTH_SECRET,
  process.env.GOOGLE_OAUTH_REDIRECT_URI,
);

const SCOPES = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];

// Escapa el "<" al serializar JSON: JSON.stringify NO lo escapa y un dato con
// "</script>" cerraria el bloque <script> del popup (XSS).
const jsonSeguro = (obj) => JSON.stringify(obj).replace(/</g, "\\u003c");

// Pagina que ejecuta el popup: manda los datos a la ventana padre y se cierra.
const responderPopup = (datos, mensaje) => {
  const frontUrl = process.env.FRONT_URL ?? "http://localhost:5173";
  return `
<!DOCTYPE html>
<html lang="es">
  <head><meta charset="utf-8" /><title>Acceso con Google</title></head>
  <body>
    <p>${mensaje}</p>
    <script>
      if (window.opener) {
        window.opener.postMessage(${jsonSeguro(datos)}, ${jsonSeguro(frontUrl)});
      }
      window.close();
    </script>
  </body>
</html>`;
};

// ---------------------------------------------------------------------------
// 1) Genera la URL de autorizacion de Google y la devuelve al front.
//    El front abre esa URL en un POPUP.
// ---------------------------------------------------------------------------
routerClientes.get("/api/Cliente/LoginGoogle", (req, res) => {
  try {
    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES,
      prompt: "consent",
    });
    res.status(200).json({
      codigo: 0,
      mensaje: "URL de login con Google generada",
      datos: { url },
    });
  } catch (error) {
    console.log(`Error al generar la URL de login con Google: ${error}`);
    res.status(200).json({
      codigo: 1,
      mensaje: "No se pudo generar la URL de login con Google",
      datos: null,
    });
  }
});

// ---------------------------------------------------------------------------
// 2) Callback: Google redirige aqui con ?code=... . Canjeamos el codigo por
//    tokens, pedimos los datos del usuario (OIDC userinfo) y respondemos con
//    una pagina que hace postMessage al popup padre (LoginRegistro.jsx).
// ---------------------------------------------------------------------------
routerClientes.get(
  "/api/Cliente/LoginGoogleCallBack",
  async function (req, res) {
    try {
      console.log("parametros pasados en la url desde google....", req.query);
      const { code } = req.query; // codigo de autorizacion que pasa google en el querystring

      // --- cambiamos el codigo de autorizacion por un token de acceso a la API de Google
      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);

      // --- datos de identidad del usuario (OIDC). People API es de contactos
      //     y exige otro scope; para "quien soy yo" es userinfo.
      const { data } = await oauth2Client.userinfo.get();
      const email = String(data.email ?? "").toLowerCase().trim();
      if (!email) throw new Error("Google no ha devuelto el email del usuario");

      const datosUsuario = {
        nombre: data.name ?? email,
        apellidos: data.family_name ?? "",
        cuenta: {
          email,
          password: "",
          activada: true,
          telefono: "",
          imagenAvatar: data.picture ?? "",
        },
        direcciones: [],
        favoritos: [],
        pedidos: [],
        opiniones: [],
      };

      // 1º almacenar los datos en mongodb (coleccion clientes) si no existe
      let cliente = await Cliente.findOne({ "cuenta.email": email });
      if (!cliente) {
        cliente = await Cliente.create(datosUsuario);
        console.log("Cliente nuevo creado desde Google:", email);
      }

      // 2º generar un JWT de sesion para el usuario
      const _token = jsonwebtoken.sign(
        { email, nombre: cliente.nombre, _id: cliente._id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" },
      );

      // 3º respuesta: pagina que manda el JSON a la ventana padre con postMessage
      res.status(200).send(
        responderPopup(
          {
            codigo: 0,
            mensaje: "login con Google correcto",
            datos: { cliente, token: _token },
          },
          "Sesion iniciada. Puedes cerrar esta ventana.",
        ),
      );
    } catch (error) {
      console.log(
        `Error al procesar callback de login con Google OAuth2.0: ${error}`,
      );
      res.status(200).send(
        responderPopup(
          {
            codigo: 1,
            mensaje: `login FALLIDO con Google: ${error.message}`,
            datos: null,
          },
          "No se ha podido iniciar la sesion con Google.",
        ),
      );
    }
  },
);
