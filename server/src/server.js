import "dotenv/config.js"
import dns from "node:dns/promises";
import {join} from 'path'
import express from 'express'
import morgan from 'morgan'
import dbConnect from './util/dbConnect.util.js'
import rootDir from "./util/dirname.util.js";

import doctorRouter from "./route/doctor.router.js";
import clinicRouter from './route/clinic.router.js';
import medicalGroupRouter from './route/medicalGroup.router.js';
import insuranceRouter from "./route/insurance.router.js";
import radiologyRouter from "./route/radiologyCenter.router.js";

dns.setServers(["1.1.1.1"]);  // this is for mongo `+svr` link DB

//server settings
const server = express()
const PORT = process.env.PORT || 8080;
const ready = async () => { 
  await dbConnect(process.env.LINK_DB)
  console.log(`Server running on http://localhost:${PORT}`)
}
server.listen(PORT, ready)

console.log(rootDir)

//middleware en este orden
server.use(morgan("dev"))
server.use(express.json())
// server.use(express.urlencoded({ extended: true }));
server.use(express.static(join(rootDir, "public")))

// Health check
server.get('/', (req,res) => res.send("🏥 API Buscador de Doctores funcionando"))
server.use("/api/doctors", doctorRouter); //3
server.use("/api/clinics", clinicRouter); //7
server.use("/api/medical-groups", medicalGroupRouter); //3
server.use("/api/insurances", insuranceRouter); //20
server.use("/api/radiology-centers", radiologyRouter); //3
