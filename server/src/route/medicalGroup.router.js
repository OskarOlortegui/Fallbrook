import { Router } from 'express';
import { medicalGroupsManager, clinicsManager, doctorsManager } from '../data/manager.mongo.js';
import isValidId from '../middleware/isValidId.mid.js';

const medicalGroupRouter = Router();

// POST /api/medical-groups
medicalGroupRouter.post("/", async (req, res) => {
    try {
        const newGroup = await medicalGroupsManager.createOne(req.body)
        res.status(201).json({ success: true, data: newGroup })
    } catch (err) {
        res.status(500).json({ success: false, errors: { message: err.message } })
    }
})

// GET /api/medical-groups
// Query params: ?name=prospect  ?includeDeleted=true
medicalGroupRouter.get("/", async (req, res) => {
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
})

// Solo disponible en desarrollo
if (process.env.NODE_ENV === 'development') {
    medicalGroupRouter.delete("/deleteAll", async (req, res) => {
        try {
            await medicalGroupsManager.deleteAll()
            res.status(200).json({ success: true, message: "Todos los Medical Groups eliminados" })
        } catch (err) {
            res.status(500).json({ success: false, errors: { message: err.message } })
        }
    })
}

// GET /api/medical-groups/:id
medicalGroupRouter.get("/:id", isValidId, async (req, res) => {
    try {
        const group = await medicalGroupsManager.readById(req.params.id)
        if (!group) {
            return res.status(404).json({ success: false, errors: { message: "Medical Group not found" } })
        }
        res.status(200).json({ success: true, data: group })
    } catch (err) {
        res.status(500).json({ success: false, errors: { message: err.message } })
    }
})

// PUT /api/medical-groups/:id
medicalGroupRouter.put("/:id", isValidId, async (req, res) => {
    try {
        const updated = await medicalGroupsManager.updateById(req.params.id, req.body)
        if (!updated) {
            return res.status(404).json({ success: false, errors: { message: "Medical Group not found" } })
        }
        res.status(200).json({ success: true, data: updated })
    } catch (err) {
        res.status(500).json({ success: false, errors: { message: err.message } })
    }
})

// DELETE /api/medical-groups/:id  (soft delete)
medicalGroupRouter.delete("/:id", isValidId, async (req, res) => {
  try {
    const {id} = req.params;

    // 1. BUSCAR EL GRUPO PRIMERO (Para validar existencia y obtener el nombre)
    const groupActual = await medicalGroupsManager.readById(id);
    if (!groupActual) {
      return res.status(404).json({ success: false, message: "Group not found" });
    }

    // Si ya está deleted, no permitir
    if (groupActual.status === "deleted") {
      return res.status(400).json({ success: false, errors: { message: "Medical Group is already deleted" } })
    }

    // 2. VALIDACIÓN DE DEPENDENCIAS
    // Verificamos si hay clínicas que dependen de este Medical Group
    const allClinics = await clinicsManager.readAll({
      medicalGroup: id,
      includeDeleted: true
    })
    // Filtrar solo las que NO están deleted (activas)
    const activeClinics = allClinics.filter(clinic => clinic.status !== "deleted");
    console.log("Clinicas encontradas:", activeClinics.length); 

    if (activeClinics.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete: this group has ${activeClinics.length} active clinic(s). Deactivate or reassign them first.`,
        clinics: activeClinics.map(c => ({ 
              id: c._id, 
              name: c.name, 
              status: c.status // la borro? 
          }))
      });
    }

    // 3. Verificar doctores directamente asociados ACTIVOS
    const allDoctors = await doctorsManager.readAll({ 
      medicalGroups: id,
      includeDeleted: true 
    });
    const activeDoctors = allDoctors.filter(doc => doc.status !== "deleted");
    
    if (activeDoctors.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete: this group has ${activeDoctors.length} active doctor(s). Reassign them first.`,
        doctors: activeDoctors.map(d => ({ id: d._id, name: d.name }))
      });
    }

    // 4. SOFT DELETE (Borrado Lógico)
    const deactivated = await medicalGroupsManager.updateById(id, { 
      name: `${groupActual.name} (DELETED-${id.toString().slice(-4)})`, // Ej: "RadNet (DELETED-a15b)"
      status: "deleted", //del enum
      blockReason: "Deactivated by staff - Soft Delete" 
    });

    if (!deactivated) {
      return res.status(404).json({ success: false, message: "Group not found" });
    }

    res.status(200).json({ 
      success: true, 
      message: "Group deactivated successfully (Soft Delete)",
      data: deactivated 
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/medical-groups/:id/notes
medicalGroupRouter.post("/:id/notes", isValidId, async (req, res) => {
    try {
        // ← readById manual eliminado, addNote ya verifica internamente
        // ← if (!updatedFacility) eliminado, addNote lanza error si no encuentra
        const updated = await medicalGroupsManager.addNote(req.params.id, req.body)
        res.status(200).json({ success: true, message: "Note added successfully", data: updated })
    } catch (err) {
        if (err.message.includes("not found")) {
            return res.status(404).json({ success: false, errors: { message: err.message } })
        }
        res.status(500).json({ success: false, errors: { message: err.message } })
    }
})
export default medicalGroupRouter;