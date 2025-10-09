import { useEffect, useState } from 'react'
import { getDeclaration , getBrouillon, getAll } from '../components/panel/services/ncService'

export function useGetDeclaration() {
  const [ncData, setNCData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    getDeclaration()
      .then(data => {
        setNCData(data)
        setLoading(false)
      })
      .catch(e => {
        setError(e)
        setLoading(false)
      })
  }, [])
  return { ncData, loading, error }
}

export function useGetBrouillon() {
  const [ncData, setNCData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    getBrouillon()
      .then(data => {
        setNCData(data)
        setLoading(false)
      })
      .catch(e => {
        setError(e)
        setLoading(false)
      })
  }, [])
  return { ncData, loading, error }
}

export function useGetAll() {
  const [ncData, setNCData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    getAll()
      .then(data => {
        setNCData(data)
        setLoading(false)
      })
      .catch(e => {
        setError(e)
        setLoading(false)
      })
  }, [])
  return { ncData, loading, error }
}
