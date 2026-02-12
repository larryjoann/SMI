import { useState, useEffect, useCallback } from 'react'
import { getIndicateurs } from '../services/indicateurService'

const mapMesuresToValues = (mesures, pas_en_mois) => {
  if (!mesures) return []
  if (pas_en_mois <= 1) {
    const vals = Array(12).fill(null)
    mesures.forEach(m => {
      const idx = (m.periode || 1) - 1
      if (idx >= 0 && idx < 12) vals[idx] = m.valeur
    })
    return vals
  } else {
    const slots = Math.floor(12 / pas_en_mois)
    const vals = Array(slots).fill(null)
    mesures.forEach(m => {
      const idx = (m.periode || 1) - 1
      if (idx >= 0 && idx < slots) vals[idx] = m.valeur
    })
    return vals
  }
}

const mapEstAtteintToValues = (mesures, pas_en_mois) => {
  if (!mesures) return []
  if (pas_en_mois <= 1) {
    const vals = Array(12).fill(null)
    mesures.forEach(m => {
      const idx = (m.periode || 1) - 1
      if (idx >= 0 && idx < 12) vals[idx] = m.estAtteint
    })
    return vals
  } else {
    const slots = Math.floor(12 / pas_en_mois)
    const vals = Array(slots).fill(null)
    mesures.forEach(m => {
      const idx = (m.periode || 1) - 1
      if (idx >= 0 && idx < slots) vals[idx] = m.estAtteint
    })
    return vals
  }
}

export default function useIndicateurs() {
  const [indicateurs, setIndicateurs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getIndicateurs()
      const transformed = data.map(item => {
        const pas_en_mois = item.frequenceMesure?.intervalleMois || 1
        const ciblesFormatted = (item.cibles || [])
          .map(c => c.cibleDescription || (c.cibleMin != null ? `${c.cibleMin}${item.uniteMesure?.abr || ''}` : ''))
          .filter(c => c)
          .map(c => `- ${c}`)
          .join('\n')
        return {
          id: item.id,
          indicateur: item.nom,
          cible: ciblesFormatted,
          frequence: item.frequenceMesure?.nom || '',
          pas_en_mois,
          uniteAbr: item.uniteMesure?.abr || '',
          valeurs: mapMesuresToValues(item.mesures || [], pas_en_mois),
          estAtteint: mapEstAtteintToValues(item.mesures || [], pas_en_mois),
          objectif: item.objectif?.descr || '',
          objectifStrategique: item.objectif?.objectifStrategique?.descr || '',
          cibles: item.cibles || []
        }
      })
      setIndicateurs(transformed)
    } catch (e) {
      setError(e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return { indicateurs, loading, error, reload: load }
}
