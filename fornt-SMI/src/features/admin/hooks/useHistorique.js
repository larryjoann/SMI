import { useEffect, useState } from 'react'
import { getHistoriques } from '../services/historiqueService'

export function useHistorique() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const data = await getHistoriques()
      setRows(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Erreur getHistorique', err)
      setError(err?.message || 'Erreur lors du chargement de l\'historique')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  return { rows, loading, error, reload: load }
}
