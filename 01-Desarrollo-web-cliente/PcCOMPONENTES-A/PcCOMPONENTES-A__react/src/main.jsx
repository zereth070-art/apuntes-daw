import './index.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router'
import GetProductoLoader from './loaders/GetProductoLoader.js'
import LoginRegistro from './componentes/zonaCliente/registro/LoginRegistro.jsx'
import Layout from './componentes/zonaTienda/Layout/Layout.jsx'
import Home from './componentes/zonaTienda/Home/Home.jsx'
import ProductosCat from './componentes/zonaTienda/Productos/ProductosCat.jsx'
import DetallesProducto from './componentes/zonaTienda/DetallesProducto/DetallesProducto.jsx'

const routerObjects = createBrowserRouter([
  //--- layout principal y sus rutas hijas
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      // segmentos fijos + valores por querystring: useSearchParams()
      { path: 'Productos', element: <ProductosCat /> },
      // segmento variable: params.idProducto en el loader
      {
        path: 'DetallesProducto/:idProducto',
        loader: GetProductoLoader,
        middleware: [
          function middleware1({context, params, request, url}, next) {
            console.log(" ========> ejecutando antes de renderizar el componete DetallesProducto.jsx")
            next();
          },
          function middleware2({context, params, request, url}, next) {
              console.log("========> middleware de vuelta")
            next();
            }

        ],
        element: <DetallesProducto />
      }
    ]
  },
  //--- login y registro de clientes
  { path: '/Cliente/LoginRegistro', element: <LoginRegistro /> }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={routerObjects} />
  </StrictMode>
)