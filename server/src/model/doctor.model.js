import {Schema, model} from 'mongoose'
import { noteSchema } from './utils.model.js';

const collection = 'Doctor';

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
        ref: 'Clinic', 
        default: []  
    }], // Esto permite que un doctor tenga 1, 2 o 5 clínicas.
    // NUEVO: Relación directa con medical groups
    medicalGroups: [{
        type: Schema.Types.ObjectId,
        ref: 'MedicalGroup',
        default: [],  
        index: true
    }],
    // NUEVO: Historial de notas o noticias
    notes: [noteSchema], 
    //active: { type: Boolean, default: true }
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
doctorSchema.pre(/^find/, function() {
    if (!this.getOptions().includeDeleted) {
        this.where({ status: { $ne: "deleted" } });
    }
});

const Doctor = model(collection, doctorSchema)
export default Doctor;