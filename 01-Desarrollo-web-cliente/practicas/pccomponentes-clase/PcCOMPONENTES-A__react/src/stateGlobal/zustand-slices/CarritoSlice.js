const initialCarritoState = {
    carrito: { 
                    itemsPedido:[], 
                    subtotal:0, 
                    gastosEnvio:0, 
                    iva:0.12,
                    total:0 
                },
    setCarrito: ()=>{},
    resetCarrito: ()=>{}
}


export const CarritoSlice = (set, get, store) =>{
    return {
        ...initialCarritoState,
        setCarrito: (accion, itemPedido)=> set(
            stateAnterior => {
                // Lógica para actualizar el carrito según la acción y el item; en itemPedido va un objeto asi:
                //{ producto:{ _id:'...', precio:..., nombre:'...'. imagenProducto:'...', descuentoPrecio:'....' }, cantidad: x}
                 let _itemsCarrito=[...stateAnterior.carrito.itemsPedido]; //copio array de items del carrito
                 let _posicionItem=_itemsCarrito.findIndex( item => item.producto._id === itemPedido.producto._id ); //busco si el item ya existe en el carrito
                
                 switch(accion) {
                    case 'agregar':
                        // Agregar item al carrito(antes compruebo si existe y si existe sumo cantidad)
                        if(_posicionItem !== -1) {
                            // El item ya existe en el carrito, sumo la cantidad
                            _itemsCarrito[_posicionItem].cantidad += itemPedido.cantidad;
                        } else {
                            // El item no existe en el carrito, lo agrego
                            _itemsCarrito.push(itemPedido);
                        }
                        break;

                    case 'eliminar':
                        // Eliminar item del carrito
                        _itemsCarrito = _itemsCarrito.filter(item => item.producto._id !== itemPedido.producto._id);
                        break;

                    case 'actualizar':
                        // Actualizar item en el carrito
                        if(_posicionItem !== -1) {
                            _itemsCarrito[_posicionItem].cantidad = itemPedido.cantidad;
                        }
                        break;
                    default:
                        console.warn(`Acción desconocida: ${accion}`);
                }
                //TODO...no tenemos en cuenta  el descuentoPrecio de los productos en cada item del carrito, hay q hacerlo....
                let _subtotal = _itemsCarrito.reduce((acc, item) => acc + (item.producto.precio * item.cantidad), 0);
                let _gastosEnvio = 0; // TODO: Implementar cálculo de gastos de envío, cambiar en funcion DIRECCION de ENVIO
                let _iva = _subtotal * 0.12;
                let _total = _subtotal + _gastosEnvio + _iva;

                return { 
                        ...stateAnterior, 
                        carrito: { 
                                    itemsPedido: _itemsCarrito, 
                                    subtotal: _subtotal,
                                    gastosEnvio: _gastosEnvio, 
                                    iva: _iva, 
                                    total: _total 
                                } 
                };

            }
        ),
        resetCarrito: ()=> set( stateAnterior => ({ ...stateAnterior, ...initialCarritoState }) )
    } //<--- objeto q devuelve el slice de Carrito  se incruta en store-global
}