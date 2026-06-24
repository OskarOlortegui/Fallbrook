import { Schema, model } from 'mongoose'

const collection = 'Insurance'

const insuranceSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        index: true
        // Ej: "CHG (Community Health Group)", "Optum", "Medicare"
    },
    shortName: {
        type: String,
        // Ej: "CHG", "Optum" — para mostrar en badges y filtros del UI
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        index: true
        // Ej: "chg", "optum", "medicare" — para la URL: /insurances/optum
    },
    type: {
        type: String,
        enum: ["commercial", "government", "managed-care", "workers-comp", "selfpay"],
        index: true
    },
    active: {
        type: Boolean,
        default: true,
        index: true
    }
}, { timestamps: true })

const Insurance = model(collection, insuranceSchema)
export default Insurance