import './ProductosCat.css'
//import { useParams } from 'react-router' //<---- hook de react-router para interceptar segmentos variables en url
import { useSearchParams } from 'react-router' //<---- hook de react-router para interceptar valores variables por query string en url
import useProductosPorCategoria from './ProductosPorCategoria.Hook.js'
import MiniProducto from './MiniProducto/MiniProducto.jsx'

function ProductosCat(){
    //---- hook para interceptar segmentos variables en URL -----------------
    // const valorDevueltoPorHookUseParams=useParams() //<--- el hook useParams() de react-router nos permite acceder a los parametros de la url
    // console.log('valorDevueltoPorHookUseParams: ', valorDevueltoPorHookUseParams) //<--- el hook useParams() de react-router nos permite acceder a los parametros de la url
    //const { nombreCat } = useParams();
    
    //---- hook para interceptar valores variables por query string en URL -----------------
    // const valorDevueltoPorHookUseSearchParams=useSearchParams() //<--- el hook useSearchParams() de react-router nos permite acceder a los parametros de la url
    // console.log('valorDevueltoPorHookUseSearchParams: ', valorDevueltoPorHookUseSearchParams) //<--- el hook useSearchParams() de react-router nos permite acceder a los parametros de la url
    const [searchParams, setSearchParams] = useSearchParams() //<--- el hook useSearchParams() de react-router nos permite acceder a los parametros de la url    
    // console.log('valor de 1º posicion array devuelve hook: ', searchParams);
    // console.log('valor de 2º posicion array devuelve hook: ', setSearchParams);
    
    const pathCat = searchParams.get('pathCat') //<--- el hook useSearchParams() de react-router nos permite acceder a los parametros de la url
    const { productos, cargando, error } = useProductosPorCategoria(pathCat);

    if (cargando) {
        return <div className="d-flex flex-column justify-content-center align-items-center ">Cargando...</div>
    }

    if (error) {
        return <div className="d-flex flex-column justify-content-center align-items-center ">Error: {error}</div>
    }

    return (
        <div className="d-flex flex-column justify-content-center align-items-center ">
        {
            productos.length === 0 ? (
                <div className="text-muted">No hay productos en esta categoría</div>
            ) : (
                <div className="productos-cat-grid">
                    {
                        productos.map(
                            producto => (
                                    <div key={producto._id} className="producto-cat-item">
                                        <MiniProducto producto={producto} />
                                    </div>
                            )
                        )
                    }
                </div>
            )
        }
        </div>
    )
}

export default ProductosCat