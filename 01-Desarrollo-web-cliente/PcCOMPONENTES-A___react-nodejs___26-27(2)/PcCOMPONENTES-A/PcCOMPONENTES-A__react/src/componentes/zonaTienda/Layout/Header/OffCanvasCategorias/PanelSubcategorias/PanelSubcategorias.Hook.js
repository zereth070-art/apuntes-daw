import { useEffect, useState } from 'react'

const API_CATEGORIAS = 'http://localhost:3000/api/Tienda/Categorias'

export default function useCategorias(pathCat) {
    const [categorias, setCategorias] = useState([])
    const [cargando, setCargando] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!pathCat) {
            return
        }

        const controller = new AbortController()

        async function cargarCategorias() {
            setCargando(true)
            setError(null)

            try {
                const response = await fetch(
                    `${API_CATEGORIAS}?pathCat=${encodeURIComponent(pathCat)}`,
                    { signal: controller.signal }
                )
                const respuesta = await response.json()

                if (!response.ok || respuesta.codigo !== 0) {
                    throw new Error(respuesta.mensaje || 'No se pudieron cargar las categorias')
                }

                setCategorias(respuesta.datos?.categorias ?? [])
            } catch (errorCarga) {
                if (errorCarga.name !== 'AbortError') {
                    console.error('Error al obtener las subcategorias:', errorCarga)
                    setError(errorCarga.message)
                    setCategorias([])
                }
            } finally {
                if (!controller.signal.aborted) setCargando(false)
            }
        }

        cargarCategorias()
        return () => controller.abort()
    }, [pathCat])

    return { categorias, cargando, error }
}