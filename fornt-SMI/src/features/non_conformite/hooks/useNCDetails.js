
import { useEffect, useState, useCallback } from 'react'
import { getNC, archiverNC } from '../services/nonConformiteService'

export function useNCDetails(id) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setError(null)
    getNC(id)
      .then(res => {
        setData(res)
        setLoading(false)
      })
      .catch(err => {
        setError(err?.response?.data?.message || 'Erreur lors du chargement')
        setLoading(false)
      })
  }, [id])

  return { data, loading, error }
}

// Hook pour archiver une NC
export function useArchiveNC() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const archive = useCallback(async (id) => {
    setLoading(true)
    setError(null)
    setSuccess(false)
    try {
      await archiverNC(id)
      setSuccess(true)
    } catch (err) {
      setError(err?.response?.data?.message || 'Erreur lors de l\'archivage')
    } finally {
      setLoading(false)
    }
  }, [])

  return { archive, loading, error, success }
}
