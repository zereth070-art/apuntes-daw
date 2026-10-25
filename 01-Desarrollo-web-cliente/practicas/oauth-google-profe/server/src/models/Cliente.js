import mongoose from "mongoose";

const cuentaSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, lowercase: true, trim: true },
    password: { type: String, default: "" },
    activada: { type: Boolean, default: true },
    telefono: { type: String, default: "" },
    imagenAvatar: { type: String, default: "" },
  },
  { _id: false },
);

const clienteSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    apellidos: { type: String, default: "" },
    cuenta: { type: cuentaSchema, required: true },
    direcciones: { type: Array, default: [] },
    favoritos: { type: Array, default: [] },
    pedidos: { type: Array, default: [] },
    opiniones: { type: Array, default: [] },
  },
  { timestamps: true },
);

clienteSchema.index({ "cuenta.email": 1 }, { unique: true });

export const Cliente = mongoose.model("Cliente", clienteSchema);
