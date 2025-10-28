import React, { useEffect, useState } from 'react'
import {
  CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter,
  CRow, CCol, CButton
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilStar, cilX, cilInfo, cilCheck } from '@coreui/icons'
import ProcessusMultiSelect from '../../../components/champs/ProcessusMultiSelect'
import axiosInstance from '../../../api/axiosInstance'

// Props: visible, onClose, nc (object), processusConcerne (array), onSuccess
export default function QualificationModal({ visible, onClose, nc, processusConcerne = [], onSuccess }) {
  const [selectedProcessus, setSelectedProcessus] = useState([])
  const [loading, setLoading] = useState(false)
  const [confirmVisible, setConfirmVisible] = useState(false)
  const [pendingStatus, setPendingStatus] = useState(null)

  useEffect(() => {
    if (visible) {
      const init = (processusConcerne || []).map(p => ({ value: p.processus?.id, label: p.processus?.nom }))
      setSelectedProcessus(init)
    }
  }, [visible, processusConcerne])

  const buildNCDetailsBody = () => {
    // Construire un objet NCDetails minimal en se basant sur `nc` et selectedProcessus
    // Adapter selon le modèle attendu par l'API backend
    const NC = {
      Id: nc?.id,
    }
    const ProcessusConcerne = (selectedProcessus || []).map(p => ({ IdProcessus: p.value }))
    return {
      NC,
      ProcessusConcerne,
    }
  }

  const handleSubmit = async (idStatusNc) => {
    if (!nc || !nc.id) return
    setLoading(true)
    try {
      const body = buildNCDetailsBody()
      // Put idStatusNc into the request body instead of the URL/query
      body.NC.idStatusNc = idStatusNc
      const url = `NCDetails/qualifier/${nc.id}`
      const res = await axiosInstance.post(url, body)
      setLoading(false)
      if (res && res.data) {
        onSuccess && onSuccess(res.data)
        onClose && onClose()
      }
    } catch (err) {
      setLoading(false)
      console.error('Erreur qualification', err)
      // TODO: afficher erreur utilisateur
    }
  }

  const openConfirm = (idStatus) => {
    setPendingStatus(idStatus)
    setConfirmVisible(true)
  }

  const handleConfirm = async () => {
    // close the confirmation modal first, then submit
    setConfirmVisible(false)
    if (pendingStatus != null) {
      await handleSubmit(pendingStatus)
    }
    setPendingStatus(null)
  }

  return (
    <>
    <CModal alignment="center" visible={visible} onClose={onClose}>
      <CModalHeader>
        <CModalTitle>
          <CIcon icon={cilStar} className="me-2" size='lg' />
          Qualifier la non-conformité
        </CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CRow className="mb-3">
          <CCol xs={12}>
            <label className="form-label">Processus concerné(s)</label>
            <ProcessusMultiSelect value={selectedProcessus} onChange={setSelectedProcessus} />
          </CCol>
        </CRow>
      </CModalBody>
      <CModalFooter className='px-0'>
        <CRow className="w-100 g-2">
          <CCol xs={12} sm={4}>
            <CButton className="w-100" color="non_recevable" disabled={loading} onClick={() => openConfirm(4)}>
              <CIcon icon={cilX} className="me-2" />
              Non-reçevable
            </CButton>
          </CCol>
          <CCol xs={12} sm={4}>
            <CButton className="w-100" color="a_clarifier" disabled={loading} onClick={() => openConfirm(2)}>
              <CIcon icon={cilInfo} className="me-2" />
              A clarifier
            </CButton>
          </CCol>
          <CCol xs={12} sm={4}>
            <CButton className="w-100" color="recevable" disabled={loading} onClick={() => openConfirm(3)}>
              <CIcon icon={cilCheck} className="me-2" />
              Recevable
            </CButton>
          </CCol>
        </CRow>
      </CModalFooter>
    </CModal>

    {/* Confirmation modal before sending the qualification */}
    <CModal alignment="center" visible={confirmVisible} onClose={() => setConfirmVisible(false)}>
      <CModalHeader>
        <CModalTitle>Confirmer l'attribution</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <p>Confirmez-vous l'attribution de la qualification "{getStatusLabel(pendingStatus)}" ?</p>
        {selectedProcessus?.length > 0 && (
          <div>
            <strong>Processus sélectionnés :</strong>
            <ul className="mb-0">
              {selectedProcessus.map(p => (
                <li key={p.value}>{p.label}</li>
              ))}
            </ul>
          </div>
        )}
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => setConfirmVisible(false)} disabled={loading}>Annuler</CButton>
        <CButton color="primary" onClick={handleConfirm} disabled={loading}>Confirmer</CButton>
      </CModalFooter>
    </CModal>
    </>
  )
}

// Helper to convert status id to human label
function getStatusLabel(id) {
  if (id === 4) return 'Non-reçevable'
  if (id === 2) return 'A clarifier'
  if (id === 3) return 'Recevable'
  return ''
}
