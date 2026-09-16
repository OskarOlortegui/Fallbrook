import { useState, useEffect } from 'react'
import { api } from '../services/api'

export function useMRF() {
  const [mrfs, setMrfs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getMRFs()
        console.log(data.data)
        setMrfs(data.data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  return {
    mrfs,
    loading,
    error
  }
}