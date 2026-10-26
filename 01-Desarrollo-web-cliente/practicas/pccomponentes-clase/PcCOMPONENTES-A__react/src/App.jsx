import './App.css'
import { useState } from 'react'

function App() {

  //let contador = 0;
  //metemos variablo contador en el STATE DEL COMPONENTE, usando hook useState()
  // useState() devuelve un array con dos elementos: el valor actual del estado y una función para actualizarlo
  
  // const valorStateContador = useState(10); // valor inicial del contador es 10
  // let contador=valorStateContador[0]; // valor actual del contador
  // let setContador=valorStateContador[1]; // funcion modificadora del valor del contador
  // console.log('valor devuelto por el hook useState() al meter variable contador  en el STATE DEL COMPONENTE: ', valorStateContador);
  // console.log('- primera posicion del array: VALOR ACTUAL de la variable....', valorStateContador[0]);
  // console.log('- segunda posicion del array: FUNCION MODIFICADORA de la variable....', valorStateContador[1].toString() );
  
    // const [ contador, setContador ] = useState(10); // valor inicial del contador es 10
    const [ nombreUsuario, setNombreUsuario ] = useState(''); // valor inicial del nombre de usuario es cadena vacia
    const [ email, setEmail ] = useState(''); // valor inicial del email es cadena vacia
    const [ password, setPassword ] = useState(''); // valor inicial del password es cadena vacia
    const [ repassword, setRepassword ] = useState(''); // valor inicial del repassword es cadena vacia

    const camposFormulario = [
      { label: "Nombre", type:"text" }, 
      { label:"Email", type:"email" }, 
      { label:"Password", type:"password" }, 
      { label:"Repassword", type:"password" }
    ];
  //el hook useState te devuelve un ARRAY con dos elementos:
  //- en la primera posicion esta el valor actual de la variable
  //- en la segunda posicion te devuelve una FUNCION QUE PERMITE ACTUALIZAR/MODIFICAR su valor desde codigo
 
  // function clickBoton(ev){
  //    console.log('evento0 interceptado en funcion click del boton...', ev);
  //    //contador++;
  //    //valorStateContador[1](valorStateContador[0]+1); //llamamos a la funcion modificadora del valor del contador, pasando el nuevo valor
  //    setContador(contador+1); //llamamos a la funcion modificadora del valor del contador, pasando el nuevo valor
  //    console.log('contador vale ahora: ', contador);

  // }

  // function changeNombre(ev){
  //   console.log('evento change del input-nombre, el valor actual de la caja de texto es....', ev.target.value);
  //   setNombreUsuario(ev.target.value); //llamo a la funcion modificadora de esta variable del state y asigno nuevo valor....
  //   console.log('nombre de usuario vale ahora: ', nombreUsuario);
  // }

  // function changeEmail(ev){
  //   console.log('evento change del input-email, el valor actual de la caja de texto es....', ev.target.value);
  //   setEmail(ev.target.value);
  //   console.log('email vale ahora: ', email);
  // }

  // function changePassword(ev){
  //   console.log('evento change del input-password, el valor actual de la caja de texto es....', ev.target.value);
  //   setPassword(ev.target.value);
  //   console.log('password vale ahora: ', password);
  // }

  // function changeRepassword(ev){
  //   console.log('evento change del input-repassword, el valor actual de la caja de texto es....', ev.target.value);
  //   setRepassword(ev.target.value);
  //   console.log('repassword vale ahora: ', repassword);
  // }

  function changeInputs(ev){
    console.log('evento change del input: ',ev, '...el valor actual de la caja de texto es....', ev.target.value);

    switch (ev.target.id) {
      case 'inputNombre': setNombreUsuario(ev.target.value);break;
      case 'inputEmail': setEmail(ev.target.value);break;
      case 'inputPassword': setPassword(ev.target.value);break;
      case 'inputRepassword': setRepassword(ev.target.value);break;
    }

  }

  //boton CREAR CUENTA SOLO SE HABILITA si las variables del state cumplen:
  //- todas rellenadas
  //- email tiene formato de email, lo suyo seria comprobar tb dominios
  //- la password entre 6 y 64 caracteres, tiene q tener MAYS, MINS, digitos y caracteres especiaels
  //- la password y repassword son iguales
  //- RECAPTCHA codigo antibot ok
  function clickCrearCuenta(){
    console.log('datos a mandar al server....', { nombreUsuario, email, password, repassword });
  }

  return (
    <>
      <h1>Vamos a comprobar lo que es el STATE de un componente de REACT</h1>
      {/* <p>Contador vale: { valorStateContador[0] }</p> <p>Contador vale: { contador }</p>
      <button className="btn btn-primary" onClick={ clickBoton }> INCREMENTA EL CONTADOR</button> */}

      {
        camposFormulario.map( campo => (
                                        <div className="m-4" key={campo.label}>
                                          <label className="form-label" htmlFor={`input${campo.label}`}>{campo.label}:</label>
                                          <input type={campo.type} 
                                                  id={`input${campo.label}`} 
                                                  className="form-control" 
                                                  placeholder={campo.label + "*"} 
                                                  onChange={ changeInputs }/>
                                        </div>
                                      )
        )
      }

      <div className="m-4 d-flex flex-row justify-content-center">
        <button type="button" className="btn btn-primary" onClick={ clickCrearCuenta }>Crear cuenta</button>
      </div>

      {/* <div className="m-4">
        <label className="form-label" htmlFor="inputNombre">Nombre Usuario: { nombreUsuario }</label>
        <input type="text" 
                id="inputNombre" 
                className="form-control" 
                placeholder="Nombre*" 
                onChange={ changeNombre }/>
      </div>

      <div className="m-4">
        <label className="form-label" htmlFor="inputEmail">Email: { email }</label>
        <input type="email" 
                id="inputEmail" 
                className="form-control" 
                placeholder="Email*" 
                onChange={ changeEmail }/>
      </div>

      <div className="m-4">
        <label className="form-label" htmlFor="inputPassword">Contraseña: { password }</label>
        <input type="password" 
                id="inputPassword" 
                className="form-control" 
                placeholder="Contraseña*" 
                onChange={ changePassword }/>
      </div>

      <div className="m-4">
        <label className="form-label" htmlFor="inputRepassword">Repetir Contraseña: { repassword }</label>
        <input type="password" 
                id="inputRepassword" 
                className="form-control" 
                placeholder="Repetir Contraseña*" 
                onChange={ changeRepassword }/>
      </div> */}

    </>
  )
}

export default App
