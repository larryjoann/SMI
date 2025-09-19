import React from 'react'
import {
  CRow, CCol, CButton,
  CCard, CCardHeader, CCardBody
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilArrowLeft } from '@coreui/icons'
import { useParams } from 'react-router-dom'
import { useProcessusDetails } from '../hooks/useProcessusDetails'

const FicheProcessus = () => {
  const { id } = useParams()
  const { processus, loading } = useProcessusDetails(id)

  return (
    <>
      <CRow>
        <CCol xs={12} className="d-flex justify-content-start">
          <CButton
            color='secondary'
            className="mb-3"
            href='#/pilotage/cartographie'
          >
            <CIcon icon={cilArrowLeft} className="me-2" />
            Retour
          </CButton>
        </CCol>
      </CRow>
      <CCard>
        <CCardHeader className="text-center">
          <span className="h6">FICHE D'IDENTITÉ DU PROCESSUS</span>
        </CCardHeader>
        <CCardBody>
          {loading ? (
            <div className="text-center py-4">
              <span>Chargement des informations du processus...</span>
            </div>
          ) : processus ? (
            <CRow>
              <CCol md={6}>
                <h6 className="mb-2">Nom du processus :</h6>
                <p>{processus.nom} <span className='text-muted'>( {processus.sigle} )</span> </p>
              </CCol>
              <CCol md={6}>
                <h6 className="mb-2">Catégorie :</h6>
                <p>{processus.categorieProcessus?.nom || processus.idCategorieProcessus}</p>
              </CCol>
              <CCol md={6}>
                <h6 className="mb-2">Pilotes :</h6>
                <p>
                  {Array.isArray(processus.pilotes) && processus.pilotes.length > 0
                    ? processus.pilotes.map((pi, idx) =>
                        pi.collaborateur
                          ? (
                              <span key={idx}>
                                {pi.collaborateur.nomComplet} <span className="text-muted">({pi.collaborateur.poste})</span><br />
                              </span>
                            )
                          : null
                      )
                    : '-'}
                </p>
              </CCol>
              <CCol md={6}>
                <h6 className="mb-2">Copilotes :</h6>
                <p>
                  {Array.isArray(processus.copilotes) && processus.copilotes.length > 0
                    ? processus.copilotes.map((co, idx) =>
                        co.collaborateur
                          ? (
                              <span key={idx}>
                                {co.collaborateur.nomComplet} <span className="text-muted">({co.collaborateur.poste})</span><br />
                              </span>
                            )
                          : null
                      )
                    : '-'}
                </p>
              </CCol>
              <CCol md={6}>
                <h6 className="mb-2">Finalité :</h6>
                <p>{processus.finalite || '-'}</p>
              </CCol>
              <CCol md={6}>
                <h6 className="mb-2">Contexte :</h6>
                <p>{processus.contexte || '-'}</p>
              </CCol>
            </CRow>
          ) : (
            <div className="text-center py-4">
              <span>Processus introuvable.</span>
            </div>
          )}
        </CCardBody>
      </CCard>
    </>
  )
}

export default FicheProcessus
