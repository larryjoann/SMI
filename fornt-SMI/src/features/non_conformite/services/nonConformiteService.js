import API_URL from "../../../api/API_URL"

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
  const res = await fetch(`${API_URL}/NCDetails/DraftToDeclare/${id}`, {
    method: 'POST',
    credentials: 'include',
    body: form,
  })
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Erreur serveur' }))
    throw { response: { data: error } }
  }
  return await res.json()
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

  const res = await fetch(`${API_URL}/NCDetails/updateDraft/${id}`, {
    method: 'POST',
    credentials: 'include',
    body: form,
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Erreur serveur' }))
    throw { response: { data: error } }
  }
  return await res.json()
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

  const res = await fetch(`${API_URL}/NCDetails/updateDeclare/${id}`, {
    method: 'POST',
    credentials: 'include',
    body: form,
  })
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Erreur serveur' }))
    throw { response: { data: error } }
  }
  return await res.json()
}

// Archiver une NC par id
export const archiverNC = async (id) => {
  const res = await fetch(`${API_URL}/NCDetails/archiver/${id}`, {
    method: 'PUT',
    credentials: 'include',
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Erreur serveur' }))
    throw { response: { data: error } }
  }

  return true;
}

// Archiver une NC par id
export const restorerNC = async (id) => {
  const res = await fetch(`${API_URL}/NCDetails/restorer/${id}`, {
    method: 'PUT',
    credentials: 'include',
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Erreur serveur' }))
    throw { response: { data: error } }
  }
  return true;
}

// Récupérer une NC par id
export const getNC = async (id) => {
  const res = await fetch(`${API_URL}/NCDetails/${id}`, { credentials: 'include' });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Erreur serveur' }))
    throw { response: { data: error } }
  }
  return await res.json();
}

// Récupérer l'historique des activités pour une NC (par idObject)
export const getHistoriqueNC = async (idObject) => {
  const res = await fetch(`${API_URL}/historique/NC/${idObject}`, { credentials: 'include' })
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Erreur serveur' }))
    throw { response: { data: error } }
  }
  return await res.json()
}

// Créer un commentaire pour une NC
export const createCommentaire = async (payload) => {
  console.log('Creating commentaire with payload:', payload);
    const res = await fetch(`${API_URL}/CommentaireNc`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      // Try to parse JSON error, fallback to text
      let parsed
      try {
        parsed = await res.json()
      } catch (e) {
        parsed = await res.text().catch(() => null)
      }
      const err = { status: res.status, body: parsed }
      throw err
    }
    // Certains endpoints peuvent retourner 201 avec body
    try {
      return await res.json()
    } catch (e) {
      return true
    }
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
  const res = await fetch(`${API_URL}/NCDetails/declare`, {
    method: 'POST',
    credentials: 'include',
    body: form,
  })
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Erreur serveur' }))
    throw { response: { data: error } }
  }
  return await res.json()
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

  const res = await fetch(`${API_URL}/NCDetails/draft`, {
    method: 'POST',
    credentials: 'include',
    body: form,
  })

  console.log('draftNC payload (sanitized):', sanitizedDetails, { filesCount: Array.isArray(_files) ? _files.length : 0 })

  if (!res.ok) {
    // Log status, headers and raw body to help diagnose server-side errors (500)
    try {
      // clone so we can safely read text without consuming original stream for other consumers
      const raw = await res.clone().text()
      console.error('draftNC server status:', res.status)
      try {
        res.headers.forEach((v, k) => console.error(`header: ${k} = ${v}`))
      } catch (e) {
        // headers.forEach may not be present in some environments
      }
      console.error('draftNC raw response body:', raw)

      // Try to parse JSON from the raw text if possible
      let parsed
      try {
        parsed = JSON.parse(raw)
      } catch (e) {
        parsed = { message: raw || 'Erreur serveur' }
      }

      throw { response: { data: parsed, status: res.status } }
    } catch (e) {
      // If reading the response fails entirely, fallback to a generic error
      console.error('draftNC error while reading error response', e)
      throw { response: { data: { message: 'Erreur serveur' }, status: res.status } }
    }
  }

  return await res.json()
}
