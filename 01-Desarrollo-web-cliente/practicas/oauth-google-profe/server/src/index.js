import express from "express";
import mongoose from "mongoose";
import { routerClientes } from "./routes/clientes.js";

const PORT = process.env.PORT ?? 3000;
const MONGO_URI = process.env.MONGO_URI ?? "mongodb://localhost:27017/pccomponentes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use(routerClientes);

app.use((req, res) => {
  res.status(404).json({ error: { codigo: "NO_ENCONTRADO", mensaje: "Ruta no existente" } });
});

app.use((err, req, res, _next) => {
  console.error("[api] error:", err);
  res.status(err.status ?? 500).json({
    error: { codigo: err.codigo ?? "ERROR_INTERNO", mensaje: err.message },
  });
});

try {
  await mongoose.connect(MONGO_URI);
  console.log("[api] conectado a MongoDB");
  app.listen(PORT, () => console.log(`[api] escuchando en http://localhost:${PORT}`));
} catch (err) {
  console.error("[api] no se ha podido arrancar:", err.message);
  process.exit(1);
}
