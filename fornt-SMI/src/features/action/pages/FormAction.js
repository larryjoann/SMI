import React, { useEffect, useState } from 'react'
import {
  CCard, CCardHeader, CCardBody, CRow, CCol, CButton, CFormInput, CFormTextarea,
  CFormLabel, CForm, CFormFeedback
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilArrowLeft, cilHistory } from '@coreui/icons'
import { useNavigate, useParams } from 'react-router-dom'
import useActionDetails from '../hooks/useActionDetails'
import CollaborateurMultiSelect from '../../../components/champs/CollaborateurMultiSelect'
import API_URL from '../../../api/API_URL'
import { fetchStatuses } from '../services/actionService'
import { useForm, Controller } from 'react-hook-form'

const FormAction = () => {
  const navigate = useNavigate()
  const { id: routeId } = useParams()
  const id = routeId ? Number(routeId) : null
  const { data, loading, error, refetch } = useActionDetails(id)
  const action = data || null

  const { register, handleSubmit, control, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { titre: '', descr: '', dateDebut: '', dateFinPrevue: '', responsables: [], idStatusAction: '' }
  })

  const [statuses, setStatuses] = useState([])
  const [submitError, setSubmitError] = useState(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const s = await fetchStatuses()
        if (mounted) setStatuses(s || [])
      } catch (err) {
        console.error('Failed to load statuses', err)
      }
    })()
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    if (!action) return
    const toDateInput = (v) => {
      if (!v) return ''
      try {
        const d = new Date(v)
        if (Number.isNaN(d.getTime())) return String(v)
        return d.toISOString().slice(0, 10)
      } catch (e) { return String(v) }
    }

    const raw = Array.isArray(action.responsables) ? action.responsables : []
    // Build option-like objects { value, label } so CollaborateurMultiSelect receives the expected shape
    const respVals = raw
      .map((r) => {
        if (r == null) return null
        // extract matricule/code
        const val = (typeof r === 'string' || typeof r === 'number')
          ? String(r)
          : (r.responsable?.MatriculeResponsable ?? r.responsable?.matricule ?? r.responsable?.id ?? r.matricule ?? r.id)
        if (!val) return null
        // find a human-friendly label if available
        const label = (r.responsable?.nomAffichage) || r.nomComplet || r.nom || String(val)
        return { value: String(val), label }
      })
      .filter(Boolean)

    reset({
      titre: action.titre || '',
      descr: action.descr || '',
      dateDebut: toDateInput(action.dateDebut),
      dateFinPrevue: toDateInput(action.dateFinPrevue),
      responsables: respVals,
      idStatusAction: action.idStatusAction || action.statusAction?.id || '',
    })
  }, [action, reset])

  const onSubmit = async (formValues) => {
    setSubmitError(null)
    try {
      // Normalize idStatusAction: convert to number if provided, otherwise omit the property
      let idStatusActionVal = undefined
      if (formValues.idStatusAction !== undefined && formValues.idStatusAction !== null && formValues.idStatusAction !== '') {
        const parsed = Number(formValues.idStatusAction)
        if (!Number.isNaN(parsed)) idStatusActionVal = parsed
      }

      const payload = {
        id: id,
        titre: formValues.titre,
        descr: formValues.descr,
        dateDebut: formValues.dateDebut || null,
        dateFinPrevue: formValues.dateFinPrevue || null,
        // accept either option-like objects ({value,label}) or primitive matricules
        responsables: (formValues.responsables || []).map(r => {
          if (r == null) return null
          if (typeof r === 'object' && 'value' in r) return { MatriculeResponsable: r.value }
          return { MatriculeResponsable: r }
        }).filter(Boolean),
        // include idStatusAction only when it's a valid number (JSON.stringify will drop undefined)
        idStatusAction: idStatusActionVal,
      }

      // Log the payload for debugging before sending
      console.log('Submitting payload:', payload)

  const sanitizedAction = JSON.parse(JSON.stringify(payload, (k, v) => (v === null ? undefined : v)))
  const form = new FormData()
  form.append('ActionDetails', JSON.stringify(sanitizedAction))
  const apiBase = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL
  // If we have an id -> call PUT /ActionDetails/{id} (update on ActionDetails controller). Otherwise fallback to POST /ActionDetails
  const url = `${apiBase}/ActionDetails/${id}`
  const method = id ? 'PUT' : 'POST'
  const res = await fetch(url, { method, credentials: 'include', body: form })
      const text = await res.text().catch(() => '')
      if (!res.ok) {
        throw new Error(`Echec enregistrement (${res.status}) : ${text}`)
      }
  await refetch?.()
  // After successful update/create navigate back to the action fiche (if id available)
  if (id) navigate(`/action/fiche/${id}`)
    } catch (err) {
      console.error('Failed to update action', err)
      setSubmitError(err.message || 'Erreur lors de la sauvegarde')
    }
  }

  if (loading) return <div>Chargement...</div>
  if (error) return <div className="text-danger">Erreur: {error.message || String(error)}</div>

  return (
    <>
    <CRow className='mb-2'>   
            <CCol xs={3} className="d-flex justify-content-start">
                <CButton
                color='secondary'
                className="mb-3"
                                onClick={() => navigate('/action')}
                >
                <CIcon icon={cilArrowLeft} className="me-2" />
                Retour
                </CButton>
            </CCol>
            <CCol xs={6}> 
            <h3 className="text-center">Modification de l'action</h3>
            </CCol> 
            <CCol xs={3} className="d-flex justify-content-end">
            </CCol>    
        </CRow>
    <CCard className="mb-3">
      <CCardHeader className='h6 text-center'>
        <span>IDENTITÉ DE L'ACTION</span>
        </CCardHeader>
      <CCardBody>
        {submitError && <div className="text-danger mb-2">{submitError}</div>}
        <CForm onSubmit={handleSubmit(onSubmit)}>
          <CRow>
            <CCol md={8} className="mb-3">
              <CFormLabel>Titre</CFormLabel>
              <CFormInput {...register('titre', { required: 'Le titre est requis' })} invalid={!!errors.titre} />
              {errors.titre && <CFormFeedback invalid>{errors.titre.message}</CFormFeedback>}
            </CCol>
            <CCol md={12} className="mb-3">
              <CFormLabel>Description</CFormLabel>
              <CFormTextarea rows={6} {...register('descr')} />
            </CCol>
            <CCol md={4} className="mb-3">
              <CFormLabel>Date début</CFormLabel>
              <CFormInput type="date" {...register('dateDebut')} />
            </CCol>
            <CCol md={4} className="mb-3">
              <CFormLabel>Date fin prévue</CFormLabel>
              <CFormInput type="date" {...register('dateFinPrevue')} />
            </CCol>
            <CCol md={4} className="mb-3">
              <CFormLabel>Statut</CFormLabel>
              <select className="form-select" {...register('idStatusAction')}>
                <option value="">-- Sélectionner --</option>
                {statuses.map(s => (<option key={s.id} value={s.id}>{s.nom}</option>))}
              </select>
            </CCol>

            <CCol md={12} className="mb-3">
              <CFormLabel>Responsables</CFormLabel>
              <Controller
                control={control}
                name="responsables"
                render={({ field: { onChange, value, ref } }) => (
                  <CollaborateurMultiSelect value={value} onChange={onChange} inputRef={ref} />
                )}
              />
            </CCol>

            <CCol md={12} className="d-flex justify-content-end">
              <CButton color="secondary" className="me-2" onClick={() => navigate('/action')}>Annuler</CButton>
              <CButton color="primary" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Enregistrement...' : 'Enregistrer'}</CButton>
            </CCol>
          </CRow>
        </CForm>
      </CCardBody>
    </CCard>
  </>
  )
}

export default FormAction

