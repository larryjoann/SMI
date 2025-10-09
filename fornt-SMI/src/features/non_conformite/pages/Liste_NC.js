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
import { cilTrash} from '@coreui/icons'


import DeclarationsPanel from '../components/panel/DeclarationsPanel'
import BrouillonsPanel from '../components/panel/BrouillonsPanel'
import TousPanel from '../components/panel/TousPanel'
import { useGetDeclaration, useGetBrouillon , useGetAll } from '../services/useNCData'


const Liste_NC = () => {
    // Récupérer les données pour compter les NC
    const { ncData: brouillons, loading: loadingBrouillons, error: errorBrouillon } = useGetBrouillon();
    const { ncData: declarations, loading: loadingDeclarations, error: errorDeclarations } = useGetDeclaration();
    const { ncData: all, loading: loadingall , error: errorAll } = useGetAll();
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
                        href='#/indicateur/form'
                    >
                        <CIcon icon={cilTrash} className="me-2" />
                        Corbeille
                    </CButton>
                </CCol>
            </CRow>
            <CCard className='mb-4'>
                <CTabs defaultActiveItemKey="declaration" className="text-center">
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
                                <h6 className='m-1'>NC me concernant</h6>
                                <CBadge className="custom-badge">
                                    {loadingall ? '...' : all.length}
                                </CBadge>
                            </CTab>
                        </CTabList>
                    </CCardHeader>
                    <CCardBody>
                        <CTabContent >
                            <CTabPanel className="p-3" itemKey="brouillon">
                                <BrouillonsPanel ncData={brouillons} loading={loadingBrouillons} error={errorBrouillon} />
                            </CTabPanel>
                            <CTabPanel className="p-3" itemKey="declaration">
                                <DeclarationsPanel ncData={declarations} loading={loadingDeclarations} error={errorDeclarations} />
                            </CTabPanel>
                            <CTabPanel className="p-3" itemKey="tous">
                                <TousPanel ncData={all} loading={loadingall} error={errorAll} />
                            </CTabPanel>
                        </CTabContent>
                    </CCardBody>
                </CTabs>
            </CCard>
        </>
    )
}

export default Liste_NC