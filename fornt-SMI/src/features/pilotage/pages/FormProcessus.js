import {
  CRow, CCol, CButton, CCard, CCardHeader, CCardBody,
  CFormLabel, CFormInput, CFormTextarea, CForm, CFormFeedback
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilArrowLeft } from '@coreui/icons'
import CategorieProcessusSelect from '../../../components/champs/CategorieProcessusSelect'
import CollaborateurMultiSelect from '../../../components/champs/CollaborateurMultiSelect'
import { Pop_up } from '../../../components/notification/Pop_up'
import { useForm, Controller } from 'react-hook-form'
import { useParams, useNavigate } from 'react-router-dom'
import { useProcessusForm } from '../hooks/useProcessusForm'

const FormProcessus = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { register, handleSubmit, reset, setError, control, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      nom: '',
      sigle: '',
      idCategorieProcessus: '',
      matriculePilote: '',
      matriculeCopilote: '',
      finalite: '',
      contexte: '',
    }
  })

  const {
    showToast,
    setShowToast,
    popType,
    popMessage,
    onSubmit,
  } = useProcessusForm(id, reset, setError, navigate)

  return (
    <>
      <Pop_up
        show={showToast}
        setShow={setShowToast}
        type={popType}
        message={popMessage}
      />
      <CRow>
        <CCol xs={3} className="d-flex justify-content-start">
          <CButton
            color='secondary'
            className="mb-3"
            href='#/pilotage/cartographie'
          >
            <CIcon icon={cilArrowLeft} className="me-2" />
            Retour
          </CButton>
        </CCol>
        <CCol xs={6} className="d-flex justify-content-center">
          <h3>{id ? "Modifier le processus" : "Ajouter un nouveau processus"}</h3>
        </CCol>
        <CCol xs={3} className="d-flex justify-content-end"></CCol>
      </CRow>
      <CCard className='mb-3'>
        <CCardHeader className="text-center">
          <span className="h6">{id ? "Modifier le processus" : "Identité du processus"}</span>
        </CCardHeader>
        <CCardBody>
          <CForm onSubmit={handleSubmit(onSubmit)}>
            <CRow>
              <CCol xs={12} sm={6} md={4} className='mb-3'>
                <CFormLabel htmlFor="nom">Nom <span className="text-danger">*</span> :</CFormLabel>
                <CFormInput
                  {...register('nom', { required: 'Le nom est requis' })}
                  invalid={!!errors.nom}
                />
                <CFormFeedback invalid>
                  {errors.nom?.message}
                </CFormFeedback>
              </CCol>
              <CCol xs={12} sm={6} md={4} className='mb-3'>
                <CFormLabel htmlFor="sigle">Sigle <span className="text-danger">*</span> :</CFormLabel>
                <CFormInput
                  {...register('sigle', { required: 'Le sigle est requis' })}
                  invalid={!!errors.sigle}
                />
                <CFormFeedback invalid>
                  {errors.sigle?.message}
                </CFormFeedback>
              </CCol>
              <CCol xs={12} sm={6} md={4} className='mb-3'>
                <CFormLabel htmlFor="categorie">Categorie <span className="text-danger">*</span> :</CFormLabel>
                <Controller
                  control={control}
                  name="idCategorieProcessus"
                  rules={{ required: 'La catégorie est requise' }}
                  render={({ field }) => (
                    <CategorieProcessusSelect
                      {...field}
                      invalid={!!errors.idCategorieProcessus}
                    />
                  )}
                />
                <CFormFeedback invalid>
                  {errors.idCategorieProcessus?.message}
                </CFormFeedback>
              </CCol>
            </CRow>
            <CRow>
              <CCol xs={12} sm={6} md={6} className='mb-3'>
                <CFormLabel>Pilote(s) <span className="text-danger">*</span> :</CFormLabel>
                <Controller
                  control={control}
                  name="matriculePilote"
                  rules={{ 
                    required: 'Au moins un pilote est requis',
                    validate: value => Array.isArray(value) && value.length > 0 || 'Au moins un pilote est requis'
                  }}
                  render={({ field: { onChange, value, ref } }) => (
                    <CollaborateurMultiSelect
                      value={value}
                      onChange={onChange}
                      placeholder="Sélectionner les pilotes"
                      invalid={!!errors.matriculePilote}
                      inputRef={ref}
                    />
                  )}
                />
                {errors.matriculePilote && (
                  <CFormFeedback invalid>
                    {errors.matriculePilote.message}
                  </CFormFeedback>
                )}
              </CCol>
              <CCol xs={12} sm={6} md={6} className='mb-3'>
                <CFormLabel>Copilote(s) <span className="text-danger">*</span> :</CFormLabel>
                <Controller
                  control={control}
                  name="matriculeCopilote"
                  rules={{ 
                    required: 'Au moins un copilote est requis',
                    validate: value => Array.isArray(value) && value.length > 0 || 'Au moins un copilote est requis'
                  }}
                  render={({ field: { onChange, value, ref } }) => (
                    <CollaborateurMultiSelect
                      value={value}
                      onChange={onChange}
                      placeholder="Sélectionner les copilotes"
                      invalid={!!errors.matriculeCopilote}
                      inputRef={ref}
                    />
                  )}
                />
                {errors.matriculeCopilote && (
                  <CFormFeedback invalid>
                    {errors.matriculeCopilote.message}
                  </CFormFeedback>
                )}
              </CCol>
            </CRow>
            <CRow>
              <CCol xs={12} className='mb-3'>
                <CFormLabel htmlFor="finalite">Finalité :</CFormLabel>
                <CFormTextarea
                  {...register('finalite')}
                  id="finalite"
                  rows={3}
                  invalid={!!errors.finalite}
                />
                <CFormFeedback invalid>
                  {errors.finalite?.message}
                </CFormFeedback>
              </CCol>
            </CRow>
            <CRow>
              <CCol xs={12} className='mb-3'>
                <CFormLabel htmlFor="contexte">Contexte :</CFormLabel>
                <CFormTextarea
                  {...register('contexte')}
                  id="contexte"
                  rows={3}
                  invalid={!!errors.contexte}
                />
                <CFormFeedback invalid>
                  {errors.contexte?.message}
                </CFormFeedback>
              </CCol>
            </CRow>
            <CRow>
            <CCol xs={12} className="d-flex justify-content-end">
              <CButton color="primary" type="submit" disabled={isSubmitting}>
                {id ? "Mettre à jour" : "Inserer"}
              </CButton>
            </CCol>
          </CRow>
          </CForm>
        </CCardBody>
      </CCard>
    </>
  )
}

export default FormProcessus
