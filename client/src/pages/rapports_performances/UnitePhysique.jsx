import React, { useState, useMemo } from 'react'
import { fecthSitesQuery } from '../../hooks/useSites'
import { useQuery } from '@tanstack/react-query'
import { generateUnitePhysiqueQueryOptions } from '../../hooks/useRapports'
import {
  CButton,
  CFormInput,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CCard,
  CCardBody,
  CCardHeader,
  CAlert,
  CBadge,
  CInputGroup,
  CInputGroupText,
  CCol,
  CRow,
  CContainer,
} from '@coreui/react'
import { exportExcel } from '../../helpers/func'
import { cilSearch, cilCloudDownload, cilReload } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

const UnitePhysique = () => {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 7))
  const [searchByParc, setSearchByParc] = useState('')

  const getAllSitesQuery = useQuery(fecthSitesQuery())
  const { data, isFetching, isError, error, refetch } = useQuery(
    generateUnitePhysiqueQueryOptions(date),
  )

  const handleGenerateReport = () => {
    refetch()
  }

  const handleExportExcel = () => {
    if (data?.length > 0) {
      exportExcel('tbl_unite_physique', `Unite_Physique_${date.split('-').reverse().join('-')}`)
    }
  }

  // Filtrage des données avec useMemo pour optimiser les performances
  const filteredData = useMemo(() => {
    if (!data) return []
    if (!searchByParc) return data

    return data.filter((item) => item.parc?.toLowerCase().includes(searchByParc.toLowerCase()))
  }, [data, searchByParc])

  // Statistiques
  const stats = useMemo(() => {
    if (!filteredData.length) return null

    return {
      totalParcs: filteredData.length,
      totalEngins: filteredData.reduce(
        (sum, item) => sum + (parseInt(item.nombre_d_engin) || 0),
        0,
      ),
      totalHRM: filteredData.reduce((sum, item) => sum + (parseFloat(item.hrm_m_total) || 0), 0),
      totalHIM: filteredData.reduce((sum, item) => sum + (parseFloat(item.him_m_total) || 0), 0),
    }
  }, [filteredData])

  const formatValue = (value) => {
    if (value == null || value === '') return '-'
    return parseFloat(value).toFixed(1)
  }

  // Classes CSS adaptatives pour le thème
  const themeClasses = {
    tableHeader: 'bg-primary text-white',
    secondaryBg: 'bg-body-secondary',
    tertiaryBg: 'bg-body-tertiary',
    border: 'border border-secondary',
    textMuted: 'text-body-secondary',
  }

  const getAlternatingBgClass = (index) => {
    return index % 2 === 0 ? themeClasses.secondaryBg : ''
  }

  return (
    <CContainer fluid>
      <CCard className="h-100">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-1">Unité Physique</h5>
            <small className={themeClasses.textMuted}>
              Répartition des heures HRM/HIM par parc et par site
            </small>
          </div>
        </CCardHeader>

        <CCardBody>
          {/* Contrôles principaux */}
          <CRow className="g-3 mb-4">
            <CCol md={3}>
              <CFormInput
                type="month"
                label="Période"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                disabled={isFetching}
              />
            </CCol>

            <CCol md={9} className="d-flex align-items-end gap-2">
              <CButton
                color="primary"
                onClick={handleGenerateReport}
                disabled={isFetching}
                className="d-flex align-items-center"
              >
                {isFetching ? (
                  <CSpinner size="sm" className="me-2" />
                ) : (
                  <CIcon icon={cilReload} className="me-2" />
                )}
                Générer le rapport
              </CButton>

              <CButton
                color="success"
                onClick={handleExportExcel}
                disabled={isFetching || !data?.length}
                className="d-flex align-items-center"
              >
                <CIcon icon={cilCloudDownload} className="me-2" />
                Exporter Excel
              </CButton>

              {searchByParc && (
                <CButton
                  color="secondary"
                  variant="outline"
                  onClick={() => setSearchByParc('')}
                  size="sm"
                >
                  Effacer le filtre
                </CButton>
              )}
            </CCol>
          </CRow>

          {/* Filtre de recherche */}
          <CRow className="g-3 mb-4">
            <CCol md={4}>
              <CInputGroup>
                <CInputGroupText>
                  <CIcon icon={cilSearch} />
                </CInputGroupText>
                <CFormInput
                  type="text"
                  placeholder="Rechercher par parc..."
                  value={searchByParc}
                  onChange={(e) => setSearchByParc(e.target.value)}
                  disabled={isFetching}
                />
              </CInputGroup>
            </CCol>
          </CRow>

          {/* Statistiques */}
          {stats && (
            <CRow className="g-3 mb-4">
              <CCol md={3}>
                <div className={`border rounded p-3 text-center ${themeClasses.secondaryBg}`}>
                  <h6 className={themeClasses.textMuted}>Total Parcs</h6>
                  <h4 className="text-primary mb-0">{stats.totalParcs}</h4>
                </div>
              </CCol>
              <CCol md={3}>
                <div className={`border rounded p-3 text-center ${themeClasses.secondaryBg}`}>
                  <h6 className={themeClasses.textMuted}>Total Engins</h6>
                  <h4 className="text-info mb-0">{stats.totalEngins}</h4>
                </div>
              </CCol>
              <CCol md={3}>
                <div className={`border rounded p-3 text-center ${themeClasses.secondaryBg}`}>
                  <h6 className={themeClasses.textMuted}>Total HRM (M)</h6>
                  <h4 className="text-success mb-0">{stats.totalHRM.toFixed(1)}</h4>
                </div>
              </CCol>
              <CCol md={3}>
                <div className={`border rounded p-3 text-center ${themeClasses.secondaryBg}`}>
                  <h6 className={themeClasses.textMuted}>Total HIM (M)</h6>
                  <h4 className="text-warning mb-0">{stats.totalHIM.toFixed(1)}</h4>
                </div>
              </CCol>
            </CRow>
          )}

          {/* Gestion des erreurs */}
          {isError && (
            <CAlert color="danger" className="mb-3">
              <strong>Erreur lors du chargement du rapport :</strong>{' '}
              {error?.message || 'Une erreur est survenue'}
            </CAlert>
          )}

          {/* Tableau des données */}
          <div className="table-responsive" style={{ maxHeight: '600px' }}>
            <CTable responsive striped hover className="align-middle" id="tbl_unite_physique">
              <CTableHead className="sticky-top">
                {/* En-tête principal */}
                <CTableRow>
                  <CTableHeaderCell
                    colSpan={getAllSitesQuery.data ? 4 * getAllSitesQuery.data.length + 6 : 1}
                    className={themeClasses.tableHeader}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <span>Unité Physique du {date.split('-').reverse().join('-')}</span>
                      {filteredData.length > 0 && (
                        <CBadge color="light" className="text-dark">
                          {filteredData.length} parc(s)
                        </CBadge>
                      )}
                    </div>
                  </CTableHeaderCell>
                </CTableRow>

                {/* En-tête des sites */}
                <CTableRow>
                  <CTableHeaderCell colSpan={2} rowSpan={2} className="align-middle border-end">
                    Parc
                  </CTableHeaderCell>

                  {getAllSitesQuery.data?.map((site, index) => (
                    <CTableHeaderCell
                      key={site.id}
                      colSpan={4}
                      className={`text-center ${getAlternatingBgClass(index)}`}
                    >
                      {site.name}
                    </CTableHeaderCell>
                  ))}

                  <CTableHeaderCell colSpan={4} className="text-center border-start">
                    TOTAL
                  </CTableHeaderCell>
                </CTableRow>

                {/* En-tête des types d'heures par site */}
                <CTableRow>
                  {getAllSitesQuery.data?.map((site, index) => (
                    <React.Fragment key={site.id}>
                      <CTableHeaderCell
                        colSpan={2}
                        className={`text-center ${getAlternatingBgClass(index)}`}
                      >
                        HRM
                      </CTableHeaderCell>
                      <CTableHeaderCell
                        colSpan={2}
                        className={`text-center ${getAlternatingBgClass(index)}`}
                      >
                        HIM
                      </CTableHeaderCell>
                    </React.Fragment>
                  ))}

                  <CTableHeaderCell colSpan={2} className="text-center border-start">
                    HRM
                  </CTableHeaderCell>
                  <CTableHeaderCell colSpan={2} className="text-center">
                    HIM
                  </CTableHeaderCell>
                </CTableRow>

                {/* En-tête des périodes */}
                <CTableRow>
                  <CTableHeaderCell>Nom</CTableHeaderCell>
                  <CTableHeaderCell className="border-end">Nbre</CTableHeaderCell>

                  {getAllSitesQuery.data?.map((site, index) => (
                    <React.Fragment key={site.id}>
                      <CTableHeaderCell className={getAlternatingBgClass(index)}>
                        M
                      </CTableHeaderCell>
                      <CTableHeaderCell className={getAlternatingBgClass(index)}>
                        A
                      </CTableHeaderCell>
                      <CTableHeaderCell className={getAlternatingBgClass(index)}>
                        M
                      </CTableHeaderCell>
                      <CTableHeaderCell className={getAlternatingBgClass(index)}>
                        A
                      </CTableHeaderCell>
                    </React.Fragment>
                  ))}

                  <CTableHeaderCell className="border-start">M</CTableHeaderCell>
                  <CTableHeaderCell>A</CTableHeaderCell>
                  <CTableHeaderCell>M</CTableHeaderCell>
                  <CTableHeaderCell>A</CTableHeaderCell>
                </CTableRow>
              </CTableHead>

              <CTableBody>
                {isFetching ? (
                  <CTableRow>
                    <CTableDataCell
                      colSpan={getAllSitesQuery.data ? 4 * getAllSitesQuery.data.length + 6 : 1}
                      className="text-center py-4"
                    >
                      <CSpinner size="sm" className="me-2" />
                      Chargement du rapport...
                    </CTableDataCell>
                  </CTableRow>
                ) : filteredData.length > 0 ? (
                  filteredData.map((unitePhysique, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell>
                        <strong>{unitePhysique.parc}</strong>
                      </CTableDataCell>
                      <CTableDataCell className="border-end">
                        <CBadge color="primary">{unitePhysique.nombre_d_engin}</CBadge>
                      </CTableDataCell>

                      {/* Données par site */}
                      {getAllSitesQuery.data?.map((site, siteIndex) => {
                        const siteData = unitePhysique.par_site?.find((s) => s.site === site.name)
                        return (
                          <React.Fragment key={site.id}>
                            <CTableDataCell className={getAlternatingBgClass(siteIndex)}>
                              {formatValue(siteData?.hrm_m)}
                            </CTableDataCell>
                            <CTableDataCell className={getAlternatingBgClass(siteIndex)}>
                              {formatValue(siteData?.hrm_a)}
                            </CTableDataCell>
                            <CTableDataCell className={getAlternatingBgClass(siteIndex)}>
                              {formatValue(siteData?.him_m)}
                            </CTableDataCell>
                            <CTableDataCell className={getAlternatingBgClass(siteIndex)}>
                              {formatValue(siteData?.him_a)}
                            </CTableDataCell>
                          </React.Fragment>
                        )
                      })}

                      {/* Totaux */}
                      <CTableDataCell className="border-start">
                        <strong>{formatValue(unitePhysique.hrm_m_total)}</strong>
                      </CTableDataCell>
                      <CTableDataCell>
                        <strong>{formatValue(unitePhysique.hrm_a_total)}</strong>
                      </CTableDataCell>
                      <CTableDataCell>
                        <strong>{formatValue(unitePhysique.him_m_total)}</strong>
                      </CTableDataCell>
                      <CTableDataCell>
                        <strong>{formatValue(unitePhysique.him_a_total)}</strong>
                      </CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell
                      colSpan={getAllSitesQuery.data ? 4 * getAllSitesQuery.data.length + 6 : 1}
                      className="text-center py-4 text-muted"
                    >
                      {data?.length === 0 ? (
                        <>Aucune donnée disponible pour la période sélectionnée</>
                      ) : (
                        <>Aucun résultat ne correspond aux critères de recherche</>
                      )}
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>
          </div>
        </CCardBody>
      </CCard>
    </CContainer>
  )
}

export default UnitePhysique
