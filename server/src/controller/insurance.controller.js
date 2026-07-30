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

// ============ CRUD BÁSICO ============

export const getInsurances = async (req, res) => {
    try {
        const insurances = await Insurance.find({ active: true }).sort({ name: 1 })
        res.status(200).json({ success: true, data: insurances })
    } catch (err) {
        res.status(500).json({ success: false, errors: { message: err.message } })
    }
}

export const createInsurance = async (req, res) => {
    try {
        const insurance = new Insurance(req.body)
        await insurance.save()
        res.status(201).json({ success: true, data: insurance })
    } catch (err) {
        res.status(400).json({ success: false, errors: { message: err.message } })
    }
}

export const updateInsurance = async (req, res) => {
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
}

export const deactivateInsurance = async (req, res) => {
    try {
        const insurance = await Insurance.findByIdAndUpdate(
            req.params.id,
            { active: false },
            { returnDocument: 'after' }
        )
        if (!insurance) {
            return res.status(404).json({ success: false, errors: { message: 'Insurance not found' } })
        }
        res.status(200).json({ success: true, message: `Insurance "${insurance.name}" deactivated` })
    } catch (err) {
        res.status(500).json({ success: false, errors: { message: err.message } })
    }
}

// ============ RUTA PRINCIPAL ============
// Query params: ?type=all|doctors|clinics|medical-groups|radiology-centers
//               ?city=fallbrook  ?specialty=cardiology  ?search=garcia  ?status=verified

export const getInsuranceBySlug = async (req, res) => {
    try {
        const { slug } = req.params
        const {
            type   = 'all',
            city,
            specialty,
            search,
            status = 'verified'
        } = req.query
        // 1. Buscar el seguro por slug
        const insurance = await Insurance.findOne({ slug, active: true })
        if (!insurance) {
            return res.status(404).json({ success: false, errors: { message: `Insurance "${slug}" not found` } })
        }
        // 2. Filtro base de entidades (city, search)
        const entityFilter = {}
        if (city)      entityFilter.city      = new RegExp(city, 'i')
        if (search)    entityFilter.name      = new RegExp(search, 'i')
        if (specialty) entityFilter.specialty = new RegExp(specialty, 'i')
        // 3. Funciones de fetch por tipo
        const fetchDoctors = async () => {
            // Buscar IDs de doctores en la pivot con status deseado
            const pivots = await DoctorInsurance.find({ insurance: insurance._id, status }).select('doctor')
            const doctorIds = pivots.map(p => p.doctor)
            return Doctor.find({ _id: { $in: doctorIds }, status: 'active', ...entityFilter })
                .select('-notes')
                .populate('clinics', 'name city')
                .populate('medicalGroups', 'name')
                .sort({ name: 1 })
        }

        const fetchClinics = async () => {
            const pivots = await ClinicInsurance.find({ insurance: insurance._id, status }).select('clinic')
            const clinicIds = pivots.map(p => p.clinic)
            const filter = { _id: { $in: clinicIds }, status: 'active' }
            if (city)   filter.city = new RegExp(city, 'i')
            if (search) filter.name = new RegExp(search, 'i')
            return Clinic.find(filter).select('-notes').populate('medicalGroup', 'name').sort({ name: 1 })
        }

        const fetchMedicalGroups = async () => {
            const pivots = await MedicalGroupInsurance.find({ insurance: insurance._id, status }).select('medicalGroup')
            const groupIds = pivots.map(p => p.medicalGroup)
            const filter = { _id: { $in: groupIds }, status: 'active' }
            if (search) filter.name = new RegExp(search, 'i')
            return MedicalGroup.find(filter).select('-notes').sort({ name: 1 })
        }

        const fetchRadiology = async () => {
            const pivots = await RadiologyCenterInsurance.find({ insurance: insurance._id, status }).select('radiologyCenter')
            const radIds = pivots.map(p => p.radiologyCenter)
            const filter = { _id: { $in: radIds }, status: 'active' }
            if (search) filter.name = new RegExp(search, 'i')
            return RadiologyCenter.find(filter).select('-notes').sort({ name: 1 })
        }
        // 4. Ejecutar según tipo
        let data = { insurance }

        if (type === 'all') { // Ejecutamos todo en paralelo para mayor velocidad
            const [doctors, clinics, medicalGroups, radiologyCenters] = await Promise.all([
                fetchDoctors(), fetchClinics(), fetchMedicalGroups(), fetchRadiology()
            ])
            data.doctors          = doctors
            data.clinics          = clinics
            data.medicalGroups    = medicalGroups
            data.radiologyCenters = radiologyCenters

        } else if (type === 'doctors') {
            data.doctors = await fetchDoctors()
        } else if (type === 'clinics') {
            data.clinics = await fetchClinics()
        } else if (type === 'medical-groups') {
            data.medicalGroups = await fetchMedicalGroups()
        } else if (type === 'radiology-centers') {
            data.radiologyCenters = await fetchRadiology()
        } else {
            return res.status(400).json({
                success: false,
                errors: { message: `type "${type}" not valid. Use: all, doctors, clinics, medical-groups, radiology-centers` }
            })
        }

        res.status(200).json({ success: true, data })

    } catch (err) {
        res.status(500).json({ success: false, errors: { message: err.message } })
    }
}

// ============ PIVOT — DOCTOR ============

export const addDoctorToInsurance = async (req, res) => {
    try {
        const { doctorId, insuranceId, status, notes } = req.body

        const doctor = await Doctor.findById(doctorId)
        if (!doctor) {
            return res.status(404).json({ success: false, errors: { message: 'Doctor not found' } })
        }
        const insurance = await Insurance.findById(insuranceId)  // Verificar que el seguro existe
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
}

export const getDoctorInsurances = async (req, res) => {
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
}

export const removeDoctorFromInsurance = async (req, res) => {
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
}

// ============ PIVOT — CLINIC ============

export const addClinicToInsurance = async (req, res) => {
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
    } catch (err) {
        res.status(400).json({ success: false, errors: { message: err.message } })
    }
}

// ============ PIVOT — MEDICAL GROUP ============

export const addMedicalGroupToInsurance = async (req, res) => {
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
}

// ============ PIVOT — RADIOLOGY CENTER ============

export const addRadiologyCenterToInsurance = async (req, res) => {
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
}