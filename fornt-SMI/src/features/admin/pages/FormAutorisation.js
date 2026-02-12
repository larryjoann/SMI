import React, { useState } from 'react'
import {
  CCard, CCardHeader, CCardBody, CRow, CCol, CButton, CFormInput, CFormTextarea,
  CFormLabel, CForm, CFormFeedback,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilArrowLeft, cilHistory } from '@coreui/icons'
import { useNavigate, useParams } from 'react-router-dom'
import RoleSelect from '../../../components/champs/RoleSelect'
import PermissionSelect from '../../../components/champs/PermissionSelect' 

const FormAutorisation = () => {
    const navigate = useNavigate()
    const [roleId, setRoleId] = useState('')
    const [permissionId, setPermissionId] = useState(null)
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async (e) => {
      e.preventDefault()
      if (!roleId || !permissionId) {
        alert('Veuillez sélectionner un rôle et une permission.')
        return
      }
      try {
        setSubmitting(true)
        const payload = {
          idRole: Number(roleId),
          idPermission: Number(permissionId),
        }
        const autorisationService = (await import('../../../services/autorisation.service')).default
        await autorisationService.createRolePermission(payload)
        navigate('/administration/autorisation')
      } catch (err) {
        console.error('Erreur création autorisation:', err)
        alert('Erreur lors de la création de l\'autorisation')
      } finally {
        setSubmitting(false)
      }
    }

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
        <CForm onSubmit={handleSubmit}>
          <CRow>
            <CCol  md={6} className="mb-3">
              <CFormLabel>Rôle <span className="text-danger">*</span> :</CFormLabel>
              <RoleSelect value={roleId} onChange={(e) => setRoleId(e.target ? e.target.value : e)} />
            </CCol>
            <CCol md={12} className="mb-3">
              <CFormLabel>Opération <span className="text-danger">*</span> :</CFormLabel>
              <PermissionSelect value={permissionId} onChange={(id) => setPermissionId(id)} />
            </CCol>
            <CCol md={12} className="d-flex justify-content-end">
               
                <CButton color="primary" type="submit" disabled={submitting}>{submitting ? 'Création...' : 'Créer'}</CButton>
            </CCol>
            </CRow>
        </CForm>
      </CCardBody>
    </CCard>
  </>
  )
}

export default FormAutorisation

