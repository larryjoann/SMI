import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import API_URL from '../../api/API_URL'

function CollaborateurMultiSelect({ placeholder = 'Sélectionner des collaborateurs', onChange, value, invalid }) {
  const [options, setOptions] = useState([])

  useEffect(() => {
    let mounted = true
    fetch(`${API_URL}/Collaborateur`)
      .then(res => res.json())
      .then(data => {
        if (!mounted) return
        const list = Array.isArray(data) ? data : (data?.data || data?.items || [])
        const opts = (list || []).map((col, idx) => {
          // ensure a stable, unique value for each option
          const val = col?.matricule ?? col?.id ?? `${col?.nomComplet ?? 'coll'}-${idx}`
          const label = `${col?.nomComplet ?? 'Inconnu'}${col?.departement ? ` (${col.departement})` : ''}`
          return {
            // normalize to string to avoid React keys like undefined
            value: String(val),
            label,
            raw: col,
          }
        })
        setOptions(opts)
      })
      .catch(() => {
        if (mounted) setOptions([])
      })
    return () => { mounted = false }
  }, [])

  return (
    <Select
      placeholder={placeholder}
      isSearchable
      isClearable
      isMulti // <-- active le multi-select
      options={options}
      onChange={onChange}
      value={value}
      className={invalid ? 'is-invalid' : ''}
      // ensure react-select uses stable keys derived from option.value
      getOptionValue={(opt) => String(opt?.value)}
      getOptionLabel={(opt) => opt?.label ?? String(opt?.value)}
    />
  )
}

export default CollaborateurMultiSelect