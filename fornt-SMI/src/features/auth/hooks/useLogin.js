import { useState } from 'react'
import { login as loginService } from '../services/authService'

export function useLogin() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const login = async (matricule, password, onSuccess) => {
    setError('')
    setLoading(true)
    try {
      await loginService(matricule, password)
      if (onSuccess) onSuccess()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { login, error, loading }
}