import React, { useState, useRef, useEffect } from 'react'
import { CFormCheck, CBadge } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilFilter } from '@coreui/icons'

const BadgeFilterDropdown = ({ options, selected, onChange, label }) => {
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Icône bleue si "Tous" est coché ET toutes les cases sont cochées
  const isAllChecked = selected.length === options.length

  const handleOptionChange = (id) => {
    if (id === 'all') {
      if (selected.length === options.length) {
        // Si "Tous" est déjà coché, on le décoche (aucune case cochée)
        onChange([])
      } else {
        // Sinon, on coche toutes les options
        onChange(options.map(opt => opt.id))
      }
    } else {
      let newSelected
      if (selected.includes(id)) {
        // On décoche une option
        newSelected = selected.filter(pid => pid !== id && pid !== 'all')
        // Si plus rien n'est coché, on coche "Tous"
        if (newSelected.length === 0) newSelected = []
      } else {
        // On coche une option
        newSelected = [...selected.filter(pid => pid !== 'all'), id]
        // Si toutes les options sauf 'all' sont cochées, on coche aussi 'all'
        if (newSelected.length === options.length - 1) {
          newSelected = options.map(opt => opt.id)
        }
      }
      onChange(newSelected)
    }
  }

  return (
    <div style={{ position: 'relative', display: 'inline-block' }} ref={dropdownRef}>
      {label && <span className="me-2 h6">{label}</span>}
      <button
        className="btn btn-light p-0"
        style={{ border: 'none', background: 'none' }}
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <CIcon icon={cilFilter} className={isAllChecked ? "text-dark" : "text-primary"} />
      </button>
      {showDropdown && (
        <div
          className="dropdown-menu show"
          style={{
            minWidth: '200px',
            position: 'absolute',
            left: 0,
            top: '100%',
            zIndex: 1000,
            padding: '12px'
          }}
        >
          {options.map((opt, idx) => (
            <React.Fragment key={opt.id}>
              {opt.id === 'all' ? (
                <div className="mb-2">
                  <CFormCheck
                    type="checkbox"
                    id={opt.id}
                    label={opt.label}
                    checked={selected.length === options.length}
                    onChange={() => handleOptionChange(opt.id)}
                    onClick={e => e.stopPropagation()}
                  />
                </div>
              ) : (
                <div className="mb-2 d-flex align-items-center gap-2">
                  <CFormCheck
                    type="checkbox"
                    id={opt.id}
                    checked={selected.includes(opt.id)}
                    onChange={() => handleOptionChange(opt.id)}
                    onClick={e => e.stopPropagation()}
                    style={{ marginRight: 8 }}
                  />
                  <CBadge
                    color={opt.color || 'secondary'}
                    shape="rounded-pill"
                    className="status_badge"
                    style={{ fontSize: 14, cursor: 'pointer' }}
                    onClick={() => handleOptionChange(opt.id)}
                  >
                    {opt.label}
                  </CBadge>
                </div>
              )}
              {idx === 0 && <hr className="my-2" />}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  )
}

export default BadgeFilterDropdown