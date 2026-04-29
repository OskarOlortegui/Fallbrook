import { Router } from 'express';
import { clinicsManager } from '../data/manager.mongo.js';
import isValidId from '../middleware/isValidId.js';

const clinicRouter = Router();

clinicRouter.post("/", async (req, res) => {
  try {
    const newClinic = await clinicsManager.createOne(req.body);
    res.status(201).json({ success: true, data: newClinic });
  } catch (err) {
    res.status(500).json({ success: false, errors: { message: err.message } });
  }
});

clinicRouter.get("/", async (req, res) => {
  try {
    // Aquí populamos el Medical Group al que pertenece la clínica
    const clinics = await clinicsManager.readAll({}, "medicalGroup");
    res.status(200).json({ success: true, data: clinics });
  } catch (err) {
    res.status(500).json({ success: false, errors: { message: err.message } });
  }
});

// --- OBTENER UNA ---
clinicRouter.get("/:id", isValidId, async (req, res) => {
  try {
    // Populamos para ver a qué grupo pertenece esta sede específica
    const clinic = await clinicsManager.readById(req.params.id, "medicalGroup");
    if (!clinic) return res.status(404).json({ success: false, message: "Clinic not found" });
    res.status(200).json({ success: true, data: clinic });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// --- ACTUALIZAR ---
clinicRouter.put("/:id", isValidId, async (req, res) => {
  try {
    const updated = await clinicsManager.updateById(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: "Clinic not found" });
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// --- ELIMINAR ---
clinicRouter.delete("/:id", isValidId, async (req, res) => {
  try {
    const deleted = await clinicsManager.destroyById(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Clinic not found" });
    res.status(200).json({ success: true, message: "Clinic deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default clinicRouter;