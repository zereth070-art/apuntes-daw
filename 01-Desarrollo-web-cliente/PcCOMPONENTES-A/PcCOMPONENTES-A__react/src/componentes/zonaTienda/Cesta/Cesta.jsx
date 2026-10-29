import './Cesta.css';
import { useNavigate } from 'react-router';
import useStore from '../../../stateGlobal/zustandStateSlices';

export default function Cesta() {
    const { carrito, setCarrito } = useStore();
    const navigate = useNavigate();

    const items = carrito?.itemsPedido || []
    const { subtotal = 0, gastosEnvio = 0, iva = 0, total = 0 } = carrito || {}
    
    const formatearPrecio = (n) =>
    (Number(n) || 0).toLocaleString('es-ES', { style: 'currency', currency:'EUR'})

    const cambiarCantidad = (item, nuevaCantidad) => {
        const cantidad = Math.max(1, parseInt(nuevaCantidad, 10) || 1);
        setCarrito('actualizar', {
            producto: item.producto,
            cantidad
        })
    }

    const eliminarItem = (item) =>{
        setCarrito('eliminar', {producto: item.producto, cantidad:0})
    }

    // ---------- CESTA VACIA ------------
    if (items.length === 0) {
        return (
            <main className='container-xxl py-5 cesta'>
                <div className='text-center py-5'>
                    <i className='fa-solid fa-cart-shopping fa-3x text-muted mb-3'></i>
                    <h2 className='h4 mb-3'>Tu cesta está vacia</h2>
                    <p className='text-muted mb-4'>Añade productos desde la tienda para empezar tu compra</p>
                    <button
                    type='button'
                    className='btn btn-primary px-4'
                    onClick={() => navigate('/')}>
                        Seguir comprando
                    </button>
                </div>
            </main>
        )
    }

    return (
        <main className='container-xxl py-5 cesta'>
            <div className='text-center py-5'>
            
            </div>
        </main>
    )
}