import React from 'react'
import {
    CRow, CCol, CButton,
    CCard, CCardBody, CCardHeader,
    CForm, CFormInput, CFormTextarea, CFormLabel, CFormSelect,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilArrowLeft } from '@coreui/icons'
import Select from 'react-select'
import CollaborateurSelect from '../../../components/select/CollaborateurSelect'

const FormProcessus = () => {
  return (
    <>
        <CRow>
            <CCol xs={12} className="d-flex justify-content-start">
                <CButton
                    color='secondary'
                    key='1'
                    shape="rounded-pill"
                    className="mb-3"
                    href='#/pilotage/cartographie'
                >
                    <CIcon icon={cilArrowLeft} className="me-2" />
                    Retour
                </CButton>
            </CCol>
        </CRow>
        <CCard>
            <CCardHeader className="text-center">
                <span className="h6">Identite du processus</span>
            </CCardHeader>
            <CCardBody>
                <CRow>
                    <CCol xs={12} sm={6} md={4} className='mb-3'>
                        <CFormLabel htmlFor="nom">Nom</CFormLabel>
                        <CFormInput placeholder="" aria-label="nom" />
                    </CCol>
                    <CCol xs={12} sm={6} md={4} className='mb-3'>
                        <CFormLabel htmlFor="sigle">Sigle</CFormLabel>
                        <CFormInput placeholder="INF" aria-label="" />
                    </CCol>
                    <CCol xs={12} sm={6} md={4} className='mb-3'>
                        <CFormLabel htmlFor="categorie">Categorie</CFormLabel>
                        <CFormSelect id="categorie">
                            <option>Processus de management</option>
                            <option>Processus de réalisation</option>
                        </CFormSelect>
                    </CCol>
                </CRow> 
                <CRow>
                    <CCol xs={12} sm={6} md={6} className='mb-3'>
                        <CFormLabel htmlFor="nom">Pseudo pilote</CFormLabel>
                        <CFormInput placeholder="" aria-label="nom" className='mb-3'/>
                        <CFormLabel htmlFor="nom">Pilote</CFormLabel>
                        <CollaborateurSelect />
                    </CCol>
                    <CCol xs={12} sm={6} md={6} className='mb-3'>
                        <CFormLabel htmlFor="nom">Pseudo copilote</CFormLabel>
                        <CFormInput placeholder="" aria-label="nom" className='mb-3'/>
                        <CFormLabel htmlFor="nom">Copilote</CFormLabel>
                        <CollaborateurSelect />
                    </CCol>
                </CRow> 
                <CRow>
                    <CCol xs={12} sm={12} md={12} className='mb-3'>
                        <CFormLabel htmlFor="finalité">Finalité</CFormLabel>
                        <CFormTextarea id="finalité" rows={3}></CFormTextarea>
                    </CCol>
                </CRow>
                <CRow>
                    <CCol xs={12} sm={12} md={12} className='mb-3'>
                        <CFormLabel htmlFor="contexte">Contexte</CFormLabel>
                        <CFormTextarea id="contexte" rows={3}></CFormTextarea>
                    </CCol>
                </CRow>
                <CRow>
                    <CCol xs={12} className="d-flex justify-content-end">
                        <CButton color="primary" type="submit">
                        Inserer
                        </CButton>
                    </CCol>
                </CRow>             
            </CCardBody>
        </CCard>
    
    </>
  )
}

export default FormProcessus
