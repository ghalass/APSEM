import React, { useState, useMemo } from 'react'
import { getParetoIndispParcOptions, getParetoMtbfParcOptions } from '../../hooks/useRapports'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  CButton,
  CFormInput,
  CFormSelect,
  CSpinner,
  CTable,
  CCard,
  CCardBody,
  CCardHeader,
  CAlert,
  CCol,
  CRow,
  CContainer,
} from '@coreui/react'
import { useParcs } from '../../hooks/useParcs'
import ChartCustom from '../../components/ChartCustom'

const ParetosInDispo = () => {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 7))
  const [selectedParc, setSelectedParc] = useState('')
  const [selectedParcName, setSelectedParcName] = useState('')
  const queryClient = useQueryClient()

  const getAllParcsQuery = useQuery(useParcs())
  const getParetoIndispParc = useQuery(getParetoIndispParcOptions(selectedParc, date))
  const getParetoMtbfParc = useQuery(getParetoMtbfParcOptions(selectedParc, date))

  const handleGenerateReport = () => {
    getParetoIndispParc.refetch()
    getParetoMtbfParc.refetch()
  }

  const handleParcChange = (e) => {
    const newParcId = e.target.value
    const newParcName = newParcId !== '' ? e.target.options[e.target.selectedIndex].text : ''

    // Réinitialiser les données des charts
    queryClient.removeQueries({ queryKey: getParetoIndispParcOptions(newParcId, date).queryKey })
    queryClient.removeQueries({ queryKey: getParetoMtbfParcOptions(newParcId, date).queryKey })

    setSelectedParc(newParcId)
    setSelectedParcName(newParcName)
  }

  // Classes CSS adaptatives
  const themeClasses = {
    tableHeader: 'bg-primary text-white',
    secondaryBg: 'bg-body-secondary',
    border: 'border border-secondary',
    textMuted: 'text-body-secondary',
  }

  const isLoading = getParetoIndispParc.isFetching || getParetoMtbfParc.isFetching

  return (
    <CContainer fluid>
      <CCard className="h-100">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-1">Pareto Indisponibilités</h5>
            <small className={themeClasses.textMuted}>
              Analyse Pareto des indisponibilités et évolution MTBF par parc
            </small>
          </div>
        </CCardHeader>

        <CCardBody>
          {/* Contrôles principaux */}
          <CRow className="g-3 mb-4">
            <CCol md={4}>
              <CFormSelect
                label="Sélectionner un parc"
                value={selectedParc}
                onChange={handleParcChange}
                disabled={isLoading}
              >
                <option value="">Choisir un parc...</option>
                {getAllParcsQuery.data?.map((item, index) => (
                  <option key={index} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </CFormSelect>
            </CCol>

            <CCol md={4}>
              <CFormInput
                type="month"
                label="Période"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                disabled={isLoading}
              />
            </CCol>

            <CCol md={4} className="d-flex align-items-end">
              <CButton
                color="primary"
                onClick={handleGenerateReport}
                disabled={isLoading || selectedParc === ''}
                className="d-flex align-items-center w-100"
              >
                {isLoading ? <CSpinner size="sm" className="me-2" /> : null}
                Générer les rapports
              </CButton>
            </CCol>
          </CRow>

          {/* Gestion des erreurs */}
          {(getParetoIndispParc.isError || getParetoMtbfParc.isError) && (
            <CAlert color="danger" className="mb-3">
              <strong>Erreur lors du chargement des données :</strong>{' '}
              {getParetoIndispParc.error?.message ||
                getParetoMtbfParc.error?.message ||
                'Une erreur est survenue'}
            </CAlert>
          )}

          {selectedParc && (
            <CRow className="g-4">
              {/* Pareto Indisponibilités */}
              <CCol lg={6}>
                <CCard className="h-100">
                  <CCardHeader className="bg-primary text-white">
                    <h6 className="mb-0 text-center">
                      Pareto Indisponibilités - {selectedParcName} -{' '}
                      {date.split('-').reverse().join('-')}
                    </h6>
                  </CCardHeader>
                  <CCardBody>
                    {isLoading ? (
                      <div className="text-center py-4">
                        <CSpinner size="sm" className="me-2" />
                        Chargement du graphique...
                      </div>
                    ) : getParetoIndispParc.data && getParetoIndispParc.data.length > 0 ? (
                      <>
                        <ChartCustom
                          data={getParetoIndispParc.data.slice(0, 10)}
                          xDataKey="panne"
                          barDataKeys={['indispo']}
                          type="bar"
                          height={300}
                        />

                        {/* Tableau des engins affectés par HIM */}
                        <div className="mt-4">
                          <h6 className="text-center mb-3">
                            Top 10 pannes les plus affectantes [HIM]
                          </h6>
                          <div className="table-responsive" style={{ maxHeight: '200px' }}>
                            <CTable striped hover size="sm" className="mb-0">
                              <thead>
                                <tr>
                                  <th>Panne</th>
                                  <th>Engins affectés</th>
                                </tr>
                              </thead>
                              <tbody>
                                {getParetoIndispParc.data.slice(0, 9).map((panneObj, k) => (
                                  <tr key={k}>
                                    <td>
                                      <small>{panneObj.panne}</small>
                                    </td>
                                    <td>
                                      <div>
                                        {panneObj.engins
                                          ?.filter((e) => e.him !== 0)
                                          .slice(0, 3)
                                          .map((e, r) => (
                                            <div key={r} className="small">
                                              {e.name} ({e.him}h)
                                            </div>
                                          ))}
                                        {panneObj.engins?.filter((e) => e.him !== 0).length > 3 && (
                                          <small className="text-muted">
                                            +{panneObj.engins.filter((e) => e.him !== 0).length - 3}{' '}
                                            autres
                                          </small>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </CTable>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-4 text-muted">
                        Aucune donnée d'indisponibilité disponible pour ce parc
                      </div>
                    )}
                  </CCardBody>
                </CCard>
              </CCol>

              {/* Évolution MTBF */}
              <CCol lg={6}>
                <CCard className="h-100">
                  <CCardHeader className="bg-info text-white">
                    <h6 className="mb-0 text-center">
                      Évolution MTBF - {selectedParcName} - {date.split('-').reverse().join('-')}
                    </h6>
                  </CCardHeader>
                  <CCardBody>
                    {isLoading ? (
                      <div className="text-center py-4">
                        <CSpinner size="sm" className="me-2" />
                        Chargement du graphique...
                      </div>
                    ) : getParetoMtbfParc.data && getParetoMtbfParc.data.length > 0 ? (
                      <>
                        <ChartCustom
                          data={getParetoMtbfParc.data}
                          xDataKey="mois"
                          barDataKeys={['mtbf', 'objectif_mtbf']}
                          type="line"
                          height={300}
                        />

                        {/* Tableau des engins affectés par NI */}
                        <div className="mt-4">
                          <h6 className="text-center mb-3">
                            Top 10 pannes les plus fréquentes [NI]
                          </h6>
                          <div className="table-responsive" style={{ maxHeight: '200px' }}>
                            <CTable striped bordered hover size="sm" className="mb-0">
                              <thead>
                                <tr>
                                  <th>Panne</th>
                                  <th>Engins affectés</th>
                                </tr>
                              </thead>
                              <tbody>
                                {getParetoIndispParc.data.slice(0, 9).map((panneObj, k) => (
                                  <tr key={k}>
                                    <td>
                                      <small>{panneObj.panne}</small>
                                    </td>
                                    <td>
                                      <div>
                                        {panneObj.engins_mtbf
                                          ?.filter((e) => e.ni !== 0)
                                          .slice(0, 3)
                                          .map((e, r) => (
                                            <div key={r} className="small">
                                              {e.name} ({e.ni} occ.)
                                            </div>
                                          ))}
                                        {panneObj.engins_mtbf?.filter((e) => e.ni !== 0).length >
                                          3 && (
                                          <small className="text-muted">
                                            +
                                            {panneObj.engins_mtbf.filter((e) => e.ni !== 0).length -
                                              3}{' '}
                                            autres
                                          </small>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </CTable>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-4 text-muted">
                        Aucune donnée MTBF disponible pour ce parc
                      </div>
                    )}
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
          )}

          {!selectedParc && (
            <div className="text-center py-5 text-muted">
              <h6>Veuillez sélectionner un parc pour afficher les analyses</h6>
              <small>Choisissez un parc dans la liste déroulante ci-dessus</small>
            </div>
          )}
        </CCardBody>
      </CCard>
    </CContainer>
  )
}

export default ParetosInDispo
