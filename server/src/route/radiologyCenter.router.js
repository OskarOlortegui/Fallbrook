import { Router } from 'express'
import isValidId from '../middleware/isValidId.mid.js'
import {
    createRadiologyCenter,
    getRadiologyCenters,
    getRadiologyCenterById,
    updateRadiologyCenter,
    deleteAllRadiologyCenters,
    deleteRadiologyCenter,
    addRadiologyCenterNote
} from '../controller/radiologyCenter.controller.js'
 
const radiologyRouter = Router()

// POST /api/radiology-centers
// Body: { name, accountNo, website, locations: [{ address, city, phone, fax }] }
radiologyRouter.post('/', createRadiologyCenter)


// GET /api/radiology-centers
// Query params: ?name=radnet  ?city=fallbrook  ?includeDeleted=true
radiologyRouter.get('/', getRadiologyCenters)

// Solo disponible en desarrollo
if (process.env.NODE_ENV === 'development') {
    radiologyRouter.delete('/deleteAll', deleteAllRadiologyCenters)
}

// GET /api/radiology-centers/:id
radiologyRouter.get('/:id', isValidId, getRadiologyCenterById)

// PATCH /api/radiology-centers/:id
radiologyRouter.patch('/:id', isValidId, updateRadiologyCenter)

// DELETE /api/radiology-centers/:id  (soft delete)
radiologyRouter.delete('/:id', isValidId, deleteRadiologyCenter)

// POST /api/radiology-centers/:id/notes
radiologyRouter.post('/:id/notes', isValidId, addRadiologyCenterNote)

export default radiologyRouter