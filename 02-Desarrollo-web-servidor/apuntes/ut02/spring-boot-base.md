# Spring Boot base: qué es y de qué partes está hecho

## Qué es (una frase)

Spring es el framework Java de siempre: un contenedor que crea tus objetos y
te los inyecta (inversión de control / inyección de dependencias), más módulos
para web, datos y seguridad.

Spring Boot es su capa con opiniones: te da un proyecto que arranca solo
(Tomcat embebido, dependencias coherentes, configuración por defecto) para que
escribas capas de negocio en vez de XML de infraestructura.

## Las partes

| Parte | Qué es | Ejemplo en tu repo |
| --- | --- | --- |
| Starter | Un `artifactId` que trae un pack coherente (web, plantillas, test...) | `spring-boot-starter-webmvc`, `spring-boot-starter-thymeleaf` en `pom.xml` |
| Autoconfiguración | Boot mira el classpath y configura solo lo que ve (¿hay Thymeleaf? monta el motor de vistas) | Sin starter de Thymeleaf, `templates/` es invisible (te pasó hoy) |
| Servidor embebido | Tomcat dentro del jar; no hay WAR ni Tomcat externo | `.\mvnw.cmd spring-boot:run` → `localhost:8080` |
| `application.properties` | Ajustes en pares clave=valor | `spring.application.name=login-spring` |
| Capas + anotaciones | Controller recibe, Service decide, Repository guarda | `@Controller`, `@Service`, `@Repository`, `@GetMapping`, `@PostMapping` |

## Flujo de una petición (vale para GET, POST y PUT)

1. Tomcat embebido recibe el HTTP.
2. `DispatcherServlet` (portero único) pregunta quién lo lleva.
3. `HandlerMapping` mira tus `@GetMapping/@PostMapping/@PutMapping` y elige método.
4. Se resuelven argumentos (`@RequestParam`, `@PathVariable`, `@ModelAttribute`).
5. El método tira de servicio/repositorio si necesita datos.
6. Devuelves vista (`String` → Thymeleaf) o datos (`@ResponseBody` → JSON).
7. Respuesta HTTP al cliente.

```java
@Controller
public class AltaController {

    // 1+3: pedido GET a "/" va a esta mesa
    @GetMapping("/")
    public String inicio() {
        return "index"; // 6: pinta templates/index.html
    }
}
```

### En qué se diferencian

- GET lee: params en URL, idempotente, no cambia nada.
- POST crea/procesa: datos en body/form, no idempotente.
- PUT sustituye un recurso entero: idempotente, lleva el ID.

## Preguntas de repaso

1. ¿Qué trae un starter que no trae una dependencia normal?
2. ¿Por qué `templates/index.html` era invisible sin el starter de Thymeleaf?
3. ¿Qué devuelve un método que retorna `String` en un `@Controller`?
4. ¿Dónde se resuelven `@RequestParam` y `@PathVariable`, antes o después de tu método?
5. ¿GET o POST para un login? ¿Por qué no al revés?
