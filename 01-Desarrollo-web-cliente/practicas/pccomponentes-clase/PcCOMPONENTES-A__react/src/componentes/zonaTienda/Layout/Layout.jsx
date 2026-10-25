import './Layout.css'
import Header from './Header/Header.jsx'
import Footer from './Footer/Footer.jsx'
import { Outlet } from 'react-router'

function Layout(){
    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    {/*...componente Header .... */}
                    <Header />
                </div>
            </div>

            <div className="row">
                <div className="col">
                    {/*
                        ...aqui se carga el contenido variable del layout en funcion de la ruta... 
                        se hace usando el componente <Outlet /> de react-router, que renderiza el componente hijo 
                        correspondiente a la ruta actual cargada en el navegador
                    */}
                    <Outlet /> 
                </div>
            </div>

            <div className="row">
                <div className="col">
                    {/*...componente Footer .... */}
                    <Footer />
                </div>
            </div>


        </div>
    )
}

export default Layout