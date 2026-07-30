import { radiologyCentersManager } from '../data/manager.mongo.js'

// ============ CRUD BÁSICO ============

export const createRadiologyCenter = async (req, res) => {
    try {
        const newCenter = await radiologyCentersManager.createOne(req.body)
        res.status(201).json({ success: true, data: newCenter })
    } catch (err) {
        res.status(500).json({ success: false, errors: { message: err.message } })
    }
}

// Query params: ?name=radnet  ?city=fallbrook  ?includeDeleted=true
export const getRadiologyCenters = async (req, res) => {
    try {
        const { name, city, includeDeleted } = req.query
        let filter = {}

        if (name)           filter.name              = new RegExp(name, 'i')
        if (city)           filter['locations.city'] = new RegExp(city, 'i')
        if (includeDeleted) filter.includeDeleted     = true

        const centers = await radiologyCentersManager.readAll(filter)
        res.status(200).json({ success: true, data: centers })
    } catch (err) {
        res.status(500).json({ success: false, errors: { message: err.message } })
    }
}

export const getRadiologyCenterById = async (req, res) => {
    try {
        const center = await radiologyCentersManager.readById(req.params.id)
        if (!center) {
            return res.status(404).json({ success: false, errors: { message: 'Radiology Center not found' } })
        }
        res.status(200).json({ success: true, data: center })
    } catch (err) {
        res.status(500).json({ success: false, errors: { message: err.message } })
    }
}

export const updateRadiologyCenter = async (req, res) => {
    try {
        const updated = await radiologyCentersManager.updateById(req.params.id, req.body)
        if (!updated) {
            return res.status(404).json({ success: false, errors: { message: 'Radiology Center not found' } })
        }
        res.status(200).json({ success: true, data: updated })
    } catch (err) {
        res.status(400).json({ success: false, errors: { message: err.message } })
    }
}

export const deleteAllRadiologyCenters = async (req, res) => {
    try {
        await radiologyCentersManager.deleteAll()
        res.status(200).json({ success: true, message: 'Todos los Radiology Centers eliminados' })
    } catch (err) {
        res.status(500).json({ success: false, errors: { message: err.message } })
    }
}

export const deleteRadiologyCenter = async (req, res) => {
    try {
        const { id } = req.params

        const centerActual = await radiologyCentersManager.readById(id)
        if (!centerActual) {
            return res.status(404).json({ success: false, errors: { message: 'Radiology Center not found' } })
        }
        if (centerActual.status === 'deleted') {
            return res.status(400).json({ success: false, errors: { message: 'Radiology Center is already deleted' } })
        }

        const deactivated = await radiologyCentersManager.updateById(id, {
            name: `${centerActual.name} (DELETED-${id.toString().slice(-4)})`,
            status: 'deleted',
            blockReason: `${centerActual.blockReason || ''} | Soft deleted on ${new Date().toISOString()}`
        })

        res.status(200).json({
            success: true,
            message: 'Radiology Center deactivated successfully',
            data: deactivated
        })
    } catch (err) {
        res.status(500).json({ success: false, errors: { message: err.message } })
    }
}

// ============ NOTAS ============

export const addRadiologyCenterNote = async (req, res) => {
    try {
        const updated = await radiologyCentersManager.addNote(req.params.id, req.body)
        res.status(200).json({ success: true, message: 'Note added successfully', data: updated })
    } catch (err) {
        if (err.message.includes('not found')) {
            return res.status(404).json({ success: false, errors: { message: err.message } })
        }
        res.status(500).json({ success: false, errors: { message: err.message } })
    }
}