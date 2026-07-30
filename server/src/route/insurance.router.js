import { Router } from 'express'
import isValidId from '../middleware/isValidId.mid.js'
import {
    getInsurances,
    createInsurance,
    updateInsurance,
    deactivateInsurance,
    getInsuranceBySlug,
    addDoctorToInsurance,
    getDoctorInsurances,
    removeDoctorFromInsurance,
    addClinicToInsurance,
    addMedicalGroupToInsurance,
    addRadiologyCenterToInsurance
} from '../controller/insurance.controller.js'

const insuranceRouter = Router()

// ─────────────────────────────────────────────
//  GET /insurances
//  Lista todos los seguros activos
// ─────────────────────────────────────────────

insuranceRouter.get('/', getInsurances)
// ─────────────────────────────────────────────
//  POST /insurances
//  Body: { name, shortName, slug, type }
//  Ej: POST /insurances
//      { "name": "Optum", "shortName": "Optum", "slug": "optum", "type": "commercial" }
// ─────────────────────────────────────────────
insuranceRouter.post('/', createInsurance)

// ============ PIVOT ROUTES — RUTAS FIJAS PRIMERO ============
// Van antes de /:slug porque "pivot" es una ruta estática,
// si no, Express interpretaría "pivot" como si fuera un slug


// POST /api/insurances/pivot/doctor
// Body: { doctorId, insuranceId, status, notes }
insuranceRouter.post('/pivot/doctor', addDoctorToInsurance)

// GET /api/insurances/pivot/doctor/:doctorId
// Devuelve TODOS los seguros de un doctor con su status en cada uno
// Útil para ver: "Doctor A — verified en Optum, deleted en CHG"
insuranceRouter.get('/pivot/doctor/:doctorId', isValidId, getDoctorInsurances)
 
// DELETE /api/insurances/pivot/doctor/:doctorId/:insuranceId
// Elimina por completo la relación (no solo cambia el status)
// Úsalo cuando agregaste un pivot por error y quieres borrarlo de raíz
insuranceRouter.delete('/pivot/doctor/:doctorId/:insuranceId', isValidId, removeDoctorFromInsurance)

// POST /insurances/pivot/clinic
// Body: { clinicId, insuranceId, status, notes }
insuranceRouter.post('/pivot/clinic', addClinicToInsurance  ) 

// POST /insurances/pivot/medical-group
// Body: { medicalGroupId, insuranceId, status, notes }
insuranceRouter.post('/pivot/medical-group', addMedicalGroupToInsurance)

// POST /insurances/pivot/radiology-center
// Body: { radiologyCenterId, insuranceId, status, notes }
insuranceRouter.post('/pivot/radiology-center', addRadiologyCenterToInsurance)


// ─────────────── RUTAS DINÁMICAS DE INSURANCE (van al final) ──────────────────────────────
//  GET /insurances/:slug
//  La ruta principal — devuelve todo lo asociado al seguro
//
//  Query params disponibles:
//    ?type=doctors|clinics|medical-groups|radiology-centers|all  (default: all)
//    ?city=fallbrook
//    ?specialty=cardiology         (solo aplica cuando type=doctors)
//    ?search=garcia                (busca por nombre)
//    ?status=verified              (default: verified)
//
//  Ejemplos:
//    GET /insurances/prospect
//    GET /insurances/prospect?type=doctors
//    GET /insurances/prospect?type=doctors&city=fallbrook&specialty=cardiology
//    GET /insurances/prospect?type=clinics&city=san+diego
//    GET /insurances/chg?type=doctors&search=garcia
// ─────────────────────────────────────────────
insuranceRouter.get('/:slug', getInsuranceBySlug)


//  PATCH /insurances/:id
insuranceRouter.patch('/:id', updateInsurance)

// ─────────────────────────────────────────────
//  DELETE /insurances/:id (soft delete)
// ─────────────────────────────────────────────
insuranceRouter.delete('/:id', deactivateInsurance)

export default insuranceRouter