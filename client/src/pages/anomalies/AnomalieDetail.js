import React from 'react'
import { useParams, useNavigate } from 'react-router-dom' // Ajout de useNavigate
import { useQuery } from '@tanstack/react-query'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CBadge,
  CSpinner,
  CAlert,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton, // Ajout de CButton
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilWarning, cilCalendar, cilInfo, cilArrowLeft } from '@coreui/icons' // Ajout de cilArrowLeft
import { fetchAnomalieByIdQuery } from '../../hooks/useAnomalies'

const AnomalieDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate() // Hook pour la navigation
  const { data: anomalie, isLoading, isError, error } = useQuery(fetchAnomalieByIdQuery(id))

  // Fonction pour retourner à la liste des anomalies
  const handleBackToList = () => {
    navigate('/anomalies')
  }

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
        <CSpinner />
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

  if (!anomalie) {
    return (
      <CAlert color="warning">
        <CIcon icon={cilWarning} className="me-2" />
        Anomalie non trouvée
      </CAlert>
    )
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('fr-FR')
  }

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

  return (
    <div className="container-fluid">
      {/* Bouton de retour */}
      <div className="mb-3">
        <CButton
          color="secondary"
          variant="outline"
          onClick={handleBackToList}
          className="d-flex align-items-center"
        >
          <CIcon icon={cilArrowLeft} className="me-2" />
          Retour à la liste des anomalies
        </CButton>
      </div>

      <CRow>
        <CCol>
          <CCard>
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <h5 className="mb-0 me-3">Détails de l'anomalie</h5>
                <CBadge color={getStatusColor(anomalie.statut)}>{anomalie.statut}</CBadge>
              </div>
              <div>
                <CBadge color={getPriorityColor(anomalie.priorite)}>
                  Priorité: {anomalie.priorite}
                </CBadge>
              </div>
            </CCardHeader>
            <CCardBody>
              <CRow className="mb-4">
                <CCol md={6}>
                  <h6>Informations générales</h6>
                  <CTable striped>
                    <CTableBody>
                      <CTableRow>
                        <CTableDataCell className="fw-bold">N° Backlog</CTableDataCell>
                        <CTableDataCell>{anomalie.numeroBacklog}</CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableDataCell className="fw-bold">Date détection</CTableDataCell>
                        <CTableDataCell>{formatDate(anomalie.dateDetection)}</CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableDataCell className="fw-bold">Description</CTableDataCell>
                        <CTableDataCell>{anomalie.description}</CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableDataCell className="fw-bold">Source</CTableDataCell>
                        <CTableDataCell>{anomalie.source}</CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableDataCell className="fw-bold">Besoin PDR</CTableDataCell>
                        <CTableDataCell>
                          <CBadge color={anomalie.besoinPDR ? 'info' : 'secondary'}>
                            {anomalie.besoinPDR ? 'Oui' : 'Non'}
                          </CBadge>
                        </CTableDataCell>
                      </CTableRow>
                    </CTableBody>
                  </CTable>
                </CCol>
                <CCol md={6}>
                  <h6>Informations techniques</h6>
                  <CTable striped>
                    <CTableBody>
                      <CTableRow>
                        <CTableDataCell className="fw-bold">Engin</CTableDataCell>
                        <CTableDataCell>{anomalie.engin?.name || '-'}</CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableDataCell className="fw-bold">Site</CTableDataCell>
                        <CTableDataCell>{anomalie.site?.name || '-'}</CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableDataCell className="fw-bold">Quantité</CTableDataCell>
                        <CTableDataCell>{anomalie.quantite || '-'}</CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableDataCell className="fw-bold">Date exécution</CTableDataCell>
                        <CTableDataCell>{formatDate(anomalie.dateExecution)}</CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableDataCell className="fw-bold">Équipe</CTableDataCell>
                        <CTableDataCell>{anomalie.equipe || '-'}</CTableDataCell>
                      </CTableRow>
                    </CTableBody>
                  </CTable>
                </CCol>
              </CRow>

              {/* Informations supplémentaires */}
              <CRow className="mb-4">
                <CCol md={6}>
                  <h6>Informations supplémentaires</h6>
                  <CTable striped>
                    <CTableBody>
                      <CTableRow>
                        <CTableDataCell className="fw-bold">Référence</CTableDataCell>
                        <CTableDataCell>{anomalie.reference || '-'}</CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableDataCell className="fw-bold">Code</CTableDataCell>
                        <CTableDataCell>{anomalie.code || '-'}</CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableDataCell className="fw-bold">Stock</CTableDataCell>
                        <CTableDataCell>{anomalie.stock || '-'}</CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableDataCell className="fw-bold">N° BS</CTableDataCell>
                        <CTableDataCell>{anomalie.numeroBS || '-'}</CTableDataCell>
                      </CTableRow>
                    </CTableBody>
                  </CTable>
                </CCol>
                <CCol md={6}>
                  <h6>Planification</h6>
                  <CTable striped>
                    <CTableBody>
                      <CTableRow>
                        <CTableDataCell className="fw-bold">Programmation</CTableDataCell>
                        <CTableDataCell>{anomalie.programmation || '-'}</CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableDataCell className="fw-bold">Sortie PDR</CTableDataCell>
                        <CTableDataCell>{anomalie.sortiePDR || '-'}</CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableDataCell className="fw-bold">Confirmation</CTableDataCell>
                        <CTableDataCell>{anomalie.confirmation || '-'}</CTableDataCell>
                      </CTableRow>
                    </CTableBody>
                  </CTable>
                </CCol>
              </CRow>

              {anomalie.observations && (
                <CRow className="mb-4">
                  <CCol>
                    <h6>Observations</h6>
                    <div className="border rounded p-3 bg-light-subtle">
                      {anomalie.observations}
                    </div>
                  </CCol>
                </CRow>
              )}

              {anomalie.historiqueStatutAnomalies &&
                anomalie.historiqueStatutAnomalies.length > 0 && (
                  <CRow>
                    <CCol>
                      <h6>Historique des statuts</h6>
                      <CTable striped>
                        <CTableHead>
                          <CTableRow>
                            <CTableHeaderCell>Date</CTableHeaderCell>
                            <CTableHeaderCell>Ancien statut</CTableHeaderCell>
                            <CTableHeaderCell>Nouveau statut</CTableHeaderCell>
                            <CTableHeaderCell>Commentaire</CTableHeaderCell>
                          </CTableRow>
                        </CTableHead>
                        <CTableBody>
                          {anomalie.historiqueStatutAnomalies.map((historique) => (
                            <CTableRow key={historique.id}>
                              <CTableDataCell>
                                {formatDate(historique.dateChangement)}
                              </CTableDataCell>
                              <CTableDataCell>
                                <CBadge color={getStatusColor(historique.ancienStatut)}>
                                  {historique.ancienStatut}
                                </CBadge>
                              </CTableDataCell>
                              <CTableDataCell>
                                <CBadge color={getStatusColor(historique.nouveauStatut)}>
                                  {historique.nouveauStatut}
                                </CBadge>
                              </CTableDataCell>
                              <CTableDataCell>{historique.commentaire || '-'}</CTableDataCell>
                            </CTableRow>
                          ))}
                        </CTableBody>
                      </CTable>
                    </CCol>
                  </CRow>
                )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  )
}

export default AnomalieDetail
