import React, { useEffect, useState, useRef } from 'react'
import Select from 'react-select'
import API_URL from '../../api/API_URL'
import axiosInstance from '../../api/axiosInstance'

function ProcessusMultiSelectFloating({
  id = 'processusMultiSelectFloating',
  placeholder = 'Sélectionner des processus',
  onChange,
  value,
  invalid,
  floatingLabel = 'Processus',
  floatingClassName = '',
}) {
  const [options, setOptions] = useState([])
  const selectRef = useRef(null)

  useEffect(() => {
    let mounted = true
    axiosInstance.get('/Processus')
      .then((res) => {
        if (!mounted) return
        const list = Array.isArray(res.data) ? res.data : []
        const opts = list.map((proc) => ({ value: proc.id, label: `${proc.nom} (${proc.sigle})` }))
        setOptions(opts)
      })
      .catch(() => {
        if (mounted) setOptions([])
      })
    return () => { mounted = false }
  }, [])

  // Focus the internal input when clicking the label (improves accessibility)
  const handleLabelClick = (e) => {
    if (selectRef.current) {
      const input = selectRef.current.select && selectRef.current.select.input
      if (input && typeof input.focus === 'function') input.focus()
    }
  }

  const hasValue = Array.isArray(value) ? value.length > 0 : Boolean(value)

  return (

    <div className={`form-floating ${floatingClassName} ${hasValue ? 'has-value' : ''}`.trim()}>
      <Select
        ref={selectRef}
        inputId={id}
        placeholder={' '}
        isSearchable
        isClearable
        isMulti
        options={options}
        onChange={onChange}
        value={value}
        classNamePrefix="react-select"
        className={invalid ? 'is-invalid' : ''}
        styles={{
          control: (base) => ({
            ...base,
            minHeight: '3.6rem',
          }),
          valueContainer: (base) => ({
            ...base,
            paddingTop: '0.375rem',
            paddingBottom: '0.375rem',
          }),
        }}
      />
      <label htmlFor={id} onClick={handleLabelClick}>{floatingLabel}</label>
    </div>
  )
}

export default ProcessusMultiSelectFloating
