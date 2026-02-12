import React, { useState } from 'react'
import {
    CCard,
    CCardBody,
    CCardHeader,
    CTable,
    CTableHead,
    CTableBody,
    CTableRow,
    CTableHeaderCell,
    CTableDataCell,
    CButton,
    CRow,
    CForm,
    CFormInput,
    CFormSelect,
    CCol,
} from '@coreui/react'
import { CPagination, CPaginationItem } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilTrash ,cilPen , cilFilter, cilFilterX, cilPlus } from '@coreui/icons/dist/cjs'
import { useAutorisations } from '../../../hooks/useAutorisations'
import RoleSelect from '../../../components/champs/RoleSelect'
import EntiteSelect from '../../../components/champs/EntiteSelect'

const Autorisation = () => {
    const { rolePermissions, loading, error, deleteRolePermission, getUniqueRoles, getUniqueEntites, fetchRolePermissions, fetchFilteredRolePermissions } = useAutorisations()

    const [operationName, setOperationName] = useState('')
    const [filterRoleId, setFilterRoleId] = useState('')
    const [filterEntiteId, setFilterEntiteId] = useState('')

    // Applied filters only change when user clicks "Filtrer"
    const [appliedFilterRoleId, setAppliedFilterRoleId] = useState('')
    const [appliedFilterEntiteId, setAppliedFilterEntiteId] = useState('')
    const [appliedOperationName, setAppliedOperationName] = useState('')

    const [page, setPage] = useState(1)
    const itemsPerPage = 10

    // Filtrer les données
    const filteredRolePermissions = rolePermissions.filter((rp) => {
        const matchRole = !appliedFilterRoleId || rp.role?.id === Number(appliedFilterRoleId)
        const matchEntite = !appliedFilterEntiteId || rp.permission?.entite?.id === Number(appliedFilterEntiteId)
        const matchOperation = !appliedOperationName || rp.permission?.nom?.toLowerCase().includes(appliedOperationName.toLowerCase())
        return matchRole && matchEntite && matchOperation
    })

    const handleDeleteRolePermission = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette autorisation ?')) {
            try {
                await deleteRolePermission(id)
            } catch (err) {
                console.error('Erreur:', err)
            }
        }
    }

    const handleFilterSubmit = async (e) => {
        e.preventDefault()
        // derive names from currently loaded data if possible
        let roleName = ''
        let entiteName = ''
        if (filterRoleId) {
            const r = rolePermissions.find((rp) => rp.role?.id === Number(filterRoleId))
            roleName = r?.role?.nom || ''
        }
        if (filterEntiteId) {
            const r2 = rolePermissions.find((rp) => rp.permission?.entite?.id === Number(filterEntiteId))
            entiteName = r2?.permission?.entite?.nom || ''
        }
        try {
            // apply the chosen filters locally
            setAppliedFilterRoleId(filterRoleId)
            setAppliedFilterEntiteId(filterEntiteId)
            setAppliedOperationName(operationName)

            await fetchFilteredRolePermissions(roleName, entiteName, operationName)
            setPage(1)
        } catch (err) {
            console.error('Erreur filtrage autorisations:', err)
        }
    }

    const handleClearFilters = async () => {
        setOperationName('')
        setFilterRoleId('')
        setFilterEntiteId('')

        // clear applied filters too
        setAppliedFilterRoleId('')
        setAppliedFilterEntiteId('')
        setAppliedOperationName('')

        setPage(1)
        try {
            await fetchRolePermissions()
        } catch (err) {
            console.error('Erreur rechargement autorisations:', err)
        }
    }

    return (
        <>
             <CRow className=''>
                <CCol xs={3} className="d-flex justify-content-start">
                </CCol>
                <CCol xs={6}>
                    <h3 className="text-center">Gestion des autorisations</h3>
                </CCol>
                <CCol xs={3} className="d-flex justify-content-end">
                    <CButton
                        color='primary'
                        key='1'
                        className="mb-3"
                        href='#/administration/autorisation/form'
                    >
                        <CIcon icon={cilPlus} className="me-2" />
                        Nouvelle autorisation
                    </CButton>
                </CCol>
            </CRow>
            
            <CCard className='mb-3'>
                <CCardHeader className="">
                    <span className='h6'>Filtre</span>
                </CCardHeader>
                <CCardBody className=''>
                    <CForm className="row g-3" onSubmit={handleFilterSubmit}>
                        
                        <CCol sm={3}>
                            <div className="form-floating">
                                <RoleSelect id="filterRole" placeholder="Tous" value={filterRoleId} onChange={(e) => setFilterRoleId(e.target ? e.target.value : e)} />
                                <label htmlFor="filterRole">Role</label>
                            </div>
                        </CCol>
                        <CCol sm={3}>
                            <div className="form-floating">
                                <EntiteSelect id="filterEntite" placeholder="Toutes" value={filterEntiteId} onChange={(e) => setFilterEntiteId(e.target ? e.target.value : e)} />
                                <label htmlFor="filterEntite">Entité</label>
                            </div>
                        </CCol>
                        <CCol sm={4}>
                            <div className="form-floating">
                                <CFormInput
                                    id="operationName"
                                    placeholder=" "
                                    value={operationName}
                                    onChange={(e) => setOperationName(e.target.value)}
                                />
                                <label htmlFor="operationName">Nom de l'opération</label>
                            </div>
                        </CCol>
                        <CCol sm={2} className="d-flex justify-content-center align-items-center">
                            <CButton color="danger" className="me-2" type="button" onClick={handleClearFilters}>
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
            
            <CCard className="mb-3">
                <CCardBody>
                    {loading && <p className="text-center">Chargement...</p>}
                    {error && <p className="text-center text-danger">{error}</p>}
                    {!loading && (
                        <>
                            <CTable bordered responsive hover>
                                <CTableHead>
                                    <CTableRow>
                                        <CTableHeaderCell style={{ width: '30%' }}>Rôle</CTableHeaderCell>
                                        <CTableHeaderCell style={{ width: '20%' }}>Entité</CTableHeaderCell>
                                        <CTableHeaderCell style={{ width: '40%'}} >Permission</CTableHeaderCell>
                                        <CTableHeaderCell ></CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {filteredRolePermissions && filteredRolePermissions.length > 0 ? (
                                        // paginate roles
                                        filteredRolePermissions.slice((page - 1) * itemsPerPage, page * itemsPerPage).map((rolePermission) => (
                                            <CTableRow key={rolePermission.id}>
                                                <CTableDataCell>{rolePermission.role?.nom}</CTableDataCell>
                                                <CTableDataCell>{rolePermission.permission?.entite?.nom}</CTableDataCell>
                                                <CTableDataCell>{rolePermission.permission?.nom}</CTableDataCell>
                                                <CTableDataCell className="text-center align-middle">
                                                    <CIcon 
                                                        icon={cilTrash} 
                                                        className="text-danger me-2" 
                                                        size='md' 
                                                        style={{ cursor: 'pointer' }}
                                                        onClick={() => handleDeleteRolePermission(rolePermission.id)}
                                                    />
                                                </CTableDataCell>
                                            </CTableRow>
                                        ))
                                    ) : (
                                        <CTableRow>
                                            <CTableDataCell colSpan={4} className="text-center">
                                                Aucune autorisation disponible
                                            </CTableDataCell>
                                        </CTableRow>
                                    )}
                                </CTableBody>
                            </CTable>
                            {/* Pagination */}
                            <CPagination size='sm' align="end" aria-label="Page navigation" className='mt-0'>
                                <CPaginationItem aria-label="Previous" disabled={page === 1} onClick={() => setPage(page - 1)}>
                                    <span aria-hidden="true">&laquo;</span>
                                </CPaginationItem>
                                {[...Array(Math.ceil((filteredRolePermissions ? filteredRolePermissions.length : 0) / itemsPerPage))].map((_, idx) => (
                                    <CPaginationItem key={idx + 1} active={page === idx + 1} onClick={() => setPage(idx + 1)}>
                                        {idx + 1}
                                    </CPaginationItem>
                                ))}
                                <CPaginationItem aria-label="Next" disabled={page === Math.ceil((filteredRolePermissions ? filteredRolePermissions.length : 0) / itemsPerPage) || Math.ceil((filteredRolePermissions ? filteredRolePermissions.length : 0) / itemsPerPage) === 0} onClick={() => setPage(page + 1)}>
                                    <span aria-hidden="true">&raquo;</span>
                                </CPaginationItem>
                            </CPagination>
                        </>
                    )}
                </CCardBody>
            </CCard>
        </>
    )
}

export default Autorisation