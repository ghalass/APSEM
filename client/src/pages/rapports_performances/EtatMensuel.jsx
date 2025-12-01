import React, { useState, useMemo } from 'react'
import { generateEtatMensuelOptions } from '../../hooks/useRapports'
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

const EtatMensuel = () => {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 7))
  const [searchFilters, setSearchFilters] = useState({
    parc: '',
    typeparc: '',
  })

  const { data, isFetching, isError, error, refetch } = useQuery(generateEtatMensuelOptions(date))

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
      exportExcel('tbl_etat_mensuel', `Etat_Mensuel_${date.split('-').reverse().join('-')}`)
    }
  }

  // Statistiques
  const stats = useMemo(() => {
    if (!filteredData.length) return null

    return {
      totalParcs: filteredData.length,
      totalEngins: filteredData.reduce(
        (sum, item) => sum + (parseInt(item.nombre_d_engin) || 0),
        0,
      ),
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
            <h5 className="mb-1">État Mensuel</h5>
            <small className={themeClasses.textMuted}>
              Rapport mensuel de performance par parc et type de parc
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
                  <h6 className={themeClasses.textMuted}>Moy. Dispo Mensuel</h6>
                  <h4 className="text-success mb-0">{stats.moyenneDispoM.toFixed(1)}%</h4>
                </div>
              </CCol>
              <CCol md={3}>
                <div className={`border rounded p-3 text-center ${themeClasses.secondaryBg}`}>
                  <h6 className={themeClasses.textMuted}>Moy. Dispo Annuel</h6>
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
            <CTable responsive striped hover className="align-middle" id="tbl_etat_mensuel">
              <CTableHead className="sticky-top">
                {/* En-tête principal */}
                <CTableRow>
                  <CTableHeaderCell colSpan={23} className={themeClasses.tableHeader}>
                    <div className="d-flex justify-content-between align-items-center">
                      <span>État mensuel du {date.split('-').reverse().join('-')}</span>
                      {filteredData.length > 0 && (
                        <CBadge color="light" className="text-dark">
                          {filteredData.length} parc(s)
                        </CBadge>
                      )}
                    </div>
                  </CTableHeaderCell>
                </CTableRow>

                {/* En-tête des groupes */}
                <CTableRow>
                  <CTableHeaderCell colSpan={3} rowSpan={2} className="align-middle border-end">
                    Identification
                  </CTableHeaderCell>
                  <CTableHeaderCell colSpan={2} className="text-center">
                    NHO
                  </CTableHeaderCell>
                  <CTableHeaderCell colSpan={2} className="text-center bg-body-tertiary">
                    HRM
                  </CTableHeaderCell>
                  <CTableHeaderCell colSpan={2} className="text-center">
                    HIM
                  </CTableHeaderCell>
                  <CTableHeaderCell colSpan={2} className="text-center bg-body-tertiary">
                    NI
                  </CTableHeaderCell>
                  <CTableHeaderCell colSpan={2} className="text-center">
                    HRD
                  </CTableHeaderCell>
                  <CTableHeaderCell colSpan={2} className="text-center bg-body-tertiary">
                    MTTR
                  </CTableHeaderCell>
                  <CTableHeaderCell colSpan={3} className="text-center">
                    DISP
                  </CTableHeaderCell>
                  <CTableHeaderCell colSpan={3} className="text-center bg-body-tertiary">
                    TDM
                  </CTableHeaderCell>
                  <CTableHeaderCell colSpan={3} className="text-center">
                    MTBF
                  </CTableHeaderCell>
                  <CTableHeaderCell colSpan={2} className="text-center bg-body-tertiary">
                    UTIL
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

                  <CTableHeaderCell className="bg-body-tertiary">M</CTableHeaderCell>
                  <CTableHeaderCell className="bg-body-tertiary">A</CTableHeaderCell>

                  <CTableHeaderCell>M</CTableHeaderCell>
                  <CTableHeaderCell>A</CTableHeaderCell>
                  <CTableHeaderCell>Obj</CTableHeaderCell>

                  <CTableHeaderCell className="bg-body-tertiary">M</CTableHeaderCell>
                  <CTableHeaderCell className="bg-body-tertiary">A</CTableHeaderCell>
                  <CTableHeaderCell className="bg-body-tertiary">Obj</CTableHeaderCell>

                  <CTableHeaderCell>M</CTableHeaderCell>
                  <CTableHeaderCell>A</CTableHeaderCell>
                  <CTableHeaderCell>Obj</CTableHeaderCell>

                  <CTableHeaderCell className="bg-body-tertiary">M</CTableHeaderCell>
                  <CTableHeaderCell className="bg-body-tertiary">A</CTableHeaderCell>
                </CTableRow>

                {/* En-tête des colonnes */}
                <CTableRow>
                  <CTableHeaderCell>Type</CTableHeaderCell>
                  <CTableHeaderCell>Parc</CTableHeaderCell>
                  <CTableHeaderCell className="border-end">Engins</CTableHeaderCell>

                  {/* NHO */}
                  <CTableHeaderCell>M</CTableHeaderCell>
                  <CTableHeaderCell>A</CTableHeaderCell>

                  {/* HRM */}
                  <CTableHeaderCell className="bg-body-tertiary">M</CTableHeaderCell>
                  <CTableHeaderCell className="bg-body-tertiary">A</CTableHeaderCell>

                  {/* HIM */}
                  <CTableHeaderCell>M</CTableHeaderCell>
                  <CTableHeaderCell>A</CTableHeaderCell>

                  {/* NI */}
                  <CTableHeaderCell className="bg-body-tertiary">M</CTableHeaderCell>
                  <CTableHeaderCell className="bg-body-tertiary">A</CTableHeaderCell>

                  {/* HRD */}
                  <CTableHeaderCell>M</CTableHeaderCell>
                  <CTableHeaderCell>A</CTableHeaderCell>

                  {/* MTTR */}
                  <CTableHeaderCell className="bg-body-tertiary">M</CTableHeaderCell>
                  <CTableHeaderCell className="bg-body-tertiary">A</CTableHeaderCell>

                  {/* DISP */}
                  <CTableHeaderCell>M</CTableHeaderCell>
                  <CTableHeaderCell>A</CTableHeaderCell>
                  <CTableHeaderCell>Obj</CTableHeaderCell>

                  {/* TDM */}
                  <CTableHeaderCell className="bg-body-tertiary">M</CTableHeaderCell>
                  <CTableHeaderCell className="bg-body-tertiary">A</CTableHeaderCell>
                  <CTableHeaderCell className="bg-body-tertiary">Obj</CTableHeaderCell>

                  {/* MTBF */}
                  <CTableHeaderCell>M</CTableHeaderCell>
                  <CTableHeaderCell>A</CTableHeaderCell>
                  <CTableHeaderCell>Obj</CTableHeaderCell>

                  {/* UTIL */}
                  <CTableHeaderCell className="bg-body-tertiary">M</CTableHeaderCell>
                  <CTableHeaderCell className="bg-body-tertiary">A</CTableHeaderCell>
                </CTableRow>
              </CTableHead>

              <CTableBody>
                {isFetching ? (
                  <CTableRow>
                    <CTableDataCell colSpan={23} className="text-center py-4">
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
                        <strong>{item.parc}</strong>
                      </CTableDataCell>
                      <CTableDataCell className="border-end">
                        <CBadge color="primary">{item.nombre_d_engin}</CBadge>
                      </CTableDataCell>

                      <CTableDataCell>{formatValue(item.nho_m)}</CTableDataCell>
                      <CTableDataCell>{formatValue(item.nho_a)}</CTableDataCell>

                      <CTableDataCell className="bg-body-tertiary">
                        {formatValue(item.hrm_m)}
                      </CTableDataCell>
                      <CTableDataCell className="bg-body-tertiary">
                        {formatValue(item.hrm_a)}
                      </CTableDataCell>

                      <CTableDataCell>{formatValue(item.him_m)}</CTableDataCell>
                      <CTableDataCell>{formatValue(item.him_a)}</CTableDataCell>

                      <CTableDataCell className="bg-body-tertiary">
                        {formatValue(item.ni_m)}
                      </CTableDataCell>
                      <CTableDataCell className="bg-body-tertiary">
                        {formatValue(item.ni_a)}
                      </CTableDataCell>

                      <CTableDataCell>{formatValue(item.hrd_m)}</CTableDataCell>
                      <CTableDataCell>{formatValue(item.hrd_a)}</CTableDataCell>

                      <CTableDataCell className="bg-body-tertiary">
                        {formatValue(item.mttr_m)}
                      </CTableDataCell>
                      <CTableDataCell className="bg-body-tertiary">
                        {formatValue(item.mttr_a)}
                      </CTableDataCell>

                      <CTableDataCell>{formatValue(item.dispo_m, 'percent')}</CTableDataCell>
                      <CTableDataCell>{formatValue(item.dispo_a, 'percent')}</CTableDataCell>
                      <CTableDataCell>{formatValue(item.objectif_dispo, 'percent')}</CTableDataCell>

                      <CTableDataCell className="bg-body-tertiary">
                        {formatValue(item.tdm_m, 'percent')}
                      </CTableDataCell>
                      <CTableDataCell className="bg-body-tertiary">
                        {formatValue(item.tdm_a, 'percent')}
                      </CTableDataCell>
                      <CTableDataCell className="bg-body-tertiary">
                        {formatValue(item.objectif_tdm, 'percent')}
                      </CTableDataCell>

                      <CTableDataCell>{formatValue(item.mtbf_m)}</CTableDataCell>
                      <CTableDataCell>{formatValue(item.mtbf_a)}</CTableDataCell>
                      <CTableDataCell>{formatValue(item.objectif_mtbf)}</CTableDataCell>

                      <CTableDataCell className="bg-body-tertiary">
                        {formatValue(item.util_m, 'percent')}
                      </CTableDataCell>
                      <CTableDataCell className="bg-body-tertiary">
                        {formatValue(item.util_a, 'percent')}
                      </CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan={23} className="text-center py-4 text-muted">
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

export default EtatMensuel
