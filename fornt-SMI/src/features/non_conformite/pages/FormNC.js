import React, { useEffect } from 'react'
import {
  CRow, CCol,
  CCard, CCardBody, CCardHeader, 
  CForm, CFormInput, CFormLabel, CFormTextarea,
  CButton , CFormFeedback,
  CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter
} from '@coreui/react'
import { Pop_up } from '../../../components/notification/Pop_up'
import { useFormNC } from '../hooks/useFormNC'
import { useDraftToDeclareNC } from '../hooks/useNCDetails'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import ProcessusMultiSelect from '../../../components/champs/ProcessusMultiSelect'
import TypeNCSelect from '../../../components/champs/TypeNCSelect'
import SiteSelect from '../../../components/champs/SiteSelect'
import WysiwygEditor from '../../../components/champs/WysiwygEditor'
import FileUploader from '../../../components/champs/FileUploader'
import CIcon from '@coreui/icons-react'
import { cilArrowLeft } from '@coreui/icons'


const FormNC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    dateTimeCreation,
    dateTimeDeclare,
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
    handleUpdate,
    showToast, setShowToast,
    popType, setPopType,
    popMessage, setPopMessage,
    idStatusNc,
    loadNCForEdit
  } = useFormNC(id)
  const { declare, loading: declaring, popType: declarePopType, popMessage: declarePopMessage } = useDraftToDeclareNC()

  const handleDeclareClick = async (e) => {
    e.preventDefault()
    if (!id) return
    try {
      await declare(id)
      // show the message from the declare hook in this page's popup
      setPopType(declarePopType || 'success')
      setPopMessage(declarePopMessage || 'Non-conformité déclarée avec succès !')
      setShowToast(true)
      // refresh current NC data
      if (typeof loadNCForEdit === 'function') {
        await loadNCForEdit(id)
      }
      // redirect to list (declaration panel)
      navigate('/nc/list', { state: { defaultPanel: 'declaration' } })
    } catch (err) {
      setPopType('danger')
      setPopMessage(err?.message || 'Erreur lors de la déclaration')
      setShowToast(true)
    }
  }

  // Confirmation modal state
  const [confirmVisible, setConfirmVisible] = React.useState(false)
  const [confirmAction, setConfirmAction] = React.useState('')
  const [actionLoading, setActionLoading] = React.useState(false)

  const openConfirm = (action) => {
    setConfirmAction(action)
    setConfirmVisible(true)
  }

  const closeConfirm = () => {
    setConfirmVisible(false)
    setConfirmAction('')
  }

  const onConfirmAction = async () => {
    setActionLoading(true)
    try {
      // Use small fake event with preventDefault to satisfy handlers
      const fakeEvent = { preventDefault: () => {} }
      if (confirmAction === 'draft') {
        await handleDraft(fakeEvent)
      } else if (confirmAction === 'declare_create') {
        await handleSubmit(fakeEvent)
      } else if (confirmAction === 'update') {
        await handleUpdate(fakeEvent)
      } else if (confirmAction === 'declare_edit') {
        // 1. Enregistrer les modifications du formulaire
        await handleUpdate(fakeEvent)
        // 2. Déclarer la NC
        await handleDeclareClick(fakeEvent)
      }
      closeConfirm()
    } catch (err) {
      // handlers already set toasts; just ensure modal closes
      console.error('Action confirm error', err)
      closeConfirm()
    } finally {
      setActionLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      loadNCForEdit(id)
    }
  }, [id])

  // Determine which panel to show on return
  const getDefaultPanel = () => {
    // If editing, use dateTimeDeclare to decide
    if (id) {
      if (dateTimeDeclare) return 'declaration';
      return 'brouillon';
    }
    // If creating, fallback to declaration
    return 'declaration';
  }

  return (
    <>
      <CRow className='mb-2'>
        {id && (
          <CCol xs={3} className="d-flex justify-content-start">
            <CButton
              color='secondary'
              className="mb-3"
              onClick={() => navigate('/nc/list', { state: { defaultPanel: getDefaultPanel() } })}
            >
              <CIcon icon={cilArrowLeft} className="me-2" />
              Retour
            </CButton>
          </CCol>
        )}
        <CCol xs={id ? 6 : 12}> 
          <h3 className="text-center">
            {id ? 'Modification de non-conformité' : 'Déclaration de non-conformité'}
          </h3>
        </CCol>
        {id && <CCol xs={3}></CCol>}
      </CRow>

      <Pop_up
        show={showToast}
        type={popType}
        message={popMessage}
        onClose={() => setShowToast(false)}
      />
      <CForm ref={formRef} onSubmit={handleSubmit}>
        {errors.global && (
          <div className="alert alert-danger">{errors.global}</div>
        )}
        <CCard className='mb-4'>
          <CCardHeader className="text-center">
            <span className="h6">IDENTIFICATION DE LA NON-CONFORMITE</span>
          </CCardHeader>
          <CCardBody>
            <CRow>
              {/* {dateTimeDeclare && (
                <CCol xs={12} className='mb-3'>
                  <CFormLabel>Date de déclaration :</CFormLabel>
                  <CFormInput type="text" value={dateTimeDeclare} disabled readOnly />
                </CCol>
              )} */}
              <CCol xs={12} sm={6} md={6} className='mb-3'>
                <CFormLabel htmlFor="type">Type <span className="text-danger">*</span> :</CFormLabel>
                <TypeNCSelect
                  value={typeNC}
                  onChange={e => setTypeNC(e.target.value)}
                  invalid={!!errors['NC.IdTypeNc']}
                />
                {errors['NC.IdTypeNc'] && (
                  <CFormFeedback invalid>{errors['NC.IdTypeNc'][0]}</CFormFeedback>
                )}
              </CCol>
              <CCol xs={12} sm={6} md={6} className='mb-3'>
                <CFormLabel htmlFor="site">Site <span className="text-danger">*</span> :</CFormLabel>
                <SiteSelect
                  value={site}
                  onChange={e => setSite(e.target.value)}
                  invalid={!!errors['NC.IdLieu']}
                />
                {errors['NC.IdLieu'] && (
                  <CFormFeedback invalid>{errors['NC.IdLieu'][0]}</CFormFeedback>
                )}
              </CCol>
            </CRow>
            <CRow>
              <CCol xs={12} sm={12} md={12} className='mb-3'>
                <CFormLabel htmlFor="type">Processus concerné(s) <span className="text-danger">*</span> :</CFormLabel>
                <ProcessusMultiSelect
                  value={processus}
                  onChange={setProcessus}
                  invalid={!!errors['ProcessusConcerne']}
                />
                {errors['ProcessusConcerne'] && (
                  <CFormFeedback invalid>{errors['ProcessusConcerne'][0]}</CFormFeedback>
                )}
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>

        <CCard className='mb-4'>
          <CCardHeader className="text-center">
            <span className="h6">DESCRIPTION</span>
          </CCardHeader>
          <CCardBody>
            {/* ...existing code... */}
            <CRow>
              <CCol xs={12} sm={6} md={4} className='mb-3'>
                <CFormLabel htmlFor="dateTime">Date et heure du fait <span className="text-danger">*</span> :</CFormLabel>
                {/* Combine existing `date` (YYYY-MM-DD) and `heure` (HH:MM) into a single datetime-local input
                    and keep backing state in `date` and `heure` via setDate/setHeure for compatibility */}
                <CFormInput
                  type="datetime-local"
                  id="dateTime"
                  value={date ? `${date}T${heure || '00:00'}` : ''}
                  onChange={(e) => {
                    const v = e.target.value || ''
                    if (!v) {
                      setDate('')
                      setHeure('')
                      return
                    }
                    const parts = v.split('T')
                    setDate(parts[0] || '')
                    // keep only HH:MM (strip seconds if present)
                    const timePart = parts[1] || ''
                    setHeure(timePart ? timePart.slice(0,5) : '')
                  }}
                  invalid={!!errors['NC.DateTimeFait']}
                />
                {errors['NC.DateTimeFait'] && (
                  <CFormFeedback invalid>{errors['NC.DateTimeFait'][0]}</CFormFeedback>
                )}
              </CCol>
              <CCol xs={12} sm={12} md={12} className='mb-3'>
                <CFormLabel htmlFor="description">Description du fait <span className="text-danger">*</span> :</CFormLabel>
                <WysiwygEditor
                  value={description}
                  onChange={setDescription}
                  invalid={!!errors['NC.Descr']}
                  error={errors['NC.Descr'] ? errors['NC.Descr'][0] : ''}
                />
              </CCol>
              <CCol xs={12} sm={12} md={12} className='mb-3'>
                <CFormLabel htmlFor="curative">Pièces jointes :</CFormLabel>
                <FileUploader files={files} setFiles={setFiles} />
              </CCol>
              <CCol xs={12} sm={12} md={12} className='mb-3'>
                <CFormLabel htmlFor="curative">Action curative :</CFormLabel>
                <CFormTextarea id="curative" rows={3} value={actionCurative} onChange={e => setActionCurative(e.target.value)} invalid={!!errors['NC.ActionCurative']}/>
                {errors['NC.ActionCurative'] && (
                  <CFormFeedback invalid>{errors['NC.ActionCurative'][0]}</CFormFeedback>
                )}
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>

        <CRow className='mb-4'>
          <CCol xs={12} className="d-flex justify-content-end">
            {id ? (
              <>
                <CButton color="primary" type="button" onClick={() => openConfirm('update')} className="me-2">
                  Enregistrer
                </CButton>
                {(dateTimeDeclare === null ) && (
                  <CButton color="primary" type="button" onClick={() => openConfirm('declare_edit')}>
                    Déclarer
                  </CButton>
                )}
              </>
            ) : (
              <>
                <CButton color="secondary" type="button" className='me-2' onClick={() => openConfirm('draft')}>
                  Brouillon
                </CButton>
                <CButton color="primary" onClick={() => openConfirm('declare_create')}>
                  Déclarer
                </CButton>
              </>
            )}
          </CCol>
        </CRow>
      
      {/* Confirmation modal used for Draft / Declare / Update */}
      <CModal alignment="center" visible={confirmVisible} onClose={closeConfirm}>
        <CModalHeader>
          <CModalTitle>Confirmer l'action</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {confirmAction === 'draft' && <div>Voulez-vous enregistrer ce brouillon ?</div>}
          {confirmAction === 'declare_create' && <div>Voulez-vous déclarer cette non-conformité ?</div>}
          {confirmAction === 'declare_edit' && <div>Voulez-vous déclarer cette non-conformité (édition) ?</div>}
          {confirmAction === 'update' && <div>Voulez-vous enregistrer les modifications ?</div>}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={closeConfirm} disabled={actionLoading}>Non</CButton>
          <CButton color="primary" onClick={onConfirmAction} disabled={actionLoading}>{actionLoading ? 'Traitement...' : 'Oui'}</CButton>
        </CModalFooter>
      </CModal>
      </CForm>
    </>
  )
}

export default FormNC
