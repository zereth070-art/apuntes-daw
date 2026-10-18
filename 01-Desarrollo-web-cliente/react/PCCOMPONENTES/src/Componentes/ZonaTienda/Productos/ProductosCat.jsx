import { useSearchParams } from "react-router";

function ProductosCat() {
  // Solo destructuramos lo que usamos. setSearchParams haria falta para
  // CAMBIAR la categoria desde aqui (por ejemplo con un <select>), pero ahora
  // solo queremos leerla, asi que no lo sacamos.
  const [searchParams] = useSearchParams();

  // La categoria viaja en la URL: /Productos/Categoria?categoria=Componentes
  // Ojo: .get() devuelve null si la clave no existe, y "" si existe pero vacia.
  const categoria = searchParams.get("categoria");

  // CASO MALO: sin categoria. Early return -> se devuelve aqui mismo y ya.
  // "!" es negacion, y asi de paso captura los DOS casos: null Y "".
  if (!categoria) {
    return (
      <p className="text-danger">
        No has elegido ninguna categoria. Vuelve al menu y elige una.
      </p>
    );
  }

  // CASO BUENO: con categoria. Cada rama devuelve UNA sola cosa, asi que
  // aqui ya no hace falta el fragmento <>.
  return (
    <div className="d-flex flex-row justify-content-center align-items-center ProductosCat">
      <p>Aqui mostrariamos los productos de {categoria}</p>
    </div>
  );
}

export default ProductosCat;
