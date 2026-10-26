export default function ProductosCard({nombre, precio, imagen} ) {
    
    return (
        <div>
            <h3>{nombre}</h3>
            <p>{precio.toLocaleString('es-ES', {minimunFractionsDigits: 2})} €</p>
            <img src="{imagen}" alt="imagen" />
            </div>
        
    )
}