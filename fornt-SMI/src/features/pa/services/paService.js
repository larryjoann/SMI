import API_URL from '../../../api/API_URL'
import axiosInstance from '../../../api/axiosInstance'

const apiBase = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL

export async function getPA(id) {
  if (!id) throw new Error('id is required')
  try {
    const res = await axiosInstance.get(`/PlanAction/${id}`)
    return res.data
  } catch (error) {
    const status = error?.response?.status || 500
    const txt = error?.response?.data ? (typeof error.response.data === 'string' ? error.response.data : JSON.stringify(error.response.data)) : (error.message || '')
    const err = new Error(`Failed to fetch PA: ${status} ${txt}`)
    err.status = status
    throw err
  }
}

export async function createSourcePA(descr) {
  try {
    const res = await axiosInstance.post('/SourcePA', { descr })
    return res.data
  } catch (error) {
    const status = error?.response?.status || 500
    const txt = error?.response?.data ? (typeof error.response.data === 'string' ? error.response.data : JSON.stringify(error.response.data)) : (error.message || '')
    const err = new Error(`Failed to create Source_PA: ${status} ${txt}`)
    err.status = status
    throw err
  }
}

export async function updateSourcePA(id, descr) {
  try {
    const res = await axiosInstance.put(`/SourcePA/${id}`, { descr })
    return res.status >= 200 && res.status < 300
  } catch (error) {
    const status = error?.response?.status || 500
    const txt = error?.response?.data ? (typeof error.response.data === 'string' ? error.response.data : JSON.stringify(error.response.data)) : (error.message || '')
    const err = new Error(`Failed to update Source_PA: ${status} ${txt}`)
    err.status = status
    throw err
  }
}

export async function createPlanAction(payload) {
    console.log('Creating Plan_action with payload:', payload);
  try {
    const res = await axiosInstance.post('/PlanAction', payload)
    return res.data
  } catch (error) {
    const status = error?.response?.status || 500
    const txt = error?.response?.data ? (typeof error.response.data === 'string' ? error.response.data : JSON.stringify(error.response.data)) : (error.message || '')
    const err = new Error(`Failed to create Plan_action: ${status} ${txt}`)
    err.status = status
    throw err
  }
}

export async function updatePlanAction(id, payload) {
  try {
    const res = await axiosInstance.put(`/PlanAction/${id}`, payload)
    return res.status >= 200 && res.status < 300
  } catch (error) {
    const status = error?.response?.status || 500
    const txt = error?.response?.data ? (typeof error.response.data === 'string' ? error.response.data : JSON.stringify(error.response.data)) : (error.message || '')
    const err = new Error(`Failed to update Plan_action: ${status} ${txt}`)
    err.status = status
    throw err
  }
}

export async function deleteProcessusConcerneByPa(paId) {
  // best-effort: backend may expose a dedicated endpoint; fallback if not available
  try {
    const res = await axiosInstance.delete(`/ProcessusConcernePA/${paId}`)
    return res.status >= 200 && res.status < 400
  } catch (err) {
    return false
  }
}

export async function getSources() {
  try {
    const res = await axiosInstance.get('/SourcePA')
    const json = res.data
    return Array.isArray(json) ? json : (json?.data || json?.items || [])
  } catch (error) {
    const status = error?.response?.status || 500
    const txt = error?.response?.data ? (typeof error.response.data === 'string' ? error.response.data : JSON.stringify(error.response.data)) : (error.message || '')
    const err = new Error(`Failed to fetch sources: ${status} ${txt}`)
    err.status = status
    throw err
  }
}

export async function getPlanActions() {
  try {
    const res = await axiosInstance.get('/PlanAction')
    const json = res.data
    return Array.isArray(json) ? json : (json?.data || json?.items || [])
  } catch (error) {
    const status = error?.response?.status || 500
    const txt = error?.response?.data ? (typeof error.response.data === 'string' ? error.response.data : JSON.stringify(error.response.data)) : (error.message || '')
    const err = new Error(`Failed to fetch Plan actions: ${status} ${txt}`)
    err.status = status
    throw err
  }
}

export async function createProcessusConcerne(mapping) {
    console.log('Creating Processus_concerne_PA with mapping:', mapping);
  try {
    const res = await axiosInstance.post('/ProcessusConcernePA', mapping)
    return res.data
  } catch (error) {
    const status = error?.response?.status || 500
    const txt = error?.response?.data ? (typeof error.response.data === 'string' ? error.response.data : JSON.stringify(error.response.data)) : (error.message || '')
    const err = new Error(`Failed to create Processus_concerne_PA: ${status} ${txt}`)
    err.status = status
    throw err
  }
}

export default {
  getPA,
  createSourcePA,
  updateSourcePA,
  createPlanAction,
  updatePlanAction,
  // deleteProcessusConcerneByPa,
  createProcessusConcerne,
  getPlanActions,
}
