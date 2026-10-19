import { Router } from "express";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { enviarEmailBienvenida } from "../mail/mailer.js";
import { google } from "googleapis";
export const routerClientes = Router();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_OAUTH_CLIENT,
  process.env.GOOGLE_OAUTH_SECRET,
  // URL absoluta: tiene que coincidir con la registrada en Google Cloud Console
  process.env.GOOGLE_OAUTH_REDIRECT_URI ??
    "http://localhost:3000/api/Cliente/LoginGoogleCallBack",
);
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
    const _resultadoInsert = await db()
      .collection("clientes")
      .insertOne({
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
    res.status(200).send({
      codigo: 1,
      mensaje: `Error al registrar cliente en la BD: ${error}`,
    });
  }
});

routerClientes.get("/api/Cliente/LoginGoogle", async function (req, res, next) {
  try {
    //con las creds. de oauth obtenidsa en la consola de desarrolladores de Google, genreamos una url
    //q el usuario se autentifique con su cuenta de Google. Instalamos paquete 'googleapis' para crear el cliente oauth2.0
    //y generar la url de autentificacion
    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: [
        //<---------- info que quiero recuperar de la cuenta de google la info
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile",
      ],
    });

    res.status(200).send({
      codigo: 0,
      mensaje: "login con google generado",
      datos: { url: url },
    });
  } catch (error) {
    console.log(`'Error al procesar login con Google OAuth 2-0: ' ${error}`);
    res.status(200).send({
      codigo: 1,
      mensaje: `Error al porcesar login con Google OAuth 2.0  ${error}`,
    });
  }
});

routerClientes.get(
  "/api/Cliente/LoginGoogleCallBack",
  async function (req, res, next) {
    try {
      //con las creds. de oauth obtenidsa en la consola de desarrolladores de Google, genreamos una url
      //q el usuario se autentifique con su cuenta de Google. Instalamos paquete 'googleapis' para crear el cliente oauth2.0
      //y generar la url de autentificacion
      const { code } = req.query;
      const objetoGetTokenResponse = await oauth2Client.getToken(code);
      console.log(objetoGetTokenResponse);
      const { tokens } = objetoGetTokenResponse;
      oauth2Client.setCredentials(tokens);

      const peopleAPI = google.people({ version: "v1", auth: oauth2Client });
      const userInfo = await peopleAPI.people.get({
        resourceName: "people/me",
        personFields: "names, emailAddresses, phoneNumbers",
      });
    } catch (error) {
      console.log(`'Error al procesar login con Google OAuth 2-0: ' ${error}`);
      res.status(200).send({
        codigo: 1,
        mensaje: `Error al porcesar login con Google OAuth 2.0  ${error}`,
      });
    }
  },
);
