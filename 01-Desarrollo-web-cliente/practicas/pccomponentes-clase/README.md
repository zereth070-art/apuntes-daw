# PCCOMPONENTES — versión de clase

Código de partida del profesor para replicar la tienda de componentes en clase.
**No es mi proyecto**: mi implementación propia vive en
[`zereth070-art/pccomponentes`](https://github.com/zereth070-art/pccomponentes).

Se conserva aquí como referencia para comparar decisiones (estructura, autenticación,
estado global, llamadas al backend). **No se modifica** para arreglar el proyecto propio:
si algo hay que cambiar, se cambia en `pccomponentes`.

## Qué contiene

```
pccomponentes-clase/
├── PcCOMPONENTES-A__react/    # front React 19 + Vite + React Router + Zustand
└── PcCOMPONENTES-A__nodejs/   # back Node + Express 5 + driver nativo de MongoDB
```

- El front tiene las zonas de tienda y cliente, el header con offcanvas de categorías y
  los slices de Zustand (`CarritoSlice`, `ClienteSlice`, `SesionSlice`).
- El back es un `server.js` único con el login/registro por cookies, Google OAuth y las
  consultas a MongoDB con el driver nativo (sin Mongoose).

## Cómo arrancarlo

Cada parte se instala y se ejecuta por separado.

```bash
# Front
cd PcCOMPONENTES-A__react
npm install
npm run dev            # http://localhost:5173

# Back (en otra terminal)
cd PcCOMPONENTES-A__nodejs
npm install
node server.js         # http://localhost:3000
```

El backend lee la configuración de un `.env` **que no está en el repo**:

```env
MONGODB_URL=mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net
MONGODB_DBNAME=<nombre-de-la-base>
```

Si no tienes esas variables, el servidor no conecta con MongoDB y las rutas de datos
fallan. No subas el `.env` al repositorio.

## Estado

Material de clase, sin mantener. Los `package-lock.json` se conservan para que la
instalación sea reproducible. Las diferencias con mi versión propia son intencionadas:
sirven para estudiar, no para fusionar.
