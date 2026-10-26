import { useState, useEffect } from 'react';

export default function useCategorias(pathCat='principales'){

    const [ categorias, setCategorias ] = useState([]);

    useEffect(
        ()=>{
            async function fetchCategorias(){
                try{
                    const petCats=await fetch(`http://localhost:3000/api/Tienda/Categorias?pathCat=${pathCat}`);
                    const {codigo, mensaje, datos}=await petCats.json();

                    if (codigo !==0) throw new Error(mensaje);

                    setCategorias( datos.categorias );
                }
                catch(error){
                    console.log(`error al recuperar categorias: ${error}`);
                    setCategorias([]);				
                }
            }
            fetchCategorias
        },
        [pathCat]
    )
    return { categorias }; //<---- igual que poner: return { categorias: categorias };

}