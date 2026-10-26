# Desarrollo web en cliente (DWEC 0612)

Frontend: JavaScript moderno, DOM, eventos, formularios, `fetch`, SPA y React.

## Estructura

```
01-Desarrollo-web-cliente/
├── apuntes.md          # teoría general del módulo
├── apuntes/            # apuntes monográficos (React, OAuth, props…)
└── practicas/
    ├── pccomponentes-clase/   # material de partida del profesor
    ├── sandbox-front-back/    # práctica propia: React + Express
    ├── oauth-google-profe/    # referencia del profe (login Google)
    └── _legacy/               # código archivado (no se toca)
```

## Apuntes

- [`apuntes.md`](apuntes.md) — apuntes de clase: JS moderno, DOM, eventos, formularios,
  `fetch`/APIs, AJAX vs `fetch`, XSS, estado y SPA, React + Vite, Virtual DOM y componentes.
- [`apuntes/comunicacion-componentes-react.md`](apuntes/comunicacion-componentes-react.md)
  — comunicación entre componentes: padre→hijo con props.
- [`apuntes/pasar-valores-padre-hijo-react.md`](apuntes/pasar-valores-padre-hijo-react.md)
  — props y **prop-drilling**, y cómo evitarlo (Context API, Zustand…).
- [`apuntes/google-oauth-popup.md`](apuntes/google-oauth-popup.md)
  — login con Google OAuth 2.0 desde React: popup, `postMessage`, callback y cierre.

## Prácticas

| Carpeta | Qué es | Estado |
| --- | --- | --- |
| [`practicas/pccomponentes-clase/`](practicas/pccomponentes-clase) | Proyecto de partida del profesor: React + Node/Express + MongoDB | material de clase |
| [`practicas/sandbox-front-back/`](practicas/sandbox-front-back) | Sandbox: front React (Vite) + servidor Node para probar `fetch`, proxy y estado | activa |
| [`practicas/oauth-google-profe/`](practicas/oauth-google-profe) | Versión standalone del login con Google del profesor, para comparar | referencia |
| [`practicas/_legacy/PCCOMPONENTES-Nodejs/`](practicas/_legacy/PCCOMPONENTES-Nodejs) | Primera versión del backend Node de PCCOMPONENTES | archivado (no se toca) |

> **PCCOMPONENTES no está aquí.** Mi versión propia (React + Express + MongoDB) vive en
> [`zereth070-art/pccomponentes`](https://github.com/zereth070-art/pccomponentes).
> `practicas/pccomponentes-clase/` es el punto de partida del profesor y **no** se
> modifica para arreglar mi proyecto.

## Cómo arrancar las prácticas

```bash
# Sandbox (React + Vite + Express)
cd practicas/sandbox-front-back
npm install
npm run dev          # front en http://localhost:5173

# Proyecto de clase: dos partes independientes
cd practicas/pccomponentes-clase/PcCOMPONENTES-A__react
npm install && npm run dev

cd practicas/pccomponentes-clase/PcCOMPONENTES-A__nodejs
npm install && node server.js
```

## Conexión a la base de datos

La URI de MongoDB **no se escribe aquí**: va en el `.env` del proyecto, que está
en `.gitignore` y nunca se sube al repositorio. El nombre de la variable cambia según
el proyecto:

```env
# pccomponentes (mi repo) y servidor de clase usan MONGODB_*
MONGODB_URL=mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net
MONGODB_DBNAME=<base>
```

> El proyecto propio `pccomponentes` usa `MONGO_URI`; el de clase usa `MONGODB_URL` +
> `MONGODB_DBNAME`. Revisa siempre el `.env.example` o el código antes de copiar.

Si alguna vez se te ha colado una credencial en un fichero versionado, **cámbiala en
MongoDB Atlas** (Atlas → Database Access → Edit User → Reset Password). Borrar la
línea del fichero no basta: la clave sigue viva en el historial de git y en la caché
de GitHub.
