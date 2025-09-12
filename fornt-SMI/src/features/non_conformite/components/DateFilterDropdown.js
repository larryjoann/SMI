import React, { useState, useRef, useEffect } from 'react'
import CIcon from '@coreui/icons-react'
import { cilFilter } from '@coreui/icons'

const DateFilterDropdown = ({ label, fromDate, toDate, onChange }) => {
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

  // Icône bleue si aucune date n'est sélectionnée (filtre non appliqué)
  const isDefault = !fromDate && !toDate

  return (
    <div style={{ position: 'relative', display: 'inline-block' }} ref={dropdownRef}>
      {label && <span className='me-2 h6'> {label}</span>}
      <button
        className="btn btn-light p-0"
        style={{ border: 'none', background: 'none' }}
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <CIcon icon={cilFilter} className={isDefault ? "text-dark" : "text-primary"} />
      </button>
      {showDropdown && (
        <div
          className="dropdown-menu show"
          style={{
            minWidth: '250px',
            position: 'absolute',
            left: 0,
            top: '100%',
            zIndex: 1000,
            padding: '16px'
          }}
        >
          <div className="mb-3">
            <label htmlFor="fromDate" className="form-label">Du</label>
            <input
              type="date"
              id="fromDate"
              className="form-control"
              value={fromDate || ''}
              onChange={e => onChange({ from: e.target.value, to: toDate })}
            />
          </div>
          <div>
            <label htmlFor="toDate" className="form-label">Au</label>
            <input
              type="date"
              id="toDate"
              className="form-control"
              value={toDate || ''}
              onChange={e => onChange({ from: fromDate, to: e.target.value })}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default DateFilterDropdown