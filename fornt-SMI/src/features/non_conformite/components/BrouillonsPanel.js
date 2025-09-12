import React, { useState } from 'react'
import {
  CRow, CCol, CCard, CCardBody, CBadge,
  CDropdown, CDropdownDivider, CDropdownItem, CDropdownMenu, CDropdownToggle,
  CPagination, CPaginationItem
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilTrash, cilOptions, cilPen, cilSend } from '@coreui/icons'
import FilterDropdown from './FilterDropdown'
import DateFilterDropdown from './DateFilterDropdown'

const processOptions = [
  { id: 'all', label: 'Tous' },
  { id: 'p1', label: 'QUA' },
  { id: 'p2', label: 'RH' },
  { id: 'p3', label: 'ENV' },
]
const typeOptions = [
  { id: 'all', label: 'Tous' },
  { id: 't1', label: 'KPI non-atteint' },
  { id: 't2', label: 'Audit interne' },
]

const ncData = [
  {
    id: 1,
    process: 'p2',
    type: 't1',
    date: '2024-10-11T11:30:00',
    labelProcess: 'RH - PSG NOS',
    labelType: 'KPI non-atteint',
  },
  {
    id: 2,
    process: 'p1',
    type: 't2',
    date: '2024-09-20T09:15:00',
    labelProcess: 'QUA - QMS',
    labelType: 'Audit interne',
  },
  {
    id: 3,
    process: 'p3',
    type: 't1',
    date: '2024-11-05T14:45:00',
    labelProcess: 'ENV - ISO 14001',
    labelType: 'KPI non-atteint',
  },
  {
    id: 4,
    process: 'p1',
    type: 't1',
    date: '2024-10-01T08:00:00',
    labelProcess: 'QUA - QMS',
    labelType: 'KPI non-atteint',
  },
  {
    id: 5,
    process: 'p2',
    type: 't2',
    date: '2024-09-28T16:20:00',
    labelProcess: 'RH - PSG NOS',
    labelType: 'Audit interne',
  },
  {
    id: 6,
    process: 'p3',
    type: 't2',
    date: '2024-11-10T10:10:00',
    labelProcess: 'ENV - ISO 14001',
    labelType: 'Audit interne',
  },
  {
    id: 7,
    process: 'p1',
    type: 't2',
    date: '2024-10-15T13:30:00',
    labelProcess: 'QUA - QMS',
    labelType: 'Audit interne',
  },
  {
    id: 8,
    process: 'p2',
    type: 't1',
    date: '2024-09-25T11:00:00',
    labelProcess: 'RH - PSG NOS',
    labelType: 'KPI non-atteint',
  },
  {
    id: 9,
    process: 'p3',
    type: 't1',
    date: '2024-11-12T17:40:00',
    labelProcess: 'ENV - ISO 14001',
    labelType: 'KPI non-atteint',
  },
  {
    id: 10,
    process: 'p1',
    type: 't1',
    date: '2024-10-18T07:50:00',
    labelProcess: 'QUA - QMS',
    labelType: 'KPI non-atteint',
  },
  {
    id: 11,
    process: 'p1',
    type: 't1',
    date: '2024-10-18T07:50:00',
    labelProcess: 'QUA - QMS',
    labelType: 'KPI non-atteint',
  },
]

const BrouillonsPanel = () => {
  const [selectedProcesses, setSelectedProcesses] = useState(processOptions.map(opt => opt.id))
  const [selectedTypes, setSelectedTypes] = useState(typeOptions.map(opt => opt.id))
  const [dateFilter, setDateFilter] = useState({ from: '', to: '' })
  const [page, setPage] = useState(1)
  const itemsPerPage = 7

  const filterNC = () => {
    return ncData.filter(item => 
      selectedProcesses.includes('all') || selectedProcesses.includes(item.process)
    ).filter(item =>
      selectedTypes.includes('all') || selectedTypes.includes(item.type)
    ).filter(item => {
      if (!dateFilter.from && !dateFilter.to) return true
      const itemDate = new Date(item.date)
      const from = dateFilter.from ? new Date(dateFilter.from) : null
      const to = dateFilter.to ? new Date(dateFilter.to) : null
      if (from && itemDate < from) return false
      if (to && itemDate > to) return false
      return true
    })
  }

  const filteredNC = filterNC()
  const pageCount = Math.ceil(filteredNC.length / itemsPerPage)
  const paginatedNC = filteredNC.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  return (
    <>
      <CRow>
        <CCol xs={2}>
          <FilterDropdown
            label="Processus concerné"
            options={processOptions}
            selected={selectedProcesses}
            onChange={setSelectedProcesses}
          />
        </CCol>
        <CCol xs={3}>
          <FilterDropdown
            label="Types"
            options={typeOptions}
            selected={selectedTypes}
            onChange={setSelectedTypes}
          />
        </CCol>
        <CCol xs={3}>
          <DateFilterDropdown
            label="Date"
            fromDate={dateFilter.from}
            toDate={dateFilter.to}
            onChange={setDateFilter}
          />
        </CCol>
        <CCol xs={4}></CCol>
      </CRow>
      <hr/>
      {paginatedNC.map((nc) => (
        <CCard className="mb-2 card-list-hover" key={nc.id}>
          <CCardBody>
            <CRow>
              <CCol xs={2}>{nc.labelProcess}</CCol>
              <CCol xs={3}>{nc.labelType}</CCol>
              <CCol xs={3}>{new Date(nc.date).toLocaleString()}</CCol>
              <CCol xs={4} className="d-flex justify-content-end">
                <CIcon icon={cilSend} className="text-primary mt-1 me-3" size='lg' />
                <CDropdown variant="btn-group" direction="center">
                  <CDropdownToggle caret={false} className="p-0">
                    <CIcon icon={cilOptions} className="text-dark" />
                  </CDropdownToggle>
                  <CDropdownMenu>
                    <CDropdownItem href="#">
                      <CIcon icon={cilTrash} className="text-danger me-3" />
                      <span className="text-danger">Supprimer</span>
                    </CDropdownItem>
                    <CDropdownDivider />
                    <CDropdownItem href="#">
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
      <CPagination size='sm' align="end" aria-label="Page navigation example" className='mt-3'>
        <CPaginationItem
          aria-label="Previous"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          <span aria-hidden="true">&laquo;</span>
        </CPaginationItem>
        {[...Array(pageCount)].map((_, idx) => (
          <CPaginationItem
            key={idx + 1}
            active={page === idx + 1}
            onClick={() => setPage(idx + 1)}
          >
            {idx + 1}
          </CPaginationItem>
        ))}
        <CPaginationItem
          aria-label="Next"
          disabled={page === pageCount || pageCount === 0}
          onClick={() => setPage(page + 1)}
        >
          <span aria-hidden="true">&raquo;</span>
        </CPaginationItem>
      </CPagination>
    </>
  )
}

export default BrouillonsPanel