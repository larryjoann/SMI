import React, { useEffect, useState } from 'react'
import { CFormSelect } from '@coreui/react'
import axiosInstance from '../../api/axiosInstance'

const CategorieRessourcesSelect = ({ allowEmpty = true, emptyLabel = 'Sélectionner une catégorie', ...props }) => {
  const [cats, setCats] = useState([])

  useEffect(() => {
    axiosInstance.get('/CategorieRessources')
      .then(res => setCats(res.data || []))
      .catch(() => setCats([]))
  }, [])

  return (
    <CFormSelect {...props}>
      {allowEmpty && <option value="">{emptyLabel}</option>}
      {cats.map(c => (
        <option key={c.id} value={c.id}>{c.nom}</option>
      ))}
    </CFormSelect>
  )
}

export default CategorieRessourcesSelect
