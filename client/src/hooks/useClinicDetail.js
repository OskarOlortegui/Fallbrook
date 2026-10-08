import { useState, useEffect } from 'react'
import { api } from '../services/api'

export function useClinicDetail(id) {
  const [clinic, setClinic] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        setError(null)

        const data = await api.getClinicById(id)

        setClinic(data.data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      load()
    }
  }, [id])

  return {
    clinic,
    loading,
    error
  }
}