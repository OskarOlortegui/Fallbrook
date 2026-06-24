import { Router } from 'express';
import { clinicsManager, doctorsManager } from '../data/manager.mongo.js';
import isValidId from '../middleware/isValidId.mid.js';

const clinicRouter = Router();

// POST /api/clinics
clinicRouter.post("/", async (req, res) => {
  try {
    const newClinic = await clinicsManager.createOne(req.body);
    res.status(201).json({ success: true, data: newClinic });
  } catch (err) {
    res.status(500).json({ success: false, errors: { message: err.message } });
  }
});

// GET /api/clinics
// Query params: ?name=fallbrook  ?city=fallbrook  ?includeDeleted=true
clinicRouter.get("/", async (req, res) => {
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
})

// Solo disponible en desarrollo
if (process.env.NODE_ENV === 'development') {
    clinicRouter.delete("/deleteAll", async (req, res) => {
        try {
            await clinicsManager.deleteAll()
            res.status(200).json({ success: true, message: "Todas las clínicas eliminadas" })
        } catch (err) {
            res.status(500).json({ success: false, errors: { message: err.message } })
        }
    })
}

// GET /api/clinics/:id
clinicRouter.get("/:id", isValidId, async (req, res) => {
    try {
        const clinic = await clinicsManager.readById(req.params.id, "medicalGroup")
        if (!clinic) {
            return res.status(404).json({ success: false, errors: { message: "Clinic not found" } })
        }
        res.status(200).json({ success: true, data: clinic })
    } catch (err) {
        res.status(500).json({ success: false, errors: { message: err.message } })
    }
})

// PUT /api/clinics/:id
clinicRouter.put("/:id", isValidId, async (req, res) => {
    try {
        const updated = await clinicsManager.updateById(req.params.id, req.body)
        if (!updated) {
            return res.status(404).json({ success: false, errors: { message: "Clinic not found" } })
        }
        res.status(200).json({ success: true, data: updated })
    } catch (err) {
        res.status(500).json({ success: false, errors: { message: err.message } })
    }
})

// DELETE /api/clinics/:id  (soft delete)
clinicRouter.delete("/:id", isValidId, async (req, res) => {
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
 
        // ← if (!deactivated) eliminado, nunca llegaría aquí
 
        res.status(200).json({ success: true, message: "Clinic deactivated successfully", data: deactivated })
    } catch (err) {
        res.status(500).json({ success: false, errors: { message: err.message } })
    }
})

// POST /api/clinics/:id/notes
clinicRouter.post("/:id/notes", isValidId, async (req, res) => {
    try {
        // ← readById manual eliminado, addNote ya verifica internamente
        const updated = await clinicsManager.addNote(req.params.id, req.body)
        res.status(200).json({ success: true, message: "Note added successfully", data: updated })
    } catch (err) {
        if (err.message.includes("not found")) {
            return res.status(404).json({ success: false, errors: { message: err.message } })
        }
        res.status(500).json({ success: false, errors: { message: err.message } })
    }
})

export default clinicRouter;