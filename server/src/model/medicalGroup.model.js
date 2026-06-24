// models/facility.model.js  
// ❗ No es una jerarquía estricta, es una red de relaciones opcionales este es el #1
import {Schema, model} from 'mongoose';
import { noteSchema } from './utils.model.js';

const collection = 'MedicalGroup';

const medicalGroupSchema = new Schema({
    name: { 
        type: String, 
        required: true, 
        unique: true,
        index: true 
    },
    tin: { type: String }, // Tax ID del grupo
    phone: { type: String },
    fax: {type: String},
    website: { type: String },
    // NUEVO: Historial de notas o noticias
    notes: [noteSchema], 
    status: {
        type: String,
        enum: ["verified", "prohibited", "out-of-network", "pending", "deleted"],
        default: "verified",
        index: true
    },
    blockReason: { 
        type: String, 
        default: "" // Ej: "Quieren cambio de PCP", "Ya no acepta IPA", "Bad reputation"
    }
}, { timestamps: true });

// Este middleware se ejecuta en CADA búsqueda (find, findById, etc.)
medicalGroupSchema.pre(/^find/, function() {
    if (!this.getOptions().includeDeleted) { //como NO quiero incluir los "deleted"
        this.where({ status: { $ne: "deleted" } }); // ← entonces Filtro los deleted  $ne = not equal
    }
});

const MedicalGroup = model(collection, medicalGroupSchema);
export default MedicalGroup