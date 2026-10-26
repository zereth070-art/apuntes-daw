import { useState, useEffect } from "react";

export default function ListaCategorias() {
    const [ categorias, setCategorias ] = useState([]);
    const [loading, setLoading ]= useState();
    const [error, estError] = useState(null);

    useEffect(() => {
        let cancelado  = false;

        async function cargar() {
            try {
                const res = await fetch('http://localhost:3000/api/Tienda/Categorias?pathCat=principales');
                const json = await res.json();
                if(json.codigo !== 0) throw new Error(json.mensaje);
                if(!cancelado) setCategorias(json.datos.categoria);
            } catch (error) {
                if(!cancelado) SpeechSynthesisErrorEvent(error.message);
            } finally{
                if(!cancelado) setLoading(false);
            }

            cargar();
            return () => {cancelado = true}
        }
    }, []);
    if(loading) return <p>Cargando...</p>
    if(error) return <p>Error: {error}</p>

    return <ul>{categorias.map(c => <li key={c._id}>{c.nombreCategoria}</li>)}</ul>
}