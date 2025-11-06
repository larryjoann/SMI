import React, { useEffect } from 'react'
import {
  CRow, CCol,
  CCard, CCardBody, CCardHeader, 
  CForm, CFormInput, CFormLabel, CFormTextarea,
  CButton , CFormFeedback
} from '@coreui/react'
import { Pop_up } from '../../../components/notification/Pop_up'
import { useFormNC } from '../hooks/useFormNC'
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
    loadNCForEdit
  } = useFormNC(id)

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
              <CButton color="primary" type="button" onClick={handleUpdate}>
                Enregistrer
              </CButton>
            ) : (
              <>
                <CButton color="secondary" type="button" className='me-2' onClick={handleDraft}>
                  Brouillon
                </CButton>
                <CButton color="primary" onClick={handleSubmit}>
                  Déclarer
                </CButton>
              </>
            )}
          </CCol>
        </CRow>
      </CForm>
    </>
  )
}

export default FormNC
