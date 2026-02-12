import {
  CRow, CCol, CButton, CCard, CCardHeader, CCardBody,
  CFormLabel, CFormInput, CFormTextarea, CForm, CFormFeedback,
  CTable, CTableHead, CTableHeaderCell, CTableBody, CTableRow, CTableDataCell
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilArrowLeft, cilTrash, cilPlus } from '@coreui/icons'
import CategorieProcessusSelect from '../../../components/champs/CategorieProcessusSelect'
import CollaborateurMultiSelect from '../../../components/champs/CollaborateurMultiSelect'
import ProcessusSelect from '../../../components/champs/ProcessusSelect' 
import CategorieRessourcesSelect from '../../../components/champs/CategorieRessourcesSelect'
import { Pop_up } from '../../../components/notification/Pop_up'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
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
      // new arrays for additional data
      intercations: [],
      ressourcesProcessus: [],
      partieInteresseAttentes: [],
      activites: [],
    }
  })

  const {
    showToast,
    setShowToast,
    popType,
    popMessage,
    onSubmit,
    responsablesMeta,
  } = useProcessusForm(id, reset, setError, navigate)

  // Dynamic arrays for new sections
  const { fields: intercationsFields, append: appendInteraction, remove: removeInteraction } = useFieldArray({ control, name: 'intercations' })
  const { fields: ressourcesFields, append: appendRessource, remove: removeRessource } = useFieldArray({ control, name: 'ressourcesProcessus' })
  const { fields: partiesFields, append: appendPartie, remove: removePartie } = useFieldArray({ control, name: 'partieInteresseAttentes' })
  const { fields: activitesFields, append: appendActivite, remove: removeActivite } = useFieldArray({ control, name: 'activites' })

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
            href='#/cartographie'
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
            <CRow className='mb-3'>
              <CCol xs={12} sm={6} md={4} className='mb-3'>
                <CFormLabel htmlFor="nom">Nom <span className="text-danger">*</span> :</CFormLabel>
                <CFormInput
                  {...register('nom', { required: 'Le nom est requis' })}
                  id="nom"
                  type="text"
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
                  id="sigle"
                  type="text"
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
            <CRow className='mb-3'>
              <CCol xs={12}>
                <CFormLabel htmlFor="finalite">Finalité <span className="text-danger">*</span> :</CFormLabel>
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
            <CRow className='mb-3'>
                {Array.isArray(responsablesMeta) && responsablesMeta.length > 0 ? (
                responsablesMeta.map(r => (
                  <CCol key={r.fieldName} xs={12} sm={6} md={6} className='mb-3'>
                    <CFormLabel>{r.label} <span className="text-danger">*</span> :</CFormLabel>
                    <Controller
                      control={control}
                      name={r.fieldName}
                      rules={{
                        required: `Au moins un ${r.label.toLowerCase()} est requis`,
                        validate: value => Array.isArray(value) && value.length > 0 || `Au moins un ${r.label.toLowerCase()} est requis`
                      }}
                      render={({ field: { onChange, value, ref } }) => (
                        <CollaborateurMultiSelect
                          value={value}
                          onChange={onChange}
                          placeholder={`Sélectionner les ${r.label.toLowerCase()}`}
                          invalid={!!errors[r.fieldName]}
                          inputRef={ref}
                        />
                      )}
                    />
                    {errors[r.fieldName] && (
                      <CFormFeedback invalid>
                        {errors[r.fieldName].message}
                      </CFormFeedback>
                    )}
                  </CCol>
                ))
              ) : (
                <>
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
                </>
              )}
            </CRow>

            {/* --- Activités (table) --- */}
            <CRow className='mb-3'>
              <CCol xs={12} className='mb-2 d-flex justify-content-between align-items-center'>
                <CFormLabel htmlFor="contexte">Activités <span className="text-danger">*</span> :</CFormLabel>
                <CButton color='secondary' size='sm' onClick={() => appendActivite({ processusFournisseur: '', elementEntrante: '', processusClient: '', elementSortante: '', descr: '' })}><CIcon icon={cilPlus} className="me-2" size='sm' />Ajouter</CButton>
              </CCol>
              <CCol xs={12}>
                {activitesFields.length === 0 ? (
                  <div className='text-muted'>Aucune activité</div>
                ) : (
                  <CTable hover responsive bordered>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>Processus fournisseur</CTableHeaderCell>
                        <CTableHeaderCell>Eléments d'entrée</CTableHeaderCell>
                        <CTableHeaderCell>Activité</CTableHeaderCell>
                        <CTableHeaderCell>Eléments de sortie</CTableHeaderCell>
                        <CTableHeaderCell>Processus client</CTableHeaderCell>                             
                        <CTableHeaderCell></CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {activitesFields.map((f, idx) => (
                        <CTableRow key={f.id}>
                          <CTableDataCell><CFormTextarea {...register(`activites.${idx}.processusFournisseur`)} rows={2} placeholder='Processus fournisseur' /></CTableDataCell>
                          <CTableDataCell><CFormTextarea {...register(`activites.${idx}.elementEntrante`)} rows={2} placeholder='Entrée' /></CTableDataCell>
                          <CTableDataCell><CFormTextarea {...register(`activites.${idx}.descr`)} rows={2} placeholder='Activité' /></CTableDataCell>
                          <CTableDataCell><CFormTextarea {...register(`activites.${idx}.elementSortante`)} rows={2} placeholder='Sortie' /></CTableDataCell>
                          <CTableDataCell><CFormTextarea {...register(`activites.${idx}.processusClient`)} rows={2} placeholder='Processus client' /></CTableDataCell>
                          

                          <CTableDataCell className='text-center align-middle'><CIcon icon={cilTrash} className="text-danger" size="md" style={{ cursor: 'pointer' }} title="Supprimer" onClick={() => removeActivite(idx)} /></CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                )}
              </CCol>
            </CRow>

            {/* --- Parties intéressées & attentes (table) --- */}
            <CRow className='mb-3'>
              <CCol xs={12} className='mb-2 d-flex justify-content-between align-items-center'>
                <CFormLabel htmlFor="contexte">Parties intéressées et attentes <span className="text-danger">*</span> :</CFormLabel>
                <CButton color='secondary' size='sm' onClick={() => appendPartie({ partieInteresse: '', groupe: '', attente: '' })}><CIcon icon={cilPlus} className="me-2" size='sm' />Ajouter</CButton>
              </CCol>
              <CCol xs={12}>
                {partiesFields.length === 0 ? (
                  <div className='text-muted'>Aucune partie intéressée</div>
                ) : (
                  <CTable hover responsive bordered>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>Parties intéressées</CTableHeaderCell>
                        <CTableHeaderCell>Groupe</CTableHeaderCell>
                        <CTableHeaderCell>Attentes</CTableHeaderCell>
                        <CTableHeaderCell></CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {partiesFields.map((f, idx) => (
                        <CTableRow key={f.id}>
                          <CTableDataCell><CFormTextarea {...register(`partieInteresseAttentes.${idx}.partieInteresse`)} rows={2} placeholder='Partie intéressée' /></CTableDataCell>
                          <CTableDataCell><CFormInput {...register(`partieInteresseAttentes.${idx}.groupe`)} placeholder='Groupe' type='number' /></CTableDataCell>
                          <CTableDataCell><CFormTextarea {...register(`partieInteresseAttentes.${idx}.attente`)} rows={2} placeholder='Attente' /></CTableDataCell>
                          <CTableDataCell className='text-center align-middle'><CIcon icon={cilTrash} className="text-danger" size="md" style={{ cursor: 'pointer' }} title="Supprimer" onClick={() => removePartie(idx)} /></CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                )}
              </CCol>
            </CRow>

            <CRow className='mb-3'>
              <CCol xs={12}>
                <CFormLabel htmlFor="contexte">Contexte <span className="text-danger">*</span> :</CFormLabel>
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

            {/* --- Interactions (table) --- */}
            <CRow className='mb-3'>
              <CCol xs={12} className='mb-2 d-flex justify-content-between align-items-center'>
                <CFormLabel htmlFor="contexte">Interactions <span className="text-danger">*</span> :</CFormLabel>
                <CButton color='secondary' size='sm' onClick={() => appendInteraction({ descr: '', idProcessusInteragi: '' })}><CIcon icon={cilPlus} className="me-2" size='sm' />Ajouter</CButton>
              </CCol>
              <CCol xs={12}>
                {intercationsFields.length === 0 ? (
                  <div className='text-muted'>Aucune interaction</div>
                ) : (
                  <CTable hover responsive bordered>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>Processus</CTableHeaderCell>
                        <CTableHeaderCell>Interactions</CTableHeaderCell>                    
                        <CTableHeaderCell style={{ width: '90px' }}></CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {intercationsFields.map((f, idx) => (
                        <CTableRow key={f.id}>            
                          <CTableDataCell>
                            <Controller
                              control={control}
                              name={`intercations.${idx}.idProcessusInteragi`}
                              render={({ field }) => (
                                <ProcessusSelect {...field} />
                              )}
                            />
                          </CTableDataCell>
                          <CTableDataCell><CFormTextarea {...register(`intercations.${idx}.descr`)} rows={2} placeholder='Description' /></CTableDataCell>
                          <CTableDataCell className='text-center align-middle'><CIcon icon={cilTrash} className="text-danger" size="md" style={{ cursor: 'pointer' }} title="Supprimer" onClick={() => removeInteraction(idx)} /></CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                )}
              </CCol>
            </CRow>

            {/* --- Ressources (table) --- */}
            <CRow className='mb-3'>
              <CCol xs={12} className='mb-2 d-flex justify-content-between align-items-center'>
                <CFormLabel htmlFor="contexte">Ressources <span className="text-danger">*</span> :</CFormLabel>
                <CButton color='secondary' size='sm' onClick={() => appendRessource({ idCategorieRessources: '', descr: '' })}><CIcon icon={cilPlus} className="me-2" size='sm' />Ajouter</CButton>
              </CCol>
              <CCol xs={12}>
                {ressourcesFields.length === 0 ? (
                  <div className='text-muted'>Aucune ressource</div>
                ) : (
                  <CTable hover responsive bordered>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>Catégorie</CTableHeaderCell>
                        <CTableHeaderCell>Description</CTableHeaderCell>
                        <CTableHeaderCell style={{ width: '90px' }}></CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {ressourcesFields.map((f, idx) => (
                        <CTableRow key={f.id}>
                          <CTableDataCell>
                            <Controller
                              control={control}
                              name={`ressourcesProcessus.${idx}.idCategorieRessources`}
                              render={({ field }) => (
                                <CategorieRessourcesSelect {...field} />
                              )}
                            />
                          </CTableDataCell>
                          <CTableDataCell><CFormTextarea {...register(`ressourcesProcessus.${idx}.descr`)} rows={2} placeholder='Description' /></CTableDataCell>
                          <CTableDataCell className='text-center align-middle'><CIcon icon={cilTrash} className="text-danger" size="md" style={{ cursor: 'pointer' }} title="Supprimer" onClick={() => removeRessource(idx)} /></CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                )}
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
