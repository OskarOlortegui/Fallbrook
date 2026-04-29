import {Schema, model} from 'mongoose'
import { noteSchema } from './utils.model.js';

const collection = 'clinics'; // 's' plural // jerarquia 2

const clinicSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    medicalGroup: {  // NUEVO: Para saber si esta sede pertenece a un grupo (ej: "RadNet" o "Alliance")
        type: Schema.Types.ObjectId, 
        ref: 'medicalGroups', //aca ref hace referencia al nombre de la collection no?
        // Required?? maybe not
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
}, {timestamps: true})

const Clinic = model(collection, clinicSchema);
export default Clinic