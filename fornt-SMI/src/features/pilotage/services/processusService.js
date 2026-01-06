import API_URL from '../../../api/API_URL'
import axiosInstance from '../../../api/axiosInstance'

export async function createProcessus(data) {
  try {
    const res = await axiosInstance.post('/Processus', data)
    return res.data || {}
  } catch (error) {
    const status = error?.response?.status || 500
    const dataText = error?.response?.data ? (typeof error.response.data === 'string' ? error.response.data : JSON.stringify(error.response.data)) : (error.message || '')
    let parsed
    try {
      parsed = dataText ? JSON.parse(dataText) : { message: 'Erreur serveur' }
    } catch {
      parsed = { message: dataText || 'Erreur serveur' }
    }
    const err = new Error(parsed?.message || 'Erreur serveur')
    err.status = status
    throw err
  }
}

export async function updateProcessus(id, data) {
  try {
    const res = await axiosInstance.put(`/Processus/${id}`, { ...data, id })
    return res.data || {}
  } catch (error) {
    const status = error?.response?.status || 500
    const dataText = error?.response?.data ? (typeof error.response.data === 'string' ? error.response.data : JSON.stringify(error.response.data)) : (error.message || '')
    let parsed
    try {
      parsed = dataText ? JSON.parse(dataText) : { message: 'Erreur serveur' }
    } catch {
      parsed = { message: dataText || 'Erreur serveur' }
    }
    const err = new Error(parsed?.message || 'Erreur serveur')
    err.status = status
    throw err
  }
}

// Charger les collaborateurs et retourner l'option pour un matricule donné
export async function getCollaborateurOptionByMatricule(matricule) {
  const res = await axiosInstance.get('/Collaborateur')
  const collabs = res && res.data ? res.data : []
  const option = collabs
    .map(col => ({
      value: col.matricule,
      label: col.nomComplet + " (" + col.departement + ")"
    }))
    .find(opt => opt.value === matricule)
  return option || null
}

export async function getProcessusById(id) {
  const res = await axiosInstance.get(`/Processus/${id}`)
  return res && res.data ? res.data : null
}

export async function getTypeResponsableProcessus() {
  const res = await axiosInstance.get('/TypeResponsableProcessus')
  return res && res.data ? res.data : []
}