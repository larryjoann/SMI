import API_URL from '../../../api/API_URL'
import axiosInstance from '../../../api/axiosInstance'

export async function createSuivi(payload) {
  if (!payload || !payload.idAction) throw new Error('idAction is required')
  const url = '/SuiviAction'
  console.log("creation suivi playload" + payload)
  try {
    const res = await axiosInstance.post(url, payload)
    return res.data
  } catch (error) {
    const status = error?.response?.status || 500
    const txt = error?.response?.data ? (typeof error.response.data === 'string' ? error.response.data : JSON.stringify(error.response.data)) : (error.message || '')
    const err = new Error(`Failed to create suivi (${status})`)
    err.status = status
    err.body = txt
    throw err
  }
}

export default { createSuivi }
