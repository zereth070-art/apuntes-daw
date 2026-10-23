import './index.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router'

//import App from './App.jsx'
import LoginRegistro from './componentes/zonaCliente/registro/LoginRegistro.jsx'
import Layout from './componentes/zonaTienda/Layout/Layout.jsx'
import Home from './componentes/zonaTienda/Home/Home.jsx'
import ProductosCat from './componentes/zonaTienda/Productos/ProductosCat.jsx'
//#region ------- configuracion modulo de enrutamiento react:  paquete react-router ------

//1ºpaso: instalar el paquete react-router-dom: npm install react-router --save

//2º paso: configurar las diferentes rutas a interceptar por el modulo de enrutamiento y configurar que
//componente se va a renderizar. Para hacerlo se usa la funcion: createBrowerRouter(...)
//esta funcion recibe como parametros un array de objetos js q deben implementar la clase Route de react-router
//cada objeto Route tiene al menos estas dos propiedades:
// - 'path': ruta a interceptar en el navegador
// - 'element' o 'Component': componente a renderizar cuando se intercepta la ruta

  const routerObjects=createBrowserRouter(
    [
      //---objeto route para layout principal y rutas de productos por categorias como rutas hijas...
      {  
         element: <Layout />,
         children:[
          { path:'/', element: <Home/>},
          //{ path:'Productos/Categoria/:nombreCat', element: <ProductosCat/> } //<---- objeto Route con segmento variable para usar: useParams()
           { path:'Productos', element: <ProductosCat/> }, //<------------ objeto Route con segmentos fijos y valores variables pasados por queryString para usar: useSearchParams()
           { path:'Producto/:idProducto', element: <div>Mostrar detalles del producto</div> } //<---- objeto Route con segmento variable para usar: useParams()
         ]
        }, 
      //--- objeto route para la ruta de login y registro de clientes
      { path: '/Cliente/LoginRegistro', element: <LoginRegistro /> },
      //--- objeto route para el dashboard de clientes y rutas hijas para las diferentes secciones del dashboard
      //{}
    ] //<---- array de objetos Route de react-router
  )

//3º paso: comoo compnente principal de la aplicacion se debe renderizar el componente de react-router: <RouterProvider..></RouterProvider..>
// este componente recibe como propiedades el objeto de rutas creado en el paso 2 y lo activa...

//#endregion



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={routerObjects} />
  </StrictMode>,
)

