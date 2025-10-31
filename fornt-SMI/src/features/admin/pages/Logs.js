import React from 'react'
import {
    CRow,
    CCard,
    CCardBody,
    CCol,
    CButton,
    CTable,
    CSpinner,
    CAlert,
} from '@coreui/react'
import { useHistorique } from '../hooks/useHistorique'


const Logs = () => {

    // Use the historique hook which fetches from the API
    const { rows, loading, error, reload } = useHistorique()

    return (
        <>
            <CRow className='mb-2'>
                <CCol xs={3} className="d-flex justify-content-start">
                </CCol>
                <CCol xs={6}>
                    <h3 className="text-center">Historiques des activités</h3>
                </CCol>
                <CCol xs={3} className="d-flex justify-content-end"></CCol>
            </CRow>

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
                            {(rows && rows.length > 0) ? rows.map((r) => (
                                <tr key={r.id}>
                                    <td>{r.entite.nom}</td>
                                    <td>{r.operation?.nom}</td>
                                    <td>{r.collaborateur?.nomAffichage || r.matriculeCollaborateur}</td>
                                    <td>{r.descr}</td>
                                    <td>{new Date(r.datetime).toLocaleString()}</td>
                                </tr>
                            )) : (
                                <tr><td colSpan={4} className="text-center">Aucun historique trouvé</td></tr>
                            )}
                        </tbody>
                    </CTable>
                </CCardBody>
            </CCard>
        </>
    )
}

export default Logs