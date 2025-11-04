import { useEffect, useState } from 'react'
import { updateProcessus, createProcessus, getProcessusById } from '../services/processusService'

export function useProcessusForm(id, reset, setError, navigate) {
  const [showToast, setShowToast] = useState(false)
  const [popType, setPopType] = useState('success')
  const [popMessage, setPopMessage] = useState('')

  useEffect(() => {
    if (id) {
      getProcessusById(id)
        .then(data => {
          const piloteOptions = Array.isArray(data.pilotes)
            ? data.pilotes.map(pi => ({
                value: pi.collaborateur?.matricule,
                label: `${pi.collaborateur?.nomComplet} (${pi.collaborateur?.departement})`
              }))
            : []
          const copiloteOptions = Array.isArray(data.copilotes)
            ? data.copilotes.map(co => ({
                value: co.collaborateur?.matricule,
                label: `${co.collaborateur?.nomComplet} (${co.collaborateur?.departement})`
              }))
            : []
          reset({
            nom: data.nom || '',
            sigle: data.sigle || '',
            idCategorieProcessus: data.idCategorieProcessus || '',
            matriculePilote: piloteOptions,
            matriculeCopilote: copiloteOptions,
            finalite: data.finalite || '',
            contexte: data.contexte || '',
            status : data.status,
          })
        })
        .catch(err => {
          setPopType('danger')
          setPopMessage(err.message)
          setShowToast(true)
        })
    }
  }, [id, reset])

  const onSubmit = async (data) => {
    setShowToast(false)
    const payload = {
      ...data,
      pilotes: Array.isArray(data.matriculePilote)
        ? data.matriculePilote.map(opt => ({ matriculeCollaborateur: opt.value }))
        : [],
      copilotes: Array.isArray(data.matriculeCopilote)
        ? data.matriculeCopilote.map(opt => ({ matriculeCollaborateur: opt.value }))
        : [],
      matriculePilote: undefined,
      matriculeCopilote: undefined,
      id: id ? id : undefined,
    }
    try {
      if (id) {
        await updateProcessus(id, payload)
        setPopType('success')
        setPopMessage('Valeur modifiée avec succès')
        // After updating, go to the fiche (detail) page for this processus
        navigate(`/pilotage/cartographie/ficheprocessus/${id}`)
        setShowToast(true)
      } else {
        // Create and navigate to the created processus fiche when possible
        const created = await createProcessus(payload)
        setPopType('success')
        setPopMessage('Valeur insérée avec succès')
        setShowToast(true)
        // Try to extract the new id from common response shapes
        const newId = created?.id || created?.idProcessus || created?.processus?.id
        if (newId) {
          navigate(`/pilotage/cartographie/ficheprocessus/${newId}`)
        } else {
          // Fallback: go back to cartographie if we can't determine the id
          navigate('/pilotage/cartographie/cartographie')
        }
        reset()
      }
    } catch (error) {
      if (error && error.errors) {
        Object.entries(error.errors).forEach(([field, messages]) => {
          setError(field.charAt(0).toLowerCase() + field.slice(1), {
            type: 'server',
            message: messages.join(' ')
          })
        })
      }
      setPopType('danger')
      setPopMessage('Erreur lors de l\'insertion ou modification')
      setShowToast(true)
    }
  }

  return {
    showToast,
    setShowToast,
    popType,
    popMessage,
    onSubmit,
  }
}