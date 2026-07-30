import { Router } from 'express';
import isValidId from '../middleware/isValidId.mid.js';
import {
    createClinic,
    getClinics,
    getClinicById,
    updateClinic,
    deleteAllClinics,
    deleteClinic,
    addClinicNote
} from '../controller/clinic.controller.js'

const clinicRouter = Router();

// POST /api/clinics
clinicRouter.post("/",createClinic);

// GET /api/clinics
// Query params: ?name=fallbrook  ?city=fallbrook  ?includeDeleted=true
clinicRouter.get("/",getClinics)

// Solo disponible en desarrollo
if (process.env.NODE_ENV === 'development') {
    clinicRouter.delete("/deleteAll", deleteAllClinics)
}

// GET /api/clinics/:id
clinicRouter.get("/:id", isValidId, getClinicById)

// PUT /api/clinics/:id
clinicRouter.put("/:id", isValidId, updateClinic)

// DELETE /api/clinics/:id  (soft delete)
clinicRouter.delete("/:id", isValidId, deleteClinic)

// POST /api/clinics/:id/notes
clinicRouter.post("/:id/notes", isValidId, addClinicNote)

export default clinicRouter;