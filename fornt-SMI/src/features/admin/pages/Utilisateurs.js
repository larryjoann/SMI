import React, { useState, useEffect } from 'react'
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
    CBadge,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter
} from '@coreui/react'
import { CPagination, CPaginationItem } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilTrash ,cilPen , cilFilter, cilFilterX, cilPlus, cilCloudUpload } from '@coreui/icons/dist/cjs'
import axiosInstance from '../../../api/axiosInstance'
import { getRoleCollaborateurs, importFromAD, deleteRoleCollaborateur } from '../services/roleCollaborateurService'
import { Pop_up } from '../../../components/notification/Pop_up'
import RoleNotAutoSelect from '../../../components/champs/RoleNotAutoSelect'

const Utilisateurs = () => {
    // roles now represents authorised collaborators (one row per collaborator)
    const [roles, setRoles] = useState([])
    const [loading, setLoading] = useState(false)

    const [filterMatricule, setFilterMatricule] = useState('')
    const [filterRole, setFilterRole] = useState('')
    const [appliedFilterMatricule, setAppliedFilterMatricule] = useState('')
    const [appliedFilterRole, setAppliedFilterRole] = useState('')
    const [page, setPage] = useState(1)
    const itemsPerPage = 10
    const [uploading, setUploading] = useState(false)

    // États pour les modals
    const [deleteModalVisible, setDeleteModalVisible] = useState(false)
    const [deleteModalId, setDeleteModalId] = useState(null)
    const [showToast, setShowToast] = useState(false)
    const [popMessage, setPopMessage] = useState('')
    const [popType, setPopType] = useState('success') // 'success', 'danger', etc.

    // Charger les données depuis l'API
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                setLoading(true)
                const data = await getRoleCollaborateurs()
                // Mapper la réponse API au format attendu par le tableau
                const transformedData = (data || []).map(item => ({
                    id: item.id,
                    roleId: item.role?.id || '', // Ajouter l'ID du rôle pour le filtrage
                    role: item.role?.nom || 'N/A',
                    matricule: item.matriculeCollaborateur || '',
                    nom: item.collaborateur?.nomAffichage || 'N/A'
                }))
                setRoles(transformedData)
            } catch (err) {
                console.error('Erreur lors du chargement des rôles:', err)
                setRoles([])
            } finally {
                setLoading(false)
            }
        }
        fetchRoles()
    }, [])

    // derive unique roles for the filter dropdown
    const uniqueRoles = [...new Set(roles.map(r => r.role))]

    // apply filters
    const filtered = roles.filter(r => {
        const matchMat = appliedFilterMatricule ? String(r.nom || '').toLowerCase().includes(appliedFilterMatricule.toLowerCase()) : true
        const matchRole = appliedFilterRole ? String(r.roleId) === appliedFilterRole : true
        return matchMat && matchRole
    })

    // Réinitialiser les filtres
    const handleResetFilter = () => {
        setFilterMatricule('')
        setFilterRole('')
        setAppliedFilterMatricule('')
        setAppliedFilterRole('')
        setPage(1)
    }

    // Gérer la soumission du formulaire de filtrage
    const handleFilterSubmit = (e) => {
        e.preventDefault()
        setAppliedFilterMatricule(filterMatricule)
        setAppliedFilterRole(filterRole)
        setPage(1)
    }

    // Supprimer une assignation de rôle
    const handleDelete = async (id) => {
        setDeleteModalId(id)
        setDeleteModalVisible(true)
    }

    // Confirmer la suppression
    const confirmDelete = async () => {
        try {
            await deleteRoleCollaborateur(deleteModalId)
            // Recharger les données après suppression
            const data = await getRoleCollaborateurs()
            const transformedData = (data || []).map(item => ({
                id: item.id,
                roleId: item.role?.id || '', // Ajouter l'ID du rôle pour le filtrage
                role: item.role?.nom || 'N/A',
                matricule: item.matriculeCollaborateur || '',
                nom: item.collaborateur?.nomAffichage || 'N/A'
            }))
            setRoles(transformedData)
            setDeleteModalVisible(false)
            setDeleteModalId(null)
            setPopMessage('Utilisateur supprimé avec succès')
            setPopType('success')
            setShowToast(true)
        } catch (err) {
            console.error('Erreur lors de la suppression:', err)
            setDeleteModalVisible(false)
            setDeleteModalId(null)
            setPopMessage('Erreur lors de la suppression de l\'utilisateur')
            setPopType('danger')
            setShowToast(true)
        }
    }

    return (
        <>
             <CRow className=''>
                <CCol xs={3} className="d-flex justify-content-start">
                </CCol>
                <CCol xs={6}>
                    <h3 className="text-center">Gestion des utilisateurs</h3>
                </CCol>
                <CCol xs={3} className="d-flex justify-content-end">
                    <CButton
                        color='primary'
                        key='1'
                        className="mb-3"
                        href='/administration/utilisateurs/form'
                    >
                        <CIcon icon={cilPlus} className="me-2" />
                        Nouvelle utilisateurs
                    </CButton>
                    <CButton
                        color='secondary'
                        key='2'
                        className="mb-3 ms-2"
                        onClick={async () => {
                            try {
                                setUploading(true)
                                const res = await importFromAD()
                                console.log('ImportFromAD response', res)
                                const message = (res && (res.message || res.error)) || 'Importation terminée.'
                                setPopMessage(message)
                                setPopType('success')
                                setShowToast(true)
                            } catch (err) {
                                console.error('ImportFromAD error', err)
                                const detail = err?.response?.data?.detail || err?.response?.data?.error || err.message || 'Erreur lors de l\'import depuis Active Directory.'
                                setPopMessage(detail)
                                setPopType('danger')
                                setShowToast(true)
                            } finally {
                                setUploading(false)
                            }
                        }}
                        disabled={uploading}
                    >
                        <CIcon icon={cilCloudUpload} className="me-2" />
                        {uploading ? 'Import en cours...' : 'Importer depuis AD'}
                    </CButton>
                </CCol>
            </CRow>
            
            <CCard className='mb-3'>
                <CCardHeader className="">
                    <span className='h6'>Filtre</span>
                </CCardHeader>
                <CCardBody className=''>
                    <CForm className="row g-3" onSubmit={handleFilterSubmit}>
                        
                        <CCol sm={4}>
                            <div className="form-floating">
                                <RoleNotAutoSelect
                                    onChange={(e) => { setFilterRole(e.target.value) }}
                                    value={filterRole}
                                />
                                <label htmlFor="filterRole" style={{ paddingLeft: '10px' }}>Role</label>
                            </div>
                        </CCol>
                        <CCol sm={6}>
                            <div className="form-floating">
                                <CFormInput
                                    id="filterMatricule"
                                    placeholder=" "
                                    value={filterMatricule}
                                    onChange={(e) => { setFilterMatricule(e.target.value) }}
                                />
                                <label htmlFor="filterMatricule">Nom </label>
                            </div>
                        </CCol>
                        <CCol sm={2} className="d-flex justify-content-center align-items-center">
                            <CButton color="danger" className="me-2" type="button" onClick={handleResetFilter}>
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
                    <CTable bordered responsive hover>
                        <CTableHead>
                            <CTableRow>
                                <CTableHeaderCell style={{ width: '55%' }}>Role</CTableHeaderCell>
                                <CTableHeaderCell style={{ width: '35%' }}>Nom</CTableHeaderCell>
                                <CTableHeaderCell style={{ width: '10%' }}></CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            {loading ? (
                                <CTableRow>
                                    <CTableDataCell colSpan={3} className="text-center">
                                        Chargement des données...
                                    </CTableDataCell>
                                </CTableRow>
                            ) : filtered && filtered.length > 0 ? (
                                // paginate collaborators
                                filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage).map((collab, idx) => (
                                        <CTableRow key={collab.id || idx}>
                                                <CTableDataCell>{collab.role}</CTableDataCell>
                                                <CTableDataCell>{collab.nom}</CTableDataCell>
                                                <CTableDataCell className="text-center align-middle">
                                                    <CIcon 
                                                        icon={cilTrash} 
                                                        className="text-danger" 
                                                        size='md' 
                                                        style={{ cursor: 'pointer' }}
                                                        onClick={() => handleDelete(collab.id)}
                                                    />
                                                </CTableDataCell>
                                            </CTableRow>
                                ))
                            ) : (
                                <CTableRow>
                                    <CTableDataCell colSpan={3} className="text-center">
                                        Aucun rôle disponible
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
                        {[...Array(Math.ceil((roles ? roles.length : 0) / itemsPerPage))].map((_, idx) => (
                            <CPaginationItem key={idx + 1} active={page === idx + 1} onClick={() => setPage(idx + 1)}>
                                {idx + 1}
                            </CPaginationItem>
                        ))}
                        <CPaginationItem aria-label="Next" disabled={page === Math.ceil((roles ? roles.length : 0) / itemsPerPage) || Math.ceil((roles ? roles.length : 0) / itemsPerPage) === 0} onClick={() => setPage(page + 1)}>
                            <span aria-hidden="true">&raquo;</span>
                        </CPaginationItem>
                    </CPagination>
                </CCardBody>
            </CCard>

            {/* Modal de confirmation de suppression */}
            <CModal alignment="center" visible={deleteModalVisible} onClose={() => setDeleteModalVisible(false)} backdrop="static">
                <CModalHeader>
                    <CModalTitle>Confirmation de suppression</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action ne peut pas être annulée.
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setDeleteModalVisible(false)}>
                        Annuler
                    </CButton>
                    <CButton color="danger" onClick={confirmDelete}>
                        Supprimer
                    </CButton>
                </CModalFooter>
            </CModal>

            {/* Pop_up de notification */}
            <Pop_up
                show={showToast}
                type={popType}
                message={popMessage}
            />
        </>
    )
}

export default Utilisateurs