import React from 'react'
import {
  CRow, CCol,
  CCard, CCardBody, CCardHeader, 
  CForm, CFormInput, CFormLabel, CFormTextarea,
  CButton , CFormFeedback ,CAlert
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilArrowLeft , cilHistory , cilBadge} from '@coreui/icons'
import { useParams, useNavigate } from 'react-router-dom'
import { useNCDetails } from '../hooks/useNCDetails'


const FicheNC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, loading, error } = useNCDetails(id);

  if (loading) return <CAlert color="info" className="text-center rounded-pill">Chargement...</CAlert>;
  if (error) return <CAlert color="danger" className="text-center rounded-pill">{error}</CAlert>;
  if (!data) return null;

  const { nc, piecesJointes, processusConcerne } = data;

  // Format date/heure
  const dateFait = nc?.dateTimeFait ? new Date(nc.dateTimeFait) : null;
  const dateStr = dateFait ? dateFait.toLocaleDateString() : '';
  const heureStr = dateFait ? dateFait.toLocaleTimeString() : '';

  // Determine which panel to show on return
  const getDefaultPanel = () => {
    if (nc?.dateTimeDeclare) return 'declaration';
    return 'brouillon';
  }

  return (
    <>
      <CRow className='mb-2'>   
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
        <CCol xs={6}> 
          <h3 className="text-center">Détails du non-conformité</h3>
        </CCol> 
        <CCol xs={3} className="d-flex justify-content-end">
            <CButton
            color='secondary'
            className="mb-3"
            // href=''
            >
            <CIcon icon={cilHistory} className="me-2" />
            Histo-activité
            </CButton>
        </CCol>    
      </CRow>
      {nc.statusNc?.id && (
        <CAlert color={nc.statusNc.color} className="text-center rounded-pill">{nc.statusNc.nom}</CAlert>
      )}
      <CForm >
        <CCard className='mb-4'>
          <CCardHeader className="text-center">
            <span className="h6">IDENTIFICATION DE LA NON-CONFORMITE</span>
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol xs={12} sm={6} md={6} className='mb-3'>
                <span className='h6' >Type :</span>
                <a> {nc.typeNc?.nom || ''}</a>
              </CCol>
              <CCol xs={12} sm={6} md={6} className='mb-3'>
                <span className='h6' >Site :</span>
                <a> {nc.lieu?.nom || ''}</a>
              </CCol>
            </CRow>
            <CRow>
              <CCol xs={12} sm={12} md={12} className='mb-3'>
                <span className='h6'>Processus concerné(s) :</span>
                <a> {processusConcerne?.map(p => p.processus?.nom).filter(Boolean).join(' , ')}</a>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>

        <CCard className='mb-4'>
          <CCardHeader className="text-center">
            <span className="h6">DESCRIPTION</span>
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol xs={12} sm={6} md={4} className='mb-3'>
                <span className='h6'>Date : </span>
                <a> {dateStr}</a>
              </CCol>
              <CCol xs={12} sm={6} md={4} className='mb-3'>
                <span className='h6'>Heure : </span>
                <a> {heureStr}</a>
              </CCol>
              <CCol xs={12} sm={12} md={12} className='mb-3'>
                <span className='h6'>Description du fait :</span>
                <div
                //   style={{ border: '1px solid #eee', borderRadius: 6, padding: 8, minHeight: 40, background: '#fafbfc' }}
                  dangerouslySetInnerHTML={{ __html: nc.descr || '' }}
                />
              </CCol>
              <CCol xs={12} sm={12} md={12} className='mb-3'>
                <span className='h6'>Pièces jointes :</span>
                <a> {piecesJointes && piecesJointes.length > 0 ? piecesJointes.map(pj => pj.nomFichier).join(' , ') : 'Aucune'}</a>
              </CCol>
              <CCol xs={12} sm={12} md={12} className='mb-3'>
                <span className='h6'>Action curative :</span>
                <a>{nc.actionCurative || ''}</a>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CForm>
      {nc.idStatusNc != null && nc.statusNc?.idPhaseNc === 1 && (
        <CCol xs={12} className="d-flex justify-content-center">
          <CButton
            color='primary'
            className="mb-3"
            onClick={() => navigate(`/nc/qualif/${nc.id}`)}
          >
            <CIcon icon={cilBadge} className="me-2" />
            Qualifier la non-conformité
          </CButton>
        </CCol>
      )}
    </>
  )
}

export default FicheNC
