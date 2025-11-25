import {
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
} from '@coreui/react'
import { useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'
import { useGetAllSaisieLubrifiantByMonth } from '../../../hooks/useSaisieLubrifiant'
import { exportExcel } from '../../../utils/func'

const Ventilation = () => {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 7))
  const getVentilationLub = useQuery(useGetAllSaisieLubrifiantByMonth({ date: `${date}-01` }))

  const handleClick = () => {
    getVentilationLub.refetch()
  }

  // filter data
  const [searchEngin, setSearchEngin] = useState('')
  const [searchByParc, setSearchByParc] = useState('')
  const [searchTypeLub, setSearchTypeLub] = useState('')
  const [searchLub, setSearchLub] = useState('')
  const [searchCode, setSearchCode] = useState('')
  const filteredData = getVentilationLub?.data?.filter(
    (item) =>
      item.engin?.toLowerCase().includes(searchEngin.toLowerCase()) &&
      item.parc?.toLowerCase().includes(searchByParc.toLowerCase()) &&
      item.type_lubrifiant?.toLowerCase().includes(searchTypeLub.toLowerCase()) &&
      item.lubrifiant?.toLowerCase().includes(searchLub.toLowerCase()) &&
      item.typeconsommation?.toLowerCase().includes(searchCode.toLowerCase()),
  )

  return (
    <div>
      <div className="d-flex gap-1 align-items-center">
        <div className="">
          <CButton
            // disabled={getAnalyse.isFetching || !!getAnalyse?.data !== true}
            onClick={() => exportExcel('tbl_rapport_ventilation', 'Ventilation lubrifiants')}
            size="sm"
            color="success"
            variant="outline"
            className="rounded-pill mb-3"
          >
            Excel
          </CButton>
        </div>

        <div className="">
          <CFormInput
            type="month"
            id="floatingInputDate"
            floatingClassName="mb-3"
            floatingLabel="Date"
            placeholder="Date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            // disabled={getParetoIndispParc.isFetching}
          />
        </div>

        <div className="mb-3">
          <CButton
            // disabled={getParetoIndispParc.isFetching || selectedParc == ''}
            onClick={handleClick}
            size="sm"
            color="secondary"
            variant="outline"
            className="rounded-pill"
          >
            <div className="d-flex gap-1 align-items-center">
              <div> Générer le rapport</div>
            </div>
          </CButton>
        </div>
      </div>

      <div className="row">
        <div className="col-sm mb-2">
          <input
            type="search"
            className="form-control form-control-sm"
            placeholder="Engin..."
            value={searchEngin}
            onChange={(e) => setSearchEngin(e.target.value)}
          />
        </div>

        <div className="col-sm mb-2">
          <input
            type="search"
            className="form-control form-control-sm"
            placeholder="Parc..."
            value={searchByParc}
            onChange={(e) => setSearchByParc(e.target.value)}
          />
        </div>

        <div className="col-sm mb-2">
          <input
            type="search"
            className="form-control form-control-sm"
            placeholder="TypeLub..."
            value={searchTypeLub}
            onChange={(e) => setSearchTypeLub(e.target.value)}
          />
        </div>

        <div className="col-sm mb-2">
          <input
            type="search"
            className="form-control form-control-sm"
            placeholder="Lub..."
            value={searchLub}
            onChange={(e) => setSearchLub(e.target.value)}
          />
        </div>

        <div className="col-sm mb-2">
          <input
            type="search"
            className="form-control form-control-sm"
            placeholder="Code..."
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
          />
        </div>
      </div>

      <div>
        <CTable
          responsive
          striped
          hover
          size="sm"
          className="text-center text-uppercase"
          id="tbl_rapport_ventilation"
        >
          <CTableHead>
            <CTableRow>
              <CTableDataCell colSpan={7} className="text-start">
                ventilation des lubrifiants du {date.split('-').reverse().join('-')}
              </CTableDataCell>
            </CTableRow>
          </CTableHead>
          <CTableBody className="text-start">
            <CTableRow>
              <CTableHeaderCell>Date</CTableHeaderCell>
              <CTableHeaderCell>Engin</CTableHeaderCell>
              <CTableHeaderCell>Parc</CTableHeaderCell>
              <CTableHeaderCell>TypeLubrifiant</CTableHeaderCell>
              <CTableHeaderCell>Lubrifiant</CTableHeaderCell>
              <CTableHeaderCell>Code</CTableHeaderCell>
              <CTableHeaderCell>Qté</CTableHeaderCell>
              <CTableHeaderCell>Obs</CTableHeaderCell>
            </CTableRow>

            {!getVentilationLub.isFetching &&
              filteredData?.map((item, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{item?.date}</CTableDataCell>
                  <CTableDataCell>{item?.engin}</CTableDataCell>
                  <CTableDataCell>{item?.parc}</CTableDataCell>
                  <CTableDataCell>{item?.type_lubrifiant}</CTableDataCell>
                  <CTableDataCell>{item?.lubrifiant}</CTableDataCell>
                  <CTableDataCell>{item?.typeconsommation}</CTableDataCell>
                  <CTableDataCell>{item?.qte}</CTableDataCell>
                  <CTableDataCell>{item?.obs}</CTableDataCell>
                </CTableRow>
              ))}

            {!getVentilationLub.isFetching && filteredData?.length === 0 && (
              <CTableRow>
                <CTableDataCell colSpan={3} className="text-center text-primary">
                  Aucune consommation n'est enregistrée à cette période.
                </CTableDataCell>
              </CTableRow>
            )}

            {getVentilationLub.isFetching && (
              <CTableRow>
                <CTableDataCell colSpan={3} className="text-center text-primary">
                  {getVentilationLub.isFetching && (
                    <div>
                      <CSpinner size="sm" /> Chargement...
                    </div>
                  )}
                </CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>
        </CTable>
      </div>
    </div>
  )
}

export default Ventilation
