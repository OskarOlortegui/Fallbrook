// script/updateClinicsMRF.script.js
// Ejecutar para migrar/poblar los nuevos campos MRF en los documentos de Clinic existentes
// Ruta desde server: node script/updateClinicsMRF.script.js

import "dotenv/config.js";
import dns from "node:dns/promises";
import { connect } from 'mongoose';
import Clinic from '../src/model/clinic.model.js';

// Servidor DNS personalizado para resolver la conexión Atlas si aplica
dns.setServers(["1.1.1.1"]);

const updateClinicsMRF = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await connect(process.env.LINK_DB);
        console.log('Connected to MongoDB successfully.\n');

        // 1. Buscamos y actualizamos de forma masiva todas las clínicas que NO tienen el campo isMRF aún
        const result = await Clinic.updateMany(
            { isMRF: { $exists: false } },
            { 
                $set: { 
                    isMRF: false, 
                    requestCount: 0 
                } 
            }
        );

        console.log('── Sync Report ──');
        console.log(`Matched Clinics (sin campos MRF): ${result.matchedCount}`);
        console.log(`Updated Clinics:                 ${result.modifiedCount}`);

        // 2. Muestra opcional para verificar los documentos resultantes
        const clinicsList = await Clinic.find({}, 'name isMRF requestCount');
        console.log('\n── Current Clinics Status ──');
        clinicsList.forEach(c => {
            console.log(`• [${c.isMRF ? 'MRF ACTIVE' : 'STANDARD'}] ${c.name} | Requests: ${c.requestCount}`);
        });

        console.log('\nDone successfully.');
        process.exit(0);

    } catch (error) {
        console.error('Migration error:', error.message);
        process.exit(1);
    }
};

updateClinicsMRF();