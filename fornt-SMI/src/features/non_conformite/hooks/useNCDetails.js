
import { useEffect, useState, useCallback } from 'react'
import { getNC, archiverNC, draftToDeclareNC, restorerNC } from '../services/nonConformiteService'

export function useNCDetails(id) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = useCallback(() => {
    if (!id) return
    setLoading(true)
    setError(null)
    return getNC(id)
      .then(res => {
        setData(res)
        setLoading(false)
        return res
      })
      .catch(err => {
        setError(err?.response?.data?.message || 'Erreur lors du chargement')
        setLoading(false)
        throw err
      })
  }, [id])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}

// Hook pour archiver une NC
export function useArchiveNC() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [popType, setPopType] = useState('success')
  const [popMessage, setPopMessage] = useState('')

  const archive = useCallback(async (id) => {
    setLoading(true)
    setError(null)
    setSuccess(false)
    setShowToast(false)
    try {
      await archiverNC(id)
      setSuccess(true)
      setPopType('success')
      setPopMessage('Non-conformité archivée avec succès !')
      setShowToast(true)
    } catch (err) {
      let msg = "Erreur lors de l'archivage"
      if (err?.response?.data?.message) {
        msg = err.response.data.message
      } else if (err instanceof TypeError) {
        msg = "Erreur réseau : impossible de contacter le serveur."
      }
      setError(msg)
      setPopType('danger')
      setPopMessage(msg)
      setShowToast(true)
    } finally {
      setLoading(false)
    }
  }, [])
  return { archive, loading, error, success, showToast, setShowToast, popType, popMessage }
}


// Hook pour restaurer une NC
export function useRestoreNC() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [popType, setPopType] = useState('success')
  const [popMessage, setPopMessage] = useState('')

  const restaure = useCallback(async (id) => {
    setLoading(true)
    setError(null)
    setSuccess(false)
    setShowToast(false)
    try {
      await restorerNC(id)
      setSuccess(true)
      setPopType('success')
      setPopMessage('Non-conformité restauré avec succès !')
      setShowToast(true)
    } catch (err) {
      let msg = "Erreur lors de la restauration"
      if (err?.response?.data?.message) {
        msg = err.response.data.message
      } else if (err instanceof TypeError) {
        msg = "Erreur réseau : impossible de contacter le serveur."
      }
      setError(msg)
      setPopType('danger')
      setPopMessage(msg)
      setShowToast(true)
    } finally {
      setLoading(false)
    }
  }, [])
  return { restaure, loading, error, success, showToast, setShowToast, popType, popMessage }
}


// Hook pour draft to declare une NC
export function useDraftToDeclareNC() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [popType, setPopType] = useState('success')
  const [popMessage, setPopMessage] = useState('')

  const declare = useCallback(async (id) => {
    setLoading(true)
    setError(null)
    setSuccess(false)
    setShowToast(false)
    try {
      const ncData = await getNC(id);
      //console.log('NC Data fetched for draftToDeclareNC:', ncData);
      const payload = {
        nc: {
          id: ncData.nc.id,
          emetteur: ncData.nc.emetteur,
          dateTimeCreation: ncData.nc.dateTimeCreation,
          dateTimeDeclare: ncData.nc.dateTimeDeclare || null,
          dateTimeFait: ncData.nc.dateTimeFait,
          descr: ncData.nc.descr || '',
          actionCurative: ncData.nc.actionCurative || '',
          idLieu: ncData.nc.idLieu,
          idTypeNc: ncData.nc.idTypeNc,
          idStatusNc: 1,
          idPrioriteNc: ncData.nc.idPrioriteNc,
          status: ncData.nc.status
        },
        piecesJointes: Array.isArray(ncData.piecesJointes) ? ncData.piecesJointes.map(pj => ({
          nomFichier: pj.nomFichier,
          cheminFichier: pj.cheminFichier,
          idNc: pj.idNc || 0
        })) : [],
        processusConcerne: Array.isArray(ncData.processusConcerne) ? ncData.processusConcerne.map(proc => ({
          idProcessus: proc.idProcessus,
          idNc: proc.idNc || 0
        })) : []
      };
      console.log('Payload for draftToDeclareNC:', payload);
      await draftToDeclareNC(id, payload);
      setSuccess(true);
      setPopType('success');
      setPopMessage('Non-conformité déclarée avec succès !');
      setShowToast(true);
    } catch (err) {
      // Normalize different error shapes to a readable message
      let msg = 'Erreur lors de la déclaration';
      try {
        if (err?.response?.data) {
          const d = err.response.data
          if (typeof d === 'string') msg = d
          else if (d.message) msg = d.message
          else msg = JSON.stringify(d)
        } else if (err?.message) {
          msg = err.message
        } else if (err instanceof TypeError) {
          msg = 'Erreur réseau : impossible de contacter le serveur.'
        } else {
          msg = String(err)
        }
      } catch (e) {
        // fallback to generic message
        msg = 'Erreur lors de la déclaration'
      }
      console.error('Error in draftToDeclareNC:', err)
      setError(msg)
      setPopType('danger')
      setPopMessage(msg)
      setShowToast(true)
    } finally {
      setLoading(false);
    }
  }, []);
  return { declare, loading, error, success, showToast, setShowToast, popType, popMessage }
}