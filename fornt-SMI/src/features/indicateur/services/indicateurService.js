import axiosInstance from '../../../api/axiosInstance'

export const getIndicateurs = async () => {
  const res = await axiosInstance.get('/Indicateur')
  return res.data || []
}
