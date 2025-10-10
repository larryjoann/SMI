import API_URL from "../../../../../api/API_URL"

export async function fetchProcessOptions() {
  const res = await fetch(`${API_URL}/Processus`)
  const data = await res.json()
  return Array.isArray(data)
    ? [
        { id: 'all', label: 'Tous' },
        ...data.map(proc => ({ id: proc.id, label: proc.sigle }))
      ]
    : [{ id: 'all', label: 'Tous' }]
}

export async function fetchTypeOptions() {
  const res = await fetch(`${API_URL}/typeNC`)
  const data = await res.json()
  return Array.isArray(data)
    ? [
        { id: 'all', label: 'Tous' },
        ...data.map(type => ({ id: type.id, label: type.nom }))
      ]
    : [{ id: 'all', label: 'Tous' }]
}

export async function fetchStatusOptions() {
  const res = await fetch(`${API_URL}/statusNC`)
  const data = await res.json()
  return Array.isArray(data)
    ? [
        { id: 'all', label: 'Tous' },
        ...data.map(status => ({ id: status.id, label: status.nom, color: status.color }))
      ]
    : [{ id: 'all', label: 'Tous' }]
}

export async function fetchLieuOptions() {
  const res = await fetch(`${API_URL}/lieu`)
  const data = await res.json()
  return Array.isArray(data)
    ? [
        { id: 'all', label: 'Tous' },
        ...data.map(status => ({ id: status.id, label: status.nom }))
      ]
    : [{ id: 'all', label: 'Tous' }]
}
