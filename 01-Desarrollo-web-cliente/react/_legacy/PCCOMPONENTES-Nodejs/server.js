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
import express from "express"; /* el modulo express exporta una funcion que asignamos a variable "express",
que al ejecutarla nos devuelve un objeto Application de Express
que es un servidor web que podemos configurar y ejecutar para atender peticiones HTTP en un determinado puerto
para lo cual se usa el metodo .listen()
*/
import dotenv from "dotenv"; //modulo para leer variables de entorno de un fichero .env
dotenv.config(); //lee el fichero .env y mete las variables de entorno en process.env
import cookieParser from "cookie-parser";
import { Usuario } from "./models/Usuario.js"; //importa el modelo de datos Usuario para poder usarlo en este fichero
import mongoose from "mongoose"; //modulo para conectar con mongoDB¡
import bcrypt from "bcrypt"; //modulo para encriptar contraseñas
import jwt from "jsonwebtoken"; // tokens

//aplicacion express es un objeto de la clase Application de express,
//que es un servidor web que podemos configurar y ejecutar para atender peticiones HTTP en un determinado puerto
const app = express();
//ahora si podemos usar el puerto dependiendo de si se pasa por variable de entorno PORT o no, si no se pasa se usa el 3000,
//sirve para no tener que cambiar el puerto en el codigo si se despliega en un servidor que ya tiene un puerto asignado

const port = process.env.PORT || 3000; //puerto de escucha del servidor web, si no se pasa por variable de entorno PORT, se usa el 3000
// primer middleware que se ejecuta para todas las peticiones HTTP entrantes, sin importar la ruta ni el metodo HTTP
// app.use(function (req, res, next) {
//   json = {
//     metodo: req.method,
//     url: req.url,
//     cabeceras: req,
//     headers,
//     body: req.body,
//   };
// });
//conexion a la base de datos mongoDB, usando la variable de entorno MONGO_URI que se ha definido en el fichero .env
await mongoose.connect(process.env.MONGO_URI);
console.log("Conectado a la base de datos mongoDB");

app.use(express.json()); //<-------- primera funcion middleware, lo que hace es que meter
//en prop. req.body del objeto HTTP-REQUEST del cliente, los datos
// del cuerpo de la peticion HTTP si es un JSON valido,
// para que luego pueda ser usado por los demas middlewares

app.use(express.urlencoded({ extended: true })); //<---- 2º funcion middleware, exrae las variables de formulario de la cabecera HTTP-REQUEST del cliente y las mete en prop.
//'req.body' del objeto HTTP-REQUEST del cliente, para que luego pueda ser usado por los demas middlewares

app.use(cookieParser()); //<---- 3º funcion middleware, extrae las cookies de la cabecera Cookie de la cabecera Cookies del HTTP-REQUEST del cliente crea un objeto JS: {nombreCookie: valor, ... } y lo mete en prop. 'req.cookies'

// 4º funcion middleware, se ejecuta para todas las peticiones HTTP entrantes, sin importar la ruta ni el metodo HTTP
// app.use("/", function (req, res, next) {
//   console.log(`Peticion entrante: ${req.method} ${req.url}`);
//   res
//     .status(200)
//     .send(
//       "Hola cliente... he recibido tu peticion y te devuelvo esta respuesta dese el servidor web en nodejs",
//     );
// });

// Peticion get de la ruta /api/auth/register, se ejecuta cuando el cliente hace una peticion GET a la ruta /api/auth/register
app.get("/api/auth/register", (req, res) => {
  res
    .status(200)
    .send(
      "Hola cliente... he recibido tu peticion y te devuelvo esta respuesta dese el servidor web en nodejs",
    );
});
// Peticion post de la ruta /api/auth/register, se ejecuta cuando el cliente hace una peticion POST a la ruta /api/auth/register
app.post("/api/auth/register", async (req, res) => {
  const { email, nombre, password } = req.body; //destructuring del objeto req.body para extraer las variables email, nombre y password

  //creamos el usuario
  const usuarioGuardado = await Usuario.create({
    email,
    nombre,
    passwordHash: await bcrypt.hash(password, 10),
  }); //crea un nuevo usuario en la base de datos mongoDB, con el email, nombre y passwordHash encriptado con bcrypt
  //el token
  const token = jwt.sign({ sub: usuarioGuardado.id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  res.status(201).json({
    ok: true,
    usuario: {
      id: usuarioGuardado.id,
      nombre: usuarioGuardado.nombre,
      email: usuarioGuardado.email,
    },
    token,
  });
});

console.log({
  database: mongoose.connection.name,
  collection: Usuario.collection.name,
});
// esto es el listen, es decir, se pone a escuchar por el puerto y cuando llega una peticion HTTP, ejecuta el pipeline de middlewares que hemos configurado
//se debe poner al final de la configuracion del pipeline de middlewares, pq es el que inicia la ejecucion del pipeline
app.listen(port, (error) => {
  if (error) {
    console.log("vaya cagada");
  }
  console.log(`Ejemplo de un servidor con el puerto:  ${port}`); //funtion exception de error
});
