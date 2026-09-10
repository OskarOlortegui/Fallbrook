import { useEffect, useState } from 'react'
import { api } from '../services/api'

export function useDashboardData() {

  const [doctors, setDoctors] = useState([])
  const [clinics, setClinics] = useState([])
  const [medicalGroups, setMedicalGroups] = useState([])
  const [insurances, setInsurances] = useState([])
  const [radiology, setRadiology] = useState([])
  const [popularMRFs, setPopularMRFs] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(()=>{
    async function loadDashboardData() {
        try {
            setLoading(true)
            setError(null)

            // Ejecutamos todas las peticiones en paralelo
            const [docsRes, clinicsRes, groupsRes, insRes, radRes, mrfRes] = await Promise.all([
            api.getDoctors(),
            api.getClinics(),
            api.getMedicalGroups(),
            api.getInsurances(),
            api.getRadiology(),
            api.getPopularMRFs()
            ])

            setDoctors(docsRes.data)
            setClinics(clinicsRes.data)
            setMedicalGroups(groupsRes.data)
            setInsurances(insRes.data)
            setRadiology(radRes.data)
            setPopularMRFs(mrfRes.data)
                
        } catch (err) {
            console.error(err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }
    loadDashboardData()
  },[])

  return {
        doctors,
        clinics,
        medicalGroups,
        insurances,
        radiology,
        popularMRFs,
        loading,
        error
    }
}