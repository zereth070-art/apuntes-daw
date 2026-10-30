import './ListaCategorias.css';
import { useState, useEffect } from 'react';

function ListaCategorias({ pathCat='principales', onCategoriaSeleccionada, categoriaActiva }) {
    const [categorias, setCategorias] = useState([]);

    useEffect(
        ()=>{
            async function fetchCategorias(){
                try{
                    const response=await fetch(`http://localhost:3000/api/Tienda/Categorias?pathCat=${pathCat}`);
                    const bodyRespone=await response.json();
                    const { codigo, mensaje, datos }=bodyRespone;

                    if (codigo !==0) throw new Error(mensaje);

                    setCategorias(datos.categorias);

                }catch(error){
                    console.error('Error al obtener las categorias: ', error)
                    setCategorias([]);
                }
            }
            fetchCategorias();
        }
        ,[pathCat]
    )

    return (
        <ul className="list-group list-group-flush">
            {categorias.map((categoria) => (
                <li key={categoria._id} 
                    className={`list-group-item ${categoriaActiva && categoriaActiva._id === categoria._id ? 'active' : ''}`}
                    onClick={() => onCategoriaSeleccionada(categoria)}
                    style={{ cursor: 'pointer' }}
                >
                    <div className="d-flex flex-row justify-content-between align-items-center">
                        <div>
                            {categoria.icon && <img src={categoria.icon} 
                                                    alt={categoria.nombre} 
                                                    className="me-2" 
                                                    style={{ width: '20px', height: '20px' }} />}
                            {categoria.nombre}
                        </div>
                        <i className="fa-solid fa-chevron-right"></i>
                    </div>

                </li>
            ))}
        </ul>
    );
}

export default ListaCategorias;