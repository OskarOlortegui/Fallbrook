import { medicalGroupsManager, clinicsManager, doctorsManager } from '../data/manager.mongo.js'

// ============ CRUD BÁSICO ============
// POST /api/medical-groups
export const createMedicalGroup = async (req, res) => {
    try {
        const newGroup = await medicalGroupsManager.createOne(req.body)
        res.status(201).json({ success: true, data: newGroup })
    } catch (err) {
        res.status(500).json({ success: false, errors: { message: err.message } })
    }
}
// Query params: ?name=prospect  ?includeDeleted=true
export const getMedicalGroups = async (req, res) => {
    try {
        const { name, includeDeleted } = req.query
        let filter = {}

        if (name)           filter.name           = new RegExp(name, "i")
        if (includeDeleted) filter.includeDeleted = true

        const groups = await medicalGroupsManager.readAll(filter)
        res.status(200).json({ success: true, data: groups })
    } catch (err) {
        res.status(500).json({ success: false, errors: { message: err.message } })
    }
}
// GET /api/medical-groups/:id
export const getMedicalGroupById = async (req, res) => {
    try {
        const group = await medicalGroupsManager.readById(req.params.id)
        if (!group) {
            return res.status(404).json({ success: false, errors: { message: "Medical Group not found" } })
        }
        res.status(200).json({ success: true, data: group })
    } catch (err) {
        res.status(500).json({ success: false, errors: { message: err.message } })
    }
}
// PUT /api/medical-groups/:id
export const updateMedicalGroup = async (req, res) => {
    try {
        const updated = await medicalGroupsManager.updateById(req.params.id, req.body)
        if (!updated) {
            return res.status(404).json({ success: false, errors: { message: "Medical Group not found" } })
        }
        res.status(200).json({ success: true, data: updated })
    } catch (err) {
        res.status(500).json({ success: false, errors: { message: err.message } })
    }
}
// process.env.NODE_ENV === 'development'
export const deleteAllMedicalGroups = async (req, res) => {
    try {
        await medicalGroupsManager.deleteAll()
        res.status(200).json({ success: true, message: "Todos los Medical Groups eliminados" })
    } catch (err) {
        res.status(500).json({ success: false, errors: { message: err.message } })
    }
}
// DELETE /api/medical-groups/:id  (soft delete)
export const deleteMedicalGroup = async (req, res) => {
    try {
        const { id } = req.params
        // 1. BUSCAR EL GRUPO PRIMERO (Para validar existencia y obtener el nombre)
        const groupActual = await medicalGroupsManager.readById(id)
        if (!groupActual) {
            return res.status(404).json({ success: false, errors: { message: "Medical Group not found" } })
        }
        if (groupActual.status === "deleted") {  // Si ya está deleted, no permitir
            return res.status(400).json({ success: false, errors: { message: "Medical Group is already deleted" } })
        }

        // 2. VALIDACIÓN DE DEPENDENCIAS
        // Verificamos si hay clínicas que dependen de este Medical Group
        const allClinics = await clinicsManager.readAll({ medicalGroup: id, includeDeleted: true })
        // Filtrar solo las que NO están deleted (activas)
        const activeClinics = allClinics.filter(c => c.status !== "deleted")
        if (activeClinics.length > 0) {
            return res.status(400).json({
                success: false,
                errors: {
                    message: `Cannot delete: this group has ${activeClinics.length} active clinic(s). Deactivate or reassign them first.`
                },
                clinics: activeClinics.map(c => ({ id: c._id, name: c.name }))
            })
        }

        //3. Verificar doctores activos directamente asociados
        const allDoctors = await doctorsManager.readAll({ medicalGroups: id, includeDeleted: true })
        const activeDoctors = allDoctors.filter(d => d.status !== "deleted")
        if (activeDoctors.length > 0) {
            return res.status(400).json({
                success: false,
                errors: {
                    message: `Cannot delete: this group has ${activeDoctors.length} active doctor(s). Reassign them first.`
                },
                doctors: activeDoctors.map(d => ({ id: d._id, name: d.name }))
            })
        }
        // 4. SOFT DELETE (Borrado Lógico)
        const deactivated = await medicalGroupsManager.updateById(id, {
            name: `${groupActual.name} (DELETED-${id.toString().slice(-4)})`,
            status: "deleted",
            blockReason: "Deactivated by staff - Soft Delete"
        })

        res.status(200).json({
            success: true,
            message: "Medical Group deactivated successfully",
            data: deactivated
        })
    } catch (err) {
        res.status(500).json({ success: false, errors: { message: err.message } })
    }
}

// ============ NOTAS ============

export const addMedicalGroupNote = async (req, res) => {
    try {
        const updated = await medicalGroupsManager.addNote(req.params.id, req.body)
        res.status(200).json({ success: true, message: "Note added successfully", data: updated })
    } catch (err) {
        if (err.message.includes("not found")) {
            return res.status(404).json({ success: false, errors: { message: err.message } })
        }
        res.status(500).json({ success: false, errors: { message: err.message } })
    }
}