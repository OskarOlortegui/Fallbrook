import { Schema, model } from 'mongoose'
import { noteSchema } from './utils.model.js'

const collection = 'RadiologyCenter'

// Cada centro puede tener varios locales (ej: RadNet tiene múltiples ubicaciones)
const locationSchema = new Schema({
    address:  { type: String, required: true },
    city:     { type: String, required: true, index: true },
    state:    { type: String, default: "CA" },
    zipCode:  { type: String },
    phone:    { type: String },
    fax:      { type: String },
})

const radiologyCenterSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        index: true
        // Ej: "RadNet", "IHS", "Valley Radiology"
    },
    accountNo: {
        type: String,
        // Tu número de cuenta con ellos (Fallbrook Medical Center)
        // Cuando llamas y te lo piden, este es el dato
    },
    website:   { type: String },
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