// models/facility.model.js  es el jefe jerarquia 1
import {Schema, model} from 'mongoose';
import { noteSchema } from './utils.model.js';

const collection = 'medicalGroups'; // 's' plural

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
    //active: { type: Boolean, default: true }
    status: {
        type: String,
        enum: ["verified", "prohibited", "out-of-network", "pending"],
        default: "verified",
        index: true
    },
    blockReason: { 
        type: String, 
        default: "" // Ej: "Quieren cambio de PCP", "Ya no acepta IPA", "Bad reputation"
    }
}, { timestamps: true });

const MedicalGroup = model(collection, medicalGroupSchema);
export default MedicalGroup