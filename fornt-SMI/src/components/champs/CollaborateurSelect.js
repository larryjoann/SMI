import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import API_URL from '../../api/API_URL'
import axiosInstance from '../../api/axiosInstance'

function CollaborateurSelect({ placeholder = 'Liste des collaborateurs', onChange, value }) {
  const [options, setOptions] = useState([])

  useEffect(() => {
    axiosInstance.get('/Collaborateur')
      .then(res => {
        const data = res.data
        // Si data est un tableau, sinon adapte selon la structure de la réponse
        const opts = Array.isArray(data)
          ? data.map(col => ({
              value: col.matricule,
              label: col.nomComplet + " " + "("+col.departement+")",
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
      options={options}
      onChange={onChange}
      value={value}
    />
  )
}

export default CollaborateurSelect
