import Doctor from "../model/doctor.model.js";
import MedicalGroup from '../model/facility.model.js';
import Clinic from '../model/clinic.model.js';

/* class Manager {
  constructor(model){
    this.model = model;
  }

  createOne = async (data) => await this.model.create(data);
  readAll = async (filter) => await this.model.find(filter).lean();
  // readById = async (id) => await this.model.findById(id).lean(); 
  readById = async (id) => await this.model.findOne({_id: id}).lean()
  readBy = async (filter) => await this.model.findOne(filter).lean()
  updateById = async (id, data) => await this.model.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();  // `new: true` para devolver el documento actualizado
  destroyById = async (id) => await this.model.findByIdAndDelete(id);
}

export const doctorsManager = new Manager(Doctor);
export const medicalGroupsManager = new Manager(MedicalGroup);
export const clinicsManager = new Manager(Clinic); */

// con populate

class Manager {
  constructor(model) {
    this.model = model;
  }

  createOne = async (data) => await this.model.create(data);

  // Agregamos 'populatePath' para decidir qué "rellenar"
  readAll = async (filter, populatePath = "") => {
    return await this.model.find(filter).populate(populatePath).lean();
  };

  readById = async (id, populatePath = "") => {
    return await this.model.findOne({ _id: id }).populate(populatePath).lean();
  };

  readBy = async (filter, populatePath = "") => {
    return await this.model.findOne(filter).populate(populatePath).lean();
  };

  updateById = async (id, data) => {
    return await this.model.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
  };

  destroyById = async (id) => await this.model.findByIdAndDelete(id);

  // NUEVO MÉTODO: Agregar una nota sin borrar las anteriores
  addNote = async (id, noteData) => {
    return await this.model.findByIdAndUpdate(
      id,
      { $push: { notes: noteData } }, // $push añade al array, no reemplaza
      { new: true, runValidators: true } // Para devolver el doctor con la nota ya puesta
    ).lean();
  };
}

// Exportamos los 3 managers independientes
export const doctorsManager = new Manager(Doctor);
export const medicalGroupsManager = new Manager(MedicalGroup);
export const clinicsManager = new Manager(Clinic);
