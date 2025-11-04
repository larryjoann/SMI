import React, { useState } from 'react'
import { CRow, CCol, CButton, CCard, CCardHeader
    , CCardBody, CBadge, CProgress, CAvatar, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CFormInput
 } from '@coreui/react'
import { useNavigate, useParams } from 'react-router-dom'
import useActionDetails from '../hooks/useActionDetails'
import { createSuivi } from '../services/suiviService'
import CIcon from '@coreui/icons-react'
import { cilArrowLeft, cilHistory } from '@coreui/icons'
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

    if (loading) return <div>Chargement...</div>
    if (error) return <div className="text-danger">Erreur: {error.message || String(error)}</div>

    return (
    <>
        <CRow className='mb-2'>   
            <CCol xs={3} className="d-flex justify-content-start">
                <CButton
                color='secondary'
                className="mb-3"
                                onClick={() => navigate('/action')}
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
                                <h6 className="mb-2">Titre de l'action :</h6>
                                <p>{action?.titre}</p>
                        </CCol>
                        <CCol md={12} className="mb-3">
                                <h6 className="mb-2">Description :</h6>
                                <p>{action?.descr}</p>
                        </CCol>
                        <CCol md={6} className="mb-3">
                                <h6 className="mb-2">Responsable :</h6>
                                {action?.responsables && action.responsables.length > 0 ? (
                                    action.responsables.map((r) => (
                                        <div key={r.id} className="d-flex align-items-center">
                                            <CAvatar size='md' className="me-3 bg-secondary text-white">{(r.responsable?.nomAffichage || r.responsable?.nomComplet || '').split(' ').map(n => n?.[0]).slice(0,2).join('').toUpperCase()}</CAvatar>
                                            <div>
                                                <div style={{ fontWeight: 700 }}>{r.responsable?.nomAffichage || r.responsable?.nomComplet}</div>
                                                <div className="text-muted">{r.responsable?.poste || r.responsable?.departement || ''}</div>
                                                <div style={{ fontSize: 13 }}>{r.responsable?.courriel}</div>
                                                <div style={{ fontSize: 13 }}>{r.responsable?.telephone}</div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>-</p>
                                )}
                        </CCol>
                        <CCol md={6} className="mb-3">
                            <h6 className="mb-2">Statut :</h6>
                            <p><CBadge color={action?.statusAction?.color}>{action?.statusAction?.nom}</CBadge></p>
                        </CCol>
                        <CCol md={6} className="mb-3">
                            <h6 className="mb-2">Date de début :</h6>
                            <p>{formatDate(action?.dateDebut)}</p>
                        </CCol>
                        <CCol md={6} className="mb-3">
                            <h6 className="mb-2">Date de fin prévue :</h6>
                            <p>{formatDate(action?.dateFinPrevue)}</p>
                        </CCol>
                        <CCol md={12} className="mb-3">
                            <h6 className="mb-2">Progression :</h6>
                            <div style={{ cursor: action?.id ? 'pointer' : 'default' }} onClick={() => action?.id && setShowSuiviModal(true)}>
                                <CProgress value={progress}  variant="striped" animated>{progress}%</CProgress>
                            </div>
                        </CCol>
                        <CCol md={12} className="mb-3">
                            <h6 className="mb-2">Sources / Liens :</h6>
                            {action?.sources && action.sources.length > 0 ? (
                                action.sources.map((s) => (
                                    <div key={s.id}>Type: {s.entite?.nom} — Objet: {s.idObjet} (source id: {s.id})</div>
                                ))
                            ) : (
                                <div>-</div>
                            )}
                        </CCol>
                        <CCol md={12} className="mb-3">
                            <h6 className="mb-2">Historique des suivis :</h6>
                            {action?.suivis && action.suivis.length > 0 ? (
                                action.suivis.map((s) => (
                                    <div key={s.id} className="mb-2">{new Date(s.dateSuivi).toLocaleString()} — Avancement: {s.avancement}%</div>
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
    </>
  )
}

export default FicheAction
