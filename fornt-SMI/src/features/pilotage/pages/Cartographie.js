import React from 'react'
import {
  CCol,
  CRow,
  CCard, CCardBody, CCardHeader, 
  CForm, CFormInput, CFormSelect, CButton,  
    CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CDropdownDivider
} from '@coreui/react'

import CIcon from '@coreui/icons-react'
import { cilPlus , cilOptions , cilTrash , cilPen} from '@coreui/icons'


const Cartographie = () => {
  return (
    <>
      <CRow>
        <CCol xs={12} className="d-flex justify-content-end">
          <CButton
          color='primary'
          key='1'
          shape="rounded-pill"
          className="mb-3"
          href='#/pilotage/formprocessus'
          >
            <CIcon icon={cilPlus} className="me-2" />
            Nouvelle processus
          </CButton>
        </CCol>
        <CCol xs={12}>
              <CCard className="mb-4">
                <CCardHeader>
                  <strong>Filtre</strong> 
                </CCardHeader>
                <CCardBody> 
                    <CForm className="row g-3">
                      <CCol sm={5}>
                        <CFormInput
                          type="text"
                          id="floatingInput"
                          floatingClassName="mb-0"
                          floatingLabel="Processus"
                          placeholder="name@example.com"
                        />
                      </CCol>
                      <CCol sm={4}>
                        <CFormSelect
                          id="floatingSelect"
                          floatingLabel="Categorie du processus"
                          aria-label="Floating label select example"
                        >
                          <option value="">Tous</option>
                          <option value="2">Processus de management</option>
                          <option value="3">Processus de realisation</option>
                        </CFormSelect>
                      </CCol>
                      <CCol sm={2}>
                        <CFormSelect
                          id="floatingSelect"
                          floatingLabel="Année"
                          aria-label="Floating label select example"
                        >
                          <option value="">2025</option>
                          <option value="2">2024</option>
                          <option value="3">2023</option>
                        </CFormSelect>
                      </CCol>
                      <CCol sm={1} className="d-flex justify-content-center align-items-center">
                        <CButton color="primary" type="submit">
                          Filtrer
                        </CButton>
                      </CCol>
                    </CForm>
                </CCardBody>
              </CCard>
        </CCol>
      </CRow>

      <CCard className="p-4">
      <CRow className="justify-content-center mb-4">
        <CCol sm={4}>
          <CCard textBgColor='light' className="hover-card">
            <CCardHeader className="text-center position-relative">
              <span className="h6 m-0">MANAGEMENT</span>

              <CDropdown alignment="end" className="position-absolute end-0 top-50 translate-middle-y me-2">
                <CDropdownToggle caret={false} className="p-0">
                  <CIcon icon={cilOptions} className="text-dark" />
                </CDropdownToggle>
                <CDropdownMenu>
                  <CDropdownItem href="#">
                    <CIcon icon={cilTrash} className="text-danger me-3" />
                    <span className="text-danger">Supprimer</span>
                  </CDropdownItem>
                  <CDropdownDivider />
                  <CDropdownItem href="#">
                    <CIcon icon={cilPen} className="text-warning me-3" />
                    <span className="text-warning">Modifier</span>
                  </CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
            </CCardHeader>

            <CCardBody className="d-flex flex-column align-items-center text-center">
              <p>Directeur General</p>
              <a>Directeur QRSE</a>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      </CCard>
    </>
  )
}

export default Cartographie
