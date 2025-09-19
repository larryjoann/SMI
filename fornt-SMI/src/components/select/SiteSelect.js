import React from 'react'
import { CFormSelect } from '@coreui/react'

const siteOptions = [
  { value: '', label: 'Sélectionner un site' },
  { value: 'paris', label: 'Paris' },
  { value: 'lyon', label: 'Lyon' },
  { value: 'marseille', label: 'Marseille' },
  { value: 'toulouse', label: 'Toulouse' },
]

const SiteSelect = (props) => (
  <CFormSelect id="site" required {...props}>
    {siteOptions.map(opt => (
      <option key={opt.value} value={opt.value}>{opt.label}</option>
    ))}
  </CFormSelect>
)

export default SiteSelect