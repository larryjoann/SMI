import axios from 'axios'
import API_URL from './API_URL'

// Fonction utilitaire pour décoder le JWT et récupérer le matricule
export function getMatriculeFromJwt() {
  const token = sessionStorage.getItem('jwt')
  if (!token) return null
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.sub // car tu as mis le matricule dans le claim "sub"
  } catch {
    return null
  }
}

const axiosInstance = axios.create({
  baseURL: API_URL,
  // Allow sending cookies (credentials) with cross-site requests when needed
  withCredentials: true,
})

axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('jwt')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

export default axiosInstance