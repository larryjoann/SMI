import API_URL from '../../../../../api/API_URL'

export async function getDeclaration() {
  const res = await fetch(`${API_URL}/NCDetails/declare`)
  const data = await res.json()
  return data;
}

export async function getBrouillon() {
  const res = await fetch(`${API_URL}/NCDetails/drafts`)
  const data = await res.json()
  return data;
}

export async function getAll() {
  const res = await fetch(`${API_URL}/NCDetails`)
  const data = await res.json()
  return data;
}
