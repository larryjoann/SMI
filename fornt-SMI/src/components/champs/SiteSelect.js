import React, { useEffect, useState } from 'react'
import { CFormSelect } from '@coreui/react'
import API_URL from '../../api/API_URL'
import axiosInstance from '../../api/axiosInstance'

const SiteSelect = (props) => {
  const [sites, setSites] = useState([])

  useEffect(() => {
    axiosInstance.get('/lieu')
      .then(res => setSites(res.data || []))
      .catch(() => setSites([]))
  }, [])

  return (
    <CFormSelect id="site" {...props}>
      <option value="">Sélectionner un site</option>
      {sites.map(site => (
        <option key={site.id} value={site.id}>{site.nom +" ("+ site.abr + ")"}</option>
      ))}
    </CFormSelect>
  )
}

export default SiteSelect