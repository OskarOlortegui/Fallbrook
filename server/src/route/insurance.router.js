import { Router } from 'express'
import Insurance from '../model/insurance.model.js'
import {
    DoctorInsurance,
    ClinicInsurance,
    MedicalGroupInsurance,
    RadiologyCenterInsurance
} from '../model/pivots.model.js'
import Doctor from '../model/doctor.model.js'
import Clinic from '../model/clinic.model.js'
import MedicalGroup from '../model/medicalGroup.model.js'
import RadiologyCenter from '../model/radiologyCenter.model.js'
import isValidId from '../middleware/isValidId.mid.js'

const insuranceRouter = Router()

// ─────────────────────────────────────────────
//  GET /insurances
//  Lista todos los seguros activos
//  Ej: GET /insurances
// ─────────────────────────────────────────────
insuranceRouter.get('/', async (req, res) => {
    try {
        const insurances = await Insurance.find({ active: true }).sort({ name: 1 })
        res.status(200).json({ success: true, data: insurances })
    } catch (err) {
        res.status(500).json({ success: false, errors: { message: err.message } })
    }
})

// ─────────────────────────────────────────────
//  POST /insurances
//  Body: { name, shortName, slug, type }
//  Ej: POST /insurances
//      { "name": "Optum", "shortName": "Optum", "slug": "optum", "type": "commercial" }
// ─────────────────────────────────────────────
insuranceRouter.post('/', async (req, res) => {
    try {
        const insurance = new Insurance(req.body)
        await insurance.save()
        res.status(201).json({ success: true, data: insurance })
    } catch (err) {
        res.status(400).json({ success: false, errors: { message: err.message } })
    }
})

// ============ PIVOT ROUTES — RUTAS FIJAS PRIMERO ============
// Van antes de /:slug porque "pivot" es una ruta estática,
// si no, Express interpretaría "pivot" como si fuera un slug


// POST /api/insurances/pivot/doctor
// Body: { doctorId, insuranceId, status, notes }
insuranceRouter.post('/pivot/doctor', async (req, res) => {
    try {
        const { doctorId, insuranceId, status, notes } = req.body

        // Verificar que el doctor existe
        const doctor = await Doctor.findById(doctorId)
        if (!doctor) {
            return res.status(404).json({ success: false, errors: { message: 'Doctor not found' } })
        }

        // Verificar que el seguro existe
        const insurance = await Insurance.findById(insuranceId)
        if (!insurance) {
            return res.status(404).json({ success: false, errors: { message: 'Insurance not found' } })
        }
 
        const pivot = await DoctorInsurance.findOneAndUpdate(
            { doctor: doctorId, insurance: insuranceId },
            { status, notes, effectiveDate: new Date() },
            { upsert: true, returnDocument: 'after', runValidators: true } //upsert = UPDATE + INSERT ("Si el documento existe, actualízalo. Si no existe, créalo.")
        )
        res.status(201).json({ success: true, data: pivot })
    } catch (err) {
       res.status(400).json({ success: false, errors: { message: err.message } })
    }
})

// GET /api/insurances/pivot/doctor/:doctorId
// Devuelve TODOS los seguros de un doctor con su status en cada uno
// Útil para ver: "Doctor A — verified en Optum, deleted en CHG"
insuranceRouter.get('/pivot/doctor/:doctorId', isValidId, async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.doctorId)
        if (!doctor) {
            return res.status(404).json({ success: false, errors: { message: 'Doctor not found' } })
        }
 
        const pivots = await DoctorInsurance
            .find({ doctor: req.params.doctorId })
            .populate('insurance', 'name shortName slug')
            .sort({ createdAt: -1 })
 
        res.status(200).json({ success: true, data: pivots })
    } catch (err) {
        res.status(500).json({ success: false, errors: { message: err.message } })
    }
})
 
// DELETE /api/insurances/pivot/doctor/:doctorId/:insuranceId
// Elimina por completo la relación (no solo cambia el status)
// Úsalo cuando agregaste un pivot por error y quieres borrarlo de raíz
insuranceRouter.delete('/pivot/doctor/:doctorId/:insuranceId', isValidId, async (req, res) => {
    try {
        const { doctorId, insuranceId } = req.params
 
        const pivot = await DoctorInsurance.findOneAndDelete({
            doctor: doctorId,
            insurance: insuranceId
        })
 
        if (!pivot) {
            return res.status(404).json({
                success: false,
                errors: { message: 'Relationship not found between this doctor and insurance' }
            })
        }
 
        res.status(200).json({ success: true, message: 'Relationship removed successfully' })
    } catch (err) {
        res.status(500).json({ success: false, errors: { message: err.message } })
    }
})

// POST /insurances/pivot/clinic
// Body: { clinicId, insuranceId, status, notes }
insuranceRouter.post('/pivot/clinic', async (req, res) => {
    try {
        const { clinicId, insuranceId, status, notes } = req.body
         const clinic = await Clinic.findById(clinicId)
        if (!clinic) {
            return res.status(404).json({ success: false, errors: { message: 'Clinic not found' } })
        }
 
        const insurance = await Insurance.findById(insuranceId)
        if (!insurance) {
            return res.status(404).json({ success: false, errors: { message: 'Insurance not found' } })
        }
 
        const pivot = await ClinicInsurance.findOneAndUpdate(
            { clinic: clinicId, insurance: insuranceId },
            { status, notes, effectiveDate: new Date() },
            { upsert: true, returnDocument: 'after', runValidators: true }
        )
        res.status(201).json({ success: true, data: pivot })
    } catch (error) {
        res.status(400).json({ success: false, errors: { message: err.message } })
    }
}) 

// POST /insurances/pivot/medical-group
// Body: { medicalGroupId, insuranceId, status, notes }
insuranceRouter.post('/pivot/medical-group', async (req, res) => {
    try {
        const { medicalGroupId, insuranceId, status, notes } = req.body
 
        const group = await MedicalGroup.findById(medicalGroupId)
        if (!group) {
            return res.status(404).json({ success: false, errors: { message: 'Medical Group not found' } })
        }
 
        const insurance = await Insurance.findById(insuranceId)
        if (!insurance) {
            return res.status(404).json({ success: false, errors: { message: 'Insurance not found' } })
        }
 
        const pivot = await MedicalGroupInsurance.findOneAndUpdate(
            { medicalGroup: medicalGroupId, insurance: insuranceId },
            { status, notes, effectiveDate: new Date() },
            { upsert: true, returnDocument: 'after', runValidators: true }
        )
        res.status(201).json({ success: true, data: pivot })
    } catch (err) {
        res.status(400).json({ success: false, errors: { message: err.message } })
    }
})

// POST /insurances/pivot/radiology-center
// Body: { radiologyCenterId, insuranceId, status, notes }
insuranceRouter.post('/pivot/radiology-center', async (req, res) => {
    try {
        const { radiologyCenterId, insuranceId, status, notes } = req.body
 
        const center = await RadiologyCenter.findById(radiologyCenterId)
        if (!center) {
            return res.status(404).json({ success: false, errors: { message: 'Radiology Center not found' } })
        }
 
        const insurance = await Insurance.findById(insuranceId)
        if (!insurance) {
            return res.status(404).json({ success: false, errors: { message: 'Insurance not found' } })
        }
 
        const pivot = await RadiologyCenterInsurance.findOneAndUpdate(
            { radiologyCenter: radiologyCenterId, insurance: insuranceId },
            { status, notes, effectiveDate: new Date() },
            { upsert: true, returnDocument: 'after', runValidators: true }
        )
        res.status(201).json({ success: true, data: pivot })
    } catch (err) {
        res.status(400).json({ success: false, errors: { message: err.message } })
    }
})


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
insuranceRouter.get('/:slug', async (req, res) => {
    try {
        const { slug } = req.params
        const {
            type     = 'all',
            city,
            specialty,
            search,
            status   = 'verified'
        } = req.query

        // 1. Buscar el seguro por slug
        const insurance = await Insurance.findOne({ slug, active: true })
        if (!insurance) {
            return res.status(404).json({
                success: false,
                errors: { message: `Insurance "${slug}" not found` }
            })
        }

        // 2. Filtro base de entidades (city, search)
        const entityFilter = {}
        if (city)   entityFilter.city = new RegExp(city, 'i')
        if (search) entityFilter.name = new RegExp(search, 'i')
        if (specialty) entityFilter.specialty = new RegExp(specialty, 'i')

        // 3. Funciones de fetch por tipo
        const fetchDoctors = async () => {
            // Buscar IDs de doctores en la pivot con status deseado
            const pivots = await DoctorInsurance.find({
                insurance: insurance._id,
                status
            }).select('doctor')
            const doctorIds = pivots.map(p => p.doctor)

            return Doctor.find({
                _id: { $in: doctorIds },
                status: 'active',
                ...entityFilter
            })
            .select('-notes')       // no enviamos notas internas al frontend
            .populate('clinics', 'name city')
            .populate('medicalGroups', 'name')
            .sort({ name: 1 })
        }

        const fetchClinics = async () => {
            const pivots = await ClinicInsurance.find({
                insurance: insurance._id,
                status
            }).select('clinic')
            const clinicIds = pivots.map(p => p.clinic)

            const filter = { _id: { $in: clinicIds }, status: 'active' }
            if (city)   filter.city = new RegExp(city, 'i')
            if (search) filter.name = new RegExp(search, 'i')

            return Clinic.find(filter)
                .select('-notes')
                .populate('medicalGroup', 'name')
                .sort({ name: 1 })
        }

        const fetchMedicalGroups = async () => {
            const pivots = await MedicalGroupInsurance.find({
                insurance: insurance._id,
                status
            }).select('medicalGroup')
            const groupIds = pivots.map(p => p.medicalGroup)

            const filter = { _id: { $in: groupIds }, status: 'active' }
            if (search) filter.name = new RegExp(search, 'i')

            return MedicalGroup.find(filter)
                .select('-notes')
                .sort({ name: 1 })
        }

        const fetchRadiology = async () => {
            const pivots = await RadiologyCenterInsurance.find({
                insurance: insurance._id,
                status
            }).select('radiologyCenter')
            const radIds = pivots.map(p => p.radiologyCenter)

            const filter = { _id: { $in: radIds }, status: 'active' }
            if (search) filter.name = new RegExp(search, 'i')

            return RadiologyCenter.find(filter)
                .select('-notes')
                .sort({ name: 1 })
        }

         // 4. Ejecutar según tipo
        let data = { insurance }

        if (type === 'all') {
            // Ejecutamos todo en paralelo para mayor velocidad
            const [doctors, clinics, medicalGroups, radiologyCenters] = await Promise.all([
                fetchDoctors(),
                fetchClinics(),
                fetchMedicalGroups(),
                fetchRadiology()
            ])
            result.doctors         = doctors
            result.clinics         = clinics
            result.medicalGroups   = medicalGroups
            result.radiologyCenters = radiologyCenters

        } else if (data === 'doctors') {
            result.doctors = await fetchDoctors()

        } else if (data === 'clinics') {
            result.clinics = await fetchClinics()

        } else if (data === 'medical-groups') {
            result.medicalGroups = await fetchMedicalGroups()

        } else if (data === 'radiology-centers') {
            result.radiologyCenters = await fetchRadiology()

        } else {
            return res.status(400).json({
                success: false,
                errors: { message: `type "${data}" not valid. Use: all, doctors, clinics, medical-groups, radiology-centers` }
            })
        }

        res.status(200).json({ success: true, data })

    } catch (err) {
        res.status(500).json({ success: false, errors: { message: err.message } })
    }
})


//  PATCH /insurances/:id
insuranceRouter.patch('/:id', async (req, res) => {
    try {
        const insurance = await Insurance.findByIdAndUpdate(
            req.params.id,
            req.body,
            { returnDocument: 'after', runValidators: true }
        )
         if (!insurance) {
            return res.status(404).json({ success: false, errors: { message: 'Insurance not found' } })
        }
        res.status(200).json({ success: true, data: insurance })
    } catch (err) {
        res.status(400).json({ success: false, errors: { message: err.message } })
    }
})

// ─────────────────────────────────────────────
//  DELETE /insurances/:id (soft delete)
// ─────────────────────────────────────────────
insuranceRouter.delete('/:id', async (req, res) => {
    try {
        const insurance = await Insurance.findByIdAndUpdate(
            req.params.id,
            { active: false },
             { returnDocument: 'after' }
        )
        if (!insurance) {
            return res.status(404).json({ success: false, errors: { message: 'Insurance not found' } })
        }
        res.status(200).json({
            success: true,
            message: `Insurance "${insurance.name}" deactivated`
        })
    } catch (err) {
        res.status(500).json({ success: false, errors: { message: err.message } })
    }
})

export default insuranceRouter