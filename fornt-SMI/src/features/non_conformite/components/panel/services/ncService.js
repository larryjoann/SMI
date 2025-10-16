import API_URL from '../../../../../api/API_URL'

export async function getDeclaration() {
  const res = await fetch(`${API_URL}/NCDetails/declare`)
  const data = await res.json()
  
  return Array.isArray(data) ? data.map(item => {
    const nc = item.nc || {}
    const processusConcerne = item.processusConcerne || []
    return {
      id: nc.id,
      date: nc.dateTimeCreation,
      type: nc.idTypeNc,
      labelType: nc.typeNc?.nom || '',
      lieu: nc.idLieu || '',
      labelLieu: nc.lieu?.nom || '',
      status: nc.idStatusNc,
      labelStatus: nc.statusNc?.nom || '',
      colorStatus: nc.statusNc?.color || 'white',
      processes: processusConcerne.map(p => p.processus?.id),
      labelProcesses: processusConcerne.map(p => p.processus?.sigle || p.processus?.nom || ''),
      status : nc.status,
    }
  }) : []
}

export async function getBrouillon() {
  const res = await fetch(`${API_URL}/NCDetails/drafts`)
  const data = await res.json()
  return Array.isArray(data) ? data.map(item => {
    const nc = item.nc || {}
    const processusConcerne = item.processusConcerne || []
    return {
      id: nc.id,
      date: nc.dateTimeCreation,
      type: nc.idTypeNc,
      labelType: nc.typeNc?.nom || '',
      lieu: nc.idLieu || '',
      labelLieu: nc.lieu?.nom || '',
      status: nc.idStatusNc,
      labelStatus: nc.statusNc?.nom || '',
      colorStatus: nc.statusNc?.color || 'white',
      processes: processusConcerne.map(p => p.processus?.id),
      labelProcesses: processusConcerne.map(p => p.processus?.sigle || p.processus?.nom || ''),
      status : nc.status,
    }
  }) : []
}

export async function getAll() {
  const res = await fetch(`${API_URL}/NCDetails`)
  const data = await res.json()
  return Array.isArray(data) ? data.map(item => {
    const nc = item.nc || {}
    const processusConcerne = item.processusConcerne || []
    return {
      id: nc.id,
      date: nc.dateTimeCreation,
      type: nc.idTypeNc,
      labelType: nc.typeNc?.nom || '',
      lieu: nc.idLieu || '',
      labelLieu: nc.lieu?.nom || '',
      status: nc.idStatusNc,
      labelStatus: nc.statusNc?.nom || '',
      colorStatus: nc.statusNc?.color || 'white',
      processes: processusConcerne.map(p => p.processus?.id),
      labelProcesses: processusConcerne.map(p => p.processus?.sigle || p.processus?.nom || ''),
      status : nc.status,
    }
  }) : []
}
