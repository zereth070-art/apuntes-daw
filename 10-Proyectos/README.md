# 10 · Proyectos

Los proyectos de este repositorio viven **en repositorios propios**, para que se
puedan ver, clonar y desplegar por separado. Aquí queda el índice y una nota
breve de cada uno.

| Proyecto | Repo | Stack | Estado |
| --- | --- | --- | --- |
| **PomodoroZion** | [zereth070-art/pomodorozion](https://github.com/zereth070-art/pomodorozion) | Java 25, Spring Boot, WebSocket, Thymeleaf, JPA, Docker | En producción · [demo](https://pomodorozion.onrender.com/) |
| **PCCOMPONENTES** | [zereth070-art/pccomponentes](https://github.com/zereth070-art/pccomponentes) | React 19, Vite, Express 5, MongoDB, JWT, OAuth 2.0 | En desarrollo |
| **Caso 291** | ⬇️ [`web-291-caso/`](web-291-caso/apuntes.md) | Astro, Cloudflare Workers, Google Apps Script | Apuntes |

---

## PomodoroZion

Temporizador Pomodoro con sesiones, tareas y estadísticas, sincronizado en tiempo
real entre varios usuarios por WebSocket.

- Spring Boot (Web MVC, Security, Data JPA, Validation, WebSocket) sobre Java 25
- H2 en local, PostgreSQL (Neon) en producción
- Docker y despliegue en Render con auto-deploy

🔗 [Repo](https://github.com/zereth070-art/pomodorozion) · [Demo en vivo](https://pomodorozion.onrender.com/)

## PCCOMPONENTES

Tienda de componentes de PC con registro, verificación de email y login social
con Google OAuth 2.0.

- Front: React 19 + Vite + React Router + Zustand
- Back: Express 5 + Mongoose sobre MongoDB, JWT, BCrypt, Mailjet
- Anti-spam con Cloudflare Turnstile y honeypot

🔗 [Repo](https://github.com/zereth070-art/pccomponentes)

## Caso 291

Análisis técnico de la web del Grupo Scout 291 Alfa Centauro: con qué está
hecha, por qué está arquitectada así, qué está bien hecho, qué está mal y qué
partes faltarían por construir.

🔗 [`web-291-caso/apuntes.md`](web-291-caso/apuntes.md)
