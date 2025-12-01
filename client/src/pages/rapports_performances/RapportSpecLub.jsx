import React, { useState, useMemo } from 'react'
import { useTypelubrifiants } from '../../hooks/useTypelubrifiants'
import { useQuery } from '@tanstack/react-query'
import { getRapportSpecLubOptions } from '../../hooks/useRapports'
import {
  CBadge,
  CButton,
  CFormInput,
  CFormSelect,
  CSpinner,
  CTable,
  CCard,
  CCardBody,
  CCardHeader,
  CInputGroup,
  CInputGroupText,
  CRow,
  CCol,
  CAlert,
} from '@coreui/react'
import { exportExcel } from '../../helpers/func'
import CIcon from '@coreui/icons-react'
import { cilSearch, cilCloudDownload, cilChart } from '@coreui/icons'

const RapportSpecLub = () => {
  const currentYear = new Date().getFullYear()
  const [date, setDate] = useState(currentYear)
  const [selectedTypelubrifiant, setSelectedTypelubrifiant] = useState('')
  const [selectedTypeLubName, setSelectedTypeLubName] = useState('')
  const [searchByParc, setSearchByParc] = useState('')

  // CORRECTION : Syntaxe correcte pour useQuery
  const getAllTypelubrifiantsQuery = useQuery({
    queryKey: ['typelubrifiants'],
    queryFn: useTypelubrifiants().queryFn,
  })

  // CORRECTION : Syntaxe correcte pour useQuery
  const getRapportSpecLub = useQuery({
    ...getRapportSpecLubOptions(selectedTypelubrifiant, date),
    enabled: false,
  })

  const handleClick = () => {
    getRapportSpecLub.refetch()
  }

  // Filtrage optimisé avec useMemo
  const filteredData = useMemo(() => {
    return (
      getRapportSpecLub?.data?.filter((item) =>
        item.parc?.toLowerCase().includes(searchByParc.toLowerCase()),
      ) || []
    )
  }, [getRapportSpecLub.data, searchByParc])

  const hasData =
    !getRapportSpecLub.isFetching && selectedTypelubrifiant !== '' && filteredData.length > 0

  const months = [
    'janvier',
    'février',
    'mars',
    'avril',
    'mai',
    'juin',
    'juillet',
    'août',
    'septembre',
    'octobre',
    'novembre',
    'décembre',
  ]

  // Fonction pour obtenir la classe adaptative CoreUI
  const getAdaptiveClass = (isEven = false) => {
    return isEven ? 'table-secondary' : ''
  }

  const renderMonthHeader = (monthIndex, isEven = false) => (
    <th key={monthIndex} colSpan={3} className={getAdaptiveClass(isEven)}>
      {months[monthIndex]}
    </th>
  )

  const renderMonthSubHeaders = (isEven = false, index) => (
    <React.Fragment key={`subheaders-${index}`}>
      <th className={getAdaptiveClass(isEven)}>HRM</th>
      <th className={getAdaptiveClass(isEven)}>QTE</th>
      <th className={getAdaptiveClass(isEven)}>SPE</th>
    </React.Fragment>
  )

  const renderMonthData = (item, monthIndex, isEven = false) => (
    <React.Fragment key={monthIndex}>
      <td className={getAdaptiveClass(isEven)}>{item?.[`hrm_${monthIndex + 1}`] || '0'}</td>
      <td className={getAdaptiveClass(isEven)}>{item?.[`qte_${monthIndex + 1}`] || '0'}</td>
      <td className={getAdaptiveClass(isEven)}>
        <CBadge color={item?.[`spec_${monthIndex + 1}`] > 0 ? 'success' : 'secondary'}>
          {item?.[`spec_${monthIndex + 1}`] || '0'}
        </CBadge>
      </td>
    </React.Fragment>
  )

  return (
    <CCard>
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <CIcon icon={cilChart} className="me-2" />
          <h5 className="mb-0">Évolution du Spécifique par Parc</h5>
        </div>
        <CButton
          disabled={getRapportSpecLub.isFetching || !getRapportSpecLub?.data}
          onClick={() => exportExcel('tbl_rapport_speclub', 'Rapport Spécifique Lubrifiant')}
          color="success"
          variant="outline"
          size="sm"
        >
          <CIcon icon={cilCloudDownload} className="me-1" />
          Excel
        </CButton>
      </CCardHeader>

      <CCardBody>
        {/* Contrôles de filtre */}
        <CRow className="g-3 mb-4">
          <CCol md={4}>
            <CFormSelect
              label="Choisir un lubrifiant"
              value={selectedTypelubrifiant}
              onChange={(e) => {
                setSelectedTypelubrifiant(e.target.value)
                setSelectedTypeLubName(
                  e.target.value !== '' ? e.target.options[e.target.selectedIndex].text : '',
                )
              }}
              disabled={getAllTypelubrifiantsQuery.isLoading || getRapportSpecLub.isFetching}
              options={[
                { value: '', label: 'Liste des typelubrifiants', disabled: true },
                ...(getAllTypelubrifiantsQuery.data?.map((item) => ({
                  value: item.id,
                  label: item.name,
                })) || []),
              ]}
            />
          </CCol>

          <CCol md={2}>
            <CFormInput
              type="number"
              label="Année"
              min={2000}
              max={2040}
              value={date}
              onChange={(e) => setDate(parseInt(e.target.value) || currentYear)}
              disabled={getRapportSpecLub.isFetching}
            />
          </CCol>

          <CCol md={4}>
            {getRapportSpecLub.data && getRapportSpecLub.data.length > 0 && (
              <CInputGroup>
                <CInputGroupText>
                  <CIcon icon={cilSearch} />
                </CInputGroupText>
                <CFormInput
                  placeholder="Filtrer par parc..."
                  value={searchByParc}
                  onChange={(e) => setSearchByParc(e.target.value)}
                />
              </CInputGroup>
            )}
          </CCol>

          <CCol md={2} className="d-flex align-items-end">
            <CButton
              disabled={getRapportSpecLub.isFetching || !selectedTypelubrifiant}
              onClick={handleClick}
              color="primary"
              className="w-100"
            >
              {getRapportSpecLub.isFetching ? <CSpinner size="sm" /> : 'Générer'}
            </CButton>
          </CCol>
        </CRow>

        {/* Résumé informatif */}
        {selectedTypeLubName && (
          <CAlert color="info" className="mb-4">
            <div className="d-flex justify-content-between align-items-center">
              <span>
                Évolution du spécifique <strong>{selectedTypeLubName}</strong> pour l'année{' '}
                <strong>{date}</strong>
              </span>
              {filteredData.length > 0 && (
                <CBadge color="info" shape="rounded-pill">
                  {filteredData.length} parc(s)
                </CBadge>
              )}
            </div>
          </CAlert>
        )}

        {/* Tableau des résultats */}
        {hasData && (
          <div className="table-responsive">
            <CTable
              responsive
              striped
              hover
              bordered
              size="sm"
              className="text-center align-middle"
              id="tbl_rapport_speclub"
            >
              <thead>
                {/* Ligne 1 : Année et mois */}
                <tr>
                  <th colSpan={3} className="bg-primary text-white">
                    {date}
                  </th>
                  <th colSpan={3} className="bg-success text-white">
                    Cumulé
                  </th>
                  {months.map((month, index) => renderMonthHeader(index, index % 2 === 0))}
                </tr>

                {/* Ligne 2 : En-têtes détaillés */}
                <tr>
                  <th>Parc</th>
                  <th>NBR</th>
                  <th>LUB</th>

                  <th>HRM</th>
                  <th>QTE</th>
                  <th>SPE</th>

                  {/* En-têtes des mois */}
                  {Array.from({ length: 12 }).map((_, index) =>
                    renderMonthSubHeaders(index % 2 === 0, index),
                  )}
                </tr>
              </thead>

              <tbody>
                {filteredData.map((item, i) => (
                  <tr key={i}>
                    {/* Données fixes */}
                    <td className="fw-semibold">
                      <CBadge color="primary">{item?.parc || 'N/A'}</CBadge>
                    </td>
                    <td>{item?.nombe_engin || '0'}</td>
                    <td className="text-body-secondary">{item?.typelubrifiant || 'N/A'}</td>

                    {/* Données cumulées */}
                    <td className="fw-bold text-primary">{item?.hrm_total || '0'}</td>
                    <td className="fw-bold text-success">{item?.qte_total || '0'}</td>
                    <td>
                      <CBadge color={item?.spec_total > 0 ? 'success' : 'secondary'}>
                        {item?.spec_total || '0'}
                      </CBadge>
                    </td>

                    {/* Données mensuelles */}
                    {Array.from({ length: 12 }).map((_, index) =>
                      renderMonthData(item, index, index % 2 === 0),
                    )}
                  </tr>
                ))}
              </tbody>
            </CTable>

            {/* Résumé du tableau */}
            <div className="mt-3 text-body-secondary small">
              Affichage de {filteredData.length} parc(s) sur {getRapportSpecLub.data?.length}
              {searchByParc && ` (filtré par "${searchByParc}")`}
            </div>
          </div>
        )}

        {/* États vides */}
        {!getRapportSpecLub.isFetching &&
          selectedTypelubrifiant !== '' &&
          getRapportSpecLub?.data?.length === 0 && (
            <div className="text-center py-5">
              <CIcon icon={cilChart} size="xl" className="mb-3 text-body-secondary" />
              <h5 className="text-body">Aucune donnée disponible</h5>
              <p className="text-body-secondary">
                Aucune donnée de spécifique n'est enregistrée pour {selectedTypeLubName} en {date}.
              </p>
            </div>
          )}

        {/* Message de sélection */}
        {!getRapportSpecLub.isFetching && !selectedTypelubrifiant && (
          <div className="text-center py-5">
            <CIcon icon={cilChart} size="xl" className="mb-3 text-body-secondary" />
            <h5 className="text-body">Sélectionnez un lubrifiant</h5>
            <p className="text-body-secondary">
              Veuillez sélectionner un lubrifiant et une année pour générer le rapport.
            </p>
          </div>
        )}

        {/* Chargement */}
        {getRapportSpecLub.isFetching && (
          <div className="text-center py-5">
            <CSpinner color="primary" />
            <div className="mt-3 text-body">Calcul des spécifiques en cours...</div>
          </div>
        )}
      </CCardBody>
    </CCard>
  )
}

export default RapportSpecLub
