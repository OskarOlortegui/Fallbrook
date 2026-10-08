import { clinicsManager, doctorsManager, medicalGroupsManager  } from '../data/manager.mongo.js'
import { ClinicInsurance } from '../model/pivots.model.js'

/* MRF GET CLINICS */
// GET /api/clinics/mrf/popular
export const getPopularMRFs = async (req, res) => {
  try {
    const popularMRFs = await clinicsManager.readMRFs(3);
    res.status(200).json({ success: true, data: popularMRFs });
  } catch (err) {
    res.status(500).json({ success: false, errors: { message: err.message } });
  }
};
 // GET /api/clinics/mrf
export const getMRFs = async (req, res) => {
  try {
    const MRFs = await clinicsManager.readMRFs();
    res.status(200).json({ success: true, data: MRFs });
  } catch (err) {
    res.status(500).json({ success: false, errors: { message: err.message } });
  }
};

// ============ CRUD BÁSICO ============

// POST /api/clinics
export const createClinic = async (req, res) => {
    try {
        const newClinic = await clinicsManager.createOne(req.body)
        res.status(201).json({ success: true, data: newClinic })
    } catch (err) {
        res.status(500).json({ success: false, errors: { message: err.message } })
    }
}

// GET /api/clinics
// Query params: ?name=fallbrook  ?city=fallbrook  ?includeDeleted=true
export const getClinics = async (req, res) => {
    try {
        const { name, city, includeDeleted } = req.query
        let filter = {}

        if (name)           filter.name           = new RegExp(name, "i")
        if (city)           filter.city           = new RegExp(city, "i")
        if (includeDeleted) filter.includeDeleted = true

        const clinics = await clinicsManager.readAll(filter, "medicalGroup")
        res.status(200).json({ success: true, data: clinics })
    } catch (err) {
        res.status(500).json({ success: false, errors: { message: err.message } })
    }
}

// GET MRF
export const createMRFRequest = async (req, res) => {
    try {
        const { id } = req.params
        const {
            patientName,
            dob,
            facility,
            fax
        } = req.body

        // 1. Buscar la clínica
        const clinic = await clinicsManager.readById(id)
        if (!clinic) {
            return res.status(404).json({
                success: false,
                errors: {
                    message: "Clinic not found"
                }
            })
        }


        // 2. Verificar que realmente sea MRF
        if (!clinic.isMRF) {
            return res.status(400).json({
                success: false,
                errors: {
                    message: "This clinic is not an MRF"
                }
            })
        }


        // 3. Generar PDF
        // const pdf = await generateMRFPdf(...)


        // 4. Enviar PDF mediante RingCentral
        // const result = await sendFax(...)


        // 5. Incrementar contador
        // await clinicsManager.incrementRequestCount(id)


        res.status(200).json({
            success: true,
            message: "MRF request sent successfully"
        })

    } catch (err) {
        res.status(500).json({
            success: false,
            errors: {
                message: err.message
            }
        })
    }
}


// GET /api/clinics/:id   (si si popula el medicalGroup todo ok)
export const getClinicById = async (req, res) => {
    try {
        const clinic = await clinicsManager.readById(req.params.id, "medicalGroup")
        if (!clinic) {
            return res.status(404).json({ success: false, errors: { message: "Clinic not found" } })
        }

         // Buscamos los seguros asociados a esta clínica
        const insurancePivots = await ClinicInsurance
            .find({ clinic: req.params.id, status: "verified" })
            .populate(
                "insurance",
                "name shortName slug phones"
            )
            .sort({ createdAt: -1 });

        // Formateamos los seguros para el frontend
       const insurances = insurancePivots
                .filter(p => p.insurance)
                .map(p => ({
                    name: p.insurance.name,
                    shortName: p.insurance.shortName,
                    slug: p.insurance.slug,
                    phones: p.insurance.phones,
                    status: p.status,
                    since: p.effectiveDate
                }));

        res.status(200).json({ success: true, data: {...clinic, insurances} })
    } catch (err) {
        res.status(500).json({ success: false, errors: { message: err.message } })
    }
}
// PUT /api/clinics/:id
export const updateClinic = async (req, res) => {
    try {
        const updated = await clinicsManager.updateById(req.params.id, req.body)
        if (!updated) {
            return res.status(404).json({ success: false, errors: { message: "Clinic not found" } })
        }
        res.status(200).json({ success: true, data: updated })
    } catch (err) {
        res.status(500).json({ success: false, errors: { message: err.message } })
    }
}
// process.env.NODE_ENV === 'development'
export const deleteAllClinics = async (req, res) => {
    try {
        await clinicsManager.deleteAll()
        res.status(200).json({ success: true, message: "Todas las clínicas eliminadas" })
    } catch (err) {
        res.status(500).json({ success: false, errors: { message: err.message } })
    }
}
// DELETE /api/clinics/:id  (soft delete)
export const deleteClinic = async (req, res) => {
    try {
        const { id } = req.params
// 1. Verificar que existe
        const clinicActual = await clinicsManager.readById(id)
        if (!clinicActual) {
            return res.status(404).json({ success: false, errors: { message: "Clinic not found" } })
        }
        if (clinicActual.status === "deleted") {
            return res.status(400).json({ success: false, errors: { message: "Clinic is already deleted" } })
        }

 // 2. Verificar doctores activos asociados
        const allDoctors = await doctorsManager.readAll({ clinics: id, includeDeleted: true })
        const activeDoctors = allDoctors.filter(d => d.status !== "deleted")
        if (activeDoctors.length > 0) {
            return res.status(400).json({
                success: false,
                errors: {
                    message: `Cannot delete: this clinic has ${activeDoctors.length} active doctor(s). Reassign them first.`
                },
                doctors: activeDoctors.map(d => ({ id: d._id, name: d.name }))
            })
        }
 // 3. Soft delete
        const deactivated = await clinicsManager.updateById(id, {
            name: `${clinicActual.name} (DELETED-${id.toString().slice(-4)})`,
            status: "deleted",
            blockReason: `${clinicActual.blockReason || ""} | Soft deleted on ${new Date().toISOString()}`
        })

        res.status(200).json({ success: true, message: "Clinic deactivated successfully", data: deactivated })
    } catch (err) {
        res.status(500).json({ success: false, errors: { message: err.message } })
    }
}

// ============ NOTAS ============
// POST /api/clinics/:id/notes
export const addClinicNote = async (req, res) => {
    try {
        const updated = await clinicsManager.addNote(req.params.id, req.body)
        res.status(200).json({ success: true, message: "Note added successfully", data: updated })
    } catch (err) {
        if (err.message.includes("not found")) {
            return res.status(404).json({ success: false, errors: { message: err.message } })
        }
        res.status(500).json({ success: false, errors: { message: err.message } })
    }
}
// DELETE /api/clinics/:id/notes/:noteId
export const removeClinicNote = async (req, res) => {
    try {
        const { id, noteId } = req.params
        const updated = await clinicsManager.removeNote(id, noteId)
        if (!updated) {
            return res.status(404).json({ success: false, errors: { message: "Doctor not found" } })
        }
        res.status(200).json({ success: true, message: "Note removed successfully", data: updated })
    } catch (err) {
        res.status(500).json({ success: false, errors: { message: err.message } })
    }
}

// ============ MEDICAL GROUPS ============
// POST /api/clinics/:id/medicalGroup/:mgId
export const addMedicalGroupToClinic = async (req, res) => {
    try {
        const { id, mgId } = req.params

        const mg = await medicalGroupsManager.readById(mgId)
        if (!mg) return res.status(404).json({ success: false, errors: { message: "Medical Group not found" } })

        const clinic = await clinicsManager.readById(id)
        if (!clinic) return res.status(404).json({ success: false, errors: { message: "Clinic not found" } })

        const updated = await clinicsManager.updateById(id, { medicalGroup: mgId })

        res.status(200).json({ success: true, message: "Medical Group assigned successfully", data: updated })
    } catch (err) {
        res.status(500).json({ success: false, errors: { message: err.message } })
    }
}
// DELETE /api/clinics/:id/medicalGroup 
export const removeMedicalGroupFromClinic = async (req, res) => {
    try {
        const { id } = req.params

        const clinic = await clinicsManager.readById(id)
        if (!clinic) return res.status(404).json({ success: false, errors: { message: "Clinic not found" } })
        if (!clinic.medicalGroup) return res.status(400).json({ success: false, errors: { message: "Clinic has no Medical Group assigned" } })

        const updated = await clinicsManager.updateById(id, { medicalGroup: null })
        res.status(200).json({ success: true, message: "Medical Group removed successfully", data: updated })
    } catch (err) {
        res.status(500).json({ success: false, errors: { message: err.message } })
    }
}