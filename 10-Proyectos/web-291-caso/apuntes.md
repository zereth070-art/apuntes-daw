# Caso de estudio: la web del Grupo Scout 291 Alfa Centauro

> Apunte construido **desmontando el código real** de `https://291-scouts.rejano291.workers.dev/`
> (no es mío: es el trabajo de otra persona). Sirve para ver cómo se decide arquitectura
> cuando no hay presupuesto ni servidor, y para comparar con lo que vemos en DWES.

**Fecha del análisis:** 18/10/2026
**Cómo se obtuvo:** `Guardar como…` de Chrome sobre la web en producción, más una petición
directa al HTML vivo para confirmar que la copia estaba actualizada.

> Aviso: lo que sigue describe el código **tal como está publicado hoy**. Cambia solo cuando
> quien lo mantiene suba un despliegue nuevo, así que **vuelve a comprobarlo antes de citarlo**.

---

## 1. Lo primero: esto NO es una web terminada

Antes de nada hay que entender el contexto, porque cambia cómo se lee todo lo demás.

Es una **maqueta muy trabajada**, no un producto en marcha. Las pruebas:

| Prueba | Dónde |
| --- | --- |
| Los 4 formularios no envían nada | `SCRIPT_URL` está vacío → *"El formulario todavía no está conectado"* |
| Todos los eventos del calendario llevan `"ejemplo": true` | Se pintan con una etiqueta roja **"Ejemplo"** |
| `fotos: []` | La galería está vacía |
| La línea de tiempo dice `Pendiente: contad aquí por qué el grupo eligió este nombre` | 4 huecos en la historia del grupo |
| `Horario por confirmar` | `#f-horario` y `#p-horario` |
| `CIF: [pendiente]` | Aviso legal |

> **Lección:** antes de他去criticar o de aprender de un proyecto, comprueba si está en producción,
> en staging o es un prototipo. Aquí casi todo el frontend está hecho y **todo el backend falta**.
> El trabajo real que queda por delante es la parte que más enseña.

---

## 2. Con qué está hecha

| Pieza | Qué es | Cómo se deduce |
| --- | --- | --- |
| **Astro** | Generador de sitios estáticos | Rutas `/_astro/` y el fichero `Base.astro_astro_type_script_index_0_lang.*.js` |
| **Vite** | Empaquetador | El CSS se llama `index.CQ0t_PvM.css` (hash de contenido) |
| **JavaScript a pelo** | Sin framework | 12 KB minificados, cero dependencias |
| **Cloudflare Workers** | Hosting | `workers.dev` es el subdominio **gratuito** de Cloudflare |
| **Google Apps Script** *(previsto)* | Backend | Ver §3 |
| **Cloudflare Turnstile** | Anti-spam | Sitekey + campo `cf-turnstile-response` |

Detalles que cuentan:

- **Un solo HTML.** No hay multipágina: son 12 `<section>` y navegación por anclas (`#historia`).
- **Fuentes autoalojadas**: Bricolage Grotesque (titulares), Source Sans 3 (texto), IBM Plex Mono.
  No usan Google Fonts.
- **17 KB de CSS** con variables CSS, **sin framework** (cero Bootstrap) y **modo oscuro
  automático** por `prefers-color-scheme`.

### La trampa del `api.js`

En la carpeta `_files/` hay un `api.js` de **86 KB** que parece una API. No lo es:
es la librería del **widget de Turnstile** (contiene `challenges.cloudflare.com`, 17 `sitekey`...).
El único fichero grande del proyecto es de Cloudflare, no del grupo.

> **Lección:** antes de asumir que un fichero es "la lógica de negocio", ábrelo. El nombre engaña.

---

## 3. La decisión de fondo: no hay servidor, y es lo correcto

Esta es la parte más importante del apunte, y va contra la intuición.

Todo el "backend" se reduce a **una variable de configuración**:

```js
let config = {
  SCRIPT_URL: ``,          // ← vacío
  TURNSTILE_SITEKEY: '0x4AAAAAAFV8LxMLoVWANgWj',
  FOTOS_PRIVADAS_URL: ``,  // ← vacío
  SCOUTERS_URL: ``,        // ← vacío
  HORARIO: ``,             // ← vacío
  DESCARGAS: [
    {nombre:'Ficha de inscripción', ..., url:''},   // ← todos vacíos
    {nombre:'Ficha médica', ..., url:''},
    // ...
  ],
};
```

Y el manejador de envío sale antes de tiempo:

```js
if (!config.SCRIPT_URL)
  return mostrarError('El formulario todavía no está conectado. Mientras tanto, escríbenos a info@grupo291.com.');
```

### ¿Qué se Pondría en ese `SCRIPT_URL`? Un Google Apps Script

Las pistas apuntan todas en la misma dirección:

1. La **política de privacidad** lo dice literalmente: *"Los guardamos en Google (Google
   Workspace), que actúa como encargado del tratamiento"*.
2. El patrón de envío es **el típico de Apps Script**:
   ```js
   fetch(SCRIPT_URL, {method:'POST', mode:'no-cors', body:new URLSearchParams(formData)})
   ```
   El `no-cors` está porque Apps Script responde con un **302** de redirección y eso rompe CORS.
3. La lectura de datos espera `{ok, eventos, avisos, descargas}` — que es lo que devuelve una
   `doGet()` de Apps Script leyendo un Google Sheet.
4. El calendario se suscribe con `SCRIPT_URL + '?formato=ics'` y un esquema `webcal:` →
   un **feed ICS generado por Apps Script**.
5. El área privada ofrece **"Entrar con Google"** → carpetas de Drive compartidas con
   cuentas de Workspace.

### La arquitectura completa, entonces

```
Cloudflare Workers   →   HTML/CSS/JS estático (gratis, CDN global)
        │
        │  fetch()  GET  → {eventos, avisos, descargas}
        │  fetch()  POST → formularios (lista de espera, pedidos, contacto)
        ▼
Google Apps Script  →   lógica de negocio
        │
        ▼
Google Sheets       →   "la base de datos"
Google Drive        →   fotos, circulares y fichas
Google Workspace    →   las cuentas y el login
```

**Cero servidores. Cero mantenimiento. Cero coste.** Para una asociación de voluntarios es
probablemente la decisión más inteligente del proyecto entero, y merece studiedse bien
porque es un patrón real que se usa mucho en el mundo real.

> **Compáralo con lo tuyo.** En [`pomodorozion`](https://github.com/zereth070-art/pomodorozion) necesitaste
> Docker, Render, PostgreSQL, health checks y variables de entorno
> ([`03-Despliegue/apuntes.md`](../../03-Despliegue/apuntes.md)) porque es una app **con estado
> persistente y usuarios**. Aquí, en cambio, no hay usuarios ni estado: solo formulario → fila
> en una hoja → correo. **No todas las webs necesitan backend de verdad.** Saber decidir *cuándo
> no lo necesitas* es en sí lo que se aprende.

---

## 4. Patrón "isla estática": los datos viajan en el HTML

No hay base de datos ni llamada al servidor para pintar el calendario. Los datos vienen
embebidos en la propia página:

```html
<script type="application/json" id="data">
{
  "eventos": [
    {"titulo":"Acampada de otoño","fecha":"2026-11-14","fin":"2026-11-15",
     "seccion":"Todo el grupo","ejemplo":true}
  ],
  "avisos": [ {"fecha":"2026-10-12","texto":"...","ejemplo":true} ],
  "fotos": []
}
</script>
```

Y el JS lo lee con:

```js
const datos = JSON.parse(document.getElementById('data').textContent);
```

Después, si algún día `SCRIPT_URL` deja de estar vacío, se intenta **mejorar** los datos:

```js
fetch(config.SCRIPT_URL)
  .then(r => r.json())
  .then(r => { datos.eventos = r.eventos; pintar(); })
  .catch(() => {});   // ← si falla, la web sigue funcionando con los de ejemplo
```

**Por qué esto es bueno:**

- La web funciona aunque el backend esté caído.
- Es **ultrarrápida**: no hay espera de red para ver el calendario.
- El sitio entero es un fichero estático → se cachea en el CDN entero.

**El coste:** para cambiar un evento hay que **reconstruir y redesplegar** la web. No se
edita desde un panel. Eso, para un grupo scout, es aceptable (los eventos cambian 4 veces al año).
Para un ecommerce, no.

---

## 5. Los 4 formularios

| Formulario | Campos clave | Para qué |
| --- | --- | --- |
| `f-espera` | nombre, **fecha de nacimiento**, email, teléfono, alergias | Lista de espera |
| `f-pedido` | tutor, email, scout, sección, **líneas de artículos con talla** | Pedido de uniformes |
| `f-contacto` | nombre, email, asunto, mensaje | Contacto |
| `f-scouter` | + exscout, formación, disponibilidad | Voluntarios |

### Sección calculada automáticamente

Al elegir la fecha de nacimiento, la web **deduce la sección** (Castores/Manada/Tropa/Escultas/Clan)
y lo muestra en un `<div class="hint">`. De los 6 a los 8 → Castores; de los 8 a los 11 → Manada...
Cero configuración: se cambia la regla en un array y ya.

### Anti-spam: dos capas, sin CAPTCHA para el usuario

**Capa 1 — Honeypot.** Un campo invisible que los bots rellenan y los humanos no:

```html
<div class="hp" aria-hidden="true">
  <label>Web<input name="web" tabindex="-1" autocomplete="off"></label>
</div>
```

Está `aria-hidden` (los lectores de pantalla lo ignoran) y `tabindex="-1"` (no aparece al tabular).
Si viene relleno, es bot.

**Capa 2 — Cloudflare Turnstile.** Un widget invisible que no pide resuelvas una imagen:

```js
window.turnstile.render(el, {
  sitekey: config.TURNSTILE_SITEKEY,
  language: 'es',
  size: 'flexible',
  appearance: 'interaction-only'   // ← solo aparece si sospecha
});
```

Se carga **dinámicamente** (se inyecta el `<script>` desde JS) y solo si hay sitekey configurado.

> **Conecta con tu temario:** esto es **XSS/inyección y validación**, que es exactamente lo que
> ves en [`ra2-servlet-ciclo-vida.md`](../../02-Desarrollo-web-servidor/apuntes/ut01/ra2-servlet-ciclo-vida.md).
> Aquí la defensa es en **tres capas**: validación en cliente (HTML `required` + `type="email"`),
> honeypot, y Turnstile. Ninguna sirve sola: si mañana alguien conecta el formulario, el backend
> **vuelve a validar**, porque el cliente siempre se puede engañar. Nunca confíes en el cliente.

---

## 6. Lo que han hecho bien en accesibilidad

Esto es lo más aprovechable, cópialo tal cual:

| Técnica | Dónde | Por qué importa |
| --- | --- | --- |
| `<dialog>` nativo | Aviso legal / privacidad | Se cierra con `Esc` y atrapa el foco **sin código** |
| `prefers-reduced-motion` | CSS **y** JS | Se respeta en los dos sitios (el canvas included) |
| `role="tablist"` + `aria-selected` | Pestañas Mensaje / Scouter | Correcto para lectores de pantalla |
| `aria-invalid` dinámico | Validación de formularios | Se marca en rojo al fallar, se quita al arreglar |
| `hidden` para ocultar | Formularios y botones | Oculta de verdad, no solo visualmente |
| `aria-hidden="true"` | Canvas del hero | Es decorativo, no se debe leer |
| `autocomplete="email"` etc. | Inputs | Los navegadores rellenan solos |
| `devicePixelRatio` limitado a 2 | Canvas | **Evita que un móvil queme batería** |
| Honeypot con `tabindex="-1"` | 4 formularios | Invisible también para teclado |

El detalle fino: el canvas del hero comprueba `matchMedia('(prefers-reduced-motion: reduce)').matches`
**en JavaScript**, no solo en la CSS. Muchas veces se olvida la mitad.

---

## 7. Los 5 problemas que he encontrado (y por qué son problemas)

### 7.1 `mode:'no-cors'` hace que los envíos se pierdan en silencio ⚠️ El más grave

```js
try {
  return await fetch(url, {...}),
         mostrarOk('¡Enviado!'),   // ← se ejecuta siempre
         form.reset(), true;
} catch {
  mostrarError('No se ha podido enviar...');
}
```

El código asume que si el `fetch` **no lanza**, el servidor tuvo éxito. Pero con `mode:'no-cors'`
la respuesta es **opaca**: el navegador **no puede verla**. Si el Apps Script peta por dentro,
el `fetch` **no lanza error** → el usuario ve "¡Enviado!", el formulario se limpia, y **el
mensaje se ha perdido**.

Pérdida de datos silenciosa. Para una lista de espera significa un niño que no se apunta y nadie lo sabe.

**Cómo se arregla:** que el backend devuelva JSON y se pueda leer (`mode:'cors'` con un Worker
intermedio, o un endpoint que responda en lugar de redirigir). El `no-cors` es un parche por
el 302 de Apps Script, no una decisión de diseño.

### 7.2 El canvas nunca se para

Hay un `requestAnimationFrame` y **cero** `IntersectionObserver` ni `visibilitychange`.
Las estrellas se redibujan a 60 fps **aunque estés leyendo el aviso legal al final de la página**
o tengas otra pestaña abierta. En un móvil eso es batería gastándose sola.

El arreglo son ~8 líneas: un `IntersectionObserver` que pause el bucle cuando el hero sale de
pantalla. Ver [`03-Despliegue/apuntes.md`](../../03-Despliegue/apuntes.md) para el resto de
cosas de producción que siempre se olvidan.

### 7.3 `<button>` dentro de `<label>`

```html
<label class="check">
  <input type="checkbox" id="pd-ok">
  <span>He leído la <button type="button" data-legal>política de privacidad</button> y acepto...</span>
</label>
```

Al hacer clic en cualquier parte del `<label>` (incluido el botón) lo que se activa es el
**checkbox**, no el diálogo. Con ratón "parece" funcionar; con teclado o lector de pantalla es
un desastre. Debería ser un enlace de verdad, no un botón disfrazado dentro de una etiqueta.

### 7.4 La política de privacidad es un modal, no una página

No hay `/privacidad` a la que enlazar. Para poder citarla desde el Facebook del grupo, desde la
ficha de inscripción en PDF o desde un email, necesita **URL propia**. El modal está bien como
*además*, no como *en vez de*.

### 7.5 Mucho `innerHTML` con plantillas

```js
el.innerHTML = eventos.map(h).join('');
```

Hay una función de escape (`r()`) que **sí se aplica** a los datos, lo cual está bien hecho.
Pero es frágil: basta con olvidar un `r()` en un campo para abrir un XSS. En Java lo tienes
controlado con `th:text` (ver
[`ra5-ra8-mvc-thymeleaf.md`](../../02-Desarrollo-web-servidor/apuntes/ut02/ra5-ra8-mvc-thymeleaf.md)),
que escapa por diseño; aquí hay que acordarse a mano.

---

## 8. Comparación directa: esta web vs. lo que aprendes en DWES

Es la parte que más te sirve para el curso:

| Concepto | En esta web (JS) | En tus prácticas (Java) |
| --- | --- | --- |
| Datos dinámicos | `<script type="application/json">` | Controller → Model → Vista |
| Plantilla | Template literals + `innerHTML` | EL (`${}`) / `th:text` |
| Escapar | Función `r()` **a mano** | Automático (`c:out`, `th:text`) |
| Formulario | `fetch` + `URLSearchParams` | `<form method="post">` + `request.getParameter()` |
| Sesión / login | **No hay** (solo Google Drive) | `HttpSession` ([`ra4-sesiones-auth.md`](../../02-Desarrollo-web-servidor/apuntes/ut02/ra4-sesiones-auth.md)) |
| API | No hay (el `api.js` es Turnstile) | REST + JWT ([`ra7-servicios-web-rest.md`](../../02-Desarrollo-web-servidor/apuntes/ut03/ra7-servicios-web-rest.md)) |
| Persistencia | Google Sheets | JPA/Hibernate ([`ra6-ra9-persistencia-jpa.md`](../../02-Desarrollo-web-servidor/apuntes/ut04/ra6-ra9-persistencia-jpa.md)) |
| Despliegue | Cloudflare Workers (estático) | Tomcat / Render + Docker |

**La conclusión importante:** esta web **no toca casi nada de DWES**. Y no es un fallo suyo: es
que la necesitaría para un problema que no tiene. Tu temario te enseña a construir el monolito
completo, que es lo que se pide en exámenes y en empresas, pero **en la vida real muchas webs
son estáticas**. Saber cuándo aplica cada cosa es lo que te va a diferenciar.

---

## 9. Tu propia propuesta

En el historial de git de este repo hubo un documento tuyo (**borrado** en el commit `e2205a8`):

```
10-Proyectos/web-alfacentauro-291/propuesta-web-consejo.md
```

Recuperarlo cuando quieras:

```bash
git show e2205a8d^:10-Proyectos/web-alfacentauro-291/propuesta-web-consejo.md
```

Era una propuesta de requisitos muy completa. Comparada con lo que hay hoy:

| Tu propuesta | Estado real |
| --- | --- |
| Portal privado con 3 perfiles (familia / scouter / coordi) | ❌ Solo dos botones "Entrar con Google" que no van a ningún sitio |
| Confirmaciones SÍ/NO, con marca **FUERA DE PLAZO** | ❌ No existe. El calendario es solo de lectura |
| Pedidos con estados (apuntado → visto → pendiente de cobrar) | ⚠️ El **formulario entero sí** está. Los estados no |
| Lista de espera que llega al coordi | ⚠️ El formulario sí. Sin backend |
| Noticias con editor de texto | ❌ |
| Aviso por correo al publicar | ❌ |
| Exportar listas a Drive | ❌ |

Traducción: **escribieron el frontend que tú describiste. Falta todo el backend y el portal.**
Eso es un proyecto entero por delante, y es justo la parte que más te interesa (sesiones,
roles, persistencia).

---

## Repaso

Contesta en voz alta, sin mirar. Lo que no sepas, vuelve al apartado.

1. ¿Por qué el fichero `api.js` de 86 KB **no** es una API?
2. Explica qué es una "isla estática" y qué se gana y qué se pierde con ella.
3. ¿Por qué el envío de formularios usa `mode:'no-cors'`? ¿Qué se pierde por eso?
4. Nombra las dos capas anti-spam y cuál de las dos no depende del servidor.
5. ¿Por qué el `no-cors` **no** protege de XSS ni de bots? ¿Qué sí protege?
6. ¿En qué se diferencian `th:text` y un `innerHTML` con concatenación, en cuanto a escapar?
7. ¿Qué tres cosas pasarían por tu cabeza antes de decidir si una web necesita un backend de verdad?
8. ¿Qué parte de esta web **no** toca ninguno de los 9 RA de DWES? ¿Por qué es correcto?
9. ¿Qué técnica de accesibilidad está implementada **peor** de lo que parece, y por qué engaña
   con ratón pero falla con teclado?

---

## Pendiente / siguientes pasos

- [ ] Consultar con el profe qué parte encaja como práctica evaluable.
- [ ] Recuperar y volver a leer tu `propuesta-web-consejo.md`.
- [ ] Montar un Astro local con esta estructura para poder **cambiar** el código (no solo leerlo).
- [ ] Escribir el `SCRIPT_URL` de ejemplo: un `doGet()` + `doPost()` en Apps Script.
- [ ] Arreglar los 4 problemas de §7 como ejercicio (sobre todo el 7.1).