//#region -------------------- MODULO PRINCIPAL DE ENTRADA a NODEJS ------------------------
/*
    express funciona mediatne la secuenciacion de una serie de modulos middleware (en nodejs son funciones JS)
    que se ejecutan en orden de declaracion:

                        |-------------------- pipeline o middleware-stack --------------------- .......
    pet.cliente ---->  func.middle-1(req,res,next) -- next() --> func.middle-2(req,res,next) -- next() --> func.middle-3(req,res,next) ---> ... ---> func.middle-n(req,res,next) ---> res.send() ----> pet.cliente
                            ||                                          ||
                        en "req" objeto HTTP-REQUEST        en "req" objeto HTTP-REQUEST modif por middle-1
                        del cliente(la puede modificar)     en "res" objeto HTTP-RESPONSE
                        en "res" objeto HTTP-RESPONSE                   |
                 <-----------|                                          |
                 <-------------------------------------------------------
     
      para configurar el pipeline de express se emplean metodos de la clase Application de express, como por ejemplo:
        .use( ['/ruta',] function(req,res,next){....} ) ----> registra una funcion middleware q se ejecuta para todas las peticiones q hagan
                                                            los clientes SINO SE ESPECIFICA UNA RUTA
        .get( '/ruta', function(req,res,next){....} ) ----> registra una funcion middleware q se ejecuta para todas las peticiones GET 
                                                            q hagan los clientes a la ruta especificada
        .post( '/ruta', function(req,res,next){....} ) ----> registra una funcion middleware q se ejecuta para todas las peticiones POST
                                                            q hagan los clientes a la ruta especificada
        (igual para .put(), .delete(), .patch(), etc)                                                 
        ....
        
        REGLAS CONFIG PIPELINE EXPRESS
        ------------------------------
        - poner las funciones middleware que se ejecutan para todas las rutas al principio de la configuracion
        (pq suelen modificar el objeto "req" del cliente y le añaden propiedades q luego pueden ser usadas por las demas funciones
        middleware) NUNCA GENERAN RESPUESTA

        - poner las funciones middleware que se ejecutan para rutas especificas al final de la configuracion, especificando el metodo HTTP
        por el cual se accede a la ruta (get, post, etc). Estas funciones SI GENERAN RESPUESTA

    */  
//#endregion
require('dotenv').config(); //<--- la funcion .config() lee el fichero .env y mete en objeto "process.env" las variables
                            //definidas como variables de entorno del sistema operativo, para que puedan ser usadas en cualquier
                            // parte del codigo de nodejs

const mongodb=require('mongodb'); //<--- el modulo "mongodb" exporta un objeto que asignamos a variable "mongodb", q expone props.
                                  // como MongoClient q sirve para crear el cliente conexion
const clienteConexionMongoDB=new mongodb.MongoClient(process.env.MONGODB_URL); //<--- en atlas la cadena conexion varia: mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net

const express=require('express'); //<--- el modulo "express" exporta una funcion que asignamos a variable "express",
//que al ejecutarla nos devuelve un objeto Application de Express: https://expressjs.com/en/5x/api/application/
//q es un servidor web que podemos configurar y ejecutar para atender peticiones HTTP en un determinado puerto
//para lo cual se usa el metodo .listen()
const cookieParser=require('cookie-parser'); //<--- el modulo "cookie-parser" exporta una funcion que asignamos a variable "cookieParser",
const cors=require('cors'); //<--- el modulo "cors" exporta una funcion que asignamos a variable "cors",
const jsonwebtoken=require('jsonwebtoken');  //<--- modulo para crear JWT de sesion de usuario
const bcrypt=require('bcrypt'); //<--- modulo para hashear y comprobar hashes de passwords de usuarios

const webServer=express();

//------------------------------------ CONFIG PIPELINE: miiddleware-stack de express ---------------------------------------------
// webServer.use(
//     function(req,res,next){
//         console.log(`Peticion entrante: ${req.method} ${req.url}`);
//         //res.status(200).send('Hola cliente....he recibido tu peticion y te devuelvo esta respuesta desde el servidor web en nodejs');
//         next(); //<--- invoca al siguiente middleware en la cadena de ejecucion
//     }
// )
webServer.use( express.json() ); //<---- 1º funcion middleware, lo que hace es meter en prop. "req.body" del objeto HTTP-REQUEST 
                            //del cliente, los datos del cuerpo de la peticion HTTP si es un JSON valido, para que luego pueda ser
                            //  usado por los demas middlewares
webServer.use( express.urlencoded({extended:true}) ); //<---- 2º funcion middleware, extrae las variables del querystring de la URL
                                                    //crea un objeto JS: {variable_Query: valor, ...} y lo mete en prop. "req.query"


webServer.use( cookieParser() ); //<---- 3º funcion middleware, extrae las cookies de la cabecera Cookies del HTTP-REQUEST del cliente
                                //crea un objeto JS: {nombreCookie: valor, ...} y lo mete en prop. "req.cookies"


webServer.use( cors() ); //<---- 4º funcion middleware, habilita CORS 


webServer.get(
    '/api/Tienda/Categorias',
    async function(req,res,next){
        try{
            console.log(`Peticion entrante: ${req.method} ${req.url}`);
            //1º paso: conectarme a la BD, usando un cliente de conexion a MongoDB: mongodb<--- driver nativo para nodejs de mongodb
            await clienteConexionMongoDB.connect();
            //2º paso: ejecutar la consulta a la BD de Mongodb para recuperar las categorias de productos(en un principio
            //solo quiero las principales o raices, es decir, las q no tienen padre por encima)
            // <--- query: db['PcComponentes'].categorias.find( { tipo:'...' } ) 
            // <==== resultado: array de objetos a devolver al cliente en variable _categorias
            const { pathCat = 'principales' } = req.query;
            const pathCatValido = pathCat === 'principales' || /^\d+(?:-\d+)*$/.test(pathCat);

            if (!pathCatValido) {
                return res.status(400).send({
                    codigo: 1,
                    mensaje: 'El pathCat no tiene un formato valido',
                    datos: { categorias: [] }
                });
            }

            const _queryRegExp = pathCat === 'principales'
                ? /^\d+$/
                : new RegExp(`^${pathCat}-\\d+$`);
            let __categorias=await clienteConexionMongoDB.db(process.env.MONGODB_DBNAME)
                                                        .collection('categorias')
                                                        .find({ pathCat: { $regex: _queryRegExp } })
                                                        .toArray();                                                        
            //3º paso: devolver la respuesta al cliente con el resultado de la operacion contra la BD
            console.log('Categorias recuperadas de la BD: ', __categorias);

            res.status(200).send(
                {
                    codigo:0, //<----- codigo de resultado de la operacion contra la bd, si es 0=ok, en caso contrario sera un error
                    mensaje:'categorias recuperadas correctametne',
                    datos:{
                        categorias:__categorias
                    }
                }
            );

        } catch(error){
            console.log(`Error al recuperar categorias de la BD: ${error}`);
            res.status(200).send( { codigo: 1, mensaje: `Error al recuperar categorias de la BD: ${error}`, datos: { categorias:[] } } );
        }
    }
)


webServer.get('/api/Tienda/Productos', async function(req,res,next){
    try{
        console.log(`Peticion entrante: ${req.method} ${req.url}`);
        //1º paso: conectarme a la BD, usando un cliente de conexion a MongoDB: mongodb<--- driver nativo para nodejs de mongodb
        await clienteConexionMongoDB.connect();
        //2º paso: realizar la operacion contra la BD
        const _productos=await clienteConexionMongoDB.db(process.env.MONGODB_DBNAME)
                                                    .collection('productos')
                                                    .find({pathCategoria: req.query.pathCat})
                                                    .toArray();
        //3º paso: devolver la respuesta al cliente con el resultado de la operacion contra la BD
        console.log('Productos recuperados de la BD: ', _productos);
        res.status(200).send(
            {
                codigo:0, //<----- codigo de resultado de la operacion contra la bd, si es 0=ok, en caso contrario sera un error
                mensaje:'productos recuperados correctamente',
                datos:{
                    productos:_productos
                }
            }
        );
    } catch(error){
        console.log(`Error al recuperar productos de la BD: ${error}`);
        res.status(200).send( { codigo: 1, mensaje: `Error al recuperar productos de la BD: ${error}`, datos: { productos:[] } } );
    }
})


webServer.post(
    '/api/Cliente/Registro',
    async function(req,res,next){
        try{
            //en req.body la funcion middleware express.json() ha metido el objeto { nombre: '....', email: '...', password: '...'}
            //para procesarlo en este endpoint
            const { nombre, email, password } = req.body;

            //1º paso: contectarme a la BD y comprobar si ya existe un usuario con ese email, si existe --> error
            await clienteConexionMongoDB.connect();

            const _clienteExiste=await clienteConexionMongoDB.db(process.env.MONGODB_DBNAME)
                                                        .collection('clientes')
                                                        .findOne({'cuenta.emaail': email});
            if(_clienteExiste) throw new Error('Ya existe un usuario con ese email');
            
            //2º paso: si no existe, hashear la password con brcrypt.hashSync() y almacenar datos en coleccion "clientes"  de la BD
            const _resultadoInsert=await clienteConexionMongoDB.db(process.env.MONGODB_DBNAME)
                                                        .collection('clientes')
                                                        .insertOne(
                                                            {
                                                                nombre: nombre,
                                                                apellidos:'',
                                                                cuenta:{
                                                                    email: email,
                                                                    password: bcrypt.hashSync(password, 10), //<--- hash de la password con 10 rondas de sal
                                                                    activada: false,
                                                                    telefono:''
                                                                },
                                                                direcciones:[],
                                                                listaFavoritos:[],
                                                                pedidos:[]
                                                            }
                                                        );
            console.log('Resultado de la insercion en la BD: ', _resultadoInsert);
            if( ! _resultadoInsert.insertedId ) throw new Error('No se ha podido insertar el cliente en la BD');

            //3º paso: generar un JWT de uso unico (caducidad muy breve) y mandarlo por email al cliente para que 
            //         confirme su registro, para ello se puede usar un servicio de envio de emails como nodemailer, sendgrid, etc
            /*
                            ENVIO DE EMAILS CON MAILJET USANDO SU API-REST
                            https://dev.mailjet.com/openapi/openapi-mailjet/send-emails/postsendv3
                necesario:
                    - crear cuenta en mailjet.com y obtener claves publicas y privadas para usar su API-REST
                    - mandar cada vez q hagas peticion a endpoint de mailjet una cabecera de autentificacion HTTP-BASIC
                      con este formato: 
                           Authorization: Basic <base64(publicKey:privateKey)>
                    - url o endpoint a invocar por POST: https://api.mailjet.com/v3/send
                    - en body de la peticion POST hay q enviar un JSON  con este formato
                      (añadir cabecera Content-Type: application/json):

                      {
                        "FromEmail":"pilot@mailjet.com", <------ email de registro en mailjet.com
                        "FromName":"Your Mailjet Pilot", <----- nombre de registro en mailjet.com 
                        "Recipients":[
                            {
                            "Email":"passenger@mailjet.com", <---- email del cliente q esta registrando 
                            "Name":"Passenger 1" <---------------- nombre del cliente
                            }
                        ],
                        "Subject":"Your email flight plan!", <---- asunto del email
                        "Html-part":"<h3>Dear passenger, welcome to Mailjet!</h3><br />May the delivery force be with you!"
                        }


            */
            const _codeBase64MailjetKeys=Buffer.from(`${process.env.MAILJET_PUBLIC_KEY}:${process.env.MAILJET_PRIVATE_KEY}`)
                                              .toString('base64');

            const _tokenActivacion=jsonwebtoken.sign(
                { email: email, _id: _resultadoInsert.insertedId },
                process.env.JWT_SECRET,
                { expiresIn: '10m' } //<--- el token expira en 10 minutos, hay q comprobar su caducidad en el endpoint de activacion de cuenta
            );
            
            const _bodyEmail={
                        "FromEmail":"pamaruiz69@gmail.com",
                        "FromName":"Administrador de PcComponentes", 
                        "Recipients":[
                            {
                            "Email": email, 
                            "Name": nombre
                            }
                        ],
                        "Subject":"Bienvenido a PcComponentes, confirma tu registro!",
                        "Html-part":`
                            <div>
                                <h1>Bienvenido a PcComponentes, ${nombre}</h1>                                
                            </div>
                            <div>
                                <p>Gracias por registrarte en PcComponentes. Tu cuenta ha sido creada correctamente.</p>
                                <p>Para activar tu cuenta, por favor haz clic en el siguiente enlace:</p>
                                <p>
                                    enlace:
                                    <a href="http://localhost:3000/api/Cliente/ActivarCuenta?token=${_tokenActivacion}&email=${email}&idCliente=${_resultadoInsert.insertedId}">
                                        ACTIVA TU CUENTA
                                    </a>
                                    o si no funciona, copia y pega la siguiente URL en tu navegador:
                                    <br />
                                    http://localhost:3000/api/Cliente/ActivarCuenta?token=${_tokenActivacion}&email=${email}&idCliente=${_resultadoInsert.insertedId}
                                </p>                                
                            </div>
                        `
                        }                    
            
            const _peticionMailjet=await fetch(
                'https://api.mailjet.com/v3/send',
                {
                    method: 'POST',
                    headers:{
                        'Authorization': 'Basic ' + _codeBase64MailjetKeys,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(_bodyEmail) //<--- serializamos el objeto JSON a string para enviarlo en el body de la peiticion
                }
            );
            console.log('Resultado de la peticion a Mailjet: ', _peticionMailjet); //codigo respuesta, cabeceras respuesta, body respuesta
            
            const _bodyRespuestaMailjet=await _peticionMailjet.json(); //<--- deserializamos el body de la respuesta de mailjet a un objeto JS
            console.log('Body de la respuesta de Mailjet: ', _bodyRespuestaMailjet);

            if( _peticionMailjet.status !== 200 ) throw new Error(`Error al enviar email de activacion de cuenta al email: ${email}`);
            
            //4º paso: generar respuesta al cliente con el resultado de la operacion registro para q revise su bandeja de entrada
            //         y confirme su registro con el link q le hemos enviado por email
            res.status(200)
                .send(
                    {
                        codigo:0, 
                        mensaje:'Cliente registrado correctamente, revisa tu bandeja de entrada para confirmar tu cuenta'
                    }
        );
        }catch(error){
            console.log(`Error al registrar cliente en la BD: ${error}`);
            res.status(200).send( { codigo: 1, mensaje: `Error al registrar cliente en la BD: ${error}` } );
        }
    }
)

webServer.get(
    '/api/Cliente/ActivarCuenta',
    async function(req,res,next){
        try{
            //en el querystring de la solicitud por get vienen estos datos:
            // http://localhost:3000/api/Cliente/ActivarCuenta  ? token=.... & email=.... & idCliente=....
            // el middleware express.urlencoded() lo lee y lo mete en "req.query" como un objeto js: 
            // { token: '...', email: '...', idCliente: '...' }
            console.log('Datos recibidos en querystring: ', req.query);
            const { token, email, idCliente } = req.query;

            //1º paso: comprobar q el token es valido y no ha caducado, para ello usamos jsonwebtoken.verify()
            //2º paso: si el token es valido, extraer su payload y comprobar q los claims q lleva de email e idCliente
            //         coinciden con los q vienen en el querystring, si no coinciden --> error
            //3º paso: si coinciden, conectarme a la BD y actualizar el campo "cuenta.activada" del cliente a true
            //4º paso: generar respuesta al cliente con el resultado de la operacion activacion de cuenta

        } catch(error){
            console.log(`Error al activar cuenta de cliente: ${error}`);
            res.status(200).send( { codigo: 1, mensaje: `Error al activar cuenta de cliente: ${error}` } );
        }
    }
)

webServer.post(
    '/api/Cliente/Login',
    async function(req, res, next){
        try{
            //en req.body la funcion middleware express.json() ha metido el objeto { email: '....', password: '...'} 
            //para procesarlo en este endpoint
            //para probarlo en powershell: Invoke-RestMethod -Uri 'http://localhost:3000/api/Cliente/Login' -Method 'POST' -Body @{ email='neo@gmail.com'; password='Hola1234!'}

            const { email, password } = req.body;

            //1º paso: conectarme a la bd y comprobar si existe un usuario con ese email....
            //         SI NO --> error no existe usuario con ese email
            await clienteConexionMongoDB.connect();
            const _usuario=await clienteConexionMongoDB.db(process.env.MONGODB_DBNAME)
                                                        .collection('clientes')
                                                        .findOne({ 'cuenta.email': email });

            if(! _usuario) throw new Error('No existe un usuario con ese email');
            console.log('Usuario recuperado de la BD: ', _usuario);

            //2º paso: si existe, comprobar si el hash q tiene almacenado coincide con el hash usando bcrypt.compare()
            //         de la password q me ha enviado ... SI NO ---> error de password incorrecta
            // TODO: COMPROBAR tb si la cuenta esta activada, si no lo esta --> error de cuenta no activada

            if (! bcrypt.compareSync(password, _usuario.cuenta.password) ) throw new Error('Password incorrecta');
            
            //3º paso: crear JWT con los datos del usuario que me interesen preservar en la sesion y
            //         enviarselo al cliente (se podria usar una cookie, lo hacemos sin ellas) usando jsonwebtoken.sign() 
            //         y la clave secreta q tenemos en el fichero .env
            const _token=jsonwebtoken.sign(
                { email: _usuario.cuenta.email, nombre: _usuario.nombre, _id: _usuario._id },
                process.env.JWT_SECRET,
                { expiresIn: '1h' } //<--- el token expira en 1 hora, hay q comprobar su caducidad en cada peticion q haga el cliente
            );

            //4º paso: devolver al cliente un objeto JSON con el resultado de la operacion
            res.status(200).send({ codigo:0, mensaje:'login correcto', datos:{ accessToken: _token, cliente: _usuario } });

        } catch(error){
            console.log(`Error al procesar login de cliente: ${error}`);
            res.status(200).send( { codigo: 1, mensaje: `Error al procesar login de cliente: ${error}`, token:'' } );
        }
    }
);

//--------------------------------- endpoints para login con Google OAuth2.0 ---------------------------------------------
const {google}=require('googleapis'); //<--- el modulo "googleapis" exporta un objeto q asignamos a variable "google", q expone props. como google.auth.OAuth2

const oauth2Client=new google.auth.OAuth2(
    process.env.GOOGLE_OAUTH_CLIENT_ID,
    process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    'http://localhost:3000/api/Cliente/LoginGoogleCallBack' //<--- url de callback q Google llamara despues de q el usuario se autentifique
);


webServer.get('/api/Cliente/LoginGoogle',
    async function(req,res,next){
        try{
            //con las creds. de oauth2.0 obtenidas en la consola de desarrolladores de Google, generamos una url para 
            // q el usuario se autentifique con su cuenta de Google. Instalamos paquete "googleapis" para crear el cliente oauth2.0
            // y generar la url de autenticacion

            const _url=oauth2Client.generateAuthUrl(
                {
                    access_type: 'offline',
                    scope: [ //<----- info que quiero recuperar de la cuenta de google del usuario usando la API habilitada para mi proyecto
                             //para la API de Google People-API, q es la q nos permite recuperar info del usuario, necesitamos estos scopes:
                             //https://developers.google.com/people/api/rest/v1/people/get?hl=es-419#authorization-scopes
                        'https://www.googleapis.com/auth/userinfo.email',
                        'https://www.googleapis.com/auth/userinfo.profile',
                        'https://www.googleapis.com/auth/user.phonenumbers.read'
                    ]
                }
            );
            
            console.log('URL generada para login con Google OAuth2.0: ', _url);

            res.status(200).send({ codigo:0, mensaje:'login con Google generado', datos:{ url: _url } });

        } catch(error){
            console.log(`Error al procesar login con Google OAuth2.0: ${error}`);
            res.status(200).send( { codigo: 1, mensaje: `Error al procesar login con Google OAuth2.0: ${error}`} );
        }
    }
)

//este endpoint es el q Google llama despues de que el usuario se autentifique en la url q hemos generado para q introduzca sus
//credenciales....nos va a pasar por el querystring un codigo de autorizacion para poder cambiarlo por un token de acceso 
//a la API de Google: People-Api y poder recuperar los datos del usuario q se ha autentificado
//formato req.query:
/*
{
  iss: 'https://accounts.google.com',
  code: '4/0AXlqoi6SlenrEKnYzlNVB0bwhsgByErrI_gfgaGyiMfR__qlyA-kIE4xjONaradhZtVepg',
  scope: 'email profile https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email openid https://www.googleapis.com/auth/user.phonenumbers.read',
  authuser: '4',
  prompt: 'consent'
}

*/
webServer.get('/api/Cliente/LoginGoogleCallBack', 
    async function(req,res,next){
        try{
            console.log('paramatros pasados en la url desde google....', req.query);
            const { code } = req.query; //<--- codigo de autorizacion q nos pasa google en el querystring, para cambiarlo por un token de acceso a la API de Google 
            
            //--- cambiamos el codigo de autorizacion por un token de acceso a la API de Google -----
            //es un objeto de tipo GetTokenResponse en cuya propiedad "tokens" estan el accessToken + refreshToken + scopes
            //para poder hacer uso de la API de Google People-API y recuperar los datos del usuario q se ha autentificado
            
            const objetoGetTokenResponse = await oauth2Client.getToken(code); 
            //console.log('objetoGetTokenResponse: ', objetoGetTokenResponse);
            const { tokens } = objetoGetTokenResponse;
            
            // configuro el cliente de oauth2.0 con dichos tokens:
            oauth2Client.setCredentials(tokens);
            
            //ahora ya puedo hacer peticiones a la API de Google: People-API para recuperar info del usuario segun los scopes
            //q hemos habilitado en la consola de desarrolladores de Google para nuestro proyecto
            const peopleApi = google.people({ version: 'v1', auth: oauth2Client });

            const userInfo = await peopleApi.people.get({
                resourceName: 'people/me',
                personFields: 'names,emailAddresses,phoneNumbers'
            });
            console.log('=============== userInfo : ==================== ', JSON.stringify(userInfo.data));
            const datosUsuario={
                nombre: userInfo.data.names[0].displayName,
                apellidos: userInfo.data.names[0].familyName,
                cuenta:{
                    email: userInfo.data.emailAddresses[0].value,
                    password:'',
                    activada: true,
                    telefono: userInfo.data.phoneNumbers ? userInfo.data.phoneNumbers[0].value : '',
                    imagenAvatar: userInfo.data.photos ? userInfo.data.photos[0].url : ''
                },
                direcciones:[],
                favoritos:[],
                pedidos:[],
                opiniones:[]
            }

            console.log('Datos del usuario recuperados de la API de Google People-API: ', datosUsuario);
            //1º tengo q almacenar estos datos de google en mongdodb, en coleccion clientes (siempre q no exista una cuenta con ese email)    
            
            //2º generar un JWT de sesion para el usuario y devolverselo al cliente de react
            const _token=jsonwebtoken.sign(
                { email: datosUsuario.cuenta.email, nombre: datosUsuario.nombre, _id: datosUsuario._id },
                process.env.JWT_SECRET,
                { expiresIn: '1h' } //<--- el token expira en 1 hora, hay q comprobar su caducidad en cada peticion q haga el cliente
            );

            console.log('JWT generado para el usuario: ', _token);
            //3º genero respuesta con ese token y datos del usuario para q los almacene en el estado global de zustand
            
            // --- si mando asi la respuesta, un JSON PURO, el popup lanzado por el componente LoginRegistro de react
            // lo muestra tal cual....yo no quiero eso, quiero q mande ESE JSON a la ventana padre q es el comp.LoginRegistro.jsx            
            //res.status(200).send({ codigo:0, mensaje:'login con Google correcto', datos:{ cliente: datosUsuario, token:'' } });
            
            res.status(200)
                .send(`
                        <html>
                            <script>
                                window.opener.postMessage(
                                    { 
                                        codigo:0, 
                                        mensaje:'login con Google correcto', 
                                        datos:${JSON.stringify({ cliente: datosUsuario, token: _token })}
                                    },'*'
                                )
                            </script>
                        </html>`
            )
        } catch(error){
            console.log(`Error al procesar callback de login con Google OAuth2.0: ${error}`);
            res.status(200)
                .send(`
                        <html>
                            <script>
                                window.opener.postMessage(
                                    { 
                                        codigo:1, 
                                        mensaje:'login FALLIDO con Google: ${error}',
                                        datos: null
                                    },'*'
                                )
                            </script>
                        </html>`
            )            
        }
    }
)

webServer.get('/api/Tienda/Productos/:idProducto', async function (req, res, next) {
    try {
    const {idProducto } = req.params; // aqui pillaria la id del producto
    
    if(mongodb.ObjectId.isValid(idProducto)){
        return res.status(400).json({ codigo:1, mensaje:'El id del producto no es valido', datos:{ producto: null}})
    }
    await clienteConexionMongoDB.connect();
    //Pillar los datos de moongo
    const _producto = await clienteConexionMongoDB
                     .db(process.env.MONGODB_DBNAME)
                     .collection('productos')
                     .findOne({ _id: new mongodb.ObjectId(idProducto)});
    //3º comprobar que no esta vacio
    if (_producto === null) res.status(404).json({ codigo: 1, mensaje: 'No hemos encontrado el producto indicado', datos: { producto: null } })
    //4º retornar si es distinto de nulo
    res.status(200).json({codigo:0, mensaje:"producto recuperado", datos:{producto: _producto }});
    } catch (error) {
        console.log(`Error al recuperar el producto de la base de datos`)
        res.status(500).json({codigo:1, mensaje:`Error en la base de datos`, datos:{producto: null}});
    }
})



//------------------------------------ FIN CONFIG PIPELINE: miiddleware-stack de express ---------------------------------------------
webServer.listen(
    3000, //<--- puerto de escucha del servidor web, en nodejs suele ser 3000
    error => {
        if(error){
            console.log(`Error al iniciar el servidor: ${error}`);
        } else {
            console.log(`----- Servidor web iniciado en http://localhost:3000 ------`);
        }
    }
)
