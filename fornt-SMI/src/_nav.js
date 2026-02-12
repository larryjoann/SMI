import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBan,
  cilPuzzle,
  cilSpeedometer,
  cilTask,
  cilSettings,
  cilClipboard,
  cilChart,
  cilHome
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Accueil',
    to: '/#',
    icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Cartographie',
    to: '/cartographie',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
  },

  {
    component: CNavGroup,
    name: 'Indicateur',
    to: '#',
    icon: <CIcon icon={cilChart} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Tableau de bord',
        to: '/indicateur/tdb',
      },
      {
        component: CNavItem,
        name: 'Saisie',
        to: '/indicateur/tableau',
      },
      
    ],
  },
  {
    component: CNavGroup,
    name: 'Non conformité (NC)',
    to: '#',
    icon: <CIcon icon={cilBan} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Déclarer un NC',
        to: '/nc/form',
      },
      {
        component: CNavItem,
        name: 'Suivi des NC',
        to: '/nc/list',
      },
      
    ],
  },
  {
    component: CNavGroup,
    name: 'Plan d\'action (PA)',
    to: '/#',
    icon: <CIcon icon={cilClipboard} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Insérer un PA',
        to: '/pa/form',
      },
      {
        component: CNavItem,
        name: 'Suivi des PA',
        to: '/pa/list',
      },
      
    ],
  },
  {
    component: CNavItem,
    name: 'Suivi des actions',
    to: '/action',
    icon: <CIcon icon={cilTask} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: 'Administration',
    to: '#',
    icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Utilisateurs',
        to: '/administration/utilisateurs',
      },
      {
        component: CNavItem,
        name: 'Autorisation',
        to: '/administration/autorisation',
      },
      {
        component: CNavItem,
        name: 'Logs',
        to: '/administration/logs',
      },
    ],
  }
]

export default _nav
