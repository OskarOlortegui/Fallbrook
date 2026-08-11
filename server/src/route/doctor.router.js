import {Router} from 'express'
import isValidId from '../middleware/isValidId.mid.js'; // 1. Verificamos si el formato es válido antes de llamar al Manager
import {
    createDoctor,
    getDoctors,
    getDoctorById,
    updateDoctor,
    deleteAllDoctors,
    deleteDoctor,
    addDoctorNote,
    removeDoctorNote,
    addMedicalGroupToDoctor,
    removeMedicalGroupFromDoctor,
    addClinicToDoctor,
    removeClinicFromDoctor
} from '../controller/doctor.controller.js'

const doctorRouter = Router()
// ============ CRUD BÁSICO ============
doctorRouter.post("/", createDoctor)
doctorRouter.get("/", getDoctors) // GET /api/doctors

// Solo disponible en desarrollo
if (process.env.NODE_ENV === 'development') {
    doctorRouter.delete('/deleteAll', deleteAllDoctors)
}

// GET /api/doctors/:id
doctorRouter.get("/:id", isValidId, getDoctorById)
// PUT /api/doctors/:id
doctorRouter.put("/:id", isValidId, updateDoctor)
// DELETE /api/doctors/:id  (soft delete)
doctorRouter.delete("/:id", isValidId, deleteDoctor)

// ============ NOTAS ============

// POST /api/doctors/:id/notes
doctorRouter.post("/:id/notes", isValidId, addDoctorNote)
// DELETE /api/doctors/:id/notes/:noteId
doctorRouter.delete("/:id/notes/:noteId", isValidId, removeDoctorNote)

// ============ MEDICAL GROUPS ============
 
// POST /api/doctors/:id/medicalGroups/:mgId
doctorRouter.post("/:id/medicalGroups/:mgId", isValidId, addMedicalGroupToDoctor)
// DELETE /api/doctors/:id/medicalGroups/:mgId
doctorRouter.delete("/:id/medicalGroups/:mgId", isValidId, removeMedicalGroupFromDoctor)

// ============ CLINICS ============
 
// POST /api/doctors/:id/clinics/:clinicId ➡️ Se interpreta como: "Voy a crear una relación entre este doctor y esta clínica".
doctorRouter.post("/:id/clinics/:clinicId", isValidId, addClinicToDoctor)
// DELETE /api/doctors/:id/clinics/:clinicId
doctorRouter.delete("/:id/clinics/:clinicId", isValidId, removeClinicFromDoctor)

export default doctorRouter;