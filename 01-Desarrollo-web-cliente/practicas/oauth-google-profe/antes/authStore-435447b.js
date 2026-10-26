import { create } from "zustand";
const useAuthStore = create((set) => ({
  //recuerda que siempre el usuario es un objeto , si lo recibes que no sea a nulo, conversion a json de lo que pillamos del localstorage, que es texto plano, LO RECIBIMOS
  usuario: JSON.parse(localStorage.getItem("usuario")) ?? null,
  token: localStorage.getItem("token") ?? null,

  login: (usuario, token) => {
    //LO MANDAMOS, asi que pasamos el objeto a texto plano
    localStorage.setItem("usuario", JSON.stringify(usuario));
    localStorage.setItem("token", token);
    //modificamos el state
    set({ usuario, token });
  },
  salir: () => {
    //lo removemos del localstorage
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
    //cambiamos el state
    set({ usuario: null, token: null });
  },
}));

export default useAuthStore;
