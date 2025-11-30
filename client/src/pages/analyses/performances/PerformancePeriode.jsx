import { useQuery } from '@tanstack/react-query'
import React, { useState, useMemo } from 'react'
import { useParcs } from '../../../hooks/useParcs'
import {
  CAlert,
  CButton,
  CFormInput,
  CFormSelect,
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
} from '@coreui/react'
import { getPerformancesEnginsPeriodeOptions } from '../../../hooks/useRapports'
import { toast } from 'react-toastify'
import { exportExcel } from '../../../helpers/func'
import CIcon from '@coreui/icons-react'
import { cilSearch, cilCloudDownload, cilChart } from '@coreui/icons'

const PerformancePeriode = () => {
  const [dateDu, setDateDu] = useState(new Date().toISOString().split('T')[0])
  const [dateAu, setDateAu] = useState(new Date().toISOString().split('T')[0])
  const [selectedParc, setSelectedParc] = useState('')
  const [selectedParcName, setSelectedParcName] = useState('')
  const [searchByEngin, setSearchByEngin] = useState('')
  const [error, setError] = useState(null)

  // CORRECTION : Utilisation correcte de useQuery
  const getAllParcsQuery = useQuery({
    queryKey: ['parcs'],
    queryFn: useParcs().queryFn, // Adaptez selon votre hook useParcs
  })

  // CORRECTION : Utilisation correcte de useQuery avec enabled
  const getPerformancesEnginsPeriode = useQuery({
    ...getPerformancesEnginsPeriodeOptions(selectedParc, dateDu, dateAu),
    enabled: false, // Ne s'exécute pas automatiquement
  })

  const handleClick = () => {
    setError(null)
    if (dateDu > dateAu) {
      setError('Attention la date Du doit être >= dateAu')
      toast.warn('Attention la date Du doit être >= dateAu')
      return
    }
    getPerformancesEnginsPeriode.refetch()
  }

  const filteredData = useMemo(() => {
    return (
      getPerformancesEnginsPeriode?.data?.filter((item) =>
        item.engin?.toLowerCase().includes(searchByEngin.toLowerCase()),
      ) || []
    )
  }, [getPerformancesEnginsPeriode.data, searchByEngin])

  const hasData =
    !getPerformancesEnginsPeriode.isFetching &&
    !error &&
    selectedParc !== '' &&
    filteredData.length > 0

  return (
    <CCard className="custom-card">
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">
          <CIcon icon={cilChart} className="me-2" />
          Performances des Engins - Période
        </h5>
        <CButton
          disabled={getPerformancesEnginsPeriode.isFetching || !getPerformancesEnginsPeriode?.data}
          onClick={() => exportExcel('tbl_performances_engin_periode', 'Performances par engin')}
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
        <div className="row g-3 mb-4">
          <div className="col-md-3">
            <CFormSelect
              floatingLabel="Choisir un parc"
              value={selectedParc}
              onChange={(e) => {
                setSelectedParc(e.target.value)
                setSelectedParcName(e.target.options[e.target.selectedIndex].text)
              }}
            >
              <option value="">Liste des parcs</option>
              {getAllParcsQuery.data?.map((item, index) => (
                <option key={index} value={item.id}>
                  {item.name}
                </option>
              ))}
            </CFormSelect>
          </div>

          <div className="col-md-2">
            <CFormInput
              type="date"
              floatingLabel="Du"
              value={dateDu}
              onChange={(e) => setDateDu(e.target.value)}
              disabled={getPerformancesEnginsPeriode.isFetching}
            />
          </div>

          <div className="col-md-2">
            <CFormInput
              type="date"
              floatingLabel="Au"
              value={dateAu}
              onChange={(e) => setDateAu(e.target.value)}
              disabled={getPerformancesEnginsPeriode.isFetching}
            />
          </div>

          <div className="col-md-3 d-flex align-items-end">
            <CButton
              disabled={
                getPerformancesEnginsPeriode.isFetching ||
                selectedParc === '' ||
                dateDu === '' ||
                dateAu === ''
              }
              onClick={handleClick}
              color="primary"
              className="w-100"
            >
              <div className="d-flex gap-1 align-items-center justify-content-center">
                {getPerformancesEnginsPeriode.isFetching && <CSpinner size="sm" />}
                <div>Générer le rapport</div>
              </div>
            </CButton>
          </div>
        </div>

        {error && (
          <CAlert color="danger" className="text-center mb-3">
            {error}
          </CAlert>
        )}

        {getPerformancesEnginsPeriode.data && getPerformancesEnginsPeriode.data.length > 0 && (
          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <CInputGroup>
                <CInputGroupText>
                  <CIcon icon={cilSearch} />
                </CInputGroupText>
                <CFormInput
                  placeholder="Rechercher par engin..."
                  value={searchByEngin}
                  onChange={(e) => setSearchByEngin(e.target.value)}
                />
              </CInputGroup>
            </div>
          </div>
        )}

        {hasData && (
          <div className="table-responsive">
            <CTable
              responsive
              striped
              hover
              size="sm"
              className="text-center align-middle"
              id="tbl_performances_engin_periode"
            >
              <CTableHead className="table-light">
                <CTableRow>
                  <CTableHeaderCell>Engin</CTableHeaderCell>
                  <CTableHeaderCell>NHO</CTableHeaderCell>
                  <CTableHeaderCell>HRM</CTableHeaderCell>
                  <CTableHeaderCell>HIM</CTableHeaderCell>
                  <CTableHeaderCell>NI</CTableHeaderCell>
                  <CTableHeaderCell>DISPO</CTableHeaderCell>
                  <CTableHeaderCell>MTBF</CTableHeaderCell>
                  <CTableHeaderCell>UTIL</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredData.map((item, index) => (
                  <CTableRow key={index}>
                    <CTableDataCell className="fw-medium">{item?.engin || 'N/A'}</CTableDataCell>
                    <CTableDataCell>{item?.nho || '0'}</CTableDataCell>
                    <CTableDataCell>{item?.hrm || '0'}</CTableDataCell>
                    <CTableDataCell>{item?.him || '0'}</CTableDataCell>
                    <CTableDataCell>{item?.ni || '0'}</CTableDataCell>
                    <CTableDataCell>
                      <span
                        className={`badge ${(parseFloat(item?.dispo) || 0) > 80 ? 'bg-success' : 'bg-warning'}`}
                      >
                        {item?.dispo || '0'}%
                      </span>
                    </CTableDataCell>
                    <CTableDataCell>{item?.mtbf || '0'}</CTableDataCell>
                    <CTableDataCell>
                      <span
                        className={`badge ${(parseFloat(item?.util) || 0) > 70 ? 'bg-success' : 'bg-info'}`}
                      >
                        {item?.util || '0'}%
                      </span>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
            <div className="text-muted mt-2">{filteredData.length} engin(s) trouvé(s)</div>
          </div>
        )}

        {!getPerformancesEnginsPeriode.isFetching &&
          getPerformancesEnginsPeriode?.data?.length === 0 &&
          !error &&
          selectedParc !== '' && (
            <div className="text-center text-muted py-4">
              <CIcon icon={cilChart} size="xl" className="mb-2" />
              <div>Aucune donnée de performance n'est disponible pour cette période.</div>
            </div>
          )}

        {getPerformancesEnginsPeriode.isFetching && (
          <div className="text-center py-4">
            <CSpinner color="primary" />
            <div className="mt-2">Calcul des performances...</div>
          </div>
        )}
      </CCardBody>
    </CCard>
  )
}

export default PerformancePeriode
