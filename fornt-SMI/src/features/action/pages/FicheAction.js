import React, { useState } from 'react'
import { CRow, CCol, CButton, CCard, CCardHeader
    , CCardBody, CBadge, CProgress, CAvatar, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CFormInput, CInputGroup, CSpinner
 } from '@coreui/react'
import { useNavigate, useParams } from 'react-router-dom'
import useActionDetails from '../hooks/useActionDetails'
import { createSuivi } from '../services/suiviService'
import CIcon from '@coreui/icons-react'
import { cilArrowLeft, cilHistory, cilSend } from '@coreui/icons'
const FicheAction = () => {
    const navigate = useNavigate()

    // fetch real data from API using hook
    const { id: routeId } = useParams()
    const { data, loading, error, refetch } = useActionDetails(routeId || 14)
    const action = data || null

    // compute most recent suivi for progress
    const suivis = action?.suivis || []
    const lastSuivi = suivis.reduce((latest, s) => {
        if (!latest) return s
        const ds = s.dateSuivi ? new Date(s.dateSuivi) : null
        const dl = latest.dateSuivi ? new Date(latest.dateSuivi) : null
        if (!ds) return latest
        if (!dl) return s
        return ds > dl ? s : latest
    }, null)
    const progress = lastSuivi?.avancement ?? 0

    const formatDate = (d) => (d ? new Date(d).toLocaleDateString() : '-')

    // modal state for adding suivi
    const [showSuiviModal, setShowSuiviModal] = useState(false)
    const [suiviAvancement, setSuiviAvancement] = useState(0)
    // we will use current time for dateSuivi by default
    const [submittingSuivi, setSubmittingSuivi] = useState(false)
    const [suiviError, setSuiviError] = useState(null)
    // comment input state
    const [newComment, setNewComment] = useState('')
    const [commentLoading, setCommentLoading] = useState(false)

    const handleSubmitComment = async () => {
        if (!newComment || !newComment.trim()) return
        setCommentLoading(true)
        try {
            console.log('Submit Action comment (demo):', newComment)
            if (typeof refetch === 'function') await refetch()
            setNewComment('')
        } catch (err) {
            console.error('Error submitting comment', err)
        } finally {
            setCommentLoading(false)
        }
    }

    if (loading) return <div>Chargement...</div>
    if (error) return <div className="text-danger">Erreur: {error.message || String(error)}</div>

    return (
    <div style={{ position: 'relative', minHeight: 'calc(100vh - 80px)', paddingBottom: 140 }}>
        <CRow className='mb-2'>   
            <CCol xs={3} className="d-flex justify-content-start">
                <CButton
                color='secondary'
                className="mb-3"
                                onClick={() => { if (window.history.length > 1) navigate(-1); else navigate('/action') }}
                >
                <CIcon icon={cilArrowLeft} className="me-2" />
                Retour
                </CButton>
            </CCol>
            <CCol xs={6}> 
            <h3 className="text-center">Détails de l'action</h3>
            </CCol> 
            <CCol xs={3} className="d-flex justify-content-end">
                <CButton
                color='secondary'
                className="mb-3"
                >
                <CIcon icon={cilHistory} className="me-2" />
                Histo-activité
                </CButton>
            </CCol>    
        </CRow>
            <CCard className='mb-3'>
                <CCardHeader className="text-center">
                        <span className="h6">IDENTITÉ DE L'ACTION</span>
                </CCardHeader>
                <CCardBody>
                    <CRow>
                        <CCol md={6} className="mb-3">
                                <span className='h6'>Titre : </span>
                                <a>{action?.titre}</a>
                        </CCol>
                        <CCol md={12} className="mb-3">
                                <span className="h6">Description :</span>
                                <div style={{ background: '#f8f9fa', padding: '12px', borderRadius: 8, whiteSpace: 'pre-wrap' }}>{action?.descr}</div>
                        </CCol>
                        <CCol md={12} className="mb-3">
                                <h6 className="mb-2">Responsable :</h6>
                                {action?.responsables && action.responsables.length > 0 ? (
                                    <CRow>
                                        {action.responsables.map((r) => (
                                            <CCol key={r.id} md={6} className="mb-2">
                                                <div className="d-flex align-items-center">
                                                    <CAvatar size='md' className="me-3 bg-secondary text-white">{(r.responsable?.nomAffichage || r.responsable?.nomComplet || '').split(' ').map(n => n?.[0]).slice(0,2).join('').toUpperCase()}</CAvatar>
                                                    <div>
                                                        <div style={{ fontWeight: 700 }}>{r.responsable?.nomAffichage || r.responsable?.nomComplet}</div>
                                                        <div className="text-muted">{r.responsable?.poste || r.responsable?.departement || ''}</div>
                                                    </div>
                                                </div>
                                            </CCol>
                                        ))}
                                    </CRow>
                                ) : (
                                    <p>-</p>
                                )}
                        </CCol>
                        <CCol md={12} className="mb-3">
                            <h6 className="mb-2">Statut :</h6>
                            <p><CBadge color={action?.statusAction?.color}>{action?.statusAction?.nom}</CBadge></p>
                        </CCol>
                        <CCol md={12} className="mb-3">
                            <h6 className="mb-2">Progression :</h6>
                            <div style={{ cursor: action?.id ? 'pointer' : 'default' }} onClick={() => action?.id && setShowSuiviModal(true)}>
                                <CProgress value={progress}  variant="striped" animated>{progress}%</CProgress>
                            </div>
                            <div className="d-flex justify-content-between mt-2">
                                <small className="text-muted">{formatDate(action?.dateDebut)}</small>
                                <small className="text-muted">{formatDate(action?.dateFinPrevue)}</small>
                            </div>
                        </CCol>
                        <CCol md={12} className="mb-3">
                            <h6 className="mb-2">Sources / Liens :</h6>
                            {action?.sources && action.sources.length > 0 ? (
                                action.sources.map((s) => (
                                    <div key={s.id} className="d-flex align-items-center mb-1">
                                        <div>
                                            <a>{s.entite?.nom || 'Source'}</a>
                                            <span className="text-muted"> # {s.idObjet}</span>
                                            {/* <span className="text-muted"> (id: {s.id})</span> */}
                                        </div>
                                        {/* 'Voir' link placed next to the source text (small left margin) */}
                                        <CButton size="sm" color="secondary" className="ms-2" onClick={() => { window.location = `#/source/${s.id}` }}>Voir</CButton>
                                    </div>
                                ))
                            ) : (
                                <div>-</div>
                            )}
                        </CCol>
                        <CCol md={12} className="mb-3">
                            <h6 className="mb-2">Historique des suivis :</h6>
                            {action?.suivis && action.suivis.length > 0 ? (
                                action.suivis.map((s) => (
                                    <div key={s.id} className="mb-2"> . {new Date(s.dateSuivi).toLocaleString()} — Avancement: {s.avancement}%</div>
                                ))
                            ) : (
                                <div>Aucun suivi</div>
                            )}
                        </CCol>
                    </CRow>
                </CCardBody>
            </CCard>
                  
            <CModal visible={showSuiviModal} onClose={() => { if (!submittingSuivi) setShowSuiviModal(false); setSuiviError(null) }} alignment="center">
                <CModalHeader>
                    <CModalTitle>Ajouter un suivi</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    {suiviError && <div className="text-danger mb-2">{suiviError}</div>}
                    <div className="mb-3">
                        <label className="form-label">Avancement (%)</label>
                        <CFormInput type="number" min={0} max={100} value={suiviAvancement} onChange={(e) => setSuiviAvancement(e.target.value)} />
                    </div>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" disabled={submittingSuivi} onClick={() => setShowSuiviModal(false)}>Annuler</CButton>
                    <CButton color="primary" disabled={submittingSuivi} onClick={async () => {
                        // submit
                        setSubmittingSuivi(true)
                        setSuiviError(null)
                        try {
                            const dateIso = new Date().toISOString()
                            const av = Number(suiviAvancement)
                            if (Number.isNaN(av) || av < 0 || av > 100) throw new Error('Avancement doit être entre 0 et 100')
                            const payload = { idAction: action.id, dateSuivi: dateIso, avancement: av }
                            console.log("playload suivi :" + JSON.stringify(payload))
                            await createSuivi(payload)
                            setShowSuiviModal(false)
                            // reset
                            setSuiviAvancement(0)
                            
                            // refresh action
                            if (typeof refetch === 'function') await refetch()
                        } catch (err) {
                            console.error('createSuivi error', err)
                            setSuiviError(err.message || 'Erreur lors de la création du suivi')
                        } finally {
                            setSubmittingSuivi(false)
                        }
                    }}>Enregistrer</CButton>
                </CModalFooter>
            </CModal>

            {/* Comment input anchored to bottom of fiche page */}
            <div style={{ position: 'absolute', bottom: 20, left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 1500 }}>
                <div className="fixed-page-inner" style={{ width: '75%', padding: '0px 8px' }}>
                    <CInputGroup className="rounded-pill overflow-hidden" style={{ border: '1px solid #c7c5c5ff', boxShadow: '0 6px 14px rgba(0,0,0,0.12)', background: '#fff' }}>
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
                        <CButton type="button" className="rounded-pill" color='primary' style={{ boxShadow: '0 6px 14px rgba(0,0,0,0.12)', borderRadius: 20 }} onClick={handleSubmitComment} disabled={commentLoading || !newComment.trim()}>
                            {commentLoading ? <CSpinner size="sm" /> : <CIcon icon={cilSend} />}
                        </CButton>
                    </CInputGroup>
                </div>
            </div>
    </div>
  )
}

export default FicheAction
