# Nota de sesión — 19/10/2026

Arreglo del cierre de sesión en el `401` y limpieza de `ProductosCat`.
**Nada quedó roto: los 13 casos probados pasan.**

---

## 1. El bug de partida: dos fuentes de verdad para la sesión

La sesión se guardaba **en dos sitios a la vez**:

| Dónde | Qué guarda | Quién lo lee |
|---|---|---|
| `localStorage` | `"usuario"`, `"token"` | `apiFetch.js` |
| Zustand (`authStore`) | `{ usuario, token }` | `Header.jsx` |

Los dos se sincronizaban al hacer `login()` y al hacer `salir()`, pero **no** cuando el
servidor decía "ya no vales":

```js
// ANTES — apiFetch.js
if (res.status === 401) {
  localStorage.removeItem("token");   // borraba SOLO el token
}
// El store seguía con el usuario dentro → la cabecera decía "Hola, javier"
```

**Cómo se veía:** token caducado → el menú de categorías empezó a fallar con el mensaje
rojo → pero arriba seguía la bienvenida y el botón "Salir". La web te mentía y no había
forma de enterarte salvo mirando la consola.

**Causa raíz:** dos fuentes de verdad para el mismo dato, sincronizadas solo en dos de
los tres momentos posibles.

### Cómo reproducirlo en 30 segundos

1. Logueado, con la app abierta
2. Consola: `localStorage.removeItem("token")`
3. Sin recargar, pulsar una categoría

→ El menú da error, la cabecera sigue con "Hola, javier".

> El síntoma estaba en un componente (`Header`) y la causa en otro fichero entero
> (`routes/categorias.js`, el `requiereAuth`). **Cuando un componente "no muestra datos",
> la causa casi nunca está en ese componente.**

---

## 2. `apiFetch` habla con el store: `getState()`

`apiFetch.js` **no es un componente**, así que no puede usar hooks. De ahí que siga
funcionando. Dos formas de tocar un store de Zustand:

| Forma | Dónde funciona |
|---|---|
| `useAuthStore((e) => e.salir)` | Solo dentro de un componente React |
| `useAuthStore.getState()` | **En cualquier sitio** |

Y `getState()` hay que encadenarla en **tres niveles**, porque el último son los paréntesis:

```js
useAuthStore.getState()          // el estado entero: { usuario, token, login, salir }
useAuthStore.getState().salir    // la función, sin ejecutar
useAuthStore.getState().salir()  // la EJECUTA
```

Sin los paréntesis no cierras la sesión: solo dices "sé dónde está la función".

**Además**, `salir()` ya limpia `localStorage` por dentro, así que el `removeItem`
de `apiFetch` era redundante. Cada cosa en su capa: `apiFetch` **no debería saber nada**
del `localStorage`.

---

## 3. Leer un cuerpo que no es JSON: `.catch(() => null)`

En `LoginRegistro.jsx` se leía el cuerpo **antes** de comprobar si la respuesta fue buena:

```js
// ANTES
const data = await res.json();        // ← si el cuerpo es HTML (servidor caído), REVIENTA
if (!res.ok) throw new Error(data.error?.mensaje ?? "Error inesperado");
```

El `catch` de abajo recogía un `SyntaxError` técnico y lo pintaba tal cual:
`Unexpected token '<', "<!DOCTYPE "...`. El error real se perdía siempre.

```js
// DESPUÉS
const data = await res.json().catch(() => null);
if (!res.ok) {
  throw new Error(data?.error?.mensaje ?? "No hemos podido conectar con el servidor");
}
```

Solo cambian dos cosas:

| Cambio | Por qué |
|---|---|
| `.catch(() => null)` | Si no se puede leer, no se muere; te da `null` |
| `data?.` | Porque ahora `data` **puede ser `null`** y `null.error` revienta |

Y el mensaje por defecto pasó de `"Error inesperado"` (que no explica nada) a
`"No hemos podido conectar con el servidor"` (que sí dice qué hacer).

### `.catch()` va en el fallo, no en el éxito

```js
p.then(valor => { /* se cumplió → aquí el ÉXITO */ })
 .catch(error => { /* falló → aquí el PLAN B */ })
```

Poner el mensaje del servidor dentro del `.catch()` es como llevar el paraguas
encima cuando hace sol.

---

## 4. Un cuerpo HTTP solo se lee **una vez**

Para distinguir por qué un `401` hay que leer el cuerpo... pero quien viene detrás
también lo necesita (para pintar el mensaje). Y leerlo lo consume.

```
res ──┬─── original   → lo lee LoginRegistro
      └─── copia      → la lee apiFetch para mirar el codigo
```

**`clone()` reparte los datos, no los resucita.** Funciona porque en ese instante los
bytes **siguen en memoria**, sin leer. Cada copia tiene su propio flujo independiente.

| Regla | |
|---|---|
| ✅ | `await res.clone().json()` — antes de leer, tanto da cuántas veces quieras |
| ❌ | Clonar **después** de leer → `Response body is already used` |

Este es el fallo que funciona en tu prueba y se rompe dos meses después, cuando alguien
añade un `await res.json()` arriba y no se da cuenta.

---

## 5. La decisión: leer el `codigo` en vez de inventar la regla

Aquí no hubo que decidir nada: **el backend ya distinguía**. Costaba leerlo.

| Situación | Status | `error.codigo` | ¿Cerrar sesión? |
|---|---|---|---|
| Contraseña incorrecta | `401` | `CREDENCIALES` | **No** — estás intentando *entrar* |
| Token caducado | `401` | `TOKEN_CADUCADO` | **Sí** |
| Token inválido | `401` | `TOKEN_INVALIDO` | **Sí** |
| Correo sin confirmar | `403` | `NO_VERIFICADO` | No |
| Enlace de verificar caducado | **`400`** | `TOKEN_CADUCADO` | No |

Ese último es un detalle brillante de quien lo escribió, y está comentado en
`auth.js:136`:

> *"Se usa 400 (no 401) para que el front **no borre la sesión** al pinchar el enlace."*

```js
if (data?.error?.codigo !== "CREDENCIALES") {
  useAuthStore.getState().salir();
}
```

El `!==` está invertido a propósito: **solo** se salvan los `CREDENCIALES`. Todo lo demás
cierra sesión, incluido `undefined`.

### Sin código también se cierra (fail closed)

Cuando no sabes el motivo de un `401`, **asumes que la sesión ya no vale**. El otro
default — "si no dice nada, no hago nada" — reintroduce el bug original: sesiones zombie
donde la cabecera dice "Hola, javier" y nada funciona.

**Fail closed**: cuando hay duda, elige la opción restrictiva. Cerrar de más molesta pero
se arregla entrando otra vez; dejar vivo algo caducado rompe la web sin avisar.

No es una regla universal, es contextual. En una compra sería al revés: si no sabes si se
cobró, asumes que **no** se cobró, porque asumir que sí y volver a cobrar es peor.
La pregunta siempre es **qué error es más caro en este sitio**.

---

## 6. Regalo del backend: enumeración de usuarios

`auth.js:90`, comentado y bien resuelto:

> *"El mismo error (texto Y codigo) para 'no existe' y 'contraseña mala'. Si respondieras
> distinto, cualquiera podría descubrir qué emails tienen cuenta: sería un **oráculo**."*

```js
const correcta = usuario ? await bcrypt.compare(...) : false;  // un solo if para las dos causas
if (!correcta) throw httpError(401, "CREDENCIALES", "Credenciales incorrectas.");
```

Un login que dice *"ese email no existe"* o *"esa contraseña está mal"* por separado
**regala una lista de cuentas de la tienda**. Se arregla con un solo `if` para las dos
causas.

→ Conecta con XSS y validación de
[`ra2-servlet-ciclo-vida.md`](../../../../02-Desarrollo-web-servidor/apuntes/ut01/ra2-servlet-ciclo-vida.md).

---

## 7. `ProductosCat`: la categoría viaja en la URL

Otro arreglo, y de otro tipo. El componente **no devolvía nada** (petaba al montarse):

```js
const [ catComponentes ] = useParams();   // TypeError: no es iterable
```

Dos cosas: `useParams()` devuelve un **objeto**, no un array (desestructurar con `[ ]`
falla), **y además no es el hook correcto aquí**, porque la categoría no va en la ruta.

| Mecanismo | Se escribe | Hook | Para qué |
|---|---|---|---|
| Parámetro de ruta | `/productos/:id` | `useParams()` | El path **identifica** un recurso |
| Query string | `/productos?categoria=gpu` | `useSearchParams()` | El path es el mismo, cambia el **filtro** |

`OffCanvasCats.jsx:90` pone la categoría en la query string, así que `useParams()`
devolvía `{}` incluso escrito bien.

```js
const [searchParams] = useSearchParams();
const categoria = searchParams.get("categoria");
if (!categoria) return <p className="text-danger">No has elegido ninguna categoria...</p>;
return <div><p>Aqui mostrariamos los productos de {categoria}</p></div>;
```

### Tres cosas que costaron sangre

**a) `if/else` antes del `return`, ternario dentro del JSX.** Dentro de JSX solo caben
*expresiones*; un `if` es una *sentencia* y revienta (`Expected ")" but found "{"`).
Con **early return** cada rama devuelve una sola cosa, así que el fragmento `<>` sobra.

**b) `null` y `""` son distintos.** `.get()` devuelve `null` si la clave no existe, `""`
si existe pero vacía. Comparar solo con `null` deja escapar el segundo caso:

| URL | `.get("categoria")` | `!categoria` |
|---|---|---|
| `/Productos/Categoria` | `null` | `true` → rojo |
| `/Productos/Categoria?categoria=` | `""` | `true` → rojo |
| `/Productos/Categoria?categoria=Perif%C3%A9ricos` | `"Periféricos"` | `false` → normal |

**c) React no peta con `null`, y por eso es peor.**

| Lo que llega | Qué hace React |
|---|---|
| `null`, `undefined`, `false` | No pinta nada, **sin avisar** ← fallo silencioso |
| `{}`, `[]` | **Petazo**: "Objects are not valid as a React child" |
| `"Componentes"` | Lo pinta normal |

El primer caso es el peligroso: **nunca te enteras de que algo va mal**. Por eso el
mensaje rojo no es un lujo, es la diferencia entre un fallo visible y uno invisible.

### Y el estado que sobra

`useState` es para lo que **cambia por una acción** (escribes, pulsas, llega algo).
Un "error" que se deduce de la URL **no se guarda, se calcula**. Guardarlo crea dos
fuentes de verdad — el mismo bug del punto 1.

> En `OffCanvasCats` el `useState` sí está bien justificado: su `errorCarga` lo pone un
> `.catch()` de un `fetch`, o sea que viene de un evento. No se puede deducir del render.

---

## 8. Matriz de pruebas

```
401 CREDENCIALES (login mal) -> sesion abrio   ← el bug original
401 TOKEN_CADUCADO           -> sesion CERRO
401 TOKEN_INVALIDO           -> sesion CERRO
401 sin codigo               -> sesion CERRO   ← fail closed
401 cuerpo HTML (roto)       -> sesion CERRO
403 NO_VERIFICADO            -> sesion abrio
404                          -> sesion abrio
200 login OK                 -> sesion abrio

await res.json() = {"error":{"codigo":"CREDENCIALES","mensaje":"mala"}}   ← el cuerpo sobrevive
```

Ese último caso es el que demuestra que el `clone()` funciona: el mismo cuerpo se ha
leído dos veces.

---

## Errores que cometí (para no repetirlos)

| Error | Qué pasó |
|---|---|
| Suponer que `{}` en JSX es error de sintaxis | **No lo es.** Compila y no genera nada |
| Suponer que había que "comprobar `res.ok` antes de leer el cuerpo" | El orden da igual si proteges con `.catch()`. Era más complejo de lo necesario |
| Dar las pistas de `apiFetch` a trocitos | Paró de entender y tuvo que preguntar |

---

## Lo que hay que saberse de memoria

1. **Un cuerpo HTTP se lee una vez.** `clone()` te da una segunda lectura, **si la pides
   antes** de la primera.
2. **`.catch()` es el plan B**, no el camino bueno.
3. **`?.` es obligatorio** en cuanto algo puede ser `null`. Y en cadena.
4. **Fail closed:** si no sabes, cierra la puerta.
5. **Un dato deducible no se guarda.** `useState` es para lo que cambia por una acción.
6. **No inventes reglas que el servidor ya te da.** Lee el `codigo`, no adivines por el status.

---

## Pendiente

- [ ] Comprobar el `codigo` también en `Verificar.jsx` (recibe `TOKEN_CADUCADO` con
      **400**, a propósito, para no cerrar sesión — ya está bien por diseño)
- [ ] Cuando exista backend de productos: `modelo Producto` + `GET /api/productos?categoria=`
- [ ] `OffCanvasCats.jsx:32` tiene un `window.alert()` de depuración