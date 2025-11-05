import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CRow, CCol, CButton,
  CFormInput,
  CCard, CCardBody, CCardHeader, CBadge,
  CPagination, CPaginationItem,
} from '@coreui/react'
import FilterDropdown from '../../non_conformite/components/filter/FilterDropdown'
import DateFilterDropdown from '../../non_conformite/components/filter/DateFilterDropdown'
import BadgeFilterDropdownWithPhase from '../../non_conformite/components/filter/BadgeFilterDropdownWithPhase'
import { useProcessOptions, useTypeOptions, useLieuOptions, useStatusOptions } from '../../non_conformite/components/filter/hooks/useFilterOptions'
import CIcon from '@coreui/icons-react'
import { cilSend, cilOptions, cilPen, cilStorage } from '@coreui/icons'
import { CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem, CDropdownDivider } from '@coreui/react'
import PAListPanel from '../components/panel/PAListPanel'
import * as paService from '../services/paService'

// ListePA: similar to Liste_NC but without the panel components.
// - shows a simple table of Plan_action
// - provides column filters: source, status, date range, text search (constat)

const ListePA = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState([])
  const [sources, setSources] = useState([])

  // filters (match NC panel)
  const processOptions = useProcessOptions()
  const typeOptions = useTypeOptions()
  const lieuOptions = useLieuOptions()
  const statusOptions = useStatusOptions()

  const [selectedProcesses, setSelectedProcesses] = useState([])
  const [selectedTypes, setSelectedTypes] = useState([])
  const [selectedLieu, setSelectedLieu] = useState([])
  const [dateFilter, setDateFilter] = useState({ from: '', to: '' })
  const [filterText, setFilterText] = useState('')

  // pagination
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
    if (typeOptions.length > 0) setSelectedTypes(typeOptions.map(opt => opt.id))
  }, [typeOptions])
  useEffect(() => {
    if (lieuOptions.length > 0) setSelectedLieu(lieuOptions.map(opt => opt.id))
  }, [lieuOptions])

  const applyFilters = () => {
    const selProc = selectedProcesses.map(String)
    const selTypes = selectedTypes.map(String)
    const selLieu = selectedLieu.map(String)

    return data.filter(item =>
      selProc.includes('all') || (item.processusConcerne || []).some(pc => selProc.includes(String(pc.processus?.id || pc.idProcessus || pc.id)))
    ).filter(item =>
      selTypes.includes('all') || selTypes.includes(String(item.type_pa?.id || item.type?.id || ''))
    ).filter(item =>
      selLieu.includes('all') || selLieu.includes(String(item.lieu?.id || ''))
    ).filter(item => {
      if (!dateFilter.from && !dateFilter.to) return true
      const itemDate = new Date(item.date_constat || item.dateConstat || item.dateCreation || item.createdAt)
      const from = dateFilter.from ? new Date(dateFilter.from) : null
      const to = dateFilter.to ? new Date(dateFilter.to) : null
      if (from && itemDate < from) return false
      if (to && itemDate > to) return false
      return true
    }).filter(item => {
      if (!filterText) return true
      const txt = String(item.constat || item.description || '')
      return txt.toLowerCase().includes(filterText.toLowerCase())
    })
  }

  if (loading) return <div>Chargement...</div>
  if (error) return <div className="text-danger">Erreur lors du chargement des Plans d'action</div>

  const filtered = applyFilters()
  const pageCount = Math.max(1, Math.ceil(filtered.length / itemsPerPage))
  const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  return (
    <>
      <CRow>
        <CCol xs={3}> </CCol>
        <CCol xs={6}>
          <h3 className="text-center">Liste des Plans d'action</h3>
        </CCol>
        <CCol xs={3} className="d-flex justify-content-end">
        </CCol>
      </CRow>
      <CCard className='mb-4'>
        <CCardBody className="text-center p-3">
          <PAListPanel />
        </CCardBody>
      </CCard>

      <CPagination size='sm' align="end" className='mt-3'>
        <CPaginationItem aria-label="Previous" disabled={page === 1} onClick={() => setPage(Math.max(1, page - 1))}>&laquo;</CPaginationItem>
        {[...Array(pageCount)].map((_, idx) => (
          <CPaginationItem key={idx + 1} active={page === idx + 1} onClick={() => setPage(idx + 1)}>{idx + 1}</CPaginationItem>
        ))}
        <CPaginationItem aria-label="Next" disabled={page === pageCount || pageCount === 0} onClick={() => setPage(Math.min(pageCount, page + 1))}>&raquo;</CPaginationItem>
      </CPagination>
    </>
  )
}

export default ListePA
