import React from 'react'
import { CFormSelect } from '@coreui/react'

const typeNCOptions = [
  { value: '', label: 'Sélectionner un type de NC' },
  { value: 'mineure', label: 'Non-conformité mineure' },
  { value: 'majeure', label: 'Non-conformité majeure' },
  { value: 'critique', label: 'Non-conformité critique' },
]

const TypeNCSelect = (props) => (
  <CFormSelect id="typeNC" required {...props}>
    {typeNCOptions.map(opt => (
      <option key={opt.value} value={opt.value}>{opt.label}</option>
    ))}
  </CFormSelect>
)

export default TypeNCSelect