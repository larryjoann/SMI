import React, { useEffect, useState } from 'react'
import {
  CRow, CCol, CButton,
  CFormInput,
  CCard, CCardBody, CBadge,
  CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem, CDropdownDivider
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSend, cilOptions, cilPen, cilStorage } from '@coreui/icons'
import FilterDropdown from '../../../non_conformite/components/filter/FilterDropdown'
import DateFilterDropdown from '../../../non_conformite/components/filter/DateFilterDropdown'
import { useProcessOptions , useSourcePAOptions, useStatusPAOptions} from '../../../non_conformite/components/filter/hooks/useFilterOptions'
import * as paService from '../../services/paService'
import BadgeFilterDropdown from '../../../non_conformite/components/filter/BadgeFilterDropdown'


// PAListPanel: fetches Plan_action and renders filters + card list similar to NC panels
const PAListPanel = ({ onReload } = {}) => {
  const processOptions = useProcessOptions()
  const sourceOptions = useSourcePAOptions()
  const statusOptions = useStatusPAOptions()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState([])
  const [sources, setSources] = useState([])

  const [selectedProcesses, setSelectedProcesses] = useState([])
  const [selectedSource, setSelectedSource] = useState([])
  const [selectedStatus, setSelectedStatus] = useState([])
  const [dateFilter, setDateFilter] = useState({ from: '', to: '' })
  const [page, setPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    let mounted = true
    setLoading(true)
    ;(async () => {
      try {
        const list = await paService.getPlanActions()
        if (!mounted) return
        setData(Array.isArray(list) ? list : [])
      } catch (err) {
        console.error('Failed to load Plan actions', err)
        if (!mounted) return
        setError(err)
      } finally {
        if (!mounted) return
        setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const s = await paService.getSources()
        if (!mounted) return
        setSources(Array.isArray(s) ? s : [])
      } catch (err) {
        console.error('Failed to load sources', err)
      }
    })()
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    if (processOptions.length > 0) setSelectedProcesses(processOptions.map(opt => opt.id))
  }, [processOptions])
  useEffect(() => {
    if (sourceOptions.length > 0) setSelectedSource(sourceOptions.map(opt => opt.id))
  }, [sourceOptions])
  useEffect(() => {
    if (statusOptions.length > 0) setSelectedStatus(statusOptions.map(opt => opt.id))
  }, [statusOptions])

  const applyFilters = () => {
    const selProc = selectedProcesses.map(String)
    const selSources = selectedSource.map(String)
    const selStatus = selectedStatus.map(String)

    return data.filter(item =>
      selProc.includes('all') || (item.processusConcernes || []).some(pc => selProc.includes(String(pc.processus.id)))
    ).filter(item =>
      selSources.includes('all') || selSources.includes(String(item.sourcePA.id))
    ).filter(item =>
      selStatus.includes('all') || selStatus.includes(String(item.statusPA.id))
    ).filter(item => {
      if (!dateFilter.from && !dateFilter.to) return true
      const itemDate = new Date(item.item.dateConstat)
      const from = dateFilter.from ? new Date(dateFilter.from) : null
      const to = dateFilter.to ? new Date(dateFilter.to) : null
      if (from && itemDate < from) return false
      if (to && itemDate > to) return false
      return true
    })
  }

  if (loading) return <div>Chargement...</div>
  if (error) return <div className="text-danger">Erreur lors du chargement des Plans d'action</div>

  const filtered = applyFilters()
  const pageCount = Math.ceil(filtered.length / itemsPerPage)
  const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  return (
    <>
      <CRow>
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
            options={sourceOptions.map(opt => ({ id: opt.id, label: opt.nom || opt.label }))}
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
      <hr />

      {paginated.map((item) => (
        <CCard
          className="mb-2 card-list-hover"
          key={item.id || item.id_pa || Math.random()}
          style={{ cursor: 'pointer', opacity: 1 }}
          onClick={() => { if (item.id || item.id_pa) window.location = `#/pa/fiche/${item.id || item.id_pa}` }}
        >
          <CCardBody>
            <CRow>
              <CCol xs={3}>{(item.processusConcernes || []).map(pc => pc.processus?.sigle).filter(Boolean).join(', ')}</CCol>
              <CCol xs={2}>{new Date(item.dateConstat).toLocaleString()}</CCol>
              <CCol xs={3}>{item.sourcePA.descr}</CCol>
              <CCol xs={3}> 
                <CBadge
                    color={item.statusPA.color}
                    shape="rounded-pill"
                    className="status_badge"
                >
                    {item.statusPA.nom}
                </CBadge>
                </CCol>
              <CCol xs={1} className="d-flex justify-content-end">
                <CDropdown variant="btn-group" direction="center" onClick={e => e.stopPropagation()}>
                  <CDropdownToggle caret={false} className="p-0">
                    <CIcon icon={cilOptions} className="text-dark" />
                  </CDropdownToggle>
                  <CDropdownMenu>
                    <CDropdownItem href="#" onClick={async (e) => { e.preventDefault(); e.stopPropagation(); if (!window.confirm('Archiver ce plan d\'action ?')) return; alert('Archive non implémentée'); }}>
                      <CIcon icon={cilStorage} className="text-danger me-3" />
                      <span className="text-danger">Archiver</span>
                    </CDropdownItem>
                    <CDropdownDivider />
                    <CDropdownItem href="#" onClick={e => { e.preventDefault(); e.stopPropagation(); window.location = `#/pa/form/${item.id || item.id_pa}`; }}>
                      <CIcon icon={cilPen} className="text-warning me-3" />
                      <span className="text-warning">Modifier</span>
                    </CDropdownItem>
                  </CDropdownMenu>
                </CDropdown>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      ))}

      {/* pagination inside panel */}
      <CRow>
        <CCol className="d-flex justify-content-end">
          <nav aria-label="Page navigation example">
            <ul className="pagination pagination-sm">
              {[...Array(pageCount)].map((_, idx) => (
                <li key={idx} className={`page-item ${page === idx + 1 ? 'active' : ''}`}><button className="page-link" onClick={() => setPage(idx + 1)}>{idx + 1}</button></li>
              ))}
            </ul>
          </nav>
        </CCol>
      </CRow>
    </>
  )
}

export default PAListPanel
