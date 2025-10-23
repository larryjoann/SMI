import React, { useState, useRef, useEffect, useMemo } from 'react'
import { CFormCheck, CBadge } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilFilter } from '@coreui/icons'

/*
Props:
 - options: Array of { id, label, color?, phaseId?, phaseName? } or raw API objects with phaseNc
 - selected: Array of ids currently selected
 - onChange: function(newSelectedArray)
 - label: optional label to show before the icon

Behavior:
 - Groups options by phase (phaseNc or phaseId/phaseName) and renders phase-level checkboxes
 - Phase checkbox toggles all statuses in that phase
 - Individual statuses can be toggled; phase checkbox will show indeterminate when partially selected
*/

const BadgeFilterDropdownWithPhase = ({ options = [], selected = [], onChange, label }) => {
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

  // Normalize options and group by phase
  const normalized = useMemo(() => {
    return options.map(o => {
      // support API shape where status.phaseNc exists
      const id = o.id
      const label = o.label
      const color = o.color
      const id_phase = o.id_phase
      const phase = o.phaseNc 
      return { id, label, color,id_phase, phase }
    }).filter(x => x && x.id !== undefined && x.id !== null)
  }, [options])

//   // Debug logs for incoming data
//   useEffect(() => {
//     console.log('BadgeFilterDropdownWithPhase - options:', options)
//     console.log('BadgeFilterDropdownWithPhase - normalized:', normalized)
//     console.log('BadgeFilterDropdownWithPhase - selected:', selected)
//   }, [options, normalized, selected])

  const phases = useMemo(() => {
    const map = new Map()
    normalized.forEach(s => {
      const pid = s.id_phase ?? 'no-phase'
      const pname = s.phase ?? 'Sans phase'
      const key = `${pid}:::${pname}`
      if (!map.has(key)) map.set(key, { id: pid, name: pname, items: [] })
      map.get(key).items.push(s)
    })
    return Array.from(map.values())
  }, [normalized])

  const allItemIds = normalized.map(n => n.id)
  const isAllChecked = allItemIds.length > 0 && allItemIds.every(id => selected.includes(id))

  const categoryRefs = useRef({})

  useEffect(() => {
    phases.forEach(ph => {
      const ref = categoryRefs.current[ph.name]
      if (!ref || !ref.current) return
      const checkedCount = ph.items.reduce((acc, it) => acc + (selected.includes(it.id) ? 1 : 0), 0)
      ref.current.indeterminate = checkedCount > 0 && checkedCount < ph.items.length
    })
  }, [phases, selected])

  const toggleAll = () => {
    if (isAllChecked) onChange([])
    else onChange(allItemIds)
  }

  const togglePhase = (phase) => {
    const itemIds = phase.items.map(i => i.id)
    const allInPhase = itemIds.every(id => selected.includes(id))
    let newSel
    if (allInPhase) {
      newSel = selected.filter(s => !itemIds.includes(s))
    } else {
      newSel = Array.from(new Set([...selected.filter(s => !itemIds.includes(s)), ...selected, ...itemIds]))
    }
    onChange(newSel)
  }

  const toggleItem = (id) => {
    let newSel
    if (selected.includes(id)) newSel = selected.filter(s => s !== id)
    else newSel = [...selected, id]
    onChange(newSel)
  }

  return (
    <div style={{ position: 'relative', display: 'inline-block' }} ref={dropdownRef}>
      {label && <span className="me-2 h6">{label}</span>}
      <button className="btn btn-light p-0" style={{ border: 'none', background: 'none' }} onClick={() => setShowDropdown(!showDropdown)}>
        <CIcon icon={cilFilter} className={isAllChecked ? 'text-dark' : 'text-primary'} />
      </button>
      {showDropdown && (
        <div className="dropdown-menu show" style={{ minWidth: 300, position: 'absolute', left: 0, top: '100%', zIndex: 1000, padding: 12 }}>
          <div className="mb-2">
            <CFormCheck type="checkbox" id="all-status" label="Tous" checked={isAllChecked} onChange={toggleAll} onClick={e => e.stopPropagation()} />
          </div>
          <hr className="my-2" />
          {phases.map((ph, idx) => {
            if (!categoryRefs.current[ph.name]) categoryRefs.current[ph.name] = React.createRef()
            const ref = categoryRefs.current[ph.name]
            return (
              <div key={`${ph.id}-${idx}`} className="mb-2">
                <div className="d-flex align-items-center gap-2">
                  <CFormCheck type="checkbox" id={`phase-${idx}`} inputRef={ref} checked={ph.items.every(i => selected.includes(i.id))} onChange={() => togglePhase(ph)} onClick={e => e.stopPropagation()} />
                  <span>{ph.name}</span>
                </div>
                <div className="mt-2 ms-4">
                  {ph.items.map(it => (
                    <div key={it.id} className="mb-2 d-flex align-items-center gap-2">
                      <CFormCheck type="checkbox" id={`status-${it.id}`} checked={selected.includes(it.id)} onChange={() => toggleItem(it.id)} onClick={e => e.stopPropagation()} style={{ marginRight: 8 }} />
                      <CBadge color={it.color || 'light'} shape="rounded-pill" className="status_badge" style={{ fontSize: 14, cursor: 'pointer' }} onClick={() => toggleItem(it.id)}>{it.label}</CBadge>
                    </div>
                  ))}
                </div>
                {/* {idx !== phases.length - 1 && <hr className="my-2" />} */}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default BadgeFilterDropdownWithPhase
