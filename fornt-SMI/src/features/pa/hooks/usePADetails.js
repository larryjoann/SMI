import { useEffect, useState, useCallback } from 'react'
import { getPA } from '../services/paService'

export function usePADetails(id) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = useCallback(() => {
    if (!id) return
    setLoading(true)
    setError(null)
    return getPA(id)
      .then(res => {
        setData(res)
        setLoading(false)
        return res
      })
      .catch(err => {
        setError(err?.message || 'Erreur lors du chargement')
        setLoading(false)
        throw err
      })
  }, [id])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}
