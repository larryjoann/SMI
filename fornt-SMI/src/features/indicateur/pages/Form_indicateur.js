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
                    shape="rounded-pill"
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
                            <CCol md={4}>
                                <CFormLabel htmlFor="validationCustom01">Email</CFormLabel>
                                <CFormInput type="text" id="validationCustom01" defaultValue="Mark" required />
                                <CFormFeedback valid></CFormFeedback>
                            </CCol>
                            <CCol md={4}>
                                <CFormLabel htmlFor="validationCustom02">Email</CFormLabel>
                                <CFormInput type="text" id="validationCustom02" defaultValue="Otto" required />
                                <CFormFeedback valid>Looks good!</CFormFeedback>
                            </CCol>
                            <CCol md={4}>
                                <CFormLabel htmlFor="validationCustomUsername">Username</CFormLabel>
                                <CInputGroup className="has-validation">
                                <CInputGroupText id="inputGroupPrepend">@</CInputGroupText>
                                <CFormInput
                                    type="text"
                                    id="validationCustomUsername"
                                    defaultValue=""
                                    aria-describedby="inputGroupPrepend"
                                    required
                                />
                                <CFormFeedback invalid>Please choose a username.</CFormFeedback>
                                </CInputGroup>
                            </CCol>
                            <CCol md={6}>
                                <CFormLabel htmlFor="validationCustom03">City</CFormLabel>
                                <CFormInput type="text" id="validationCustom03" required />
                                <CFormFeedback invalid>Please provide a valid city.</CFormFeedback>
                            </CCol>
                            <CCol md={3}>
                                <CFormLabel htmlFor="validationCustom04">City</CFormLabel>
                                <CFormSelect id="validationCustom04">
                                <option>Achat</option>
                                <option>Maintenance</option>
                                </CFormSelect>
                                <CFormFeedback invalid>Please provide a valid city.</CFormFeedback>
                            </CCol>
                            <CCol md={3}>
                                <CFormLabel htmlFor="validationCustom05">City</CFormLabel>
                                <CFormInput type="text" id="validationCustom05" required />
                                <CFormFeedback invalid>Please provide a valid zip.</CFormFeedback>
                            </CCol>
                            <CCol xs={12}>
                                <CFormCheck
                                type="checkbox"
                                id="invalidCheck"
                                label="Agree to terms and conditions"
                                required
                                />
                                <CFormFeedback invalid>You must agree before submitting.</CFormFeedback>
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