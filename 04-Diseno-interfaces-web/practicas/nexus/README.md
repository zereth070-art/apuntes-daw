# Nexus — práctica de Bootstrap 5

Página de tarjetas para practicar el grid y los componentes de Bootstrap 5.

## Archivos

| Archivo | Qué es |
| --- | --- |
| `index.html` | La página. Usa clases de Bootstrap y el CSS compilado |
| `scss/miestilo.scss` | Punto de entrada de Sass (Bootstrap + estilos propios) |
| `scss/_variables.scss` | Variables de Bootstrap personalizadas (parcial: el `_` evita que se compile solo) |
| `scss/miestilo.css` | CSS compilado (lo que carga el HTML; no editar a mano) |
| `images/` | Imágenes de las tarjetas |

## Cómo verla

```bash
cd practicas/nexus
npm install          # solo la primera vez
npm run sass         # compila y se queda escuchando cambios
```

Después abre `index.html` en el navegador. Mientras `npm run sass` esté activo,
cada vez que guardes un `.scss` se regenera `scss/miestilo.css`: recarga con
`Ctrl+Shift+R` para saltarte la caché.

Para una compilación puntual (sin modo watch):

```bash
npm run sass:build
```

## Cómo personalizar Bootstrap

1. Añade o cambia variables en `scss/_variables.scss` **antes** de importar
   Bootstrap. Las más habituales: `$primary`, `$secondary`, `$body-bg`,
   `$body-color`, `$font-family-sans-serif`.
2. `scss/miestilo.scss` las pasa a Bootstrap con `@use ... with (...)`.
3. Los estilos propios van **después** del `@use` de Bootstrap, para que no los
   pise.

> Ojo: si defines una variable después de importar Bootstrap, no tiene efecto.
> Bootstrap ya generó su CSS con el valor anterior.

## Qué practicar

- Cambiar el número de columnas de las tarjetas (`col-12 col-md-6 col-lg-4`).
- Añadir una navbar con `navbar-expand-lg` y un offcanvas.
- Revisar el contraste y el `alt` de las imágenes.
- Probar la página a 320, 375 y 480 px de ancho.
