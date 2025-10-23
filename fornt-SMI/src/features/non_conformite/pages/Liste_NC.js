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
import { cilStorage} from '@coreui/icons'


import DeclarationsPanel from '../components/panel/DeclarationsPanel'
import BrouillonsPanel from '../components/panel/BrouillonsPanel'
import TousPanel from '../components/panel/TousPanel'
import { useGetDeclaration, useGetBrouillon , useGetAll } from '../hooks/useNCData'

// Ajout pour forcer le reload
import { useState } from 'react'
import { useLocation } from 'react-router-dom'




const Liste_NC = () => {
    const location = useLocation();

    // Un reloadFlag par panel
    const [reloadFlagBrouillon, setReloadFlagBrouillon] = useState(0);
    const [reloadFlagDeclaration, setReloadFlagDeclaration] = useState(0);
    const [reloadFlagTous, setReloadFlagTous] = useState(0);

    // Récupérer les données pour chaque panel
    const { ncData: brouillons, loading: loadingBrouillons, error: errorBrouillon } = useGetBrouillon(reloadFlagBrouillon);
    const { ncData: declarations, loading: loadingDeclarations, error: errorDeclarations } = useGetDeclaration(reloadFlagDeclaration);
    const { ncData: all, loading: loadingall , error: errorAll } = useGetAll(reloadFlagTous);

    // Fonctions pour forcer le reload de chaque panel
    const handleReloadBrouillon = () => setReloadFlagBrouillon(flag => flag + 1);
    const handleReloadDeclaration = () => setReloadFlagDeclaration(flag => flag + 1);
    const handleReloadTous = () => setReloadFlagTous(flag => flag + 1);

    // Déterminer le panel par défaut selon la navigation
    const defaultPanel = location.state && location.state.defaultPanel ? location.state.defaultPanel : "declaration";

    return (
        <>
            <CRow>
                <CCol xs={3}> </CCol>
                <CCol xs={6}>
                    <h3 className="text-center">Liste des non-conformités</h3>
                </CCol>
                <CCol xs={3} className="d-flex justify-content-end">
                    <CButton
                        color='secondary'
                        key='1'
                        shape=""
                        className="mb-3"
                        href='#'
                    >
                        <CIcon icon={cilStorage} className="me-2" />
                        Archives
                    </CButton>
                </CCol>
            </CRow>
            <CCard className='mb-4'>
                <CTabs defaultActiveItemKey={defaultPanel} className="text-center">
                    <CCardHeader style={{ padding: 0, borderBottom: 'none'}}>
                        <CTabList variant="tabs">
                            <CTab itemKey="brouillon" className="d-flex align-items-center">
                                <h6 className='m-1'>Mes Brouillons</h6>
                                <CBadge className="custom-badge">
                                    {loadingBrouillons ? '...' : brouillons.length}
                                </CBadge>
                            </CTab>
                            <CTab itemKey="declaration" className="d-flex align-items-center">
                                <h6 className='m-1'>Mes déclarations</h6>
                                <CBadge className="custom-badge">
                                    {loadingDeclarations ? '...' : declarations.length}
                                </CBadge>
                            </CTab>
                            <CTab itemKey="tous" className="d-flex align-items-center">
                                <h6 className='m-1'>Tous</h6>
                                <CBadge className="custom-badge">
                                    {loadingall ? '...' : all.length}
                                </CBadge>
                            </CTab>
                        </CTabList>
                    </CCardHeader>
                    <CCardBody>
                        <CTabContent >
                            <CTabPanel className="p-3" itemKey="brouillon">
                                <BrouillonsPanel 
                                    ncData={brouillons} 
                                    loading={loadingBrouillons} 
                                    error={errorBrouillon} 
                                    onReload={handleReloadBrouillon} 
                                    onDeclareSuccess={() => { handleReloadDeclaration(); handleReloadTous(); }} 
                                />
                            </CTabPanel>
                            <CTabPanel className="p-3" itemKey="declaration">
                                <DeclarationsPanel ncData={declarations} loading={loadingDeclarations} error={errorDeclarations} onReload={handleReloadDeclaration} />
                            </CTabPanel>
                            <CTabPanel className="p-3" itemKey="tous">
                                <TousPanel ncData={all} loading={loadingall} error={errorAll} onReload={handleReloadTous} />
                            </CTabPanel>
                        </CTabContent>
                    </CCardBody>
                </CTabs>
            </CCard>
        </>
    )
}

export default Liste_NC