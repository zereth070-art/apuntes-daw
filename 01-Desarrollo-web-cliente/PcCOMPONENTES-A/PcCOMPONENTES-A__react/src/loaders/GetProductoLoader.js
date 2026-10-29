const cache = new Map();
export default async function loaderProducto({ params }) {
    const { idProducto } = params;
    if(cache.has(idProducto)){
        console.log(['[LOADER] Usando caché para ', idProducto]);
        return cache.get(idProducto);
    }
    try {
        const res = await fetch(`http://localhost:3000/api/Tienda/Producto/${idProducto}`);
        const { codigo, datos } = await res.json()
        const producto = codigo === 0 ? datos.producto : null
        cache.set(idProducto, producto);
        return producto;
    } catch (error) {
        console.error(`Error al cargar el producto: ${error.message}`)
        return null
    }
}