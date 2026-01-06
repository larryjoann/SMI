import React, { useEffect, useState, useMemo } from 'react'
import {
  CRow, CCol, CButton,
  CCard, CCardHeader, CCardBody, CBadge, CAvatar,
  CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CFormInput, CForm, CAlert,
  CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilArrowLeft ,cilPlus, cilTrash } from '@coreui/icons'
import { useParams } from 'react-router-dom'
import { useProcessusDetails } from '../hooks/useProcessusDetails'
import axiosInstance from '../../../api/axiosInstance'
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
  const [hoveredValiditeId, setHoveredValiditeId] = useState(null)
  const [showDeleteValiditeModal, setShowDeleteValiditeModal] = useState(false)
  const [validiteToDelete, setValiditeToDelete] = useState(null)

  useEffect(() => {
    setLocalProcessus(processus)
  }, [processus])

  const responsablesGroups = useMemo(() => {
    const list = (localProcessus && localProcessus.responsablesProcessus) || (processus && processus.responsablesProcessus) || []
    const groups = {}
    if (!Array.isArray(list) || list.length === 0) return []
    list.forEach((rp) => {
      const label = rp?.typeResponsableProcessus?.role?.nom || rp?.typeResponsableProcessus?.nom || 'Responsable'
      if (!groups[label]) groups[label] = []
      groups[label].push(rp)
    })
    return Object.entries(groups).map(([label, arr]) => ({ label, arr }))
  }, [localProcessus, processus])

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
      await axiosInstance.post('/ValiditeProcessus', payload)
      // refetch the processus to get updated validites
      const procRes = await axiosInstance.get(`/Processus/${id}`)
      if (procRes && procRes.status >= 200 && procRes.status < 300) {
        const updated = procRes.data
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

  const askDeleteValidite = (v) => {
    setValiditeToDelete(v)
    setShowDeleteValiditeModal(true)
  }

  const confirmDeleteValidite = async () => {
    // UI-only deletion (no API call) as requested: remove from localProcessus
    if (!validiteToDelete) return
    setSaving(true)
    try {
      setLocalProcessus((prev) => {
        if (!prev) return prev
        const updated = { ...prev, validites: (prev.validites || []).filter((x) => x.id !== validiteToDelete.id) }
        return updated
      })
      setPopType('success')
      setPopMessage('Année de validité supprimée (affichage uniquement)')
      setShowToast(true)
    } catch (err) {
      console.error('Erreur suppression locale validite', err)
      setPopType('danger')
      setPopMessage('Erreur lors de la suppression (local)')
      setShowToast(true)
    } finally {
      setSaving(false)
      setShowDeleteValiditeModal(false)
      setValiditeToDelete(null)
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
            href='/cartographie'
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
            <CIcon icon={cilPlus} className="me-2" />
            Ajouter année de validité
          </CButton>
        </CCol>
      </CRow>
      <CCard>
        <CCardHeader className="text-center">
          <span className="h6">'IDENTITÉ DU PROCESSUS</span>
        </CCardHeader>
        <CCardBody>
          {loading ? (
            <div className="text-center py-4">
              <span>Chargement des informations du processus...</span>
            </div>
          ) : processus ? (
            <CRow>
              <CCol md={6} className='mb-3'>
                <h6 className="mb-1">Nom du processus :</h6>
                <p>{localProcessus?.nom || processus.nom} <span className='text-muted'>( {localProcessus?.sigle || processus.sigle} )</span> </p>
              </CCol>
              <CCol md={6} className='mb-3'>
                <h6 className="mb-1">Catégorie :</h6>
                <p>{localProcessus?.categorieProcessus?.nom || processus.categorieProcessus?.nom || processus.idCategorieProcessus}</p>
              </CCol>
              {Array.isArray(responsablesGroups) && responsablesGroups.length > 0 ? (
                responsablesGroups.map((g, gIdx) => (
                  <CCol key={gIdx} md={6} className='mb-3'>
                    <h6 className="mb-1">{g.label} :</h6>
                    <div>
                      {Array.isArray(g.arr) && g.arr.length > 0
                        ? g.arr.map((rp, idx) => {
                            if (!rp || !rp.collaborateur) return null
                            const name = rp.collaborateur.nomAffichage || rp.collaborateur.nomComplet || rp.collaborateur.matricule || ''
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
                                  <div style={{ fontWeight: 700 }}>{rp.collaborateur.nomComplet}</div>
                                  <div className="text-muted" style={{ fontSize: '0.85rem' }}>{rp.collaborateur.poste || ''}</div>
                                </div>
                              </div>
                            )
                          })
                        : '-'}
                    </div>
                  </CCol>
                ))
              ) : (
                <>
                  
                </>
              )}
              <CCol md={6} className='mb-3'>
                <h6 className="mb-1">Finalité :</h6>
                <div style={{ background: '#f8f9fa', padding: '12px', borderRadius: 8, whiteSpace: 'pre-wrap' }}>{localProcessus?.finalite || processus.finalite || '-'}</div>
              </CCol>
              <CCol md={6} className='mb-3'>
                <h6 className="mb-1">Contexte :</h6>
                <div style={{ background: '#f8f9fa', padding: '12px', borderRadius: 8, whiteSpace: 'pre-wrap' }}>{localProcessus?.contexte || processus.contexte || '-'}</div>
              </CCol>
              <CCol md={6} className='mb-3'>
                <h6 className="mb-1">Années de validité :</h6>
                <p>
                  {Array.isArray((localProcessus?.validites || processus?.validites)) && (localProcessus?.validites || processus?.validites).length > 0 ? (
                    (localProcessus?.validites || processus?.validites).map((v) => (
                      <span
                        key={v.id}
                        className="me-1"
                        style={{ position: 'relative', display: 'inline-block' }}
                        onMouseEnter={() => setHoveredValiditeId(v.id)}
                        onMouseLeave={() => setHoveredValiditeId(null)}
                      >
                        <CBadge size='md' color="secondary" className="me-1">{v.annee}</CBadge>
                        <CIcon
                          icon={cilTrash}
                          className="text-danger"
                          size="md"
                          title="Supprimer"
                          style={{
                            position: 'absolute',
                            top: -6,
                            right: -6,
                            cursor: 'pointer',
                            opacity: hoveredValiditeId === v.id ? 1 : 0,
                            transition: 'opacity 0.15s ease-in-out',
                          }}
                          onClick={() => askDeleteValidite(v)}
                        />
                      </span>
                    ))
                  ) : (
                    '-'
                  )}
                </p>
              </CCol>

              {/* Nouvelles sections: interactions, ressources, parties intéressées, activités (tables) */}

              <CCol md={12} className='mb-3'>
                <h6 className="mb-1">Interactions <small className="text-muted">({(localProcessus?.intercations || processus?.intercations || localProcessus?.interactions || processus?.interactions || []).length})</small> :</h6>
                {Array.isArray((localProcessus?.intercations || processus?.intercations || localProcessus?.interactions || processus?.interactions)) && (localProcessus?.intercations || processus?.intercations || localProcessus?.interactions || processus?.interactions).length > 0 ? (
                  <CTable hover responsive bordered>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>Processus lié</CTableHeaderCell>
                        <CTableHeaderCell>Description</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {(localProcessus?.intercations || processus?.intercations || localProcessus?.interactions || processus?.interactions).map((it) => (
                        <CTableRow key={it.id}>
                          <CTableDataCell>{it.idProcessusInteragi || '-'}</CTableDataCell>
                          <CTableDataCell>{it.descr || '-'}</CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                ) : (
                  '-'
                )}
              </CCol>

              <CCol md={12} className='mb-3'>
                <h6 className="mb-1">Ressources <small className="text-muted">({(localProcessus?.ressourcesProcessus || processus?.ressourcesProcessus || []).length})</small> :</h6>
                {Array.isArray((localProcessus?.ressourcesProcessus || processus?.ressourcesProcessus)) && (localProcessus?.ressourcesProcessus || processus?.ressourcesProcessus).length > 0 ? (
                  <CTable hover responsive bordered>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>Catégorie</CTableHeaderCell>
                        <CTableHeaderCell>Description</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {(localProcessus?.ressourcesProcessus || processus?.ressourcesProcessus).map((r) => (
                        <CTableRow key={r.id}>
                          <CTableDataCell>{r.categorieRessources?.nom || 'Autre'}</CTableDataCell>
                          <CTableDataCell>{r.descr || '-'}</CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                ) : (
                  '-'
                )}
              </CCol>

              <CCol md={12} className='mb-3'>
                <h6 className="mb-1">Parties intéressées & attentes <small className="text-muted">({(localProcessus?.partieInteresseAttentes || processus?.partieInteresseAttentes || []).length})</small> :</h6>
                {Array.isArray((localProcessus?.partieInteresseAttentes || processus?.partieInteresseAttentes)) && (localProcessus?.partieInteresseAttentes || processus?.partieInteresseAttentes).length > 0 ? (
                  <CTable hover responsive bordered>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>Partie</CTableHeaderCell>
                        <CTableHeaderCell>Groupe</CTableHeaderCell>
                        <CTableHeaderCell>Attente</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {(localProcessus?.partieInteresseAttentes || processus?.partieInteresseAttentes).map((p) => (
                        <CTableRow key={p.id}>
                          <CTableDataCell>{p.partieInteresse || '-'}</CTableDataCell>
                          <CTableDataCell>{p.groupe || '-'}</CTableDataCell>
                          <CTableDataCell>{p.attente || '-'}</CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                ) : (
                  '-'
                )}
              </CCol>

              <CCol md={12} className='mb-3'>
                <h6 className="mb-1">Activités <small className="text-muted">({(localProcessus?.activites || processus?.activites || []).length})</small> :</h6>
                {Array.isArray((localProcessus?.activites || processus?.activites)) && (localProcessus?.activites || processus?.activites).length > 0 ? (
                  <CTable hover responsive bordered>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>Fournisseur</CTableHeaderCell>
                        <CTableHeaderCell>Entrée</CTableHeaderCell>
                        <CTableHeaderCell>Description</CTableHeaderCell>
                        <CTableHeaderCell>Sortie</CTableHeaderCell>        
                        <CTableHeaderCell>Client</CTableHeaderCell>
                        
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {(localProcessus?.activites || processus?.activites).map((a) => (
                        <CTableRow key={a.id}>
                           <CTableDataCell>{a.processusFournisseur || '-'}</CTableDataCell>
                          <CTableDataCell>{a.elementEntrante || '-'}</CTableDataCell>
                          <CTableDataCell>{a.descr || '-'}</CTableDataCell>                           
                          <CTableDataCell>{a.elementSortante || '-'}</CTableDataCell>
                           <CTableDataCell>{a.processusClient || '-'}</CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                ) : (
                  '-'
                )}
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
      {/* Delete validity confirmation modal (UI-only) */}
      <CModal alignment="center" visible={showDeleteValiditeModal} onClose={() => setShowDeleteValiditeModal(false)}>
        <CModalHeader>
          <CModalTitle>Supprimer l'année de validité</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {validiteToDelete ? (
            <div>Voulez-vous supprimer l'année <strong>{validiteToDelete.annee}</strong> </div>
          ) : (
            <div>Aucune année sélectionnée.</div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowDeleteValiditeModal(false)}>Non</CButton>
          <CButton color="danger" onClick={confirmDeleteValidite} disabled={saving}>{saving ? 'Suppression...' : 'Oui, supprimer'}</CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default FicheProcessus
