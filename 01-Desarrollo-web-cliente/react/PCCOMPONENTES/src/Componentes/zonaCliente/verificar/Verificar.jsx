import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { apiFetch } from "../../../utils/apiFetch.js";

/*
 * Página de destino del enlace del correo: /verificar?token=...
 * Llama al back, que marca verificado=true, y muestra el resultado.
 */
function Verificar() {
  const [params] = useSearchParams();
  const [mensaje, setMensaje] = useState("Confirmando tu cuenta...");
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const token = params.get("token");
    if (!token) {
      setOk(false);
      setMensaje("Enlace de verificación inválido.");
      return;
    }

    apiFetch(`/api/auth/verificar?token=${encodeURIComponent(token)}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error?.mensaje ?? "Error inesperado");
        setOk(true);
        setMensaje(data.mensaje ?? "Cuenta confirmada, ya puedes entrar.");
      })
      .catch((err) => {
        setOk(false);
        setMensaje(err.message);
      });
  }, [params]);

  return (
    <section className="form-container">
      <h1>Verificación de cuenta</h1>
      <div className={`alert ${ok ? "alert-success" : "alert-info"}`}>
        {mensaje}
      </div>
      {ok && (
        <Link className="btn btn-primary" to="/Cliente/LoginRegistro">
          Ir a entrar
        </Link>
      )}
    </section>
  );
}

export default Verificar;
