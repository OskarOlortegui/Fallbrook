import { useState, useEffect } from 'react'
import { api } from '../services/api'

export function useDoctorDetail(id) {
  const [doctor, setDoctor]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    if (!id) return
    async function load() {
      try {
        setLoading(true)
        setError(null)
        const data = await api.getDoctorById(id)
        setDoctor(data.data)
      } catch (err) {
        setError(err.message || 'Error loading doctor.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  return { doctor, loading, error }
}