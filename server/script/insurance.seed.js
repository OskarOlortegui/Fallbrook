// seeds/insurance.seed.js
// Ejecutar UNA sola vez para poblar la colección Insurance
// desde tu array INSURANCES existente
//
// Uso: node seeds/insurance.seed.js
import "dotenv/config.js"
import dns from "node:dns/promises";
import {connect} from 'mongoose'
import Insurance from '../src/model/insurance.model.js'
dns.setServers(["1.1.1.1"]);

const INSURANCES_SEED = [
    { name: "Medicare",                         shortName: "Medicare",    slug: "medicare",       type: "government" },
    { name: "Medi-Cal",                         shortName: "Medi-Cal",    slug: "medi-cal",       type: "government" },
    { name: "Anthem Blue Cross",                shortName: "Anthem",      slug: "anthem",         type: "commercial" },
    { name: "Blue Shield of California",        shortName: "Blue Shield", slug: "blue-shield",    type: "commercial" },
    { name: "Kaiser Permanente",                shortName: "Kaiser",      slug: "kaiser",         type: "managed-care" },
    { name: "Aetna",                            shortName: "Aetna",       slug: "aetna",          type: "commercial" },
    { name: "Cigna",                            shortName: "Cigna",       slug: "cigna",          type: "commercial" },
    { name: "Health Net",                       shortName: "Health Net",  slug: "health-net",     type: "managed-care" },
    { name: "Molina Healthcare",                shortName: "Molina",      slug: "molina",         type: "managed-care" },
    { name: "Sharp Health Plan",                shortName: "Sharp",       slug: "sharp",          type: "managed-care" },
    { name: "Scripps Health Plan",              shortName: "Scripps",     slug: "scripps",        type: "managed-care" },
    { name: "United Healthcare",                shortName: "UHC",         slug: "united",         type: "commercial" },
    { name: "CHG (Community Health Group)",     shortName: "CHG",         slug: "chg",            type: "managed-care" },
    { name: "Imperial Health Plan",             shortName: "Imperial",    slug: "imperial",       type: "managed-care" },
    { name: "Blue Cross",                       shortName: "Blue Cross",  slug: "blue-cross",     type: "commercial" },
    { name: "TriCare",                          shortName: "TriCare",     slug: "tricare",        type: "government" },
    { name: "Workers' Comp",                    shortName: "W-Comp",      slug: "workers-comp",   type: "workers-comp" },
    { name: "Prospect",                         shortName: "Prospect",    slug: "prospect",       type: "managed-care" },
    { name: "Regal",                            shortName: "Regal",       slug: "regal",          type: "managed-care" },
    { name: "PCAC",                             shortName: "PCAC",        slug: "pcac",           type: "managed-care" },
    { name: "Self Pay",                         shortName: "Self Pay",    slug: "selfpay",        type: "selfpay" },
    { name: "Empire Healthcare",                shortName: "Empire",      slug: "empire",         type: "managed-care" },
    { name: "Optum",                            shortName: "Optum",       slug: "optum",          type: "commercial" },
]

const seed = async () => {
    try {
        await connect(process.env.LINK_DB)
        console.log('Connected to MongoDB')

        let created = 0
        let skipped = 0

        /* Gracias a ese skipped, puedes ejecutar este archivo cada vez que agregues un seguro nuevo a la lista 
        sin preocuparte por borrar la base de datos o duplicar la información que ya tenías guardada. 
          ¡Es un salvavidas muy profesional! */

        for (const data of INSURANCES_SEED) {
            const exists = await Insurance.findOne({ slug: data.slug })
            if (exists) {
                console.log(`  SKIP: "${data.name}" ya existe`)
                skipped++
            } else {
                await Insurance.create(data)
                console.log(`  OK:   "${data.name}" creado`)
                created++
            }
        }

        console.log(`\nDone. Created: ${created} | Skipped: ${skipped}`)
        process.exit(0)
    } catch (error) {
        console.error('Seed error:', error.message)
        process.exit(1)
    }
}

seed();