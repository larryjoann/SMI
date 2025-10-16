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


const AnalyseCauseNC = () => {
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
      Analyse des causes
    </>
  )
}

export default AnalyseCauseNC
