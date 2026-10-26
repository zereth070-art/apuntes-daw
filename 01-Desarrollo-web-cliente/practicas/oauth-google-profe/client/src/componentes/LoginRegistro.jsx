import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import useAuthStore from "../store/authStore.js";

// Version del PROFESOR: login con Google por popup.
//  - useRef para la referencia del popup (elPopupRef)
//  - useRef para el <div> de errores (divErrores) rellenado con innerHTML
//  - contrato del postMessage: { codigo, mensaje, datos:{ cliente, token } }
function LoginRegistro() {
  const navigate = useNavigate();

  const setDatosCliente = useAuthStore((e) => e.setDatosCliente);
  const setAccessToken = useAuthStore((e) => e.setAccessToken);
  const setRefreshToken = useAuthStore((e) => e.setRefreshToken);
  const setSesionIniciada = useAuthStore((e) => e.setSesionIniciada);

  const elPopupRef = useRef(null);
  const divErrores = useRef(null);

  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    const recibirMensaje = (evento) => {
      // SEGURIDAD: solo mensajes de nuestro propio origen.
      if (evento.origin !== window.location.origin) return;

      console.log(
        "evento message recibido del popup de login con google, datos mandados por popup:",
        evento.data,
      );

      if (evento.data.codigo !== 0) {
        console.log("error al hacer login con google:", evento.data.mensaje);
        // mostramos el mensaje en el div de errores, accediendo al DOM de
        // React con la ref (objeto { current: ... })
        if (divErrores.current) {
          divErrores.current.innerHTML = `
            <div class="alert alert-danger" role="alert">
              ${evento.data.mensaje}
            </div>
          `;
        }
        return;
      }

      // 1º cerrar el popup de login con google
      elPopupRef.current?.close();

      // 2º guardar en el store global de zustand los datos del cliente y los
      //    tokens JWT
      setDatosCliente(evento.data.datos.cliente);
      setAccessToken(evento.data.datos.token || "");
      setRefreshToken(evento.data.datos.refreshToken || "");
      setSesionIniciada(true);

      // 3º redireccionar a la pagina principal de la tienda
      navigate("/");
    };

    window.addEventListener("message", recibirMensaje);
    return () => window.removeEventListener("message", recibirMensaje);
  }, [navigate, setDatosCliente, setAccessToken, setRefreshToken, setSesionIniciada]);

  async function handlerGoogleLoginClick() {
    try {
      setCargando(true);
      // El popup se abre primero, de forma sincrona, con pagina en blanco.
      const popup = window.open("", "popupGoogle", "width=600,height=600");
      if (!popup) {
        if (divErrores.current) {
          divErrores.current.innerHTML =
            '<div class="alert alert-danger" role="alert">El navegador ha bloqueado la ventana de Google.</div>';
        }
        return;
      }
      // guardamos la referencia para poder cerrarlo desde el useEffect
      elPopupRef.current = popup;

      // ruta relativa: pasa por el proxy de Vite (mismo origen => sin CORS)
      const respuesta = await fetch("/api/Cliente/LoginGoogle");
      const datos = await respuesta.json();
      if (!respuesta.ok || datos.codigo !== 0)
        throw new Error(datos.mensaje ?? "No se pudo iniciar el login con Google");

      // ya tenemos la URL: el popup se va a la pagina de Google
      popup.location.href = datos.datos.url;
    } catch (error) {
      console.error("error al hacer login con google: ", error);
      if (divErrores.current) {
        divErrores.current.innerHTML = `
          <div class="alert alert-danger" role="alert">${error.message}</div>
        `;
      }
    } finally {
      setCargando(false);
    }
  }

  return (
    <section className="form-container">
      <h1>Inicio de sesion de cliente</h1>

      {/* div de errores: el profe lo rellena con innerHTML desde el useEffect */}
      <div ref={divErrores}></div>

      <button
        type="button"
        id="btnlogingmail"
        className="btn btn-light btn-sm"
        onClick={handlerGoogleLoginClick}
        disabled={cargando}
      >
        {cargando ? "Abriendo Google..." : "Iniciar sesion con Google"}
      </button>
    </section>
  );
}

export default LoginRegistro;
