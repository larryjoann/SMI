import { useState, useEffect } from 'react'
import { getRoleCollaborateurs, importFromAD } from '../services/roleCollaborateurService'

/**
 * Hook pour récupérer et gérer la liste des rôles collaborateurs
 * @returns {Object} État et fonctions pour gérer les rôles
 */
export function useRoleCollaborateurs() {
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchRoles = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getRoleCollaborateurs()
      // Mapper la réponse API au format attendu par le tableau
      const transformedData = (data || []).map(item => ({
        id: item.id,
        role: item.role?.nom || 'N/A',
        matricule: item.matriculeCollaborateur || '',
        nom: item.collaborateur?.nomAffichage || 'N/A'
      }))
      setRoles(transformedData)
    } catch (err) {
      console.error('Erreur lors du chargement des rôles:', err)
      setError(err.message)
      setRoles([])
    } finally {
      setLoading(false)
    }
  }

  // Charger les données au montage
  useEffect(() => {
    fetchRoles()
  }, [])

  const handleImportFromAD = async () => {
    try {
      const result = await importFromAD()
      const message = result?.message || result?.error || 'Importation terminée.'
      // Recharger la liste après import
      await fetchRoles()
      return { success: true, message }
    } catch (err) {
      console.error('Erreur lors de l\'import:', err)
      const detail = err?.response?.data?.detail || err?.response?.data?.error || err.message || 'Erreur lors de l\'import depuis Active Directory.'
      return { success: false, message: detail }
    }
  }

  return {
    roles,
    loading,
    error,
    fetchRoles,
    handleImportFromAD
  }
}
