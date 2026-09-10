import Topbar from '../components/Topbar'
import CounterCard from '../components/CounterCard'
import DoctorCard from '../components/DoctorCard'
import MRFCard from '../components/MRFCard'
import { useEffect, useState } from 'react'
import { useDashboardData } from '../hooks/useDashboardData'
import { Link } from 'react-router'

// ── Datos hardcodeados (temporales hasta conectar la API) ──
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
 const {
    doctors,
    clinics,
    medicalGroups,
    insurances,
    radiology,
    popularMRFs,
    loading,
    error
  } = useDashboardData();

  const counters = [
    {
      label: 'Doctors',
      count: doctors.length,
      icon: '🩺'
    },
    {
      label: 'Clinics',
      count: clinics.length,
      icon: '🏥'
    },
    {
      label: 'Groups',
      count: medicalGroups.length,
      icon: '🔗'
    },
    {
      label: 'Insurances',
      count: insurances.length,
      icon: '🛡️'
    },
    {
      label: 'Radiology',
      count: radiology.length,
      icon: '☢️'
    }
  ]
  
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
          {counters.map(c => (
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
          <Link to="/clinics/mrf" className="text-xs text-(--accent) hover:underline">See all →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
          {popularMRFs.map(mrf => (
            <MRFCard key={mrf._id} facility={mrf} />
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