import {Schema} from 'mongoose'

// Sub-esquema para las notas (comentarios de tus compañeros)
export const noteSchema = new Schema({
    author: { type: String, default: "staff" }, // Quién escribió la nota
    content: { type: String, required: true },  // El mensaje (ej: "No acepta pacientes nuevos")
    date: { type: Date, default: Date.now }      // Fecha automática
});

