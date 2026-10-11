export async function apiFetch(ruta, opciones = {}, res) {
  const token = localStorage.getItem("token");
  const headers = { ...(opciones.headers ?? {}) };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

}
