import { useEffect, useState } from 'react'
import { getProcessusById } from '../services/processusService'

export function useProcessusDetails(id) {
  const [processus, setProcessus] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      setLoading(true)
      getProcessusById(id)
        .then(data => setProcessus(data))
        .finally(() => setLoading(false))
    }
  }, [id])

  return { processus, loading }
}