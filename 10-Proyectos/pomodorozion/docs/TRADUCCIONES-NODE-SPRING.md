| Lo que escribo en Node                                | Cómo se hace en Spring                       | Equivalente exacto              |
| ----------------------------------------------------- | -------------------------------------------- | ------------------------------- |
| datosPublicos(usuario)                                | UserDTO                                      | ya lo tienes, solo falta usarlo |
| validarAuth()                                         | @Valid + @NotBlank                           | —                               |
| handler de errores                                    | @RestControllerAdvice                        | —                               |
| bcrypt.hash()                                         | PasswordEncoder                              | —                               |
| firmarToken()                                         | JwtAuthFilter + JWTGenerator                 | —                               |
| app.use()                                             | addFilterBerfore(filtro, ...)                | —                               |
| app.use(mw) se ejecuta para todas                     | FilterRegistrationBean / SecurityFilterChain |
| El middleware decide si sigue (next) o no             | doFilter → chain.doFilter() o no             |
| NUNCA genera respuesta si es middleware               | El filtro no escribe, solo pasa o corta      |
| El orden importa                                      | addFilterBefore/After                        |
| (req,res,next) con3 params = middleware normal        | doFilter(req,res,chain)                      |
| (err,req,res,next) con 4 params = middleware de error | doFilter con catch / @ControllerAdvice       |
| req.user lo pones tú                                  | SecurityContextHolder                        |
