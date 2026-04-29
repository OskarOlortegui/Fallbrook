import {Schema, model} from 'mongoose'
import { noteSchema } from './utils.model.js';

const collection = 'doctors'; // 's' plural

/* Sub-esquemas de clinicas */
/* const clinicSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    medicalGroup: {  // NUEVO: Para saber si esta sede pertenece a un grupo (ej: "RadNet" o "Alliance")
        type: Schema.Types.ObjectId, 
        ref: 'medicalGroups',
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
    active: { type: Boolean, default: true }
}, {timestamps: true}) */

const doctorSchema = new Schema({
    name: {
        type: String,
        required: true,
        index: true //optimiza las busquedas
    },
    gender: { 
        type: String, 
        enum: ["male", "female"], 
        required: true,
        index: true 
    },
    specialty: {
        type: String,
        required: true,
        index: true, //optimiza las busquedas
        enum: [
            "allergy and immunology",
            "anesthesiology",
            "cardiology",
            "cardiothoracic surgery",
            "colorectal surgery",
            "dermatology",
            "emergency medicine",
            "endocrinology",
            "family medicine",
            "gastroenterology",
            "general surgery",
            "geriatrics",
            "hematology",
            "hematology and oncology",
            "home care",
            "infectious disease",
            "internal medicine",
            "interventional radiology",
            "nephrology",
            "neurology",
            "neurosurgery",
            "nursing home",
            "obstetrics and gynecology (OB/GYN)",
            "oncology",
            "ophthalmology",
            "optometry",
            "orthopedic surgery",
            "otolaryngology (ENT)",
            "pain management",
            "palliative care",
            "pathology",
            "physical therapy",
            "plastic surgery",
            "podiatry",
            "preventive medicine",
            "psychiatry",
            "psychology",
            "pulmonology",
            "radiology",
            "rheumatology",
            "sleep medicine",
            "sports medicine",
            "thoracic surgery",
            "urology",
            "vascular surgery"
        ]
    },
    npi: { 
        type: String, 
        required: true, 
        unique: true 
    }, // El NPI es único por ley en USA
    image: {
        type: String,
        default: "/img/doctor_avatar.png", // Imagen por defecto
    },
    // Un array de objetos (Subdocumentos)
    clinics: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'clinics'  //nombre de collection
    }], // Esto permite que un doctor tenga 1, 2 o 5 clínicas.
    // Un array de strings para los seguros
    insurances: {
      type: [String], // Como los nombres de seguros suelen ser cortos (CHG, Prospect), un array de strings es lo más eficiente para filtrar.
      index: true, // Importante para que el buscador de seguros sea rápido
      default: []
    },
    // NUEVO: Historial de notas o noticias
    notes: [noteSchema], 
    //active: { type: Boolean, default: true }
    status: {
        type: String,
        enum: ["verified", "prohibited", "out-of-network", "pending"], //  ["active", "inactive", "blocked"],
        default: "verified",
        index: true
    },
    blockReason: { 
        type: String, 
        default: "" // Ej: "Quieren cambio de PCP", "Ya no acepta IPA", "Bad reputation"
    }
}, {timestamps: true})

const Doctor = model(collection, doctorSchema)
export default Doctor;