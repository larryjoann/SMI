import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import axiosInstance from '../../api/axiosInstance'

const PermissionSelect = (props) => {
  const { value, onChange, ...rest } = props
  const [permissions, setPermissions] = useState([])

  useEffect(() => {
    axiosInstance.get('/Permission')
      .then(res => setPermissions(res.data || []))
      .catch(() => setPermissions([]))
  }, [])

  const options = permissions.map(p => ({
    value: p.id,
    label: p.nom
  }))

  const selectedOption = options.find(o => o.value === value) || null

  const handleChange = (selected) => {
    if (onChange) {
      // Normalize to just the id for compatibility with existing handlers
      onChange(selected ? selected.value : null)
    }
  }

  return (
    <Select
      id="permission"
      options={options}
      value={selectedOption}
      onChange={handleChange}
      isClearable
      isSearchable
      placeholder="Sélectionner une permission"
      {...rest}
    />
  )
}

export default PermissionSelect
