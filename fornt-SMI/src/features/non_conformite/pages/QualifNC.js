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
import { cilArrowLeft , cilX , cilCheck , cilInfo } from '@coreui/icons'


const QualifNC = () => {
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
            onClick={() => navigate(`/nc/fiche/${id}`)}
            >
            <CIcon icon={cilArrowLeft} className="me-2" />
            Retour
            </CButton>
           </CCol>
        )}
        <CCol xs={id ? 6 : 12}> 
          <h3 className="text-center">
            Qualification de la non-conformité
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
                <CFormLabel htmlFor="type">Type :</CFormLabel>
                <CFormInput type="text" value={typeNC} disabled readOnly />
              </CCol>
              <CCol xs={12} sm={6} md={6} className='mb-3'>
                <CFormLabel htmlFor="site">Site :</CFormLabel>
                <CFormInput type="text" value={site} disabled readOnly />
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

        <CCard className='mb-4'>
          <CCardHeader className="text-center">
            <span className="h6">DESCRIPTION</span>
          </CCardHeader>
          <CCardBody>
            {/* ...existing code... */}
            <CRow>
              <CCol xs={12} sm={6} md={4} className='mb-3'>
                <CFormLabel htmlFor="date">Date :</CFormLabel>
                <CFormInput type='date' id="date" value={date} disabled readOnly />
              </CCol>
              <CCol xs={12} sm={6} md={4} className='mb-3'>
                <CFormLabel htmlFor="heure">Heure :</CFormLabel>
                <CFormInput type='time' id="heure" value={heure} disabled readOnly />
              </CCol>
              <CCol xs={12} sm={12} md={12} className='mb-3'>
                <CFormLabel htmlFor="description">Description du fait :</CFormLabel>
                <div className="form-control" style={{ minHeight: 40, background: '#fafbfc' }} dangerouslySetInnerHTML={{ __html: description || '' }} />
              </CCol>
              <CCol xs={12} sm={12} md={12} className='mb-3'>
                <CFormLabel htmlFor="curative">Pièces jointes :</CFormLabel>
                <div className="form-control" style={{ minHeight: 40, background: '#fafbfc' }}>
                  {files && files.length > 0 ? files.map(f => f.name || f.nomFichier).join(' , ') : 'Aucune'}
                </div>
              </CCol>
              <CCol xs={12} sm={12} md={12} className='mb-3'>
                <CFormLabel htmlFor="curative">Action curative :</CFormLabel>
                <CFormTextarea id="curative" rows={3} value={actionCurative} disabled readOnly />
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CForm>
      <CRow>
        <CCol xs={4} className="d-flex justify-content-center">
            <CButton
                color='primary'
                className="mb-3 w-100"
            >
                <CIcon icon={cilCheck} className="me-2" />
                Reçevable
            </CButton>
        </CCol>
        <CCol xs={4} className="d-flex justify-content-center">
            <CButton
                color='info'
                className="mb-3 w-100"
                >
                <CIcon icon={cilInfo} className="me-2" />
                Demander plus d'infos
            </CButton>
        </CCol>
        <CCol xs={4} className="d-flex justify-content-center">
            <CButton
                color='danger'
                className="mb-3 w-100"
            >
                <CIcon icon={cilX} className="me-2" />
                Non-recevable   
            </CButton>
        </CCol>
      </CRow>
    </>
  )
}

export default QualifNC


