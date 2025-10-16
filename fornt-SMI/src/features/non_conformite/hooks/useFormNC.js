
import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { declareNC, draftNC, getNC, updateDraftNC, updateDeclareNC } from '../services/nonConformiteService'

export const useFormNC = (editId = null) => {

  const [description, setDescription] = useState('')
  const [dateTimeDeclare, setDateTimeDeclare] = useState('')
  const [dateTimeCreation, setDateTimeCreation] = useState('')
  const [files, setFiles] = useState([])
  const [typeNC, setTypeNC] = useState('')
  const [site, setSite] = useState('')
  const [processus, setProcessus] = useState([])
  const [date, setDate] = useState('')
  const [heure, setHeure] = useState('')
  const [actionCurative, setActionCurative] = useState('')
  const [status, setStatus] = useState(1)
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
        dateTimeDeclare: null,
        idStatusNc: 1,
        idPrioriteNc: 1,
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
      setDateTimeDeclare('')
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
        dateTimeDeclare: null,
        idStatusNc: 1,
        idPrioriteNc: 1,
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
      setDateTimeDeclare('')
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

  const handleUpdate = async (e) => {
    e.preventDefault()
    setShowToast(false)
    setErrors({})
    const dateTimeFait = date && heure ? `${date}T${heure}` : null
      const nc = {
        id: editId,
        dateTimeCreation,
        dateTimeFait,
        descr: description,
        actionCurative,
        idLieu: site || null,
        idTypeNc: typeNC || null,
        dateTimeDeclare,
        idStatusNc: 1,
        idPrioriteNc: 1,
        status: status
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
      // if datetimedeclare null updateDraftNC
      // else updateDeclareNC
      if (!dateTimeDeclare) {
        await updateDraftNC(editId, payload)
      } else {
        await updateDeclareNC(editId, payload)
      }
      if (formRef.current) formRef.current.reset()
      setDateTimeDeclare('')
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
      setPopMessage('Modification enregistrée avec succès !')
      setShowToast(true)
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors(error.response.data)
        setPopType('danger')
        setPopMessage('Erreur lors de la modification.')
        setShowToast(true)
      } else {
        setErrors({ global: 'Erreur lors de la modification.' })
        setPopType('danger')
        setPopMessage('Erreur lors de la modification.')
        setShowToast(true)
      }
    }
  }

  const loadNCForEdit = async (id) => {
    try {
      const data = await getNC(id)
      console.log(data)
      // Adapt to your API response structure
      setDateTimeCreation(data.nc.dateTimeCreation)
      setDateTimeDeclare(data.nc.dateTimeDeclare)
      setDescription(data.nc.descr || '')
      setTypeNC(data.nc.idTypeNc || '')
      setSite(data.nc.idLieu || '')
      setProcessus(
        data.processusConcerne
          ? data.processusConcerne.map(p => ({ value: p.idProcessus, label: p.processus.sigle }))
          : []
      )
      if (data.nc.dateTimeFait) {
        const [d, t] = data.nc.dateTimeFait.split('T')
        setDate(d)
        setHeure(t ? t.substring(0,5) : '')
      } else {
        setDate('')
        setHeure('')
      }
      setActionCurative(data.nc.actionCurative || '')
      setFiles(
        data.piecesJointes
          ? data.piecesJointes.map(f => ({ name: f.nomFichier, url: f.cheminFichier }))
          : []
      )
        setStatus(data.nc.status || 1)
        setErrors({})
    } catch (e) {
      setErrors({ global: "Erreur lors du chargement de la non-conformité." })
    }
  }


  return {
    dateTimeCreation, setDateTimeCreation,
    dateTimeDeclare, setDateTimeDeclare,
    description, setDescription,
    files, setFiles,
    typeNC, setTypeNC,
    site, setSite,
    processus, setProcessus,
    date, setDate,
    heure, setHeure,
    actionCurative, setActionCurative,
    status, setStatus,
    errors, setErrors,
    formRef,
    handleSubmit,
    handleDraft,
    handleUpdate,
    showToast, setShowToast,
    popType, setPopType,
    popMessage, setPopMessage,
    navigate,
    loadNCForEdit
  }
}
