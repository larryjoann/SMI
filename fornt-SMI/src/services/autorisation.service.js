import axiosInstance from '../api/axiosInstance'

const ROLE_PERMISSION_ENDPOINT = '/RolePermission'

/**
 * Service pour gérer les autorisations et les permissions
 */
const autorisationService = {
  /**
   * Récupère toutes les autorisations (rôle-permission)
   * @returns {Promise<Array>} Liste des autorisations
   */
  getAllRolePermissions: async () => {
    try {
      const response = await axiosInstance.get(ROLE_PERMISSION_ENDPOINT)
      return response.data
    } catch (error) {
      console.error('Erreur lors du chargement des autorisations:', error)
      throw error
    }
  },

  /**
   * Crée une nouvelle autorisation
   * @param {Object} data - Données de l'autorisation
   * @returns {Promise<Object>} Autorisation créée
   */
  createRolePermission: async (data) => {
    try {
      const response = await axiosInstance.post(ROLE_PERMISSION_ENDPOINT, data)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la création de l\'autorisation:', error)
      throw error
    }
  },

  /**
   * Met à jour une autorisation
   * @param {number} id - ID de l'autorisation
   * @param {Object} data - Données à mettre à jour
   * @returns {Promise<Object>} Autorisation mise à jour
   */
  updateRolePermission: async (id, data) => {
    try {
      const response = await axiosInstance.put(`${ROLE_PERMISSION_ENDPOINT}/${id}`, data)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'autorisation:', error)
      throw error
    }
  },

  /**
   * Supprime une autorisation
   * @param {number} id - ID de l'autorisation à supprimer
   * @returns {Promise<void>}
   */
  deleteRolePermission: async (id) => {
    try {
      await axiosInstance.delete(`${ROLE_PERMISSION_ENDPOINT}/${id}`)
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'autorisation:', error)
      throw error
    }
  },

  /**
   * Récupère les permissions filtrées
   * @param {string} roleName - Nom du rôle à filtrer (optionnel)
   * @param {string} entiteName - Nom de l'entité à filtrer (optionnel)
   * @param {string} permissionName - Nom de la permission à filtrer (optionnel)
   * @returns {Promise<Array>} Permissions filtrées
   */
  getFilteredRolePermissions: async (roleName = '', entiteName = '', permissionName = '') => {
    try {
      const response = await axiosInstance.get(ROLE_PERMISSION_ENDPOINT, {
        params: {
          roleName: roleName || undefined,
          entiteName: entiteName || undefined,
          permissionName: permissionName || undefined,
        },
      })
      return response.data
    } catch (error) {
      console.error('Erreur lors du filtrage des autorisations:', error)
      throw error
    }
  },
}

export default autorisationService
