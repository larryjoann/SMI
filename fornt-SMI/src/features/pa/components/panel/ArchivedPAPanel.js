import React, { useEffect, useState } from 'react'
import {
  CRow, CCol, CCard, CCardBody, CBadge,
  CPagination, CPaginationItem
} from '@coreui/react'
import FilterDropdown from '../../../non_conformite/components/filter/FilterDropdown'
import DateFilterDropdown from '../../../non_conformite/components/filter/DateFilterDropdown'
import BadgeFilterDropdown from '../../../non_conformite/components/filter/BadgeFilterDropdown'
import { useProcessOptions, useSourcePAOptions, useStatusPAOptions } from '../../../non_conformite/components/filter/hooks/useFilterOptions'
import CIcon from '@coreui/icons-react'
import { cilActionUndo, cilTrash } from '@coreui/icons'
import { useNavigate } from 'react-router-dom'

// Simple Archived panel for PA with static data support
const ArchivedPAPanel = ({ paData = [], loading = false, error = null, onReload }) => {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const itemsPerPage = 10
  const [archivedId, setArchivedId] = useState(null)

  // filter options from shared hooks
  const processOptions = useProcessOptions()
  const sourceOptions = useSourcePAOptions()
  const statusOptions = useStatusPAOptions()

  // filter states
  const [selectedProcesses, setSelectedProcesses] = useState([])
  const [selectedSource, setSelectedSource] = useState([])
  const [selectedStatus, setSelectedStatus] = useState([])
  const [dateFilter, setDateFilter] = useState({ from: '', to: '' })

  useEffect(() => {
    // reset page if data length changed
    setPage(1)
  }, [paData])

  useEffect(() => {
    if (processOptions.length > 0) setSelectedProcesses(processOptions.map(opt => opt.id))
  }, [processOptions])
  useEffect(() => {
    if (sourceOptions.length > 0) setSelectedSource(sourceOptions.map(opt => opt.id))
  }, [sourceOptions])
  useEffect(() => {
    if (statusOptions.length > 0) setSelectedStatus(statusOptions.map(opt => opt.id))
  }, [statusOptions])

  if (loading) return <div>Chargement...</div>
  if (error) return <div className="text-danger">Erreur lors du chargement des Plans d'action</div>

  const applyFilters = () => {
    const selProc = selectedProcesses.map(String)
    const selSources = selectedSource.map(String)
    const selStatus = selectedStatus.map(String)

    return (paData || []).filter(item => {
      // exclude locally "archivedId" (simulated removal)
      if (item.id === archivedId) return false
      return true
    }).filter(item =>
      // process filter: allow 'all' or match processusConcernes.processus.id (or sigle fallback)
      selProc.includes('all') || (item.processusConcernes || []).some(pc => selProc.includes(String(pc.processus?.id || pc.processus?.sigle || '')))
    ).filter(item =>
      // source filter: match sourcePA.id or descr
      selSources.includes('all') || selSources.includes(String(item.sourcePA?.id || item.sourcePA?.descr || ''))
    ).filter(item =>
      // status filter: match statusPA.id or nom
      selStatus.includes('all') || selStatus.includes(String(item.statusPA?.id || item.statusPA?.nom || ''))
    ).filter(item => {
      // date range
      if (!dateFilter.from && !dateFilter.to) return true
      const itemDate = new Date(item.dateConstat)
      const from = dateFilter.from ? new Date(dateFilter.from) : null
      const to = dateFilter.to ? new Date(dateFilter.to) : null
      if (from && itemDate < from) return false
      if (to && itemDate > to) return false
      return true
    })
  }

  const filtered = applyFilters()
  const pageCount = Math.max(1, Math.ceil(filtered.length / itemsPerPage))
  const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  return (
    <>
      {/* Filters row */}
      <CRow className="mb-2">
        <CCol xs={3}>
          <FilterDropdown
            label="Processus concerné"
            options={processOptions.map(opt => ({ id: opt.id, label: opt.nom || opt.label }))}
            selected={selectedProcesses}
            onChange={(arr) => { setSelectedProcesses(arr); setPage(1) }}
          />
        </CCol>
        <CCol xs={2}>
          <DateFilterDropdown
            label="Date"
            fromDate={dateFilter.from}
            toDate={dateFilter.to}
            onChange={(d) => { setDateFilter(d); setPage(1) }}
          />
        </CCol>
        <CCol xs={3}>
          <FilterDropdown
            label="Source"
            options={sourceOptions.map(opt => ({ id: opt.id, label: opt.nom || opt.label || opt.descr }))}
            selected={selectedSource}
            onChange={(arr) => { setSelectedSource(arr); setPage(1) }}
          />
        </CCol>
        <CCol xs={3}>
          <BadgeFilterDropdown
            label="Status"
            options={statusOptions}
            selected={selectedStatus}
            onChange={setSelectedStatus}
          />
        </CCol>
        <CCol xs={1}></CCol>
      </CRow>

      {paginated.map((item) => (
        <CCard
          className="mb-2 card-list-hover"
          key={item.id}
          style={{ cursor: 'pointer', opacity: archivedId === item.id ? 0.5 : 1 }}
          onClick={() => navigate(`/pa/list/fiche/${item.id}`)}
        >
          <CCardBody>
            <CRow>
              <CCol xs={3}>{(item.processusConcernes || []).map(pc => pc.processus?.sigle).filter(Boolean).join(', ')}</CCol>
              <CCol xs={2}>{new Date(item.dateConstat).toLocaleString()}</CCol>
              <CCol xs={3}>{item.sourcePA?.descr || ''}</CCol>
              <CCol xs={3}>
                <CBadge
                  color={item.statusPA?.color || 'secondary'}
                  shape="rounded-pill"
                  className="status_badge"
                >
                  {item.statusPA?.nom || ''}
                </CBadge>
              </CCol>
              <CCol xs={1} className="d-flex justify-content-end">
                <button
                  type="button"
                  className="btn btn-link p-0"
                  onClick={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    // Simuler suppression/restauration locale
                    setArchivedId(item.id)
                    if (typeof onReload === 'function') onReload()
                  }}
                  aria-label="Restaurer/Supprimer"
                >
                  <CIcon icon={cilActionUndo} size='lg' className="text-success me-2" title='Restaurer' />
                  <CIcon icon={cilTrash} size='lg' className="text-danger me-2" title='Supprimer' />
                </button>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      ))}

      <CPagination size='sm' align="end" aria-label="Page navigation example" className='mt-3'>
        <CPaginationItem aria-label="Previous" disabled={page === 1} onClick={() => setPage(page - 1)}>&laquo;</CPaginationItem>
        {[...Array(pageCount)].map((_, idx) => (
          <CPaginationItem key={idx + 1} active={page === idx + 1} onClick={() => setPage(idx + 1)}>{idx + 1}</CPaginationItem>
        ))}
        <CPaginationItem aria-label="Next" disabled={page === pageCount || pageCount === 0} onClick={() => setPage(page + 1)}>&raquo;</CPaginationItem>
      </CPagination>
    </>
  )
}

export default ArchivedPAPanel
