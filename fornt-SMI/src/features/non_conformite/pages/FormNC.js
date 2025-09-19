import {
  CRow, CCol,
  CCard, CCardBody, CCardHeader, 
  CForm, CFormInput, CFormLabel, CFormTextarea,
  CButton
} from '@coreui/react'
import ProcessusMultiSelect from '../../../components/select/ProcessusMultiSelect'
import CollaborateurMultiSelect from '../../../components/select/CollaborateurMultiSelect'
import TypeNCSelect from '../../../components/select/TypeNCSelect'
import SiteSelect from '../../../components/select/SiteSelect'
import WysiwygEditor from '../../../components/WysiwygEditor'
import React, { useState } from 'react'



const FormNC = () => {
  const [description, setDescription] = useState('')

  return (
    <>
      <CRow className='mb-2'>   
        <CCol xs={12}> 
          <h3 className="text-center">Déclaration de non-conformité</h3>
        </CCol>      
      </CRow>
      <CCard className='mb-4'>
        <CCardHeader className="text-center">
          <span className="h6">IDENTIFICATION DE LA NON-CONFORMITE</span>
        </CCardHeader>
        <CCardBody>
          <CForm>
            <CRow>
              <CCol xs={12} sm={6} md={6} className='mb-3'>
                <CFormLabel htmlFor="type">Type :</CFormLabel>
                <TypeNCSelect/>
              </CCol>
              <CCol xs={12} sm={6} md={6} className='mb-3'>
                <CFormLabel htmlFor="site">Site :</CFormLabel>
                <SiteSelect/>
              </CCol>
            </CRow>
            <CRow>
              <CCol xs={12} sm={12} md={12} className='mb-3'>
                <CFormLabel htmlFor="type">Processus concerné(s) :</CFormLabel>
                <ProcessusMultiSelect/>
              </CCol>
            </CRow>
          </CForm>
        </CCardBody>
      </CCard>
      <CCard>
        <CCardHeader className="text-center">
          <span className="h6">DESCRIPTION</span>
        </CCardHeader>
        <CCardBody>
          <CForm>
            <CRow>
              <CCol xs={12} sm={6} md={4} className='mb-3'>
                <CFormLabel htmlFor="date">Date :</CFormLabel>
                <CFormInput type='date' id="nom" placeholder="Nom de la non-conformité" />
              </CCol>
              <CCol xs={12} sm={6} md={4} className='mb-3'>
                <CFormLabel htmlFor="heure">Heure :</CFormLabel>
                <CFormInput type='time' id="nom" placeholder="Nom de la non-conformité" />
              </CCol>
              <CCol xs={12} sm={12} md={12} className='mb-3'>
                <CFormLabel htmlFor="description">Description du fait :</CFormLabel>
                <WysiwygEditor
                  value={description}
                  onChange={(editorState) => setDescription(editorState)}
                />
              </CCol>
              <CCol xs={12} sm={12} md={12} className='mb-3'>
                <CFormLabel htmlFor="curative">Action curative :</CFormLabel>
                <CFormTextarea id="curative" rows={3}/>
              </CCol>
            </CRow>
          </CForm>
        </CCardBody>
      </CCard>
    </>
  )
}

export default FormNC
