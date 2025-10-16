import API_URL from "../../../api/API_URL"

export const draftToDeclareNC = async (id, payload) => {
  const res = await fetch(`${API_URL}/NCDetails/DraftToDeclare/${id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Erreur serveur' }))
    throw { response: { data: error } }
  }

  return true;
}
// Récupérer une NC par id
export const getNC = async (id) => {
  const res = await fetch(`${API_URL}/NCDetails/${id}`);
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Erreur serveur' }))
    throw { response: { data: error } }
  }
  return await res.json();
}

export const declareNC = async (payload) => {
  console.log('Declaring NC with payload:', payload);
  const res = await fetch(`${API_URL}/NCDetails/declare`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Erreur serveur' }))
    throw { response: { data: error } }
  }
  return await res.json()
}
