# Login con Google OAuth 2.0 (flujo con popup)

> Práctica de referencia: PCCOMPONENTES — [`zereth070-art/pccomponentes`](https://github.com/zereth070-art/pccomponentes)
> (`server/src/routes/clientes.js`, `src/Componentes/zonaCliente/login/LoginRegistro.jsx`)

> Versión del profesor, reconstruida aparte para comparar: [`../practicas/oauth-google-profe/`](../practicas/oauth-google-profe/)
> (incluye snapshots de mi código *antes* de hacer el login con Google, en `antes/`).

## La idea en una frase

El login normal es un `fetch` que va y vuelve. Con Google **hay que salir fuera** (a
`accounts.google.com`) para que el usuario se autentique, y luego volver. Eso no se puede
con un `fetch` normal: se hace con una **ventana popup**.

## Dos conceptos previos: callback y los dos tokens

### ¿Qué es un callback?

Un **callback** (literalmente *call back* = "volver a llamar") es **la dirección de tu web
a la que otro servicio te devuelve cuando termina su trabajo**. En OAuth es la
**`redirect_uri`** o *callback URL*.

Símil del teléfono de vuelta:

> Tú → Google: "quiero loguear a este usuario".
> Google: "vale, pero el usuario tiene que interactuar conmigo. Cuando termine, ¿a dónde
> le mando de vuelta?".
> Tú: "a `http://localhost:3000/api/Cliente/LoginGoogleCallBack`".
> Google: "apuntado".

Google **no puede** devolverte el resultado al navegador directamente, porque el navegador
está en **su** página (`accounts.google.com`). Por eso necesita saber a qué URL **tuya**
redirigir. Esa URL es el callback.

> Ojo: en OAuth "callback" es una **URL / endpoint**, no una función JS. El nombre viene
> del concepto original ("función que vuelve a llamar"), pero aquí significa "dirección a
> la que me devuelven".

### Los DOS tokens (la clave que se confunde)

**Google no te da ya tu token de sesión.** Te da un **código** y tú lo cambias por un
token. Es un paso de más, por seguridad.

| Momento | Qué recibes | Para qué sirve |
| --- | --- | --- |
| Google vuelve al callback | un **`code`** (no el token aún) | un "vale" temporal, de un solo uso |
| Tu backend lo canjea con Google | un **access token** de Google | consultar los datos del usuario |
| Tu backend lo fabrica | **tu token de sesión** (`firmarToken`) | el que usa tu app después |

```
Google --> tu callback:  ?code=ABC123   (vale de usar y tirar)
tu backend --> Google:   "toma el code ABC123, dame el token"
Google --> tu backend:   access_token    (ahora sí puedo consultar datos)
tu backend --> Google:   userinfo.get()  "¿quién es?"
Google --> tu backend:   email, nombre...
```

**¿Por qué este paso extra?** Para que el token real **nunca pase por el navegador** (el
sitio menos seguro). El canje `code` → token lo hace el **servidor**, en una conversación
servidor↔servidor que el usuario no ve.

**El callback es tu oportunidad de recuperar el control:** ahí Google "suelta la pelota",
y tú decides qué hacer: crear la sesión, avisar a la ventana principal y cerrar el popup.

## Paso a paso (qué pasa desde que el usuario hace clic)

### 1. El usuario hace clic en "Iniciar sesión con Google"

En el botón hay un `onClick`. Lo **primero** que hace es abrir el popup, **en blanco**:

```js
const popup = window.open("", "popupGoogle", "width=600,height=600");
```

> **Por qué en blanco y por qué primero:** el navegador solo deja abrir ventanas si el
> clic es "reciente". Si esperáramos al `fetch` (que tarda) para abrir el popup, el
> navegador lo consideraría automático y **lo bloquearía**. Así que abrimos ya, vacío, y
> lo rellenamos después.

### 2. Se le pide al backend la URL de Google

```js
const respuesta = await fetch("/api/Cliente/LoginGoogle");
const datos = await respuesta.json();
popup.location.href = datos.datos.url;   // el popup VIAJA a Google
```

El backend construye esa URL con tus credenciales de Google Cloud (Client ID, Secret,
Redirect URI) y los "scopes" que pides (email y perfil).

### 3. El popup va a Google

En el popup (la ventana pequeña) aparece la pantalla de Google: el usuario elige su
cuenta y acepta los permisos. Esto pasa **fuera de tu web**, en el popup.

### 4. Google redirige de vuelta a TU callback

Cuando el usuario acepta, Google manda el popup a tu URL de callback:

```
/api/Cliente/LoginGoogleCallBack?code=XXXX
```

Ese `code` es un "vale" de un solo uso. El backend lo **canjea por un token**:

```js
const { tokens } = await oauth2Client.getToken(code);
```

### 5. El backend pregunta "¿quién es este?"

Con el token, pide a Google los datos del usuario:

```js
const { data } = await oauth2Client.userinfo.get();  // trae email, nombre...
```

Con ese email, busca al usuario en la base de datos (el **mismo modelo** que el login
normal). Si no existe, lo crea; si existe, lo reutiliza. Al final **firma su propio token
de sesión** (el mismo que emite `/api/auth/login`).

### 6. El callback devuelve una página diminuta que SÍ se ejecuta en el popup

Aquí está la clave del cierre. El backend **no** devuelve JSON, devuelve un HTML pequeñito:

```html
<script>
  if (window.opener) {
    window.opener.postMessage(datos, frontUrl);   // le pasa el token a la ventana principal
  }
  window.close();                                  // se cierra solo
</script>
```

- `window.opener` = la ventana que abrió el popup (tu app).
- `postMessage(datos, frontUrl)` = manda el token a la ventana principal.
- `window.close()` = el popup se cierra.

### 7. La ventana principal recibe el token

En el componente hay un `useEffect` que **escucha** mensajes:

```js
window.addEventListener("message", (evento) => {
  if (evento.origin !== window.location.origin) return;   // seguridad
  if (evento.data?.tipo === "google-login") {
    login(evento.data.usuario, evento.data.token);         // guarda sesión
    navigate("/");
  }
});
```

En cuanto llega el mensaje, guarda la sesión (Zustand) y entra a la app.

## El dibujo del ciclo completo

```
[Ventana principal]                          [Popup]
        |                                        |
   clic en botón ---> abro popup vacío --------->|
        |                                        |
   pido URL a /LoginGoogle                       |
        |                                        |
   popup.location = URL de Google -------------->|  va a Google
        |                                        |  usuario elige cuenta
        |                                        |  Google redirige al callback
        |                            backend canjea code -> token
        |                            backend firma token de sesión
        |<---- postMessage(token) ---------------|
   guardo sesión + entro                 window.close() (se cierra solo)
```

## Las dos piezas que hay que entender de verdad

### a) `postMessage` — hablar entre ventanas

Las ventanas no comparten variables. `postMessage` es el **único canal seguro** para
mandarse datos. Siempre lleva el **origen destino** como segundo argumento
(`frontUrl`), para que solo tu web pueda recibirlo.

En el receptor se comprueba al revés:

```js
if (evento.origin !== window.location.origin) return;   // descarto orígenes ajenos
```

Sin esa comprobación, **cualquier página de internet** podría mandarte un token falso y
colarte una sesión inventada.

### b) `window.close()` — quién cierra el popup

**Google nunca cierra el popup.** El ciclo termina en **tu callback**, que es quien
ejecuta `window.close()`. Por eso "cierras tú": la última parada es una página tuya, no
de Google.

## Mejora: cerrar cuando TÚ quieras (handshake / ack)

En el código actual el popup hace `postMessage` y `window.close()` **casi a la vez, sin
esperar**. Es una carrera: `postMessage` es asíncrono y, en casos raros, cerrar de
inmediato podría cortar la entrega. Además, si la ventana principal tarda (guardar
sesión), el popup ya no existe.

**Solución:** que el popup **espere** a que la principal le confirme que recibió el token.

**Popup** (espera antes de cerrar):

```js
window.opener.postMessage(datos, frontUrl);

window.addEventListener("message", (e) => {
  if (e.origin !== frontUrl) return;
  if (e.data?.tipo === "google-login-ack") window.close();
});

setTimeout(() => window.close(), 3000);   // red de seguridad: si no responden, cierro igual
```

**Ventana principal** (confirma al recibir):

```js
if (evento.data?.tipo === "google-login") {
  login(evento.data.usuario, evento.data.token);
  evento.source.postMessage({ tipo: "google-login-ack" }, window.location.origin);
  navigate("/");
}
```

- **`evento.source`** = referencia directa a la ventana que envió el mensaje (el popup).
  Más limpio que `window.opener`: responde por el canal por el que le llegó.
- **`setTimeout` de seguridad**: si la principal falla o no contesta, el popup no se
  queda **colgado** para siempre en pantalla.

## Seguridad: dos fallos a evitar

1. **XSS al inyectar el JSON en el `<script>`.** `JSON.stringify` **no escapa el `<`**.
   Si el nombre de Google de un usuario trae `</script>`, cierra el bloque y lo siguiente
   se ejecuta como código. Se arregla escapando:
   ```js
   JSON.stringify(obj).replace(/</g, "\\u003c");
   ```
2. **`postMessage` sin comprobar origen.** En ambos lados se valida
   `evento.origin` antes de hacer nada.

## Resumen para recordar

1. Clic → abro popup vacío (sincrónico, o lo bloquea el navegador).
2. Pido la URL de Google al backend.
3. El popup va a Google, el usuario acepta.
4. Google vuelve a mi callback con un `code`.
5. El backend canjea el `code`, pregunta quién es y **firma un token de sesión**.
6. El callback devuelve un HTML que hace `postMessage(token)` y `window.close()`.
7. La ventana principal escucha, valida el origen, guarda la sesión y entra.

> Quién cierra el popup: **yo**, en el callback. Google solo es una parada en medio.
