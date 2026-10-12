function httpError(status, codigo, mensaje) {
  const err = new Error(mensaje);
  err.status = status;
  err.codigo = codigo;
  return err;
}
export default httpError;
