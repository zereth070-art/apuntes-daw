# Apuntes DAW

Directorio de estudio para aprender Desarrollo de Aplicaciones Web de forma ordenada.

> **Este repo es el cuaderno.** Los **proyectos** que salen de aquí viven en repositorios
> propios, para poder verlos, clonarlos y desplegarlos por separado:
>
> | Proyecto | Repo |
> | --- | --- |
> | PomodoroZion (Spring Boot + WebSocket) | [zereth070-art/pomodorozion](https://github.com/zereth070-art/pomodorozion) |
> | PCCOMPONENTES (React + Express + MongoDB) | [zereth070-art/pccomponentes](https://github.com/zereth070-art/pccomponentes) |
>
> Índice con el detalle de cada uno: [`10-Proyectos/README.md`](10-Proyectos/README.md).

## Cómo usar esta carpeta

1. Avanza módulo a módulo: `01-Desarrollo-web-cliente` y `02-Desarrollo-web-servidor` forman el núcleo; después pasa a `03-Despliegue` y `04-Diseno-interfaces-web`.
2. Guarda tus apuntes en cada carpeta.
3. Resuelve prácticas pequeñas antes de pasar a proyectos grandes.
4. Usa `10-Proyectos` para construir portfolio.
5. Apóyate en `11-Recursos` y en las plantillas de `12-Plantillas`.

## Estructura

- `01-Desarrollo-web-cliente`: JavaScript moderno, DOM, fetch, SPAs y frontend.
- `02-Desarrollo-web-servidor`: backend, APIs REST, sesiones, autenticación y seguridad.
- `03-Despliegue`: hosting, Docker, servidores, dominios, HTTPS y CI/CD.
- `04-Diseno-interfaces-web`: UX/UI, responsive, diseño visual y accesibilidad.
- `10-Proyectos`: índice de los proyectos (cada uno en su propio repo) y casos de estudio.
- `11-Recursos`: enlaces, libros, canales, documentación y herramientas.
- `12-Plantillas`: plantillas reutilizables para apuntes, ejercicios y proyectos.

## Requisitos

- **Node.js 20+** e `npm` para los proyectos frontend (React/Vite).
- **JDK 25** para las prácticas de servidor y para `pomodorozion` (compila con `release=25` / `java.version=25`).
- **Apache Tomcat 11** no está incluido en el repo: descárgalo en [tomcat.apache.org](https://tomcat.apache.org/) si vas a desplegar los WAR de servlets.
- Maven no hace falta instalarlo: los proyectos tienen wrapper (`mvnw` en Linux/macOS, `mvnw.cmd` en Windows). En Windows conviene tener `JAVA_HOME` apuntando al JDK.

## Puesta en marcha

### Prácticas de servidor (servlets / Thymeleaf)

Cada proyecto tiene su propio `mvnw`. Para generar el WAR:

```bash
cd 02-Desarrollo-web-servidor/practicas/ut01/jakartaServlet/InitDemoServlet
./mvnw package
```

Copia el `*.war` de `target/` a `webapps/` de tu Tomcat o despliégalo con IntelliJ.

### Proyectos (repositorios aparte)

```bash
# PomodoroZion — Spring Boot + WebSocket
git clone https://github.com/zereth070-art/pomodorozion.git
cd pomodorozion && ./mvnw spring-boot:run     # → http://localhost:8080

# PCCOMPONENTES — React + Express + MongoDB
git clone https://github.com/zereth070-art/pccomponentes.git
cd pccomponentes && npm install && npm run dev  # → http://localhost:5173
```

## Objetivo final

Terminar con una base sólida para crear, probar, desplegar y mantener aplicaciones web completas.

# proxy inverso investigar
