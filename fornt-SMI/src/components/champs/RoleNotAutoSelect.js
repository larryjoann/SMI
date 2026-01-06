import React, { useEffect, useState } from 'react'
import { CFormSelect } from '@coreui/react'
import axiosInstance from '../../api/axiosInstance'

const RoleNotAutoSelect = (props) => {
  const [roles, setRoles] = useState([])

  useEffect(() => {
    axiosInstance.get('/Role/notauto')
      .then(res => setRoles(res.data || []))
      .catch(() => setRoles([]))
  }, [])

  return (
    <CFormSelect id="role" {...props}>
      <option value="">Sélectionner un rôle</option>
      {roles.map(role => (
        <option key={role.id} value={role.id}>{role.nom}</option>
      ))}
    </CFormSelect>
  )
}

export default RoleNotAutoSelect
