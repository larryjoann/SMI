import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBan,
  cilPuzzle,
  cilSpeedometer,
  cilTask,
  cilSettings,
  cilClipboard
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavGroup,
    name: 'Pilotage',
    to: '#',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Cartographie',
        to: '/pilotage/cartographie',
      },
    ],
  },

  {
    component: CNavGroup,
    name: 'Indicateur',
    to: '#',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
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
    name: 'Non conformité',
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
        name: 'Suivie des NC',
        to: '/nc/list',
      },
      
    ],
  },
  {
    component: CNavGroup,
    name: 'Plan d\'action',
    to: '/#',
    icon: <CIcon icon={cilClipboard} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Inserer une PA',
        to: '/pa/form',
      },
      {
        component: CNavItem,
        name: 'Suivie des PA',
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
        name: 'Roles',
        to: '/administration/roles',
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
