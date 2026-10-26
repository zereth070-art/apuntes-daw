import './LoginRegistro.css';
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router';
import useStore  from '../../../stateGlobal/zustandStateSlices';

function LoginRegistro(){
    const navigate = useNavigate();
    const { setDatosCliente, setAccessToken, setRefreshToken, setSesionIniciada }=useStore();
    const [ enLogin, setEnLogin ] = useState(false); // valor inicial es false, es decir, estamos en modo registro
    const [ formData, setFormData ] = useState(
        {
            nombre:'',
            email:'',
            password:'',
            repassword:''
        }
    )
    const divErrores=useRef(null); //referencia al div donde se muestran los mensajes de error del formulario de login/registro

    //efecto que se ejecuta cuando se carga el componente, añade manejador de eventos "message" para recibir mensajes del popup
    //de login con google

    useEffect(
        ()=>{
            window.addEventListener('message', (evento)=>{
                console.log('evento message recibido del popup de login con google, datos mandados por popup: ', evento.data);
                
                if(evento.data.codigo !== 0) {
                    console.log('error al hacer login con google: ', evento.data.mensaje);
                    //muestro mensaje de error en el div de mensajes de error del formulario de login/registro
                    //en divErrores esta la referencia al <div...> del DOM de react donde quiero mostrarlos
                    //es un objeto: { current: ...... }
                    if(divErrores.current){
                        divErrores.current.innerHTML=`
                            <div class="alert alert-danger" role="alert">
                                ${evento.data.mensaje}
                            </div>
                        `;
                    }

                } else {
                    //1º cerrar el popup de login con google
                    evento.source.close();

                    //2º guardar en el store global de zustand los datos del cliente y los tokens JWT....
                    setDatosCliente(evento.data.datos.cliente);
                    setAccessToken(evento.data.datos.accessToken||'');
                    setRefreshToken(evento.data.datos.refreshToken||'');
                    setSesionIniciada(true);
                    
                    //3º redireccionar a la pagina principal de la tienda
                    navigate('/');

                }
            });
        },[navigate, setDatosCliente, setAccessToken, setRefreshToken, setSesionIniciada]
    )


    // const [ nombreUsuario, setNombreUsuario ] = useState(''); // valor inicial del nombre de usuario es cadena vacia
    // const [ email, setEmail ] = useState(''); // valor inicial del email es cadena vacia
    // const [ password, setPassword ] = useState(''); // valor inicial del password es cadena vacia
    // const [ repassword, setRepassword ] = useState(''); // valor inicial del repassword es cadena vacia

    const camposFormulario = [
      { id: "nombre", label: "Nombre", type:"text", apareceEnLogin: false }, 
      { id: "email", label:"Email", type:"email", apareceEnLogin: true }, 
      { id: "password", label:"Password", type:"password", apareceEnLogin: true }, 
      { id: "repassword", label:"Repassword", type:"password", apareceEnLogin: false }
    ];


 function changeInputs(ev){
    console.log('evento change del input: ',ev);
    console.log( '...el valor actual de la caja de texto es....', ev.target.value);
    console.log('el id del input es: ', ev.target.id);

    //Solo tengo la funcion modificadora setFormData para cambiar el objeto del state ¿como la uso
    //para cambiar el valor de la propiedad del objeto que corresponde al input que ha cambiado?

    setFormData(
        { ...formData, [ev.target.id]: ev.target.value }
   );

   console.log('el objeto formData actualizado es: ', formData);

    // switch (ev.target.id) {
    //   case 'inputNombre': setNombreUsuario(ev.target.value);break;
    //   case 'inputEmail': setEmail(ev.target.value);break;
    //   case 'inputPassword': setPassword(ev.target.value);break;
    //   case 'inputRepassword': setRepassword(ev.target.value);break;
    // }

  }

  async function clickSendDataToServer(){
    try{
        //console.log('datos a mandar al server....', { nombreUsuario, email, password, repassword });
        console.log('datos a mandar al server....', formData );

        const urlEndPoint = `http://localhost:3000/api/Cliente/${ enLogin ? 'Login' : 'Registro' }`;
        const petServer=await fetch(urlEndPoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
       
        const datosRespuesta=await petServer.json();
        console.log('datosRespuesta del server: ', datosRespuesta);
        if(datosRespuesta.codigo !==0 ) throw new Error(datosRespuesta.mensaje);

        //si llegamos aqui es que el login o registro ha sido correcto, guardamos en el store global los datos del cliente y los
        //tokens SI ESTAMOS EN EL LOGIN, en registro no se manda nada, solo mensaje de activar cuenta...
        if(enLogin){
            setDatosCliente(datosRespuesta.datos.cliente);
            setAccessToken(datosRespuesta.datos.accessToken||'');
            setRefreshToken(datosRespuesta.datos.refreshToken||'');
            setSesionIniciada(true);
        }
        navigate('/'); //redireccionamos a la pagina principal de la tienda

    } catch(error){
        console.log('error al crear cuenta: ', error);
    }
  }

  async function handlerGoogleLoginClick(){
        try{
            const urlPopupGoogle=await fetch('http://localhost:3000/api/Cliente/LoginGoogle');
            const datosPopupGoogle=await urlPopupGoogle.json();
            console.log('urlPopupGoogle: ', datosPopupGoogle.datos.url);
            
            window.open(datosPopupGoogle.datos.url, 'popupGoogle', 'width=600,height=600');

        } catch(error){
            console.log('error al hacer login con google: ', error);
        }
    }
 

    return <div className="container">
        
        <div className="row">
            <div className="col-12 d-flex flex-row align-items-center justify-content-center">
                <img  src="/imagenes/logo_pccomponentes.png" alt="logo" className="logo"/>
            </div>
        </div>

        <div className="row">
            
            <div className="col-6">
                <img src="/imagenes/loginRegistro_info.png" alt="loginRegistro_info" style={ { width: "500px", height: "500px"} }/>
            </div>
            
            <div className="col-6">
                {/* Formulario de Login o Registro en funcion de url o accion evento boton crearCuenta/iniciar Sesion */}
                <div className="container">
                    
                    <div className="row"><div className="col"><h4><strong>{ enLogin ? "Iniciar sesión" : "Crear cuenta" }</strong></h4></div></div>
                    <div className="row m-3">
                        <div className="col d-grid gap-1">
                            <button type="button" 
                                    id="btnlogingmail"
                                    className="btn btn-light btn-sm"
                                    onClick={ handlerGoogleLoginClick } >
                                <img  src="/imagenes/boton_login_GMAIL.png"/>
                            </button>
                        </div>
                    </div>

                    {/* div para MOSTRAR MENSAJES DE ERROR durante el LOGIN/REGISTRO */}
                    <div className="row m-3" ref={divErrores}></div>


                    <div className="row"><div className="col m-4"><h6><span> O bien </span></h6></div></div>

                    <div className="row">
                        <div className="col-12">
                        {
                            camposFormulario.filter( campo => enLogin ? campo.apareceEnLogin : true )
                                            .map( campo => (
                                                            <div className="form-floating m-4" key={campo.label}>
                                                                <input type={campo.type} 
                                                                        id={`${campo.id}`} 
                                                                        className="form-control" 
                                                                        placeholder={campo.label + "*"} 
                                                                        onChange={ changeInputs }/>
                                                                <label className="form-label" htmlFor={`input${campo.id}`}>{campo.label}:</label>
                                                            </div>
                                                        )
                            )
                        }
                        {       
                            ! enLogin &&
                            <>                           
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
                                    <label className="form-check-label" for="flexCheckDefault">
                                        He leido y acepto la <a href="">politica de privacidad</a>
                                    </label>
                                </div>

                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" value="" id="flexCheckChecked"/>
                                    <label className="form-check-label" for="flexCheckChecked">
                                        Recibir <strong>descuentos exclusivos</strong>, novedades y tendencias por e-mail. Me puedo dar de baja desde mi panel.
                                    </label>
                                </div>                                
                            </>
                        }
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-12 d-grid gap-1 mt-4 mb-4">
                            <button type="button" className="btn  pccomponentes-primary" onClick={ clickSendDataToServer }>
                            {
                                enLogin ?
                                <span>Iniciar sesion</span> 
                                :
                                <span>Crear cuenta</span>
                            }
                            </button>
                        </div>
                    </div>

                    <hr></hr>
                        <div className="row">
                            <div className="col m-4">
                                <h6><span> { enLogin ? '¿Eres nuevo cliente?':'Ya tengo una cuenta'} </span></h6>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col d-grid gap-1">
                                <button type="button"  className="btn btn-outline-secondary" onClick={() => setEnLogin(!enLogin)}>
                                    <span> { enLogin ? 'Crear cuenta' : 'Iniciar Sesion' }</span>
                                </button>
                            </div>
                        </div>



                </div>
            </div>
        </div>



    </div>

}

export default LoginRegistro;