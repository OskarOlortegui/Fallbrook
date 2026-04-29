import "dotenv/config.js"
import dns from "node:dns/promises";
import {join} from 'path'
import express from 'express'
import morgan from 'morgan'
import dbConnect from './util/dbConnect.util.js'
import rootDir from "./util/dirname.util.js";

import doctorRouter from "./route/doctor.router.js";
import facilityRouter from './route/facility.router.js';
import clinicRouter from './route/clinic.router.js';

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

//middleware
server.use(express.json())
// server.use(express.urlencoded({ extended: true }));
server.use(express.static(join(rootDir, "public")))
server.use(morgan("dev"))

server.get('/', (req,res) => res.send("hola"))
server.use("/api/facilities", facilityRouter);
server.use("/api/clinics", clinicRouter);
server.use("/api/doctors", doctorRouter);
