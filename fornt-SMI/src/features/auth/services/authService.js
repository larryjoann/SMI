import axios from 'axios'
import API_URL from '../../../api/API_URL'

const AUTH_URL = `${API_URL}/Auth`

export const login = async (matricule, password) => {
  try {
    const response = await axios.post(
      `${AUTH_URL}/login`,
      { matricule, password },
      { 
        timeout: 0,
        withCredentials: true
      } // Pas de timeout, attend la réponse aussi longtemps que nécessaire
    )
    if (response.data.token) {
      sessionStorage.setItem('jwt', response.data.token)
    }
    return response.data
  } catch (error) {
    const message =
      error.response?.data?.message || 'Erreur lors de la connexion'
    throw new Error(message)
  }
}