import { useState, useEffect } from 'react'
import autorisationService from '../services/autorisation.service'

/**
 * Hook personnalisé pour gérer les autorisations
 * @returns {Object} État et méthodes pour gérer les autorisations
 */
export const useAutorisations = () => {
  const [rolePermissions, setRolePermissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  /**
   * Charge toutes les autorisations
   */
  const fetchRolePermissions = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await autorisationService.getAllRolePermissions()
      setRolePermissions(data)
    } catch (err) {
      console.error('Erreur lors du chargement des autorisations:', err)
      setError('Impossible de charger les autorisations')
      setRolePermissions([])
    } finally {
      setLoading(false)
    }
  }

  /**
   * Charge les autorisations filtrées
   * @param {string} roleName - Nom du rôle
   * @param {string} entiteName - Nom de l'entité
   * @param {string} permissionName - Nom de la permission
   */
  const fetchFilteredRolePermissions = async (roleName = '', entiteName = '', permissionName = '') => {
    try {
      setLoading(true)
      setError(null)
      const data = await autorisationService.getFilteredRolePermissions(roleName, entiteName, permissionName)
      setRolePermissions(data)
    } catch (err) {
      console.error('Erreur lors du filtrage des autorisations:', err)
      setError('Impossible de charger les autorisations filtrées')
      setRolePermissions([])
    } finally {
      setLoading(false)
    }
  }

  /**
   * Crée une nouvelle autorisation
   * @param {Object} data - Données de l'autorisation
   */
  const createRolePermission = async (data) => {
    try {
      setError(null)
      const newRolePermission = await autorisationService.createRolePermission(data)
      setRolePermissions([...rolePermissions, newRolePermission])
      return newRolePermission
    } catch (err) {
      console.error('Erreur lors de la création de l\'autorisation:', err)
      setError('Impossible de créer l\'autorisation')
      throw err
    }
  }

  /**
   * Supprime une autorisation
   * @param {number} id - ID de l'autorisation
   */
  const deleteRolePermission = async (id) => {
    try {
      setError(null)
      await autorisationService.deleteRolePermission(id)
      setRolePermissions(rolePermissions.filter((rp) => rp.id !== id))
    } catch (err) {
      console.error('Erreur lors de la suppression de l\'autorisation:', err)
      setError('Impossible de supprimer l\'autorisation')
      throw err
    }
  }

  /**
   * Met à jour une autorisation
   * @param {number} id - ID de l'autorisation
   * @param {Object} data - Données à mettre à jour
   */
  const updateRolePermission = async (id, data) => {
    try {
      setError(null)
      const updatedRolePermission = await autorisationService.updateRolePermission(id, data)
      setRolePermissions(
        rolePermissions.map((rp) => (rp.id === id ? updatedRolePermission : rp))
      )
      return updatedRolePermission
    } catch (err) {
      console.error('Erreur lors de la mise à jour de l\'autorisation:', err)
      setError('Impossible de mettre à jour l\'autorisation')
      throw err
    }
  }

  /**
   * Récupère les rôles uniques
   * @returns {Array} Liste des rôles uniques
   */
  const getUniqueRoles = () => {
    const rolesSet = new Set(rolePermissions.map((rp) => rp.role?.nom))
    return Array.from(rolesSet).filter(Boolean)
  }

  /**
   * Récupère les entités uniques
   * @returns {Array} Liste des entités uniques
   */
  const getUniqueEntites = () => {
    const entitesSet = new Set(rolePermissions.map((rp) => rp.permission?.entite?.nom))
    return Array.from(entitesSet).filter(Boolean)
  }

  // Charger les données au montage du composant
  useEffect(() => {
    fetchRolePermissions()
  }, [])

  return {
    rolePermissions,
    loading,
    error,
    fetchRolePermissions,
    fetchFilteredRolePermissions,
    createRolePermission,
    deleteRolePermission,
    updateRolePermission,
    getUniqueRoles,
    getUniqueEntites,
  }
}
