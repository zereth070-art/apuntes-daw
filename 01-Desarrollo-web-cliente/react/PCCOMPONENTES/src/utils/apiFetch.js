import useAuthStore from "../store/authStore.js";

export async function apiFetch(ruta, opciones = {}) {
  const token = localStorage.getItem("token");
  const headers = { ...(opciones.headers ?? {}) };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(ruta, { ...opciones, headers });

  if (res.status === 401) {
    // Leemos el cuerpo de una COPIA para mirar el codigo sin quedarnos sin el.
    // clone() va antes de leer; el .catch evita que una respuesta sin JSON reviente.
    const data = await res.clone().json().catch(() => null);

    // El backend ya distingue el motivo del 401:
    //   CREDENCIALES      -> el usuario se ha equivocado al entrar. NO es su sesion.
    //   TOKEN_CADUCADO /  -> su sesion ya no vale. Si deja su sesion,
    //   TOKEN_INVALIDO       la cabecera seguira diciendo "Hola, javier" sin funcionar nada.
    //   (o que no haya codigo) -> por seguridad cerramos tambien (fail closed).
    if (data?.error?.codigo !== "CREDENCIALES") {
      useAuthStore.getState().salir();
    }
  }

  return res;
}