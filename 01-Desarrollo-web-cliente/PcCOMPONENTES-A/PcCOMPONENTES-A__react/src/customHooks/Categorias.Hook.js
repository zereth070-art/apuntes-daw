import { useState, useEffect } from 'react';

export default function useCategorias(pathCat = 'principales'){

    const [ categorias, setCategorias ] = useState([]);
    const pathCatSeguro = pathCat === null || pathCat === undefined || pathCat === '' ? 'principales' : pathCat;

    useEffect(
        ()=>{
            async function fetchCategorias(){
                try{
                    const petCats = await fetch(`http://localhost:3000/api/Tienda/Categorias?pathCat=${encodeURIComponent(pathCatSeguro)}`);
                    const {codigo, mensaje, datos} = await petCats.json();

                    if (codigo !== 0) throw new Error(mensaje);

                    setCategorias(datos.categorias || []);
                }
                catch(error){
                    console.log(`error al recuperar categorias: ${error}`);
                    setCategorias([]);				
                }
            }
            fetchCategorias();
        },
        [pathCatSeguro]
    )
    return { categorias };

}