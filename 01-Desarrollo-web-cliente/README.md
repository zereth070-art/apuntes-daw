# Desarrollo web en cliente

## Temas

- JavaScript moderno.
- DOM.
- Eventos.
- Formularios.
- Fetch.
- APIs.
- Componentes.
- Estado.
- SPA.
- Accesibilidad frontend.

## Prácticas

- Lista de tareas.
- Buscador con filtros.
- Consumo de API pública.
- Carrito de compra.
- Panel de administración simple.

## Resultado esperado

Crear interfaces dinámicas, usables y conectadas a datos externos.

## Conexión a la base de datos

La URI de MongoDB Atlas **no se escribe aquí**: va en el `.env` del proyecto, que está
en `.gitignore` y nunca se sube al repositorio.

```env
# .env  (NO SUBIR)
MONGO_URI=mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/<base>
```

Si alguna vez se te ha colado una credencial en un fichero versionado, **cámbiala en
MongoDB Atlas** (Atlas → Database Access → Edit User → Reset Password). Borrar la
línea del fichero no basta: la clave sigue viva en el historial de git y en la caché
de GitHub.

