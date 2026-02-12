import { useEffect, useState } from 'react'
import { updateProcessus, createProcessus, getProcessusById, getTypeResponsableProcessus } from '../services/processusService'

export function useProcessusForm(id, reset, setError, navigate) {
  const [showToast, setShowToast] = useState(false)
  const [popType, setPopType] = useState('success')
  const [popMessage, setPopMessage] = useState('')
  const [responsablesMeta, setResponsablesMeta] = useState([])

  useEffect(() => {
    // Initialize dynamic responsable types and prefill form when editing
    const prepare = async () => {
      try {
        const types = await getTypeResponsableProcessus()
        const baseMeta = Array.isArray(types) ? types.map(t => ({
          idType: t.id,
          idRole: t.idRole,
          label: t?.role?.nom || t?.nom || `Type ${t.id}`,
          fieldName: `responsable_${t.id}`,
          options: []
        })) : []

        if (id) {
          const data = await getProcessusById(id)
          
          const rpList = Array.isArray(data.responsablesProcessus) ? data.responsablesProcessus : []
          const responsablesMetaArray = baseMeta.map(b => ({
            ...b,
            options: rpList
              .filter(rp => (rp.idTypeResponsableProcessus || rp.typeResponsableProcessus?.id) === b.idType)
              .map(rp => ({ value: rp.collaborateur?.matricule, label: `${rp.collaborateur?.nomComplet} (${rp.collaborateur?.departement})` }))
          }))

          setResponsablesMeta(responsablesMetaArray)

          reset({
            nom: data.nom || '',
            sigle: data.sigle || '',
            idCategorieProcessus: data.idCategorieProcessus || '',

            // add dynamic responsables fields so form can render them if present
            ...responsablesMetaArray.reduce((acc, r) => ({ ...acc, [r.fieldName]: r.options }), {}),
            finalite: data.finalite || '',
            contexte: data.contexte || '',
            status : data.status,
            // initialize new arrays
            intercations: data.intercations || data.interactions || [],
            ressourcesProcessus: Array.isArray(data.ressourcesProcessus) ? data.ressourcesProcessus.map(r => ({ idCategorieRessources: r.idCategorieRessources ?? r.categorieRessources?.id ?? '', descr: r.descr || '' })) : [],
            partieInteresseAttentes: data.partieInteresseAttentes || [],
            activites: data.activites || [],
          })
        } else {
          // New processus: prepare empty arrays for each expected responsable type
          setResponsablesMeta(baseMeta)
          reset({
            nom: '',
            sigle: '',
            idCategorieProcessus: '',
  
            // create empty arrays for each dynamic responsable field
            ...baseMeta.reduce((acc, r) => ({ ...acc, [r.fieldName]: [] }), {}),
            finalite: '',
            contexte: '',
            // initialize the new arrays
            intercations: [],
            ressourcesProcessus: [],
            partieInteresseAttentes: [],
            activites: [],
          })
        }
      } catch (err) {
        setPopType('danger')
        setPopMessage(err.message)
        setShowToast(true)
      }
    }

    prepare()
  }, [id, reset])

  const onSubmit = async (data) => {
    setShowToast(false)
    const payload = {
      ...data,
      // Build dynamic responsablesProcessus from dynamic fields
      responsablesProcessus: Array.isArray(responsablesMeta) && responsablesMeta.length > 0
        ? responsablesMeta.flatMap(r => {
            const values = data[r.fieldName]
            return Array.isArray(values)
              ? values.map(opt => ({ matriculeCollaborateur: opt.value, idTypeResponsableProcessus: r.idType }))
              : []
          })
        : undefined,
      // New arrays transformation
      intercations: Array.isArray(data.intercations) ? data.intercations.map(it => ({ descr: it.descr || '', idProcessusInteragi: it.idProcessusInteragi ? Number(it.idProcessusInteragi) : undefined })) : [],
      ressourcesProcessus: Array.isArray(data.ressourcesProcessus) ? data.ressourcesProcessus.map(r => {
        const rawId = r.idCategorieRessources ?? r.categorieRessources?.id ?? (r.categorieRessources_nom ? Number(r.categorieRessources_nom) : undefined)
        return { descr: r.descr || '', idCategorieRessources: rawId !== undefined && rawId !== '' ? Number(rawId) : undefined }
      }) : [],
      partieInteresseAttentes: Array.isArray(data.partieInteresseAttentes) ? data.partieInteresseAttentes.map(p => ({ partieInteresse: p.partieInteresse || '', groupe: p.groupe ? Number(p.groupe) : undefined, attente: p.attente || '' })) : [],
      activites: Array.isArray(data.activites) ? data.activites.map(a => ({ processusFournisseur: a.processusFournisseur || '', elementEntrante: a.elementEntrante || '', processusClient: a.processusClient || '', elementSortante: a.elementSortante || '', descr: a.descr || '' })) : [],
      // remove form-only fields
      ...responsablesMeta.reduce((acc, r) => ({ ...acc, [r.fieldName]: undefined }), {}),
      id: id ? id : undefined,
    }
    try {
      if (id) {
        await updateProcessus(id, payload)
        setPopType('success')
        setPopMessage('Valeur modifiée avec succès')
        // After updating, go to the fiche (detail) page for this processus
        navigate(`/cartographie/ficheprocessus/${id}`)
        setShowToast(true)
      } else {
        // Create and navigate to the created processus fiche when possible
        console.log('Payload processus (création):', payload)
        const created = await createProcessus(payload)
        setPopType('success')
        setPopMessage('Valeur insérée avec succès')
        setShowToast(true)
        // Try to extract the new id from common response shapes
        const newId = created?.id || created?.idProcessus || created?.processus?.id
        if (newId) {
          navigate(`/cartographie/ficheprocessus/${newId}`)
        } else {
          // Fallback: go back to cartographie if we can't determine the id
          navigate('/pilotage/cartographie/cartographie')
        }
        reset()
      }
    } catch (error) {
      if (error && error.errors) {
        Object.entries(error.errors).forEach(([field, messages]) => {
          setError(field.charAt(0).toLowerCase() + field.slice(1), {
            type: 'server',
            message: messages.join(' ')
          })
        })
      }
      setPopType('danger')
      setPopMessage('Erreur lors de l\'insertion ou modification')
      setShowToast(true)
    }
  }

  return {
    showToast,
    setShowToast,
    popType,
    popMessage,
    onSubmit,
    responsablesMeta,
  }
}