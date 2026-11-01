// hooks/useInsuranceDetail.js
import { useEffect, useState } from 'react'
import { api } from '../services/api'

export function useInsuranceDetail(slug) {
  const [insuranceData, setInsuranceData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!slug) return

    async function loadInsurance() {
      try {
        setLoading(true)
        setError(null)

        const response = await api.getInsuranceBySlug(slug)
        setInsuranceData(response.data)
      } catch (err) {
        setError(err.message || 'Could not load insurance.')
      } finally {
        setLoading(false)
      }
    }

    loadInsurance()
  }, [slug])

  return {
    insuranceData,
    loading,
    error
  }
}