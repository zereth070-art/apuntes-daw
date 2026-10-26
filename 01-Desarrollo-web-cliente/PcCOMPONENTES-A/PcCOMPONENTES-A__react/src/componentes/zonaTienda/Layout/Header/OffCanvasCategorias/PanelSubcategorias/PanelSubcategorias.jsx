import './PanelSubcategorias.css'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
//import useCategorias from './PanelSubcategorias.Hook.js'
import useCategorias from '../../../../../../customHooks/Categorias.Hook.js'
import DropDownSubcategorias from './DropDownSubcategorias/DropDownSubcategorias.jsx'



function PanelSubcategorias({ categoriaPadre, onClose }) {
    const navigate = useNavigate();
    
    //const { categorias, cargando, error } = useCategorias(categoriaPadre?.pathCat)
    const { categorias:categorias2orden}=useCategorias(categoriaPadre?.pathCat)

    const [subcategoriaAbierta, setSubcategoriaAbierta] = useState(null)

    return (
        <aside className={`panel-subcategorias ${categoriaPadre ? 'abierto' : ''}`}
               aria-hidden={!categoriaPadre}>
            {categoriaPadre && (
                <>
                    <div className="panel-subcategorias-header">
                        <h5>{categoriaPadre.nombre}</h5>
                        <button type="button"
                                className="btn-close"
                                aria-label="Cerrar subcategorias"
                                onClick={onClose} />
                    </div>
                    <hr />
                    <div className="panel-subcategorias-body">
                        {/* {cargando && <p className="text-muted">Cargando subcategorias...</p>}
                        {error && <p className="text-danger">Error: {error}</p>}
                        {!cargando && !error && categorias.length === 0 && (
                            <p className="text-muted">No hay subcategorias</p>
                        )} */}
                        { categorias2orden.length === 0 && (
                            <p className="text-muted">No hay subcategorias</p>
                        )}
                        
                        {/* {!cargando && !error && categorias.length > 0 && ( */}
                        { categorias2orden.length > 0 && (
                            <ul className="list-unstyled m-0">
                                {categorias2orden.map(subcategoria => (
                                    <DropDownSubcategorias
                                        key={subcategoria._id}
                                        subcategoria={subcategoria}
                                        abierta={subcategoriaAbierta?._id === subcategoria._id}
                                        onClick={
                                            () => {
                                                    setSubcategoriaAbierta(actual => (actual?._id === subcategoria._id ? null : subcategoria));
                                                    navigate(`/Productos?pathCat=${subcategoria.pathCat}`);
                                            }
                                        }
                                    />
                                ))}
                            </ul>
                        )}
                    </div>
                </>
            )}
        </aside>
    )
}



export default PanelSubcategorias