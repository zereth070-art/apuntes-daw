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

    return(
        <>
            <div>
                <CajaTexto valor={nombre} setValor={setNombre} tipo={'text'}      />
                <CajaTexto valor=apellidos} setValor={setApellidos} tipo={'text'} />
            </div>
        </>
    )
}

function CajaTexto( { valor, setValor, tipo }){
return <input type={tipo} value={valor} onChange=(ev)=>setValor(ev.target.value)} />
