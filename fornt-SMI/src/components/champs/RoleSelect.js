import React, { useEffect, useState } from 'react'
import { CFormSelect } from '@coreui/react'
import axiosInstance from '../../api/axiosInstance'

const RoleSelect = (props) => {
  const [roles, setRoles] = useState([])

  useEffect(() => {
    axiosInstance.get('/Role')
      .then(res => setRoles(res.data || []))
      .catch(() => setRoles([]))
  }, [])

  return (
    <CFormSelect id={props.id || 'role'} {...props}>
      <option value="">{props.placeholder || 'Sélectionner un rôle'}</option>
      {roles.map(role => (
        <option key={role.id} value={role.id}>{role.nom}</option>
      ))}
    </CFormSelect>
  )
}

export default RoleSelect
