import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormCheck,
  CFormInput,
  CFormFeedback,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilArrowLeft } from '@coreui/icons'
import { Pop_up} from '../../../components/notification/Pop_up'

const Form_indicateur = () => {
    const [showToast, setShowToast] = useState(false)
    const [validated, setValidated] = useState(false)
    const [popType, setPopType] = useState('');
    const [popMessage, setPopMessage] = useState('');

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        let isValid = form.checkValidity();
        if (!isValid) {
            event.preventDefault();
            event.stopPropagation();
            setPopType('danger');
            setPopMessage('Valeur non inséré avec succes');
        } else {
            event.preventDefault();
            setPopType('success');
            setPopMessage('Valeur insérée avec succès');
        }
        setValidated(true);
        setShowToast(true);
    };

    const popUpProps = {
        show: showToast,
        type: popType,
        message: popMessage
    };

    return(
        <CRow>
            <Pop_up {...popUpProps} />
            <CCol xs={12} className="d-flex justify-content-start">
                <CButton
                    color='secondary'
                    key='1'
                    className="mb-3"
                    href='#/indicateur/tableau'
                >
                    <CIcon icon={cilArrowLeft} className="me-2" />
                    Retour
                </CButton>
            </CCol>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>Indicateur</strong> 
                    </CCardHeader>
                    <CCardBody> 
                        <CForm
                        className="row g-3 needs-validation"
                        noValidate
                        validated={validated}
                        onSubmit={handleSubmit}
                        >
                            {/* ...existing code... */}
                            <CCol xs={12}>
                                <CFormLabel htmlFor="validationCustom01">Nom :</CFormLabel>
                                <CFormTextarea id="validationCustom01" required />
                                <CFormFeedback valid></CFormFeedback>
                            </CCol>            
                            <CCol xs={12}>
                                <CFormLabel htmlFor="validationCustom04">Objectif :</CFormLabel>
                                <CFormSelect id="validationCustom04">
                                <option>Achat</option>
                                <option>Maintenance</option>
                                </CFormSelect>
                                <CFormFeedback invalid>Please provide a valid city.</CFormFeedback>
                            </CCol>
                            <CCol xs={6}>
                                <CFormLabel htmlFor="validationCustom04">Fréquence :</CFormLabel>
                                <CFormSelect id="validationCustom04">
                                <option>Achat</option>
                                <option>Maintenance</option>
                                </CFormSelect>
                                <CFormFeedback invalid>Please provide a valid city.</CFormFeedback>
                            </CCol>
                            <CCol xs={6}>
                                <CFormLabel htmlFor="validationCustom04">Unité de mesure :</CFormLabel>
                                <CFormSelect id="validationCustom04">
                                <option>Achat</option>
                                <option>Maintenance</option>
                                </CFormSelect>
                                <CFormFeedback invalid>Please provide a valid city.</CFormFeedback>
                            </CCol>                          
                            <CCol xs={12}>
                                <CFormLabel htmlFor="validationCustom05">Cible :</CFormLabel>
                                <div className="border rounded p-3">
                                    <CRow>
                                        <CCol xs={12} className='mb-2'>
                                            <CFormLabel htmlFor="validationCustom05Desc">Description :</CFormLabel>
                                            <CFormTextarea id="validationCustom05Desc" rows={3} />
                                        </CCol>
                                        <CCol xs={3}>
                                            <CFormLabel htmlFor="validationCustom05">Min :</CFormLabel>
                                            <CFormInput type="text" id="validationCustom05" required />
                                            <CFormFeedback invalid>Please provide a valid value.</CFormFeedback>
                                        </CCol>                                        
                                        <CCol xs={3}>
                                            <CFormLabel htmlFor="validationCustom05">Optimal :</CFormLabel>
                                            <CFormInput type="text" id="validationCustom05" required />
                                            <CFormFeedback invalid>Please provide a valid value.</CFormFeedback>
                                        </CCol>              
                                        <CCol xs={3}>
                                            <CFormLabel htmlFor="validationCustom05Value">Max :</CFormLabel>
                                            <CFormInput type="number" id="validationCustom05Value" required />
                                            <CFormFeedback invalid>Please provide a valid number.</CFormFeedback>
                                        </CCol>
                                    </CRow>
                                </div>
                            </CCol>
                            <CCol xs={12}>
                                <CFormLabel htmlFor="validationCustom09">Source :</CFormLabel>
                                <CFormTextarea id="validationCustom09" required />
                                <CFormFeedback valid></CFormFeedback>
                            </CCol>   
                            <CCol xs={12}>
                                <CButton color="primary" type="submit">
                                Submit form
                                </CButton>
                            </CCol>
                        </CForm>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    )
}

export default Form_indicateur