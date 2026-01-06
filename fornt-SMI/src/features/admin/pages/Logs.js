import React, { useState } from 'react'
import {
    CRow,
    CCard,
    CCardBody,
    CCol,
    CButton,
    CTable,
    CSpinner,
    CAlert,
    CCardHeader,
    CForm,
    CFormInput,
    CFormSelect
} from '@coreui/react'
import { CPagination, CPaginationItem } from '@coreui/react'
import { useHistorique } from '../hooks/useHistorique'
import CIcon from '@coreui/icons-react'
import { cilFilter, cilFilterX } from '@coreui/icons/dist/cjs'



const Logs = () => {

    // Use the historique hook which fetches from the API
    const { rows, loading, error, reload } = useHistorique()

    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [page, setPage] = useState(1)
    const itemsPerPage = 10

    const [roles, setRoles] = useState([
        { role: 'Responsable QUA', name: 'Non-conformité', description: "Déclaration de non-conformité" },
        { role: 'All', name: 'Cartographie', description: 'Consultation du cartographie' },
        { role: 'Responsable QUA', name: 'Cartographie', description: 'Gestion des processus' },
        { role: 'Responsable QUA', name: 'Cartographie', description: 'Qualification d\' un NC' },
        { role: 'Resaponsable QUA', name: 'Plan d\' action', description: 'Gestion de plan d\'action' },
    ])
    const [operationName, setOperationName] = useState('')
    const [filterRole, setFilterRole] = useState('')
    const [filterEntite, setFilterEntite] = useState('')

    const entites = ['Cartographie','Non conformité' , 'Plan d\'action' , 'Actions']

    return (
        <>
            <CRow className='mb-2'>
                <CCol xs={3} className="d-flex justify-content-start">
                </CCol>
                <CCol xs={6}>
                    <h3 className="text-center">Historique des activités</h3>
                </CCol>
                <CCol xs={3} className="d-flex justify-content-end"></CCol>
            </CRow>

            <CCard className='mb-3'>
                <CCardHeader className="">
                    <span className='h6'>Filtre</span>
                </CCardHeader>
                <CCardBody className=''>
                    <CForm className="row g-3">
                        <CCol sm={4}>
                            <div className="form-floating">
                                <CFormSelect id="filterEntite" value={filterEntite} onChange={(e) => setFilterEntite(e.target.value)}>
                                    <option value="">Toutes</option>
                                    {entites.map((ent) => (
                                        <option key={ent} value={ent}>{ent}</option>
                                    ))}
                                </CFormSelect>
                                <label htmlFor="filterEntite">Entité</label>
                            </div>
                        </CCol>
                        <CCol sm={3}>
                            <div className="form-floating">
                                <CFormInput
                                id="startDate"
                                type="datetime-local"
                                placeholder=" "
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                />
                                <label htmlFor="startDate">Du</label>
                            </div>
                            </CCol>
                            <CCol sm={3}>
                            <div className="form-floating">
                                <CFormInput
                                id="endDate"
                                type="datetime-local"
                                placeholder=" "
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                />
                                <label htmlFor="endDate">Au</label>
                            </div>
                        </CCol>
                        <CCol sm={2} className="d-flex justify-content-center align-items-center">
                            <CButton color="danger" className="me-2" type="button">
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

            <CCard className="mb-4">
                          <CCardBody className="p-3">
                            {loading && (
                                <div className="text-center py-4"><CSpinner /></div>
                            )}
                            {error && (
                                <CAlert color="danger">{error}</CAlert>
                            )}
                                        <CTable hover responsive>
                        <thead>
                            <tr>
                                <th>Entité</th>
                                <th>Action</th>
                                <th>Par</th>
                                <th>Détails</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(rows && rows.length > 0) ? (
                                // paginate rows
                                rows.slice((page - 1) * itemsPerPage, page * itemsPerPage).map((r) => (
                                    <tr key={r.id}>
                                        <td>{r.entite.nom}</td>
                                        <td>{r.operation?.nom}</td>
                                        <td>{r.collaborateur?.nomAffichage || r.matriculeCollaborateur}</td>
                                        <td>{r.descr}</td>
                                        <td>{new Date(r.datetime).toLocaleString()}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan={5} className="text-center">Aucun historique trouvé</td></tr>
                            )}
                        </tbody>
                    </CTable>
                    {/* Pagination */}
                    <CPagination size='sm' align="end" aria-label="Page navigation" className='mt-0'>
                        <CPaginationItem aria-label="Previous" disabled={page === 1} onClick={() => setPage(page - 1)}>
                            <span aria-hidden="true">&laquo;</span>
                        </CPaginationItem>
                        {[...Array(Math.ceil((rows ? rows.length : 0) / itemsPerPage))].map((_, idx) => (
                            <CPaginationItem key={idx + 1} active={page === idx + 1} onClick={() => setPage(idx + 1)}>
                                {idx + 1}
                            </CPaginationItem>
                        ))}
                        <CPaginationItem aria-label="Next" disabled={page === Math.ceil((rows ? rows.length : 0) / itemsPerPage) || Math.ceil((rows ? rows.length : 0) / itemsPerPage) === 0} onClick={() => setPage(page + 1)}>
                            <span aria-hidden="true">&raquo;</span>
                        </CPaginationItem>
                    </CPagination>
                </CCardBody>
            </CCard>
        </>
    )
}

export default Logs