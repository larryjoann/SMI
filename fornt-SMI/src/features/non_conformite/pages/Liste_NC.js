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

import DeclarationsPanel from '../components/DeclarationsPanel'
import BrouillonsPanel from '../components/BrouillonsPanel'
import TousPanel from '../components/TousPanel'

const Liste_NC = () => {
    return(
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
            <CTabs defaultActiveItemKey="brouillon" className="text-center">
                <CCardHeader style={{ padding: 0, borderBottom: 'none'}}>
                    <CTabList variant="tabs">
                        <CTab itemKey="brouillon" className="d-flex align-items-center">
                            <h6 className='m-1'>Brouillons</h6>
                            <CBadge className="custom-badge">1</CBadge>
                        </CTab>
                        <CTab itemKey="declaration" className="d-flex align-items-center">
                            <h6 className='m-1'>Mes déclarations</h6>
                            <CBadge className="custom-badge" >1</CBadge>
                        </CTab>
                        <CTab itemKey="tous" className="d-flex align-items-center">
                            <h6 className='m-1'>Tous</h6>
                            <CBadge className="custom-badge" >1</CBadge>
                        </CTab>
                    </CTabList>
                </CCardHeader>
                <CCardBody>
                    <CTabContent >
                        <CTabPanel className="p-3" itemKey="brouillon">
                            <BrouillonsPanel />
                        </CTabPanel>
                        <CTabPanel className="p-3" itemKey="declaration">
                          <DeclarationsPanel />
                        </CTabPanel>
                        <CTabPanel className="p-3" itemKey="tous">
                            <TousPanel />
                        </CTabPanel>
                    </CTabContent>
                </CCardBody>
            </CTabs> 
        </CCard>
        </>
    )
}

export default Liste_NC