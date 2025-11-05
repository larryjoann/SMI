import { exact } from 'prop-types'
import React from 'react'

// Notifications
const Notifications = React.lazy(() => import('./features/notifications/pages/Liste_notif'))

// Pilotage
const Cartographie = React.lazy(() => import('./features/pilotage/pages/Cartographie'))
const FormProcessus = React.lazy(() => import('./features/pilotage/pages/FormProcessus'))
const FicheProcessus = React.lazy(() => import('./features/pilotage/pages/FicheProcessus'))

// Indicateurs
const Liste_indicateur = React.lazy(() => import('./features/indicateur/pages/Tableau_indicateur'))
const Form_indicateur = React.lazy(() => import('./features/indicateur/pages/Form_indicateur'))

// Non conformité
const Liste_NC = React.lazy(() => import('./features/non_conformite/pages/Liste_NC'))
const Form_NC = React.lazy(() => import('./features/non_conformite/pages/FormNC'))
const Fiche_NC = React.lazy(() => import('./features/non_conformite/pages/FicheNC'))
const Arcive_NC = React.lazy(() => import('./features/non_conformite/pages/ArchiveNC'))
const HistoActiviteNC = React.lazy(() => import('./features/non_conformite/pages/HistoActiviteNC'))

// plan d'action
const Liste_PA = React.lazy(() => import('./features/pa/pages/ListePA'))
const Form_PA = React.lazy(() => import('./features/pa/pages/FormPA'))
const Fiche_PA = React.lazy(() => import('./features/pa/pages/FichePA'))

// actions
const Fiche_Action = React.lazy(() => import('./features/action/pages/FicheAction'))
const Liste_Action = React.lazy(() => import('./features/action/pages/ListeAction'))
const Form_Action = React.lazy(() => import('./features/action/pages/FormAction'))

//Administration
// const Roles = React.lazy(() => import('./features/administration/pages/Roles'))
const Logs = React.lazy(() => import('./features/admin/pages/Logs'))

const routes = [
  { path: '/', exact: true, name: 'Home' },

  { path: '/notifications', name: 'Notifications', element: Notifications, exact: true },

  { path: '/pilotage', name: 'Pilotage', element: Cartographie, exact: true },
  { path: '/pilotage/cartographie', name: 'Cartographie des processus', element: Cartographie },
  { path: '/pilotage/cartographie/formprocessus', name: 'Insertion', element: FormProcessus , exact: true},
  { path: '/pilotage/cartographie/formprocessus/:id', name: 'Modification', element: FormProcessus},
  { path: '/pilotage/cartographie/ficheprocessus/:id', name: 'Fiche processus', element: FicheProcessus },

  { path: '/indicateur', name: 'Indicateur', element: Liste_indicateur, exact: true },
  { path: '/indicateur/tableau', name: 'Saisie des indicateurs', element: Liste_indicateur },
  { path: '/indicateur/form', name: 'Form indicateur', element: Form_indicateur },

  { path: '/nc', name: 'Non conformité', element: Liste_NC, exact: true },
  { path: '/nc/form', name: 'Déclaration', element: Form_NC },
  { path: '/nc/list', name: 'Liste', element: Liste_NC },
  { path: '/nc/list/archive', name: 'Archive', element: Arcive_NC },
  { path: '/nc/list/fiche/:id', name: 'Fiche', element: Fiche_NC },
  { path: '/nc/list/fiche/histoactivite/:id', name: 'Historique des activités', element: HistoActiviteNC },
  { path: '/nc/list/form/:id', name: 'Modification', element: Form_NC },

  { path: '/pa', name: 'Plan d\'action', element: Liste_PA, exact: true },
  { path: '/pa/list', name: 'Suivie des plans d\'action', element: Liste_PA },
  { path: '/pa/form', name: 'Nouveau plan d\'action', element: Form_PA },
  { path: '/pa/form/:id', name: 'Modification plan d\'action', element: Form_PA },
  { path: '/pa/fiche/:id', name: 'Fiche plan d\'action', element: Fiche_PA },

  { path: '/action', name: 'Action', element: Liste_Action, exact: true },
  { path: '/action/fiche/:id', name: 'Fiche', element: Fiche_Action },
  { path: '/action/form', name: 'Nouvelle action', element: Form_Action },
  { path: '/action/form/:id', name: 'Modification action', element: Form_Action },

  { path: '/administration', name: 'Administration', element: Logs, exact: true },
  { path: '/administration/logs', name: 'Logs', element: Logs },
  
]

export default routes
