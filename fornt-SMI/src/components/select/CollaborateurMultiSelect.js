import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import API_URL from '../../api/API_URL'

function CollaborateurMultiSelect({ placeholder = 'Sélectionner des collaborateurs', onChange, value, invalid }) {
  const [options, setOptions] = useState([])

  useEffect(() => {
    fetch(`${API_URL}/Collaborateur`)
      .then(res => res.json())
      .then(data => {
        const opts = Array.isArray(data)
          ? data.map(col => ({
              value: col.matricule,
              label: `${col.nomComplet} (${col.departement})`,
            }))
          : []
        setOptions(opts)
      })
      .catch(() => setOptions([]))
  }, [])

  return (
    <Select
      placeholder={placeholder}
      isSearchable
      isClearable
      isMulti                // <-- active le multi-select
      options={options}
      onChange={onChange}
      value={value}
      className={invalid ? 'is-invalid' : ''}
    />
  )
}

export default CollaborateurMultiSelect