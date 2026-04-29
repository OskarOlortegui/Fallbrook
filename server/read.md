GET ALL FILTER
Ahora podrías hacer peticiones mucho más potentes:

GET http://localhost:8080/api/doctors?city=Los Angeles

GET http://localhost:8080/api/doctors?insurance=CHG&specialty=Cardiology


# jerarquia models
La Jerarquía: ¿Quién es el jefe?
Efectivamente, la jerarquía que mencionas es la más lógica para tu flujo de trabajo en la clínica:

1. Nivel 1 (Principal): medicalGroups

Es la entidad independiente. No necesita "apuntar" a nadie más arriba. Es la corporación o el grupo de especialistas (ej. Nephrology Associates).

2. Nivel 2 (Dependiente): clinics

Depende de un medicalGroup. Una clínica física suele pertenecer a un grupo médico.

3. Nivel 3 (Dependiente): doctors

Depende de las clinics. Un doctor atiende en una o varias ubicaciones físicas