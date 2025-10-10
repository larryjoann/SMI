import React, { useEffect, useState } from 'react'
import {
  CRow, CCol, CCard, CCardBody, CBadge,
  CDropdown, CDropdownDivider, CDropdownItem, CDropdownMenu, CDropdownToggle,
  CPagination, CPaginationItem
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilTrash, cilOptions, cilPen, cilSend } from '@coreui/icons'



import FilterDropdown from '../filter/FilterDropdown'
import DateFilterDropdown from '../filter/DateFilterDropdown'
import { useProcessOptions, useTypeOptions, useLieuOptions } from '../filter/hooks/useFilterOptions'
import { useNavigate } from 'react-router-dom'




const BrouillonsPanel = ({ ncData = [], loading = false, error = null }) => {
  const processOptions = useProcessOptions();
  const typeOptions = useTypeOptions();
  const lieuOptions = useLieuOptions();
  const navigate = useNavigate();

  const [selectedProcesses, setSelectedProcesses] = useState([])
  const [selectedTypes, setSelectedTypes] = useState([])
  const [selectedLieu, setSelectedLieu] = useState([])
  const [dateFilter, setDateFilter] = useState({ from: '', to: '' })
  const [page, setPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    if (processOptions.length > 0) setSelectedProcesses(processOptions.map(opt => opt.id))
  }, [processOptions])
  useEffect(() => {
    if (typeOptions.length > 0) setSelectedTypes(typeOptions.map(opt => opt.id))
  }, [typeOptions])
  useEffect(() => {
    if (lieuOptions.length > 0) setSelectedLieu(lieuOptions.map(opt => opt.id))
  }, [lieuOptions])

  const filterNC = () => {
    return ncData.filter(item =>
      selectedProcesses.includes('all') || item.processes?.some(procId => selectedProcesses.includes(procId))
    ).filter(item =>
      selectedTypes.includes('all') || selectedTypes.includes(item.type)
    ).filter(item =>
      selectedLieu.includes('all') || selectedLieu.includes(item.lieu)
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

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur lors du chargement des brouillons</div>;

  const filteredNC = filterNC();
  const pageCount = Math.ceil(filteredNC.length / itemsPerPage);
  const paginatedNC = filteredNC.slice((page - 1) * itemsPerPage, page * itemsPerPage);

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
        <CCol xs={2}>
          <FilterDropdown
            label="Types"
            options={typeOptions}
            selected={selectedTypes}
            onChange={setSelectedTypes}
          />
        </CCol>
        <CCol xs={2}>
          <FilterDropdown
            label="Lieu"
            options={lieuOptions}
            selected={selectedLieu}
            onChange={setSelectedLieu}
          />
        </CCol>
        <CCol xs={2}>
          <DateFilterDropdown
            label="Date"
            fromDate={dateFilter.from}
            toDate={dateFilter.to}
            onChange={setDateFilter}
          />
        </CCol>
        <CCol xs={3}></CCol>
      </CRow>
      <hr/>
      {paginatedNC.map((nc) => (
        <CCard
          className="mb-2 card-list-hover"
          key={nc.id}
          style={{ cursor: 'pointer' }}
          onClick={() => navigate(`/nc/fiche/${nc.id}`)}
        >
          <CCardBody>
            <CRow>
              <CCol xs={2}>{nc.labelProcesses?.join(', ')}</CCol>
              <CCol xs={2}>{nc.labelType}</CCol>
              <CCol xs={2}>{nc.labelLieu}</CCol>
              <CCol xs={2}>{new Date(nc.date).toLocaleString()}</CCol>
              <CCol xs={4} className="d-flex justify-content-end">
                <CIcon icon={cilSend} className="text-primary mt-1 me-3" size='lg' />
                <CDropdown variant="btn-group" direction="center" onClick={e => e.stopPropagation()}>
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