# Nexus — práctica de Bootstrap 5

Página de tarjetas para practicar el grid y los componentes de Bootstrap 5.

## Archivos

| Archivo | Qué es |
| --- | --- |
| `index.html` | La página. Usa clases de Bootstrap y el CSS compilado |
| `scss/miestilo.css` | Bootstrap 5 compilado (lo que carga el HTML) |
| `scss/miestilo.scss` | Punto de entrada original (`@import "bootstrap"`) |
| `images/` | Imagen de las tarjetas |

## Cómo verla

Abre `index.html` en el navegador. No hace falta servidor ni `npm install`.

## Cómo volver a compilar el CSS

El repo ya no incluye el código fuente de Bootstrap (eran ~190 archivos que la página
no usa). Si quieres modificar variables o recompilar:

```bash
cd practicas/nexus
npm init -y
npm install bootstrap sass
npx sass --load-path=node_modules scss/miestilo.scss scss/miestilo.css
```

Para añadir estilos propios, crea un `scss/_custom.scss` y cárgalo al final de
`miestilo.scss`; así no se pierden los cambios al recompilar.

## Qué practicar

- Cambiar el número de columnas de las tarjetas (`col-12 col-md-6 col-lg-4`).
- Añadir una navbar con `navbar-expand-lg` y un offcanvas.
- Revisar el contraste y el `alt` de las imágenes.
- Probar la página a 320, 375 y 480 px de ancho.
