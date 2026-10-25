const initialClienteState ={
    datosCliente: { 
                    nombre:'', 
                    apellidos:'', 
                    cuenta:{
                        email:'',
                        password:'',
                        activada:false,
                        telefono:'',
                        fechaCreacion: 0,
                        imagenAvatar:''  
                    }, 
                    direcciones:[], 
                    pedidos:[], 
                    opiniones:[],
                    favoritos:[]
                 },
    setDatosCliente: ()=>{},
    resetDatosCliente: ()=>{}
}

export const ClienteSlice = (set, get, store) =>{

    return {
        ...initialClienteState,
        setDatosCliente: (nuevosDatos)=> set( stateAnterior => ({ ...stateAnterior, datosCliente: { ...stateAnterior.datosCliente, ...nuevosDatos } }) ),
        resetDatosCliente: ()=> set( stateAnterior => ({ ...stateAnterior, ...initialClienteState }) )
    } //<--- objeto q devuelve el slice de Cliente  se incruta en store-global
}