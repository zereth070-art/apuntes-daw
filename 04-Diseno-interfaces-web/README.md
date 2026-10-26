# Diseño de interfaces web (DIW)

UX/UI, color, tipografía, responsive, accesibilidad y Bootstrap.

## Estructura

```
04-Diseno-interfaces-web/
├── apuntes.md                  # teoría del módulo
├── plantilla_coevaluacion.md   # plantilla para evaluar interfaces
└── practicas/
    └── nexus/                  # práctica de maquetación con Bootstrap 5
```

## Apuntes

- [`apuntes.md`](apuntes.md) — jerarquía visual, color, tipografía, box model, componentes,
  responsive, media queries, wireframes, accesibilidad (WCAG), Sass y repaso.
- [`plantilla_coevaluacion.md`](plantilla_coevaluacion.md) — plantilla para coevaluar la
  interfaz de un compañero con criterios concretos.

## Práctica: Nexus

[`practicas/nexus/`](practicas/nexus) es una página de tarjetas maquetada con Bootstrap 5.
Sirve para practicar grid, componentes (cards, botones, navbar) y espaciado.

```bash
# No necesita servidor: abre el HTML en el navegador
start practicas/nexus/index.html
```

> El CSS que usa la página es `practicas/nexus/scss/miestilo.css` (Bootstrap 5 compilado).
> El código fuente de Bootstrap se quitó del repo para no arrastrar ~190 archivos que no
> se usan. Si necesitas recompilar, instala Bootstrap y Sass en la carpeta de la práctica:
>
> ```bash
> npm init -y
> npm install bootstrap sass
> npx sass --load-path=node_modules scss/miestilo.scss scss/miestilo.css
> ```

## Estado

- Teoría: completa, con repaso al final.
- Práctica Nexus: página estática terminada; el CSS se puede seguir retocando.
- Pendiente de clase: profundizar Flexbox/Grid y probar la página en 320, 375 y 480 px.
