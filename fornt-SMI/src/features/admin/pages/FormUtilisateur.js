import React, { useState, useEffect } from 'react'
import {
    CCard,
    CCardBody,
    CCardHeader,
    CForm,
    CFormLabel,
    CFormFeedback,
    CButton,
    CRow,
    CCol
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilArrowLeft, cilSave } from '@coreui/icons/dist/cjs'
import { useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { createRoleCollaborateur } from '../services/roleCollaborateurService'
import { Pop_up } from '../../../components/notification/Pop_up'
import CollaborateurSelect from '../../../components/champs/CollaborateurSelect'
import RoleNotAutoSelect from '../../../components/champs/RoleNotAutoSelect'

const FormUtilisateur = () => {
    const navigate = useNavigate()
    const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm({
        defaultValues: {
            matriculeCollaborateur: null,
            idRole: ''
        }
    })
    const [showToast, setShowToast] = useState(false)
    const [popType, setPopType] = useState('success')
    const [popMessage, setPopMessage] = useState('')

    const handleSubmitForm = async (data) => {
        // Validation
        if (!data.matriculeCollaborateur || !data.idRole) {
            setPopType('warning')
            setPopMessage('Veuillez remplir tous les champs')
            setShowToast(true)
            return
        }

        try {
            // data.matriculeCollaborateur est un objet {value, label} du select
            const matricule = data.matriculeCollaborateur.value

            await createRoleCollaborateur({
                matriculeCollaborateur: matricule,
                idRole: parseInt(data.idRole)
            })
            setPopType('success')
            setPopMessage('Utilisateur ajouté avec succès')
            setShowToast(true)
            // Rediriger après succès
           
            navigate('/administration/utilisateurs')
            
        } catch (err) {
            console.error('Erreur lors de l\'ajout:', err)
            const errorMsg = err?.response?.data?.error || err?.response?.data?.message || 'Erreur lors de l\'ajout de l\'utilisateur'
            setPopType('error')
            setPopMessage(errorMsg)
            setShowToast(true)
        }
    }

    return (
        <>
            <CRow className='mb-2'>   
                <CCol xs={3} className="d-flex justify-content-start">
                    <CButton
                        color='secondary'
                        className="mb-3"
                        onClick={() => navigate('/administration/utilisateurs')}
                    >
                        <CIcon icon={cilArrowLeft} className="me-2" />
                        Retour
                    </CButton>
                </CCol>
                <CCol xs={6}> 
                    <h3 className="text-center">Nouvel utilisateur</h3>
                </CCol> 
                <CCol xs={3} className="d-flex justify-content-end">
                </CCol>    
            </CRow>

            <CCard className="mb-3">
                <CCardHeader className='h6 text-center'>
                    <span className='h6'>INFORMATIONS DE L'UTILISATEUR</span>
                </CCardHeader>
                <CCardBody>
                    <CForm onSubmit={handleSubmit(handleSubmitForm)}>
                        <CRow>
                            <CCol md={6} className="mb-3">
                                <CFormLabel>Rôle <span className="text-danger">*</span> :</CFormLabel>
                                <Controller
                                    control={control}
                                    name="idRole"
                                    rules={{ required: 'Le rôle est requis' }}
                                    render={({ field: { onChange, value } }) => (
                                        <RoleNotAutoSelect
                                            onChange={(e) => onChange(e.target.value)}
                                            value={value}
                                        />
                                    )}
                                />
                                {errors.idRole && (
                                    <CFormFeedback invalid style={{ display: 'block' }}>
                                        {errors.idRole?.message}
                                    </CFormFeedback>
                                )}
                            </CCol>
                            <CCol md={6} className="mb-3">
                                <CFormLabel>Collaborateur <span className="text-danger">*</span> :</CFormLabel>
                                <Controller
                                    control={control}
                                    name="matriculeCollaborateur"
                                    rules={{ required: 'Un collaborateur est requis' }}
                                    render={({ field: { onChange, value } }) => (
                                        <CollaborateurSelect
                                            value={value}
                                            onChange={onChange}
                                            placeholder="Sélectionner un collaborateur"
                                        />
                                    )}
                                />
                                {errors.matriculeCollaborateur && (
                                    <CFormFeedback invalid style={{ display: 'block' }}>
                                        {errors.matriculeCollaborateur.message}
                                    </CFormFeedback>
                                )}
                            </CCol>
                            <CCol md={12} className="d-flex justify-content-end">
                                <CButton color="primary" type="submit" disabled={isSubmitting}>
                                    {/* <CIcon icon={cilSave} className="me-2" /> */}
                                    Ajouter
                                </CButton>
                            </CCol>
                        </CRow>
                    </CForm>
                </CCardBody>
            </CCard>

            <Pop_up
                type={popType}
                message={popMessage}
                visible={showToast}
                setVisible={setShowToast}
            />
        </>
    )
}

export default FormUtilisateur
