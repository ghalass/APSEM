import React from 'react'

const Home = React.lazy(() => import('./pages/home/Home'))
const Chat = React.lazy(() => import('./pages/chat/Chat'))
const About = React.lazy(() => import('./pages/home/About'))

const Config = React.lazy(() => import('./pages/configs/Config'))
const Sites = React.lazy(() => import('./pages/configs/Sites'))
const Typeparcs = React.lazy(() => import('./pages/configs/Typeparcs'))
const Parcs = React.lazy(() => import('./pages/configs/Parcs'))
const Engins = React.lazy(() => import('./pages/configs/Engins'))
const Typelubrifiants = React.lazy(() => import('./pages/configs/Typelubrifiants'))
const Lubrifiants = React.lazy(() => import('./pages/configs/Lubrifiants'))
const Typepannes = React.lazy(() => import('./pages/configs/Typepannes'))
const Pannes = React.lazy(() => import('./pages/configs/Pannes'))
const Typeconsommationlubs = React.lazy(() => import('./pages/configs/Typeconsommationlubs'))
const Objectifs = React.lazy(() => import('./pages/configs/Objectifs'))

// const SaisieRje = React.lazy(() => import('./pages/saisies/SaisieRje'))
const SaisieRjeV2Page = React.lazy(() => import('./pages/saisies/SaisieRjeV2'))
const SaisieRjeDonnees = React.lazy(() => import('./pages/saisies/SaisieRjeDonnees'))

const EtatMensuel = React.lazy(() => import('./pages/rapports_performances/EtatMensuel'))
const HeuresChassis = React.lazy(() => import('./pages/rapports_performances/HeuresChassis'))
const ParetosInDispo = React.lazy(() => import('./pages/rapports_performances/ParetosInDispo'))
const RapportIndispo = React.lazy(() => import('./pages/rapports_performances/RapportIndispo'))
const RapportRje = React.lazy(() => import('./pages/rapports_performances/RapportRje'))
const RapportSpecLub = React.lazy(() => import('./pages/rapports_performances/RapportSpecLub'))
const UnitePhysique = React.lazy(() => import('./pages/rapports_performances/UnitePhysique'))

const IndispoParcPeriode = React.lazy(
  () => import('./pages/analyses/performances/IndispoParcPeriode'),
)
const IndispoEnginPeriode = React.lazy(
  () => import('./pages/analyses/performances/IndispoEnginPeriode'),
)
const PerformancePeriode = React.lazy(
  () => import('./pages/analyses/performances/PerformancePeriode'),
)
const SpeByParcByLubByTypeConsomm = React.lazy(
  () => import('./pages/analyses/lubrifiants/SpeByParcByLubByTypeConsomm'),
)
const Ventilation = React.lazy(() => import('./pages/analyses/lubrifiants/Ventilation'))

const Admin = React.lazy(() => import('./pages/admin/Admin'))
const Permissions = React.lazy(() => import('./pages/admin/Permissions'))
const Roles = React.lazy(() => import('./pages/admin/Roles'))
const Users = React.lazy(() => import('./pages/admin/Users'))
const ImportPage = React.lazy(() => import('./pages/admin/Import'))

const Anomalies = React.lazy(() => import('./pages/anomalies/Anomalies'))
const AnomalieStats = React.lazy(() => import('./pages/anomalies/AnomalieStats'))
const AnomalieDetail = React.lazy(() => import('./pages/anomalies/AnomalieDetail'))

const Profile = React.lazy(() => import('./pages/user/Profile'))
const Page404 = React.lazy(() => import('./pages/page404/Page404'))

const routes = [
  { path: '/', name: 'Home', element: Home },
  { path: '/about', name: 'About', element: About },
  { path: '/chat', name: 'Chat', element: Chat },
  { path: '/*', name: 'Page404', element: Page404 },

  { path: '/user/profile', name: 'Profile', element: Profile },

  { path: '/configs', name: 'Configs', element: Config },
  { path: '/configs/sites', name: 'Sites', element: Sites },
  { path: '/configs/typeparcs', name: 'Typeparcs', element: Typeparcs },
  { path: '/configs/parcs', name: 'Parcs', element: Parcs },
  { path: '/configs/engins', name: 'Engins', element: Engins },
  { path: '/configs/typepannes', name: 'Typepannes', element: Typepannes },
  { path: '/configs/typepannes', name: 'Typepannes', element: Typepannes },
  { path: '/configs/pannes', name: 'Pannes', element: Pannes },
  { path: '/configs/typelubrifiants', name: 'Typelubrifiants', element: Typelubrifiants },
  { path: '/configs/lubrifiants', name: 'lubrifiants', element: Lubrifiants },
  { path: '/configs/objectifs', name: 'objectifs', element: Objectifs },

  { path: '/anomalies', name: 'anomalies', element: Anomalies },
  { path: '/anomalie-stats', name: 'anomalie-stats', element: AnomalieStats },
  { path: '/anomalies/:id', name: 'anomalie-detail', element: AnomalieDetail },

  {
    path: '/configs/typeconsommationlubs',
    name: 'typeconsommationlubs',
    element: Typeconsommationlubs,
  },

  { path: '/admin', name: 'admin', element: Admin },
  { path: '/admin/roles', name: 'roles', element: Roles },
  { path: '/admin/permissions', name: 'permissions', element: Permissions },
  { path: '/admin/users', name: 'users', element: Users },
  { path: '/admin/import', name: 'import', element: ImportPage },

  {
    path: '/analyse/speclub_par_parc_periode',
    name: 'analyse_speclub_par_parc_periode',
    element: SpeByParcByLubByTypeConsomm,
  },

  // { path: '/saisie/rje', name: 'SaisieRje', element: SaisieRje },
  { path: '/saisie/rje', name: 'SaisieRje', element: SaisieRjeV2Page },

  { path: '/saisie/donnees-rje', name: 'Données RJE saisie', element: SaisieRjeDonnees },

  { path: '/rapport/rapport-rje', name: 'Rapport RJE', element: RapportRje },
  { path: '/rapport/unite-physique', name: 'Unité Physique', element: UnitePhysique },
  { path: '/rapport/etat-mensuel', name: 'Etat Mensuel', element: EtatMensuel },
  { path: '/rapport/rapport-indispo', name: 'Indispo', element: RapportIndispo },
  { path: '/rapport/heure-schassis', name: 'Heures Chassis', element: HeuresChassis },
  { path: '/rapport/rapport-speclub', name: 'Spéc Lub', element: RapportSpecLub },
  { path: '/rapport/pareto-indispo', name: 'Paretos indispo', element: ParetosInDispo },
  { path: '/rapport/rapport-ventilation', name: 'Ventilation Lub', element: Ventilation },

  {
    path: '/analyse/indispo_parc_periode',
    name: 'Indispo Parc Période',
    element: IndispoParcPeriode,
  },
  {
    path: '/analyse/indispo_engin_periode',
    name: 'Indispo Engin Période',
    element: IndispoEnginPeriode,
  },
  {
    path: '/analyse/performances_engin_periode',
    name: 'Performances Engin Période',
    element: PerformancePeriode,
  },
]

export default routes
