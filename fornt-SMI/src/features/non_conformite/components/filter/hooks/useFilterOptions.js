import { useEffect, useState } from 'react'
import { fetchProcessOptions, fetchTypeOptions, fetchStatusOptions , fetchLieuOptions } from '../services/filterService'

export function useProcessOptions() {
  const [options, setOptions] = useState([{ id: 'all', label: 'Tous' }])
  useEffect(() => {
    fetchProcessOptions().then(setOptions)
  }, [])
  return options
}

export function useTypeOptions() {
  const [options, setOptions] = useState([{ id: 'all', label: 'Tous' }])
  useEffect(() => {
    fetchTypeOptions().then(setOptions)
  }, [])
  return options
}

export function useStatusOptions() {
  const [options, setOptions] = useState([{ id: 'all', label: 'Tous' }])
  useEffect(() => {
    fetchStatusOptions().then(setOptions)
  }, [])
  return options
}

export function useLieuOptions() {
  const [options, setOptions] = useState([{ id: 'all', label: 'Tous' }])
  useEffect(() => {
    fetchLieuOptions().then(setOptions)
  }, [])
  return options
}