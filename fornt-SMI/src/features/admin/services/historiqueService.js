import API_URL from '../../../api/API_URL'
import axiosInstance from '../../../api/axiosInstance'

export async function getHistoriques() {
  const res = await axiosInstance.get('/Historique')
  return res.data
}