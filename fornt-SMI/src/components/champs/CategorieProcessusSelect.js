import React, { useEffect, useState } from 'react'
import { CFormSelect } from '@coreui/react'
import API_URL from '../../api/API_URL'

// Props:
// - allowEmpty: whether to include an empty option
// - emptyLabel: label for the empty option (default: 'Sélectionner une catégorie')
const CategorieProcessusSelect = ({ allowEmpty = true, emptyLabel = 'Sélectionner une catégorie', ...props }) => {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    fetch(`${API_URL}/CategorieProcessus`)
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(() => setCategories([]))
  }, [])

  return (
    <CFormSelect id="categorie" {...props}>
      {allowEmpty && <option value="">{emptyLabel}</option>}
      {categories.map(cat => (
        <option key={cat.id} value={cat.id}>{cat.nom}</option>
      ))}
    </CFormSelect>
  )
}

export default CategorieProcessusSelect