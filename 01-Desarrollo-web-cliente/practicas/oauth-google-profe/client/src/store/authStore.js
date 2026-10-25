import { create } from "zustand";

// Store global tal como lo plantea el profe: datos del cliente + tokens
// separados (accessToken / refreshToken) + flag de sesion iniciada.
const useAuthStore = create((set) => ({
  datosCliente: JSON.parse(localStorage.getItem("datosCliente")) ?? null,
  accessToken: localStorage.getItem("accessToken") ?? null,
  refreshToken: localStorage.getItem("refreshToken") ?? null,
  sesionIniciada: localStorage.getItem("sesionIniciada") === "true",

  setDatosCliente: (datosCliente) => {
    localStorage.setItem("datosCliente", JSON.stringify(datosCliente));
    set({ datosCliente });
  },
  setAccessToken: (accessToken) => {
    localStorage.setItem("accessToken", accessToken);
    set({ accessToken });
  },
  setRefreshToken: (refreshToken) => {
    localStorage.setItem("refreshToken", refreshToken);
    set({ refreshToken });
  },
  setSesionIniciada: (sesionIniciada) => {
    localStorage.setItem("sesionIniciada", String(sesionIniciada));
    set({ sesionIniciada });
  },
  cerrarSesion: () => {
    localStorage.removeItem("datosCliente");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.setItem("sesionIniciada", "false");
    set({
      datosCliente: null,
      accessToken: null,
      refreshToken: null,
      sesionIniciada: false,
    });
  },
}));

export default useAuthStore;
