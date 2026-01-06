import React, { useEffect, useState } from 'react'
import { CFormSelect } from '@coreui/react'
import API_URL from '../../api/API_URL'
import axiosInstance from '../../api/axiosInstance'

const TypeNCSelect = (props) => {
  const [types, setTypes] = useState([])

  useEffect(() => {
    axiosInstance.get('/TypeNC')
      .then(res => setTypes(res.data || []))
      .catch(() => setTypes([]))
  }, [])

  return (
    <CFormSelect id="typeNC" {...props}>
      <option value="">Sélectionner un type de NC</option>
      {types.map(type => (
        <option key={type.id} value={type.id}>{type.nom}</option>
      ))}
    </CFormSelect>
  )
}

export default TypeNCSelect