import {
    doctorsManager,
    medicalGroupsManager,
    clinicsManager
} from '../data/manager.mongo.js'
import { DoctorInsurance } from '../model/pivots.model.js'

// ============ CRUD BÁSICO ============
export const createDoctor = async (req,res) => { 
    try {
        const newDoctor = await doctorsManager.createOne(req.body)
        res.status(201).json({ success: true, data: newDoctor })
    } catch (err) {
        res.status(500).json({ success: false, errors: { message: err.message } })
    }
 }

// GET /api/doctors
// Query params: ?name=garcia  ?specialty=cardiology  ?city=fallbrook
// NOTA: el filtro por insurance ahora es GET /api/insurances/prospect?type=doctors
export const getDoctors = async (req,res) => {
    try {
        const {city, specialty, name, includeDeleted} = req.query;
        let filter = {};
            
            // Filtro por nombre del doctor
            if (name) filter.name = new RegExp(name, "i");
            if (specialty) filter.specialty = specialty;
            if (includeDeleted) filter.includeDeleted = true  // ← el Manager ya lo maneja
            if (city){
              // city vive en las clínicas asociadas, no en el doctor directamente
              // por ahora lo dejamos como placeholder hasta implementar el lookup
              console.log("filtro por city pendiente de implementar con lookup")
            }
        
            // Pasamos "clinics" para que rellene la info de las sedes
            const doctors = await doctorsManager.readAll(filter, "clinics medicalGroups");
            res.status(200).json({success: true, data: doctors});
    } catch (err) {
        res.status(500).json({ success: false, errors: { message: err.message } })
    }
}

// GET /api/doctors/:id
export const getDoctorById = async (req, res) => {
    try {
         const doctor = await doctorsManager.readById(req.params.id, "clinics medicalGroups")
        if (!doctor) {
            return res.status(404).json({ 
                success: false, 
                errors: { message: "Doctor not found" } 
            })
        }

        // Traemos los seguros del pivot con datos útiles
        const insurancePivots = await DoctorInsurance
            .find({ doctor: req.params.id })
            .populate('insurance', 'name shortName slug phones')
            .sort({ createdAt: -1 })

        // Formateamos solo lo que el frontend necesita
        const insurances = insurancePivots.map(p => ({
            name:      p.insurance.name,
            shortName: p.insurance.shortName,
            slug:      p.insurance.slug,
            phones:    p.insurance.phones,
            status:    p.status,
            since:     p.effectiveDate
        }))

        res.status(200).json({ 
            success: true, 
            data: { ...doctor, insurances } 
        })
    } catch (err) {
        res.status(500).json({ success: false, errors: { message: err.message } })
    }
}

// PUT /api/doctors/:id
export const updateDoctor = async (req, res) => {
    try {
        const updated = await doctorsManager.updateById(req.params.id, req.body)
        if (!updated) {
            return res.status(404).json({ success: false, errors: { message: "Doctor not found" } })
        }
        res.status(200).json({ success: true, data: updated })
    } catch (err) {
        res.status(500).json({ success: false, errors: { message: err.message } })
    }
}
// process.env.NODE_ENV === 'development'
export const deleteAllDoctors = async (req, res) => {
    try {
        await doctorsManager.deleteAll()
        res.status(200).json({ success: true, message: "Todos los doctores eliminados" })
    } catch (err) {
        res.status(500).json({ success: false, errors: { message: err.message } })
    }
}

// DELETE /api/doctors/:id  (soft delete)
export const deleteDoctor = async (req, res) => {
    try {
        const { id } = req.params
 
        const doctorActual = await doctorsManager.readById(id)
        if (!doctorActual) {
            return res.status(404).json({ success: false, errors: { message: "Doctor not found" } })
        }
        if (doctorActual.status === "deleted") {
            return res.status(400).json({ success: false, errors: { message: "Doctor is already deleted" } })
        }
 
        const deactivated = await doctorsManager.updateById(id, {
            name: `${doctorActual.name} (INACTIVE-${id.toString().slice(-4)})`,
            status: "deleted",
            blockReason: `${doctorActual.blockReason || ""} | Soft deleted on ${new Date().toISOString()}`
        })
 
        res.status(200).json({
            success: true,
            message: 'Doctor deactivated successfully',
            data: deactivated
        })
    } catch (err) {
        res.status(500).json({ success: false, errors: { message: err.message } })
    }
}

// ============ NOTAS ============
// POST /api/doctors/:id/notes
export const addDoctorNote = async (req, res) => {
    try {
        // ** Nota: simplificado, tomamos el body directamente
        const updated = await doctorsManager.addNote(req.params.id, req.body)
        res.status(200).json({ success: true, message: "Note added successfully", data: updated })
    } catch (err) {
        // Si el manager lanzó "not found", respondemos 404 no 500
        if (err.message.includes("not found")) {
            return res.status(404).json({ success: false, errors: { message: err.message } })
        }
        res.status(500).json({ success: false, errors: { message: err.message } })
    }
}

// ============ MEDICAL GROUPS ============
// POST /api/doctors/:id/medicalGroups/:mgId
export const addMedicalGroupToDoctor = async (req, res) => {
    try {
        const { id, mgId } = req.params
 
        const mg = await medicalGroupsManager.readById(mgId)
        if (!mg) {
            return res.status(404).json({ success: false, errors: { message: "Medical Group not found" } })
        }
 
        const doctor = await doctorsManager.readById(id)
        if (!doctor) {
            return res.status(404).json({ success: false, errors: { message: "Doctor not found" } })
        }
 
        const updated = await doctorsManager.model.findByIdAndUpdate(
            id,
            { $addToSet: { medicalGroups: mgId } },
            { returnDocument: 'after', runValidators: true }
        ).setOptions({ includeDeleted: true }).lean()
 
        res.status(200).json({ success: true, message: "Medical Group added successfully", data: updated })
    } catch (err) {
        res.status(500).json({ success: false, errors: { message: err.message } })
    }
}

// DELETE /api/doctors/:id/medicalGroups/:mgId
export const removeMedicalGroupFromDoctor = async (req, res) => {
    try {
        const { id, mgId } = req.params
 
        const doctor = await doctorsManager.readById(id)
        if (!doctor) {
            return res.status(404).json({ success: false, errors: { message: "Doctor not found" } })
        }
 
        const exists = doctor.medicalGroups.some(mg => mg.toString() === mgId)
        if (!exists) {
            return res.status(404).json({
                success: false,
                errors: { message: "Medical Group not found on this doctor" }
            })
        }
 
        const updated = await doctorsManager.model.findByIdAndUpdate(
            id,
            { $pull: { medicalGroups: mgId } },
            { returnDocument: 'after', runValidators: true }
        ).setOptions({ includeDeleted: true }).lean()
 
        res.status(200).json({ success: true, message: "Medical Group removed successfully", data: updated })
    } catch (err) {
        res.status(500).json({ success: false, errors: { message: err.message } })
    }
}

// ============ CLINICS ============

// POST /api/doctors/:id/clinics/:clinicId ➡️ Se interpreta como: "Voy a crear una relación entre este doctor y esta clínica".
export const addClinicToDoctor = async (req, res) => {
    try {
        const { id, clinicId } = req.params
 
        const clinic = await clinicsManager.readById(clinicId)
        if (!clinic) {
            return res.status(404).json({ success: false, errors: { message: "Clinic not found" } })
        }
 
        const doctor = await doctorsManager.readById(id)
        if (!doctor) {
            return res.status(404).json({ success: false, errors: { message: "Doctor not found" } })
        }
 
        await doctorsManager.model.findByIdAndUpdate(
            id,
            { $addToSet: { clinics: clinicId } },
            { returnDocument: 'after', runValidators: true }
        ).setOptions({ includeDeleted: true }).lean()
 
        // Si la clínica tiene medicalGroup, agregarlo al doctor también
        if (clinic.medicalGroup) {
            const hasGroup = doctor.medicalGroups?.some(
                mg => mg.toString() === clinic.medicalGroup.toString()
            )
            if (!hasGroup) {
                await doctorsManager.model.findByIdAndUpdate(
                    id,
                    { $addToSet: { medicalGroups: clinic.medicalGroup } },
                    { returnDocument: 'after', runValidators: true }
                ).setOptions({ includeDeleted: true }).lean()
            }
        }
 
        const finalDoctor = await doctorsManager.readById(id, "clinics medicalGroups")
        res.status(200).json({ success: true, message: "Clinic added successfully", data: finalDoctor })
    } catch (err) {
        res.status(500).json({ success: false, errors: { message: err.message } })
    }
}

// DELETE /api/doctors/:id/clinics/:clinicId
export const removeClinicFromDoctor = async (req, res) => {
    try {
        const { id, clinicId } = req.params
 
        const doctor = await doctorsManager.readById(id)
        if (!doctor) {
            return res.status(404).json({ success: false, errors: { message: "Doctor not found" } })
        }
 
        const exists = doctor.clinics.some(c => c.toString() === clinicId)
        if (!exists) {
            return res.status(404).json({
                success: false,
                errors: { message: "Clinic not found on this doctor" }
            })
        }
 
        // Buscar la clínica para saber su medicalGroup (caso "quitar grupo huérfano")
        const clinic = await clinicsManager.readById(clinicId)
 
        const updated = await doctorsManager.model.findByIdAndUpdate(
            id,
            { $pull: { clinics: clinicId } }, // $pull le dice directamente a la base de datos: "Haz el filtrado y la eliminación tú misma directamente en el servidor de MongoDB, en un solo paso
            { returnDocument: 'after', runValidators: true }
        ).setOptions({ includeDeleted: true }).lean()
 
        // Si la clínica pertenecía a un medicalGroup, verificar si el doctor
        // aún tiene OTRAS clínicas de ese mismo grupo antes de quitarlo
        if (clinic?.medicalGroup) {
            const remainingClinics = await clinicsManager.readAll({
                _id: { $in: updated.clinics },
                medicalGroup: clinic.medicalGroup
            })
 
            if (remainingClinics.length === 0) {
                await doctorsManager.model.findByIdAndUpdate(
                    id,
                    { $pull: { medicalGroups: clinic.medicalGroup } },
                    { returnDocument: 'after', runValidators: true }
                ).setOptions({ includeDeleted: true })
            }
        }
 
        const finalDoctor = await doctorsManager.readById(id, "clinics medicalGroups")
        res.status(200).json({ success: true, message: "Clinic removed successfully", data: finalDoctor })
    } catch (err) {
        res.status(500).json({ success: false, errors: { message: err.message } })
    }
}