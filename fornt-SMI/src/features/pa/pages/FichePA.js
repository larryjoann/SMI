import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  CRow, CCol, CButton,
  CCard, CCardHeader, CCardBody, CBadge
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilArrowLeft } from '@coreui/icons'
import { usePADetails } from '../hooks/usePADetails'

const FichePA = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data, loading, error, refetch } = usePADetails(id)
  if (loading) return <div>Chargement...</div>
  if (error) return <div className="text-danger">{error}</div>
  const pa = data
  if (!pa) return <div>Plan d'action introuvable</div>
  const sourceDescr = pa.sourcePA.descr || '-'
  const dateConstat = pa.dateConstat ? new Date(pa.dateConstat).toLocaleDateString() : '-'
  const constat = pa.constat || '-'
  const status = pa.status ? true : false
  const processus = Array.isArray(pa.processusConcernes) ? pa.processusConcernes : []

  return (
    <>
      <CRow className='mb-2'>
        <CCol xs={3} className="d-flex justify-content-start">
          <CButton color='secondary' className="mb-3" onClick={() => navigate('/pa')}>
            <CIcon icon={cilArrowLeft} className="me-2" />Retour
          </CButton>
        </CCol>
        <CCol xs={6} className="d-flex justify-content-center"><h3>Fiche Plan d'action</h3></CCol>
      </CRow>
      <CCard>
        <CCardHeader className="text-center"><span className="h6">IDENTITÉ</span></CCardHeader>
        <CCardBody>
          <CRow>
            <CCol md={6}><h6>Source</h6><p>{sourceDescr}</p></CCol>
            <CCol md={6}><h6>Date constat</h6><p>{dateConstat}</p></CCol>
            <CCol md={12}><h6>Constat</h6><p style={{ whiteSpace: 'pre-wrap' }}>{constat}</p></CCol>
            <CCol md={6}><h6>Statut</h6><p>{status ? <CBadge color="success">Actif</CBadge> : <CBadge color="secondary">Inactif</CBadge>}</p></CCol>
            <CCol md={12}><h6>Processus concerné(s)</h6>
              {processus.length > 0 ? (
                processus.map((p) => (
                  <CBadge key={p.id} color="secondary" className="me-1">{p.processus?.nom || p.id_processus}</CBadge>
                ))
              ) : ('-')}
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </>
  )
}

export default FichePA
