import API_URL from '../../../api/API_URL'

export async function createProcessus(data) {
  const res = await fetch(`${API_URL}/Processus`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const text = await res.text()
  if (!res.ok) {
    let error
    try {
      error = text ? JSON.parse(text) : { message: 'Erreur serveur' }
    } catch {
      error = { message: text || 'Erreur serveur' }
    }
    throw error
  }
  // Si la réponse est vide, retourner un objet vide
  return text ? JSON.parse(text) : {}
}

export async function updateProcessus(id, data) {
  const res = await fetch(`${API_URL}/Processus/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, id }),
  })
  const text = await res.text()
  if (!res.ok) {
    let error
    try {
      error = text ? JSON.parse(text) : { message: 'Erreur serveur' }
    } catch {
      error = { message: text || 'Erreur serveur' }
    }
    throw error
  }
  // Si la réponse est vide, retourner un objet vide
  return text ? JSON.parse(text) : {}
}

// Charger les collaborateurs et retourner l'option pour un matricule donné
export async function getCollaborateurOptionByMatricule(matricule) {
  const res = await fetch(`${API_URL}/Collaborateur`)
  if (!res.ok) return null
  const collabs = await res.json()
  const option = collabs
    .map(col => ({
      value: col.matricule,
      label: col.nomComplet + " (" + col.departement + ")"
    }))
    .find(opt => opt.value === matricule)
  return option || null
}

export async function getProcessusById(id) {
  const res = await fetch(`${API_URL}/Processus/${id}`)
  if (!res.ok) throw new Error('Erreur serveur')
  return await res.json()
}