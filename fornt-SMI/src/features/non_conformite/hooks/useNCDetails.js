
import { useEffect, useState, useCallback } from 'react'
import { getNC, archiverNC, draftToDeclareNC } from '../services/nonConformiteService'

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
          dateTimeCreation: ncData.nc.dateTimeCreation,
          dateTimeDeclare: ncData.nc.dateTimeDeclare || null,
          dateTimeFait: ncData.nc.dateTimeFait,
          descr: ncData.nc.descr || '',
          actionCurative: ncData.nc.actionCurative || '',
          idLieu: ncData.nc.idLieu,
          idTypeNc: ncData.nc.idTypeNc,
          idStatusNc: ncData.nc.idStatusNc,
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
      //console.log('Payload for draftToDeclareNC:', payload);
      await draftToDeclareNC(id, payload);
      setSuccess(true);
      setPopType('success');
      setPopMessage('Non-conformité déclarée avec succès !');
      setShowToast(true);
    } catch (err) {
      let msg = "Erreur lors de la déclaration";
      if (err?.response?.data?.message) {
        msg = err.response.data.message;
      } else if (err instanceof TypeError) {
        msg = "Erreur réseau : impossible de contacter le serveur.";
      }
      //console.log('Error in draftToDeclareNC:', err);
      setError(msg);
      setPopType('danger');
      setPopMessage(msg);
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  }, []);
  return { declare, loading, error, success, showToast, setShowToast, popType, popMessage }
}