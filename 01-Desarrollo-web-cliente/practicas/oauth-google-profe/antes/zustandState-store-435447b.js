//modelo de cofigo para definir las variables globales para todos los componentes
//del proyecto react
//Se crea una Store (almacen) con la funcion 'create' de zustand,
// la cual te devuelve un Hook que vas a usar en los componentes
// para acceder a las variables globales de STORE
/*const storeGlobal={
    datosCliente: { nombre:'', apellidos:'', cuenta:{}, direcciones:[], pedidos:[], opiniones:[] },
    accessToken: '....jwt de acceso...',
    refreshToken:'....jwt de refresco....',
    pedidoActual: { itemsPedido:[], total:0, subtotal:0, iva:0.12 },
    setPedido: ()=>{ .... },
    setAccessToken:()=>{....} */
import { create } from "zustand";

const useGlobalStore = create({
  datosCliente: 
}
);

export default useGlobalStore;
