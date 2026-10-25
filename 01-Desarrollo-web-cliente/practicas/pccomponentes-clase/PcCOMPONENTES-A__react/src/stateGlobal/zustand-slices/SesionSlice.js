const initialSesionState = {
    sesionIniciada: false,
    accessToken: '',
    refreshToken: '',
    setSesionIniciada: ()=>{},
    setAccessToken:()=>{},
    setRefreshToken:()=>{},
    resetSesion:()=>{}
}


export const SesionSlice = (set, get, store) =>{
    return {
        ...initialSesionState,
        setSesionIniciada: (nuevoValor)=> set( stateAnterior => ({ ...stateAnterior, sesionIniciada: nuevoValor }) ),
        setAccessToken: (nuevoAccessToken)=> set( stateAnterior => ({ ...stateAnterior, accessToken: nuevoAccessToken }) ),
        setRefreshToken: (nuevoRefreshToken)=> set( stateAnterior => ({ ...stateAnterior, refreshToken: nuevoRefreshToken }) ),
        resetSesion: ()=> set( stateAnterior => ({ ...stateAnterior, ...initialSesionState }) )
    
    } //<--- objeto q devuelve el slice de Sesion  se incruta en store-global
}