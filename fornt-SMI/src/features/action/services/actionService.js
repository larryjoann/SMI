import API_URL from '../../../api/API_URL'
import axiosInstance from '../../../api/axiosInstance'

const apiBase = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL

export async function fetchActions() {
  try {
    const res = await axiosInstance.get('/Action')
    const json = res.data
    return Array.isArray(json) ? json : (json?.data || json?.items || [])
  } catch (error) {
    const status = error?.response?.status || 500
    const txt = error?.response?.data ? (typeof error.response.data === 'string' ? error.response.data : JSON.stringify(error.response.data)) : (error.message || '')
    const err = new Error(`Failed to fetch actions: ${status} ${txt}`)
    err.status = status
    throw err
  }
}

export async function fetchStatuses() {
  try {
    const res = await axiosInstance.get('/StatusAction')
    const json = res.data
    return Array.isArray(json) ? json : (json?.data || json?.items || [])
  } catch (error) {
    const status = error?.response?.status || 500
    const txt = error?.response?.data ? (typeof error.response.data === 'string' ? error.response.data : JSON.stringify(error.response.data)) : (error.message || '')
    const err = new Error(`Failed to fetch statuses: ${status} ${txt}`)
    err.status = status
    throw err
  }
}

export async function updateActionStatus(actionId, statusId) {
  try {
    const res = await axiosInstance.patch(`/Action/${actionId}/status/${statusId}`)
    return res.status >= 200 && res.status < 300
  } catch (error) {
    const status = error?.response?.status || 500
    const txt = error?.response?.data ? (typeof error.response.data === 'string' ? error.response.data : JSON.stringify(error.response.data)) : (error.message || '')
    const err = new Error(`Failed to update action status: ${status} ${txt}`)
    err.status = status
    throw err
  }
}

export async function getActionById(id) {
  if (!id) throw new Error('id is required')
  const base = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL
  const url = `${base}/Action/${id}`
  try {
    const res = await axiosInstance.get(`/Action/${id}`)
    return res.data
  } catch (error) {
    const status = error?.response?.status || 500
    const txt = error?.response?.data ? (typeof error.response.data === 'string' ? error.response.data : JSON.stringify(error.response.data)) : (error.message || '')
    const err = new Error(`Failed to fetch action (${status})`)
    err.status = status
    err.body = txt
    throw err
  }
}

export default { getActionById }

export async function deleteAction(id) {
  if (!id) throw new Error('id is required')
  try {
    const res = await axiosInstance.delete(`/Action/${id}`)
    return res.status >= 200 && res.status < 300
  } catch (error) {
    const status = error?.response?.status || 500
    const txt = error?.response?.data ? (typeof error.response.data === 'string' ? error.response.data : JSON.stringify(error.response.data)) : (error.message || '')
    const err = new Error(`Failed to delete action: ${status} ${txt}`)
    err.status = status
    throw err
  }
}
