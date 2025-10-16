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
const Qualif_NC = React.lazy(() => import('./features/non_conformite/pages/QualifNC'))

const routes = [
  { path: '/', exact: true, name: 'Home' },

  { path: '/notifications', name: 'Notifications', element: Notifications, exact: true },

  { path: '/pilotage', name: 'Pilotage', element: Cartographie, exact: true },
  { path: '/pilotage/cartographie', name: 'Cartographie des processus', element: Cartographie },
  { path: '/pilotage/formprocessus', name: 'Form processus', element: FormProcessus },
  { path: '/pilotage/formprocessus/:id', name: 'Form processus', element: FormProcessus },
  { path: '/pilotage/ficheprocessus/:id', name: 'Fiche processus', element: FicheProcessus },

  { path: '/indicateur', name: 'Indicateur', element: Liste_indicateur, exact: true },
  { path: '/indicateur/tableau', name: 'Tableau indicateur', element: Liste_indicateur },
  { path: '/indicateur/form', name: 'Form indicateur', element: Form_indicateur },

  { path: '/nc', name: 'Non conformité', element: Liste_NC, exact: true },
  { path: '/nc/list', name: 'Mes non-conformité', element: Liste_NC },
  { path: '/nc/form', name: 'Form non-conformité', element: Form_NC },
  { path: '/nc/form/:id', name: 'Form non-conformité', element: Form_NC },
  { path: '/nc/fiche/:id', name: 'Fiche non-conformité', element: Fiche_NC },
  { path: '/nc/qualif/:id', name: 'Qualifier non-conformité', element: Qualif_NC },
]

export default routes
