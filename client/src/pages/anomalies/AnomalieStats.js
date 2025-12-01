import React from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CBadge,
  CSpinner,
  CProgress,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CAlert,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilWarning,
  cilInfo,
  cilChartLine,
  cilListRich,
  cilBuilding,
  cilTruck,
  cilCalendar,
  cilChartPie,
  cilMagnifyingGlass,
} from '@coreui/icons'
import { fetchAnomalieStatsQuery } from '../../hooks/useAnomalies'

const AnomalieStats = () => {
  const { data: stats, isLoading, isError, error } = useQuery(fetchAnomalieStatsQuery())

  // Fonction pour obtenir la couleur selon le statut
  const getStatusColor = (statut) => {
    switch (statut) {
      case 'EXECUTE':
        return 'success'
      case 'PROGRAMMEE':
        return 'primary'
      case 'PDR_PRET':
        return 'info'
      case 'ATTENTE_PDR':
        return 'warning'
      case 'NON_PROGRAMMEE':
        return 'secondary'
      default:
        return 'secondary'
    }
  }

  // Fonction pour obtenir la couleur selon la priorité
  const getPriorityColor = (priorite) => {
    switch (priorite) {
      case 'ELEVEE':
        return 'danger'
      case 'MOYENNE':
        return 'warning'
      case 'FAIBLE':
        return 'info'
      default:
        return 'secondary'
    }
  }

  // Traduire les statuts
  const translateStatus = (statut) => {
    const translations = {
      ATTENTE_PDR: 'Attente PDR',
      PDR_PRET: 'PDR prêt',
      NON_PROGRAMMEE: 'Non programmée',
      PROGRAMMEE: 'Programmée',
      EXECUTE: 'Exécuté',
    }
    return translations[statut] || statut
  }

  // Traduire les priorités
  const translatePriority = (priorite) => {
    const translations = {
      ELEVEE: 'Élevée',
      MOYENNE: 'Moyenne',
      FAIBLE: 'Faible',
    }
    return translations[priorite] || priorite
  }

  // Traduire les sources
  const translateSource = (source) => {
    const translations = {
      VS: 'Visite de Systématique',
      VJ: 'Visite Journalière',
      INSPECTION: 'Inspection', // NOUVEAU
      AUTRE: 'Autre',
    }
    return translations[source] || source
  }

  // Formater la date
  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('fr-FR')
  }

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
        <CSpinner size="lg" />
      </div>
    )
  }

  if (isError) {
    return (
      <CAlert color="danger">
        <CIcon icon={cilWarning} className="me-2" />
        {error.message}
      </CAlert>
    )
  }

  if (!stats) {
    return (
      <CAlert color="warning">
        <CIcon icon={cilWarning} className="me-2" />
        Aucune donnée disponible
      </CAlert>
    )
  }

  const { matrice, indicateurs, parSite, topEngins, repartitions, dernieresAnomalies, metadata } =
    stats

  const totalAnomalies = indicateurs?.totalAnomalies || 0

  // Calcul des pourcentages
  const calculatePercentage = (count) => {
    return totalAnomalies > 0 ? Math.round((count / totalAnomalies) * 100) : 0
  }

  return (
    <div className="container-fluid">
      {/* KPI Principaux */}
      <CRow className="mb-4">
        <CCol md={2}>
          <CCard className="h-100">
            <CCardHeader className="bg-primary text-white d-flex align-items-center">
              <CIcon icon={cilListRich} className="me-2" />
              <h6 className="mb-0">Total Anomalies</h6>
            </CCardHeader>
            <CCardBody className="text-center">
              <h2 className="text-primary">{totalAnomalies}</h2>
              <small className="text-body-secondary">Anomalies enregistrées</small>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol md={2}>
          <CCard className="h-100">
            <CCardHeader className="bg-success text-white d-flex align-items-center">
              <CIcon icon={cilChartLine} className="me-2" />
              <h6 className="mb-0">Taux Résolution</h6>
            </CCardHeader>
            <CCardBody className="text-center">
              <h2 className="text-success">{indicateurs?.tauxResolution || 0}%</h2>
              <small className="text-body-secondary">Anomalies exécutées</small>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol md={2}>
          <CCard className="h-100">
            <CCardHeader className="bg-warning text-white d-flex align-items-center">
              <CIcon icon={cilWarning} className="me-2" />
              <h6 className="mb-0">En Attente PDR</h6>
            </CCardHeader>
            <CCardBody className="text-center">
              <h2 className="text-warning">{indicateurs?.anomaliesEnAttentePDR || 0}</h2>
              <small className="text-body-secondary">En attente de pièces</small>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol md={2}>
          <CCard className="h-100">
            <CCardHeader className="bg-danger text-white d-flex align-items-center">
              <CIcon icon={cilWarning} className="me-2" />
              <h6 className="mb-0">Anomalies Critiques</h6>
            </CCardHeader>
            <CCardBody className="text-center">
              <h2 className="text-danger">{indicateurs?.anomaliesCritiques || 0}</h2>
              <small className="text-body-secondary">Priorité élevée</small>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol md={2}>
          <CCard className="h-100">
            <CCardHeader className="bg-info text-white d-flex align-items-center">
              <CIcon icon={cilBuilding} className="me-2" />
              <h6 className="mb-0">Sites Actifs</h6>
            </CCardHeader>
            <CCardBody className="text-center">
              <h2 className="text-info">{indicateurs?.nombreSitesAvecAnomalies || 0}</h2>
              <small className="text-body-secondary">Sites concernés</small>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol md={2}>
          <CCard className="h-100">
            <CCardHeader className="bg-secondary text-white d-flex align-items-center">
              <CIcon icon={cilChartPie} className="me-2" />
              <h6 className="mb-0">Avec PDR</h6>
            </CCardHeader>
            <CCardBody className="text-center">
              <h2 className="text-secondary">{indicateurs?.anomaliesAvecPDR || 0}</h2>
              <small className="text-body-secondary">Besoin pièces</small>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Matrice Statut × Priorité */}
      <CRow className="mb-4">
        <CCol md={12}>
          <CCard>
            <CCardHeader className="bg-body d-flex align-items-center">
              <CIcon icon={cilChartPie} className="me-2" />
              <h6 className="mb-0">Matrice Statut × Priorité</h6>
            </CCardHeader>
            <CCardBody>
              <CTable striped responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Priorité / Statut</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Attente PDR</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">PDR prêt</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Non programmée</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Programmée</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Exécuté</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Total</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {/* Ligne Total */}
                  <CTableRow>
                    <CTableDataCell className="fw-bold">Total</CTableDataCell>
                    {[
                      'ATTENTE_PDR',
                      'PDR_PRET',
                      'NON_PROGRAMMEE',
                      'PROGRAMMEE',
                      'EXECUTE',
                      'TOTAL',
                    ].map((statut) => (
                      <CTableDataCell key={statut} className="text-center fw-bold">
                        <CBadge color="primary">{matrice?.total?.[statut] || 0}</CBadge>
                      </CTableDataCell>
                    ))}
                  </CTableRow>

                  {/* Lignes par priorité */}
                  {['ELEVEE', 'MOYENNE', 'FAIBLE'].map((priorite) => (
                    <CTableRow key={priorite}>
                      <CTableDataCell>
                        <CBadge color={getPriorityColor(priorite)}>
                          {translatePriority(priorite)}
                        </CBadge>
                      </CTableDataCell>
                      {[
                        'ATTENTE_PDR',
                        'PDR_PRET',
                        'NON_PROGRAMMEE',
                        'PROGRAMMEE',
                        'EXECUTE',
                        'TOTAL',
                      ].map((statut) => (
                        <CTableDataCell key={statut} className="text-center">
                          {matrice?.[priorite]?.[statut] || 0}
                        </CTableDataCell>
                      ))}
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Classement par Site et Top Engins */}
      <CRow className="mb-4">
        {/* Classement par Site */}
        <CCol md={6}>
          <CCard className="h-100">
            <CCardHeader className="bg-body d-flex align-items-center">
              <CIcon icon={cilBuilding} className="me-2" />
              <h6 className="mb-0">Classement par Site</h6>
            </CCardHeader>
            <CCardBody>
              {parSite?.classement?.length > 0 ? (
                <CTable striped responsive>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Site</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Total</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Pourcentage</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Statut</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {parSite.classement.map((site, index) => (
                      <CTableRow key={site.id}>
                        <CTableDataCell>
                          <div className="d-flex align-items-center">
                            <CBadge color="primary" className="me-2">
                              {index + 1}
                            </CBadge>
                            {site.nom}
                            {indicateurs?.sitePlusActif?.nom === site.nom && (
                              <CBadge color="success" className="ms-2">
                                Plus actif
                              </CBadge>
                            )}
                          </div>
                        </CTableDataCell>
                        <CTableDataCell className="text-center fw-bold">
                          {site.total}
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          {calculatePercentage(site.total)}%
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="d-flex gap-1 flex-wrap">
                            {Object.entries(site.parStatut || {}).map(
                              ([statut, count]) =>
                                count > 0 && (
                                  <CBadge key={statut} color={getStatusColor(statut)}>
                                    {translateStatus(statut)}: {count}
                                  </CBadge>
                                ),
                            )}
                          </div>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              ) : (
                <div className="text-center text-body-secondary py-3">
                  <CIcon icon={cilInfo} size="xl" />
                  <div>Aucun site avec anomalies</div>
                </div>
              )}
            </CCardBody>
          </CCard>
        </CCol>

        {/* Top Engins */}
        <CCol md={6}>
          <CCard className="h-100">
            <CCardHeader className="bg-body d-flex align-items-center">
              <CIcon icon={cilTruck} className="me-2" />
              <h6 className="mb-0">Top 10 Engins</h6>
            </CCardHeader>
            <CCardBody>
              {topEngins?.length > 0 ? (
                <CTable striped responsive>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Engin</CTableHeaderCell>
                      <CTableHeaderCell>Parc</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Anomalies</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Pourcentage</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {topEngins.map((engin, index) => (
                      <CTableRow key={engin.id}>
                        <CTableDataCell>
                          <div className="d-flex align-items-center">
                            <CBadge color="info" className="me-2">
                              {index + 1}
                            </CBadge>
                            {engin.nom}
                          </div>
                        </CTableDataCell>
                        <CTableDataCell>{engin.parc}</CTableDataCell>
                        <CTableDataCell className="text-center fw-bold">
                          {engin.total}
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          {calculatePercentage(engin.total)}%
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              ) : (
                <div className="text-center text-body-secondary py-3">
                  <CIcon icon={cilInfo} size="xl" />
                  <div>Aucun engin avec anomalies</div>
                </div>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Répartitions détaillées */}
      <CRow className="mb-4">
        {/* Répartition par Source */}
        <CCol md={4}>
          <CCard className="h-100">
            <CCardHeader className="bg-body d-flex align-items-center">
              <CIcon icon={cilMagnifyingGlass} className="me-2" />
              <h6 className="mb-0">Répartition par Source</h6>
            </CCardHeader>
            <CCardBody>
              {repartitions?.parSource && Object.entries(repartitions.parSource).length > 0 ? (
                <>
                  {Object.entries(repartitions.parSource).map(([source, count]) => (
                    <div key={source} className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <span className="fw-medium">{translateSource(source)}</span>
                        <span className="text-body">
                          {count} ({calculatePercentage(count)}%)
                        </span>
                      </div>
                      <CProgress
                        value={calculatePercentage(count)}
                        color={
                          source === 'VS'
                            ? 'primary'
                            : source === 'VJ'
                              ? 'info'
                              : source === 'INSPECTION'
                                ? 'warning'
                                : 'secondary'
                        }
                        className="mb-2"
                      />
                    </div>
                  ))}
                </>
              ) : (
                <div className="text-center text-body-secondary py-3">
                  <CIcon icon={cilInfo} size="xl" />
                  <div>Aucune donnée</div>
                </div>
              )}
            </CCardBody>
          </CCard>
        </CCol>

        {/* Répartition par Besoin PDR */}
        <CCol md={4}>
          <CCard className="h-100">
            <CCardHeader className="bg-body">
              <h6 className="mb-0">Répartition par Besoin PDR</h6>
            </CCardHeader>
            <CCardBody>
              {repartitions?.parBesoinPDR ? (
                <>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="fw-medium">Avec PDR</span>
                      <span className="text-body">
                        {repartitions.parBesoinPDR.avecPDR} (
                        {calculatePercentage(repartitions.parBesoinPDR.avecPDR)}%)
                      </span>
                    </div>
                    <CProgress
                      value={calculatePercentage(repartitions.parBesoinPDR.avecPDR)}
                      color="warning"
                      className="mb-2"
                    />
                  </div>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="fw-medium">Sans PDR</span>
                      <span className="text-body">
                        {repartitions.parBesoinPDR.sansPDR} (
                        {calculatePercentage(repartitions.parBesoinPDR.sansPDR)}%)
                      </span>
                    </div>
                    <CProgress
                      value={calculatePercentage(repartitions.parBesoinPDR.sansPDR)}
                      color="success"
                      className="mb-2"
                    />
                  </div>
                </>
              ) : (
                <div className="text-center text-body-secondary py-3">
                  <CIcon icon={cilInfo} size="xl" />
                  <div>Aucune donnée</div>
                </div>
              )}
            </CCardBody>
          </CCard>
        </CCol>

        {/* Dernières Anomalies */}
        <CCol md={4}>
          <CCard className="h-100">
            <CCardHeader className="bg-body d-flex align-items-center">
              <CIcon icon={cilCalendar} className="me-2" />
              <h6 className="mb-0">10 Dernières Anomalies</h6>
            </CCardHeader>
            <CCardBody>
              {dernieresAnomalies?.length > 0 ? (
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {dernieresAnomalies.map((anomalie) => (
                    <div key={anomalie.id} className="border-bottom pb-2 mb-2">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <strong className="d-block">{anomalie.numeroBacklog}</strong>
                          <small className="text-body-secondary">
                            {anomalie.engin} - {anomalie.site}
                          </small>
                          <div className="small text-muted">
                            Source: {translateSource(anomalie.source)}
                          </div>
                        </div>
                        <CBadge color={getStatusColor(anomalie.statut)}>
                          {translateStatus(anomalie.statut)}
                        </CBadge>
                      </div>
                      <div className="small text-body-secondary">
                        {formatDate(anomalie.dateDetection)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-body-secondary py-3">
                  <CIcon icon={cilInfo} size="xl" />
                  <div>Aucune anomalie récente</div>
                </div>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  )
}

export default AnomalieStats
