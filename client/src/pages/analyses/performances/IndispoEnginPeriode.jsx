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
import { getIndispoEnginsPeriodeOptions } from '../../../hooks/useRapports'
import { toast } from 'react-toastify'
import { exportExcel } from '../../../helpers/func'
import CIcon from '@coreui/icons-react'
import { cilSearch, cilCloudDownload } from '@coreui/icons'

const IndispoEnginPeriode = () => {
  const [dateDu, setDateDu] = useState(new Date().toISOString().split('T')[0])
  const [dateAu, setDateAu] = useState(new Date().toISOString().split('T')[0])
  const [selectedParc, setSelectedParc] = useState('')
  const [selectedParcName, setSelectedParcName] = useState('')
  const [searchByPanne, setSearchByPanne] = useState('')
  const [searchByTypepanne, setSearchByTypepanne] = useState('')
  const [searchByEngin, setSearchByEngin] = useState('')
  const [error, setError] = useState(null)

  // CORRECTION : Syntaxe correcte pour useQuery
  const getAllParcsQuery = useQuery({
    queryKey: ['parcs'],
    queryFn: useParcs().queryFn, // Adaptez selon votre hook useParcs
  })

  // CORRECTION : Syntaxe correcte pour useQuery avec spread operator
  const getIndispoEnginsPeriode = useQuery({
    ...getIndispoEnginsPeriodeOptions(selectedParc, dateDu, dateAu),
    enabled: false,
  })

  const handleClick = () => {
    setError(null)
    if (dateDu > dateAu) {
      setError('Attention la date Du doit être >= dateAu')
      toast.warn('Attention la date Du doit être >= dateAu')
      return
    }
    getIndispoEnginsPeriode.refetch()
  }

  const filteredData = useMemo(() => {
    return (
      getIndispoEnginsPeriode?.data?.filter(
        (item) =>
          item.panne?.toLowerCase().includes(searchByPanne.toLowerCase()) &&
          item.typepanne?.toLowerCase().includes(searchByTypepanne.toLowerCase()) &&
          item.engin?.toLowerCase().includes(searchByEngin.toLowerCase()),
      ) || []
    )
  }, [getIndispoEnginsPeriode.data, searchByPanne, searchByTypepanne, searchByEngin])

  const hasData =
    !getIndispoEnginsPeriode.isFetching && !error && selectedParc !== '' && filteredData.length > 0

  return (
    <CCard className="custom-card">
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Indisponibilité par Engin - Période</h5>
        <CButton
          disabled={getIndispoEnginsPeriode.isFetching || !getIndispoEnginsPeriode?.data}
          onClick={() =>
            exportExcel('tbl_indispo_engin_periode', "Analyse D'indisponibilité par engin")
          }
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
              disabled={getAllParcsQuery.isLoading}
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
              disabled={getIndispoEnginsPeriode.isFetching}
            />
          </div>

          <div className="col-md-2">
            <CFormInput
              type="date"
              floatingLabel="Au"
              value={dateAu}
              onChange={(e) => setDateAu(e.target.value)}
              disabled={getIndispoEnginsPeriode.isFetching}
            />
          </div>

          <div className="col-md-3 d-flex align-items-end">
            <CButton
              disabled={getIndispoEnginsPeriode.isFetching || !selectedParc || !dateDu || !dateAu}
              onClick={handleClick}
              color="primary"
              className="w-100"
            >
              <div className="d-flex gap-1 align-items-center justify-content-center">
                {getIndispoEnginsPeriode.isFetching && <CSpinner size="sm" />}
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

        {getIndispoEnginsPeriode.data && getIndispoEnginsPeriode.data.length > 0 && (
          <div className="row g-3 mb-3">
            <div className="col-md-4">
              <CInputGroup>
                <CInputGroupText>
                  <CIcon icon={cilSearch} />
                </CInputGroupText>
                <CFormInput
                  placeholder="Engin..."
                  value={searchByEngin}
                  onChange={(e) => setSearchByEngin(e.target.value)}
                />
              </CInputGroup>
            </div>
            <div className="col-md-4">
              <CInputGroup>
                <CInputGroupText>
                  <CIcon icon={cilSearch} />
                </CInputGroupText>
                <CFormInput
                  placeholder="Type de panne..."
                  value={searchByTypepanne}
                  onChange={(e) => setSearchByTypepanne(e.target.value)}
                />
              </CInputGroup>
            </div>
            <div className="col-md-4">
              <CInputGroup>
                <CInputGroupText>
                  <CIcon icon={cilSearch} />
                </CInputGroupText>
                <CFormInput
                  placeholder="Panne..."
                  value={searchByPanne}
                  onChange={(e) => setSearchByPanne(e.target.value)}
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
              className="text-center"
              id="tbl_indispo_engin_periode"
            >
              <CTableHead className="table-light">
                <CTableRow>
                  <CTableHeaderCell>Engin</CTableHeaderCell>
                  <CTableHeaderCell>Type Panne</CTableHeaderCell>
                  <CTableHeaderCell>Panne</CTableHeaderCell>
                  <CTableHeaderCell>NI</CTableHeaderCell>
                  <CTableHeaderCell>HIM</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredData.map((item, index) => (
                  <CTableRow key={index}>
                    <CTableDataCell>{item?.engin || 'N/A'}</CTableDataCell>
                    <CTableDataCell>{item?.typepanne || 'N/A'}</CTableDataCell>
                    <CTableDataCell>{item?.panne || 'N/A'}</CTableDataCell>
                    <CTableDataCell>{item?.ni_m || '0'}</CTableDataCell>
                    <CTableDataCell>{item?.him_m || '0'}</CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
            <div className="text-muted mt-2">
              {filteredData.length} ligne(s) sur {getIndispoEnginsPeriode.data?.length}
            </div>
          </div>
        )}

        {!getIndispoEnginsPeriode.isFetching &&
          getIndispoEnginsPeriode?.data?.length === 0 &&
          !error &&
          selectedParc !== '' && (
            <div className="text-center text-muted py-4">
              <CIcon icon={cilSearch} size="xl" className="mb-2" />
              <div>Aucune donnée n'est enregistrée pour ce parc à cette période.</div>
            </div>
          )}

        {getIndispoEnginsPeriode.isFetching && (
          <div className="text-center py-4">
            <CSpinner color="primary" />
            <div className="mt-2">Chargement des données...</div>
          </div>
        )}
      </CCardBody>
    </CCard>
  )
}

export default IndispoEnginPeriode
