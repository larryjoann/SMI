import API_URL from '../../../../../api/API_URL'

export async function getDeclaration() {
  const res = await fetch(`${API_URL}/NCDetails/declare`,{credentials: 'include',})
  const data = await res.json()
  return data;
}

export async function getBrouillon() {
  const res = await fetch(`${API_URL}/NCDetails/drafts`,{credentials: 'include',})
  const data = await res.json()
  return data;
}

export async function getAll() {
  const res = await fetch(`${API_URL}/NCDetails/by-matricule`,{credentials: 'include',})
  const data = await res.json()
  return data;
}

export async function getArchived() {
  const res = await fetch(`${API_URL}/NCDetails/archived`,{credentials: 'include',})
  const data = await res.json()
  return data;
}
