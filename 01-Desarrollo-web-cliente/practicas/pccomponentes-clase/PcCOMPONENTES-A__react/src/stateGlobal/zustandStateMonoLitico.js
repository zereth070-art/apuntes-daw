/*
    modulo de codigo para definir el alamacen global de variables para todos los componenetes
del proyecto, usando la libreria de ZUSTAND

Se crea un STORE (almacen) con la funcion "create" de zustand, la cual te devuelve un HOOK que vas
a usar en los componentes para acceder a las variables globales del STORE. La funcion create recibe como
parametro una funcion:
    - el valor que devuelve la funcion, representa el objeto que contiene todas las variables globales del STORE, y todas las 
    funciones que modifican esas variables.
    - esta funcion recibe como parametros 3 valores:
            - set: <--- 1º parametro de la funcion, q es a su vez una funcion q sirve para modificar los valores del almacen
                         global dentro de la funcion creadora
            - get: <--- 2º parametro de la funcion, q es a su vez una funcion q sirve para obtener los valores del almacen
                         global dentro de la funion creadora
            - store: <--- 3º parametro es un objeto q representa el almacen global de variables, y q se puede usar dentro de la funcion creadora para acceder a los valores del store

const storeGlobal={
    datosCliente: { nombre:'', apellidos:'', cuenta:{}, direcciones:[], pedidos:[], opiniones:[] },
    accessToken: '....jwt de acceso...',
    refreshToken:'....jwt de refresco....',
    pedidoActual: { itemsPedido:[], total:0, subtotal:0, iva:0.12 },
    setPedido: ()=>{ .... },
    setAccessToken:()=>{....},

    
*/
import {create} from 'zustand'

//definicion del estado inicial del STORE, q es un objeto q contiene todas las variables globales del STORE
//util para crear un metodo de inicializacion del STORE, q se puede usar dentro de la funcion creadora para inicializar el STORE
const initialState={
    datosCliente: { 
                    nombre:'', 
                    apellidos:'', 
                    cuenta:{
                        email:'',
                        password:'',
                        activada:false,
                        fechaCreacion: 0,
                        imagenAvatar:''  
                    }, 
                    direcciones:[], 
                    pedidos:[], 
                    opiniones:[],
                    favoritos:[]
                 },
    accessToken: '',
    refreshToken:'',
    carrito: { 
                    itemsPedido:[], 
                    subtotal:0, 
                    gastosEnvio:0, 
                    iva:0.12,
                    total:0 
                },
    setDatosCliente: ()=>{},
    setAccessToken:()=>{},
    setRefreshToken:()=>{},
    setCarrito:()=>{}
}

const useGlobalStore=create(
    (set,get, store)=>{

        console.log('ejecutando funcion creadora del STORE de ZUSTAND, valor 1º paramtero funcion set():_',set.toString());
        console.log('ejecutando funcion creadora del STORE de ZUSTAND, valor 2º paramtero funcion get():_',get.toString());
        console.log('ejecutando funcion creadora del STORE de ZUSTAND, valor 3º paramtero objeto store:_',store);

        return {
            ...initialState,
            setDatosCliente: (nuevosDatos)=> set( stateAnterior => ({ ...stateAnterior, datosCliente: { ...stateAnterior.datosCliente, ...nuevosDatos } }) ),
            setAccessToken: (nuevoAccessToken)=> set( stateAnterior => ({ ...stateAnterior, accessToken: nuevoAccessToken }) ),
            setRefreshToken: (nuevoRefreshToken)=> set( stateAnterior => ({ ...stateAnterior, refreshToken: nuevoRefreshToken }) ),
            //TODO : implementar setCarrito() para actualizar el carrito de la compra, y recalcular subtotal, gastosEnvio, iva y total
            
        } //<---- este objeto del return representa el state o almacen global de variables al cual acceden los componentes usando el hook
        //devuelto por la funcion create() de zustand, en este caso useGlobalStore.
    }

)

export default useGlobalStore;