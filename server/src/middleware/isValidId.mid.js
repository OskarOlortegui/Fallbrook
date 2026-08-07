import { isValidObjectId } from 'mongoose';

const isValidId = (req, res, next) => {
  //const id = req.params.id || req.params.doctorId || req.params.clinicId || req.params.insuranceId;
  // Toma el primer param disponible sin importar su nombre
  const id = Object.values(req.params)[0];

  if (!isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      errors: { message: "Invalid ID format for MongoDB" }
    });
  }

  // Si todo está bien, 'next()' le dice a Express que pase a la siguiente función (el Router)
  next();
};

export default isValidId;

/* A considerar
Un ObjectId de MongoDB solo puede contener caracteres hexadecimales 
(números del 0-9 y letras de la a-f).
*/