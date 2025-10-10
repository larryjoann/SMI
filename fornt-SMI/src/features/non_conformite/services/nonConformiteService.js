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
import API_URL from "../../../api/API_URL"

export const declareNC = async (payload) => {
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
