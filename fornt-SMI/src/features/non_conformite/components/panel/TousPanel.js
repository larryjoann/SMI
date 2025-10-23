import React, { useEffect, useState } from 'react'
import { useArchiveNC } from '../../hooks/useNCDetails'
import { Pop_up } from '../../../../components/notification/Pop_up'
import {
  CRow, CCol, CCard, CCardBody, CBadge,
  CDropdown, CDropdownDivider, CDropdownItem, CDropdownMenu, CDropdownToggle,
  CPagination, CPaginationItem
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilTrash, cilOptions, cilPen, cilStorage } from '@coreui/icons'

import FilterDropdown from '../filter/FilterDropdown'
import DateFilterDropdown from '../filter/DateFilterDropdown'
import BadgeFilterDropdownWithPhase from '../filter/BadgeFilterDropdownWithPhase'
import { useProcessOptions, useTypeOptions, useStatusOptions , useLieuOptions } from '../filter/hooks/useFilterOptions'
import { useNavigate } from 'react-router-dom'

// Données NC dynamiques depuis l'API

const TousPanel = ({ ncData = [], loading = false, error = null, onReload }) => {
  const processOptions = useProcessOptions();
  const typeOptions = useTypeOptions();
  const lieuOptions = useLieuOptions();
  const statusOptions = useStatusOptions();
  const navigate = useNavigate();

  // Hook pour archiver une NC (simplifié)
  const { archive, loading: archiving, error: archiveError, showToast, setShowToast, popType, popMessage } = useArchiveNC();
  const [archivedId, setArchivedId] = useState(null);

  const [selectedProcesses, setSelectedProcesses] = useState([])
  const [selectedTypes, setSelectedTypes] = useState([])
  const [selectedLieu, setSelectedLieu] = useState([])
  const [selectedStatus, setSelectedStatus] = useState([])
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
  useEffect(() => {
    if (statusOptions.length > 0) setSelectedStatus(statusOptions.map(opt => opt.id))
  }, [statusOptions])
  const filterNC = () => {
    return ncData.filter(item =>
      selectedProcesses.includes('all') || (item.processusConcerne || []).some(pc => selectedProcesses.map(String).includes(String(pc.processus.id)))
    ).filter(item =>
      selectedTypes.includes('all') || selectedTypes.includes(item.nc.typeNc.id)
    ).filter(item =>
      selectedLieu.includes('all') || selectedLieu.includes(item.nc.lieu?.id)
    ).filter(item =>
      selectedStatus.includes('all') || selectedStatus.includes(item.nc.statusNc.id)
    ).filter(item => {
      if (!dateFilter.from && !dateFilter.to) return true
      const itemDate = new Date(item.nc.dateTimeCreation)
      const from = dateFilter.from ? new Date(dateFilter.from) : null
      const to = dateFilter.to ? new Date(dateFilter.to) : null
      if (from && itemDate < from) return false
      if (to && itemDate > to) return false
      return true
    })
    //return ncData;
  }


  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur lors du chargement des NC</div>;
  if (archiving) return <div>Archivage en cours...</div>;
  if (archiveError) return <div className="text-danger">Erreur lors de l'archivage : {archiveError}</div>;

  // Masquer l'élément archivé immédiatement
  const filteredNC = filterNC().filter(nc => nc.id !== archivedId);
  const pageCount = Math.ceil(filteredNC.length / itemsPerPage);
  const paginatedNC = filteredNC.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <>
      <Pop_up
        show={showToast}
        type={popType}
        message={popMessage}
        onClose={() => setShowToast(false)}
      />
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
        <CCol xs={3}>
          <BadgeFilterDropdownWithPhase
            label="Status"
            options={statusOptions}
            selected={selectedStatus}
            onChange={setSelectedStatus}
          />
        </CCol>
        <CCol xs={1}></CCol>
      </CRow>
      <hr/>
  {paginatedNC.map((nc) => (
        <CCard
          className="mb-2 card-list-hover"
          key={nc.nc.id}
          style={{ cursor: 'pointer', opacity: archivedId === nc.nc.id ? 0.5 : 1 }}
          onClick={() => navigate(`/nc/fiche/${nc.nc.id}`)}
        >
          <CCardBody>
            <CRow>
              <CCol xs={2}>{(nc.processusConcerne || []).map(pc => pc.processus.sigle).filter(Boolean).join(', ')}</CCol>
              <CCol xs={2}>{nc.nc.typeNc.nom || ''}</CCol>
              <CCol xs={2}>{nc.nc.lieu.nom || ''}</CCol>
              <CCol xs={2}>{new Date(nc.nc.dateTimeCreation ).toLocaleString()}</CCol>
              <CCol xs={3}>
                <CBadge
                  color={nc.nc.statusNc?.color || 'secondary'}
                  shape="rounded-pill"
                  className="status_badge"
                >
                  {nc.nc.statusNc.nom || ''}
                </CBadge>
              </CCol>
              <CCol xs={1} className="d-flex justify-content-end">
                <CDropdown variant="btn-group" direction="center" onClick={e => e.stopPropagation()}>           
                  <CDropdownToggle caret={false} className="p-0">
                    <CIcon icon={cilOptions} className="text-dark" />
                  </CDropdownToggle>
                  <CDropdownMenu>
                    <CDropdownItem
                      href="#"
                      onClick={async (e) => {
                          e.preventDefault();
                          setArchivedId(nc.nc.id);
                          await archive(nc.nc.id);
                        if (typeof onReload === 'function') onReload();
                        }}
                    >
                      <CIcon icon={cilStorage} className="text-danger me-3" />
                      <span className="text-danger">Archiver</span>
                    </CDropdownItem>
                    <CDropdownDivider />
                    <CDropdownItem
                      href="#"
                      onClick={e => {
                        e.preventDefault();
                        navigate(`/nc/form/${nc.nc.id}`);
                      }}
                    >
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

export default TousPanel