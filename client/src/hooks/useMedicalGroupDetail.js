
import { useState, useEffect } from 'react'
import { api } from '../services/api'

export function useMedicalGroupDetail(id) {
  const [group, setGroup] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }

    async function load() {
      try {
        setLoading(true)
        setError(null)

        const response = await api.getMedicalGroupById(id)
        setGroup(response.data)
      } catch (err) {
        setError(err.message || 'Error loading medical group.')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [id])

  return { group, loading, error }
}
