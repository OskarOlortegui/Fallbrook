GET ALL FILTER
Ahora podrías hacer peticiones mucho más potentes:

GET http://localhost:8080/api/doctors?city=Los Angeles

GET http://localhost:8080/api/doctors?insurance=CHG&specialty=Cardiology

# 🧠 ¿Qué es realmente un medical group?
En EE.UU., un medical group es básicamente:
👉 Una organización de médicos que trabajan bajo una misma entidad
(comparten administración, contratos con seguros, facturación, etc.)
No es solo un nombre bonito, es una estructura organizativa.

# filtros URL GET con todos los models
- Tienes razón en que req.query depende de la URL
- req.query: Es el "apodo" que usas en la URL.

# 🧠 1. ¿Cuándo usar index: true?
Regla simple: 👉 Pon index: true en campos que vas a usar para buscar, filtrar o relacionar MUY seguido


# jerarquia models ❗ No es una jerarquía estricta, es una red de relaciones opcionales este es el #1
La Jerarquía: ¿Quién es el jefe?
Efectivamente, la jerarquía que mencionas es la más lógica para tu flujo de trabajo en la clínica:

1. Nivel 1 (Principal): medicalGroups

Es la entidad independiente. No necesita "apuntar" a nadie más arriba. Es la corporación o el grupo de especialistas (ej. Nephrology Associates).

2. Nivel 2 (Dependiente): clinics

Depende de un medicalGroup. Una clínica física suele pertenecer a un grupo médico.

3. Nivel 3 (Dependiente): doctors

Depende de las clinics. Un doctor atiende en una o varias ubicaciones físicas

# Banderas mongoose
- $addToSet y $pull son operadores de MongoDB para modificar arrays sin reemplazar todo el documento.

# updateAlgo en doctors router
class Manager {
    constructor(model) {
        this.model = model  // ← "model" se guarda en la instancia
    }
}

export const doctorsManager = new Manager(Doctor)
// doctorsManager.model === Doctor (el modelo de Mongoose)
doctorsManager.model.findByIdAndUpdate(...)
// es exactamente lo mismo que escribir:
Doctor.findByIdAndUpdate(...)

# orden rutas
🛠️ El Orden Correcto (La Regla de Oro de Express)
La regla de oro en Express es: Las rutas estáticas (rutas fijas) SIEMPRE van antes que las rutas dinámicas (las que llevan :).

# mongo $flags
en - // POST /api/doctors/:id/medicalGroups/:mgId
$addToSet funciona como un "Conjunto" matemático: Solo añade el mgId si este no existe previamente en el array medicalGroups. 
Si el doctor ya pertenecía a ese grupo médico, MongoDB ignora la operación silenciosamente y no duplica los datos. ¡Es ultra eficiente!


-- 
PORT=8080
SECRET=secret
LINK_DB=mongodb+srv://fallbrook_db_user:yuWZXx53AlyPztxW@cluster0.xny5w9q.mongodb.net/fallbrook_db