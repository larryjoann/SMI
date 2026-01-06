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

const Autorisation = () => {
    const { rolePermissions, loading, error, deleteRolePermission, getUniqueRoles, getUniqueEntites } = useAutorisations()

    const [operationName, setOperationName] = useState('')
    const [filterRole, setFilterRole] = useState('')
    const [filterEntite, setFilterEntite] = useState('')
    const [page, setPage] = useState(1)
    const itemsPerPage = 10

    // Filtrer les données
    const filteredRolePermissions = rolePermissions.filter((rp) => {
        const matchRole = !filterRole || rp.role?.nom === filterRole
        const matchEntite = !filterEntite || rp.permission?.entite?.nom === filterEntite
        const matchOperation = !operationName || rp.permission?.nom?.toLowerCase().includes(operationName.toLowerCase())
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

    const handleClearFilters = () => {
        setOperationName('')
        setFilterRole('')
        setFilterEntite('')
        setPage(1)
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
                        href='/administration/autorisation/form'
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
                    <CForm className="row g-3">
                        
                        <CCol sm={3}>
                            <div className="form-floating">
                                <CFormSelect id="filterRole" value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
                                    <option value="">Tous</option>
                                    {getUniqueRoles().map((roleName) => (
                                        <option key={roleName} value={roleName}>{roleName}</option>
                                    ))}
                                </CFormSelect>
                                <label htmlFor="filterRole">Role</label>
                            </div>
                        </CCol>
                        <CCol sm={3}>
                            <div className="form-floating">
                                <CFormSelect id="filterEntite" value={filterEntite} onChange={(e) => setFilterEntite(e.target.value)}>
                                    <option value="">Toutes</option>
                                    {getUniqueEntites().map((entiteName) => (
                                        <option key={entiteName} value={entiteName}>{entiteName}</option>
                                    ))}
                                </CFormSelect>
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