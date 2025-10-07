import React, { useEffect, useState } from 'react'
import { CFormSelect } from '@coreui/react'
import API_URL from '../../api/API_URL'

const CategorieProcessusSelect = (props) => {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    fetch(`${API_URL}/CategorieProcessus`)
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(() => setCategories([]))
  }, [])

  return (
    <CFormSelect id="categorie" required  {...props}>
      <option value="">Sélectionner une catégorie</option>
      {categories.map(cat => (
        <option key={cat.id} value={cat.id}>{cat.nom}</option>
      ))}
    </CFormSelect>
  )
}

export default CategorieProcessusSelect