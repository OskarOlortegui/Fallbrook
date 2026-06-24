import {Schema, model} from 'mongoose'
import { noteSchema } from './utils.model.js';

const collection = 'Clinic'; 

const clinicSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    medicalGroup: {  // NUEVO: Para saber si esta sede pertenece a un grupo (ej: "RadNet" o "Alliance")
        type: Schema.Types.ObjectId, 
        ref: 'MedicalGroup', //aca ref hace referencia al nombre de la collection no?
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
    phone: { type: String },
    fax: { type: String },
    tin: { type: String }, // Tax ID específico de esa locación
    // NUEVO: Historial de notas o noticias
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