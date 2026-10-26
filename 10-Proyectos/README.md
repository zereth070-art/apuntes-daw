# 10 · Proyectos

Los proyectos desplegables viven **en repositorios propios**, para poder verlos, clonarlos
y desplegarlos por separado. Aquí queda el índice y una nota breve de cada uno.

## Índice

| Proyecto | Repo | Stack | Estado |
| --- | --- | --- | --- |
| **PomodoroZion** | [zereth070-art/pomodorozion](https://github.com/zereth070-art/pomodorozion) | Java 25, Spring Boot, WebSocket, Thymeleaf, JPA, Docker | En producción · [demo](https://pomodorozion.onrender.com/) |
| **PCCOMPONENTES** | [zereth070-art/pccomponentes](https://github.com/zereth070-art/pccomponentes) | React 19, Vite, Express 5, MongoDB, JWT, OAuth 2.0 | En desarrollo |
| **Cita previa Sede 2.0** | [zereth070-art/cita-previa-sede2](https://github.com/zereth070-art/cita-previa-sede2) | HTML, CSS, Bootstrap 5 | Práctica de DIW · paso 1 |
| **Caso 291** | [`web-291-caso/apuntes.md`](web-291-caso/apuntes.md) | Astro, Cloudflare Workers, Google Apps Script | Análisis terminado |

## PomodoroZion

Temporizador Pomodoro con sesiones, tareas y estadísticas, sincronizado en tiempo
real entre varios usuarios por WebSocket.

- Spring Boot (Web MVC, Security, Data JPA, Validation, WebSocket) sobre Java 25
- H2 en local, PostgreSQL (Neon) en producción
- Docker y despliegue en Render con auto-deploy

🔗 [Repo](https://github.com/zereth070-art/pomodorozion) · [Demo](https://pomodorozion.onrender.com/)

## PCCOMPONENTES

Tienda de componentes de PC con registro, verificación de email y login social
con Google OAuth 2.0. Es **mi versión**; el material de partida del profesor está en
[`01-…/practicas/pccomponentes-clase`](../01-Desarrollo-web-cliente/practicas/pccomponentes-clase).

- Front: React 19 + Vite + React Router + Zustand
- Back: Express 5 + Mongoose sobre MongoDB, JWT, BCrypt, Mailjet
- Anti-spam con Cloudflare Turnstile y honeypot

🔗 [Repo](https://github.com/zereth070-art/pccomponentes)

## Cita previa Sede 2.0

Asistente de tres pasos para pedir cita previa sanitaria. Práctica de Diseño de
Interfaces Web centrada en formularios, accesibilidad y Bootstrap 5.

- Paso 1 (identificación) maquetado y validado en cliente
- Pasos 2 (especialidad) y 3 (confirmación) pendientes
- Sin JavaScript propio todavía: la lógica de pasos está por hacer

🔗 [Repo](https://github.com/zereth070-art/cita-previa-sede2)

## Caso 291

Análisis técnico de la web del Grupo Scout 291 Alfa Centauro: con qué está
hecha, por qué está arquitectada así, qué está bien hecho, qué está mal y qué
partes faltarían por construir.

🔗 [`web-291-caso/apuntes.md`](web-291-caso/apuntes.md)

---

## Material de clase con repo propio

- [DWES-01-2026-27](https://github.com/zereth070-art/DWES-01-2026-27) — fork del
  material del profesor de Desarrollo Web en Entorno Servidor. Se consulta, no se mezcla
  con las prácticas de este cuaderno.
- [back-end-development-and-apis](https://github.com/zereth070-art/back-end-development-and-apis)
  — fork del curso de freeCodeCamp (Node, Express, MongoDB).
