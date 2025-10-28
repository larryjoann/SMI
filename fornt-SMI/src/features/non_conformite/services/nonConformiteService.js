import API_URL from "../../../api/API_URL"

export const draftToDeclareNC = async (id, payload) => {
  const res = await fetch(`${API_URL}/NCDetails/DraftToDeclare/${id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Erreur serveur' }))
    throw { response: { data: error } }
  }
  return await res.json()
}

export const updateDraftNC = async (id, payload) => {
  const res = await fetch(`${API_URL}/NCDetails/updateDraft/${id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Erreur serveur' }))
    throw { response: { data: error } }
  }
  return await res.json()
}

export const updateDeclareNC = async (id, payload) => {
  console.log('Updating declared NC with id:', id, 'and payload:', payload);
  const res = await fetch(`${API_URL}/NCDetails/updateDeclare/${id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
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
  console.log('Declaring NC with payload:', payload);
  const res = await fetch(`${API_URL}/NCDetails/declare`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Erreur serveur' }))
    throw { response: { data: error } }
  }
  return await res.json()
}

export const draftNC = async (payload) => {
  console.log('Drafting NC with payload:', payload);
  const res = await fetch(`${API_URL}/NCDetails/draft`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Erreur serveur' }))
    throw { response: { data: error } }
  }
  return await res.json()
}
