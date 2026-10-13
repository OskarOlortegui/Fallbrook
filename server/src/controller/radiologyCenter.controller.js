import { radiologyCentersManager } from '../data/manager.mongo.js'
import { MedicalGroupRadiologyCenter, RadiologyCenterInsurance } from '../model/pivots.model.js'

// ============ CRUD BÁSICO ============
// POST /api/radiology-centers
export const createRadiologyCenter = async (req, res) => {
    try {
        const newCenter = await radiologyCentersManager.createOne(req.body)
        res.status(201).json({ success: true, data: newCenter })
    } catch (err) {
        res.status(500).json({ success: false, errors: { message: err.message } })
    }
}
// GET /api/radiology-centers
// Query params: ?name=radnet  ?city=fallbrook  ?includeDeleted=true
export const getRadiologyCenters = async (req, res) => {
    try {
        const { name, city, includeDeleted } = req.query
        let filter = {}

        if (name)           filter.name               = new RegExp(name, 'i')
        if (city)           filter['locations.city'] = new RegExp(city, 'i')
        if (includeDeleted) filter.includeDeleted     = true

        const centers = await radiologyCentersManager.readAll(filter)
        res.status(200).json({ success: true, data: centers })
    } catch (err) {
        res.status(500).json({ success: false, errors: { message: err.message } })
    }
}
// GET /api/radiology-centers/:id
export const getRadiologyCenterById = async (req, res) => {
  try {
    const { id } = req.params

    // 1. Obtener el Radiology Center
    const center = await radiologyCentersManager.readById(id)

    if (!center) {
      return res.status(404).json({
        success: false,
        errors: {
          message: 'Radiology Center not found'
        }
      })
    }

    // 2. Obtener Medical Groups verificados
    const groupPivots = await MedicalGroupRadiologyCenter
      .find({
        radiologyCenter: id,
        status: 'verified'
      })
      .populate('medicalGroup', 'name phones website status')
      .sort({ effectiveDate: -1 })

    const medicalGroups = groupPivots
      .filter(pivot => pivot.medicalGroup)
      .map(pivot => ({
        _id: pivot.medicalGroup._id,
        name: pivot.medicalGroup.name,
        phones: pivot.medicalGroup.phones,
        website: pivot.medicalGroup.website,
        status: pivot.status,
        since: pivot.effectiveDate
      }))

    // 3. Obtener insurances verificados
    const insurancePivots = await RadiologyCenterInsurance
      .find({
        radiologyCenter: id,
        status: 'verified'
      })
      .populate(
        'insurance',
        'name shortName slug type active'
      )
      .sort({ effectiveDate: -1 })

    const insurances = insurancePivots
      .filter(pivot => pivot.insurance)
      .map(pivot => ({
        _id: pivot.insurance._id,
        name: pivot.insurance.name,
        shortName: pivot.insurance.shortName,
        slug: pivot.insurance.slug,
        type: pivot.insurance.type,
        active: pivot.insurance.active,
        status: pivot.status,
        since: pivot.effectiveDate
      }))

    // 4. Devolver el centro con sus relaciones
    return res.status(200).json({
      success: true,
      data: {
        ...center,
        medicalGroups,
        insurances
      }
    })

  } catch (err) {
    return res.status(500).json({
      success: false,
      errors: {
        message: err.message
      }
    })
  }
}

// PATCH /api/radiology-centers/:id
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
// DELETE /api/radiology-centers/:id  (soft delete)
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
// POST /api/radiology-centers/:id/notes
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
// DELETE /api/radiology-centers/:id/notes/:noteId
export const removeRadiologyCenterNote = async (req, res) => {
    try {
        const { id, noteId } = req.params
        const updated = await radiologyCentersManager.removeNote(id, noteId)
        if (!updated) {
            return res.status(404).json({ success: false, errors: { message: "Radiology Center not found" } })
        }
        res.status(200).json({ success: true, message: "Note removed successfully", data: updated })
    } catch (err) {
        res.status(500).json({ success: false, errors: { message: err.message } })
    }
}