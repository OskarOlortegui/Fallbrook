import { Schema, model } from 'mongoose'
import { noteSchema } from './utils.model.js'

const collection = 'RadiologyCenter'

// Cada centro puede tener varios locales (ej: RadNet tiene múltiples ubicaciones)
const locationSchema = new Schema({
    LocationName: { 
        type: String, 
        required: false,  // ← no required, porque RadNet simplemente usa la ciudad
        index: false      // ← no necesita index, no buscamos por nombre de location
        // Ej: "Carlsbad Imaging Center", "Imperial Radiology"
    },
    address:  { type: String, required: true },
    city:     { type: String, required: true, index: true },
    state:    { type: String, default: "CA" },
    zipCode:  { type: String },
    website:   { type: String },
    email: { type: String },
    phones: { type: [String], default: [] },
    faxes:  { type: [String], default: [] }
})

const radiologyCenterSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        index: true
        // Ej: "RadNet", "IHS", "Valley Radiology"
    },
    npi: { type: String },
    tin: { type: String }, 
    accountNo: {
        type: String,
        // Tu número de cuenta con ellos (Fallbrook Medical Center)
        // Cuando llamas y te lo piden, este es el dato
    },
    notes:     [noteSchema],
    locations: [locationSchema],  // Cada local tiene su propio phone y fax
    status: {
        type: String,
        enum: ["active", "prohibited", "deleted"],
        default: "active",
        index: true
    },
    blockReason: {
        type: String,
        default: ""
    }
}, { timestamps: true })

radiologyCenterSchema.pre(/^find/, function () {
    if (!this.getOptions().includeDeleted) {
        this.where({ status: { $ne: "deleted" } })
    }
})

const RadiologyCenter = model(collection, radiologyCenterSchema)
export default RadiologyCenter