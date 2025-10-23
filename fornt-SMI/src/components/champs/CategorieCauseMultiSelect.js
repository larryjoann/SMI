import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import API_URL from '../../api/API_URL'

function CategorieCauseMultiSelect({ placeholder = 'Sélectionner les categorie ', onChange, value, invalid }) {
  const [options, setOptions] = useState([])

  useEffect(() => {
    fetch(`${API_URL}/CategorieCauseNC`)
      .then(res => res.json())
      .then(data => {
        const opts = Array.isArray(data)
          ? data.map(CatCause => ({
              value: CatCause.id,
              label: CatCause.nom,
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
      isMulti
      options={options}
      onChange={onChange}
      value={value}
      className={invalid ? 'is-invalid' : ''}
    />
  )
}

export default CategorieCauseMultiSelect