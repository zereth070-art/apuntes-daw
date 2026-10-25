# Despliegue de aplicaciones web (DAW 0614)

Pasar una aplicación de "funciona en mi portátil" a "funciona en Internet": entornos,
Docker, hosting, HTTPS, logs y CI/CD.

## Contenido

| Documento | Qué cubre |
| --- | --- |
| [`apuntes.md`](apuntes.md) | Entornos, variables, Render, Docker multi-stage, logs, auto-deploy, rotación de credenciales y checklist |
| [`apuntes/apache-usuarios.md`](apuntes/apache-usuarios.md) | Chuleta: crear usuarios y proteger una ruta con autenticación básica en Apache2 |

Los apuntes salen del despliegue real de **PomodoroZion** (Spring Boot + PostgreSQL)
en Render con Docker. El caso práctico está a la vista en
[`zereth070-art/pomodorozion`](https://github.com/zereth070-art/pomodorozion).

## Ideas clave

- **Configuración por entorno**: la misma imagen cambia de local a producción con
  variables de entorno, sin recompilar.
- **Secretos fuera del repo**: `.env` o panel del proveedor; nunca en Git.
- **Docker multi-stage**: una fase compila y otra solo ejecuta el JAR.
- **Health check**: el proveedor necesita una ruta que diga si la app está viva.
- **Auto-deploy**: cada push a `main` construye y publica.
- **Logs antes que suposiciones**: en producción se depura leyendo el log.

## Práctica pendiente

- [ ] Desplegar un frontend estático.
- [ ] Conectar una app con una base de datos remota.
- [ ] Configurar un dominio propio.
- [ ] Escribir un checklist de producción para un proyecto nuevo.
