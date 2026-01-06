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
import CIcon from '@coreui/icons-react'
import { cilArrowLeft } from '@coreui/icons'
import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

const HistoriqueActivitePA = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const [rows, setRows] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        // Pour l'instant on initialise avec des valeurs statiques
        if (!id) return
        setLoading(true)
        setError(null)

        // Simuler un fetch avec des données statiques
        const staticData = [
            {
                id: 1,
                operation: { nom: 'Création' },
                collaborateur: { nomAffichage: 'Dupont Jean' },
                descr: 'Création de la PA et initialisation des champs',
                datetime: new Date().toISOString(),
            },
            {
                id: 2,
                operation: { nom: 'Assignation' },
                collaborateur: { nomAffichage: 'Martin Claire' },
                descr: 'Assignation à l\'équipe qualité',
                datetime: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
            },
            {
                id: 3,
                operation: { nom: 'Validation' },
                collaborateur: { nomAffichage: 'Moreau Paul' },
                descr: 'Validation des actions planifiées',
                datetime: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
            },
        ]

        // Simuler un délai
        const t = setTimeout(() => {
            setRows(staticData)
            setLoading(false)
        }, 300)

        return () => clearTimeout(t)
    }, [id])

    return (
        <>
            <CRow>
                <CCol xs={3} className="d-flex justify-content-start">
                    <CButton
                        color="secondary"
                        className="mb-3"
                        onClick={() => navigate(`/pa/list/fiche/${id}`)}
                    >
                        <CIcon icon={cilArrowLeft} className="me-2" />
                        Retour
                    </CButton>
                </CCol>
                <CCol xs={6}>
                    <h3 className="text-center">Historiques des activités - PA #{id}</h3>
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

export default HistoriqueActivitePA
