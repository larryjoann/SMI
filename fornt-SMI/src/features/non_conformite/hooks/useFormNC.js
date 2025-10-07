import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { declareNC, draftNC } from '../services/nonConformiteService'

export const useFormNC = () => {
  const [description, setDescription] = useState('')
  const [files, setFiles] = useState([])
  const [typeNC, setTypeNC] = useState('')
  const [site, setSite] = useState('')
  const [processus, setProcessus] = useState([])
  const [date, setDate] = useState('')
  const [heure, setHeure] = useState('')
  const [actionCurative, setActionCurative] = useState('')
  const [errors, setErrors] = useState({})
  const [showToast, setShowToast] = useState(false)
  const [popType, setPopType] = useState('success')
  const [popMessage, setPopMessage] = useState('')
  const formRef = useRef()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setShowToast(false)
    setErrors({})
    const dateTimeFait = date && heure ? `${date}T${heure}` : null
    const nc = {
      dateTimeFait,
      descr: description,
      actionCurative,
      idLieu: site || null,
      idTypeNc: typeNC || null,
      idStatusNc: 1,
      idPrioriteNc: 1
    }
    const piecesJointes = files.map(f => ({
      nomFichier: f.name,
      cheminFichier: f.url || f.path || '',
      idNc: 0
    }))
    const processusConcerne = processus.map(p => ({
      idProcessus: p.value || p.id || p,
      idNc: 0
    }))
    const payload = { nc, piecesJointes, processusConcerne }
    try {
      await declareNC(payload)
      if (formRef.current) formRef.current.reset()
      setDescription('')
      setFiles([])
      setTypeNC('')
      setSite('')
      setProcessus([])
      setDate('')
      setHeure('')
      setActionCurative('')
      setErrors({})
      setPopType('success')
      setPopMessage('Déclaration enregistrée avec succès !')
      setShowToast(true)
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors(error.response.data)
        setPopType('danger')
        setPopMessage('Erreur lors de la déclaration.')
        setShowToast(true)
      } else {
        setErrors({ global: 'Erreur lors de la déclaration.' })
        setPopType('danger')
        setPopMessage('Erreur lors de la déclaration.')
        setShowToast(true)
      }
    }
  }

  // Soumission brouillon
  const handleDraft = async (e) => {
    e.preventDefault()
    setShowToast(false)
    setErrors({})
    const dateTimeFait = date && heure ? `${date}T${heure}` : null
    const nc = {
      dateTimeFait,
      descr: description,
      actionCurative,
      idLieu: site || null,
      idTypeNc: typeNC || null,
      idStatusNc: 1,
      idPrioriteNc: 1
    }
    const piecesJointes = files.map(f => ({
      nomFichier: f.name,
      cheminFichier: f.url || f.path || '',
      idNc: 0
    }))
    const processusConcerne = processus.map(p => ({
      idProcessus: p.value || p.id || p,
      idNc: 0
    }))
    const payload = { nc, piecesJointes, processusConcerne }
    try {
      await draftNC(payload)
      if (formRef.current) formRef.current.reset()
      setDescription('')
      setFiles([])
      setTypeNC('')
      setSite('')
      setProcessus([])
      setDate('')
      setHeure('')
      setActionCurative('')
      setErrors({})
      setPopType('success')
      setPopMessage('Brouillon enregistré avec succès !')
      setShowToast(true)
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors(error.response.data)
        setPopType('danger')
        setPopMessage('Erreur lors de l\'enregistrement du brouillon.')
        setShowToast(true)
      } else {
        setErrors({ global: 'Erreur lors de l\'enregistrement du brouillon.' })
        setPopType('danger')
        setPopMessage('Erreur lors de l\'enregistrement du brouillon.')
        setShowToast(true)
      }
    }
  }

  return {
    description, setDescription,
    files, setFiles,
    typeNC, setTypeNC,
    site, setSite,
    processus, setProcessus,
    date, setDate,
    heure, setHeure,
    actionCurative, setActionCurative,
    errors, setErrors,
    formRef,
    handleSubmit,
    handleDraft,
    showToast, setShowToast,
    popType, setPopType,
    popMessage, setPopMessage,
    navigate
  }
}
