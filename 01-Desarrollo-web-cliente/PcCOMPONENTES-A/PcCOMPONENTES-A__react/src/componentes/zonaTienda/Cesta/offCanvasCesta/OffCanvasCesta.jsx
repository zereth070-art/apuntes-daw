import { useNavigate } from "react-router";
import useStore from "../../../../stateGlobal/zustandStateSlices";

function OffCanvasCesta(){
    const navigate = useNavigate();
    const items = useStore(s => s.carrito.itemsPedido);
    const total = useStore(s => s.carrito.total)
    const setCarrito = useStore(s => s.setCarrito);

    const unidadesTotales = items.reduce((acc, item) => acc + item.cantidad, 0);


    return (
        <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasCesta">
            <div className="offcanvas-header">
                <div>Mi cesta</div>
                <button type="button">
                    <img src="/simbolo-x.png" alt="X" />
                </button>
            </div>
            <div className="offcanvas-body">
                {items.length === 0 ? (<div></div>) : (
                    <>
                    {items.map(item => (
                        <div key={item.producto._id}>
                            <div>
                            <img src={item.producto.imagenes?.[0] }></img>
                            <button onClick={() => setCarrito('eliminar', item)}></button>
                        </div>
                            <span>{item.producto.nombre}</span>
                        </div>
                    ))  /* -->precio<--*/}
                    {/*total unidades y precios*/}
                    {/* button "Ver artículos en tu cesta" -> navigate('/Cesta') */}
                    <button onClick={() => navigate("/Cesta")} >Ver articulos en tu cesta</button>
                    </>
                )
                }
            </div>
        </div>
    )
}
export default OffCanvasCesta;