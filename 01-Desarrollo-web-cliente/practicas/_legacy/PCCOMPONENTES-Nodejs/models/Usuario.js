import mongoose from "mongoose"; 

const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  passwordHash: {
    type: String,
    required: true,
    select: false, //para que no se devuelva en las consultas a la base de datos
  },
});
export const Usuario = mongoose.model("Usuario", usuarioSchema); //crea el modelo de datos Usuario a partir del esquema usuarioSchema y lo exporta para poder usarlo en otros ficheros
