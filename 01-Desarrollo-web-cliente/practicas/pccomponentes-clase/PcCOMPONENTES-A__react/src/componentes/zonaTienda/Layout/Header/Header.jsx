import './Header.css'
import { useNavigate } from 'react-router'
import useStore from '../../../../stateGlobal/zustandStateSlices.js'
import OffCanvasCats from './OffCanvasCategorias/OffCanvasCats.jsx'
import SessionButton from './SessionButton/SessionButton.jsx'

function Header(){
  const { datosCliente }=useStore(); //<--- hook de ZUSTAND q devuelve el objeto global del store al cual tienen acceso todos los componentes de la app
  const saltarAUrl=useNavigate(); //<--- el hook useNavigate() de react-router nos permite saltar a una url si recargar toda la app desde el principio
                                  //invoca al modulo de enrutamiento y carga componente asociado a esa url
  //console.log('valor de la variable satarAUrl: ', saltarAUrl)


    return (
    <div className="container">
        <div className="row">
            {/* .... logo de la tienda.....*/}
            <div className="col-2">
                <img src="/imagenes/logo_pccomponentes.png" alt="logo"  className="img-fluid"  style={{ cursor: 'pointer' }}/>
            </div>

            {/* .... offcanvas con categorias.....*/}
            <div className="col-2">
                <OffCanvasCats />
            </div>

            {/* .... caja de busqueda y dropdown de catalogo.....*/}
            <div className="col-4">
              <div className="d-flex flex-row justify-content-between mt-5 mb-4">

                <div className="dropdown">
                  <button className="btn btn-outline-secondary dropdown-toggle" type="button" style={{ borderRadius: '0'}} id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                    Todo el Catálogo
                  </button>
                  <ul className="dropdown-menu">
                    <li><a className="dropdown-item" href="#">Todo el Catálogo</a></li>
                    <li><a className="dropdown-item" href="#">Reacondicionados</a></li>
                  </ul>
                </div>

                <div className="input-group w-100">
                  <input type="search" className="form-control" style={{ borderRadius: '0'}} placeholder="Buscar" aria-label="Buscar" />
                  <button className="btn btn-outline-secondary" style={{ borderRadius: '0'}} type="submit"><i className="fa-solid fa-magnifying-glass"></i></button>
                </div>

              </div>
            </div>

            {/* .... botones de inicio sesion y carrito compra.....*/}
            <div className="col-4">
                <div className="d-flex flex-row justify-content-end mt-5 mb-4">
                    <button className="btn btn-outline-secondary btn-sm"><img src="/imagenes/icono_stars.png" alt="icono stars" /> Buscar con IA</button>

                    <SessionButton saltarAUrl={saltarAUrl} 
                                   email={datosCliente?.cuenta.email || null} 
                                   icono={ datosCliente?.cuenta.imagenAvatar || null}/>

                    <button className="btn btn-light btn-sm">
                        <i className="fa-solid fa-cart-shopping position-relative"></i> Mi Cesta
                    </button>
                </div>
                
            </div>
        </div>

        {/* .... fila opcional para mostrar links q ha usado el usuario u ofertas relevantes...paso de hacerlo  */}
    </div>
    )
}

export default Header