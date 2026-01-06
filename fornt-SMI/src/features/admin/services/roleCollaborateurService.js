import axiosInstance from '../../../api/axiosInstance'

/**
 * Récupère la liste des rôles et collaborateurs
 * @returns {Promise<Array>} Liste des rôles avec infos collaborateur
 */
export const getRoleCollaborateurs = async () => {
  const res = await axiosInstance.get('/RoleCollaborateur')
  return res.data || []
}

/**
 * Crée une nouvelle assignation de rôle
 * @param {Object} data - Données du formulaire {matriculeCollaborateur, idRole}
 * @returns {Promise<Object>} Réponse de l'API
 */
export const createRoleCollaborateur = async (data) => {
  const res = await axiosInstance.post('/RoleCollaborateur', data)
  return res.data
}

/**
 * Récupère les rôles disponibles
 * @returns {Promise<Array>} Liste des rôles
 */
export const getRoles = async () => {
  const res = await axiosInstance.get('/Role/notauto')
  return res.data || []
}

/**
 * Récupère les collaborateurs disponibles
 * @returns {Promise<Array>} Liste des collaborateurs
 */
export const getCollaborateurs = async () => {
  const res = await axiosInstance.get('/Collaborateur')
  return res.data || []
}

/**
 * Importe les collaborateurs depuis Active Directory
 * @returns {Promise<Object>} Réponse de l'API
 */
export const importFromAD = async () => {
  const res = await axiosInstance.post('/Collaborateur/import')
  return res.data
}

/**
 * Supprime une assignation de rôle
 * @param {number} id - ID de l'assignation
 * @returns {Promise<Object>} Réponse de l'API
 */
export const deleteRoleCollaborateur = async (id) => {
  const res = await axiosInstance.delete(`/RoleCollaborateur/${id}`)
  return res.data
}
