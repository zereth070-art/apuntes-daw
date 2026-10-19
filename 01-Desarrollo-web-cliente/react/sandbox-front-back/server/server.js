//#region ---------------------- BACKEND DEL SANDBOX ---------------------------
/*
Este server.js es el MISMO estilo que tu sandbox de clase (CommonJS, driver
nativo de MongoDB, bcrypt, jsonwebtoken), pero con las rutas y la forma del
JSON que PIDE el front de React. Eso es el "contrato":

  front React                           backend
  -----------                           --------
  fetch("/api/auth/register")  ------>  app.post("/api/auth/register")
  { nombre, email, password }  ------>  req.body
  respuesta JSON               <------  res.json({ ok, usuario, token })

El sandbox de clase respondia en /api/Cliente/* con { codigo, mensaje }.
Aqui respondemos en /api/auth/* con { ok, error, token }. MISMA lógica,
OTRA etiqueta. Eso es todo lo que hay que cambiar para que un front "hable"
con un backend.
*/
//#endregion

//sin dotenv a proposito: este sandbox no lee variables de entorno, todo tiene
//valor por defecto abajo. En tu sandbox de clase si lo necesitaste (.env).
const express = require("express");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const { MongoClient } = require("mongodb");

//valores fijos a proposito: menos follaje que .env, ya conoces .env del otro sandbox
const PORT = 3001; //OJO: debe coincidir con el target del proxy de vite.config.js
const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017";
const BD = "sandbox-pcc"; //BD aparte para no ensuciar la de PCCOMPONENTES
const JWT_SECRET = "secreto-de-desarrollo-del-sandbox";

const app = express();
const client = new MongoClient(MONGO_URL);

//NO hace falta cors: el navegador SOLO habla con Vite (mismo origen) y Vite
//reenvia a este puerto. Si alguien llamara a Express desde fuera de Vite,
//aqui si haria falta cors.
app.use(express.json());

//el frente solo manda JSON, por eso no hace falta express.urlencoded ni
//cookieParser: se añaden SOLO si se necesitan (menos líos = menos superficie)

//#region ------------------------------ CONTRATO ------------------------------
function base() {
  return client.db(BD);
}

//firma un JWT con el _id y el email. El front lo guarda en localStorage y lo
//mandara en Authorization: Bearer en peticiones que requieran estar logueado.
function firmarToken(usuario) {
  return jsonwebtoken.sign(
    { sub: usuario._id.toString(), email: usuario.email },
    JWT_SECRET,
    { expiresIn: "2h" },
  );
}

//servicio de salud: útil para saber si el back esta vivo sin tocar la BD
app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

/*
POST /api/auth/register  body: { nombre, email, password }
Devuelve 201 + { ok:true, usuario:{_id,nombre,email}, token }
Si el email ya existe: 409 + { error:{ codigo, mensaje } }
Mismo flujo que tu Cliente/Registro, cambiadas las etiquetas.
*/
app.post("/api/auth/register", async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    // 1) duplicado -> 409 (Conflicto). El front de LoginRegistro pinta data.error.mensaje
    const yaExiste = await base().collection("usuarios").findOne({ email });
    if (yaExiste) {
      return res.status(409).json({
        error: { codigo: "EMAIL_DUPLICADO", mensaje: "Ese email ya está registrado." },
      });
    }

    // 2) hashear ANTES de insertar, nunca texto plano en la BD
    const hash = bcrypt.hashSync(password, 10);

    // 3) insertar
    const r = await base().collection("usuarios").insertOne({
      nombre,
      email,
      password: hash,
    });

    // 4) responder solo lo publico (ni hash ni _id se usa mal)
    const usuario = { _id: r.insertedId.toString(), nombre, email };
    console.log(`[registro] usuario nuevo: ${email}`);
    res.status(201).json({ ok: true, usuario, token: firmarToken(usuario) });
  } catch (error) {
    console.error("[registro] error:", error);
    res.status(500).json({
      error: { codigo: "ERROR_INTERNO", mensaje: "Error al registrar." },
    });
  }
});

/*
POST /api/auth/login  body: { email, password }
Devuelve 200 + { ok:true, usuario:{_id,nombre,email}, token }
Credenciales malas: 401 + { error:{ codigo, mensaje } }
El mismo mensaje para "no existe" y "password mala": si fueran distintos,
cualquiera podria averiguar que emails tienen cuenta (oraculo).
*/
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = await base().collection("usuarios").findOne({ email });
    const correcta = usuario ? bcrypt.compareSync(password, usuario.password) : false;

    if (!correcta) {
      return res.status(401).json({
        error: { codigo: "CREDENCIALES", mensaje: "Credenciales incorrectas." },
      });
    }

    const publico = {
      _id: usuario._id.toString(),
      nombre: usuario.nombre,
      email: usuario.email,
    };
    res.json({ ok: true, usuario: publico, token: firmarToken(publico) });
  } catch (error) {
    console.error("[login] error:", error);
    res.status(500).json({
      error: { codigo: "ERROR_INTERNO", mensaje: "Error al iniciar sesión." },
    });
  }
});

/*
GET /api/categorias
Devuelve un ARRAY. En PCCOMPONENTES sale de la coleccion "categorias" de
Mongo (ver server/src/seed). Aqui un array fijo para reducir piezas: la
leccion no es de donde salen los datos, sino la FORMA que espera el front.
El front hace categorias.map(cat => ... cat.slug / cat.nombre).
*/
app.get("/api/categorias", (req, res) => {
  res.json([
    { slug: "portatiles", nombre: "Portátiles" },
    { slug: "torres", nombre: "Torres" },
    { slug: "componentes", nombre: "Componentes" },
  ]);
});
//#endregion

//conectar a Mongo y, SOLO entonces, escuchar. Si Mongo no esta, caer con
//mensaje claro (arrancar y caerse, no arrancar y esperar en silencio)
client
  .connect()
  .then(() => {
    console.log(`[db] conectado a ${MONGO_URL}/${BD}`);
    app.listen(PORT, () => {
      console.log(`[api] escuchando en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error(`[db] no se pudo conectar a MongoDB: ${err.message}`);
    process.exit(1);
  });