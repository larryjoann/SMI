import axiosInstance from '../../../api/axiosInstance'

// Use shared axios instance so interceptors, baseURL and auth header handling are applied
export const login = async (matricule, password) => {
  try {
    const response = await axiosInstance.post('/Auth/login', { matricule, password }, { timeout: 0 })
    if (response?.data?.token) {
      sessionStorage.setItem('jwt', response.data.token)
    }
    return response.data
  } catch (error) {
    const message = error.response?.data?.message || 'Erreur lors de la connexion'
    throw new Error(message)
  }
}