import React from 'react'
import {
    CRow,
  CTab, CTabContent, CTabList, CTabPanel, CTabs,
  CCard,
  CCardBody,
  CCol,
  CButton
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilArrowLeft } from '@coreui/icons'

import { useState } from 'react'
import ArchivedPAPanel from '../components/panel/ArchivedPAPanel'

// Page d'archives pour les Plans d'action (PA)
const ArchivePA = () => {

    // un flag de reload pour forcer le rafraîchissement local
    const [reloadFlag, setReloadFlag] = useState(0)
    const handleReload = () => setReloadFlag(f => f + 1)

    // Données statiques simulées (à remplacer par un appel API plus tard)
    const staticPA = [
        {
            id: 101,
            processusConcernes: [{ processus: { sigle: 'ACH' } }],
            dateConstat: new Date().toISOString(),
            sourcePA: { descr: 'Audit interne' },
            statusPA: { nom: 'Ouvert', color: 'en_qualification' },
        },
        {
            id: 102,
            processusConcernes: [{ processus: { sigle: 'QUA' } }],
            dateConstat: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
            sourcePA: { descr: 'Action corrective' },
            statusPA: { nom: 'Ouvert', color: 'en_qualification' },
        },
        {
            id: 103,
            processusConcernes: [{ processus: { sigle: 'JUR' } }],
            dateConstat: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
            sourcePA: { descr: 'Réclamation client' },
            statusPA: { nom: 'Ouvert', color: 'en_qualification' },
        }
    ]

    return (
        <>
            <CRow>
                <CCol xs={3} className="d-flex justify-content-start">
                    <CButton
                        color='secondary'
                        className="mb-3"
                        href='/pa/list'
                    >
                        <CIcon icon={cilArrowLeft} className="me-2" />
                        Retour
                    </CButton>
                </CCol>
                <CCol xs={6}>
                    <h3 className="text-center">Plans d'action archivés</h3>
                </CCol>
                <CCol xs={3} className="d-flex justify-content-end">
                </CCol>
            </CRow>
            <CCard className='mb-4'>
                <CCardBody className="text-center p-3">
                    <ArchivedPAPanel paData={staticPA} loading={false} error={null} onReload={handleReload} />
                </CCardBody>
            </CCard>
        </>
    )
}

export default ArchivePA
