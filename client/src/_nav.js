import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBarChart,
  cilChartLine,
  cilControl,
  cilDrop,
  cilKeyboard,
  cilSettings,
  cilSpeedometer,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  // SAISIES
  {
    component: CNavTitle,
    name: 'saisies',
  },

  {
    component: CNavGroup,
    name: 'Journalier',
    icon: <CIcon icon={cilKeyboard} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Saisie RJE',
        to: '/saisie/rje',
      },
      {
        component: CNavItem,
        name: 'Données RJE saisie',
        to: '/saisie/donnees-rje',
      },
    ],
  },

  // RAPPORTS
  {
    component: CNavTitle,
    name: 'rapports',
  },
  {
    component: CNavGroup,
    name: 'Mensuel (RM)',
    icon: <CIcon icon={cilChartLine} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Rapport RJE',
        to: '/rapport/rapport-rje',
      },
      {
        component: CNavItem,
        name: 'Unité Physique',
        to: '/rapport/unite-physique',
      },
      {
        component: CNavItem,
        name: 'Etat Mensuel',
        to: '/rapport/etat-mensuel',
      },
      {
        component: CNavItem,
        name: "Rapport d'indisponibilité",
        to: '/rapport/rapport-indispo',
      },
      {
        component: CNavItem,
        name: 'Heures Chassis',
        to: '/rapport/heure-schassis',
      },
      {
        component: CNavItem,
        name: 'Paretos indispo',
        to: '/rapport/pareto-indispo',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Analyse performance',
    icon: <CIcon icon={cilBarChart} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Indispo Parc-Période',
        to: '/analyse/indispo_parc_periode',
      },
      {
        component: CNavItem,
        name: 'Indispo Engin-Période',
        to: '/analyse/indispo_engin_periode',
      },
      {
        component: CNavItem,
        name: 'Perfor. Engin-Période',
        to: '/analyse/performances_engin_periode',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Lubrifiants',
    icon: <CIcon icon={cilDrop} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Ventilation Lub',
        to: '/rapport/rapport-ventilation',
      },
      {
        component: CNavItem,
        name: 'Spéc Lub',
        to: '/rapport/rapport-speclub',
      },
      {
        component: CNavItem,
        name: 'Spéc Par Période',
        to: '/analyse/speclub_par_parc_periode',
      },
      // {
      //   component: CNavItem,
      //   name: 'Lubrifiants',
      //   to: '/configs/lubrifiants',
      // },
      // {
      //   component: CNavItem,
      //   name: 'Types des lubrifiants',
      //   to: '/configs/typelubrifiants',
      // },
      // {
      //   component: CNavItem,
      //   name: 'Codes consommation lub',
      //   to: '/configs/typeconsommationlubs',
      // },
    ],
  },

  // backlog
  {
    component: CNavTitle,
    name: 'backlog',
  },
  {
    component: CNavGroup,
    name: 'Backlogs',
    icon: <CIcon icon={cilControl} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Gestion des anomalies',
        to: '/anomalies',
      },
      {
        component: CNavItem,
        name: 'Dashboard',
        to: '/anomalie-stats',
      },
    ],
  },

  // Configurations
  {
    component: CNavTitle,
    name: 'Configurations',
  },
  {
    component: CNavItem,
    name: 'Configurations',
    to: '/configs',
    icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
  },
]

export default _nav
