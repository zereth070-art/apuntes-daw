# PomodoroZion 🍅

App web full-stack con la [técnica Pomodoro](https://en.wikipedia.org/wiki/Pomodoro_Technique):
temporizador de enfoque/descanso en tiempo real (WebSocket), tareas, sesiones
registradas y estadísticas, con login y roles.

**Demo viva:** https://pomodorozion.onrender.com/

> En el plan gratis de Render el servicio se duerme sin visitas:
> la primera carga puede tardar ~1 minuto.

## Stack

- Java 25 + Spring Boot (Web MVC, Security, Data JPA, Validation, WebSocket)
- Thymeleaf + JS vainilla
- H2 en local · PostgreSQL (Neon) en producción
- Docker + Render

## Correr en local

```bash
./mvnw spring-boot:run
# http://localhost:8080 (base H2 en ./data/)
```

## Despliegue (Render + Neon)

Perfil `prod` (`application-prod.properties`) con variables de entorno:

| Variable | Qué es |
| --- | --- |
| `SPRING_PROFILES_ACTIVE` | `prod` |
| `DB_URL` | JDBC de Neon (`jdbc:postgresql://host/neondb?sslmode=require`) |
| `DB_USER` / `DB_PASSWORD` | Rol y password de Neon |

## Docs

- [`docs/DOCUMENTACION-PROYECTO.md`](docs/DOCUMENTACION-PROYECTO.md): arquitectura, dominio, API y decisiones.
- [`docs/TimerService.md`](docs/TimerService.md): lógica del temporizador.
- [`docs/TRADUCCIONES-NODE-SPRING.md`](docs/TRADUCCIONES-NODE-SPRING.md): puente Node ↔ Spring.
