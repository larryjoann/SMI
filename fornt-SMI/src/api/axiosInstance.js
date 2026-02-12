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
  //withCredentials: true,
})

axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('jwt')
    if (token) {
      // check expiry and redirect if expired
      try {
        const payload = JSON.parse(atob(token.split('.')[1] || ''))
        if (payload && payload.exp && Date.now() / 1000 >= payload.exp) {
          sessionStorage.removeItem('jwt')
          if (typeof window !== 'undefined') window.location.href = '#/login'
          return Promise.reject(new Error('Token expired'))
        }
      } catch (_) {
        // ignore decode errors
      }
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Global response handler: on 401 remove token and redirect to login, on 403 redirect to access denied
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      try {
        sessionStorage.removeItem('jwt')
      } catch (e) {
        // ignore
      }
      // redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '#/login'
      }
    } else if (error?.response?.status === 403) {
      // redirect to access denied page
      if (typeof window !== 'undefined') {
        window.location.href = '#/403'
      }
    }
    return Promise.reject(error)
  }
)

export default axiosInstance