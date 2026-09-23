import { isValidObjectId } from 'mongoose';

const isValidId = (req, res, next) => {
  // Validar TODOS los parámetros que vengan en req.params
  const paramValues = Object.values(req.params);

  for (const value of paramValues) {
    if (!isValidObjectId(value)) {
      return res.status(400).json({
        success: false,
        errors: { message: `Invalid ID format: "${value}"` }
      });
    }
  }

  // Si todo está bien, 'next()' le dice a Express que pase a la siguiente función (el Router)
  next();
};

export default isValidId;

/* A considerar
Un ObjectId de MongoDB solo puede contener caracteres hexadecimales 
(números del 0-9 y letras de la a-f).
*/