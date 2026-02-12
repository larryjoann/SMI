import React, { useState, useEffect } from 'react'
import {
  CRow, CCol,
  CCard, CCardBody, CCardHeader, 
  CForm, CFormInput,
  CButton , CFormFeedback ,CAlert, CBadge,
  CAvatar,
  CInputGroup,
  CProgress,
  CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem, CDropdownDivider
} from '@coreui/react'
import { CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CLink, CPopover, CTooltip } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilArrowLeft , 
  cilHistory, 
  cilStar, 
  cilSend,
  cilPen,
  cilMagnifyingGlass,
  cilFile,
  cilOptions,
  cilX,
  cilPlus,
  cilTask,
  cilCheckAlt,
  cilCheckCircle
} from '@coreui/icons'
import { useParams, useNavigate } from 'react-router-dom'
import API_URL from '../../../api/API_URL'
import axiosInstance, { getMatriculeFromJwt } from '../../../api/axiosInstance'
import { Pop_up } from '../../../components/notification/Pop_up'
import { useNCDetails } from '../hooks/useNCDetails'
import QualificationModal from '../components/QualificationModal'
import AnalyseCausesModal from '../components/AnalyseCausesModal'
import ActionCurativeModal from '../components/ActionCurativeModal'
import VerifierEfficaciteModal from '../components/VerifierEfficaciteModal'
import { createCommentaire } from '../services/nonConformiteService'
import { CSpinner } from '@coreui/react'

const FicheNC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showQualifModal, setShowQualifModal] = useState(false)
  const [showAnalyseModal, setShowAnalyseModal] = useState(false)
  const [showActionModal, setShowActionModal] = useState(false)
  const [showVerifyModal, setShowVerifyModal] = useState(false)
  const [currentMatricule, setCurrentMatricule] = useState(null)
  const [showCloseConfirm, setShowCloseConfirm] = useState(false)
  const [closingNc, setClosingNc] = useState(false)
  const [selectedProcessus, setSelectedProcessus] = useState([])
  const [selectedCategorieCause, setSelectedCategorieCause] = useState([])
  const [hoveredFileIndex, setHoveredFileIndex] = useState(null)
  const [downloadingIndex, setDownloadingIndex] = useState(null)
  const [showDownloadToast, setShowDownloadToast] = useState(false)
  const [downloadPopType, setDownloadPopType] = useState('success')
  const [downloadPopMessage, setDownloadPopMessage] = useState('')

  const downloadAttachment = async (pj, idx) => {
    setDownloadingIndex(idx)
    try {
      // Prefer calling backend download endpoint when an id is available
      const apiBase = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL
      // Possible id fields: id, idPieceJointe, idPJ
      const pjId = pj.id || pj.idPieceJointe || pj.idPJ || pj.idPiece
      let res
      if (pjId) {
        const downloadUrl = `${apiBase}/PieceJointeNc/download/${pjId}`
        res = await axiosInstance.get(downloadUrl, { responseType: 'blob' })
      } else {
        let fileUrl = pj.cheminFichier || pj.chemin || pj.url || ''
        if (!fileUrl) return
        // convert relative paths to absolute using API_URL
        if (!/^https?:\/\//i.test(fileUrl) && !fileUrl.startsWith('//')) {
          fileUrl = fileUrl.startsWith('/') ? `${apiBase}${fileUrl}` : `${apiBase}/${fileUrl}`
        }
        res = await axiosInstance.get(fileUrl, { responseType: 'blob' })
      }
      if (!res || (res.status && res.status >= 400)) throw new Error(`Erreur téléchargement (${res?.status || '??'})`)
      const blob = res.data
      // try to derive filename from content-disposition header
      let filename = pj.nomFichier || 'download'
      const cd = res.headers && (res.headers['content-disposition'] || res.headers['Content-Disposition'])
      if (cd) {
        const m = cd.match(/filename\*=UTF-8''([^;\n]+)/i) || cd.match(/filename="?([^";\n]+)"?/i)
        if (m && m[1]) {
          try { filename = decodeURIComponent(m[1]) } catch { filename = m[1] }
        }
      }
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
      setDownloadPopType('success')
      setDownloadPopMessage(`Téléchargement de "${filename}" démarré`)
      setShowDownloadToast(true)
    } catch (err) {
      console.error('Download failed', err)
      // Show an error popup instead of creating/downloading an empty file
      const msg = err?.message || 'Erreur lors du téléchargement'
      setDownloadPopType('danger')
      setDownloadPopMessage(msg)
      setShowDownloadToast(true)
    }
    finally {
      setDownloadingIndex(null)
    }
  }
  // Récupère le collaborateur connecté pour vérifier le matricule
  useEffect(() => {
    let mounted = true
    // Try to get matricule from JWT in session first to avoid extra network call
    try {
      const matFromJwt = getMatriculeFromJwt()
      if (matFromJwt) {
        if (mounted) setCurrentMatricule(matFromJwt)
        return () => { mounted = false }
      }
    } catch (e) {
      // ignore and fallback to API
    }

    const fetchCollaborateur = async () => {
      try {
        const res = await axiosInstance.get('/Collaborateur/collaborateur_connecte')
        if (!mounted) return
        const mat = res?.data?.matricule || res?.data?.matriculeCollaborateur || res?.data?.matricule || null
        setCurrentMatricule(mat)
      } catch (err) {
        console.warn('Impossible de récupérer le collaborateur connecté', err)
        if (mounted) setCurrentMatricule(null)
      }
    }
    fetchCollaborateur()
    return () => { mounted = false }
  }, [])
  const { data, loading, error, refetch } = useNCDetails(id);
  const [newComment, setNewComment] = useState('')
  const [commentLoading, setCommentLoading] = useState(false)
  const [commentError, setCommentError] = useState(null)
  const [commentSuccess, setCommentSuccess] = useState(false)

  // Handlers for action card options (accept action as parameter)
  const handleEditAction = (action) => {
    // Navigate to the action edit form
    if (!action || !action.id) return
    navigate(`/action/form/${action.id}`)
  }

  const handleDeleteAction = async (action) => {
    console.log('Delete corrective action', action)
    // find the source record that links this action to the NC (identite/idEntite = 2)
    const src = Array.isArray(action.sources) ? action.sources.find(s => (s.idEntite === 2) && (s.idObjet === nc?.id)) : null
    const idToDelete = src.id 
    if (!idToDelete) {
      console.log('No id available to delete for action', action)
      return
    }
    console.log('Attempting delete - id:', idToDelete, 'for action', action.id, 'nc', nc.id)
    try {
      const deleteUrl = `${API_URL}/SourceAction/${idToDelete}`
      const res = await axiosInstance.delete(deleteUrl)
      if (!res || (res.status && res.status >= 400)) {
        const body = (res && res.data) ? JSON.stringify(res.data) : ''
        console.error('Delete failed', res.status, body)
        // minimal feedback for now
        window.alert(`Suppression échouée (${res.status})`)
        return
      }
      console.log('Delete succeeded for id', idToDelete)
      // refresh details to reflect deletion
      if (typeof refetch === 'function') await refetch()
    } catch (err) {
      console.error('Delete error', err)
      window.alert('Erreur lors de la suppression')
    }
  }

  const handleSubmitComment = async () => {
    if (!newComment || !newComment.trim()) return
    setCommentLoading(true)
    setCommentError(null)
    try {
      const payload = {
        idNc: nc.id,
        contenu: newComment,
        dateTimeCommentaire: new Date().toISOString(),
        matriculeCollaborateur: "ST152",
        // matriculeCollaborateur is set by server from session; include only if your API expects client-sent matricule
      }
      await createCommentaire(payload)
      if (typeof refetch === 'function') await refetch()
      setNewComment('')
      //setCommentSuccess(true)
      setTimeout(() => setCommentSuccess(false), 3000)
    } catch (err) {
      console.error('createCommentaire error', err)
      let msg = 'Erreur lors de l\'envoi du commentaire'
      if (err && typeof err === 'object') {
        if (err.body) {
          if (typeof err.body === 'string') msg = err.body
          else if (err.body.message) msg = err.body.message
          else msg = JSON.stringify(err.body)
        } else if (err.status) {
          msg = `Erreur serveur (${err.status})`
        }
      }
      //setCommentError(msg)
    } finally {
      setCommentLoading(false)
    }
  }

  // Verify efficacy: call backend to set NC status to 'verified'
  const verifyEfficacite = async (payload) => {
    // payload may contain modal form data; the controller needs only the NC id
    if (!nc || !nc.id) {
      setDownloadPopType('danger')
      setDownloadPopMessage('Identifiant de non-conformité manquant')
      setShowDownloadToast(true)
      return
    }
    try {
      const url = `${API_URL}/NonConformite/verifier?id=${encodeURIComponent(nc.id)}`
      await axiosInstance.post(url)
      setShowVerifyModal(false)
      setDownloadPopType('success')
      setDownloadPopMessage('Vérification enregistrée')
      setShowDownloadToast(true)
      if (typeof refetch === 'function') await refetch()
    } catch (err) {
      console.error('verifyEfficacite error', err)
      setDownloadPopType('danger')
      setDownloadPopMessage(err?.message || 'Erreur lors de la vérification')
      setShowDownloadToast(true)
    }
  }

  // Close (clôturer) NC: call backend to set NC status to 'clotured' (idStatusNc = 9)
  const cloturerNc = async () => {
    if (!nc || !nc.id) {
      setDownloadPopType('danger')
      setDownloadPopMessage('Identifiant de non-conformité manquant')
      setShowDownloadToast(true)
      return
    }
    try {
      const url = `${API_URL}/NonConformite/cloture?id=${encodeURIComponent(nc.id)}`
      await axiosInstance.post(url)
      setDownloadPopType('success')
      setDownloadPopMessage('Non-conformité clôturée')
      setShowDownloadToast(true)
      if (typeof refetch === 'function') await refetch()
    } catch (err) {
      console.error('cloturerNc error', err)
      setDownloadPopType('danger')
      setDownloadPopMessage(err?.message || 'Erreur lors de la clôture')
      setShowDownloadToast(true)
    }
  }

  const handleConfirmClose = async () => {
    // Close the confirmation modal immediately and run the close action
    setShowCloseConfirm(false)
    setClosingNc(true)
    try {
      await cloturerNc()
    } catch (err) {
      // cloturerNc already handles errors and toasts
      console.error('handleConfirmClose error', err)
    } finally {
      setClosingNc(false)
    }
  }

  if (loading) return <CAlert color="info" className="text-center rounded-pill">Chargement...</CAlert>;
  if (error) return <CAlert color="danger" className="text-center rounded-pill">{error}</CAlert>;
  if (!data) return null;

  const { nc, piecesJointes, processusConcerne , causes, commentaires, actions } = data;
  // Determine whether all corrective actions have 100% progress (latest suivi.avancement === 100)
  const allActionsComplete = Array.isArray(actions) && actions.length > 0 && actions.every((action) => {
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
  // Causes may come from top-level `data.causes` or inside `nc.causes` depending on API

  // Static sample verifications for UI (description + attachment)
  const sampleVerifications = [
    {
      id: 'sv1',
      result : 'éfficace',
      descr: 'Vérification initiale réalisée: contrôles documentaires et relevés conforme.',
      piece: { nomFichier: 'Non(1).odt', cheminFichier: '#' },
    },
  ];

  const dateFait = nc?.dateTimeFait ? new Date(nc.dateTimeFait) : null;
  const dateStr = dateFait ? dateFait.toLocaleDateString() : '';
  const heureStr = dateFait ? dateFait.toLocaleTimeString() : '';

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
            onClick={() => { if (window.history.length > 1) navigate(-1); else navigate('/nc/list') }}
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
            onClick={() => navigate(`/nc/list/fiche/histoactivite/${nc?.id || id}`)}
            >
            <CIcon icon={cilHistory} className="me-2" />
            Histo-activité
            </CButton>
        </CCol>    
      </CRow>
      <Pop_up
        show={showDownloadToast}
        setShow={setShowDownloadToast}
        type={downloadPopType}
        message={downloadPopMessage}
      />

      {/* Wrapper to scope the sticky comment input to this page (not full screen) */}
      <div className="fiche-nc-wrapper" style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}>
        {/* Status moved into identification card below */}
        <CCard >
          <CCardBody>
        <CForm >
        <CRow>
          <CCol xs={12} sm={12} md={6}>
            <CCard className='mb-3'>
              <CCardHeader className="text-center">
                <span className="h6">IDENTIFICATION DE LA NON-CONFORMITE</span>
              </CCardHeader>
              <CCardBody>
                <CRow>
                  <CCol xs={12} sm={12} md={12} className='mb-3'>
                    <span className='h6' >Type :</span>
                    <a> {nc.typeNc?.nom || ''}</a>
                  </CCol>
                  <CCol xs={12} sm={12} md={12} className='mb-3'>
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
                <CRow>
                  <CCol xs={12} sm={6} md={6} className='mb-3'>
                    <span className='h6'>Statut :</span>
                    {' '}
                    {nc?.statusNc ? (
                      <CBadge color={nc.statusNc.color || 'secondary'} className="ms-2">{nc.statusNc.nom}</CBadge>
                    ) : (
                      <a className='ms-2'>-</a>
                    )}
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol xs={12} sm={12} md={6}>
            <CCard className='mb-3'>
              <CCardHeader className="text-center">
                <span className="h6">EMETTEUR</span>
              </CCardHeader>
              <CCardBody>
                {nc?.emetteur ? (
                  <CRow className="align-items-center">
                    <CCol xs={12} sm={6} md={12} className="d-flex align-items-center mb-3">
                      <CAvatar className="me-3 bg-secondary text-white" size="md">
                        {(() => {
                          const name = nc.emetteur.nomAffichage || nc.emetteur.nomComplet || nc.emetteur.matricule || ''
                          return name.split(' ').map(n => n?.[0]).filter(Boolean).slice(0,2).join('').toUpperCase()
                        })()}
                      </CAvatar>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 16 }}>{nc.emetteur.nomAffichage || nc.emetteur.nomComplet}</div>
                        <span className='text-muted'> {nc.emetteur.poste} </span>
                      </div>
                    </CCol>
                    <CCol xs={12} sm={6} md={12} className='mb-3'>
                      <CRow>
                        {/* <CCol xs={12} sm={12} md={12} className="mb-2">
                          <span className='h6'>Matricule : </span>
                          <a > {nc.emetteur.matricule || '-'}</a>
                        </CCol>
                        <CCol xs={12} sm={12} md={12} className="mb-2">
                          <span className='h6'>Département : </span>
                          <a>{nc.emetteur.departement || '-'}</a>
                        </CCol> */}
                        <CCol xs={12} sm={12} md={12} className="mb-3">
                          <span className='h6'>Email : </span>
                          {nc.emetteur.courriel ? (
                            <a href={`mailto:${nc.emetteur.courriel}`} style={{ fontWeight: 600 }}>{nc.emetteur.courriel}</a>
                          ) : (
                            <a>-</a>
                          )}
                        </CCol>
                        <CCol xs={12} sm={12} md={12} className="mb-3">
                          <span className='h6'>Téléphone : </span>
                          {nc.emetteur.telephone ? (
                            <a href={`tel:${nc.emetteur.telephone}`} style={{ fontWeight: 600 }}>{nc.emetteur.telephone}</a>
                          ) : (
                            <a>-</a>
                          )}
                        </CCol>
                      </CRow>
                    </CCol>
                  </CRow>
                ) : (
                  <div className="text-muted">Aucun émetteur renseigné</div>
                )}
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>

        <CCard className='mb-3'>
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
                <div style={{ background: '#f8f9fa', padding: '12px', borderRadius: 8, whiteSpace: 'pre-wrap' }}
                  dangerouslySetInnerHTML={{ __html: nc.descr || '' }}
                />
              </CCol>
              <CCol xs={12} sm={12} md={12} className='mb-3'>
                <span className='h6'>Pièces jointes :</span>
                {piecesJointes && piecesJointes.length > 0 ? (
                  <div className="d-flex flex-wrap mt-2">
                    {piecesJointes.map((pj, idx) => (
                      <div
                        key={idx}
                        className="file-card d-flex flex-column align-items-center p-2 m-1 border rounded"
                        style={{ width: '140px', position: 'relative', background: '#f8f9fa' }}
                        onMouseEnter={() => setHoveredFileIndex(idx)}
                        onMouseLeave={() => setHoveredFileIndex(null)}
                      >
                        <CIcon icon={cilFile} size="xl" />
                        <a
                          href={pj.cheminFichier || pj.chemin || '#'}
                          target="_blank"
                          rel="noreferrer"
                          style={{ marginTop: 6, textDecoration: 'none', color: '#000', fontSize: 12, textAlign: 'center' }}
                        >
                          <small className="text-truncate" style={{ maxWidth: '120px', display: 'block' }}>{pj.nomFichier}</small>
                        </a>
                            <CButton
                              color="primary"
                              size="sm"
                              className="mt-2"
                              style={{ fontSize: 12 }}
                              onClick={(e) => {
                                e.stopPropagation()
                                downloadAttachment(pj, idx)
                              }}
                            >
                              {downloadingIndex === idx ? <CSpinner size="sm" /> : 'Télécharger'}
                            </CButton>
                      </div>
                    ))}
                  </div>
                ) : (
                  <a> Aucune</a>
                )}
              </CCol>
              <CCol xs={12} sm={12} md={12} className='mb-3'>
                <span className='h6'>Action curative :</span>
                <div style={{ background: '#f8f9fa', padding: '12px', borderRadius: 8, whiteSpace: 'pre-wrap' }}>
                  {nc.actionCurative || ''}
                </div>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
        {nc.idStatusNc != null && nc.statusNc?.idPhaseNc >= 2&&(
        <CCard className='mb-3 '>
          <CCardHeader className="position-relative text-center">
                <span className="h6 mb-0 d-block">ANALYSE DES CAUSES </span>
                <div style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)' }}>
                  {(
                    <CButton
                      size="md"
                      onClick={() => {
                        const init = (causes || []).map(c => ({ value: c.idCategorieCauseNc, label: c.categorieCauseNc?.nom }))
                        setSelectedCategorieCause(init)
                        setShowAnalyseModal(true)
                      }}
                    >
                      <CIcon icon={cilPen} className="text-dark" />
                    </CButton>
                  )}
                </div>
              </CCardHeader>
          <CCardBody>
              <CRow>
                <CCol xs={12} sm={12} md={12} className='mb-3'>
                  {Array.isArray(causes) && causes.length > 0 ? (
                    <div>
                      {causes.map((c) => (
                        <div key={c.id} className="mb-2">     
                            <span className='h6'>{c.categorieCauseNc.nom} : </span>                      
                          <div style={{ background: '#f8f9fa', padding: '12px', borderRadius: 8, whiteSpace: 'pre-wrap' }} >{c.descr}</div>
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
      )}
        {Array.isArray(actions) && actions.length > 0 && (
        <CCard className='mb-4'>
          <CCardHeader className="position-relative text-center">
            <span className="h6 mb-0 d-block">ACTION CORRECTIVES</span>
                <div style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)' }}>
                  {(
                    <CButton
                      size="md"
                      onClick={() => {
                        // open action curative modal
                        setShowActionModal(true)
                      }}
                    >
                      <CIcon icon={cilPlus} className="text-primary" />
                    </CButton>
                  )}
                </div>
          </CCardHeader>
          <CCardBody>
            {actions.map((action) => {
                // pick the suivi with the most recent dateSuivi (not simply the last array item)
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
                const statusLabel = action.statusAction.nom
                const statusColor = action.statusAction.color
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
              })}
          </CCardBody>
        </CCard>
        )}

       {nc.idStatusNc != null && nc.statusNc?.idPhaseNc === 3&&(
        <CCard className='mb-4'>
          <CCardHeader className="position-relative text-center">
            <span className="h6 mb-0 d-block">VÉRIFICATION EFFICACITÉ</span>
            <div style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)' }}>
              {(
                <CButton size="md" onClick={() => setShowVerifyModal(true)}>
                  <CIcon icon={cilCheckAlt} className="text-primary" />
                </CButton>
              )}
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
                      onMouseEnter={() => setHoveredFileIndex(idx)}
                      onMouseLeave={() => setHoveredFileIndex(null)}
                    >
                      <CIcon icon={cilFile} size="xl" />
                      <a
                        href={v.piece.cheminFichier || '#'}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          const pj = { nomFichier: v.piece.nomFichier, cheminFichier: v.piece.cheminFichier }
                          downloadAttachment(pj, idx)
                        }}
                        style={{ marginTop: 6, textDecoration: 'none', color: '#000', fontSize: 12, textAlign: 'center' }}
                      >
                        <small className="text-truncate" style={{ maxWidth: '120px', display: 'block' }}>{v.piece.nomFichier}</small>
                      </a>
                      <CButton
                        color="primary"
                        size="sm"
                        className="mt-2"
                        style={{ fontSize: 12 }}
                        onClick={(e) => {
                          e.stopPropagation()
                          const pj = { nomFichier: v.piece.nomFichier, cheminFichier: v.piece.cheminFichier }
                          downloadAttachment(pj, idx)
                        }}
                      >
                        {downloadingIndex === idx ? <CSpinner size="sm" /> : 'Télécharger'}
                      </CButton>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CCardBody>
        </CCard>
       )}
        {Array.isArray(commentaires) && commentaires.length > 0 && (
          <CCard className='mb-4'>
            <CCardHeader className="text-center">
              <span className="h6">COMMENTAIRES</span>
            </CCardHeader>
            <CCardBody>
              <div>
                {commentaires.map((c) => {
                  const name = c.collaborateur?.nomAffichage || c.matriculeCollaborateur || 'Utilisateur';
                  const initials = name
                    .split(' ')
                    .map((n) => n?.[0])
                    .filter(Boolean)
                    .slice(0, 2)
                    .join('')
                    .toUpperCase();
                  return (
                    <div key={c.id} className="d-flex mb-3">
                      <CAvatar className="me-3 bg-secondary text-white" size="md">{initials}</CAvatar>
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <div style={{ fontWeight: 700 }}>{name}</div>
                            <div className="text-muted" style={{ fontSize: '0.85rem' }}>{c.collaborateur?.poste || ''}</div>
                          </div>
                          <div className="text-muted" style={{ fontSize: '0.85rem' }}>{c.dateTimeCommentaire ? new Date(c.dateTimeCommentaire).toLocaleString() : ''}</div>
                        </div>
                        <div className="mt-2">
                          <div style={{ background: '#f8f9fa', padding: '12px', borderRadius: 8, whiteSpace: 'pre-wrap' }}>{c.contenu}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CCardBody>
          </CCard>
        )}
      </CForm>
          </CCardBody>
      </CCard>
      {/* Sticky action buttons bar placed slightly above the comment input (keeps existing logic) */}
      <div style={{ marginTop: 'auto', position: 'sticky', bottom: 3, display: 'flex', justifyContent: 'center', zIndex: 1030, background: '#fff' }}>
        <div style={{ width: '100%', padding: '0px', display: 'flex', justifyContent: 'center' }}>
            <div style={{ display: 'flex', gap: 8 }}>
            {nc.idStatusNc != null && nc.statusNc?.idPhaseNc === 1 && (nc.statusNc.id === 1 || nc.statusNc.id === 2) && (
              <CButton
                color='primary'
                style={{ boxShadow: '0 6px 14px rgba(0,0,0,0.12)'}}
                onClick={() => {
                  const init = (processusConcerne || []).map(p => ({ value: p.processus?.id, label: p.processus?.nom }))
                  setSelectedProcessus(init)
                  setShowQualifModal(true)
                }}
              >
                <CIcon icon={cilStar} className="me-2" />
                Qualifier la non-conformité
              </CButton>
            )}

            {nc.idStatusNc != null && nc.statusNc?.idPhaseNc === 1 && nc.statusNc.id === 3 && (
              <CButton
                color='primary'
                style={{ boxShadow: '0 6px 14px rgba(0,0,0,0.12)' }}
                onClick={() => {
                  const init = (causes || []).map(c => ({ value: c.categorieCauseNc.id, label: c.categorieCauseNc?.nom }))
                  setSelectedCategorieCause(init)
                  setShowAnalyseModal(true)
                }}
              >
                <CIcon icon={cilMagnifyingGlass} className="me-2" />
                Analyser les causes
              </CButton>
            )}

            {nc.idStatusNc != null && nc.statusNc?.idPhaseNc === 2 && (nc.statusNc.id === 5) && (
              <CButton
                color='primary'
                style={{ boxShadow: '0 6px 14px rgba(0,0,0,0.12)'}}
                onClick={() => setShowActionModal(true)}
              >
                <CIcon icon={cilTask} className="me-2" />
                Assigner action corrective
              </CButton>
            )}

            {nc.idStatusNc != null && nc.statusNc?.idPhaseNc === 2 && (nc.statusNc.id === 6) && allActionsComplete && (
              <CButton
                color='primary'
                style={{ boxShadow: '0 6px 14px rgba(0,0,0,0.12)' }}
                onClick={() => setShowVerifyModal(true)}
              >
                <CIcon icon={cilCheckAlt} className="me-2" />
                Vérifier l'efficacité
              </CButton>
            )}

            {nc.idStatusNc != null && nc.statusNc?.idPhaseNc === 3 && (nc.statusNc.id === 8) && allActionsComplete && (
              <CButton
                color='primary'
                style={{ boxShadow: '0 6px 14px rgba(0,0,0,0.12)' }}
                onClick={() => setShowCloseConfirm(true)}
              >
                <CIcon icon={cilCheckCircle} className="me-2" />
                Cloturer la non-conformité
              </CButton>
            )}
          </div>
        </div>
      </div>
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
      <ActionCurativeModal
        visible={showActionModal}
        onClose={() => setShowActionModal(false)}
        nc={nc}
        onSuccess={(action) => {
          // When an action is created, refresh details to show it
          if (typeof refetch === 'function') refetch()
          setShowActionModal(false)
        }}
      />
      <VerifierEfficaciteModal
        visible={showVerifyModal}
        onClose={() => setShowVerifyModal(false)}
        onSubmitSuccess={verifyEfficacite}
      />
      <CModal visible={showCloseConfirm} onClose={() => setShowCloseConfirm(false)} alignment="center">
        <CModalHeader>
          <CModalTitle>Confirmer la clôture</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Voulez-vous vraiment clôturer cette non-conformité ?
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowCloseConfirm(false)}>Annuler</CButton>
          <CButton color="primary" onClick={handleConfirmClose} disabled={closingNc}>
            {closingNc ? <CSpinner size="sm" /> : 'Confirmer'}
          </CButton>
        </CModalFooter>
      </CModal>
      {commentError && <CAlert color="danger" className="py-1">{commentError}</CAlert>}
      {commentSuccess && <CAlert color="success" className="py-1">Commentaire ajouté</CAlert>}

      {/* Sticky input scoped to fiche page (not full-screen) */}
      <div style={{ marginTop: 'auto', position: 'sticky', bottom: 3, display: 'flex', justifyContent: 'center', zIndex: 1030 }}>
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
    </>
  )
}

export default FicheNC
