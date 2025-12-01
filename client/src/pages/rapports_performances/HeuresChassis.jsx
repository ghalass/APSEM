import React, { useState, useMemo } from 'react'
import { getRapportHeuresChassisOptions } from '../../hooks/useRapports'
import { useQuery } from '@tanstack/react-query'
import { exportExcel } from '../../helpers/func'
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
import { cilSearch, cilCloudDownload, cilReload } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

const HeuresChassis = () => {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 7))
  const [searchFilters, setSearchFilters] = useState({
    typeparc: '',
    parc: '',
    engin: '',
    site: '',
  })

  const { data, isFetching, isError, error, refetch } = useQuery(
    getRapportHeuresChassisOptions(date),
  )

  const handleGenerateReport = () => {
    refetch()
  }

  const handleSearchChange = (field, value) => {
    setSearchFilters((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const clearFilters = () => {
    setSearchFilters({
      typeparc: '',
      parc: '',
      engin: '',
      site: '',
    })
  }

  // Filtrage des données
  const filteredData = useMemo(() => {
    if (!data) return []

    return data.filter((item) =>
      Object.entries(searchFilters).every(([key, value]) => {
        if (!value) return true
        return item[key]?.toLowerCase().includes(value.toLowerCase())
      }),
    )
  }, [data, searchFilters])

  const handleExportExcel = () => {
    if (filteredData.length > 0) {
      exportExcel('tbl_heures_chassis', `Heures_Chassis_${date.split('-').reverse().join('-')}`)
    }
  }

  // Statistiques
  const stats = useMemo(() => {
    if (!filteredData.length) return null

    return {
      totalEngins: filteredData.length,
      totalHRM: filteredData.reduce((sum, item) => sum + (parseFloat(item.hrm_m) || 0), 0),
      totalHeuresChassis: filteredData.reduce(
        (sum, item) => sum + (parseFloat(item.heuresChassis) || 0),
        0,
      ),
      moyenneHeuresChassis:
        filteredData.reduce((sum, item) => sum + (parseFloat(item.heuresChassis) || 0), 0) /
        filteredData.length,
    }
  }, [filteredData])

  const formatValue = (value) => {
    if (value == null || value === '') return '-'
    return parseFloat(value).toFixed(1)
  }

  // Classes CSS adaptatives
  const themeClasses = {
    tableHeader: 'bg-primary text-white',
    secondaryBg: 'bg-body-secondary',
    border: 'border border-secondary',
    textMuted: 'text-body-secondary',
  }

  return (
    <CContainer fluid>
      <CCard className="h-100">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-1">Heures Châssis</h5>
            <small className={themeClasses.textMuted}>Rapport des heures châssis par engin</small>
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
                disabled={isFetching || filteredData.length === 0}
                className="d-flex align-items-center"
              >
                <CIcon icon={cilCloudDownload} className="me-2" />
                Exporter Excel
              </CButton>

              {(searchFilters.typeparc ||
                searchFilters.parc ||
                searchFilters.engin ||
                searchFilters.site) && (
                <CButton color="secondary" variant="outline" onClick={clearFilters} size="sm">
                  Effacer les filtres
                </CButton>
              )}
            </CCol>
          </CRow>

          {/* Filtres de recherche */}
          <CRow className="g-3 mb-4">
            <CCol md={3}>
              <CInputGroup>
                <CInputGroupText>
                  <CIcon icon={cilSearch} />
                </CInputGroupText>
                <CFormInput
                  type="text"
                  placeholder="Type de parc..."
                  value={searchFilters.typeparc}
                  onChange={(e) => handleSearchChange('typeparc', e.target.value)}
                  disabled={isFetching}
                />
              </CInputGroup>
            </CCol>
            <CCol md={3}>
              <CInputGroup>
                <CInputGroupText>
                  <CIcon icon={cilSearch} />
                </CInputGroupText>
                <CFormInput
                  type="text"
                  placeholder="Parc..."
                  value={searchFilters.parc}
                  onChange={(e) => handleSearchChange('parc', e.target.value)}
                  disabled={isFetching}
                />
              </CInputGroup>
            </CCol>
            <CCol md={3}>
              <CInputGroup>
                <CInputGroupText>
                  <CIcon icon={cilSearch} />
                </CInputGroupText>
                <CFormInput
                  type="text"
                  placeholder="Engin..."
                  value={searchFilters.engin}
                  onChange={(e) => handleSearchChange('engin', e.target.value)}
                  disabled={isFetching}
                />
              </CInputGroup>
            </CCol>
            <CCol md={3}>
              <CInputGroup>
                <CInputGroupText>
                  <CIcon icon={cilSearch} />
                </CInputGroupText>
                <CFormInput
                  type="text"
                  placeholder="Site..."
                  value={searchFilters.site}
                  onChange={(e) => handleSearchChange('site', e.target.value)}
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
                  <h6 className={themeClasses.textMuted}>Total Engins</h6>
                  <h4 className="text-primary mb-0">{stats.totalEngins}</h4>
                </div>
              </CCol>
              <CCol md={3}>
                <div className={`border rounded p-3 text-center ${themeClasses.secondaryBg}`}>
                  <h6 className={themeClasses.textMuted}>Total HRM</h6>
                  <h4 className="text-success mb-0">{stats.totalHRM.toFixed(1)}h</h4>
                </div>
              </CCol>
              <CCol md={3}>
                <div className={`border rounded p-3 text-center ${themeClasses.secondaryBg}`}>
                  <h6 className={themeClasses.textMuted}>Total Heures Châssis</h6>
                  <h4 className="text-info mb-0">{stats.totalHeuresChassis.toFixed(1)}h</h4>
                </div>
              </CCol>
              <CCol md={3}>
                <div className={`border rounded p-3 text-center ${themeClasses.secondaryBg}`}>
                  <h6 className={themeClasses.textMuted}>Moy. Heures Châssis</h6>
                  <h4 className="text-warning mb-0">{stats.moyenneHeuresChassis.toFixed(1)}h</h4>
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
            <CTable responsive striped hover className="align-middle" id="tbl_heures_chassis">
              <CTableHead className="sticky-top">
                {/* En-tête principal */}
                <CTableRow>
                  <CTableHeaderCell colSpan={6} className={themeClasses.tableHeader}>
                    <div className="d-flex justify-content-between align-items-center">
                      <span>Rapport heures châssis du {date.split('-').reverse().join('-')}</span>
                      {filteredData.length > 0 && (
                        <CBadge color="light" className="text-dark">
                          {filteredData.length} engin(s)
                        </CBadge>
                      )}
                    </div>
                  </CTableHeaderCell>
                </CTableRow>

                {/* En-tête des colonnes */}
                <CTableRow>
                  <CTableHeaderCell>Type</CTableHeaderCell>
                  <CTableHeaderCell>Parc</CTableHeaderCell>
                  <CTableHeaderCell>Engin</CTableHeaderCell>
                  <CTableHeaderCell>HRM_M</CTableHeaderCell>
                  <CTableHeaderCell>H_CHASSI</CTableHeaderCell>
                  <CTableHeaderCell>Site</CTableHeaderCell>
                </CTableRow>
              </CTableHead>

              <CTableBody>
                {isFetching ? (
                  <CTableRow>
                    <CTableDataCell colSpan={6} className="text-center py-4">
                      <CSpinner size="sm" className="me-2" />
                      Chargement du rapport...
                    </CTableDataCell>
                  </CTableRow>
                ) : filteredData.length > 0 ? (
                  filteredData.map((item, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell>
                        <CBadge color="secondary">{item.typeparc}</CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge color="info">{item.parc}</CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
                        <strong>{item.engin}</strong>
                      </CTableDataCell>
                      <CTableDataCell>
                        <span className="badge bg-success">{formatValue(item.hrm_m)}h</span>
                      </CTableDataCell>
                      <CTableDataCell>
                        <span className="badge bg-warning text-dark">
                          {formatValue(item.heuresChassis)}h
                        </span>
                      </CTableDataCell>
                      <CTableDataCell>
                        <small>{item.site}</small>
                      </CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan={6} className="text-center py-4 text-muted">
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

export default HeuresChassis
