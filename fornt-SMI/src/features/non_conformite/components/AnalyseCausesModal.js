import React, { useEffect, useState } from 'react'
import {
  CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter,
  CRow, CCol, CButton, CFormTextarea
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCheck, cilMagnifyingGlass, cilX } from '@coreui/icons'
import CategorieCauseMultiSelect from '../../../components/champs/CategorieCauseMultiSelect'
import axiosInstance from '../../../api/axiosInstance'

// Props: visible, onClose, nc (object), processusConcerne (array), onSuccess
export default function AnalyseCausesModal({ visible, onClose, nc, causes = [], onSuccess }) {
  const [selectedCauses, setSelectedCauses] = useState([])
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState('')
  const [causesState, setCausesState] = useState([])

  // initialize when modal opens; avoid reacting to prop identity changes to prevent loops
  useEffect(() => {
    if (visible) {
      const init = (causes || []).map(c => ({
        value: c.idCategorieCauseNc ?? c.categorieCauseNc?.id ?? c.id,
        label: c.categorieCauseNc?.nom ?? c.descr ?? `Cause ${c.id ?? ''}`,
      }))
      setSelectedCauses(init)
      // initialize editable causes state from props
      const cs = (causes || []).map(c => ({
        id: c.id,
        idCategorieCauseNc: c.idCategorieCauseNc ?? c.categorieCauseNc?.id ?? null,
        label: c.categorieCauseNc?.nom ?? null,
        descr: c.descr || '',
      }))
      setCausesState(cs)
      setAnalysis('')
    }
    // run only when modal visibility changes
  }, [visible])

  // keep causesState in sync with selectedCauses: only selected categories are shown
  useEffect(() => {
    // build a map of existing causes by category id for quick lookup
    const existingByCat = new Map((causesState || []).map(c => [c.idCategorieCauseNc, c]))
    const propsByCat = new Map((causes || []).map(c => [c.idCategorieCauseNc ?? c.categorieCauseNc?.id, c]))
    const next = (selectedCauses || []).map(s => {
      const catId = s.value
      // prefer current state (user-edited), then props, otherwise create new
      const fromState = existingByCat.get(catId)
      if (fromState) return fromState
      const fromProps = propsByCat.get(catId)
      if (fromProps) {
        return {
          id: fromProps.id,
          idCategorieCauseNc: fromProps.idCategorieCauseNc ?? fromProps.categorieCauseNc?.id ?? catId,
          label: fromProps.categorieCauseNc?.nom ?? s.label,
          descr: fromProps.descr || '',
        }
      }
      return {
        id: null,
        idCategorieCauseNc: catId,
        label: s.label,
        descr: '',
      }
    })
    setCausesState(next)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCauses])

  const buildBody = () => {
    const NC = {
      Id: nc?.id,
    }
  // existing causes edited by user
  const existing = (causesState || []).map(c => ({
    Id: c.id,
    IdCategorieCauseNc: c.idCategorieCauseNc,
    Descr: c.descr,
  }))
  // any selected categories that are not already present become new causes
  const selectedValues = (selectedCauses || []).map(s => s.value)
  const existingCatIds = new Set(existing.map(e => e.IdCategorieCauseNc))
  const newOnes = selectedValues
    .filter(v => !existingCatIds.has(v))
    .map(v => ({ IdCategorieCauseNc: v, Descr: '' }))

  const Causes = [...existing, ...newOnes]
    return {
      NC,
      Causes,
      Analyse: analysis
    }
  }

  const handleSubmit = async () => {
    if (!nc || !nc.id) return
    setLoading(true)
    try {
      const body = buildBody()
      const url = `NCDetails/analyser/${nc.id}`
      const res = await axiosInstance.post(url, body)
      setLoading(false)
      if (res && res.data) {
        onSuccess && onSuccess(res.data)
        onClose && onClose()
      }
    } catch (err) {
      setLoading(false)
      console.error('Erreur analyse des causes', err)
    }
  }

  return (
    <CModal size="lg" alignment="center" visible={visible} onClose={onClose}>
      <CModalHeader>
        <CModalTitle>
          <CIcon icon={cilMagnifyingGlass} className="me-2" size='lg' />
          Analyser les causes
        </CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CRow className="mb-0">
          <CCol xs={12} className='mb-3'>
            <label className="form-label h6">Categorie des causes :</label>
            <CategorieCauseMultiSelect value={selectedCauses} onChange={setSelectedCauses} />
          </CCol>
          {causesState && causesState.length > 0 && (
            <CCol xs={12} className='mb-0'>
              <label className="form-label h6">Causes existantes :</label>
              <div>
                {causesState.map((c, idx) => (
                  <div key={c.id ?? `c-${idx}`} className="mb-3 border rounded p-2">
                    <div className="mb-1">{c.label || `Cause ${c.id ?? idx}`} :</div>
                    <CFormTextarea
                      rows={3}
                      value={c.descr}
                      onChange={e => {
                        const next = causesState.map((cc, i) => (i === idx ? { ...cc, descr: e.target.value } : cc))
                        setCausesState(next)
                      }}
                    />
                  </div>
                ))}
              </div>
            </CCol>
          )}
        </CRow>
      </CModalBody>
      <CModalFooter className='px-0'>
        <CRow className="w-100 g-2">
          <CCol xs={12} className='d-flex gap-2'>
            <CButton className="w-100" color="secondary" onClick={onClose}>
              <CIcon icon={cilX} className="me-2" />
              Annuler
            </CButton>
            <CButton className="w-100" color="primary" onClick={handleSubmit}>
                <CIcon icon={cilCheck} className="me-2" />
              Enregistrer l'analyse
            </CButton>
          </CCol>
        </CRow>
      </CModalFooter>
    </CModal>
  )
}
