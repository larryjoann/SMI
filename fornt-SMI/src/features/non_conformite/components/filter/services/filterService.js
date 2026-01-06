import API_URL from "../../../../../api/API_URL"
import axiosInstance from '../../../../../api/axiosInstance'

export async function fetchProcessOptions() {
  const res = await axiosInstance.get('/Processus')
  const data = res.data
  return Array.isArray(data)
    ? [
        { id: 'all', label: 'Tous' },
        ...data.map(proc => ({ id: proc.id, label: proc.sigle }))
      ]
    : [{ id: 'all', label: 'Tous' }]
}

export async function fetchTypeOptions() {
  const res = await axiosInstance.get('/typeNC')
  const data = res.data
  return Array.isArray(data)
    ? [
        { id: 'all', label: 'Tous' },
        ...data.map(type => ({ id: type.id, label: type.nom }))
      ]
    : [{ id: 'all', label: 'Tous' }]
}

export async function fetchStatusOptions() {
  const res = await axiosInstance.get('/statusNC')
  const data = res.data
  return Array.isArray(data)
    ? [
        // { id: 'all', label: 'Tous' },
        ...data.map(status => ({ id: status.id, label: status.nom, color: status.color, id_phase: status.phaseNc.id, phaseNc: status.phaseNc.nom }))
      ]
    : [{ id: 'all', label: 'Tous' }]
}

export async function fetchLieuOptions() {
  const res = await axiosInstance.get('/lieu')
  const data = res.data
  return Array.isArray(data)
    ? [
        { id: 'all', label: 'Tous' },
        ...data.map(status => ({ id: status.id, label: status.nom }))
      ]
    : [{ id: 'all', label: 'Tous' }]
}

export async function fetchSourcePA() {
  const res = await axiosInstance.get('/SourcePA')
  const data = res.data
  return Array.isArray(data)
    ? [
        { id: 'all', label: 'Tous' },
        ...data.map(s => ({ id: s.id, label: s.descr }))
      ]
    : [{ id: 'all', label: 'Tous' }]
}

export async function fetchStatusPA() {
  const res = await axiosInstance.get('/StatusPA')
  const data = res.data
  return Array.isArray(data)
    ? [
        { id: 'all', label: 'Tous' },
        ...data.map(st => ({ id: st.id, label: st.nom, color: st.color}))
      ]
    : [{ id: 'all', label: 'Tous' }]
}
