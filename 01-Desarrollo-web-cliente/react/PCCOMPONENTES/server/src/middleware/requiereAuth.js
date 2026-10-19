import jwt from "jsonwebtoken";

function requiereAuth(req, res, next) {
  const header = req.headers.authorization; //pillamos solo authorization, lo demas nos  da igual
  //existe
  if (!header) {
    return res.status(401).json({
      error: {
        codigo: "ERROR_AUTORIZACION",
        mensaje: "No posees ningún token",
      },
    });
  }

  const [metodo, token] = header.split(" "); // `Bearer ${token}` separamos eso
  //no hay contenido? por venir puede venir, pero si viene vacio mierdon
  if (metodo !== "Bearer" || !token) {
    return res.status(401).json({
      error: {
        codigo: "ERROR_AUTORIZACION",
        mensaje: "No posees ningún token",
      },
    });
  }
  //intentamos verificar los datos
  try {
    const datos = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = datos;
    next(); // RECUERDA, esto es un middleware, asi que tienes que avanzar
  } catch (err) {
    const codigo =
      err.name === "TokenExpiredError" ? "TOKEN_CADUCADO" : "TOKEN_INVALIDO";
    //asi GUARDAMOS en una variable el valor del error que salte,
    // porque puede ser por esos 2 tipos, si no es como contar de cabeza
    //  y se perderia en la nada y no podriamos utilizarlo
    return res.status(401).json({
      error: {
        codigo: codigo,
        mensaje: "No posees ninguna autorizacion",
      },
    }); //devolvemos el error
  }
}

export default requiereAuth;
