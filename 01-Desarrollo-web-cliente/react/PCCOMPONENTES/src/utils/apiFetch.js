export async function apiFetch(ruta, opciones = {}) {
  const token = localStorage.getItem("token");
  const headers = { ...(opciones.headers ?? {}) };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(ruta, { ...opciones, headers });

  if (res.status === 401) {
    localStorage.removeItem("token");
  }

  return res;
}



