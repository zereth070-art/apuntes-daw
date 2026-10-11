# Nota de sesión — 11/10/2026

Estado al terminar. **Nada quedó roto ni a medias de forma peligrosa.**

---

## Hecho

### 1. Entorno arreglado

`npm install` fallaba con:

```
No se puede cargar el archivo C:\Program Files\nodejs\npm.ps1
porque la ejecución de scripts está deshabilitada
```

**Causa:** en PowerShell `npm` resuelve a `npm.ps1`, y la Execution Policy de Windows la bloquea.

**Solución (sin tocar la seguridad del sistema):** usar `npm.cmd`.

| Contexto | Comando |
|---|---|
| PowerShell / VS Code | `npm.cmd run dev` |
| CMD | `npm run dev` |

Las dos instalaciones se completaron:

- `PCCOMPONENTES/` (front) → 148 paquetes
- `PCCOMPONENTES/server/` (API) → 126 paquetes

### 2. MongoDB confirmado

Service `MongoDB` en estado **Running**, algo escuchando en `27017`. No hay que hacer nada.

Ojo: **Compass puede estar conectado a un cluster de Atlas mientras la API usa el Mongo local.** No son la misma cosa. `MONGO_URI` apunta a `localhost`.

### 3. `.env` creado

```powershell
Copy-Item .env.example .env
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

`JWT_SECRET` ya no es un placeholder. Confirmado que `.env` está ignorado por git
(`PCCOMPONENTES/server/.gitignore:5`).

### 4. Backend viejo archivado (no borrado)

```
react/PCCOMPONENTES-Nodejs/  →  react/_legacy/PCCOMPONENTES-Nodejs/
```

`PCCOMPONENTES-Nodejs/server.js` es la versión **monolítica** (131 líneas, un solo
fichero). `PCCOMPONENTES/server/` es la **modular** (7 ficheros separados).

**La modular es la buena. La antigua tiene 3 bugs que la nueva ya no tiene:**

- `app.listen(port, (error) => {...})` — el callback de `listen()` nunca recibe
  argumentos. Los errores llegan al evento `error`.
- `.env` con `JSW_SECRET` en vez de `JWT_SECRET` → `undefined` al firmar tokens.
- Ruta de prueba `GET /api/auth/register` que devuelve un string.

**Se conserva porque los comentarios sobre el pipeline de Express siguen siendo
válidos** (ver tabla de equivalencias abajo).

---

## El mapa del backend

8 ficheros, un trabajo cada uno.

| Fichero | Trabajo | ¿Toca Mongo? | En Spring sería |
|---|---|---|---|
| `index.js` | Arranca todo **en orden** | sí | `main()` |
| `config/db.js` | Conectar con Mongo | sí | datasource |
| `app.js` | Orden de la tubería de middlewares | no | `SecurityFilterChain` |
| `routes/auth.js` | Login y registro | sí | `AuthController` |
| `routes/categorias.js` | Listar categorías | sí | `CategoriaController` |
| `middleware/validaciones.js` | Validar entrada | **no** | Bean Validation |
| `models/Usuario.js` | Esquema del usuario | define | `@Entity User` |
| `models/Categoria.js` | Esquema de categoría | define | `@Entity Categoria` |

### Orden de arranque (en `index.js`)

```js
import "dotenv/config";            // 1. lee el .env — va primero porque TODO usa process.env
await conectarDB(MONGO_URI);       // 2. conecta ANTES de escuchar
await mongoose.syncIndexes();      // 3. convierte unique:true en índice real
crearApp().listen(PORT);           // 4. ahora sí escucha
```

El orden importa: si `listen()` fuera antes, aceptarías peticiones sin base de datos.

### Orden de la tubería (en `app.js`)

```js
app.use(express.json());                    // 1. body JSON -> req.body
app.use(express.urlencoded({extended:true}));// 2. formularios -> req.body
app.get("/api/health", ...);                // 3.
app.use(routerAuth);                        // 4. rutas
app.use(routerCategorias);                  // 5. rutas
app.use(404);                               // 6. después de las rutas
app.use(handlerDeErrores);                 // 7. SIEMPRE el último
```

El handler de errores tiene **4 parámetros** `(err, req, res, _next)`. Esa firma es
lo que le dice a Express "esto es un middleware de error, no uno normal". Sin el
cuarto parámetro, Express lo ignora.

---

## Lo pendiente: el circuito del token

### Situación actual

`LoginRegistro.jsx:119` hace:

```js
localStorage.setItem("token", data.token);
```

**Es la ÚNICA línea de todo `src/` que toca un token.** Se guarda y nunca se usa.
Falta: leerlo → mandarlo → que el servidor lo valide → logout.

### Fichero empezado

`src/utils/apiFetch.js` — a medio hacer:

```js
export async function apiFetch(ruta, opciones = {}, res) {   // <- "res" sobra, sobra
  const token = localStorage.getItem("token");   // ✓ correcto
  const headers = { ...(opciones.headers ?? {}) }; // ✓ correcto — copia sin mutar
  if (token) {
    headers.Authorization = `Bearer ${token}`;   // ✓ correcto
  }
  // FALTA: el fetch, el 401, y el return
}
```

### Lo que falta

1. El `fetch` con `{ ...opciones, headers }` (headers ya，包含 el token).
2. Si `res.status === 401` → borrar el token del `localStorage`.
3. `return` de la respuesta.

**Importante:** `apiFetch` NO devuelve un error. Reenvía la `Response` tal cual.
Solo limpia el token muerto y deja pasar la respuesta. Quien llama sigue
decidiendo qué mostrar (como ya hace `LoginRegistro.jsx` con su `if (!res.ok)`).

### Sobre el 401 (no es 400)

| Código | Significado | Quién lo sufre |
|---|---|---|
| 400 | "Los datos no tienen sentido" (email inválido, faltan campos) | el usuario se equivocó |
| **401** | **"No sé quién eres"** (token caducado, credenciales malas) | el token venció |
| 500 | Fallo mío | el servidor |

`auth.js` ya usa los dos: `err.status = 400` en validaciones, `httpError(401, ...)`
en login fallido.

### Luego, en el Header

- Mostrar "Hola, {nombre}" si hay sesión.
- Botón de logout: borrar token + navegar.

---

## Traducción Node → Spring (para no perder el hilo)

| En Node | En Spring Boot | Equivalente |
|---|---|---|
| `models/Usuario.js` | `@Entity class User` | ya hecho |
| `routes/auth.js` | `@RestController AuthController` | — |
| `middleware/validaciones.js` | `@Valid` + `@NotBlank` + `@Email` | — |
| `app.js` (orden) | `SecurityFilterChain` | — |
| handler de errores | `@RestControllerAdvice` | vacío en pomodorozion |
| `select: false` en password | `UserDTO` sin el hash | ya existen DTOs |
| `jwt.sign()` | `JwtAuthFilter` + `JWTGenerator` | falta |
| bcrypt + SALT_ROUNDS | `PasswordEncoder` | — |

**Este es el puente que faltaba.** Son el mismo sistema en dos idiomas.

---

## Vulnerabilidades (no urgente)

`npm audit` reporta 2–3 "high severity". La cadena es:

```
nodemon (devDependency) -> chokidar -> braces
```

**Las tres están fuera de producción.** `nodemon` solo está en tu máquina mientras
programas; no se instala al desplegar. `express`, `mongoose` y `bcryptjs` (los que
sí usan los usuarios) **no aparecen**.

En el server npm ofrece `npm audit fix` **sin `--force`**. En el front pide
`--force`, que **rompe cosas** — no lo corras a ciegas.

Pendiente: `npm.cmd audit fix` en el server cuandoltk闭合.

---

## Pendientes que se detectaron de paso

- `ProductosCat.jsx:10` — `const [catComponentes] = useParams()`:
  `useParams()` devuelve un objeto, no un array. Siempre `undefined`.
- `ProductosCat.jsx:13` — `console.log` de depuración dentro del render.
- `OffCanvasCats.jsx:31` — `window.alert()` de depuración.
- `OffCanvasCats.jsx` — el offcanvas nunca se cierra al navegar (SPA).
- 2 de 6 proyectos Java no compilan (`Simpsons`, `login-spring`).
- `10-Proyectos/pomodorozion`: **0 relaciones JPA** (ni `@ManyToOne` ni `@OneToMany`).
  Usa `Long userId`. De ahí viene el hueco de `LAZY`/`EAGER` — no es olvido,
  es un tema que nunca se cruzó.
- El README raíz tenía una cadena de MongoDB con `<db_password>`. **Ya está
  fuera del fichero.** Sigue en el historial (commit `209a336`) y en GitHub.
  Era un placeholder, no una contraseña real, así que no corre prisa.

---

## La regla que funciona

```powershell
pwd      # dónde estoy
gci      # qué hay aquí
```

Sirve para no perder 5 minutos buscando un fichero en la carpeta equivocada.
Hoy `.env.example` estaba un nivel más abajo (`server/`).

---

## Para la próxima sesión

1. Terminar `apiFetch.js` (3 líneas).
2. Probarlo en `OffCanvasCats.jsx` (las peticiones más simples).
3. Header con "Hola, {nombre}" + logout.
4. Después: traducir el circuito a Java (`JwtAuthFilter`, `SecurityConfig`) →
   eso es RA4 y RA7.

---

## Una nota personal

No es trivial lo de hoy. El salto de monolito a 7 módulos separados es un cambio
de arquitectura real, y reprocesarlo dacomes con sensación de no entender nada.
Esa sensación es el coste, no la medida de lo que sabes.

`git log` sobre `10-Proyectos/` muestra un proyecto Spring Boot completo con
entidades, repositorios, `SecurityConfig`, DTOs, tests y WebSockets. Eso ya
está escrito. Es terreno conocido.