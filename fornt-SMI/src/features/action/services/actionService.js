import API_URL from '../../../api/API_URL'

const apiBase = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL

export async function fetchActions() {
  const res = await fetch(`${apiBase}/Action`, { credentials: 'include' })
  if (!res.ok) {
    const txt = await res.text().catch(() => '')
    const err = new Error(`Failed to fetch actions: ${res.status} ${txt}`)
    err.status = res.status
    throw err
  }
  const json = await res.json().catch(() => null)
  return Array.isArray(json) ? json : (json?.data || json?.items || [])
}

export async function fetchStatuses() {
  const res = await fetch(`${apiBase}/StatusAction`, { credentials: 'include' })
  if (!res.ok) {
    const txt = await res.text().catch(() => '')
    const err = new Error(`Failed to fetch statuses: ${res.status} ${txt}`)
    err.status = res.status
    throw err
  }
  const json = await res.json().catch(() => null)
  return Array.isArray(json) ? json : (json?.data || json?.items || [])
}

export async function updateActionStatus(actionId, statusId) {
  const res = await fetch(`${apiBase}/Action/${actionId}/status/${statusId}`, {
    method: 'PATCH',
    credentials: 'include',
  })
  if (!res.ok && res.status !== 204) {
    const txt = await res.text().catch(() => '')
    const err = new Error(`Failed to update action status: ${res.status} ${txt}`)
    err.status = res.status
    throw err
  }
  return true
}

export async function getActionById(id) {
  if (!id) throw new Error('id is required')
  const base = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL
  const url = `${base}/Action/${id}`
  const res = await fetch(url, { credentials: 'include' })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    const err = new Error(`Failed to fetch action (${res.status})`)
    err.status = res.status
    err.body = text
    throw err
  }
  const json = await res.json().catch(() => null)
  return json
}

export default { getActionById }

export async function deleteAction(id) {
  if (!id) throw new Error('id is required')
  const res = await fetch(`${apiBase}/Action/${id}`, { method: 'DELETE', credentials: 'include' })
  if (!res.ok && res.status !== 204) {
    const txt = await res.text().catch(() => '')
    const err = new Error(`Failed to delete action: ${res.status} ${txt}`)
    err.status = res.status
    throw err
  }
  return true
}
