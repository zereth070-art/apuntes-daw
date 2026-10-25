# Sandbox: conectar un front React con un backend Express

Sandbox mínimo para entender **qué hace falta** para que el front de React de
PCCOMPONENTES hable con un backend Node, comparado con lo que ya hiciste en
`PCCOMPONENTES-Nodejs`.

## Las 3 piezas

```
                    (1) proxy                    (3) respuesta
NAVEGADOR  ------------------>  VITE (5173)  ------------------->  EXPRESS (3001)
   |                 /api/*           |      /api/*                     |
   +--- fetch(RUTA RELATIVA) <--------+                                  +--- Mongo
```

1. **Front** (raíz): `fetch("/api/auth/register")`. La ruta es **relativa**,
   sin `http://localhost:3001`. Si fuera absoluta, el navegador haría CORS y
   esto no funcionaría (o haría falta el middleware `cors`).
2. **Proxy** (`vite.config.js`): Vite ve que la petición empieza por `/api` y
   la **reenvía desde el propio servidor de Vite** al `target`. Como el
   navegador solo habla con Vite (mismo origen), **no hay CORS**. El `target`
   tiene que ser el mismo puerto que use `server/server.js`.
3. **Back** (`server/server.js`): Express con **las rutas y la forma del JSON
   que el front ya espera**. Sin esto, el front recibe algo que no sabe pintar.

## El contrato (lo importante de verdad)

El front de PCCOMPONENTES ya está escrito para esperar estas rutas y formas:

| Ruta | Método | Body que manda | Respuesta OK | Error |
|---|---|---|---|---|
| `/api/auth/register` | POST | `{ nombre, email, password }` | `201` `{ ok, usuario, token }` | `409` `{ error: { codigo, mensaje } }` |
| `/api/auth/login` | POST | `{ email, password }` | `200` `{ ok, usuario, token }` | `401` `{ error: { codigo, mensaje } }` |
| `/api/categorias` | GET | — | `200` `[ { slug, nombre } ]` | — |
| `/api/health` | GET | — | `200` `{ ok: true }` | — |

Mira `LoginRegistro.jsx` del proyecto real: hace `if (!res.ok) throw new
Error(data.error?.mensaje)` y luego `localStorage.setItem("token", data.token)`.
**Esa forma es el contrato.**

## Comparación con tu sandbox de clase

Tu `PCCOMPONENTES-Nodejs` ya hace lo mismo **en la lógica** (duplicado →
hashear → insertar), pero con **otras etiquetas**:

| Clase (`PCCOMPONENTES-Nodejs`) | Contrato front (`sandbox-front-back`) |
|---|---|
| `POST /api/Cliente/Registro` | `POST /api/auth/register` |
| `GET /api/Tienda/Categorias` | `GET /api/categorias` |
| Responde `200` con `{ codigo: 0\|1, mensaje }` | Responde `201/409/401` con `{ ok, error }` |
| El cliente del email se guarda en `clientes.cuenta` | Usuario plano en `usuarios` |

Por eso "el sandbox de clase no le sirve al front tal cual": no es la lógica,
es **el nombre de las rutas + la forma del JSON** (los códigos HTTP y dónde se
guarda cada dato ya son detalles aparte).

## Cómo arrancarlo (dos terminales)

Solo hay que instalar dependencias en dos sitios y tener Mongo levantado:

```
npm install        # terminal 1 (raíz) y terminal 2 (server/)
npm run dev        # terminal 1 -> Vite en http://localhost:5173
npm run dev        # terminal 2 -> { server/ } Express en http://localhost:3001
```

Abre `http://localhost:5173`, abre **DevTools > Network**, y mira cada fetch:
primero llama a Vite (`/api/auth/register`) y dentro verás el reenvío
(proxy) al 3001.

## Ejercicio para comprobar que lo has entendido

1. Cambia el puerto del backend a `3002` **solo** en `server/server.js`. ¿Qué
   pasa cuando recargas el front? ¿Por qué? Arreglalo sin tocar el front.
2. Añade `GET /api/health` a `server.js` por tu cuenta (ya está, mira el
   código) y un botón en `App.jsx` que lo llame y pinte el `{ ok }`.
3. Mira el caso real: `GET /api/categorias` aquí devuelve un array fijo. En
   `PCCOMPONENTES/server` sale de Mongo (`src/seed/categorias.seed.js`).
   ¿Qué cambia en el front si el back para de devolver array?

## Fuera de alcance (a propósito)

- No hay `.env` ni `cookie-parser`: el front solo manda JSON y el proxy ya
  evita CORS. Se añaden cuando de verdad hagan falta.
- No hay categorías en Mongo: es un array fijo para reducir piezas.
- No hay login que pida el token en `Authorization: Bearer`: ese es el
  siguiente paso natural (auth de verdad), no el objetivo de este sandbox.