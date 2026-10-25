# Apuntes DAW

Cuaderno de estudio de **2º de Desarrollo de Aplicaciones Web (DAW)** en Alcalá de Henares.
Aquí vive el **material de clase**: apuntes, prácticas y ejercicios. Los proyectos que se
clonan, se despliegan y se enseñan por separado tienen **su propio repositorio**.

> **Regla del repo:** si algo es un proyecto desplegable, no va aquí. Aquí va el cuaderno
> y las prácticas. Índice de proyectos: [`10-Proyectos/README.md`](10-Proyectos/README.md).

## Mapa del repositorio

| Carpeta | Módulo | Contenido |
| --- | --- | --- |
| [`01-Desarrollo-web-cliente`](01-Desarrollo-web-cliente/README.md) | DWEC | `apuntes.md`, apuntes de React en `apuntes/` y prácticas en `practicas/` |
| [`02-Desarrollo-web-servidor`](02-Desarrollo-web-servidor/README.md) | DWES | Apuntes por RA (`apuntes/ut01`…`ut04`) y prácticas Jakarta/Spring en `practicas/` |
| [`03-Despliegue`](03-Despliegue/README.md) | DAW | Despliegue, Docker, Render, CI/CD y Apache |
| [`04-Diseno-interfaces-web`](04-Diseno-interfaces-web/README.md) | DIW | Teoría en `apuntes.md` + práctica `practicas/nexus` (Bootstrap 5) |
| [`05-Python`](05-Python/README.md) | Extra | Ejercicios sueltos de Python |
| [`10-Proyectos`](10-Proyectos/README.md) | — | Índice de los proyectos y caso de estudio |

Cada módulo sigue la misma idea:

- **`README.md`** — qué hay, estado y cómo arrancarlo.
- **`apuntes.md`** — teoría del módulo (o una carpeta `apuntes/` si hay muchos temas).
- **`practicas/`** — código de clase, ordenado por UT.

## Clase vs. proyecto propio

Esta es la distinción que más se mezclaba antes. Ahora queda así:

| Código | Dónde vive | Qué es |
| --- | --- | --- |
| `pccomponentes-clase` | [`01-…/practicas/pccomponentes-clase`](01-Desarrollo-web-cliente/practicas/pccomponentes-clase) | Material de partida del profesor. **No es mi versión** |
| `pccomponentes` | [repo aparte](https://github.com/zereth070-art/pccomponentes) | Mi versión propia del proyecto (React + Express + MongoDB) |
| `pomodorozion` | [repo aparte](https://github.com/zereth070-art/pomodorozion) | Proyecto personal (Spring Boot + WebSocket) |
| `Simpsons` (Jakarta) | [`02-…/practicas/ut01/jakartaServlet/Simpsons`](02-Desarrollo-web-servidor/practicas/ut01/jakartaServlet/Simpsons) | Práctica de servlets + JSP |
| `Simpsons_Spring` | [`02-…/practicas/ut02/UT02 SPRING/Simpsons_Spring`](02-Desarrollo-web-servidor/practicas/ut02/UT02%20SPRING/Simpsons_Spring) | Versión Spring de la práctica (la estoy portando yo) |

> `pccomponentes-clase` se conserva como **referencia de clase**. Mi implementación
> evoluciona aparte en el repo `pccomponentes`, así que no se toca una para arreglar la otra.

## Requisitos

- **Node.js 20+** y `npm` para React/Vite y los proyectos Node.
- **JDK 25** para las prácticas de servidor y para `pomodorozion`.
- **Apache Tomcat 11** para desplegar los WAR de servlets. No está en el repo:
  descárgalo en [tomcat.apache.org](https://tomcat.apache.org/).
- **Python 3** para `05-Python`.
- Maven no hace falta instalarlo: cada proyecto Java trae wrapper (`mvnw` / `mvnw.cmd`).
  En Windows conviene tener `JAVA_HOME` apuntando al JDK.

## Arranque rápido

### Prácticas de servidor (servlets / JSP)

```bash
cd 02-Desarrollo-web-servidor/practicas/ut01/jakartaServlet/JakartaLogin
./mvnw package
# copia target/*.war a webapps/ de Tomcat
```

### Prácticas de Spring Boot

```bash
cd "02-Desarrollo-web-servidor/practicas/ut02/UT02 SPRING/Alta-usuario-Spring"
./mvnw spring-boot:run     # http://localhost:8080
```

### Práctica de front (React + Vite)

```bash
cd 01-Desarrollo-web-cliente/practicas/sandbox-front-back
npm install
npm run dev                 # http://localhost:5173
```

### Proyectos (repositorios aparte)

```bash
# PomodoroZion — Spring Boot + WebSocket
git clone https://github.com/zereth070-art/pomodorozion.git
cd pomodorozion && ./mvnw spring-boot:run     # http://localhost:8080

# PCCOMPONENTES — React + Express + MongoDB
git clone https://github.com/zereth070-art/pccomponentes.git
cd pccomponentes && npm install && npm run dev  # http://localhost:5173
```

## Convenciones

- **Nombres de carpeta**: `NN-Nombre-del-modulo`, en minúsculas dentro de `practicas/`.
- **Un tema, un fichero**: si un apunte crece, se parte por UT o por RA.
- **Secretos**: `.env` siempre en `.gitignore`. Si una credencial llega a un commit,
  se **rota** en el servicio; borrarla del fichero no basta.
- **Código de prácticas**: se conserva aunque esté a medias. Lo que falta se marca en el
  README de la práctica, no se rellena por relleno.

## Objetivo

Terminar con una base sólida para crear, probar, desplegar y mantener aplicaciones web
completas, y que el repositorio se pueda leer sin preguntar dónde está cada cosa.
