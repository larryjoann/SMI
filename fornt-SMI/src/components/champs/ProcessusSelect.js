import React, { useEffect, useState } from 'react'
import { CFormSelect } from '@coreui/react'
import API_URL from '../../api/API_URL'
import axiosInstance from '../../api/axiosInstance'

const ProcessusSelect = (props) => {
  const [processus, setProcessus] = useState([])

  useEffect(() => {
    axiosInstance.get('/Processus')
      .then(res => setProcessus(Array.isArray(res.data) ? res.data : []))
      .catch(() => setProcessus([]))
  }, [])

  return (
    <CFormSelect id="processus" {...props}>
      <option value="">Sélectionner un processus</option>
      {processus.map(p => (
        <option key={p.id} value={p.id}>{p.nom + " (" + p.sigle + ")"}</option>
      ))}
    </CFormSelect>
  )
}

export default ProcessusSelect
