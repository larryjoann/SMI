import React, { useEffect, useState } from 'react'
import {
  CRow, CCol, CButton,
  CCard, CCardHeader, CCardBody, CBadge, CAvatar,
  CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CFormInput, CForm, CAlert
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilArrowLeft ,cilSettings } from '@coreui/icons'
import { useParams } from 'react-router-dom'
import { useProcessusDetails } from '../hooks/useProcessusDetails'
import API_URL from '../../../api/API_URL'
import { Pop_up } from '../../../components/notification/Pop_up'

const FicheProcessus = () => {
  const { id } = useParams()
  const { processus, loading } = useProcessusDetails(id)
  const [localProcessus, setLocalProcessus] = useState(null)
  const [showValiditeModal, setShowValiditeModal] = useState(false)
  const [newYear, setNewYear] = useState('')
  const [saving, setSaving] = useState(false)
  const [modalError, setModalError] = useState(null)
  const [showToast, setShowToast] = useState(false)
  const [popType, setPopType] = useState('success')
  const [popMessage, setPopMessage] = useState('')

  useEffect(() => {
    setLocalProcessus(processus)
  }, [processus])

  const openValiditeModal = () => {
    setModalError(null)
    setNewYear('')
    setShowValiditeModal(true)
  }

  const addValidite = async () => {
    if (!newYear || isNaN(Number(newYear))) {
      setModalError('Veuillez saisir une année valide')
      return
    }
    setSaving(true)
    setModalError(null)
    try {
      const payload = { idProcessus: Number(id), annee: Number(newYear) }
      const res = await fetch(`${API_URL}/ValiditeProcessus`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: 'Erreur serveur' }))
        throw err
      }
      // refetch the processus to get updated validites
      const procRes = await fetch(`${API_URL}/Processus/${id}`, { credentials: 'include' })
      if (procRes.ok) {
        const updated = await procRes.json()
        setLocalProcessus(updated)
      }
      setShowValiditeModal(false)
      setPopType('success')
      setPopMessage('Année de validité ajoutée')
      setShowToast(true)
    } catch (err) {
      console.error('Erreur add validite', err)
      setModalError(err?.message || err?.response?.data?.message || 'Erreur lors de l\'ajout')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <Pop_up
        show={showToast}
        setShow={setShowToast}
        type={popType}
        message={popMessage}
      />
      <CRow>
        <CCol xs={3} className="d-flex justify-content-start">
          <CButton
            color='secondary'
            className="mb-3"
            href='#/pilotage/cartographie'
          >
            <CIcon icon={cilArrowLeft} className="me-2" />
            Retour
          </CButton>
        </CCol>
        <CCol xs={6} className="d-flex justify-content-center">
          <h3>Fiche du processus</h3>
        </CCol>
        <CCol xs={3} className="d-flex justify-content-end">
          <CButton
            color='secondary'
            className="mb-3"
            onClick={openValiditeModal}
          >
            <CIcon icon={cilSettings} className="me-2" />
            Modifier validité
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
                <p>{localProcessus?.nom || processus.nom} <span className='text-muted'>( {localProcessus?.sigle || processus.sigle} )</span> </p>
              </CCol>
              <CCol md={6}>
                <h6 className="mb-2">Catégorie :</h6>
                <p>{localProcessus?.categorieProcessus?.nom || processus.categorieProcessus?.nom || processus.idCategorieProcessus}</p>
              </CCol>
              <CCol md={6}>
                <h6 className="mb-2">Pilotes :</h6>
                <div>
                  {Array.isArray(localProcessus?.pilotes || processus.pilotes) && (localProcessus?.pilotes || processus.pilotes).length > 0
                    ? (localProcessus?.pilotes || processus.pilotes).map((pi, idx) => {
                        if (!pi || !pi.collaborateur) return null
                        const name = pi.collaborateur.nomAffichage || pi.collaborateur.nomComplet || pi.collaborateur.matricule || ''
                        const initials = name
                          .split(' ')
                          .map((n) => n?.[0])
                          .filter(Boolean)
                          .slice(0, 2)
                          .join('')
                          .toUpperCase()
                        return (
                          <div key={idx} className="d-flex align-items-center mb-2">
                            <CAvatar className="me-3 bg-secondary text-white" size="md">{initials || '-'}</CAvatar>
                            <div>
                              <div style={{ fontWeight: 700 }}>{pi.collaborateur.nomComplet}</div>
                              <div className="text-muted" style={{ fontSize: '0.85rem' }}>{pi.collaborateur.poste || ''}</div>
                            </div>
                          </div>
                        )
                      })
                    : '-'}
                </div>
              </CCol>
              <CCol md={6}>
                <h6 className="mb-2">Copilotes :</h6>
                <div>
                  {Array.isArray(localProcessus?.copilotes || processus.copilotes) && (localProcessus?.copilotes || processus.copilotes).length > 0
                    ? (localProcessus?.copilotes || processus.copilotes).map((co, idx) => {
                        if (!co || !co.collaborateur) return null
                        const name = co.collaborateur.nomAffichage || co.collaborateur.nomComplet || co.collaborateur.matricule || ''
                        const initials = name
                          .split(' ')
                          .map((n) => n?.[0])
                          .filter(Boolean)
                          .slice(0, 2)
                          .join('')
                          .toUpperCase()
                        return (
                          <div key={idx} className="d-flex align-items-center mb-2">
                            <CAvatar className="me-3 bg-secondary text-white" size="md">{initials || '-'}</CAvatar>
                            <div>
                              <div style={{ fontWeight: 700 }}>{co.collaborateur.nomComplet}</div>
                              <div className="text-muted" style={{ fontSize: '0.85rem' }}>{co.collaborateur.poste || ''}</div>
                            </div>
                          </div>
                        )
                      })
                    : '-'}
                </div>
              </CCol>
              <CCol md={6}>
                <h6 className="mb-2">Finalité :</h6>
                <p>{localProcessus?.finalite || processus.finalite || '-'}</p>
              </CCol>
              <CCol md={6}>
                <h6 className="mb-2">Contexte :</h6>
                <p>{localProcessus?.contexte || processus.contexte || '-'}</p>
              </CCol>
              <CCol md={6}>
                <h6 className="mb-2">Années de validité :</h6>
                <p>
                  {Array.isArray(localProcessus?.validites || processus.validites) && (localProcessus?.validites || processus.validites).length > 0 ? (
                    (localProcessus?.validites || processus.validites).map((v) => (
                      <CBadge key={v.id} color="secondary" className="me-1">{v.annee}</CBadge>
                    ))
                  ) : (
                    '-'
                  )}
                </p>
              </CCol>
            </CRow>
          ) : (
            <div className="text-center py-4">
              <span>Processus introuvable.</span>
            </div>
          )}
        </CCardBody>
      </CCard>
      {/* Modal to add validity year */}
      <CModal alignment="center" visible={showValiditeModal} onClose={() => setShowValiditeModal(false)}>
        <CModalHeader>
          <CModalTitle>Ajouter une année de validité</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {modalError && <CAlert color="danger">{modalError}</CAlert>}
          <CForm>
            <CFormInput
              type="number"
              placeholder="Année (ex: 2025)"
              value={newYear}
              onChange={(e) => setNewYear(e.target.value)}
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowValiditeModal(false)}>Annuler</CButton>
          <CButton color="primary" onClick={addValidite} disabled={saving}>{saving ? 'Enregistrement...' : 'Ajouter'}</CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default FicheProcessus
