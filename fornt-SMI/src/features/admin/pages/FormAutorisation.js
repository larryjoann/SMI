import React, { useEffect, useState } from 'react'
import {
  CCard, CCardHeader, CCardBody, CRow, CCol, CButton, CFormInput, CFormTextarea,
  CFormLabel, CForm, CFormFeedback,
  CFormSelect
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilArrowLeft, cilHistory } from '@coreui/icons'
import { useNavigate, useParams } from 'react-router-dom'

const FormAutorisation = () => {
    const navigate = useNavigate()
  return (
    <>
    <CRow className='mb-2'>   
            <CCol xs={3} className="d-flex justify-content-start">
                <CButton
                color='secondary'
                className="mb-3"
                                onClick={() => navigate('/administration/autorisation')}
                >
                <CIcon icon={cilArrowLeft} className="me-2" />
                Retour
                </CButton>
            </CCol>
            <CCol xs={6}> 
            <h3 className="text-center">Nouvelle autorisation</h3>
            </CCol> 
            <CCol xs={3} className="d-flex justify-content-end">
            </CCol>    
        </CRow>
    <CCard className="mb-3">
      <CCardHeader className='h6 text-center'>
        <span className='h6'> IDENTITÉ DE L'AUTORISATION </span>
        </CCardHeader>
      <CCardBody>
        <CForm>
          <CRow>
            <CCol  md={6} className="mb-3">
                <CFormLabel>Rôle <span className="text-danger">*</span> :</CFormLabel>
                <CFormSelect>
                    <option>Selectionner un rôle</option>
                    <option>Responsable QUA</option>
                    <option>Pilote/Copilote</option>
                    <option>Utilisateur</option>
                </CFormSelect>
            </CCol>
            <CCol md={6} className="mb-3">
                <CFormLabel>Entité <span className="text-danger">*</span> :</CFormLabel>
                <CFormSelect>
                    <option>Selectionner une entité</option>
                    <option>Cartographie</option>
                    <option>Non-conformité</option>
                    <option>Plan d'action</option>
                    <option>Actions</option>
                </CFormSelect>
            </CCol>
            <CCol md={8} className="mb-3">
                <CFormLabel>Opération <span className="text-danger">*</span> :</CFormLabel>
                <CFormSelect>
                    <option>Selectionner une opération</option>
                    <option>Création</option>
                    <option>Lecture</option>
                    <option>Modification</option>
                    <option>Suppression</option>
                </CFormSelect>
            </CCol>
            <CCol md={12} className="d-flex justify-content-end">
               
                <CButton color="primary" type="submit">Créer</CButton>
            </CCol>
            </CRow>
        </CForm>
      </CCardBody>
    </CCard>
  </>
  )
}

export default FormAutorisation

