import React, { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useParams, useNavigate } from 'react-router-dom'
import {
  CRow, CCol, CButton, CCard, CCardHeader, CCardBody,
  CFormLabel, CFormInput, CFormTextarea, CForm, CFormFeedback,
  CFormSelect,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilArrowLeft } from '@coreui/icons'
import ProcessusMultiSelect from '../../../components/champs/ProcessusMultiSelect'
import * as paService from '../services/paService'

/*
  FormPA
  - Fields: Source description, Date constat, Constat (text), Status (checkbox), Processus concernés (multi)
  - Assumptions about backend endpoints (adapt if your API differs):
    POST /Source_PA -> creates source, returns { id }
    PUT /Source_PA/{id} -> updates source
    POST /Plan_action -> creates plan_action (body contains id_source_pa, date_constat, constat, status)
    PUT /Plan_action/{id} -> updates plan_action
    POST /Processus_concerne_PA -> creates mapping { id_pa, id_processus }
    GET /Plan_action/{id} -> returns plan with linked source and processus
*/

const FormPA = () => {
  const { id: routeId } = useParams()
  const id = routeId ? Number(routeId) : null
  const navigate = useNavigate()
  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      sourceId: '',
      dateConstat: '',
      constat: '',
      status: true,
      processus: [],
    }
  })

  const [loading, setLoading] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [popMessage, setPopMessage] = useState('')

  const [sources, setSources] = useState([])

  useEffect(() => {
    let mounted = true
    if (!id) return
    setLoading(true)
    ;(async () => {
      try {
        const json = await paService.getPA(id)
        if (!mounted) return
  const sourceId = json.sourcePA.id
  const dateConstat = json.dateConstat ? new Date(json.dateConstat).toISOString().slice(0,10) : ''
        const processus = Array.isArray(json.processusConcernes) ? json.processusConcernes.map(p => ({ value: p.processus.id, label: p.processus.nom || String(p.processus.id) })) : []
  reset({ sourceId, dateConstat, constat: json.constat || '', status: !!json.status, processus })
      } catch (err) {
        console.error('Erreur chargement PA', err)
      } finally {
        setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [id, reset])

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const s = await paService.getSources()
        if (!mounted) return
        setSources(Array.isArray(s) ? s : [])
      } catch (err) {
        console.error('Failed to load sources', err)
      }
    })()
    return () => { mounted = false }
  }, [])

  // Note: source is selected from provided options (sources). We don't create sources here.

  const onSubmit = async (values) => {
    try {
      setLoading(true)
      // 1) source is selected via select (ensure integer)
      const sourceId = values.sourceId ? Number(values.sourceId) : null
      // 2) save plan_action
      const payload = {
        idSourcePa: sourceId,
        dateConstat: values.dateConstat || null,
        constat: values.constat || '',
        idStatusPA: 1,
        // send status as integer (1 = active, 0 = inactive)
        status: true
      }
      let paId = id
      if (id) {
        await paService.updatePlanAction(id, payload)
      } else {
        const json = await paService.createPlanAction(payload)
        paId = json?.id
      }

      // 3) save processus_concerne_PA mappings
      if (paId) {
        // try to remove existing mappings
        await paService.deleteProcessusConcerneByPa(paId)
        const processus = values.processus || []
        for (const p of processus) {
          const procId = p.value || p
          await paService.createProcessusConcerne({ idPA: paId, idProcessus: Number(procId) })
        }
      }

      setPopMessage('Plan d\'action enregistré')
      setShowToast(true)
      // navigate to fiche
      if (paId) navigate(`/pa/fiche/${paId}`)
    } catch (err) {
      console.error('Erreur sauvegarde PA', err)
      alert(err.message || 'Erreur lors de la sauvegarde')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <CRow>
        <CCol xs={3} className="d-flex justify-content-start">
          <CButton color='secondary' className="mb-3" onClick={() => navigate('/pa')}>
            <CIcon icon={cilArrowLeft} className="me-2" />Retour
          </CButton>
        </CCol>
        <CCol xs={6} className="d-flex justify-content-center">
          <h3>{id ? 'Modifier Plan d\'action' : 'Créer Plan d\'action'}</h3>
        </CCol>
      </CRow>
      <CCard className='mb-3'>
        <CCardHeader className="text-center"><span className="h6">Identité du Plan d'action</span></CCardHeader>
        <CCardBody>
          <CForm onSubmit={handleSubmit(onSubmit)}>
            <CRow>
              <CCol md={12} className='mb-3'>
                <CFormLabel>Source</CFormLabel>
                <CFormSelect {...register('sourceId')} aria-label="Source select">
                  <option value="">-- Sélectionner une source --</option>
                  {sources.map((s) => (
                    <option key={s.id} value={s.id}>{s.descr}</option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol md={4} className='mb-3'>
                <CFormLabel>Date constat</CFormLabel>
                <CFormInput type="date" {...register('dateConstat')} />
              </CCol>
              <CCol md={12} className='mb-3'>
                <CFormLabel>Constat</CFormLabel>
                <CFormTextarea {...register('constat')} rows={4} />
              </CCol>
              <CCol md={12} className='mb-3'>
                <CFormLabel>Processus concerné(s)</CFormLabel>
                <Controller
                  control={control}
                  name="processus"
                  render={({ field: { onChange, value } }) => (
                    <ProcessusMultiSelect value={value} onChange={onChange} />
                  )}
                />
              </CCol>
            </CRow>
            <CRow>
              <CCol xs={12} className="d-flex justify-content-end">
                <CButton color="primary" type="submit" disabled={isSubmitting || loading}>{isSubmitting || loading ? 'Enregistrement...' : 'Enregistrer'}</CButton>
              </CCol>
            </CRow>
          </CForm>
        </CCardBody>
      </CCard>
    </>
  )
}

export default FormPA
