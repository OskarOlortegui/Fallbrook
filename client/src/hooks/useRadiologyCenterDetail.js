import { useState, useEffect } from 'react'
import { api } from '../services/api'

export function useRadiologyCenterDetail(id) {
  const [center, setCenter] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) {
      setCenter(null)
      setError('Radiology Center ID is missing.')
      setLoading(false)
      return
    }

    async function loadCenter() {
      try {
        setLoading(true)
        setError(null)

        const response = await api.getRadiologyCenterById(id)

        setCenter(response.data)
      } catch (err) {
        setError(
          err.message || 'Error loading Radiology Center.'
        )
      } finally {
        setLoading(false)
      }
    }

    loadCenter()
  }, [id])

  return {
    center,
    loading,
    error
  }
}