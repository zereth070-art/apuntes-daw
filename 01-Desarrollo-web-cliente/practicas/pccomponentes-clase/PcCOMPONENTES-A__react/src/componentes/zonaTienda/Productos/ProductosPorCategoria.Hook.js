import { useState, useEffect } from 'react';

const API_PRODUCTOS = 'http://localhost:3000/api/Tienda/Productos'

export default function useProductosPorCategoria(pathCat) {
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!pathCat) { return; }
        async function fetchProductos() {
            setCargando(true);
            setError(null);

            const petProductos=await fetch(`${API_PRODUCTOS}?pathCat=${pathCat}`);
            const respuesta=await petProductos.json();

            if (respuesta.codigo !== 0) throw new Error(`Error al obtener los productos: ${respuesta.mensaje}`);
            
            setProductos(respuesta.datos?.productos ?? []);
            setCargando(false);
        }

        fetchProductos();
    }, [pathCat]);

   return { productos, cargando, error };
}