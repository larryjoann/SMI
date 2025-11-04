import React, { useEffect, useState } from 'react'
import {
  CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter,
  CRow, CCol, CButton, CFormTextarea, CFormInput,
  CTabs, CTabList, CTab, CTabContent, CTabPanel,
  CFormCheck,
  CCard,
  CCardBody,
  CBadge,
  CAvatar
} from '@coreui/react'
import Select from 'react-select'
import CIcon from '@coreui/icons-react'
import { cilCheck, cilPlus, cilX } from '@coreui/icons'
import CollaborateurMultiSelect from '../../../components/champs/CollaborateurMultiSelect'
import API_URL from '../../../api/API_URL'

export default function ActionCurativeModal({ visible, onClose, nc, onSuccess }) {
  const [title, setTitle] = useState('')
  const [descr, setDescr] = useState('')
  const [priority, setPriority] = useState('Haute')
  const [dateDebut, setDateDebut] = useState('')
  const [dateFin, setDateFin] = useState('')
  const [responsables, setResponsables] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState(1)

  // existing actions listing
  const [existingActions, setExistingActions] = useState([])
  const [loadingExisting, setLoadingExisting] = useState(false)
  const [selectedExisting, setSelectedExisting] = useState([])

  useEffect(() => {
    if (visible) {
      setTitle('')
      setDescr('')
      setDateDebut('')
      setDateFin('')
      setResponsables([])
      setLoading(false)
      // reset to first tab each time modal opens
      setActiveTab(1)
      setExistingActions([])
    }
  }, [visible])

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const action = {
        id: null,
        titre: title,
        descr: descr,
        dateDebut: dateDebut,
        dateFinPrevue: dateFin,
        responsables: (responsables || []).map(r => {
          // normalize collaborator value to the server expected shape
          if (typeof r === 'string') return { MatriculeResponsable: r }
          // try common property names
          const code = r.value ||''
          return { MatriculeResponsable: code }
        }),
        sources: [
          {
            idAction: null,
            idEntite: 2,
            idObjet: nc.id ,
          },
        ],
        idStatusAction: 1,
        Status: true
      }
      // Remove explicit nulls that break System.Text.Json numeric fields (e.g. id:null)
      const sanitizedAction = JSON.parse(JSON.stringify(action, (k, v) => (v === null ? undefined : v)))
      try {
        console.log('Action payload JSON (sanitized):', JSON.stringify(sanitizedAction, null, 2))
      } catch (e) {
        console.log('Failed to serialize action payload for logging', e)
      }
      // Send to backend controller expecting [FromForm] string ActionDetails
      try {
  const form = new FormData()
  form.append('ActionDetails', JSON.stringify(sanitizedAction))
        const url = `${API_URL}/ActionDetails`
        const res = await fetch(url, {
          method: 'POST',
          credentials: 'include',
          body: form,
        })
        const bodyText = await res.text()
        if (res.ok) {
          console.log('Action created on server:', bodyText)
          onSuccess && onSuccess(action)
          onClose && onClose()
        } else {
          console.error('Server returned error creating action', res.status, bodyText)
          window.alert(`Echec création action (${res.status}) : ${bodyText}`)
        }
      } catch (err) {
        console.error('Network error while creating action', err)
        window.alert('Erreur réseau lors de la création de l\'action')
      }
    } catch (err) {
      console.error('Erreur création action curative', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchExistingActions = async () => {
    setLoadingExisting(true)
    try {
      const apiBase = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL
      const url = `${apiBase}/Action`
      const res = await fetch(url, { credentials: 'include' })
      if (!res.ok) {
        const txt = await res.text().catch(() => '')
        console.error('Failed to fetch existing actions', res.status, txt)
        setExistingActions([])
        return
      }
      const json = await res.json().catch(() => null)
      // assume API returns an array or an object with array
      const list = Array.isArray(json) ? json : (json?.data || json?.items || [])
      setExistingActions(list || [])
    } catch (err) {
      console.error('Error fetching existing actions', err)
      setExistingActions([])
    } finally {
      setLoadingExisting(false)
    }
  }

  const toggleSelectExisting = (id) => {
    setSelectedExisting((prev) => {
      if (prev.includes(id)) return prev.filter(x => x !== id)
      return [...prev, id]
    })
  }

  const handleSelectChange = (e) => {
    // react-select passes an array of selected option objects (or null)
    const selected = e || []
    const ids = selected.map((o) => Number(o.value))
    setSelectedExisting(ids)
  }

  const handleLinkExisting = async () => {
    if (!selectedExisting || selectedExisting.length === 0) {
      window.alert('Sélectionnez au moins une action à lier')
      return
    }
    setLoading(true)
    try {
      const apiBase = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL
      const url = `${apiBase}/SourceAction/range`
      // send array of link objects
      const payload = selectedExisting.map(idAction => ({ idAction, idEntite: 2, idObjet: nc.id }))
      console.log('handleLinkExisting payload:', payload)
      const res = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const txt = await res.text().catch(() => '')
      if (!res.ok) {
        console.error('Failed to link actions', res.status, txt)
        window.alert(`Echec liaison (${res.status}) : ${txt}`)
        return
      }
      // success
      onSuccess && onSuccess({ linked: selectedExisting })
      onClose && onClose()
    } catch (err) {
      console.error('Error linking actions', err)
      window.alert('Erreur lors de la liaison des actions')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (val) => {
    if (!val) return ''
    try {
      const d = new Date(val)
      if (Number.isNaN(d.getTime())) return String(val)
      return d.toLocaleDateString('fr-FR')
    } catch (e) {
      return String(val)
    }
  }

  return (
    <CModal scrollable size="lg" alignment="center" visible={visible} onClose={onClose}>
      <CModalHeader>
        <CModalTitle>
          <CIcon icon={cilPlus} className="me-2" size="lg" />
          Nouvelle action curative
        </CModalTitle>
      </CModalHeader>
  <CModalBody style={{ minHeight: '420px' }}>
        <CTabs activeItemKey={activeTab} onActiveItemChange={(k) => { const key = Number(k); setActiveTab(key); if (key === 2) fetchExistingActions(); }} className="mb-3">
          <CTabList variant="underline">
            <CTab itemKey={1} onClick={(e) => { e && e.preventDefault && e.preventDefault(); setActiveTab(1); }}>Nouvelle Action</CTab>
            <CTab itemKey={2} onClick={(e) => { e && e.preventDefault && e.preventDefault(); setActiveTab(2); fetchExistingActions(); }}>Action existant</CTab>
          </CTabList>
          <CTabContent>
            <CTabPanel className="p-3" itemKey={1}>
              <CRow className="mb-2">
                <CCol xs={12} className="mb-3">
                  <label className="form-label h6">Titre :</label>
                  <CFormInput value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titre de l'action" />
                </CCol>
                <CCol xs={12} className="mb-3">
                  <label className="form-label h6">Description :</label>
                  <CFormTextarea rows={4} value={descr} onChange={(e) => setDescr(e.target.value)} />
                </CCol>
          <CCol xs={12} sm={12} className="mb-3">
            <label className="form-label h6">Responsables :</label>
            <CollaborateurMultiSelect value={responsables} onChange={setResponsables} />
          </CCol>
          <CCol xs={12} sm={6} className="mb-3">
            <label className="form-label h6">Date début :</label>
            <CFormInput type="date" value={dateDebut} onChange={(e) => setDateDebut(e.target.value)} />
          </CCol>
          <CCol xs={12} sm={6} className="mb-3">
            <label className="form-label h6">Date fin :</label>
            <CFormInput type="date" value={dateFin} onChange={(e) => setDateFin(e.target.value)} />
          </CCol>
              </CRow>
            </CTabPanel>
            <CTabPanel className="p-3" itemKey={2}>
              <div>
                <div className="mb-3">
                  <label className="form-label">Actions existants : </label>
                  <Select
                    isMulti
                    options={existingActions.map((a) => ({ value: a.id, label: a.titre }))}
                    value={selectedExisting.map(id => {
                      const a = existingActions.find(x => x.id === id)
                      return a ? { value: a.id, label: a.titre } : null
                    }).filter(Boolean)}
                    onChange={handleSelectChange}
                    placeholder="Rechercher et sélectionner des actions..."
                    noOptionsMessage={() => 'Aucune action'}
                    // render menu in a portal / fixed position so it doesn't affect modal layout
                    menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                    menuPosition="fixed"
                    maxMenuHeight={300}
                    styles={{
                      menuPortal: base => ({ ...base, zIndex: 9999 }),
                    }}
                  />
                </div>

                {loadingExisting ? (
                  <div>Chargement...</div>
                ) : (
                  <div>
                    {existingActions.length === 0 ? (
                      <div className="text-muted">Aucune action trouvée</div>
                    ) : (
                      <div className="mb-3">
                        <div className="d-flex flex-wrap g-2">
                          {selectedExisting.length === 0 ? (
                            <div className="text-muted small">Aucune action sélectionnée</div>
                          ) : (
                            selectedExisting.map((id) => {
                              const a = existingActions.find(x => x.id === id) || { id }
                              return (
                                <CCard key={`card-${id}`} className="border rounded me-2 mb-2 shadow-sm w-100">
                                  <CCardBody>
                                    <div className="d-flex justify-content-between align-items-start">
                                      <div>
                                        <div className="fw-bold">{a.titre}</div>
                                        <div className="small text-muted">{a.descr}</div>
                                        <span className='h6'>Status : </span>
                                        <CBadge color={a.statusAction.color}>{a.statusAction.nom}</CBadge>
                                      </div>
                                      <div>
                                        <CButton color="danger" size="sm" onClick={() => toggleSelectExisting(id)}>
                                            <CIcon icon={cilX} />
                                        </CButton>
                                      </div>
                                    </div>
                                    <hr></hr>
                                    <div className="d-flex justify-content-between align-items-center mt-2">
                                        <div>
                                        <span>{formatDate(a.dateDebut)}{a.dateDebut && a.dateFinPrevue ? ' - ' : ''}{formatDate(a.dateFinPrevue)}</span>
                                        </div>
                                        <div className="d-flex align-items-center">
                                        {console.log('Rendering responsables for action', a.id, a.responsables)}
                                        {Array.isArray(a.responsables) && a.responsables.length > 0 ? (
                                            a.responsables.map((r) => {
                                            const name = r.responsable.nomComplet
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
                                  </CCardBody>
                                </CCard>
                              )
                            })
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CTabPanel>
          </CTabContent>
        </CTabs>
      </CModalBody>
      <CModalFooter className="px-0">
        <CRow className="w-100 g-2">
          <CCol xs={12} className="d-flex gap-2">
            <CButton className="w-100" color="secondary" onClick={onClose}>
              <CIcon icon={cilX} className="me-2" />
              Annuler
            </CButton>
            {activeTab === 1 ? (
              <CButton className="w-100" color="primary" onClick={handleSubmit} disabled={loading}>
                <CIcon icon={cilCheck} className="me-2" />
                Enregistrer l'action
              </CButton>
            ) : (
              <CButton className="w-100" color="primary" onClick={handleLinkExisting} disabled={loading || loadingExisting}>
                <CIcon icon={cilCheck} className="me-2" />
                Lier les actions sélectionnées
              </CButton>
            )}
          </CCol>
        </CRow>
      </CModalFooter>
    </CModal>
  )
}
