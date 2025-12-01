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
  CInputGroup,
  CInputGroupText,
  CBadge,
  CAlert,
} from '@coreui/react'
import { useQuery } from '@tanstack/react-query'
import React, { useState, useMemo } from 'react'
import { useGetAllSaisieLubrifiantByMonth } from '../../../hooks/useSaisieLubrifiant'
import { exportExcel } from '../../../helpers/func'
import CIcon from '@coreui/icons-react'
import { cilSearch, cilCloudDownload, cilFilter } from '@coreui/icons'

const Ventilation = () => {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 7))
  const [searchEngin, setSearchEngin] = useState('')
  const [searchByParc, setSearchByParc] = useState('')
  const [searchTypeLub, setSearchTypeLub] = useState('')
  const [searchLub, setSearchLub] = useState('')
  const [searchCode, setSearchCode] = useState('')

  // CORRECTION : Syntaxe correcte pour useQuery
  const getVentilationLub = useQuery({
    ...useGetAllSaisieLubrifiantByMonth({ date: `${date}-01` }),
    enabled: false, // Ne s'exécute pas automatiquement
  })

  const handleClick = () => {
    getVentilationLub.refetch()
  }

  // Filtrage optimisé avec useMemo
  const filteredData = useMemo(() => {
    return (
      getVentilationLub?.data?.filter(
        (item) =>
          item.engin?.toLowerCase().includes(searchEngin.toLowerCase()) &&
          item.parc?.toLowerCase().includes(searchByParc.toLowerCase()) &&
          item.type_lubrifiant?.toLowerCase().includes(searchTypeLub.toLowerCase()) &&
          item.lubrifiant?.toLowerCase().includes(searchLub.toLowerCase()) &&
          item.typeconsommation?.toLowerCase().includes(searchCode.toLowerCase()),
      ) || []
    )
  }, [getVentilationLub.data, searchEngin, searchByParc, searchTypeLub, searchLub, searchCode])

  const hasData = !getVentilationLub.isFetching && filteredData.length > 0
  const isEmpty = !getVentilationLub.isFetching && getVentilationLub.data?.length === 0

  return (
    <CCard className="custom-card">
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">
          <CIcon icon={cilFilter} className="me-2" />
          Ventilation des Lubrifiants
        </h5>
        <CButton
          disabled={getVentilationLub.isFetching || !getVentilationLub?.data}
          onClick={() => exportExcel('tbl_rapport_ventilation', 'Ventilation lubrifiants')}
          size="sm"
          color="success"
          variant="outline"
          className="rounded-pill"
        >
          <CIcon icon={cilCloudDownload} className="me-1" />
          Excel
        </CButton>
      </CCardHeader>

      <CCardBody>
        {/* Contrôles de période */}
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <CFormInput
              type="month"
              floatingLabel="Période"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={getVentilationLub.isFetching}
            />
          </div>
          <div className="col-md-4 d-flex align-items-end">
            <CButton
              onClick={handleClick}
              color="primary"
              className="w-100"
              disabled={getVentilationLub.isFetching}
            >
              <div className="d-flex gap-1 align-items-center justify-content-center">
                {getVentilationLub.isFetching && <CSpinner size="sm" />}
                <div>Générer le rapport</div>
              </div>
            </CButton>
          </div>
          <div className="col-md-4 d-flex align-items-end">
            {hasData && (
              <CBadge color="info" className="fs-6 w-100 text-center p-2">
                {filteredData.length} enregistrement(s)
              </CBadge>
            )}
          </div>
        </div>

        {/* Filtres de recherche */}
        {getVentilationLub.data && getVentilationLub.data.length > 0 && (
          <div className="row g-3 mb-4">
            <div className="col-md-2">
              <CInputGroup>
                <CInputGroupText>
                  <CIcon icon={cilSearch} />
                </CInputGroupText>
                <CFormInput
                  placeholder="Engin..."
                  value={searchEngin}
                  onChange={(e) => setSearchEngin(e.target.value)}
                />
              </CInputGroup>
            </div>
            <div className="col-md-2">
              <CInputGroup>
                <CInputGroupText>
                  <CIcon icon={cilSearch} />
                </CInputGroupText>
                <CFormInput
                  placeholder="Parc..."
                  value={searchByParc}
                  onChange={(e) => setSearchByParc(e.target.value)}
                />
              </CInputGroup>
            </div>
            <div className="col-md-2">
              <CInputGroup>
                <CInputGroupText>
                  <CIcon icon={cilSearch} />
                </CInputGroupText>
                <CFormInput
                  placeholder="Type lubrifiant..."
                  value={searchTypeLub}
                  onChange={(e) => setSearchTypeLub(e.target.value)}
                />
              </CInputGroup>
            </div>
            <div className="col-md-2">
              <CInputGroup>
                <CInputGroupText>
                  <CIcon icon={cilSearch} />
                </CInputGroupText>
                <CFormInput
                  placeholder="Lubrifiant..."
                  value={searchLub}
                  onChange={(e) => setSearchLub(e.target.value)}
                />
              </CInputGroup>
            </div>
            <div className="col-md-2">
              <CInputGroup>
                <CInputGroupText>
                  <CIcon icon={cilSearch} />
                </CInputGroupText>
                <CFormInput
                  placeholder="Code..."
                  value={searchCode}
                  onChange={(e) => setSearchCode(e.target.value)}
                />
              </CInputGroup>
            </div>
          </div>
        )}

        {/* Tableau des résultats */}
        {hasData && (
          <div className="table-responsive">
            <CTable
              responsive
              striped
              hover
              size="sm"
              className="text-center align-middle"
              id="tbl_rapport_ventilation"
            >
              <CTableHead className="table-light">
                <CTableRow>
                  <CTableHeaderCell>Date</CTableHeaderCell>
                  <CTableHeaderCell>Engin</CTableHeaderCell>
                  <CTableHeaderCell>Parc</CTableHeaderCell>
                  <CTableHeaderCell>Type Lubrifiant</CTableHeaderCell>
                  <CTableHeaderCell>Lubrifiant</CTableHeaderCell>
                  <CTableHeaderCell>Code</CTableHeaderCell>
                  <CTableHeaderCell>Quantité</CTableHeaderCell>
                  <CTableHeaderCell>Observation</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredData.map((item, index) => (
                  <CTableRow key={index}>
                    <CTableDataCell>{item?.date || 'N/A'}</CTableDataCell>
                    <CTableDataCell className="fw-medium">{item?.engin || 'N/A'}</CTableDataCell>
                    <CTableDataCell>
                      <CBadge color="primary">{item?.parc || 'N/A'}</CBadge>
                    </CTableDataCell>
                    <CTableDataCell>{item?.type_lubrifiant || 'N/A'}</CTableDataCell>
                    <CTableDataCell>{item?.lubrifiant || 'N/A'}</CTableDataCell>
                    <CTableDataCell>
                      <CBadge color="secondary">{item?.typeconsommation || 'N/A'}</CBadge>
                    </CTableDataCell>
                    <CTableDataCell className="fw-bold text-success">
                      {item?.qte || '0'}
                    </CTableDataCell>
                    <CTableDataCell className="text-muted">{item?.obs || 'Aucune'}</CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </div>
        )}

        {/* États vides */}
        {isEmpty && (
          <div className="text-center text-muted py-5">
            <CIcon icon={cilFilter} size="xl" className="mb-3" />
            <h5>Aucune consommation enregistrée</h5>
            <p>Aucune consommation n'est enregistrée pour la période sélectionnée.</p>
          </div>
        )}

        {/* Chargement */}
        {getVentilationLub.isFetching && (
          <div className="text-center py-5">
            <CSpinner color="primary" size="lg" />
            <div className="mt-3">Chargement des données de ventilation...</div>
          </div>
        )}

        {getVentilationLub.isError && (
          <CAlert color="danger" className="text-center">
            {getVentilationLub?.error?.message}
          </CAlert>
        )}
      </CCardBody>
    </CCard>
  )
}

export default Ventilation
