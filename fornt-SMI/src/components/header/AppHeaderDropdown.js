import React, { useEffect, useState } from 'react'
import {
  CAvatar,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import { cilLockLocked } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
// import avatar8 from './../../assets/images/avatars/8.jpg'
import axios from 'axios'
import API_URL from '../../api/API_URL'

function getCollaborateurConnecte() {
  return axios.get(`${API_URL}/Collaborateur/collaborateur_connecte`, {
    withCredentials: true
  })
}

const AppHeaderDropdown = () => {
  const [userName, setUserName] = useState('')

  useEffect(() => {
    getCollaborateurConnecte()
      .then(res => {
        setUserName(res.data.nomAffichage || 'None')
      })
      .catch(() => setUserName(''))
  }, [])

  const handleLogout = () => {
    axios.get(`${API_URL}/Auth/logout`, { withCredentials: true })
      .then(() => {
        window.location.href = '#/login'
      })
      .catch(() => {
        window.location.href = '#/login'
      })
  }

  // Fonction pour obtenir les initiales
  // Optimisé : retourne les initiales du premier et du deuxième mot
  const getInitials = (name) => {
    if (!name) return '';
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length === 1) return parts[0][0].toUpperCase();
    // Si au moins deux mots, retourne la première lettre du premier et du deuxième mot
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        <CAvatar className="me-3 bg-secondary text-white" size="md">
          {getInitials(userName)}
        </CAvatar>
        <span className="d-none d-md-inline">
          {userName}
        </span>
      </CDropdownToggle>
      <CDropdownMenu className="p-0 dropdown-menu-end" placement="bottom-end">
        <CDropdownItem className='end' onClick={handleLogout}>
          <CIcon icon={cilLockLocked} className="me-2" />
          Se déconnecter
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown