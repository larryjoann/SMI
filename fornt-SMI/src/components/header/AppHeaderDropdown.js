import React, { useEffect, useState } from 'react'
import {
  CAvatar,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
} from '@coreui/react'
import { cilLockLocked } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
// import avatar8 from './../../assets/images/avatars/8.jpg'
import axiosInstance from '../../api/axiosInstance'

function getCollaborateurConnecte() {
  return axiosInstance.get('/Collaborateur/collaborateur_connecte')
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

  const handleLogout = async () => {
    try {
      await axiosInstance.get('/Auth/logout')
    } catch (e) {
      // ignore; we will still clear the token and redirect
    }
    try { sessionStorage.removeItem('jwt') } catch (e) { }
    window.location.href = '/login'
  }

  const [showLogoutModal, setShowLogoutModal] = useState(false)

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
        <CDropdownItem className='end' onClick={() => setShowLogoutModal(true)}>
          <CIcon icon={cilLockLocked} className="me-2" />
          Se déconnecter
        </CDropdownItem>
      </CDropdownMenu>

      <CModal visible={showLogoutModal} onClose={() => setShowLogoutModal(false)} alignment="center">
        <CModalHeader>
          <CModalTitle>Confirmer la déconnexion</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Voulez-vous vraiment vous déconnecter ?
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowLogoutModal(false)}>Annuler</CButton>
          <CButton color="danger" onClick={() => { setShowLogoutModal(false); handleLogout(); }}>Se déconnecter</CButton>
        </CModalFooter>
      </CModal>
    </CDropdown>
  )
}

export default AppHeaderDropdown