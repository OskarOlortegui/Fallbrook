import { Schema, model } from 'mongoose'

// ─────────────────────────────────────────────
//  STATUS enum compartido por todas las pivots
// ─────────────────────────────────────────────
const STATUS_ENUM = ["verified", "out-of-network", "pending", "deleted"]
// "prohibited" lo movemos a blockReason en la entidad principal
// El status aquí responde: ¿este doctor/clinic/etc está en ESTE seguro?


// ─────────────────────────────────────────────
//  DOCTOR ↔ INSURANCE
// ─────────────────────────────────────────────
// Ejemplo real:
//   Doctor A — CHG     → status: "deleted"   (ya no trabaja con CHG)
//   Doctor A — Optum   → status: "verified"  (ahora trabaja con Optum)
const doctorInsuranceSchema = new Schema({
    doctor: {
        type: Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true,
        index: true
    },
    insurance: {
        type: Schema.Types.ObjectId,
        ref: 'Insurance',
        required: true,
        index: true
    },
    status: {
        type: String,
        enum: STATUS_ENUM,
        default: "verified",
        index: true
    },
    effectiveDate: { type: Date, default: Date.now },  // desde cuándo
    notes: { type: String, default: "" }               // ej: "Ya no acepta IPA"
}, { timestamps: true })

// Un doctor no puede estar duplicado en el mismo seguro
doctorInsuranceSchema.index({ doctor: 1, insurance: 1 }, { unique: true })


// ─────────────────────────────────────────────
//  CLINIC ↔ INSURANCE
// ─────────────────────────────────────────────
const clinicInsuranceSchema = new Schema({
    clinic: {
        type: Schema.Types.ObjectId,
        ref: 'Clinic',
        required: true,
        index: true
    },
    insurance: {
        type: Schema.Types.ObjectId,
        ref: 'Insurance',
        required: true,
        index: true
    },
    status: {
        type: String,
        enum: STATUS_ENUM,
        default: "verified",
        index: true
    },
    effectiveDate: { type: Date, default: Date.now },
    notes: { type: String, default: "" }
}, { timestamps: true })

clinicInsuranceSchema.index({ clinic: 1, insurance: 1 }, { unique: true })


// ─────────────────────────────────────────────
//  MEDICAL GROUP ↔ INSURANCE
// ─────────────────────────────────────────────
const medicalGroupInsuranceSchema = new Schema({
    medicalGroup: {
        type: Schema.Types.ObjectId,
        ref: 'MedicalGroup',
        required: true,
        index: true
    },
    insurance: {
        type: Schema.Types.ObjectId,
        ref: 'Insurance',
        required: true,
        index: true
    },
    status: {
        type: String,
        enum: STATUS_ENUM,
        default: "verified",
        index: true
    },
    effectiveDate: { type: Date, default: Date.now },
    notes: { type: String, default: "" }
}, { timestamps: true })

medicalGroupInsuranceSchema.index({ medicalGroup: 1, insurance: 1 }, { unique: true })


// ─────────────────────────────────────────────
//  RADIOLOGY CENTER ↔ INSURANCE
// ─────────────────────────────────────────────
const radiologyCenterInsuranceSchema = new Schema({
    radiologyCenter: {
        type: Schema.Types.ObjectId,
        ref: 'RadiologyCenter',
        required: true,
        index: true
    },
    insurance: {
        type: Schema.Types.ObjectId,
        ref: 'Insurance',
        required: true,
        index: true
    },
    status: {
        type: String,
        enum: STATUS_ENUM,
        default: "verified",
        index: true
    },
    effectiveDate: { type: Date, default: Date.now },
    notes: { type: String, default: "" }
}, { timestamps: true })

radiologyCenterInsuranceSchema.index({ radiologyCenter: 1, insurance: 1 }, { unique: true })


// ─────────────────────────────────────────────
//  EXPORTS
// ─────────────────────────────────────────────
export const DoctorInsurance         = model('DoctorInsurance',         doctorInsuranceSchema)
export const ClinicInsurance         = model('ClinicInsurance',         clinicInsuranceSchema)
export const MedicalGroupInsurance   = model('MedicalGroupInsurance',   medicalGroupInsuranceSchema)
export const RadiologyCenterInsurance = model('RadiologyCenterInsurance', radiologyCenterInsuranceSchema)