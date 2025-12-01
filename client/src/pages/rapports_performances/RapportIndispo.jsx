import React, { useState, useMemo } from 'react'
import { getRapportIndispoOptions } from '../../hooks/useRapports'
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

const RapportIndispo = () => {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 7))
  const [searchFilters, setSearchFilters] = useState({
    parc: '',
    typeparc: '',
  })

  const { data, isFetching, isError, error, refetch } = useQuery(getRapportIndispoOptions(date))

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
      parc: '',
      typeparc: '',
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
      exportExcel(
        'tbl_rapportindispo',
        `Rapport_Indisponibilite_${date.split('-').reverse().join('-')}`,
      )
    }
  }

  // Statistiques
  const stats = useMemo(() => {
    if (!filteredData.length) return null

    return {
      totalPannes: filteredData.length,
      totalIndispoM: filteredData.reduce((sum, item) => sum + (parseFloat(item.indisp_m) || 0), 0),
      totalIndispoA: filteredData.reduce((sum, item) => sum + (parseFloat(item.indisp_a) || 0), 0),
      totalHIM: filteredData.reduce((sum, item) => sum + (parseFloat(item.him_m) || 0), 0),
    }
  }, [filteredData])

  const formatValue = (value, type = 'number') => {
    if (value == null || value === '') return '-'
    if (type === 'percent') return `${parseFloat(value).toFixed(1)}%`
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
            <h5 className="mb-1">Rapport d'Indisponibilité</h5>
            <small className={themeClasses.textMuted}>
              Analyse des indisponibilités par type de panne et parc
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
                disabled={isFetching || filteredData.length === 0}
                className="d-flex align-items-center"
              >
                <CIcon icon={cilCloudDownload} className="me-2" />
                Exporter Excel
              </CButton>

              {(searchFilters.parc || searchFilters.typeparc) && (
                <CButton color="secondary" variant="outline" onClick={clearFilters} size="sm">
                  Effacer les filtres
                </CButton>
              )}
            </CCol>
          </CRow>

          {/* Filtres de recherche */}
          <CRow className="g-3 mb-4">
            <CCol md={6}>
              <CInputGroup>
                <CInputGroupText>
                  <CIcon icon={cilSearch} />
                </CInputGroupText>
                <CFormInput
                  type="text"
                  placeholder="Rechercher par parc..."
                  value={searchFilters.parc}
                  onChange={(e) => handleSearchChange('parc', e.target.value)}
                  disabled={isFetching}
                />
              </CInputGroup>
            </CCol>
            <CCol md={6}>
              <CInputGroup>
                <CInputGroupText>
                  <CIcon icon={cilSearch} />
                </CInputGroupText>
                <CFormInput
                  type="text"
                  placeholder="Rechercher par type de parc..."
                  value={searchFilters.typeparc}
                  onChange={(e) => handleSearchChange('typeparc', e.target.value)}
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
                  <h6 className={themeClasses.textMuted}>Total Pannes</h6>
                  <h4 className="text-primary mb-0">{stats.totalPannes}</h4>
                </div>
              </CCol>
              <CCol md={3}>
                <div className={`border rounded p-3 text-center ${themeClasses.secondaryBg}`}>
                  <h6 className={themeClasses.textMuted}>Indispo Mensuel</h6>
                  <h4 className="text-danger mb-0">{stats.totalIndispoM.toFixed(1)}h</h4>
                </div>
              </CCol>
              <CCol md={3}>
                <div className={`border rounded p-3 text-center ${themeClasses.secondaryBg}`}>
                  <h6 className={themeClasses.textMuted}>Indispo Annuel</h6>
                  <h4 className="text-warning mb-0">{stats.totalIndispoA.toFixed(1)}h</h4>
                </div>
              </CCol>
              <CCol md={3}>
                <div className={`border rounded p-3 text-center ${themeClasses.secondaryBg}`}>
                  <h6 className={themeClasses.textMuted}>Total HIM</h6>
                  <h4 className="text-info mb-0">{stats.totalHIM.toFixed(1)}h</h4>
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
            <CTable responsive striped hover className="align-middle" id="tbl_rapportindispo">
              <CTableHead className="sticky-top">
                {/* En-tête principal */}
                <CTableRow>
                  <CTableHeaderCell colSpan={14} className={themeClasses.tableHeader}>
                    <div className="d-flex justify-content-between align-items-center">
                      <span>
                        Rapport d'indisponibilité du {date.split('-').reverse().join('-')}
                      </span>
                      {filteredData.length > 0 && (
                        <CBadge color="light" className="text-dark">
                          {filteredData.length} enregistrement(s)
                        </CBadge>
                      )}
                    </div>
                  </CTableHeaderCell>
                </CTableRow>

                {/* En-tête des groupes */}
                <CTableRow>
                  <CTableHeaderCell colSpan={4} rowSpan={2} className="align-middle border-end">
                    Identification
                  </CTableHeaderCell>
                  <CTableHeaderCell colSpan={2} className="text-center">
                    NHO
                  </CTableHeaderCell>
                  <CTableHeaderCell colSpan={2} className="text-center bg-body-tertiary">
                    NI
                  </CTableHeaderCell>
                  <CTableHeaderCell colSpan={2} className="text-center">
                    HIM
                  </CTableHeaderCell>
                  <CTableHeaderCell colSpan={2} className="text-center bg-body-tertiary">
                    INDISP
                  </CTableHeaderCell>
                  <CTableHeaderCell colSpan={2} className="text-center">
                    COEF
                  </CTableHeaderCell>
                </CTableRow>

                {/* En-tête des périodes */}
                <CTableRow>
                  <CTableHeaderCell>M</CTableHeaderCell>
                  <CTableHeaderCell>A</CTableHeaderCell>

                  <CTableHeaderCell className="bg-body-tertiary">M</CTableHeaderCell>
                  <CTableHeaderCell className="bg-body-tertiary">A</CTableHeaderCell>

                  <CTableHeaderCell>M</CTableHeaderCell>
                  <CTableHeaderCell>A</CTableHeaderCell>

                  <CTableHeaderCell className="bg-body-tertiary">M</CTableHeaderCell>
                  <CTableHeaderCell className="bg-body-tertiary">A</CTableHeaderCell>

                  <CTableHeaderCell>M</CTableHeaderCell>
                  <CTableHeaderCell>A</CTableHeaderCell>
                </CTableRow>

                {/* En-tête des colonnes */}
                <CTableRow>
                  <CTableHeaderCell>Type</CTableHeaderCell>
                  <CTableHeaderCell>Parc</CTableHeaderCell>
                  <CTableHeaderCell>Nbr</CTableHeaderCell>
                  <CTableHeaderCell className="border-end">Panne</CTableHeaderCell>

                  <CTableHeaderCell>M</CTableHeaderCell>
                  <CTableHeaderCell>A</CTableHeaderCell>

                  <CTableHeaderCell className="bg-body-tertiary">M</CTableHeaderCell>
                  <CTableHeaderCell className="bg-body-tertiary">A</CTableHeaderCell>

                  <CTableHeaderCell>M</CTableHeaderCell>
                  <CTableHeaderCell>A</CTableHeaderCell>

                  <CTableHeaderCell className="bg-body-tertiary">M</CTableHeaderCell>
                  <CTableHeaderCell className="bg-body-tertiary">A</CTableHeaderCell>

                  <CTableHeaderCell>M</CTableHeaderCell>
                  <CTableHeaderCell>A</CTableHeaderCell>
                </CTableRow>
              </CTableHead>

              <CTableBody>
                {isFetching ? (
                  <CTableRow>
                    <CTableDataCell colSpan={14} className="text-center py-4">
                      <CSpinner size="sm" className="me-2" />
                      Chargement du rapport...
                    </CTableDataCell>
                  </CTableRow>
                ) : filteredData.length > 0 ? (
                  filteredData.map((rapp, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell>
                        <CBadge color="secondary">{rapp.typeparc}</CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
                        <strong>{rapp.parc}</strong>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge color="primary">{rapp.nombre_d_engin}</CBadge>
                      </CTableDataCell>
                      <CTableDataCell className="border-end">
                        <small>{rapp.panne}</small>
                      </CTableDataCell>

                      <CTableDataCell>{formatValue(rapp.nho_m)}</CTableDataCell>
                      <CTableDataCell>{formatValue(rapp.nho_a)}</CTableDataCell>

                      <CTableDataCell className="bg-body-tertiary">
                        {formatValue(rapp.ni_m)}
                      </CTableDataCell>
                      <CTableDataCell className="bg-body-tertiary">
                        {formatValue(rapp.ni_a)}
                      </CTableDataCell>

                      <CTableDataCell>{formatValue(rapp.him_m)}</CTableDataCell>
                      <CTableDataCell>{formatValue(rapp.him_a)}</CTableDataCell>

                      <CTableDataCell className="bg-body-tertiary">
                        {formatValue(rapp.indisp_m)}
                      </CTableDataCell>
                      <CTableDataCell className="bg-body-tertiary">
                        {formatValue(rapp.indisp_a)}
                      </CTableDataCell>

                      <CTableDataCell>{formatValue(rapp.coef_indispo_m, 'percent')}</CTableDataCell>
                      <CTableDataCell>{formatValue(rapp.coef_indispo_a, 'percent')}</CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan={14} className="text-center py-4 text-muted">
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

export default RapportIndispo
