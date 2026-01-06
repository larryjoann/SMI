import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  CRow, CCol, CButton,
  CCard, CCardHeader, CCardBody, CBadge, CAvatar,
  CProgress, CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem, CDropdownDivider, CSpinner
} from '@coreui/react'
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter } from '@coreui/react'
import { CInputGroup, CFormInput } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilArrowLeft, cilOptions, cilX, cilPen, cilPlus, cilHistory, cilSend, cilCheckAlt, cilFile , cilCheckCircle } from '@coreui/icons'
import API_URL from '../../../api/API_URL'
import axiosInstance from '../../../api/axiosInstance'
import { usePADetails } from '../hooks/usePADetails'
import ActionPAModal from '../components/ActionPAModal'
import { Pop_up } from '../../../components/notification/Pop_up'
import VerifierEfficaciteModal from '../../non_conformite/components/VerifierEfficaciteModal'

const FichePA = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data, loading, error, refetch } = usePADetails(id)
  const [showActionModal, setShowActionModal] = useState(false)
  const [showVerifyModal, setShowVerifyModal] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [showVerifyToast, setShowVerifyToast] = useState(false)
  const [verifyPopType, setVerifyPopType] = useState('success')
  const [verifyPopMessage, setVerifyPopMessage] = useState('')
  const [showCloseConfirmPA, setShowCloseConfirmPA] = useState(false)
  const [closingPA, setClosingPA] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [commentLoading, setCommentLoading] = useState(false)
  if (loading) return <div>Chargement...</div>
  if (error) return <div className="text-danger">{error}</div>
  const pa = data
  if (!pa) return <div>Plan d'action introuvable</div>
  const sourceDescr = pa.sourcePA.descr || '-'
  const dateConstat = pa.dateConstat ? new Date(pa.dateConstat).toLocaleDateString() : '-'
  const constat = pa.constat || '-'
  const status = pa.statusPA 
  const processus = Array.isArray(pa.processusConcernes) ? pa.processusConcernes : []

  // Determine if the PA is closed (clôturé). Backend may use an id (e.g. 9) or a status name.
  const isClosed = pa.idStatusPA === 9 || (status && (status.id === 9 || (typeof status.nom === 'string' && /clot|clos/i.test(status.nom))))

  // Static sample verifications for UI (description + attachment)
  const sampleVerifications = [
    {
      id: 'sv1',
      result: 'éfficace',
      descr: 'Vérification initiale réalisée: contrôles documentaires et relevés conformes.',
      piece: { nomFichier: 'rapport_verif_initial.pdf', cheminFichier: '#' },
    },
  ]

  // Handlers for action card options
  const handleEditAction = (action) => {
    // Navigate to the action edit form
    if (!action || !action.id) return
    navigate(`/action/form/${action.id}`)
  }

  const handleDeleteAction = async (action) => {
    console.log('Delete action (PA)', action)
    // find the source record that links this action to the PA (idEntite = 3)
    const src = Array.isArray(action.sources) ? action.sources.find(s => (s.idEntite === 3) && (s.idObjet === pa?.id)) : null
    const idToDelete = src?.id
    if (!idToDelete) {
      console.log('No source id found to delete for action', action)
      return
    }
    try {
      const res = await axiosInstance.delete(`/SourceAction/${idToDelete}`)
      if (!res || (res.status && res.status >= 400)) {
        const body = (res && res.data) ? JSON.stringify(res.data) : ''
        console.error('Delete failed', res.status, body)
        window.alert(`Echec suppression (${res.status}) : ${body}`)
        return
      }
      // refresh details to reflect deletion
      if (typeof refetch === 'function') refetch()
    } catch (err) {
      console.error('Delete error', err)
      window.alert('Erreur lors de la suppression')
    }
  }

  const handleSubmitComment = async () => {
    if (!newComment || !newComment.trim()) return
    setCommentLoading(true)
    try {
      // Minimal local submit: if API exists, integrate here. For now just log and refresh details.
      console.log('Submit PA comment (demo):', newComment)
      if (typeof refetch === 'function') await refetch()
      setNewComment('')
    } catch (err) {
      console.error('Error submitting comment', err)
    } finally {
      setCommentLoading(false)
    }
  }

  // Determine whether all PA actions have 100% progress
  const allActionsComplete = Array.isArray(pa.actions) && pa.actions.length > 0 && pa.actions.every((action) => {
    const lastSuivi = (Array.isArray(action.suivis) && action.suivis.length > 0)
      ? action.suivis.reduce((latest, s) => {
          if (!latest) return s
          const ds = s.dateSuivi ? new Date(s.dateSuivi) : null
          const dl = latest.dateSuivi ? new Date(latest.dateSuivi) : null
          if (!ds) return latest
          if (!dl) return s
          return ds > dl ? s : latest
        }, null)
      : null
    const progress = lastSuivi && typeof lastSuivi.avancement === 'number' ? lastSuivi.avancement : 0
    return progress === 100
  })

  const verifyEfficacitePA = async (payload) => {
    if (!pa || !pa.id) {
      setVerifyPopType('danger')
      setVerifyPopMessage('Identifiant du plan d\'action manquant')
      setShowVerifyToast(true)
      return
    }
    setVerifying(true)
    try {
      const url = `/PlanAction/verifier?id=${encodeURIComponent(pa.id)}`
      const res = await axiosInstance.post(url)
      if (!res || (res.status && res.status >= 400 && res.status !== 204)) {
        const body = (res && res.data) ? JSON.stringify(res.data) : ''
        throw new Error(body || `Erreur serveur (${res.status})`)
      }
      setShowVerifyModal(false)
      setVerifyPopType('success')
      setVerifyPopMessage('Vérification enregistrée')
      setShowVerifyToast(true)
      if (typeof refetch === 'function') await refetch()
    } catch (err) {
      console.error('verifyEfficacitePA error', err)
      setVerifyPopType('danger')
      setVerifyPopMessage(err?.message || 'Erreur lors de la vérification')
      setShowVerifyToast(true)
    } finally {
      setVerifying(false)
    }
  }

  // Close (clôturer) PA: call backend to set PA as closed
  const cloturerPA = async () => {
    if (!pa || !pa.id) {
      setVerifyPopType('danger')
      setVerifyPopMessage('Identifiant du plan d\'action manquant')
      setShowVerifyToast(true)
      return
    }
    setClosingPA(true)
    try {
      const url = `/PlanAction/cloturer?id=${encodeURIComponent(pa.id)}`
      const res = await axiosInstance.post(url)
      if (!res || (res.status && res.status >= 400 && res.status !== 204)) {
        const body = (res && res.data) ? JSON.stringify(res.data) : ''
        throw new Error(body || `Erreur serveur (${res.status})`)
      }
      setShowCloseConfirmPA(false)
      setVerifyPopType('success')
      setVerifyPopMessage('Plan d\'action clôturé')
      setShowVerifyToast(true)
      if (typeof refetch === 'function') await refetch()
    } catch (err) {
      console.error('cloturerPA error', err)
      setVerifyPopType('danger')
      setVerifyPopMessage(err?.message || 'Erreur lors de la clôture')
      setShowVerifyToast(true)
    } finally {
      setClosingPA(false)
    }
  }

  return (
    <div style={{ position: 'relative', minHeight: 'calc(100vh - 80px)', paddingBottom: 140 }}>
      <CRow className='mb-2'>
        <CCol xs={3} className="d-flex justify-content-start">
          <CButton color='secondary' className="mb-3" onClick={() => navigate('/pa')}>
            <CIcon icon={cilArrowLeft} className="me-2" />Retour
          </CButton>
        </CCol>
        <CCol xs={6} className="d-flex justify-content-center"><h3>Fiche Plan d'action</h3></CCol>
        <CCol xs={3} className="d-flex justify-content-end">
          <CButton
            color='secondary'
            className="mb-3"
            onClick={() => navigate(`/pa/list/fiche/histoactivite/${pa?.id || id}`)}
            >
            <CIcon icon={cilHistory} className="me-2" />
            Histo-activité
            </CButton>
        </CCol>
      </CRow>
      <CCard className='mb-4'>
        <CCardHeader className="text-center"><span className="h6">IDENTITÉ</span></CCardHeader>
        <CCardBody>
          <CRow>
            <CCol className='mb-3' md={6}><span className='h6'>Source : </span><a>{sourceDescr}</a></CCol>
            <CCol className='mb-3' md={6}><span className='h6'>Date constat : </span><a>{dateConstat}</a></CCol>
            <CCol className='mb-3' md={12}><span className='h6'>Constat :</span>
              <div style={{ background: '#f8f9fa', padding: '12px', borderRadius: 8, whiteSpace: 'pre-wrap' }}>{constat}</div>
            </CCol>
            <CCol className='mb-3' md={12}><span className='h6'>Processus concerné(s) : </span>
              {processus.length > 0 ? (
                processus.map((p) => (
                  <span  className="me-1">{p.processus?.nom || p.id_processus}</span>
                ))
              ) : ('-')}
            </CCol>
            <CCol className='mb-3' md={6}><span className='h6'>Statut : </span><a><CBadge color={status.color}>{status.nom}</CBadge> </a></CCol>
          </CRow>
        </CCardBody>
      </CCard>
      {/* Actions card */}
      {Array.isArray(pa.actions) && pa.actions.length > 0 && (
      <CCard className='mb-4'>
        <CCardHeader className="position-relative text-center">
          <span className="h6">ACTION(s)</span>
          <div style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)' }}>
            {!isClosed && (
              <CButton size="md" onClick={() => setShowActionModal(true)}>
                <CIcon color='primary' icon={cilPlus} className="text-primary"/>
              </CButton>
            )}
          </div>
        </CCardHeader>
        <CCardBody>
          {Array.isArray(pa.actions) && pa.actions.length > 0 ? (
            pa.actions.map((action) => {
              const lastSuivi = (Array.isArray(action.suivis) && action.suivis.length > 0)
                ? action.suivis.reduce((latest, s) => {
                    if (!latest) return s
                    const ds = s.dateSuivi ? new Date(s.dateSuivi) : null
                    const dl = latest.dateSuivi ? new Date(latest.dateSuivi) : null
                    if (!ds) return latest
                    if (!dl) return s
                    return ds > dl ? s : latest
                  }, null)
                : null
              const progress = lastSuivi && typeof lastSuivi.avancement === 'number' ? lastSuivi.avancement : 0
              const statusLabel = action.statusAction?.nom || ''
              const statusColor = action.statusAction?.color || 'secondary'
              const dateDebutStr = action.dateDebut ? new Date(action.dateDebut).toLocaleDateString() : '-'
              const dateFinStr = action.dateFinPrevue ? new Date(action.dateFinPrevue).toLocaleDateString() : '-'
              const title = action.titre && action.titre.trim() !== '' ? action.titre : '(Sans titre)'
              return (
                <CCard 
                  className="mb-3 card-list-hover" 
                  onClick={() => navigate(`/action/fiche/${action.id}`)}
                  key={action.id}
                  >
                  <CCardBody className="position-relative">
                    <div
                      className="position-absolute end-0 top-0 me-2 mt-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <CDropdown alignment="end">
                        <CDropdownToggle caret={false} className="p-0">
                          <CIcon icon={cilOptions} className="text-dark" />
                        </CDropdownToggle>
                        <CDropdownMenu>
                          <CDropdownItem
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteAction(action)
                            }}
                          >
                            <CIcon icon={cilX} className="text-secondary me-3" />
                            <span className="text-secondary">Détacher</span>
                          </CDropdownItem>
                          <CDropdownDivider />
                          <CDropdownItem
                            onClick={(e) => {
                              e.stopPropagation()
                              handleEditAction(action)
                            }}
                          >
                            <CIcon icon={cilPen} className="text-warning me-3" />
                            <span className="text-warning">Modifier</span>
                          </CDropdownItem>
                        </CDropdownMenu>
                      </CDropdown>
                    </div>

                    <div className="">
                      {action.priorite && <><span className='h6'>Priorité : </span><CBadge color="danger" className="mb-3">{action.priorite.nom}</CBadge></>}
                      <h6>{title}</h6>
                      <p>{action.descr}</p>
                      <span className='h6'>Status : </span><CBadge color={statusColor} className="mb-3">{statusLabel}</CBadge>
                      <CProgress value={progress} variant="striped" animated>{progress}%</CProgress>
                      <div className="d-flex justify-content-between align-items-center mt-2">
                        <div>
                          <span>{dateDebutStr} - {dateFinStr}</span>
                        </div>
                        <div className="d-flex align-items-center">
                          {Array.isArray(action.responsables) && action.responsables.length > 0 ? (
                            action.responsables.map((r) => {
                              const name = r.responsable?.nomAffichage || r.responsable?.nomComplet || r.matriculeResponsable || ''
                              const initials = name
                                .split(' ')
                                .map((n) => n?.[0])
                                .filter(Boolean)
                                .slice(0, 2)
                                .join('')
                                .toUpperCase()
                              return (
                                <CAvatar key={r.id} className="ms-2 bg-secondary text-white" size="md">{initials}</CAvatar>
                              )
                            })
                          ) : (
                            <CAvatar className="ms-2 bg-secondary text-white" size="md">-</CAvatar>
                          )}
                        </div>
                      </div>
                    </div>

                  </CCardBody>
                </CCard>
              )
            })
          ) : (
            <div className="text-muted p-3">Aucune action enregistrée</div>
          )}
        </CCardBody>
      </CCard>
      )}
      {/* Vérification efficacité card (similaire à FicheNC) */}
      {(pa.idStatusPA === 3 || (status && (status.id === 3 || status.idStatusPA === 3))) && (
        <CCard className='mb-4'>
          <CCardHeader className="position-relative text-center">
            <span className="h6 mb-0 d-block">VÉRIFICATION EFFICACITÉ</span>
            <div style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)' }}>
              <CButton size="md" onClick={() => setShowVerifyModal(true)}>
                <CIcon icon={cilCheckAlt} className="text-primary" />
              </CButton>
            </div>
          </CCardHeader>
          <CCardBody>
            <div className="d-flex flex-wrap">
              {sampleVerifications.map((v, idx) => (
                <div
                  key={v.id}
                  className="verif-card d-flex flex-column p-3 border rounded"
                  style={{ width: "100%" }}
                >
                  <div style={{ fontWeight: 700, marginBottom: 4 }}>Vérification #{idx + 1}</div>
                  <span className="text-success mb-3">{v.result}</span>
                  <div style={{ padding: 10, borderRadius: 6, minHeight: 70, whiteSpace: 'pre-wrap', background: '#f8f9fa' }}>{v.descr}</div>
                  <div className="d-flex justify-content-start align-items-center mt-3">
                    <div
                      className="file-card d-flex flex-column align-items-center p-2 m-1 border rounded"
                      style={{ width: '140px', position: 'relative', background: '#f8f9fa' }}
                    >
                      <CIcon icon={cilFile} size="xl" />
                      <a
                        href={v.piece.cheminFichier || '#'}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => { e.preventDefault(); window.open(v.piece.cheminFichier || '#', '_blank') }}
                        style={{ marginTop: 6, textDecoration: 'none', color: '#000', fontSize: 12, textAlign: 'center' }}
                      >
                        <small className="text-truncate" style={{ maxWidth: '120px', display: 'block' }}>{v.piece.nomFichier}</small>
                      </a>
                      <CButton
                        color="primary"
                        size="sm"
                        className="mt-2"
                        style={{ fontSize: 12 }}
                        onClick={(e) => { e.stopPropagation(); window.open(v.piece.cheminFichier || '#', '_blank') }}
                      >
                        Télécharger
                      </CButton>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CCardBody>
        </CCard>
      )}
      <ActionPAModal
        visible={showActionModal}
        onClose={() => setShowActionModal(false)}
        pa={pa}
        onSuccess={() => { setShowActionModal(false); refetch && refetch() }}
      />
      <Pop_up
        show={showVerifyToast}
        setShow={setShowVerifyToast}
        type={verifyPopType}
        message={verifyPopMessage}
      />
      <VerifierEfficaciteModal
        visible={showVerifyModal}
        onClose={() => setShowVerifyModal(false)}
        onSubmitSuccess={verifyEfficacitePA}
      />
      <CModal visible={showCloseConfirmPA} onClose={() => setShowCloseConfirmPA(false)} alignment="center">
        <CModalHeader>
          <CModalTitle>Confirmer la clôture</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Voulez-vous vraiment clôturer ce plan d'action ?
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowCloseConfirmPA(false)}>Annuler</CButton>
          <CButton color="primary" onClick={cloturerPA} disabled={closingPA}>
            {closingPA ? <CSpinner size="sm" /> : 'Confirmer'}
          </CButton>
        </CModalFooter>
      </CModal>
  {/* Action button anchored to bottom of page container */}
  <div style={{ position: 'absolute', bottom: 75, left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 1400 }}>
    <div style={{ width: '100%', padding: '0px 5px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {(pa.idStatusPA === 1 || (status && (status.id === 1 || status.idStatusPA === 1))) && (
              <CButton
                color='primary'
                style={{ boxShadow: '0 6px 14px rgba(0,0,0,0.12)', borderRadius: 8 }}
                onClick={() => setShowActionModal(true)}
              >
                <CIcon icon={cilPlus} className="me-2" />
                Ajouter une action
              </CButton>
            )}
            {allActionsComplete && !(pa.idStatusPA === 3 || (status && (status.id === 3 || status.idStatusPA === 3))) && !isClosed && (
              <CButton
                color='primary'
                style={{ boxShadow: '0 6px 14px rgba(0,0,0,0.12)', borderRadius: 8 }}
                onClick={() => setShowVerifyModal(true)}
              >
                <CIcon icon={cilCheckAlt} className="me-2" />
                Vérifier efficacité
              </CButton>
            )}
            {(pa.idStatusPA === 3 || (status && (status.id === 3 || status.idStatusPA === 3))) && allActionsComplete && !isClosed && (
              <CButton
                color='primary'
                style={{ boxShadow: '0 6px 14px rgba(0,0,0,0.12)', borderRadius: 8 }}
                onClick={() => setShowCloseConfirmPA(true)}
              >
                <CIcon icon={cilCheckCircle} className="me-2" />
                Clôturer le plan d'action
              </CButton>
            )}
          </div>
        </div>
      </div>

  {/* Comment input anchored to bottom of page container */}
  <div style={{ position: 'absolute', bottom: 20, left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 1500 }}>
    <div style={{ width: '75%', padding: '0px 8px' }}>
          <CInputGroup
            className="rounded-pill overflow-hidden"
            style={{
              border: '1px solid #c7c5c5ff',
              boxShadow: '0 6px 14px rgba(0,0,0,0.12)',
              background: '#fff',
            }}
          >
            <CFormInput
              placeholder="Ajouter un commentaire..."
              aria-label="Ajouter un commentaire"
              className="border-0"
              style={{ boxShadow: 'none' }}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={async (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  await handleSubmitComment()
                }
              }}
            />
            <CButton
              type="button"
              className="rounded-pill"
              color='primary'
              style={{ boxShadow: '0 6px 14px rgba(0,0,0,0.12)', borderRadius: 20 }}
              onClick={handleSubmitComment}
              disabled={commentLoading || !newComment.trim()}
            >
              {commentLoading ? <CSpinner size="sm" /> : <CIcon icon={cilSend} />}
            </CButton>
          </CInputGroup>
        </div>
      </div>
    </div>
  )
}

export default FichePA
