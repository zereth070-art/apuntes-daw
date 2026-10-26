import {useNavigate} from 'react-router'

export default function MiniProducto({ producto }) {
    const navigate = useNavigate();

    return (
            <div className="card" style={{width: '18rem'}} >

                <div id={`carouselProducto-${producto._id}`} className="carousel slide">
                    <div className="carousel-indicators">
                        {
                            producto.imagenes.map(
                                (imagen, index) => (
                                    <button key={index} 
                                            type="button" 
                                            data-bs-target={`#carouselProducto-${producto._id}`}
                                            data-bs-slide-to={index} 
                                            className={index === 0 ? 'active' : ''} 
                                            aria-current={index === 0 ? 'true' : 'false'} 
                                            aria-label={`Slide ${index + 1}`}>

                                    </button>
                                )
                            )
                        }
                    </div>
                    <div className="carousel-inner">
                        {
                            producto.imagenes.map(
                                (imagen, index) => (
                                    <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                                        <img src={imagen} className="d-block w-100" alt={`Imagen ${index + 1}`} onClick={() => navigate(`/Producto/${producto._id}`)} />
                                    </div>
                                )
                            )
                        }
                    </div>
                    <button className="carousel-control-prev" type="button" data-bs-target={`#carouselProducto-${producto._id}`} data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target={`#carouselProducto-${producto._id}`} data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>

                <div className="card-body">
                    <h5 className="card-title">{producto.nombre}</h5>
                    
                    { producto.descuento.tieneDescuento 
                    ?
                        <p className="card-text">
                            <strong><span style={{color:'red'}}> {producto.precio - (producto.precio * producto.descuento.porcentaje / 100)} €</span></strong> <small> PVPR<span style={{textDecoration: 'line-through'}}> {producto.precio} €</span> </small>
                        </p>                    
                    : 
                        <p className="card-text"><strong>{producto.precio} €</strong></p>
                    }


                    <p className="card-text">
                        { [1,2,3,4,5].map((_, index) => (
                            <i key={index} className="fa-solid fa-star" style={{color: `${index < Math.floor(producto.valoracionMedia) ? '#ffc107' : '#6c757d'}`}}></i>
                        ))}
                        ( {producto.opiniones.length} )
                    </p>
                    
                    <p className="card-text">Vendido por <strong>{producto.vendedor}</strong></p>
                </div>
            </div>
    );
}