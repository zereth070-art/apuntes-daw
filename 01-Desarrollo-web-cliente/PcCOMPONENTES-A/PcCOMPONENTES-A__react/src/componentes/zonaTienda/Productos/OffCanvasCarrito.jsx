import './OffCanvasCarrito.css';
import useStore from '../../../stateGlobal/zustandStateSlices.js';
import MiniProductoOffCanvas from '../Carrito/MiniProductoOffCanvas/MiniproductoOffCanvas.jsx';

export default function OffCanvasCarrito() {

    const { carrito, setCarrito } = useStore();

    return (
        <div className="offcanvas offcanvas-end"
            tabIndex="-1"
            id="offCanvasCarrito"
            aria-labelledby="offcanvasRightLabel"
        >
            <div className="offcanvas-header">
                <h5 className="offcanvas-title" id="offcanvasRightLabel">Mi Cesta</h5>
                <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <hr />
            <div className="offcanvas-body">
                {
                    carrito.itemsPedido.length > 0 ? (
                        <>
                            {
                                carrito.itemsPedido.map(
                                    (itemPedido, posicion) => <MiniProductoOffCanvas key={itemPedido.producto._id}
                                                                                     producto={itemPedido.producto}
                                                                                     cantidad={itemPedido.cantidad} />
                                )
                            }
                        </>
                    ) : (
                        <div className="d-flex flex-column justify-content-center align-items-center">
                            <h5 className="text-center">Tu carrito está vacío</h5>
                            <p className="text-center">Explora multitud de artículos a buen precio</p>
                            <p className="text-center">desde nuestra página principal</p>
                            <button type="button" className="btn btn-outline-primary" data-bs-dismiss="offcanvas" aria-label="Close">Explora artículos</button>
                        </div>
                    )
                }
            </div>
        </div>
    )
}
