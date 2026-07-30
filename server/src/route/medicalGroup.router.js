import { Router } from 'express';
import { medicalGroupsManager, clinicsManager, doctorsManager } from '../data/manager.mongo.js';
import isValidId from '../middleware/isValidId.mid.js';
import {
    createMedicalGroup,
    getMedicalGroups,
    getMedicalGroupById,
    updateMedicalGroup,
    deleteAllMedicalGroups,
    deleteMedicalGroup,
    addMedicalGroupNote
} from '../controller/medicalGroup.controller.js'

const medicalGroupRouter = Router();

// POST /api/medical-groups
medicalGroupRouter.post("/", createMedicalGroup)

// GET /api/medical-groups
// Query params: ?name=prospect  ?includeDeleted=true
medicalGroupRouter.get("/", getMedicalGroups)

// Solo disponible en desarrollo
if (process.env.NODE_ENV === 'development') {
    medicalGroupRouter.delete("/deleteAll", deleteAllMedicalGroups)
}

// GET /api/medical-groups/:id
medicalGroupRouter.get("/:id", isValidId, getMedicalGroupById)

// PUT /api/medical-groups/:id
medicalGroupRouter.put("/:id", isValidId, updateMedicalGroup)

// DELETE /api/medical-groups/:id  (soft delete)
medicalGroupRouter.delete("/:id", isValidId, deleteMedicalGroup);

// POST /api/medical-groups/:id/notes
medicalGroupRouter.post("/:id/notes", isValidId, addMedicalGroupNote)
export default medicalGroupRouter;