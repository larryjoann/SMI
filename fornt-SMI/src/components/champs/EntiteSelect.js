import React, { useEffect, useState } from 'react'
import { CFormSelect } from '@coreui/react'
import axiosInstance from '../../api/axiosInstance'

const EntiteSelect = (props) => {
  const [entites, setEntites] = useState([])

  useEffect(() => {
    axiosInstance.get('/Entite')
      .then(res => setEntites(res.data || []))
      .catch(() => setEntites([]))
  }, [])

  return (
    <CFormSelect id={props.id || 'entite'} {...props}>
      <option value="">{props.placeholder || 'Sélectionner une entité'}</option>
      {entites.map(e => (
        <option key={e.id} value={e.id}>{e.nom}</option>
      ))}
    </CFormSelect>
  )
}

export default EntiteSelect
