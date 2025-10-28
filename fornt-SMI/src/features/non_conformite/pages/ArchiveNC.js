import React from 'react'
import {
    CRow,
  CTab, CTabContent, CTabList, CTabPanel, CTabs,
  CCard,
  CCardBody,
  CCardHeader,
  CBadge,
  CCol,
  CButton
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilArrowLeft} from '@coreui/icons'

import {useGetArchived } from '../hooks/useNCData'

// Ajout pour forcer le reload
import { useState } from 'react'
import ArchivedPanel from '../components/panel/ArchivedPanel'

const ArchiveNC = () => {

    // Un reloadFlag par panel
    const [reloadFlagArchived, setReloadFlagArchived] = useState(0);

    // Récupérer les données pour chaque panel
    const { ncData: archived, loading: loadingArchived , error: errorArchived } = useGetArchived(reloadFlagArchived);

    // Fonctions pour forcer le reload de chaque panel
    const handleReloadArchived = () => setReloadFlagArchived(flag => flag + 1);

    return (
        <>
            <CRow>
                <CCol xs={3}  className="d-flex justify-content-start"> 
                   <CButton
                        color='secondary'
                        className="mb-3"
                        href='#/nc/list'
                        >
                        <CIcon icon={cilArrowLeft} className="me-2" />
                        Retour
                    </CButton> 
                </CCol>
                <CCol xs={6}>
                    <h3 className="text-center">Non-conformités archivés</h3>
                </CCol>
                <CCol xs={3} className="d-flex justify-content-end">
                </CCol>
            </CRow>
            <CCard className='mb-4'>
                <CCardBody className="text-center p-3">                           
                    <ArchivedPanel ncData={archived} loading={loadingArchived} error={errorArchived} onReload={handleReloadArchived} />                       
                </CCardBody>
            </CCard>
        </>
    )
}

export default ArchiveNC