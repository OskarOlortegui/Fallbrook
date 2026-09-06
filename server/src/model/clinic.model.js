import {Schema, model} from 'mongoose'
import { noteSchema } from './utils.model.js';

const collection = 'Clinic'; 

const clinicSchema = new Schema({
    name: {
        type: String,
        unique: true, 
        required: true
    },
    medicalGroup: {  // NUEVO: Para saber si esta sede pertenece a un grupo (ej: "RadNet" o "Alliance")
        type: Schema.Types.ObjectId, 
        ref: 'MedicalGroup',
        index: true 
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true,
        index: true //optimiza las busquedas
    },
    state: {
        type: String,
        default: "CA" //California
    },
    zipCode: { type: String },
    phones: { type: [String], default: [] },
    faxes:  { type: [String], default: [] },
    website: { type: String },
    tin: { type: String }, // Tax ID específico de esa locación
    // ── NUEVOS CAMPOS PARA MRF Y ENVIOS DE FAX ──
    isMRF: {
        type: Boolean,
        default: true, // Si es true, esta entidad procesa/emite registros médicos
        index: true
    },
    requestCount: {
        type: Number,
        default: 0, // Para saber cuáles son las más frecuentadas (Trending)
        index: true
    },
    notes: [noteSchema], 
    status: {
        type: String,
        enum: ["verified", "prohibited", "deleted"],
        default: "verified",
        index: true
    },
    blockReason: { 
        type: String, 
        default: "" // Ej: "Quieren cambio de PCP", "Ya no acepta IPA", "Bad reputation"
    }
}, {timestamps: true})

// Middleware Usamos getOptions() para detectar la "llave"
clinicSchema.pre(/^find/, function() {
    if (!this.getOptions().includeDeleted) {
        this.where({ status: { $ne: "deleted" } });
    }
});

const Clinic = model(collection, clinicSchema);
export default Clinic