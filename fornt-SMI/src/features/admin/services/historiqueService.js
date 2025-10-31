import API_URL from '../../../api/API_URL'

export async function getHistoriques() {
  const res = await fetch(`${API_URL}/Historique`, { credentials: 'include' })
  if (!res.ok) throw new Error('Erreur serveur')
  return await res.json()
}