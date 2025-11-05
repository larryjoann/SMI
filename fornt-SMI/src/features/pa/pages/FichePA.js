import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  CRow, CCol, CButton,
  CCard, CCardHeader, CCardBody, CBadge, CAvatar,
  CProgress, CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem, CDropdownDivider, CSpinner
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilArrowLeft, cilOptions, cilX, cilPen, cilPlus, cilTask } from '@coreui/icons'
import API_URL from '../../../api/API_URL'
import { usePADetails } from '../hooks/usePADetails'
import ActionPAModal from '../components/ActionPAModal'

const FichePA = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data, loading, error, refetch } = usePADetails(id)
  const [showActionModal, setShowActionModal] = useState(false)
  if (loading) return <div>Chargement...</div>
  if (error) return <div className="text-danger">{error}</div>
  const pa = data
  if (!pa) return <div>Plan d'action introuvable</div>
  const sourceDescr = pa.sourcePA.descr || '-'
  const dateConstat = pa.dateConstat ? new Date(pa.dateConstat).toLocaleDateString() : '-'
  const constat = pa.constat || '-'
  const status = pa.statusPA 
  const processus = Array.isArray(pa.processusConcernes) ? pa.processusConcernes : []

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
      const deleteUrl = `${API_URL}/SourceAction/${idToDelete}`
      const res = await fetch(deleteUrl, { method: 'DELETE', credentials: 'include' })
      if (!res.ok) {
        const body = await res.text().catch(() => '')
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
      <CCard className='mb-4'>
        <CCardHeader className="text-center"><span className="h6">IDENTITÉ</span></CCardHeader>
        <CCardBody>
          <CRow>
            <CCol md={6}><h6>Source</h6><p>{sourceDescr}</p></CCol>
            <CCol md={6}><h6>Date constat</h6><p>{dateConstat}</p></CCol>
            <CCol md={12}><h6>Constat</h6><p style={{ whiteSpace: 'pre-wrap' }}>{constat}</p></CCol>
            <CCol md={6}><h6>Statut</h6><p><CBadge color={status.color}>{status.nom}</CBadge> </p></CCol>
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
      {/* Actions card */}
      <CCard className='mb-4'>
        <CCardHeader className="position-relative text-center">
          <span className="h6">ACTION(s)</span>
          <div style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)' }}>
            <CButton size="md" onClick={() => setShowActionModal(true)}>
              <CIcon color='primary' icon={cilPlus} className="text-primary"/>
            </CButton>
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
      <ActionPAModal
        visible={showActionModal}
        onClose={() => setShowActionModal(false)}
        pa={pa}
        onSuccess={() => { setShowActionModal(false); refetch && refetch() }}
      />
    </>
  )
}

export default FichePA
