import React from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CBadge,
  CSpinner,
  CContainer,
  CListGroup,
  CListGroupItem,
  CProgress,
  CTable,
  CTooltip,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilUser,
  cilShieldAlt,
  cilFactory,
  cilTruck,
  cilWarning,
  cilDrop,
  cilChart,
  cilHistory,
  cilStar,
  cilPeople,
  cilListRich,
  cilCalendar,
  cilDataTransferDown,
  cilLayers,
} from '@coreui/icons'
import { useAuth } from '../../context/Auth'
import { useQuery } from '@tanstack/react-query'
import { fecthDashbaordQuery } from '../../hooks/useDashboard'

const Home = () => {
  const auth = useAuth()
  const { data: dashboardData, isLoading, error } = useQuery(fecthDashbaordQuery())

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <CSpinner size="lg" />
        <span className="ms-2">Chargement des statistiques...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="alert alert-danger m-3">
        Erreur lors du chargement des statistiques: {error.message}
      </div>
    )
  }

  const stats = dashboardData?.data

  // Composant de carte de statistique
  const StatCard = ({ title, value, icon, color = 'primary', subtitle, tooltip }) => (
    <CTooltip content={tooltip} placement="top">
      <CCard className="h-100">
        <CCardBody className="text-center">
          <CIcon icon={icon} size="xl" className={`text-${color} mb-2`} />
          <h3 className={`text-${color}`}>{value}</h3>
          <h6 className="card-title mb-1">{title}</h6>
          {subtitle && <small className="text-muted">{subtitle}</small>}
        </CCardBody>
      </CCard>
    </CTooltip>
  )

  // Formater les dates
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <CContainer fluid>
      {/* En-tête de bienvenue */}
      <div className="mb-4">
        <h1 className="h2 mb-2">Tableau de Bord Complet</h1>
        <p className="text-body-secondary">
          Bienvenue <strong>{auth?.user?.name?.replace(/^./, (c) => c.toUpperCase())}</strong>,
          voici toutes les statistiques détaillées du système.
        </p>
      </div>

      {/* SECTION 1: VUE D'ENSEMBLE COMPLÈTE */}
      <div className="mb-4">
        <h3 className="h4 mb-3">
          <CIcon icon={cilChart} className="me-2" />
          Vue d'ensemble complète
        </h3>
        <CRow className="g-3">
          <CCol xs={6} md={3} lg={2}>
            <StatCard
              title="Utilisateurs"
              value={stats?.overview?.totalUsers}
              icon={cilUser}
              color="primary"
              tooltip="Nombre total d'utilisateurs du système"
            />
          </CCol>
          <CCol xs={6} md={3} lg={2}>
            <StatCard
              title="Rôles"
              value={stats?.overview?.totalRoles}
              icon={cilShieldAlt}
              color="secondary"
              tooltip="Nombre de rôles définis"
            />
          </CCol>
          <CCol xs={6} md={3} lg={2}>
            <StatCard
              title="Permissions"
              value={stats?.overview?.totalPermissions}
              icon={cilLayers}
              color="info"
              tooltip="Nombre total de permissions"
            />
          </CCol>
          <CCol xs={6} md={3} lg={2}>
            <StatCard
              title="Sites"
              value={stats?.overview?.totalSites}
              icon={cilFactory}
              color="warning"
              tooltip="Nombre de sites"
            />
          </CCol>
          <CCol xs={6} md={3} lg={2}>
            <StatCard
              title="Parcs"
              value={stats?.overview?.totalParcs}
              icon={cilFactory}
              color="success"
              tooltip="Nombre total de parcs"
            />
          </CCol>
          <CCol xs={6} md={3} lg={2}>
            <StatCard
              title="Engins"
              value={stats?.overview?.totalEngins}
              icon={cilTruck}
              color="primary"
              subtitle={`${stats?.overview?.totalActiveEngins} actifs, ${stats?.overview?.totalInactiveEngins} inactifs`}
              tooltip="Total des engins avec statut actif/inactif"
            />
          </CCol>
        </CRow>

        <CRow className="g-3 mt-2">
          <CCol xs={6} md={3} lg={2}>
            <StatCard
              title="Pannes"
              value={stats?.overview?.totalPannes}
              icon={cilWarning}
              color="danger"
              tooltip="Nombre total de pannes définies"
            />
          </CCol>
          <CCol xs={6} md={3} lg={2}>
            <StatCard
              title="Lubrifiants"
              value={stats?.overview?.totalLubrifiants}
              icon={cilDrop}
              color="info"
              tooltip="Nombre de lubrifiants"
            />
          </CCol>
          <CCol xs={6} md={3} lg={2}>
            <StatCard
              title="Saisies HRM"
              value={stats?.overview?.totalSaisiesHrm}
              icon={cilHistory}
              color="success"
              tooltip="Total des saisies Heures de Marche"
            />
          </CCol>
          <CCol xs={6} md={3} lg={2}>
            <StatCard
              title="Saisies HIM"
              value={stats?.overview?.totalSaisiesHim}
              icon={cilWarning}
              color="warning"
              tooltip="Total des saisies Heures d'Immobilisation"
            />
          </CCol>
          <CCol xs={6} md={3} lg={2}>
            <StatCard
              title="Saisies Lub."
              value={stats?.overview?.totalSaisiesLubrifiant}
              icon={cilDrop}
              color="primary"
              tooltip="Saisies de lubrifiants"
            />
          </CCol>
          <CCol xs={6} md={3} lg={2}>
            <StatCard
              title="Objectifs"
              value={stats?.overview?.totalObjectifs}
              icon={cilStar}
              color="secondary"
              tooltip="Nombre d'objectifs définis"
            />
          </CCol>
        </CRow>
      </div>

      <CRow className="g-4">
        {/* SECTION 2: CATÉGORIES ET TYPES */}
        <CCol lg={6}>
          <CCard>
            <CCardHeader>
              <h5 className="mb-0">
                <CIcon icon={cilListRich} className="me-2" />
                Catégories et Types
              </h5>
            </CCardHeader>
            <CCardBody>
              <CRow className="text-center">
                <CCol md={6}>
                  <div className="border rounded p-3 mb-3">
                    <CIcon icon={cilFactory} size="xl" className="text-primary mb-2" />
                    <h4>{stats?.categories?.typeParcs}</h4>
                    <small className="text-muted">Types de Parcs</small>
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="border rounded p-3 mb-3">
                    <CIcon icon={cilWarning} size="xl" className="text-warning mb-2" />
                    <h4>{stats?.categories?.typePannes}</h4>
                    <small className="text-muted">Types de Pannes</small>
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="border rounded p-3">
                    <CIcon icon={cilDrop} size="xl" className="text-info mb-2" />
                    <h4>{stats?.categories?.typeLubrifiants}</h4>
                    <small className="text-muted">Types de Lubrifiants</small>
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="border rounded p-3">
                    <CIcon icon={cilDataTransferDown} size="xl" className="text-success mb-2" />
                    <h4>{stats?.categories?.typeConsommationLubs}</h4>
                    <small className="text-muted">Types de Consommation</small>
                  </div>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>

        {/* SECTION 3: DISTRIBUTION DES ENGINS */}
        <CCol lg={6}>
          <CCard>
            <CCardHeader>
              <h5 className="mb-0">
                <CIcon icon={cilTruck} className="me-2" />
                Distribution des Engins par Parc
              </h5>
            </CCardHeader>
            <CCardBody>
              {stats?.distribution?.enginsByParc?.map((parc, index) => (
                <div key={index} className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span>
                      <strong>{parc.parcName}</strong>
                      <CBadge color="secondary" className="ms-2">
                        {parc.typeParcName}
                      </CBadge>
                    </span>
                    <span>{parc.enginsCount} engins</span>
                  </div>
                  <CProgress
                    value={(parc.enginsCount / stats.overview.totalEngins) * 100}
                    color={index % 2 === 0 ? 'primary' : 'success'}
                    className="mb-2"
                  />
                </div>
              ))}
              <div className="text-center mt-3 p-2 bg-light rounded">
                <CBadge color="info" className="me-2">
                  Taux d'engins actifs: {stats?.distribution?.activeEnginsPercentage}%
                </CBadge>
                <CBadge color="primary">
                  Moyenne saisies/engin: {stats?.distribution?.averageSaisiesPerEngin}
                </CBadge>
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        {/* SECTION 4: CLASSEMENTS COMPLETS */}
        <CCol lg={6}>
          <CCard>
            <CCardHeader>
              <h5 className="mb-0">
                <CIcon icon={cilWarning} className="me-2" />
                Top 5 Pannes les plus Fréquentes
              </h5>
            </CCardHeader>
            <CCardBody>
              <CListGroup flush>
                {stats?.rankings?.topPannes?.map((panne, index) => (
                  <CListGroupItem
                    key={index}
                    className="d-flex justify-content-between align-items-center"
                  >
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <strong>{panne.panneName}</strong>
                          <br />
                          <small className="text-muted">{panne.typePanneName}</small>
                        </div>
                        <CBadge
                          color={index < 2 ? 'danger' : 'warning'}
                          shape="rounded-pill"
                          className="ms-2"
                        >
                          {panne.occurrenceCount} occurrence(s)
                        </CBadge>
                      </div>
                    </div>
                  </CListGroupItem>
                ))}
              </CListGroup>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol lg={6}>
          <CCard>
            <CCardHeader>
              <h5 className="mb-0">
                <CIcon icon={cilDrop} className="me-2" />
                Top Lubrifiants les plus Utilisés
              </h5>
            </CCardHeader>
            <CCardBody>
              <CListGroup flush>
                {stats?.rankings?.topLubrifiants?.map((lubrifiant, index) => (
                  <CListGroupItem
                    key={index}
                    className="d-flex justify-content-between align-items-center"
                  >
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <strong>{lubrifiant.lubrifiantName}</strong>
                          <br />
                          <small className="text-muted">{lubrifiant.typeLubrifiantName}</small>
                        </div>
                        <CBadge color="info" shape="rounded-pill" className="ms-2">
                          {lubrifiant.totalQuantity} L
                        </CBadge>
                      </div>
                    </div>
                  </CListGroupItem>
                ))}
                {(!stats?.rankings?.topLubrifiants ||
                  stats.rankings.topLubrifiants.length === 0) && (
                  <CListGroupItem className="text-center text-muted">
                    Aucune donnée de lubrifiant disponible
                  </CListGroupItem>
                )}
              </CListGroup>
            </CCardBody>
          </CCard>
        </CCol>

        {/* SECTION 5: ACTIVITÉ RÉCENTE COMPLÈTE */}
        <CCol lg={4}>
          <CCard>
            <CCardHeader>
              <h5 className="mb-0">
                <CIcon icon={cilHistory} className="me-2" />
                Dernières Saisies HRM
              </h5>
            </CCardHeader>
            <CCardBody>
              <CListGroup flush>
                {stats?.recentActivity?.lastSaisiesHrm?.map((saisie, index) => (
                  <CListGroupItem key={index}>
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="flex-grow-1">
                        <strong>{saisie.engin}</strong> - {saisie.site}
                        <br />
                        <small className="text-muted">{formatDate(saisie.date)}</small>
                        <br />
                        <small className="text-muted">Créé: {formatDate(saisie.createdAt)}</small>
                      </div>
                      <CBadge color="success" className="ms-2">
                        {saisie.hrm} HRM
                      </CBadge>
                    </div>
                  </CListGroupItem>
                ))}
              </CListGroup>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol lg={4}>
          <CCard>
            <CCardHeader>
              <h5 className="mb-0">
                <CIcon icon={cilWarning} className="me-2" />
                Dernières Saisies HIM
              </h5>
            </CCardHeader>
            <CCardBody>
              <CListGroup flush>
                {stats?.recentActivity?.lastSaisiesHim?.map((saisie, index) => (
                  <CListGroupItem key={index}>
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="flex-grow-1">
                        <strong>{saisie.panne}</strong>
                        <br />
                        <small className="text-muted">Engin: {saisie.engin}</small>
                        <br />
                        <small className="text-muted">
                          NI: {saisie.ni} • Créé: {formatDate(saisie.createdAt)}
                        </small>
                      </div>
                      <CBadge color="danger" className="ms-2">
                        {saisie.him} HIM
                      </CBadge>
                    </div>
                  </CListGroupItem>
                ))}
              </CListGroup>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol lg={4}>
          <CCard>
            <CCardHeader>
              <h5 className="mb-0">
                <CIcon icon={cilPeople} className="me-2" />
                Derniers Utilisateurs
              </h5>
            </CCardHeader>
            <CCardBody>
              <CListGroup flush>
                {stats?.recentActivity?.recentUsers?.map((user, index) => (
                  <CListGroupItem key={index}>
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="flex-grow-1">
                        <strong>{user.name}</strong>
                        <br />
                        <small className="text-muted">{user.email}</small>
                        <div className="mt-1">
                          {user.roles.map((role, roleIndex) => (
                            <CBadge key={roleIndex} color="primary" className="me-1">
                              {role}
                            </CBadge>
                          ))}
                        </div>
                        <small className="text-muted">Créé: {formatDate(user.createdAt)}</small>
                      </div>
                      <CBadge color={user.active ? 'success' : 'secondary'} className="ms-2">
                        {user.active ? 'Actif' : 'Inactif'}
                      </CBadge>
                    </div>
                  </CListGroupItem>
                ))}
              </CListGroup>
            </CCardBody>
          </CCard>
        </CCol>

        {/* SECTION 6: TENDANCES ET MÉTRIQUES */}
        <CCol lg={6}>
          <CCard>
            <CCardHeader>
              <h5 className="mb-0">
                <CIcon icon={cilCalendar} className="me-2" />
                Tendances des Saisies par Mois
              </h5>
            </CCardHeader>
            <CCardBody>
              <CListGroup flush>
                {stats?.trends?.saisiesByMonth?.map((trend, index) => (
                  <CListGroupItem
                    key={index}
                    className="d-flex justify-content-between align-items-center"
                  >
                    <span>
                      <strong>{trend.month}</strong>
                    </span>
                    <CBadge color="info">{trend.count} saisies</CBadge>
                  </CListGroupItem>
                ))}
                {(!stats?.trends?.saisiesByMonth || stats.trends.saisiesByMonth.length === 0) && (
                  <CListGroupItem className="text-center text-muted">
                    Aucune donnée de tendance disponible
                  </CListGroupItem>
                )}
              </CListGroup>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol lg={6}>
          <CCard>
            <CCardHeader>
              <h5 className="mb-0">
                <CIcon icon={cilStar} className="me-2" />
                Métriques d'Engagement
              </h5>
            </CCardHeader>
            <CCardBody>
              <CRow className="text-center">
                <CCol xs={6} className="mb-3">
                  <div className="border rounded p-3">
                    <CIcon icon={cilTruck} size="xl" className="text-success mb-2" />
                    <h5>{stats?.metrics?.engagement?.activeEnginsRate}</h5>
                    <small className="text-muted">Taux engins actifs</small>
                  </div>
                </CCol>
                <CCol xs={6} className="mb-3">
                  <div className="border rounded p-3">
                    <CIcon icon={cilChart} size="xl" className="text-primary mb-2" />
                    <h5>{stats?.metrics?.engagement?.saisiesPerEngin}</h5>
                    <small className="text-muted">Saisies/engin</small>
                  </div>
                </CCol>
                <CCol xs={6}>
                  <div className="border rounded p-3">
                    <CIcon icon={cilWarning} size="xl" className="text-warning mb-2" />
                    <h5>{stats?.metrics?.engagement?.pannesPerSaisie}</h5>
                    <small className="text-muted">Pannes/saisie</small>
                  </div>
                </CCol>
                <CCol xs={6}>
                  <div className="border rounded p-3">
                    <CIcon icon={cilDrop} size="xl" className="text-info mb-2" />
                    <h5>{stats?.metrics?.engagement?.lubrifiantUsageRate}</h5>
                    <small className="text-muted">Usage lubrifiant</small>
                  </div>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>

        {/* SECTION 7: INFORMATIONS SYSTÈME */}
        <CCol lg={12}>
          <CCard>
            <CCardHeader>
              <h5 className="mb-0">
                <CIcon icon={cilDataTransferDown} className="me-2" />
                Informations Système
              </h5>
            </CCardHeader>
            <CCardBody>
              <CRow>
                <CCol md={4} className="text-center">
                  <div className="border rounded p-4">
                    <CIcon icon={cilLayers} size="xl" className="text-primary mb-3" />
                    <h3>{stats?.systemInfo?.totalRecords}</h3>
                    <p className="text-muted mb-0">Enregistrements totaux</p>
                  </div>
                </CCol>
                <CCol md={4} className="text-center">
                  <div className="border rounded p-4">
                    <CIcon icon={cilCalendar} size="xl" className="text-success mb-3" />
                    <h5>{stats?.systemInfo?.dataAsOf}</h5>
                    <p className="text-muted mb-0">Données au</p>
                  </div>
                </CCol>
                <CCol md={4} className="text-center">
                  <div className="border rounded p-4">
                    <CIcon icon={cilDataTransferDown} size="xl" className="text-info mb-3" />
                    <h5>{stats?.systemInfo?.databaseSize}</h5>
                    <p className="text-muted mb-0">Taille base de données</p>
                  </div>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* PIED DE PAGE */}
      <div className="mt-4 text-center text-muted small">
        <CIcon icon={cilChart} className="me-1" />
        Données mises à jour le {formatDate(stats?.systemInfo?.lastUpdate)}•{' '}
        {stats?.systemInfo?.totalRecords} enregistrements au total • Généré par {auth?.user?.name}
      </div>
    </CContainer>
  )
}

export default Home
