import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import API_URL from '../../api/API_URL'
import axiosInstance from '../../api/axiosInstance'

function ProcessusMultiSelect({ placeholder = 'Sélectionner des processus', onChange, value, invalid }) {
  const [options, setOptions] = useState([])

  useEffect(() => {
    axiosInstance.get('/Processus')
      .then(res => {
        const data = res.data
        const opts = Array.isArray(data)
          ? data.map(proc => ({ value: proc.id, label: `${proc.nom} (${proc.sigle})` }))
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

export default ProcessusMultiSelect