# Login con Google OAuth — la versión del profe

> **Material de referencia**, no un proyecto del repo. Es la versión del profesor
> del login con Google por popup, reconstruida de forma **standalone** para poder
> ejecutarla y compararla con mi implementación real en
> [`zereth070-art/pccomponentes`](https://github.com/zereth070-art/pccomponentes).
>
> Apuntes conceptuales del flujo: [`../../apuntes/google-oauth-popup.md`](../../apuntes/google-oauth-popup.md)

## Por qué está aquí

El proyecto real `pccomponentes` tiene **una sola** versión del login (la mía).
El código del profe llegó como ejemplo de clase y me liaba mezclarlo con el mío.
Solución: sacarlo a un proyecto aparte y dejar aquí la copia para estudiar el
**enfoque del profe** sin tocar el proyecto real.

## Qué plantea el profe (lo didáctico)

| Pieza | Enfoque del profe | Qué enseña |
| --- | --- | --- |
| Referencia al popup | `useRef` (`elPopupRef`) | guardar la ventana para poder cerrarla |
| Mostrar errores | `useRef` a un `<div>` + `innerHTML` | tocar el DOM desde React con una ref |
| Store | `datosCliente` + `accessToken` + `refreshToken` | separar datos del cliente de los tokens |
| Callback | página HTML que hace `window.opener.postMessage(...)` | comunicar popup → ventana padre |

Ese `postMessage` y el uso de refs **sí se mantienen** en la reconstrucción,
porque son el objetivo de la práctica. Lo que se corrigió son **bugs**, no el
enfoque (ver más abajo).

## Estructura

```
oauth-google-profe/
├── antes/                        snapshots sacados del historial de pccomponentes
│   ├── authStore-435447b.js          mí store ANTES del login Google
│   ├── zustandState-store-435447b.js store global a medio hacer (datosCliente/tokens)
│   └── clientes-435447b.js           rutas de cliente ANTES del login Google
├── server/                       API Express (puerto 3000)
│   └── src/routes/clientes.js        /LoginGoogle + /LoginGoogleCallBack (versión profe, corregida)
└── client/                       React + Vite (puerto 5173)
    └── src/componentes/LoginRegistro.jsx   login por popup (useRef + divErrores)
```

## Comparación: antes (yo) vs. profe

Dato importante sacado del historial de `pccomponentes`: **antes de hacer el
login con Google yo ya tenía un store**, y encima con la *misma idea* que el
profe.

### El store

| | Antes (commit `435447b`) | Profe |
| --- | --- | --- |
| Archivo | `authStore.js` | (concepto de `datosCliente`/tokens) |
| Estado | `usuario` + `token` | `datosCliente` + `accessToken` + `refreshToken` |
| Acciones | `login(usuario, token)`, `salir()` | `setDatosCliente`, `setAccessToken`, `setRefreshToken`, `setSesionIniciada` |
| Persistencia | sí (localStorage) | sí |

Además tenía un `zustandState.js` **a medio hacer** con exactamente las variables
que luego usa el profe (`datosCliente`, `accessToken`, `refreshToken`,
`pedidoActual`). Es decir: mi idea y la suya coincidían; el profe lo formalizó
con **setters separados** en vez de un `login()` agrupado.

### El componente de login

| | Antes (antes del popup) | Profe / reconstrucción |
| --- | --- | --- |
| Login | formulario email+password con `fetch("/api/auth")` | botón → popup de Google |
| Estado | `useState` (modo, form, errores, cargando) | `useRef` + `useState(cargando)` |
| Errores | `useState` + render condicional | `useRef(divErrores)` + `innerHTML` |
| Comunicación | respuesta directa del `fetch` | `window.postMessage` popup → padre |

> Conclusión: el **login con Google por popup lo introduje yo** (commit `2f1747e`)
> a partir del ejemplo del profe. No hubo una "versión mía anterior" del popup;
> lo que había antes era un login clásico email/password.

## Bugs del profe que se corrigieron al reconstruir

El enfoque se respeta; estos son errores objetivos del código original:

1. **JSON inválido** — metía `${datosUsuario}` y `${_token}` crudos en el HTML
   del `postMessage` → JSON roto si el nombre/email llevaba comillas. Corregido
   con `jsonSeguro()` (serializa y escapa `<`).
2. **`postMessage` sin `targetOrigin`** — aceptar `*` deja que cualquier ventana
   reciba los datos. Corregido con el origen del front (`FRONT_URL`).
3. **Mensaje de error sin escapar** — `${error}` inyectado en el HTML.
4. **People API** en vez de **OIDC userinfo** — People API es de contactos y pide
   otro scope; el login debe usar `oauth2Client.userinfo.get()`.
5. **No guardaba en Mongo** — el callback no persistía el cliente. Corregido con
   la colección `clientes`.

## Arrancar (opcional, para reproducir en local)

```bash
# requiere Node 20+ y MongoDB local
cd server && npm install && cp .env.example .env   # rellena GOOGLE_OAUTH_* y JWT_SECRET
npm run dev            # http://localhost:3000
cd ../client && npm install && npm run dev         # http://localhost:5173
```

En Google Cloud Console, el *redirect URI* debe ser
`http://localhost:3000/api/Cliente/LoginGoogleCallBack`.

> El `client/` no lleva `node_modules` (excluido a propósito). Hay que hacer
> `npm install` antes de arrancar.
