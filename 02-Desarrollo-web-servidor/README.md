# Desarrollo web en servidor (DWES 0613)

## Apuntes

Un fichero por RA en [`apuntes/`](apuntes/README.md). Empieza por el índice: te dice qué
UT va con qué RA y cuánto pesa cada una.

| Apunte | Tema |
| --- | --- |
| [`ut01/ra1-arquitecturas.md`](apuntes/ut01/ra1-arquitecturas.md) | Cliente/servidor, Maven, capas |
| [`ut01/ra1-jakarta-ee-aclaracion.md`](apuntes/ut01/ra1-jakarta-ee-aclaracion.md) | Qué es Jakarta EE, quién hace cada cosa |
| [`ut01/ra2-servlet-ciclo-vida.md`](apuntes/ut01/ra2-servlet-ciclo-vida.md) | Ciclo de vida del servlet, hilos, despliegue |
| [`ut01/ra2-ra3-jsp-jstl.md`](apuntes/ut01/ra2-ra3-jsp-jstl.md) | EL, JSTL, escapado de HTML |
| [`ut02/ra4-sesiones-auth.md`](apuntes/ut02/ra4-sesiones-auth.md) | Sesiones, cookies, autenticación, autorización |
| [`ut02/ra5-ra8-mvc-thymeleaf.md`](apuntes/ut02/ra5-ra8-mvc-thymeleaf.md) | MVC con Spring y Thymeleaf |
| [`ut02/spring-boot-base.md`](apuntes/ut02/spring-boot-base.md) | Spring Boot desde cero |
| [`ut03/ra7-servicios-web-rest.md`](apuntes/ut03/ra7-servicios-web-rest.md) | REST, códigos HTTP, validación, Swagger, JWT |
| [`ut04/ra6-ra9-persistencia-jpa.md`](apuntes/ut04/ra6-ra9-persistencia-jpa.md) | JPA, entidades, transacciones, Spring Data |

## Prácticas

| Práctica | Qué practicas | Arranque |
| --- | --- | --- |
| [`practicas/ut01/jakartaServlet/InitDemoServlet`](practicas/ut01/jakartaServlet/InitDemoServlet) | Ciclo de vida: cuántas veces corre `init()` | desplegar el WAR en Tomcat |
| [`practicas/ut01/jakartaServlet/JakartaLogin`](practicas/ut01/jakartaServlet/JakartaLogin) | Servlet + JSP + JSTL, validación, `forward` | idem |
| [`practicas/ut01/jakartaServlet/Simpsons`](practicas/ut01/jakartaServlet/Simpsons) | Servlets + JSP con un `record` (`Personaje`) | idem |
| [`practicas/ut01/jakartaServlet/login-spring`](practicas/ut01/jakartaServlet/login-spring) | Primer login con Spring MVC / Thymeleaf | `./mvnw spring-boot:run` |
| [`practicas/ut02/UT02 SPRING/Alta-usuario-Spring`](practicas/ut02/UT02%20SPRING/Alta-usuario-Spring) | Alta de usuario: formulario, validación, sesión, WAR en Tomcat | `./mvnw spring-boot:run` |
| [`practicas/ut02/UT02 SPRING/Simpsons_Spring`](practicas/ut02/UT02%20SPRING/Simpsons_Spring) | Versión Spring de la práctica de Simpsons | `./mvnw spring-boot:run` |

Los tres primeros son **WAR**: necesitan Tomcat desplegado. Los de Spring Boot
(`login-spring`, `Alta-usuario-Spring`, `Simpsons_Spring`) levantan solos con
`./mvnw spring-boot:run` → `http://localhost:8080`.

> `Simpsons_Spring` lo estoy portando yo desde la versión Jakarta. Se deja **sin tocar**
> hasta terminar el traspaso.

## Requisitos

- **JDK 25**. Todos los proyectos compilan con `maven.compiler.release=25` / `java.version=25`.
- **Apache Tomcat 10.1+** para los WAR. No está en el repo: descárgalo de
  [tomcat.apache.org](https://tomcat.apache.org/).
  - Con Tomcat **10.1** (Servlet 6.0), el `web.xml` debe decir `version="6.0"`.
  - Con Tomcat **11** (Servlet 6.1), `version="6.1"`.
  - Ojo: `InitDemoServlet/web.xml` sigue en `6.1`. Con Tomcat 10.1 funciona pero avisa de
    `Unknown version string [6.1]`. Bajarlo a `6.0` elimina el aviso.
- Maven no hace falta instalarlo: cada proyecto trae `mvnw`.

## desplegar un WAR

```bash
cd practicas/ut01/jakartaServlet/JakartaLogin
./mvnw package                                    # genera target/*.war
cp target/JakartaLogin-1.0-SNAPSHOT.war $CATALINA_HOME/webapps/
```

El **nombre del WAR es el path de la app**:
`http://localhost:8080/JakartaLogin-1.0-SNAPSHOT/alta`

Desde IntelliJ se hace con la configuración de Tomcat que ya tienes, que además te
permite redeploy sin copiar el fichero a mano.
