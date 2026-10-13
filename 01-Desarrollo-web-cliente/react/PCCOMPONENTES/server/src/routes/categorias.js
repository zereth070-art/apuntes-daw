import { Router } from "express";
import { Categoria } from "../models/Categoria.js";
import requiereAuth from "../middleware/requiereAuth.js";

export const routerCategorias = Router();

/*
 * GET /api/categorias -> lista de categorías para el desplegable del frontend.
 * Express 5 captura los rechazos de las funciones async y los manda al
 * middleware de errores solo con declararlas async (por eso aquí NO hay
 * try/catch: en Express 4 habría sido obligatorio).
 */
routerCategorias.get("/api/categorias", requiereAuth, async (req, res) => {
  const categorias = await Categoria.find().sort({ nombre: 1 });
  res.json(categorias);
});
