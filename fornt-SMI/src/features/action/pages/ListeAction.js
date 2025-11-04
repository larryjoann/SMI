import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CAvatar,
  CBadge,
  CProgress,
  CSpinner,
  CButton,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CDropdownDivider,
  CCardHeader,
  CForm,
  CFormInput,
  CFormSelect,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilOptions, cilTrash, cilPen ,cilFilter,cilFilterX } from '@coreui/icons'
import useActions from '../hooks/useActions'

const columnStyle = {
  // Fill most of the viewport; subtract space for header/top controls.
  height: 'calc(100vh - 160px)',
  background: '#f4f4f4ff',
  borderRadius: '6px',
  padding: '8px',
  display: 'flex',
  flexDirection: 'column',
}

const ListeAction = () => {
  const navigate = useNavigate();
  const { loading, saving, actions, statuses, fetchActions, fetchStatuses, updateActionStatusOnServer, deleteAction } = useActions()
  const [columns, setColumns] = useState({})
  // filter inputs
  const [inputTitle, setInputTitle] = useState('')
  const [inputSource, setInputSource] = useState('')
  const [inputDateStart, setInputDateStart] = useState('')
  const [inputDateEnd, setInputDateEnd] = useState('')
  // active filters (applied on submit)
  const [filterTitle, setFilterTitle] = useState('')
  const [filterSource, setFilterSource] = useState('')
  const [filterDateStart, setFilterDateStart] = useState('')
  const [filterDateEnd, setFilterDateEnd] = useState('')
  const [availableSources, setAvailableSources] = useState([])

  useEffect(() => {
    // fetch statuses first, then actions
    fetchStatuses()
    fetchActions()
  }, [fetchActions, fetchStatuses])

  // derive available sources from actions for the Source(entité) select
  useEffect(() => {
    const map = new Map()
    actions.forEach((a) => {
      if (Array.isArray(a.sources)) {
        a.sources.forEach((s) => {
          const ent = s?.entite
          if (ent && ent.id) map.set(ent.id, { id: ent.id, nom: ent.nom })
        })
      }
    })
    setAvailableSources(Array.from(map.values()))
  }, [actions])

  useEffect(() => {
    // Build columns from fetched statuses (fallback to DEFAULT_STATUSES)
    const sourceStatuses = (statuses && statuses.length) ? statuses : []
    if (sourceStatuses.length === 0) {
      // No statuses to show; clear columns and exit
      setColumns({})
      return
    }
    const map = {}
    // initialize with empty columns for each known status
    sourceStatuses.forEach((s) => {
      const key = `s-${s.id}`
      map[key] = { title: s.nom, color: s.color || s.nom, items: [] }
    })
    // a fallback unknown column
    map.unknown = { title: 'Autres', color: 'backlog', items: [] }

    // apply filters to actions first
    const filteredActions = actions.filter((a) => {
      // Title filter
      const titleMatch = !filterTitle || (a.titre && a.titre.toLowerCase().includes(filterTitle.trim().toLowerCase()))
      // Source (entité) filter: match by entite.id or entite.nom
      let sourceMatch = true
      if (filterSource) {
        sourceMatch = false
        if (Array.isArray(a.sources)) {
          for (const s of a.sources) {
            const ent = s?.entite
            if (!ent) continue
            if (String(ent.id) === String(filterSource) || (ent.nom && ent.nom.toLowerCase() === String(filterSource).toLowerCase())) {
              sourceMatch = true
              break
            }
          }
        }
      }
      // Date start filter: action.dateDebut must be >= filterDateStart
      let startMatch = true
      if (filterDateStart) {
        const aStart = a.dateDebut ? new Date(a.dateDebut) : null
        const fStart = new Date(filterDateStart)
        if (!aStart || aStart < fStart) startMatch = false
      }
      // Date end filter: action.dateFinPrevue or dateFin must be <= filterDateEnd
      let endMatch = true
      if (filterDateEnd) {
        const aEndStr = a.dateFinPrevue || a.dateFin
        const aEnd = aEndStr ? new Date(aEndStr) : null
        const fEnd = new Date(filterDateEnd)
        if (!aEnd || aEnd > fEnd) endMatch = false
      }
      return titleMatch && sourceMatch && startMatch && endMatch
    })

    // distribute filtered actions into columns
    filteredActions.forEach((a) => {
      const statusId = a?.idStatusAction ?? a?.statusAction?.id
      const key = statusId != null ? `s-${statusId}` : 'unknown'
      if (!map[key]) {
        map.unknown.items.push(a)
      } else {
        map[key].items.push(a)
      }
    })

    // preserve statuses order then unknown
    const ordered = {}
    sourceStatuses.forEach((s) => {
      const k = `s-${s.id}`
      ordered[k] = map[k]
    })
    if (map.unknown.items.length > 0) ordered.unknown = map.unknown
    setColumns(ordered)
  }, [actions, statuses, filterTitle, filterSource, filterDateStart, filterDateEnd])

  // Drag handlers
  const onDragStart = (e, actionId, fromKey) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ actionId, fromKey }))
    e.dataTransfer.effectAllowed = 'move'
  }

  const onDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  // updateActionStatusOnServer is provided by the hook

  const onDrop = async (e, toKey) => {
    e.preventDefault()
    const raw = e.dataTransfer.getData('text/plain')
    if (!raw) return
    let payload
    try {
      payload = JSON.parse(raw)
    } catch (err) {
      console.error('Invalid drag payload', err)
      return
    }
    const { actionId, fromKey } = payload
    if (!actionId) return
    // Optimistic update: move item locally
    setColumns((prev) => {
      const next = JSON.parse(JSON.stringify(prev))
      const sourceCol = next[fromKey]
      const targetCol = next[toKey] || { title: toKey, items: [] }
      if (sourceCol) {
        const idx = sourceCol.items.findIndex((it) => String(it.id) === String(actionId))
        if (idx !== -1) {
          const [moved] = sourceCol.items.splice(idx, 1)
          targetCol.items.unshift(moved)
          next[toKey] = targetCol
        }
      }
      return next
    })

    // Try to sync with server; revert on failure
    const ok = await updateActionStatusOnServer(actionId, toKey)
    if (!ok) {
      // revert by refetching actions from server
      console.warn('Reverting local move due to server error')
      fetchActions()
    }
  }

  return (
    <div>
      <style>{`
        /* hide scrollbar by default */
        .kanban-items {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
        .kanban-items::-webkit-scrollbar {
          width: 0px;
          height: 0px;
        }
        /* show thin scrollbar when hovering the column */
        .kanban-column:hover .kanban-items {
          scrollbar-width: thin; /* Firefox */
        }
        .kanban-column:hover .kanban-items::-webkit-scrollbar {
          width: 8px;
        }
        .kanban-column:hover .kanban-items::-webkit-scrollbar-track {
          background: transparent;
        }
        .kanban-column:hover .kanban-items::-webkit-scrollbar-thumb {
          background-color: rgba(0,0,0,0.2);
          border-radius: 4px;
        }
      `}</style>
      <CRow className="mb-2">
        <CCol xs={3} ></CCol>
        <CCol xs={6} className="d-flex justify-content-center">
            <h3>Liste des actions</h3>
        </CCol>
        <CCol xs={3} ></CCol>
      </CRow>
      <CCard className='mb-3'>
        <CCardHeader>
            <span className='h6'>Filtre</span>
        </CCardHeader>
        <CCardBody>
          <CForm className="row g-3" onSubmit={(e) => {
            e.preventDefault()
            setFilterTitle(inputTitle)
            setFilterSource(inputSource)
            setFilterDateStart(inputDateStart)
            setFilterDateEnd(inputDateEnd)
          }}>
            <CCol xs={3}>
              <CFormInput
                type="text"
                id="filterTitle"
                floatingLabel="Titre"
                placeholder="Titre"
                value={inputTitle}
                onChange={(e) => setInputTitle(e.target.value)}
              />
            </CCol>
            <CCol xs={3}>
              <CFormSelect
                floatingLabel="Source"
                value={inputSource}
                onChange={(e) => setInputSource(e.target.value)}
                className="mb-0"
              >
                <option value="">Toutes les entités</option>
                {availableSources.map((s) => (
                  <option key={s.id} value={String(s.id)}>{s.nom}</option>
                ))}
              </CFormSelect>
            </CCol>
            <CCol xs={2}>
              <CFormInput
                type="date"
                id="filterDateStart"
                floatingLabel="Date début"
                value={inputDateStart}
                onChange={(e) => setInputDateStart(e.target.value)}
              />
            </CCol>
            <CCol xs={2}>
              <CFormInput
                type="date"
                id="filterDateEnd"
                floatingLabel="Date fin"
                value={inputDateEnd}
                onChange={(e) => setInputDateEnd(e.target.value)}
              />
            </CCol>
            <CCol xs={2} className="d-flex justify-content-center align-items-center">
              <CButton color="danger" className="me-2" type="button" onClick={() => {
                setInputTitle('')
                setInputSource('')
                setInputDateStart('')
                setInputDateEnd('')
                setFilterTitle('')
                setFilterSource('')
                setFilterDateStart('')
                setFilterDateEnd('')
              }}>
                <CIcon icon={cilFilterX} />
              </CButton>
              <CButton
                    color='primary'
                    key='1'
                    type='submit'
                  >
                    <CIcon icon={cilFilter} className="me-2" />
                    Filtrer
                  </CButton>
            </CCol>
          </CForm>
        </CCardBody>
      </CCard>
      {loading ? (
        <div className="text-center py-5"><CSpinner /></div>
      ) : (
        <CRow>
          {Object.keys(columns).length === 0 ? (
            <CCol xs={12}>
              <div className="text-muted">Aucune action trouvée</div>
            </CCol>
          ) : (
            Object.entries(columns).map(([key, col]) => (
              <CCol key={key} xs={12} sm={6} md={4} lg={3} className="mb-3 me-0 pe-0" >
                <div className="kanban-column" style={columnStyle} onDragOver={onDragOver} onDrop={(e) => onDrop(e, key)}>
                  <div className="d-flex justify-content-between align-items-center p-2">
                    <div className="d-flex align-items-center">
                      <div
                        aria-hidden="true"
                        style={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          display: 'inline-block',
                          marginRight: 8,
                          background: col.color,
                          border: '1px solid rgba(0,0,0,0.12)',
                        }}
                      />
                      <strong>{col.title}</strong>
                    </div>
                    <CBadge color="secondary">{col.items.length}</CBadge>
                  </div>
                  <hr className='mt-2 mb-3'></hr>
                  <div className="kanban-items" style={{ flex: 1, overflowY: 'auto' }}>
                    {col.items.map((a) => {
                      // determine most recent suivi to derive progress
                      const lastSuivi = (Array.isArray(a.suivis) && a.suivis.length > 0)
                        ? a.suivis.reduce((latest, s) => {
                            if (!latest) return s
                            const ds = s.dateSuivi ? new Date(s.dateSuivi) : null
                            const dl = latest.dateSuivi ? new Date(latest.dateSuivi) : null
                            if (!ds) return latest
                            if (!dl) return s
                            return ds > dl ? s : latest
                          }, null)
                        : null
                      const progress = lastSuivi && typeof lastSuivi.avancement === 'number' ? lastSuivi.avancement : 0
                      const dateDebutStr = a.dateDebut ? new Date(a.dateDebut).toLocaleDateString() : '-'
                      const dateFinStr = a.dateFinPrevue || a.dateFin ? new Date(a.dateFinPrevue || a.dateFin).toLocaleDateString() : '-'
                      return (
                        <CCard 
                          key={a.id} 
                          className="mb-2 card-list-hover" 
                          draggable 
                          onDragStart={(e) => onDragStart(e, a.id, key)}
                          onClick={() => navigate(`/action/fiche/${a.id}`)}
                        >
                          <CCardBody className="p-3 position-relative">
                            <div
                              className="position-absolute end-0 top-0 me-2 mt-2"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <CDropdown alignment="end">
                                <CDropdownToggle caret={false} className="p-0">
                                  <CIcon icon={cilOptions} className="text-dark" size='sm' />
                                </CDropdownToggle>
                                <CDropdownMenu>
                                  <CDropdownItem
                                    onClick={async (e) => {
                                      e.stopPropagation()
                                      
                                      try {
                                        const ok = await deleteAction(a.id)
                                        if (!ok) {
                                          
                                        }
                                      } catch (err) {
                                        console.error('Delete error', err)
                                       
                                      }
                                    }}
                                  >
                                    <CIcon icon={cilTrash} className="text-danger me-2" />
                                    <span className="text-danger">Supprimer</span>
                                  </CDropdownItem>
                                  <CDropdownDivider />
                                  <CDropdownItem
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      // navigate to edit/view page
                                      navigate(`/action/form/${a.id}`)
                                    }}
                                  >
                                    <CIcon icon={cilPen} className="text-warning me-2" />
                                    <span className="text-warning">Modifier</span>
                                  </CDropdownItem>
                                </CDropdownMenu>
                              </CDropdown>
                            </div>
                            <div className="">                          
                                <span className='h6'>{a.titre}</span>                            
                              <div className="">
                                <span className=''>Source(s) :</span>
                                <ul>
                                  {Array.isArray(a.sources) && a.sources.length > 0 ? (
                                    a.sources.map((s) => (
                                      <li key={s.id || `${s.idEntite}-${s.idObjet}`} className="small text-muted">
                                        {s.entite.nom} #{s.idObjet}
                                      </li>
                                    ))
                                  ) : (
                                    <div className="small text-muted">-</div>
                                  )}
                                </ul>
                              </div>
                            </div>
                            <div className="mt-0">
                              <CProgress height={14} value={progress} variant="striped" animated>{progress}%</CProgress>
                            </div>
                            <div className="d-flex justify-content-between align-items-center mt-2">
                              <div>
                                <span className='small'>{dateDebutStr} - {dateFinStr}</span>
                              </div>
                              <div className="d-flex align-items-center">
                                {Array.isArray(a.responsables) && a.responsables.length > 0 ? (
                                  a.responsables.map((r) => {
                                    const name = r.responsable?.nomAffichage || r.responsable?.nomComplet || r.matriculeResponsable || ''
                                    const initials = name
                                      .split(' ')
                                      .map((n) => n?.[0])
                                      .filter(Boolean)
                                      .slice(0, 2)
                                      .join('')
                                      .toUpperCase()
                                    return (
                                      <CAvatar key={r.id} className="ms-1 bg-secondary text-white" size="sm">{initials}</CAvatar>
                                    )
                                  })
                                ) : (
                                  <CAvatar className="ms-2 bg-secondary text-white" size="sm">-</CAvatar>
                                )}
                              </div>
                            </div>
                          </CCardBody>
                        </CCard>
                      )
                    })}
                  </div>
                </div>
              </CCol>
            ))
          )}
        </CRow>
      )}
      {saving && <div className="mt-2 small text-muted">Saving...</div>}
    </div>
  )
}

export default ListeAction
