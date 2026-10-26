import { Link } from "react-router";
import useAuthStore from "../store/authStore.js";

export default function Home() {
  const { datosCliente, sesionIniciada, cerrarSesion } = useAuthStore();

  return (
    <main style={{ fontFamily: "system-ui", padding: 24 }}>
      <h1>PCCOMPONENTES (version profe)</h1>
      {sesionIniciada ? (
        <>
          <p>
            Sesion iniciada como <strong>{datosCliente?.nombre}</strong> (
            {datosCliente?.cuenta?.email})
          </p>
          <button onClick={cerrarSesion}>Cerrar sesion</button>
        </>
      ) : (
        <>
          <p>No has iniciado sesion.</p>
          <Link to="/login">Ir a login</Link>
        </>
      )}
    </main>
  );
}
