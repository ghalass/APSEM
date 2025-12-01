import React, { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { generateRjeQueryOptions } from '../../hooks/useRapports'
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

const RapportRje = () => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [searchFilters, setSearchFilters] = useState({
    engin: '',
    site: '',
  })

  const { data, isFetching, isError, error, refetch } = useQuery(generateRjeQueryOptions(date))

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
      engin: '',
      site: '',
    })
  }

  // Filtrage des données avec useMemo pour optimiser les performances
  const filteredData = useMemo(() => {
    if (!data) return []

    return data.filter((item) =>
      Object.entries(searchFilters).every(([key, value]) => {
        if (!value) return true
        const itemValue = item[key === 'site' ? 'siteName' : key] || ''
        return itemValue.toString().toLowerCase().includes(value.toLowerCase())
      }),
    )
  }, [data, searchFilters])

  const handleExportExcel = () => {
    if (filteredData.length > 0) {
      exportExcel('tbl_rje', `Rapport_RJE_${date.split('-').reverse().join('-')}`)
    }
  }

  // Statistiques
  const stats = useMemo(() => {
    if (!filteredData.length) return null

    return {
      totalEngins: filteredData.length,
      moyenneDispoJ:
        filteredData.reduce((sum, item) => sum + (parseFloat(item.dispo_j) || 0), 0) /
        filteredData.length,
      moyenneDispoM:
        filteredData.reduce((sum, item) => sum + (parseFloat(item.dispo_m) || 0), 0) /
        filteredData.length,
      moyenneDispoA:
        filteredData.reduce((sum, item) => sum + (parseFloat(item.dispo_a) || 0), 0) /
        filteredData.length,
    }
  }, [filteredData])

  const formatValue = (value, type = 'number') => {
    if (value == null || value === '') return '-'
    if (type === 'percent') return `${parseFloat(value).toFixed(1)}%`
    if (type === 'number') return parseFloat(value).toFixed(1)
    return value
  }

  const getDispoColor = (value, objectif) => {
    const numValue = parseFloat(value) || 0
    const numObjectif = parseFloat(objectif) || 0
    if (numValue >= numObjectif) return 'success'
    if (numValue >= numObjectif * 0.9) return 'warning'
    return 'danger'
  }

  // Classes CSS adaptatives pour le thème
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
            <h5 className="mb-1">Rapport Journalier Engins (RJE)</h5>
            <small className={themeClasses.textMuted}>
              Rapport de performance des engins - Journalier, Mensuel et Annuel
            </small>
          </div>
        </CCardHeader>

        <CCardBody>
          {/* Contrôles principaux */}
          <CRow className="g-3 mb-4">
            <CCol md={3}>
              <CFormInput
                type="date"
                label="Date du rapport"
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

              {(searchFilters.engin || searchFilters.site) && (
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
                  placeholder="Rechercher par engin..."
                  value={searchFilters.engin}
                  onChange={(e) => handleSearchChange('engin', e.target.value)}
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
                  placeholder="Rechercher par site..."
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
                  <h6 className={themeClasses.textMuted}>Dispo Journalier</h6>
                  <h4 className="text-success mb-0">{stats.moyenneDispoJ.toFixed(1)}%</h4>
                </div>
              </CCol>
              <CCol md={3}>
                <div className={`border rounded p-3 text-center ${themeClasses.secondaryBg}`}>
                  <h6 className={themeClasses.textMuted}>Dispo Mensuel</h6>
                  <h4 className="text-info mb-0">{stats.moyenneDispoM.toFixed(1)}%</h4>
                </div>
              </CCol>
              <CCol md={3}>
                <div className={`border rounded p-3 text-center ${themeClasses.secondaryBg}`}>
                  <h6 className={themeClasses.textMuted}>Dispo Annuel</h6>
                  <h4 className="text-warning mb-0">{stats.moyenneDispoA.toFixed(1)}%</h4>
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
            <CTable responsive striped hover className="align-middle" id="tbl_rje">
              <CTableHead className="sticky-top">
                {/* En-tête principal */}
                <CTableRow>
                  <CTableHeaderCell colSpan={32} className={themeClasses.tableHeader}>
                    <div className="d-flex justify-content-between align-items-center">
                      <span>
                        Rapport Journalier Engins RJE du {date.split('-').reverse().join('-')}
                      </span>
                      {filteredData.length > 0 && (
                        <CBadge color="light" className="text-dark">
                          {filteredData.length} engin(s)
                        </CBadge>
                      )}
                    </div>
                  </CTableHeaderCell>
                </CTableRow>

                {/* En-tête des périodes */}
                <CTableRow>
                  <CTableHeaderCell colSpan={2} rowSpan={2} className="align-middle border-end">
                    Identification
                  </CTableHeaderCell>
                  <CTableHeaderCell colSpan={10} className="text-center border-start">
                    JOURNALIER
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    colSpan={10}
                    className="text-center border-start bg-body-tertiary"
                  >
                    MENSUEL
                  </CTableHeaderCell>
                  <CTableHeaderCell colSpan={10} className="text-center border-start">
                    ANNUEL
                  </CTableHeaderCell>
                </CTableRow>

                {/* En-tête des indicateurs */}
                <CTableRow>
                  {/* Journalier */}
                  <CTableHeaderCell className="text-center border-start">NHO</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">HRM</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">HIM</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">NI</CTableHeaderCell>
                  <CTableHeaderCell className="text-center border-start" colSpan={2}>
                    DISP
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center border-start" colSpan={2}>
                    MTBF
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center border-start" colSpan={2}>
                    TDM
                  </CTableHeaderCell>

                  {/* Mensuel */}
                  <CTableHeaderCell className="text-center border-start bg-body-tertiary">
                    NHO
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center bg-body-tertiary">HRM</CTableHeaderCell>
                  <CTableHeaderCell className="text-center bg-body-tertiary">HIM</CTableHeaderCell>
                  <CTableHeaderCell className="text-center bg-body-tertiary">NI</CTableHeaderCell>
                  <CTableHeaderCell
                    className="text-center border-start bg-body-tertiary"
                    colSpan={2}
                  >
                    DISP
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    className="text-center border-start bg-body-tertiary"
                    colSpan={2}
                  >
                    MTBF
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    className="text-center border-start bg-body-tertiary"
                    colSpan={2}
                  >
                    TDM
                  </CTableHeaderCell>

                  {/* Annuel */}
                  <CTableHeaderCell className="text-center border-start">NHO</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">HRM</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">HIM</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">NI</CTableHeaderCell>
                  <CTableHeaderCell className="text-center border-start" colSpan={2}>
                    DISP
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center border-start" colSpan={2}>
                    MTBF
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center border-start" colSpan={2}>
                    TDM
                  </CTableHeaderCell>
                </CTableRow>

                {/* En-tête des sous-colonnes */}
                <CTableRow>
                  <CTableHeaderCell>Engin</CTableHeaderCell>
                  <CTableHeaderCell className="border-end">Site</CTableHeaderCell>

                  {/* Journalier */}
                  <CTableHeaderCell className="border-start">NHO</CTableHeaderCell>
                  <CTableHeaderCell>HRM</CTableHeaderCell>
                  <CTableHeaderCell>HIM</CTableHeaderCell>
                  <CTableHeaderCell>NI</CTableHeaderCell>
                  <CTableHeaderCell className="text-center border-start">réal.</CTableHeaderCell>
                  <CTableHeaderCell>objectif</CTableHeaderCell>
                  <CTableHeaderCell className="text-center border-start">réal.</CTableHeaderCell>
                  <CTableHeaderCell>objectif</CTableHeaderCell>
                  <CTableHeaderCell className="text-center border-start">réal.</CTableHeaderCell>
                  <CTableHeaderCell>objectif</CTableHeaderCell>

                  {/* Mensuel */}
                  <CTableHeaderCell className="border-start bg-body-tertiary">NHO</CTableHeaderCell>
                  <CTableHeaderCell className="bg-body-tertiary">HRM</CTableHeaderCell>
                  <CTableHeaderCell className="bg-body-tertiary">HIM</CTableHeaderCell>
                  <CTableHeaderCell className="bg-body-tertiary">NI</CTableHeaderCell>
                  <CTableHeaderCell className="text-center border-start bg-body-tertiary">
                    réal.
                  </CTableHeaderCell>
                  <CTableHeaderCell className="bg-body-tertiary">objectif</CTableHeaderCell>
                  <CTableHeaderCell className="text-center border-start bg-body-tertiary">
                    réal.
                  </CTableHeaderCell>
                  <CTableHeaderCell className="bg-body-tertiary">objectif</CTableHeaderCell>
                  <CTableHeaderCell className="text-center border-start bg-body-tertiary">
                    réal.
                  </CTableHeaderCell>
                  <CTableHeaderCell className="bg-body-tertiary">objectif</CTableHeaderCell>

                  {/* Annuel */}
                  <CTableHeaderCell className="border-start">NHO</CTableHeaderCell>
                  <CTableHeaderCell>HRM</CTableHeaderCell>
                  <CTableHeaderCell>HIM</CTableHeaderCell>
                  <CTableHeaderCell>NI</CTableHeaderCell>
                  <CTableHeaderCell className="text-center border-start">réal.</CTableHeaderCell>
                  <CTableHeaderCell>objectif</CTableHeaderCell>
                  <CTableHeaderCell className="text-center border-start">réal.</CTableHeaderCell>
                  <CTableHeaderCell>objectif</CTableHeaderCell>
                  <CTableHeaderCell className="text-center border-start">réal.</CTableHeaderCell>
                  <CTableHeaderCell>objectif</CTableHeaderCell>
                </CTableRow>
              </CTableHead>

              <CTableBody>
                {isFetching ? (
                  <CTableRow>
                    <CTableDataCell colSpan={32} className="text-center py-4">
                      <CSpinner size="sm" className="me-2" />
                      Chargement du rapport...
                    </CTableDataCell>
                  </CTableRow>
                ) : filteredData.length > 0 ? (
                  filteredData.map((item, index) => (
                    <CTableRow key={`${item.engin}-${item.siteName}-${index}`}>
                      {/* Identification */}
                      <CTableDataCell>
                        <strong>{item.engin}</strong>
                      </CTableDataCell>
                      <CTableDataCell className="border-end">
                        <CBadge color="info">{item.siteName}</CBadge>
                      </CTableDataCell>

                      {/* Journalier */}
                      <CTableDataCell className="border-start">
                        {formatValue(item.nho_j)}
                      </CTableDataCell>
                      <CTableDataCell>{formatValue(item.hrm_j)}</CTableDataCell>
                      <CTableDataCell>{formatValue(item.him_j)}</CTableDataCell>
                      <CTableDataCell>{formatValue(item.ni_j)}</CTableDataCell>
                      <CTableDataCell className="text-center border-start">
                        <CBadge color={getDispoColor(item.dispo_j, item.objectif_dispo)}>
                          {formatValue(item.dispo_j, 'percent')}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell>{formatValue(item.objectif_dispo, 'percent')}</CTableDataCell>
                      <CTableDataCell className="text-center border-start">
                        {formatValue(item.mtbf_j)}
                      </CTableDataCell>
                      <CTableDataCell>{formatValue(item.objectif_mtbf)}</CTableDataCell>
                      <CTableDataCell className="text-center border-start">
                        {formatValue(item.tdm_j, 'percent')}
                      </CTableDataCell>
                      <CTableDataCell>{formatValue(item.objectif_tdm, 'percent')}</CTableDataCell>

                      {/* Mensuel */}
                      <CTableDataCell className="border-start bg-body-tertiary">
                        {formatValue(item.nho_m)}
                      </CTableDataCell>
                      <CTableDataCell className="bg-body-tertiary">
                        {formatValue(item.hrm_m)}
                      </CTableDataCell>
                      <CTableDataCell className="bg-body-tertiary">
                        {formatValue(item.him_m)}
                      </CTableDataCell>
                      <CTableDataCell className="bg-body-tertiary">
                        {formatValue(item.ni_m)}
                      </CTableDataCell>
                      <CTableDataCell className="text-center border-start bg-body-tertiary">
                        <CBadge color={getDispoColor(item.dispo_m, item.objectif_dispo)}>
                          {formatValue(item.dispo_m, 'percent')}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell className="bg-body-tertiary">
                        {formatValue(item.objectif_dispo, 'percent')}
                      </CTableDataCell>
                      <CTableDataCell className="text-center border-start bg-body-tertiary">
                        {formatValue(item.mtbf_m)}
                      </CTableDataCell>
                      <CTableDataCell className="bg-body-tertiary">
                        {formatValue(item.objectif_mtbf)}
                      </CTableDataCell>
                      <CTableDataCell className="text-center border-start bg-body-tertiary">
                        {formatValue(item.tdm_m, 'percent')}
                      </CTableDataCell>
                      <CTableDataCell className="bg-body-tertiary">
                        {formatValue(item.objectif_tdm, 'percent')}
                      </CTableDataCell>

                      {/* Annuel */}
                      <CTableDataCell className="border-start">
                        {formatValue(item.nho_a)}
                      </CTableDataCell>
                      <CTableDataCell>{formatValue(item.hrm_a)}</CTableDataCell>
                      <CTableDataCell>{formatValue(item.him_a)}</CTableDataCell>
                      <CTableDataCell>{formatValue(item.ni_a)}</CTableDataCell>
                      <CTableDataCell className="text-center border-start">
                        <CBadge color={getDispoColor(item.dispo_a, item.objectif_dispo)}>
                          {formatValue(item.dispo_a, 'percent')}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell>{formatValue(item.objectif_dispo, 'percent')}</CTableDataCell>
                      <CTableDataCell className="text-center border-start">
                        {formatValue(item.mtbf_a)}
                      </CTableDataCell>
                      <CTableDataCell>{formatValue(item.objectif_mtbf)}</CTableDataCell>
                      <CTableDataCell className="text-center border-start">
                        {formatValue(item.tdm_a, 'percent')}
                      </CTableDataCell>
                      <CTableDataCell>{formatValue(item.objectif_tdm, 'percent')}</CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan={32} className="text-center py-4 text-muted">
                      {data?.length === 0 ? (
                        <>Aucune donnée disponible pour la date sélectionnée</>
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

export default RapportRje
