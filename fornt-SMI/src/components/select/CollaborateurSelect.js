import React from 'react'
import Select from 'react-select'

function CollaborateurSelect({ placeholder = 'Liste des collaborateurs', onChange, value }) {
  const options = [
    { value: '1', label: 'Collaborateur 1' },
    { value: '2', label: 'Collaborateur 2' },
    { value: '3', label: 'Collaborateur 3' },
    { value: '4', label: 'Collaborateur 4' },
  ]

  return (
    <Select
      placeholder={placeholder}
      isSearchable
      options={options}
      onChange={onChange}
      value={value}
    />
  )
}

export default CollaborateurSelect
