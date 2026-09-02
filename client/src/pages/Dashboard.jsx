import Topbar from '../components/Topbar'
import CounterCard from '../components/CounterCard'
import DoctorCard from '../components/DoctorCard'
import MRFCard from '../components/MRFCard'
import { useEffect, useState } from 'react'
import { api } from '../services/api'

// ── Datos hardcodeados (temporales hasta conectar la API) ──
const COUNTERS = [
  { label: 'Doctors',     count: 3,  icon: '🩺' },
  { label: 'Clinics',     count: 7,  icon: '🏥' },
  { label: 'Groups',      count: 3,  icon: '🔗' },
  { label: 'Insurances',  count: 20, icon: '🛡️' },
  { label: 'Radiology',   count: 3,  icon: '☢️' },
  { label: 'Do not refer',count: 0,  icon: '🚫', danger: true },
]

const DOCTORS = [
  {
    id: '1',
    name: 'Naveen Gara',
    specialty: 'Gastroenterology',
    npi: '1942406533',
    gender: 'male',
    status: 'verified',
    address: '935 E Pennsylvania Ave, Escondido, CA 92025',
    phone: '(760) 690-2800',
    fax: '949-404-6908',
    insurances: ['CHG', 'Molina'],
  },
  {
    id: '2',
    name: 'Vishal Banthia',
    specialty: 'Otolaryngology (ENT)',
    npi: '1043396559',
    gender: 'male',
    status: 'verified',
    address: '2390 Faraday Ave, Carlsbad, CA 92008',
    phone: '858-909-0770',
    fax: '858-909-0880',
    insurances: ['CHG'],
  },
  {
    id: '3',
    name: 'Grigoriy Patish',
    specialty: 'Podiatry',
    npi: '1609817535',
    gender: 'male',
    status: 'verified',
    address: '407 Potter St Suite A, Fallbrook, CA 92028',
    phone: '760-728-4800',
    fax: '760-728-0061',
    insurances: ['Aetna', 'Health Net', 'Blue Shield', 'Self Pay'],
  },
]

const MRF_LIST = [
  {
    id: '1',
    name: 'Temecula Valley Hospital',
    address: '31700 Temecula Pkwy, Temecula CA',
    phone: 'Medical Records: 951 331 2410 opt 2',
    fax: '951 600 4363',
  },
  {
    id: '2',
    name: 'Palomar Medical Center',
    address: '2185 Citracado Pkwy, Escondido CA',
    phone: '760-739-3000',
    fax: '760-480-7966',
  },
  {
    id: '3',
    name: 'Rancho Springs Medical Center',
    address: '25500 Medical Center Dr, Murrieta CA',
    phone: '951 696 6000',
    fax: '951 600 4363',
  },
]


export default function Dashboard() {
  /*  const [clinics, setClinics] = useState([])
  const [medicalGroups, setMedicalGroups] = useState([])
  const [insurances, setInsurances] = useState([])
  const [radiology, setRadiology] = useState([]) */
  
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadDoctors() {
      try {
        const data = await api.getDoctors() // data = {success, data}
        console.log(data)
        setDoctors(data.data)
      } catch (error) {
        console.error(error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }
    loadDoctors()
  }, [])
  
  return (
    <div className="min-h-screen bg-(--bg) text-(--text)">
      <Topbar />

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Saludo */}
        <h1 className="text-xl font-medium mb-1">Good morning, Oskar</h1>
        <p className="text-sm text-(--text2) mb-8">
          Fallbrook Backoffice · {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        {/* Contadores */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
          {COUNTERS.map(c => (
            <CounterCard key={c.label} {...c} />
          ))}
        </div>

        {/* Doctores recientes */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-medium">Recent doctors</h2>
          <button className="text-xs text-(--accent) hover:underline">See all →</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
          {loading && <p className="text-xs text-(--muted)">Loading...</p>}
          {error   && <p className="text-xs text-(--danger)">{error}</p>}
          {!loading && !error && doctors.map(d => (
            <DoctorCard key={d._id} doctor={d} />
          ))}
        </div>

        {/* MRF */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-medium">Medical records facilities (MRF)</h2>
          <button className="text-xs text-(--accent) hover:underline">See all →</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
          {MRF_LIST.map(m => (
            <MRFCard key={m.id} facility={m} />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-(--border) px-6 py-4 flex items-center justify-between text-xs text-(--muted)">
        <div className="flex gap-4">
          {['Doctors','Clinics','Insurances','Radiology','MRF'].map(l => (
            <button key={l} className="hover:text-(--text2) cursor-pointer">{l}</button>
          ))}
        </div>
        <span>Fallbrook Backoffice © {new Date().getFullYear()}</span>
      </footer>
    </div>
  )
}