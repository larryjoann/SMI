import React from 'react'
import {
  CRow, CCol,
  CCard, CCardBody, CCardHeader, 
  CForm, CFormInput, CFormLabel, CFormTextarea,
  CButton , CFormFeedback
} from '@coreui/react'
import { Pop_up } from '../../../components/notification/Pop_up'
import { useFormNC } from '../hooks/useFormNC'
import ProcessusMultiSelect from '../../../components/champs/ProcessusMultiSelect'
import TypeNCSelect from '../../../components/champs/TypeNCSelect'
import SiteSelect from '../../../components/champs/SiteSelect'
import WysiwygEditor from '../../../components/champs/WysiwygEditor'
import FileUploader from '../../../components/champs/FileUploader'

const FormNC = () => {
  const {
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
    popMessage, setPopMessage
  } = useFormNC()


  // ...existing code...

  return (
    <>
      <CRow className='mb-2'>   
        <CCol xs={12}> 
          <h3 className="text-center">Déclaration de non-conformité</h3>
        </CCol>      
      </CRow>

      <Pop_up
        show={showToast}
        type={popType}
        message={popMessage}
        onClose={() => setShowToast(false)}
      />
      <CForm ref={formRef} onSubmit={handleSubmit}>
        {/* Affichage erreur globale */}
        {errors.global && (
          <div className="alert alert-danger">{errors.global}</div>
        )}
        <CCard className='mb-4'>
          <CCardHeader className="text-center">
            <span className="h6">IDENTIFICATION DE LA NON-CONFORMITE</span>
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol xs={12} sm={6} md={6} className='mb-3'>
                <CFormLabel htmlFor="type">Type :</CFormLabel>
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
                <CFormLabel htmlFor="site">Site :</CFormLabel>
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
                <CFormLabel htmlFor="type">Processus concerné(s) :</CFormLabel>
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

        {/* <CCard className='mb-4'>
          <CCardHeader className="text-center">
            <span className="h6">IDENTITE DE L'EMETTEUR</span>
          </CCardHeader>
          <CCardBody>
        
          </CCardBody>
        </CCard> */}

        <CCard className='mb-4'>
          <CCardHeader className="text-center">
            <span className="h6">DESCRIPTION</span>
          </CCardHeader>
          <CCardBody>
            {/* ...existing code... */}
            <CRow>
              <CCol xs={12} sm={6} md={4} className='mb-3'>
                <CFormLabel htmlFor="date">Date :</CFormLabel>
                <CFormInput type='date' id="date" value={date} onChange={e => setDate(e.target.value)} invalid={!!errors['NC.DateTimeFait']}/>
                  {errors['NC.DateTimeFait'] && (
                  <CFormFeedback invalid>{errors['NC.DateTimeFait'][0]}</CFormFeedback>
                )}
              </CCol>
              <CCol xs={12} sm={6} md={4} className='mb-3'>
                <CFormLabel htmlFor="heure">Heure :</CFormLabel>
                <CFormInput type='time' id="heure" value={heure} onChange={e => setHeure(e.target.value)} invalid={!!errors['NC.DateTimeFait']}/>
              </CCol>
              <CCol xs={12} sm={12} md={12} className='mb-3'>
                <CFormLabel htmlFor="description">Description du fait :</CFormLabel>
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
                <CButton color="secondary" type="button" className='me-2' onClick={handleDraft}>
                  Brouillon
                </CButton>
                <CButton color="primary" type="submit">
                  Déclarer
                </CButton>
              </CCol>
            </CRow>
      </CForm>
    </>
  )
}

export default FormNC
