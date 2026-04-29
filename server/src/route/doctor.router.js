import {Router} from 'express'
import {doctorsManager} from '../data/manager.mongo.js' //model
import isValidId from '../middleware/isValidId.mid.js'; // 1. Verificamos si el formato es válido antes de llamar al Manager

const doctorRouter = Router()

doctorRouter.post("/", async (req,res) =>{
 try {
    const newDoctor = await doctorsManager.createOne(req.body)
    res.status(201).json({
     success: true,
     data: newDoctor
    })

 } catch (err) {
    res.status(500).json({ 
      success: true,
      errors: {general: err.message}
    })
 }
})

// --- READ: Obtener doctores (Con filtros de búsqueda) ---
doctorRouter.get("/", async (req, res) => {
  try {
    // Capturamos filtros de la URL (Query Params)
    const { city, specialty, insurance, name } = req.query;
    let filter = {};
    //ejm http://localhost:8080/api/doctors?city=Los Angeles
    //GET http://localhost:8080/api/doctors?insurance=CHG&specialty=Cardiology

    // Filtro por ciudad (dentro del array de clínicas)
    if (city) filter["clinics.city"] = new RegExp(city, "i");
    
    // Filtro por nombre del doctor
    if (name) filter.name = new RegExp(name, "i");
    
    // Filtros exactos
    if (specialty) filter.specialty = specialty;
    if (insurance) filter.insurances = insurance; // MongoDB busca dentro del array automáticamente

    // Pasamos "clinics" para que rellene la info de las sedes
    const doctors = await doctorsManager.readAll(filter, "clinics");

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

// --- READ ONE: Obtener un doctor por su ID ---
doctorRouter.get("/:id", isValidId, async (req, res) => {
  try {
    const { id } = req.params;
    // if (!isValidObjectId(id)) we'r using a middleware now

    // También aquí queremos ver los detalles de su clínica
    const doctor = await doctorsManager.readById(id,"clinics");

    if (!doctor) {
      return res.status(404).json({
        success: false,
        errors: { message: "Doctor not found" },
      });
    }

    res.status(200).json({
      success: true,
      data: doctor,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      errors: { message: err.message },
    });
  }
});

// --- UPDATE: Editar info de un doctor o agregar notas ---
doctorRouter.put("/:id", isValidId, async (req, res) => {
  try {
    const { id } = req.params;
    // if (!isValidObjectId(id)) we'r using a middleware now

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

doctorRouter.delete('/:id', isValidId, async (req, res) => {
  try {
    const { id } = req.params;
    // if (!isValidObjectId(id)) we'r using a middleware now
    
    const deletedDoctor = await doctorsManager.destroyById(id);

    // Si deletedDoctor es null, significa que el ID no existía en la DB
    if (!deletedDoctor) {
      return res.status(404).json({
        success: false,
        errors: { message: "Doctor not found" }
      });
    }

    res.status(200).json({
      success: true,
      message: 'Doctor was deleted successfully',
      data: deletedDoctor // A veces es útil devolver lo que se borró
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      errors: { message: err.message }
    });
  }
});

// POST /api/doctors/:id/notes
doctorRouter.post("/:id/notes", isValidId, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Usamos el nuevo método del manager
    // Ejemplo de URL: http://localhost:8080/api/doctors/123/notes?author=Christian
    // const updatedDoctor = await doctorsManager.addNote(id, req.query.author ? { ...req.body, author: req.query.author } : req.body); 
    // era otra forma por eso esta comentado lo de arriba

    // ** Nota: simplificado, tomamos el body directamente
    const doctorWithNote = await doctorsManager.addNote(id, req.body);

    if (!doctorWithNote) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    res.status(200).json({
      success: true,
      message: "Note added successfully",
      data: doctorWithNote
    });
  } catch (err) {
    res.status(500).json({ success: false, errors: { message: err.message } });
  }
});

export default doctorRouter;