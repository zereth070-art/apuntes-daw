============================================================
COMUNICACION ENTRE COMPONENTEWS DE REACT
============================================================
1ºCaso) realacion parenal directa PADRE ---> HIJO mediante eluso de las "propiedades" que recibe un componente

Cunado creas un componente recibe como parametro en la funcion que define el componente un parametro llamado "props" <===== predefinido por react

q se usa para recibir los valores que pasa del componente padre a dichos COMPONENTEWS

    function ComponentePadre() {
    .....
    const [ state1, setState1] = useState(valor_inicial)
    const [ state1, setState1] = useState(valor_inicial)
    ....

    return{
    <>
        <ComponenteHijo atributo={state1} atributo={state2} ...../>
    </>
    }
    }

    en el componente hijo en el parametro "props" de su funcion de definicion, se va a recibir un objeto JS que tiene como propiedadesel nombre de esos atributos y como valores, los valores que le asigna el componente padre

            funcion ComponenteHijo(props) {
            console.log(`valores pasados por el componente padre.... ${props}`); ====> en props = {atributo1=...., atributo2=.....}
            }

para acortar se suele desestructurar el objeto "props" en la definicion de la funcion del comp. hijo:

function ComponenteHijo({ atributo1, atributo2, ...}) {
            console.log(`valores pasados por el componente padre.... ${props}`);
}

SI QUIERO MODIFICAR VALORES DEFINIDOS en el componente padre desde el componente hijo:
----------------------------------------------------------------------------------------
se pasan como propiedades al componente hijo las funciones de MODIFICACION de valores:

    function ComponentePadre() {
        .....
        const [ state1, setState1] = useState(valor_inicial)
        const [ state1, setState1] = useState(valor_inicial)
        ....

        return{
        <>
            <ComponenteHijo atributo={state1} atributo2={setState1} atributo3={state3} ...../>
        </>                                   ---------------------
        }                                           \--> en el atributo2 esta la funcion, una REFERENCIA para  modificar el valor del state1 del componete padre
    }
                            // valor    funcion    valores
      funcion ComponenteHijo(atributo1, atributo2, atributo3...) {
            console.log(`valores pasados por el componente padre.... ${props}`); ====> en props = {atributo1=...., atributo2=.....}
            }




import CajaTexto from .....

function Formulario(){
    const [nombre, setNombre]  = useState('');
    const [apellidos, setApellidos]  = useState('');
    const [password, setPassword]  = useState('');

    return(
        <>
            <div>
                <CajaTexto valor={nombre} setValor={setNombre} tipo={'text'}      />
                <CajaTexto valor=apellidos} setValor={setApellidos} tipo={'text'} />
                <CajaTexto valor=password} setValor={setPassword} tipo={'password'} />
            </div>
        </>
    )
}

function CajaTexto( { valor, setValor, tipo }){
return <input type={tipo} value={valor} onChange=(ev)=>setValor(ev.target.value)} />

PROBLEMA muy tipico: PROP-DRILLING
==================================
paso de valores comp.padre a comp.hijos a un nivel de profundidad mayor que el parentel directo, pasando los valores como props por los componentes intermedios sin que haga uso de ellos: Ej: el componente Header recibe como props datos de cliente desde el comp.padre Layout sin neceistar solo para podder pasarselos como props a su componente hijo <SessionButton...> q si los necesita

    Layout <=== en el layout recibo de nodejs los datos del cliente que ha iniciado sesion cuando invoca a /api/Cliente/Login el componente ClienteRegistro.jsx
    |
    |------ Header <=== recibe como props datos del cliente, no los necesita, pero se los pasa a SessionButton
    |         |
    |         | -> OffCanvas
    |         |--------- SessionButton <==== quiero recibir los datos del cliente, si los tiene muestra av  atar - Hola  |nombre, sino "Iniciar sesion"
    | ---- <Outlet /> <==== seria el body variable
    | ---footer

    function Layout(){
        const [datosCliente, setDatosCliente ] = useState({});
        ...
        return <div>
            <Header datosCli={datosCliente}/>
            <Outlet>
            <Footer>
        </div>
    }

    function Header({ datosCli }){ <--------------- recibo el comp.padre Layout los datos del cliente, y los paso sin mas al comp.hijo SessionButton

        return <navBar>
            <img src="..."/>
            <OffCanvas/>
            <SessionButton datosCli={datosCli}>
        </navBar>
}
    }
    }

    function SessionButton( {datosCli} ) { <================== recibido del comp.padre Layout los datos del cliente y los pasos sin mas al comp.hijo SessionButton

        return <button class="btn btn-light">{datosCli.nombre !=='' ?
            <>
                <img src={datosCli.cuenta.imagenAvatar} alt='avatar-cliente'/>
                    Hola, Bienvenido  {datosCli.nombre}
            </>
        }
    }

SOLUCIONES AL PROP-DRILLING
===========================
- usando contextApi de React:
            funciones: createContext(valor_inicial) y hook: useContext()
            POR NUESTRA CUENTA

-usando librerias para manejar el state global de la aplicacion: SON librerias que crean un STATE con variables para poder usarse para todos los componentes de la aplicacion (aunque no tengan relacion parental alguna). Librerias que se usan:
    -REDUX
    - Tanstack-Query
    -zustand
        1º) paso: instalacion
        2º paso) crear un store de zustand (almacen global del connunto de variables para usar entre componentes)

