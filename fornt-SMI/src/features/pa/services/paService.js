import API_URL from '../../../api/API_URL'

const apiBase = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL

export async function getPA(id) {
  if (!id) throw new Error('id is required')
  const res = await fetch(`${apiBase}/PlanAction/${id}`, { credentials: 'include' })
  if (!res.ok) {
    const txt = await res.text().catch(() => '')
    const err = new Error(`Failed to fetch PA: ${res.status} ${txt}`)
    err.status = res.status
    throw err
  }
  return res.json().catch(() => null)
}

export async function createSourcePA(descr) {
  const res = await fetch(`${apiBase}/SourcePA`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ descr })
  })
  if (!res.ok) {
    const txt = await res.text().catch(() => '')
    const err = new Error(`Failed to create Source_PA: ${res.status} ${txt}`)
    err.status = res.status
    throw err
  }
  return res.json().catch(() => null)
}

export async function updateSourcePA(id, descr) {
  const res = await fetch(`${apiBase}/SourcePA/${id}`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ descr })
  })
  if (!res.ok) {
    const txt = await res.text().catch(() => '')
    const err = new Error(`Failed to update Source_PA: ${res.status} ${txt}`)
    err.status = res.status
    throw err
  }
  return true
}

export async function createPlanAction(payload) {
    console.log('Creating Plan_action with payload:', payload);
  const res = await fetch(`${apiBase}/PlanAction`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(payload)
  })
  if (!res.ok) {
    const txt = await res.text().catch(() => '')
    const err = new Error(`Failed to create Plan_action: ${res.status} ${txt}`)
    err.status = res.status
    throw err
  }
  return res.json().catch(() => null)
}

export async function updatePlanAction(id, payload) {
  const res = await fetch(`${apiBase}/PlanAction/${id}`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(payload)
  })
  if (!res.ok) {
    const txt = await res.text().catch(() => '')
    const err = new Error(`Failed to update Plan_action: ${res.status} ${txt}`)
    err.status = res.status
    throw err
  }
  return true
}

export async function deleteProcessusConcerneByPa(paId) {
  // best-effort: backend may expose a dedicated endpoint; fallback if not available
  try {
    const res = await fetch(`${apiBase}/ProcessusConcernePA/${paId}`, { method: 'DELETE', credentials: 'include' })
    if (!res.ok) {
      // ignore non-ok for idempotency
      return false
    }
    return true
  } catch (err) {
    return false
  }
}

export async function getSources() {
  const res = await fetch(`${apiBase}/SourcePA`, { credentials: 'include' })
  if (!res.ok) {
    const txt = await res.text().catch(() => '')
    const err = new Error(`Failed to fetch sources: ${res.status} ${txt}`)
    err.status = res.status
    throw err
  }
  const json = await res.json().catch(() => null)
  return Array.isArray(json) ? json : (json?.data || json?.items || [])
}

export async function getPlanActions() {
  const res = await fetch(`${apiBase}/PlanAction`, { credentials: 'include' })
  if (!res.ok) {
    const txt = await res.text().catch(() => '')
    const err = new Error(`Failed to fetch Plan actions: ${res.status} ${txt}`)
    err.status = res.status
    throw err
  }
  const json = await res.json().catch(() => null)
  return Array.isArray(json) ? json : (json?.data || json?.items || [])
}

export async function createProcessusConcerne(mapping) {
    console.log('Creating Processus_concerne_PA with mapping:', mapping);
  const res = await fetch(`${apiBase}/ProcessusConcernePA`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(mapping)
  })
  if (!res.ok) {
    const txt = await res.text().catch(() => '')
    const err = new Error(`Failed to create Processus_concerne_PA: ${res.status} ${txt}`)
    err.status = res.status
    throw err
  }
  return res.json().catch(() => null)
}

export default {
  getPA,
  createSourcePA,
  updateSourcePA,
  createPlanAction,
  updatePlanAction,
  deleteProcessusConcerneByPa,
  createProcessusConcerne,
  getPlanActions,
}
