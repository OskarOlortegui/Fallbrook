import { Router } from 'express';
import { medicalGroupsManager } from '../data/manager.mongo.js';
import isValidId from '../middleware/isValidId.js';

const facilityRouter = Router();

facilityRouter.post("/", async (req, res) => {
  try {
    const newGroup = await medicalGroupsManager.createOne(req.body);
    res.status(201).json({ success: true, data: newGroup });
  } catch (err) {
    res.status(500).json({ success: false, errors: { message: err.message } });
  }
});

facilityRouter.get("/", async (req, res) => {
  try {
    const groups = await medicalGroupsManager.readAll({});
    res.status(200).json({ success: true, data: groups });
  } catch (err) {
    res.status(500).json({ success: false, errors: { message: err.message } });
  }
});

// --- OBTENER UNO ---
facilityRouter.get("/:id", isValidId, async (req, res) => {
  try {
    const group = await medicalGroupsManager.readById(req.params.id);
    if (!group) return res.status(404).json({ success: false, message: "Group not found" });
    res.status(200).json({ success: true, data: group });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// --- ACTUALIZAR ---
facilityRouter.put("/:id", isValidId, async (req, res) => {
  try {
    const updated = await medicalGroupsManager.updateById(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: "Group not found" });
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// --- ELIMINAR ---
facilityRouter.delete("/:id", isValidId, async (req, res) => {
  try {
    const deleted = await medicalGroupsManager.destroyById(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Group not found" });
    res.status(200).json({ success: true, message: "Group deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default facilityRouter;