//#region ---------------------- MODULO PRINCIPAL DE ENTRADA a NODEJS --------------------
/*
express funciona mediante una secuenciacion de modulos middleware (en nodejs son funciones js)
que se ejecuta en orden de declaracion:

pet.cliente ------> funct.middle-(req,res,next) ----> funct.middle-2(req,res,next)---------->,...----->
func.middle-final(req,res)                                            ||
                                                                      ||
                                                              en req objeto HTTP REQUEST          en req objeto HTTP-REQUEST modificado por middle-1
                                                              del cliente(la puede modificar)     en res objeto HTTP-RESPONSE
                                                              en res objeto HTTP-RESPONSE       <------------------------
                                                      <-----------------------
  para configurar el pipeline de express se emplean metodos de la clase Application de express, como por ejemplo:
  .use( ['/ruta',] function(req, res, next){....} ) ----> registra una funcion middleware q se ejecuta para todas las peticiones q haran
                                                          los clientes SI NO SE ESPEFICICA LA RUTA
  .get( ['/ruta',] function(req, res, next){....} ) -----> registra una funcion middleware q se ejecuta para todas las peticiones GET
  .post( ['/ruta',] function(req, res, next){....} ) -----> registra una funcion middleware q se ejecuta para todas las peticiones post
  .put( ['/ruta',] function(req, res, next){....} ) -----> registra una funcion middleware q se ejecuta para todas las peticiones put
  .delete( ['/ruta',] function(req, res, next){....} ) -----> registra una funcion middleware q se ejecuta para todas las peticiones delete
  .patch( ['/ruta',] function(req, res, next){....} ) -----> registra una funcion middleware q se ejecuta para todas las peticiones patch

  REGLAS CONFIG PIPELINES EXPRESS
  --------------------------------------------
  -poner las funciones middleware que se ejecutan para todas las rutas al principio de la ocnfiguarion
  (pq suelen modificar el objeto 'req' del cliente y le añaden propiedades q luego pueden ser usadasd por las demas funciones
  middleware) NUNCA GENERAN RESPUESTA
  - poner las funciones middleware que se ejecutan para rutas espeficicas al final de la configuarion, espeficicando el metodo HTTP
  por el cual se accede a la ruta (get, post, etc). Estas funciones SI GENERAN RESPUESTA
*/
//#endregion

//mete en una variable lo q devuelve required, que es como un import
require("dotenv").config(); //<---- ANTES que cualquier process.env, si no llega vacio
const express = require("express"); /* el modulo express exporta una funcion que asignamos a variable "express",
que al ejecutarla nos devuelve un objeto Application de Express
que es un servidor web que podemos configurar y ejecutar para atender peticiones HTTP en un determinado puerto
para lo cual se usa el metodo .listen()
*/
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const { MongoClient, ObjectId } = require("mongodb"); //<---- driver nativo de MongoDB (el mismo q usa mongoose por debajo)

//un unico cliente de conexion a Mongo para todo el servidor (se reutiliza, no abrir uno por peticion)
const clienteConexionMongoDB = new MongoClient(process.env.MONGO_URL);

// el secreto del JWT va en .env; si falta, arrancamos igual pero el token de
// activacion no sirve para nada util (ver nota en .env)
const _jwtSecret = process.env.JWT_SECRET || "SECRETO-INSEGURO-DESARROLLO";

const app = express();
const port = 3000;

//primer middleware: SOLO hace de log (regla de arriba: los de todas las rutas
//al principio y NO GENERAN RESPUESTA). Si respondiera aqui, el resto del
//pipeline (rutas de abajo) nunca llegaria a ejecutarse.
app.use(function (req, res, next) {
  console.log(`Peticion entrante: ${req.method} ${req.url}`);
  next();
});

app.use(express.json()); //<-------- primera funcion middleware, lo que hace es que meter
//en prop. req.body del objeto HTTP-REQUEST del cliente, los datos
// del cuerpo de la peticion HTTP si es un JSON valido,
// para que luego pueda ser usado por los demas middlewares

app.use(express.urlencoded({ extended: true })); //<---- 2º funcion middleware, exrae las variables del qureystring de la URL

app.use(cookieParser()); //<---- 3º funcion middleware, extrae las cookies de la cabecera Cookie de la cabecera Cookies del HTTP-REQUEST del cliente crea un objeto JS: {nombreCOokie: valor, ... } y lo mete en prop. 'req.cookies'

app.get("/", (req, res) => {
  res
    .status(200)
    .send(
      "Hola cliente... he recibido tu peticion y te devuelvo esta respuesta dese el servidor web en nodejs",
    );
});

//#region ------------------------------ FLUJO CLIENTE /api/Cliente/* ----------------------------
/*
POST /api/Cliente/Registro   body: { nombre, email, password }
Orden:
  1º comprobar que no existe ya un cliente con ese email
  2º hashear la password con bcrypt (10 rondas de sal) y guardar el documento
  3º enviar email de activacion con un token JWT (fire & forget: no tumbar
     el registro si MailJet falla)
  4º responder al cliente
*/
app.post("/api/Cliente/Registro", async function (req, res, next) {
  try {
    //en req.body express.json() ha metido { nombre, email, password }
    const { nombre, email, password } = req.body;

    //1º paso: comprobar si ya existe un usuario con ese email
    //OJO: en clase ponian 'cuenta.emaail' (typo): con ese campo la
    //busqueda NUNCA encontraba nada y el registro duplicado pasaba
    const _clienteExiste = await clienteConexionMongoDB
      .db(process.env.MONGO_DBNAME)
      .collection("clientes")
      .findOne({ "cuenta.email": email });
    if (_clienteExiste) throw new Error("Ya existe un usuario con ese email");

    //2º paso: hashear la password con bcrypt.hashSync() y almacenar en "clientes"
    const _resultadoInsert = await clienteConexionMongoDB
      .db(process.env.MONGO_DBNAME)
      .collection("clientes")
      .insertOne({
        nombre: nombre,
        apellidos: "",
        cuenta: {
          email: email,
          password: bcrypt.hashSync(password, 10), //<--- hash de la password con 10 rondas de sal
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

    //3º paso: email de confirmacion. Fire and forget: el registro ya esta
    //guardado, si MailJet falla no debe devolver codigo 1 al cliente
    enviarEmailRegistro({
      nombre,
      email,
      _id: _resultadoInsert.insertedId.toString(),
    }).catch((err) =>
      console.error("[mail] error al enviar el email:", err.message),
    );

    //4º paso: respuesta al cliente
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

/*
GET /api/Cliente/ActivarCuenta?token=...&email=...&idCliente=...
El enlace del email llega a esta ruta. Orden:
  1º comprobar que el token es valido (firma + caducidad)
  2º comprobar que el token corresponde a ese email e idCliente
  3º marcar cuenta.activada = true
*/
app.get("/api/Cliente/ActivarCuenta", async function (req, res, next) {
  try {
    const { token, email, idCliente } = req.query;
    if (!token || !email || !idCliente)
      throw new Error("Faltan parametros en el enlace de activacion");

    //1º paso: comprobar q el token es valido (lanza si la firma no cuadra o caduco)
    const _payload = jsonwebtoken.verify(token, _jwtSecret);

    //2º paso: el token debe pertenecer a ese cliente
    if (_payload.email !== email || _payload._id !== idCliente)
      throw new Error("El token no corresponde a este cliente");

    //3º paso: activar la cuenta
    const _resultadoUpdate = await clienteConexionMongoDB
      .db(process.env.MONGO_DBNAME)
      .collection("clientes")
      .updateOne(
        {
          _id: new ObjectId(idCliente),
          "cuenta.email": email,
        },
        { $set: { "cuenta.activada": true } },
      );

    console.log("Resultado de la activacion en la BD: ", _resultadoUpdate);
    if (_resultadoUpdate.modifiedCount === 0)
      throw new Error("No se ha encontrado el cliente a activar");

    res.status(200).send(
      `Cuenta de ${email} activada correctamente. Ya puedes entrar en PCCOMPONENTES.`,
    );
  } catch (error) {
    console.log(`Error al activar la cuenta en la BD: ${error}`);
    res.status(400).send({
      codigo: 1,
      mensaje: `Error al activar la cuenta: ${error}`,
    });
  }
});
//#endregion

//stub del endpoint de categorias (se atiende igual para cualquier verbo HTTP
//bajo esa ruta: esto es de clase, luego se desmenuza en get/post/put/delete)
app.use("/api/Tienda/Categorias", function (req, res, next) {
  res
    .status(200)
    .send(
      "Hola cliente... he recibido tu peticion de Categorias y te devuelvo esta respuesta desde el servidor web en nodejs",
    );
});

/*
ENVIO DE EMAILS CON MAILJET USANDO SU API-REST
https://dev.mailjet.com/openapi/openapi-mailjet/send-emails/postsendv3
- Authorization: Basic <base64(publicKey:privateKey)>
- POST https://api.mailjet.com/v3/send con Content-Type: application/json
- body en el formato plano v3: { FromEmail, FromName, Recipients, Subject, Text-part }
*/
async function enviarEmailRegistro(cliente) {
  const apiKey = process.env.MAILJET_PUBLIC_KEY;
  const apiSecret = process.env.MAILJET_PRIVATE_KEY;
  const desde = process.env.MAILJET_FROM;
  if (!apiKey || !apiSecret || !desde) {
    console.log("[mail] faltan MAILJET_* en .env: no se envia el email");
    return;
  }

  //token de activacion: firma { email, _id } con caducidad de 10 minutos
  //OJO: en clase lo escribieron como 'sing' (typo): jsonwebtoken se llama
  //.sign(payload, secreto, { expiresIn })
  const _tokenActivacion = jsonwebtoken.sign(
    { email: cliente.email, _id: cliente._id },
    _jwtSecret,
    { expiresIn: "10m" },
  );

  const _codeBase64MailjetKeys = Buffer.from(`${apiKey}:${apiSecret}`).toString(
    "base64",
  );

  const _linkActivacion = `http://localhost:${port}/api/Cliente/ActivarCuenta?token=${_tokenActivacion}&email=${cliente.email}&idCliente=${cliente._id}`;

  const _bodyEmail = {
    FromEmail: desde,
    FromName: "PCCOMPONENTES",
    Recipients: [{ Email: cliente.email, Name: cliente.nombre }],
    Subject: "Confirma tu registro en PCCOMPONENTES",
    "Text-part": `Hola ${cliente.nombre}, tu cuenta se ha creado correctamente. Confirma tu registro en este enlace (caduca en 10 minutos): ${_linkActivacion}`,
  };

  const _respuesta = await fetch("https://api.mailjet.com/v3/send", {
    method: "POST",
    headers: {
      Authorization: `Basic ${_codeBase64MailjetKeys}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(_bodyEmail), //serializamos el objeto JSON a string para enviarlo en el body de la peticion
  });

  const _datos = await _respuesta.json();
  if (!_respuesta.ok)
    throw new Error(
      `MailJet ha devuelto ${_respuesta.status}: ${JSON.stringify(_datos)}`,
    );
  console.log(`[mail] email enviado a ${cliente.email}`);
}

//el servidor solo se pone a escuchar DESPUES de conectar con MongoDB:
//si no hay Mongo, se cae con un mensaje claro en lugar de esperar en silencio
clienteConexionMongoDB
  .connect()
  .then(() => {
    console.log(`[db] conectado a ${process.env.MONGO_URL}`);
    app.listen(port, (error) => {
      if (error) {
        console.log("vaya cagada");
      }
      console.log(`Ejemplo de un servidor con el puerto:  ${port}`); //funtion exception de error
    });
  })
  .catch((err) => {
    console.error(`[db] no se pudo conectar a MongoDB: ${err.message}`);
    process.exit(1);
  });