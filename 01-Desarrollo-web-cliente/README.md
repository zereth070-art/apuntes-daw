# Desarrollo web en cliente (DWEC 0612)

Frontend: JavaScript moderno, DOM, eventos, formularios, `fetch`, SPA y React.

## Apuntes

- [`apuntes.md`](apuntes.md) — apuntes de clase: JS moderno, DOM, eventos, fetch/APIs,
  AJAX vs `fetch`, XSS, estado y SPA, React + Vite, Virtual DOM y componentes.
- [`react/apuntes/comunicacion-componentes-react.md`](react/apuntes/comunicacion-componentes-react.md)
  — comunicación entre componentes: padre→hijo con props.
- [`react/apuntes/pasar-valores-padre-hijo-react.md`](react/apuntes/pasar-valores-padre-hijo-react.md)
  — props y **prop-drilling**, y cómo evitarlo (Context API, Zustand...).

## Prácticas / proyectos

| Carpeta | Qué es | Estado |
| --- | --- | --- |
| [`react/sandbox-front-back/`](react/sandbox-front-back) | Sandbox de práctica: front React (Vite) + servidor Node, para probar fetch/estado | activa |
| [`react/_legacy/PCCOMPONENTES-Nodejs/`](react/_legacy/PCCOMPONENTES-Nodejs) | Versión archivada del backend Node de PCCOMPONENTES | archivado (no se toca) |

> **PCCOMPONENTES** (React + Express + MongoDB) ya no vive en este repo:
> tiene el suyo propio, [`zereth070-art/pccomponentes`](https://github.com/zereth070-art/pccomponentes).

## Conexión a la base de datos

La URI de MongoDB Atlas **no se escribe aquí**: va en el `.env` del proyecto, que está
en `.gitignore` y nunca se sube al repositorio.

```env
# .env  (NO SUBIR)
MONGO_URI=mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/<base>
```

Si alguna vez se te ha colado una credencial en un fichero versionado, **cámbiala en
MongoDB Atlas** (Atlas → Database Access → Edit User → Reset Password). Borrar la
línea del fichero no basta: la clave sigue viva en el historial de git y en la caché
de GitHub.
