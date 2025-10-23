import React, { useState } from 'react'
import {
  CRow, CCol,
  CCard, CCardBody, CCardHeader, 
  CForm, CFormInput,
  CButton , CFormFeedback ,CAlert,
  CInputGroup
} from '@coreui/react'
import { CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CLink, CPopover, CTooltip } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilArrowLeft , 
  cilHistory, 
  cilStar, 
  cilSend,
  cilMagnifyingGlass
} from '@coreui/icons'
import { useParams, useNavigate } from 'react-router-dom'
import { useNCDetails } from '../hooks/useNCDetails'
import QualificationModal from '../components/QualificationModal'
import AnalyseCausesModal from '../components/AnalyseCausesModal'


const FicheNC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showQualifModal, setShowQualifModal] = useState(false)
  const [showAnalyseModal, setShowAnalyseModal] = useState(false)
  const [selectedProcessus, setSelectedProcessus] = useState([])
  const [selectedCategorieCause, setSelectedCategorieCause] = useState([])
  const { data, loading, error, refetch } = useNCDetails(id);

  if (loading) return <CAlert color="info" className="text-center rounded-pill">Chargement...</CAlert>;
  if (error) return <CAlert color="danger" className="text-center rounded-pill">{error}</CAlert>;
  if (!data) return null;

  const { nc, piecesJointes, processusConcerne , causes } = data;
  // Causes may come from top-level `data.causes` or inside `nc.causes` depending on API

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
        <CAlert  color={nc.statusNc.color} variant='solid' className="text-center fw-bold rounded-pill">{nc.statusNc.nom}</CAlert>
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

        <CCard className='mb-4'>
          <CCardHeader className="text-center">
            <span className="h6">ANALYSE DES CAUSES</span>
          </CCardHeader>
          <CCardBody>
              <CRow>
                <CCol xs={12} sm={12} md={12} className='mb-3'>
                  {Array.isArray(causes) && causes.length > 0 ? (
                    <div>
                      {causes.map((c) => (
                        <div key={c.id} className="mb-2">     
                            <span className='h6'>{c.categorieCauseNc.nom} </span>                      
                          <div>{c.descr}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-3 text-muted">Aucune analyse des causes</div>
                  )}
                </CCol>
              </CRow>
            </CCardBody>
        </CCard>

      </CForm>
      {nc.idStatusNc != null && nc.statusNc?.idPhaseNc === 1 && (nc.statusNc.id === 1 || nc.statusNc.id === 2) &&(
        <CCol xs={12} className="d-flex justify-content-center">
          <CButton
            color='primary'
            className="mb-3"
            onClick={() => {
              const init = (processusConcerne || []).map(p => ({ value: p.processus?.id, label: p.processus?.nom }))
              setSelectedProcessus(init)
              setShowQualifModal(true)
            }}
          >
            <CIcon icon={cilStar} className="me-2" />
            Qualifier la non-conformité
          </CButton>
        </CCol>
      )}
      {nc.idStatusNc != null && nc.statusNc?.idPhaseNc === 1 && nc.statusNc.id === 3 &&(
        <CCol xs={12} className="d-flex justify-content-center">
          <CButton
            color='primary'
            className="mb-3"
            onClick={() => {
              const init = (causes || []).map(c => ({ value: c.categorieCauseNc.id, label: c.categorieCauseNc?.nom }))
              setSelectedCategorieCause(init)
              setShowAnalyseModal(true)
            }}
          >
            <CIcon icon={cilMagnifyingGlass} className="me-2" />
            Analyser les causes
          </CButton>
        </CCol>
      )}
      <QualificationModal
        visible={showQualifModal}
        onClose={() => setShowQualifModal(false)}
        nc={nc}
        processusConcerne={processusConcerne}
        onSuccess={() => {
          // refresh data without reloading the whole page
          if (typeof refetch === 'function') refetch()
          setShowQualifModal(false)
        }}
      />
      <AnalyseCausesModal
        visible={showAnalyseModal}
        onClose={() => setShowAnalyseModal(false)}
        nc={nc}
        causes={causes}
        onSuccess={() => {
          if (typeof refetch === 'function') refetch()
          setShowAnalyseModal(false)
        }}
      />
      <CInputGroup className="mb-3 rounded-pill overflow-hidden" style={{ border: '1px solid #c7c5c5ff' }}>
        <CFormInput
          placeholder="Ajouter un commentaire..."
          aria-label="Recipient's username"
          className="border-0"
          style={{ boxShadow: 'none' }}
        />
        <CButton type="button" className="rounded-pill" color='primary'>
          <CIcon icon={cilSend}  />
        </CButton>
      </CInputGroup>
    </>
  )
}

export default FicheNC
