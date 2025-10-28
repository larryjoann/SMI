import React from 'react'
import {
    CRow,
    CCard,
    CCardBody,
    CCol,
    CButton,
    CTable,
    CBadge,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilArrowLeft } from '@coreui/icons'
import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getHistoriqueNC } from '../services/nonConformiteService'
import { CSpinner, CAlert } from '@coreui/react'


const HistoActiviteNC = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const [rows, setRows] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!id) return
        setLoading(true)
        setError(null)
        getHistoriqueNC(id)
            .then(data => {
                // Expecting an array of historique items
                setRows(Array.isArray(data) ? data : [])
            })
            .catch(err => {
                console.error('Error fetching historique:', err)
                setError(err?.response?.data?.message || err?.message || 'Erreur lors du chargement de l\'historique')
            })
            .finally(() => setLoading(false))
    }, [id])

    const statusColor = (s) => {
        if (!s) return 'secondary'
        const key = s.toLowerCase()
        if (key.includes('brouillon')) return 'secondary'
        if (key.includes('en cours') || key.includes('encours') || key.includes('en-cours')) return 'warning'
        if (key.includes('archiv')) return 'dark'
        if (key.includes('archivée') || key.includes('archivée')) return 'dark'
        if (key.includes('termin') || key.includes('termine')) return 'success'
        return 'primary'
    }

    return (
        <>
            <CRow>
                <CCol xs={3} className="d-flex justify-content-start">
                    <CButton
                        color="secondary"
                        className="mb-3"
                       onClick={() => navigate(`/nc/fiche/${id}`)}
                    >
                        <CIcon icon={cilArrowLeft} className="me-2" />
                        Retour
                    </CButton>
                </CCol>
                <CCol xs={6}>
                    <h3 className="text-center">Historiques des activités - NC #{id}</h3>
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
                                <th>Action</th>
                                <th>Par</th>
                                <th>Détails</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(rows && rows.length > 0) ? rows.map((r) => (
                                <tr key={r.id}>
                                    <td>{r.operation?.nom || r.idOperation}</td>
                                    <td>{r.collaborateur?.nomAffichage || r.matriculeCollaborateur}</td>
                                    <td>{r.descr}</td>
                                    <td>{new Date(r.datetime).toLocaleString()}</td>
                                </tr>
                            )) : (
                                !loading && <tr><td colSpan={4} className="text-center">Aucun historique trouvé</td></tr>
                            )}
                        </tbody>
                    </CTable>
                </CCardBody>
            </CCard>
        </>
    )
}

export default HistoActiviteNC