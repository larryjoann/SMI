import API_URL from "../../../api/API_URL"
import axiosInstance from '../../../api/axiosInstance'

// Helper: convert numeric-looking string fields to numbers for server model binding
const sanitizeDetailsNumbers = (details) => {
  if (!details) return details
  const cloned = JSON.parse(JSON.stringify(details))
  try {
    if (cloned.nc && typeof cloned.nc === 'object') {
      const c = cloned.nc
      // ensure numeric id fields are numbers (some UI code sends them as strings)
      if (c.id && typeof c.id === 'string') c.id = parseInt(c.id, 10)
      if (c.idLieu && typeof c.idLieu === 'string') c.idLieu = parseInt(c.idLieu, 10)
      if (c.idTypeNc && typeof c.idTypeNc === 'string') c.idTypeNc = parseInt(c.idTypeNc, 10)
      if (c.idPrioriteNc && typeof c.idPrioriteNc === 'string') c.idPrioriteNc = parseInt(c.idPrioriteNc, 10)
      if (c.idStatusNc && typeof c.idStatusNc === 'string') c.idStatusNc = parseInt(c.idStatusNc, 10)
    }
    if (Array.isArray(cloned.processusConcerne)) {
      cloned.processusConcerne = cloned.processusConcerne.map(p => ({
        ...p,
        idProcessus: (p && typeof p.idProcessus === 'string') ? parseInt(p.idProcessus, 10) : p.idProcessus
      }))
    }
  } catch (e) {
    // if sanitization fails, return the original details to avoid masking the error
    return details
  }
  return cloned
}

export const draftToDeclareNC = async (id, payload) => {
  // payload expected to be NCDetails-like object. Support optional files array as third parameter.
  const { _files, ...bodyPayload } = payload || {}
  const form = new FormData()
  // sanitize numeric fields (convert numeric strings to numbers)
  const sanitizedDetails = sanitizeDetailsNumbers(bodyPayload)
  form.append('details', JSON.stringify(sanitizedDetails))
  if (Array.isArray(_files)) {
    _files.forEach(f => form.append('fichiers', f))
  }
  const res = await axiosInstance.post(`/NCDetails/DraftToDeclare/${id}`, form)
  return res.data
}

export const updateDraftNC = async (id, payload) => {
  // Support multipart/form-data with optional files (payload._files)
  const { _files, ...bodyPayload } = payload || {}
  const form = new FormData()
  const sanitizedDetails = sanitizeDetailsNumbers(bodyPayload)
  form.append('details', JSON.stringify(sanitizedDetails))
  if (Array.isArray(_files)) {
    _files.forEach(f => form.append('fichiers', f))
  }

  const res = await axiosInstance.post(`/NCDetails/updateDraft/${id}`, form)
  return res.data
}

export const updateDeclareNC = async (id, payload) => {
  console.log('Updating declared NC with id:', id, 'and payload:', payload);
  // Support multipart/form-data with optional files (payload._files)
  const { _files, ...bodyPayload } = payload || {}
  const form = new FormData()
  const sanitizedDetails = sanitizeDetailsNumbers(bodyPayload)
  form.append('details', JSON.stringify(sanitizedDetails))
  if (Array.isArray(_files)) {
    _files.forEach(f => form.append('fichiers', f))
  }

  const res = await axiosInstance.post(`/NCDetails/updateDeclare/${id}`, form)
  return res.data
}

// Archiver une NC par id
export const archiverNC = async (id) => {
  const res = await axiosInstance.put(`/NCDetails/archiver/${id}`)
  return res.status >= 200 && res.status < 300
}

// Archiver une NC par id
export const restorerNC = async (id) => {
  const res = await axiosInstance.put(`/NCDetails/restorer/${id}`)
  return res.status >= 200 && res.status < 300
}

// Supprimer définitivement une NC par id
export const supprimerNC = async (id) => {
  const res = await axiosInstance.put(`/NonConformite/supprimer/${id}`)
  return res.status >= 200 && res.status < 300
}

// Récupérer une NC par id
export const getNC = async (id) => {
  const res = await axiosInstance.get(`/NCDetails/${id}`)
  return res.data
}

// Récupérer l'historique des activités pour une NC (par idObject)
export const getHistoriqueNC = async (idObject) => {
  const res = await axiosInstance.get(`/historique/NC/${idObject}`)
  return res.data
}

// Créer un commentaire pour une NC
export const createCommentaire = async (payload) => {
  console.log('Creating commentaire with payload:', payload);
    const res = await axiosInstance.post('/CommentaireNc', payload, { headers: { 'Content-Type': 'application/json' } })
    return res.data || true
}

export const declareNC = async (payload) => {
  // payload: { nc, piecesJointes, processusConcerne }
  // files: outside callers should pass File objects in payload._files or call declareNC(payload, files)
  const { _files, ...bodyPayload } = payload || {}
  const form = new FormData()
  // sanitize numeric fields (convert numeric strings to numbers)
  const sanitizedDetails = sanitizeDetailsNumbers(bodyPayload)
  form.append('details', JSON.stringify(sanitizedDetails))
  if (Array.isArray(_files)) {
    _files.forEach(f => form.append('fichiers', f))
  }
  const res = await axiosInstance.post('/NCDetails/declare', form)
  return res.data
}

export const draftNC = async (payload) => {
  const { _files, ...bodyPayload } = payload || {}
  const form = new FormData()
  // sanitize numeric fields (convert numeric strings to numbers)
  const sanitizedDetails = sanitizeDetailsNumbers(bodyPayload)
  form.append('details', JSON.stringify(sanitizedDetails))
  // append files if provided
  if (Array.isArray(_files)) {
    _files.forEach(f => form.append('fichiers', f))
  }

  // Debug: iterate FormData entries to make the contents visible in the console
  // (console.log(form) often prints an empty FormData object in some browsers)
  try {
    for (const pair of form.entries()) {
      // For files this will log the File object; for details it'll log the JSON string
      console.log('FormData entry ->', pair[0], pair[1])
    }
  } catch (e) {
    console.warn('Unable to iterate FormData entries for debug:', e)
  }

  try {
    const res = await axiosInstance.post('/NCDetails/draft', form)
    console.log('draftNC payload (sanitized):', sanitizedDetails, { filesCount: Array.isArray(_files) ? _files.length : 0 })
    return res.data
  } catch (error) {
    const status = error?.response?.status || 500
    let parsed = error?.response?.data || null
    try {
      if (parsed && typeof parsed !== 'string') {
        parsed = JSON.parse(JSON.stringify(parsed))
      }
    } catch (_e) {
      // ignore
    }
    console.error('draftNC error', { status, data: parsed, error })
    throw { response: { data: parsed || { message: 'Erreur serveur' }, status } }
  }
}
