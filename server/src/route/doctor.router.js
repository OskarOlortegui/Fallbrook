import {Router} from 'express'
import { doctorsManager, medicalGroupsManager, clinicsManager } from '../data/manager.mongo.js' 
import isValidId from '../middleware/isValidId.mid.js'; // 1. Verificamos si el formato es válido antes de llamar al Manager

const doctorRouter = Router()
// ============ CRUD BÁSICO ============
doctorRouter.post("/", async (req,res) =>{
 try {
    const newDoctor = await doctorsManager.createOne(req.body)
    res.status(201).json({
     success: true,
     data: newDoctor
    })

 } catch (err) {
    res.status(500).json({ 
      success: false,
      errors: {general: err.message}
    })
 }
})

// GET /api/doctors
// Query params: ?name=garcia  ?specialty=cardiology  ?city=fallbrook
// NOTA: el filtro por insurance ahora es GET /api/insurances/prospect?type=doctors
doctorRouter.get("/", async (req, res) => {
  try {
    // Capturamos filtros de la URL (Query Params)
    const { city, specialty, name, includeDeleted } = req.query;
    let filter = {};
    
    // Filtro por nombre del doctor
    if (name) filter.name = new RegExp(name, "i");
    if (specialty) filter.specialty = specialty;
    if (includeDeleted) filter.includeDeleted = true  // ← el Manager ya lo maneja
    if (city){
      // city vive en las clínicas asociadas, no en el doctor directamente
      // por ahora lo dejamos como placeholder hasta implementar el lookup
      console.log("filtro por city pendiente de implementar con lookup")
    }

    // Pasamos "clinics" para que rellene la info de las sedes
    const doctors = await doctorsManager.readAll(filter, "clinics medicalGroups");
    res.status(200).json({
      success: true,
      data: doctors,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      errors: { message: err.message },
    });
  }
});

// Solo disponible en desarrollo
if (process.env.NODE_ENV === 'development') {
    doctorRouter.delete('/deleteAll', async (req, res) => {
        try {
            await doctorsManager.deleteAll()
            res.status(200).json({ success: true, message: 'Todos los doctores eliminados' })
        } catch (err) {
            res.status(500).json({ success: false, errors: { message: err.message } })
        }
    })
}

// GET /api/doctors/:id
doctorRouter.get("/:id", isValidId, async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await doctorsManager.readById(id, "clinics medicalGroups");

    if (!doctor) {
      return res.status(404).json({ success: false, errors: { message: "Doctor not found" }, });
    }

    res.status(200).json({ success: true, data: doctor,});
  } catch (err) {
    res.status(500).json({ success: false, errors: { message: err.message },
    });
  }
});

// PUT /api/doctors/:id
doctorRouter.put("/:id", isValidId, async (req, res) => {
  try {
    const { id } = req.params;
    const updatedDoctor = await doctorsManager.updateById(id, req.body);

    if (!updatedDoctor) {
      return res.status(404).json({
        success: false,
        errors: { message: "Doctor not found" },
      });
    }

    res.status(200).json({
      success: true,
      data: updatedDoctor,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      errors: { message: err.message },
    });
  }
});

// DELETE /api/doctors/:id  (soft delete)
doctorRouter.delete('/:id', isValidId, async (req, res) => {
  try {
    const { id } = req.params;

    // 1. BUSCAR AL DOCTOR (Para obtener su nombre)
    const doctorActual = await doctorsManager.readById(id);
    if (!doctorActual) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }
    if (doctorActual.status === "deleted") {
      return res.status(400).json({ 
        success: false, 
        message: "Doctor is already deleted" 
      });
    }

    // 2. SOFT DELETE
    // Cambiamos el estado y renombramos para liberar el campo si fuera único
    const deactivatedDoctor = await doctorsManager.updateById(id, {
      name: `${doctorActual.name} (INACTIVE-${id.toString().slice(-4)})`,
      status: "deleted",
      blockReason: `${doctorActual.blockReason || ""} | Soft deleted on ${new Date().toISOString()}`
    });

    res.status(200).json({
      success: true,
      message: 'Doctor was deactivated successfully',
      data: deactivatedDoctor
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ============ NOTAS ============

// POST /api/doctors/:id/notes
doctorRouter.post("/:id/notes", isValidId, async (req, res) => {
  try {
    const { id } = req.params;   

    // ** Nota: simplificado, tomamos el body directamente
    const updated = await doctorsManager.addNote(id, req.body);

    res.status(200).json({
      success: true,
      message: "Note added successfully",
      data: updated
    });
  } catch (err) {
    // Si el manager lanzó "not found", respondemos 404 no 500
      if (err.message.includes("not found")) {
          return res.status(404).json({ success: false, errors: { message: err.message } })
      } // Lo mismo aplica para clinic.router.js y medicalGroup.router.js en sus endpoints de notas — todos usan el mismo addNote del manager.
      res.status(500).json({ success: false, errors: { message: err.message } })
  }
});

// ============ MEDICAL GROUPS ============
 
// POST /api/doctors/:id/medicalGroups/:mgId
doctorRouter.post("/:id/medicalGroups/:mgId", isValidId, async (req, res) => {
    try {
        const { id, mgId } = req.params;
        
        // Verificar que el medical group existe
        const mg = await medicalGroupsManager.readById(mgId);
        if (!mg) {
            return res.status(404).json({ success: false, message: "Medical Group not found" });
        }
        
        // Verificar que el doctor existe
        const doctor = await doctorsManager.readById(id);
        if (!doctor) {
            return res.status(404).json({ success: false, message: "Doctor not found" });
        }
        
        // Agregar usando $addToSet (evita duplicados)
        const updatedDoctor = await doctorsManager.model.findByIdAndUpdate(
            id,
            { $addToSet: { medicalGroups: mgId } },
            { returnDocument: 'after', runValidators: true }
        ).setOptions({ includeDeleted: true }).lean();
        
        res.status(200).json({
            success: true,
            message: "Medical Group added successfully",
            data: updatedDoctor
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// DELETE /api/doctors/:id/medicalGroups/:mgId
doctorRouter.delete("/:id/medicalGroups/:mgId", isValidId, async (req, res) => {
    try {
        const { id, mgId } = req.params;
        
        // Verificar que el doctor existe
        const doctor = await doctorsManager.readById(id);
        if (!doctor) {
            return res.status(404).json({ success: false, message: "Doctor not found" });
        }

        // ✅ Verificar que el mgId realmente está en el array
        const exists = doctor.medicalGroups.some(mg => mg.toString() === mgId)
        if (!exists) {
            return res.status(404).json({ 
                success: false, 
                errors: { message: "Medical Group not found on this doctor" } 
            })
        }
        
        // Remover usando $pull
        const updatedDoctor = await doctorsManager.model.findByIdAndUpdate(
            id,
            { $pull: { medicalGroups: mgId } },
            { returnDocument: 'after', runValidators: true }
        ).setOptions({ includeDeleted: true }).lean();
        
        res.status(200).json({
            success: true,
            message: "Medical Group removed successfully",
            data: updatedDoctor
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ============ CLINICS ============
 
// POST /api/doctors/:id/clinics/:clinicId ➡️ Se interpreta como: "Voy a crear una relación entre este doctor y esta clínica".
doctorRouter.post("/:id/clinics/:clinicId", isValidId, async (req, res) => {
    try {
        const { id, clinicId } = req.params;
        
        // Verificar que la clínica existe
        const clinic = await clinicsManager.readById(clinicId);
        if (!clinic) {
            return res.status(404).json({ success: false, message: "Clinic not found" });
        }

        // ✅ AGREGADO: Verificar doctor
        const doctor = await doctorsManager.readById(id)
        if (!doctor) {
            return res.status(404).json({ success: false, message: "Doctor not found" })
        }
        
        await doctorsManager.model.findByIdAndUpdate(
            id,
            { $addToSet: { clinics: clinicId } }, // Agrega Clínica al Doctor ($addToSet)
            { returnDocument: 'after', runValidators: true }
        ).setOptions({ includeDeleted: true }).lean();

        // Si la clínica pertenece a un medicalGroup, agregar el medicalgroup al doctor también
        if (clinic.medicalGroup) {
            const hasGroup = doctor.medicalGroups?.some(
                mg => mg.toString() === clinic.medicalGroup.toString()
            )
            if (!hasGroup) {
                await doctorsManager.model.findByIdAndUpdate(
                    id,
                    { $addToSet: { medicalGroups: clinic.medicalGroup } },
                    { returnDocument: 'after' , runValidators: true }
                ).setOptions({ includeDeleted: true }).lean();
            }
        }
        
        const finalDoctor = await doctorsManager.readById(id, "clinics medicalGroups");
        
        res.status(200).json({
            success: true,
            message: "Clinic added successfully",
            data: finalDoctor
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// DELETE /api/doctors/:id/clinics/:clinicId
doctorRouter.delete("/:id/clinics/:clinicId", isValidId, async (req, res) => {
    try {
        const { id, clinicId } = req.params;

        // ✅ Verificar que el doctor existe
        const doctor = await doctorsManager.readById(id)
        if (!doctor) {
            return res.status(404).json({ success: false, errors: { message: "Doctor not found" } })
        }

        // ✅ Verificar que la clínica está en el array
        const exists = doctor.clinics.some(c => c.toString() === clinicId)
        if (!exists) {
            return res.status(404).json({ 
                success: false, 
                errors: { message: "Clinic not found on this doctor" } 
            })
        }
        
        const updatedDoctor = await doctorsManager.model.findByIdAndUpdate(
            id,
            { $pull: { clinics: clinicId } }, // $pull le dice directamente a la base de datos: "Haz el filtrado y la eliminación tú misma directamente en el servidor de MongoDB, en un solo paso
            { returnDocument: 'after', runValidators: true }
        ).setOptions({ includeDeleted: true }).lean();
        
        res.status(200).json({
            success: true,
            message: "Clinic removed successfully",
            data: updatedDoctor
        });
    } catch (err) {
        res.status(500).json({ success: false, errors: { message: err.message } }) //colocar en todos los catch esta estructura!!!
    }
});

export default doctorRouter;