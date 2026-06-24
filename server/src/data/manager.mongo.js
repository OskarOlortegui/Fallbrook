import Doctor from "../model/doctor.model.js";
import MedicalGroup from '../model/medicalGroup.model.js';
import Clinic from '../model/clinic.model.js';
import RadiologyCenter from '../model/radiologyCenter.model.js'

// con populate
class Manager {
  constructor(model) {
    this.model = model; //model guarda la instancia  ejemplo `doctorsManager.model === Doctor (el modelo de Mongoose)`
  }

  createOne = async (data) => await this.model.create(data);

  // Agregamos 'populatePath' para decidir qué "rellenar"
  readAll = async (filter = {}, populatePath = "") => {
    // 1. Extraemos la "llave" del objeto filter
    const { includeDeleted, ...queryData } = filter;
    // 2. Iniciamos la consulta con los datos limpios
    let query = this.model.find(queryData);
    
    // 3. Si pedimos incluir borrados, usamos setOptions
    if (includeDeleted) {
      query.setOptions({ includeDeleted: true });
    }
    return await query.populate(populatePath).lean();
    //return await this.model.find(filter).populate(populatePath).lean();
  };

  readById = async (id, populatePath = "") => {
    return await this.model.findOne({ _id: id }).setOptions({ includeDeleted: true }).populate(populatePath).lean();
  };

  readBy = async (filter, populatePath = "") => {
    return await this.model.findOne(filter).populate(populatePath).lean();
  };

  updateById = async (id, data) => { /* Model.findByIdAndUpdate(id, update, options, callback) */
    return await this.model.findByIdAndUpdate(id, data, { returnDocument: 'after', runValidators: true }).setOptions({ includeDeleted: true }).lean();
  };

  destroyById = async (id) => await this.model.findByIdAndDelete(id);

  // NUEVO MÉTODO: Agregar una nota sin borrar las anteriores
  addNote = async (id, noteData) => {
    /* doc hace referencia a 1 doctor, 1 clinica, 1 medGroup ... etc */
      const doc = await this.model.findOne({ _id: id, status: { $ne: "deleted" } }).setOptions({ includeDeleted: true }); //ver en modelos el Schema.pre(/^find/
      if (!doc) throw new Error("Document not found or deleted"); // Verifica que no esté deleted antes de agregar nota

    return await this.model.findByIdAndUpdate(
      id,
      { $push: { notes: noteData } }, // $push añade al array, no reemplaza
      { returnDocument: 'after', runValidators: true } // Para devolver el doctor con la nota ya puesta
    ).setOptions({ includeDeleted: true }).lean();
  };

  /* Delete All testing - rebooting DB */
  deleteAll = async () => await this.model.deleteMany({});
  }

// Exportamos los 3 managers independientes
export const doctorsManager = new Manager(Doctor);
export const medicalGroupsManager = new Manager(MedicalGroup);
export const clinicsManager = new Manager(Clinic);
export const radiologyCentersManager = new Manager(RadiologyCenter)
