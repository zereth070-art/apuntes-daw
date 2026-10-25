import { create } from 'zustand';

import { ClienteSlice } from './zustand-slices/ClienteSlice';
import { CarritoSlice } from './zustand-slices/CarritoSlice';
import { SesionSlice } from './zustand-slices/SesionSlice';

const useStore=create(
    (get,set,store)=>{
        console.log('ejecutando funcion creadora del STORE de ZUSTAND, valor 1º paramtero funcion set():_',set.toString());
        console.log('ejecutando funcion creadora del STORE de ZUSTAND, valor 2º paramtero funcion get():_',get.toString());
        console.log('ejecutando funcion creadora del STORE de ZUSTAND, valor 3º paramtero objeto store:_',store);
        return {
            ...ClienteSlice(get, set, store),
            ...CarritoSlice(get, set, store),
            ...SesionSlice(get, set, store)
        } //<---- objeto global del store al cual tienen acceso todos los componentes 
        //usando el hook useStore() q devuelve este objeto global del store
    }

)

export default useStore;