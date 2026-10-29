import './DetallesProducto.css'
import { useState } from 'react'
import { useLoaderData } from 'react-router'
import useStore from '../../../stateGlobal/zustandStateSlices.js'

export default function DetallesProducto() {
    const [imagenSeleccionada, setImagenSeleccionada] = useState(0)
    const setCarrito = useStore(s => s.setCarrito)
    const producto = useLoaderData();

    if (producto === null) {
        return <p>No se ha encontrado datos del producto seleccionado</p>
    }

    const imagenes = producto.imagenes || []
    const totalImagenes = imagenes.length
    const [euros, centimos] = (producto.precio ?? 0).toFixed(2).split('.')
    const estrellasMedia = Math.round(producto.valoracionMedia ?? 0)
    const caracteristicas = producto.caracteristicas || []
    const opiniones = producto.opiniones || []
    const preguntas = producto.preguntas || []
    const especificaciones = producto.especificaciones || {}
    const descuento = producto.descuento || {}
    const numeroOpiniones = producto.numeroOpiniones ?? 0

    const verAnterior = () => setImagenSeleccionada((indice) => (indice - 1 + totalImagenes) % totalImagenes)
    const verSiguiente = () => setImagenSeleccionada((indice) => (indice + 1) % totalImagenes)

    const abrirPestana = (idPestana) => {
        const pestana = document.getElementById(idPestana)
        if (window.bootstrap && pestana) {
            window.bootstrap.Tab.getOrCreateInstance(pestana).show()
            pestana.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }

    return (
        <main className="container-xxl py-4 detalle-producto">
            <nav aria-label="breadcrumb" className="mb-3">
                <ol className="breadcrumb small mb-0">
                    <li className="breadcrumb-item"><a href="/" className="text-decoration-none">Inicio</a></li>
                    {producto.marca && <li className="breadcrumb-item">{producto.marca}</li>}
                    <li className="breadcrumb-item active text-truncate" aria-current="page">{producto.nombre}</li>
                </ol>
            </nav>

            <section className="row g-4 align-items-start">
                {/* 1ª columna: galería (imagen grande + miniaturas) */}
                <div className="col-12 col-lg-5">
                    {imagenes.length > 0 ? (
                        <>
                            <button
                                type="button"
                                className="btn p-0 border-0 w-100 bg-white detalle-producto__imagen-principal"
                                data-bs-toggle="modal"
                                data-bs-target="#modalImagenProducto"
                                aria-label="Ampliar imagen"
                            >
                                <img src={imagenes[imagenSeleccionada]} alt={producto.nombre} className="img-fluid" />
                            </button>
                            <div className="d-flex gap-2 mt-3 overflow-x-auto pb-1">
                                {imagenes.map((imagen, indice) => (
                                    <button
                                        key={indice}
                                        type="button"
                                        className={`btn p-1 flex-shrink-0 detalle-producto__miniatura ${indice === imagenSeleccionada ? 'detalle-producto__miniatura--activa' : ''}`}
                                        onClick={() => setImagenSeleccionada(indice)}
                                        aria-label={`Ver imagen ${indice + 1}`}
                                        aria-current={indice === imagenSeleccionada}
                                    >
                                        <img src={imagen} alt="" />
                                    </button>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="text-center text-muted border rounded py-5">Sin imágenes disponibles</div>
                    )}
                </div>

                {/* 2ª columna: título, valoración y lo más destacado */}
                <div className="col-12 col-md-7 col-lg-4">
                    <h1 className="h4 fw-bold mb-2">{producto.nombre}</h1>
                    <div className="d-flex flex-wrap align-items-center gap-3 small mb-3">
                        <span>
                            <strong>{(producto.valoracionMedia ?? 0).toLocaleString('es-ES')}/5</strong>{' '}
                            <i className="bi bi-star-fill detalle-producto__estrella" aria-hidden="true" />
                        </span>
                        <button type="button" className="btn btn-link btn-sm p-0 text-dark" onClick={() => abrirPestana('tab-opiniones')}>
                            {numeroOpiniones} opiniones
                        </button>
                        <button type="button" className="btn btn-link btn-sm p-0 text-dark text-decoration-none" onClick={() => abrirPestana('tab-preguntas')}>
                            Preguntas (<span className="text-decoration-underline">{preguntas.length}</span>)
                        </button>
                    </div>

                    <p className="small text-muted mb-3">
                        {producto.marca && <>Marca: <strong className="text-dark">{producto.marca}</strong> &middot; </>}
                        Cód. artículo: {producto.sku}
                        {producto.partNumber && <> &middot; P/N: {producto.partNumber}</>}
                    </p>

                    <div className="border rounded p-3 d-flex align-items-center gap-3 mb-3">
                        <i className="bi bi-arrow-repeat fs-4 detalle-producto__naranja" aria-hidden="true" />
                        <div className="small flex-grow-1">
                            <strong className="d-block">Ahorra con el plan renove</strong>
                            Entrega tu antiguo dispositivo y ¡gana dinero!
                        </div>
                        <i className="bi bi-chevron-right" aria-hidden="true" />
                    </div>

                    {caracteristicas.length > 0 && (
                        <div className="bg-body-tertiary rounded p-4">
                            <h2 className="h6 fw-bold mb-2">Lo más destacado</h2>
                            <ul className="small mb-0 d-grid gap-2">
                                {caracteristicas.map((caracteristica) => <li key={caracteristica}>{caracteristica}</li>)}
                            </ul>
                        </div>
                    )}
                </div>

                {/* 3ª columna: precio y compra */}
                <div className="col-12 col-md-5 col-lg-3">
                    <div className="card shadow-sm">
                        <div className="card-body p-4">
                            {descuento.tieneDescuento && (
                                <div className="d-flex flex-wrap align-items-center gap-2 mb-1 small">
                                    <span className="badge detalle-producto__badge-descuento">-{descuento.porcentaje}%</span>
                                    <span className="text-muted text-decoration-line-through">
                                        {descuento.precioOriginal?.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                                    </span>
                                    {descuento.etiqueta && <span className="badge text-bg-dark">{descuento.etiqueta}</span>}
                                </div>
                            )}
                            <p className="mb-3 fw-bold detalle-producto__precio">
                                <span className="detalle-producto__precio-euros">{euros}</span>
                                <sup className="fs-6">{centimos}€</sup>
                            </p>

                            <div className="d-flex align-items-center justify-content-between small px-3 py-2 mb-3 detalle-producto__financiacion">
                                <span>Financiación disponible</span>
                                <i className="bi bi-chevron-right" aria-hidden="true" />
                            </div>

                            <ul className="list-unstyled small mb-3 d-grid gap-3">
                                <li className="d-flex gap-3">
                                    <i className="bi bi-truck fs-5" aria-hidden="true" />
                                    <div>
                                        Envío: <strong>Gratis</strong> | Devolución: <strong>Gratis</strong>
                                        {producto.disponible
                                            ? <strong className="d-block text-success">Recíbelo mañana</strong>
                                            : <strong className="d-block text-danger">Sin stock</strong>}
                                    </div>
                                </li>
                                <li className="d-flex gap-3">
                                    <i className="bi bi-shop fs-5" aria-hidden="true" />
                                    <span>Ver disponibilidad en tienda</span>
                                </li>
                            </ul>

                            <button type="button" className="btn btn-lg w-100  detalle-producto__btn-carrito" onClick={() => setCarrito('agregar', {producto, cantidad: 1 })}>
                                Añadir al carrito
                            </button>

                            <div className="d-flex align-items-center gap-2 small mt-3 pb-3 border-bottom">
                                <i className="bi bi-award fs-5" aria-hidden="true" />
                                <span className="flex-grow-1">Garantía de Solución en 24h</span>
                                <strong>Gratis</strong>
                            </div>
                            <div className="d-flex align-items-center gap-2 small pt-3">
                                <i className="bi bi-box-seam-fill detalle-producto__naranja" aria-hidden="true" />
                                <span>Vendido y enviado por <strong>PcComponentes</strong></span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pestañas: descripción, especificaciones, opiniones y preguntas */}
            <section className="mt-5">
                <ul className="nav nav-tabs" role="tablist">
                    <li className="nav-item" role="presentation">
                        <button className="nav-link active" id="tab-descripcion" data-bs-toggle="tab" data-bs-target="#panel-descripcion" type="button" role="tab" aria-controls="panel-descripcion" aria-selected="true">Descripción</button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button className="nav-link" id="tab-especificaciones" data-bs-toggle="tab" data-bs-target="#panel-especificaciones" type="button" role="tab" aria-controls="panel-especificaciones" aria-selected="false">Especificaciones</button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button className="nav-link" id="tab-opiniones" data-bs-toggle="tab" data-bs-target="#panel-opiniones" type="button" role="tab" aria-controls="panel-opiniones" aria-selected="false">Opiniones ({numeroOpiniones})</button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button className="nav-link" id="tab-preguntas" data-bs-toggle="tab" data-bs-target="#panel-preguntas" type="button" role="tab" aria-controls="panel-preguntas" aria-selected="false">Preguntas ({preguntas.length})</button>
                    </li>
                </ul>
                <div className="tab-content border border-top-0 rounded-bottom p-4">
                    {/* Descripción */}
                    <div className="tab-pane fade show active" id="panel-descripcion" role="tabpanel" aria-labelledby="tab-descripcion">
                        {producto.descripcion
                            ? <p className="mb-0">{producto.descripcion}</p>
                            : <p className="text-muted mb-0">Este producto no tiene descripción.</p>}
                    </div>

                    {/* Especificaciones */}
                    <div className="tab-pane fade" id="panel-especificaciones" role="tabpanel" aria-labelledby="tab-especificaciones">
                        {Object.keys(especificaciones).length > 0 ? (
                            <table className="table table-striped align-middle mb-0">
                                <tbody>
                                    {Object.entries(especificaciones).map(([clave, valor]) => (
                                        <tr key={clave}>
                                            <th scope="row" className="w-25 fw-semibold text-capitalize">{clave.replace(/([a-z])([A-Z])/g, '$1 $2')}</th>
                                            <td>{String(valor)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-muted mb-0">No hay especificaciones disponibles.</p>
                        )}
                    </div>

                    {/* Opiniones */}
                    <div className="tab-pane fade" id="panel-opiniones" role="tabpanel" aria-labelledby="tab-opiniones">
                        <div className="d-flex align-items-center gap-3 mb-4">
                            <span className="display-5 fw-bold">{(producto.valoracionMedia ?? 0).toLocaleString('es-ES')}</span>
                            <div>
                                <div className="fs-5 detalle-producto__estrella">
                                    {'★'.repeat(estrellasMedia)}{'☆'.repeat(5 - estrellasMedia)}
                                </div>
                                <div className="small text-muted">{numeroOpiniones} opiniones</div>
                            </div>
                        </div>
                        {opiniones.length === 0 && <p className="text-muted mb-0">Todavía no hay opiniones de este producto.</p>}
                        <div className="d-grid gap-3">
                            {opiniones.map((opinion) => (
                                <article key={opinion._id} className="border rounded p-3">
                                    <header className="d-flex align-items-center gap-2 mb-2">
                                        <img src={opinion.avatarUsuario} alt="" width="40" height="40" className="rounded-circle" />
                                        <div>
                                            <strong className="d-block">{opinion.nombreUsuario}</strong>
                                            <small className="text-muted">{opinion.fecha ? new Date(opinion.fecha).toLocaleDateString('es-ES') : ''}</small>
                                        </div>
                                        <span className="ms-auto detalle-producto__estrella" aria-label={`Valoración ${opinion.valoracion} de 5`}>
                                            {'★'.repeat(opinion.valoracion ?? 0)}{'☆'.repeat(5 - (opinion.valoracion ?? 0))}
                                        </span>
                                    </header>
                                    <p className="mb-2">{opinion.texto}</p>
                                    <div className="row small g-2">
                                        {(opinion.pros || []).length > 0 && (
                                            <div className="col-12 col-md-6">
                                                <strong className="text-success"><i className="bi bi-hand-thumbs-up" aria-hidden="true" /> Pros</strong>
                                                <ul className="mb-0">{(opinion.pros || []).map((pro) => <li key={pro}>{pro}</li>)}</ul>
                                            </div>
                                        )}
                                        {(opinion.contras || []).length > 0 && (
                                            <div className="col-12 col-md-6">
                                                <strong className="text-danger"><i className="bi bi-hand-thumbs-down" aria-hidden="true" /> Contras</strong>
                                                <ul className="mb-0">{(opinion.contras || []).map((contra) => <li key={contra}>{contra}</li>)}</ul>
                                            </div>
                                        )}
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>

                    {/* Preguntas y respuestas */}
                    <div className="tab-pane fade" id="panel-preguntas" role="tabpanel" aria-labelledby="tab-preguntas">
                        {preguntas.length === 0 && <p className="text-muted mb-0">Nadie ha preguntado todavía por este producto.</p>}
                        <div className="d-grid gap-3">
                            {preguntas.map((pregunta) => (
                                <article key={pregunta._id} className="border rounded p-3">
                                    <header className="d-flex align-items-center gap-2 mb-2">
                                        <img src={pregunta.avatarUsuario} alt="" width="32" height="32" className="rounded-circle" />
                                        <strong>{pregunta.nombreUsuario}</strong>
                                        <small className="text-muted ms-auto">{pregunta.fecha ? new Date(pregunta.fecha).toLocaleDateString('es-ES') : ''}</small>
                                    </header>
                                    <p className="fw-semibold mb-2">{pregunta.texto}</p>
                                    {(pregunta.respuestas || []).length > 0 ? (
                                        <ul className="list-unstyled ms-4 mb-0 d-grid gap-2">
                                            {(pregunta.respuestas || []).map((respuesta, indice) => (
                                                <li key={indice} className="bg-body-tertiary rounded p-2 small">
                                                    <strong>{respuesta.nombreUsuario}</strong>
                                                    <span className="text-muted"> &middot; {respuesta.fecha ? new Date(respuesta.fecha).toLocaleDateString('es-ES') : ''}</span>
                                                    <p className="mb-0 mt-1">{respuesta.texto}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="small text-muted ms-4 mb-0">Sin respuestas todavía.</p>
                                    )}
                                </article>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Modal: imagen ampliada */}
            {totalImagenes > 0 && (
                <div className="modal fade" id="modalImagenProducto" tabIndex="-1" aria-labelledby="modalImagenProductoTitulo" aria-hidden="true">
                    <div className="modal-dialog modal-xl modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header border-0">
                                <h2 className="modal-title h6 text-truncate" id="modalImagenProductoTitulo">{producto.nombre}</h2>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar" />
                            </div>
                            <div className="modal-body text-center position-relative">
                                <img src={imagenes[imagenSeleccionada]} alt={producto.nombre} className="img-fluid detalle-producto__imagen-ampliada" />
                                {totalImagenes > 1 && (
                                    <>
                                        <button type="button" className="btn btn-light rounded-circle shadow position-absolute top-50 start-0 translate-middle-y ms-3" onClick={verAnterior} aria-label="Imagen anterior">
                                            <i className="bi bi-chevron-left" aria-hidden="true" />
                                        </button>
                                        <button type="button" className="btn btn-light rounded-circle shadow position-absolute top-50 end-0 translate-middle-y me-3" onClick={verSiguiente} aria-label="Imagen siguiente">
                                            <i className="bi bi-chevron-right" aria-hidden="true" />
                                        </button>
                                    </>
                                )}
                            </div>
                            <div className="modal-footer border-0 justify-content-center">
                                <span className="small text-muted">{imagenSeleccionada + 1} / {totalImagenes}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}