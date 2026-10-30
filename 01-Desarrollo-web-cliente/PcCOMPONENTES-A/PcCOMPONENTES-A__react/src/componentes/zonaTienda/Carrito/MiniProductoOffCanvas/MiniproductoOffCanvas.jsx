import './MiniProductoOffCanvas.css'

export default function MiniProductoOffCanvas({ producto, cantidad }) {

    return (
        <div className="card mb-3" style={{ maxWidth: '540px' }}>
            <div className="row g-0">
                <div className="col-md-4">
                    <img src="..." className="img-fluid rounded-start" alt="..." />
                </div>
                <div className="col-md-8">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-9">
                                <h5 className="card-title">{producto.nombre}</h5>
                                <p className="card-text"><strong>{producto.precio}</strong></p>
                                <p className="card-text">
                                    <small className="text-body-secondary">Unidades {cantidad}</small>
                                </p>
                            </div>
                            <div className="col-3">
                                <button type="button" className="btn btn-outline">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}