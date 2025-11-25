import { useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'
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
} from '@coreui/react'
import { getIndispoParcPeriodeOptions } from '../../../hooks/useRapports'
import { toast } from 'react-toastify'
import { exportExcel } from '../../../utils/func'

const IndispoParcPeriode = () => {
  const [dateDu, setDateDu] = useState(new Date().toISOString().split('T')[0])
  const [dateAu, setDateAu] = useState(new Date().toISOString().split('T')[0])
  const [selectedParc, setSelectedParc] = useState('')
  const [selectedParcName, setSelectedParcName] = useState('')

  const getAllParcsQuery = useQuery(useParcs())

  const getIndispoParcPeriode = useQuery(getIndispoParcPeriodeOptions(selectedParc, dateDu, dateAu))

  const [error, setError] = useState(null)

  const handleClick = () => {
    setError(null)
    if (dateDu > dateAu) {
      setError('Attention la date Du doit être >= dateAu')
      toast.warn('Attention la date Du doit être >= dateAu')
      return
    }
    getIndispoParcPeriode.refetch()
  }

  // filter data
  const [searchByPanne, setSearchByPanne] = useState('')
  const [searchByTypepanne, setSearchByTypepanne] = useState('')
  const filteredData = getIndispoParcPeriode?.data?.filter(
    (item) =>
      item.panne?.toLowerCase().includes(searchByPanne.toLowerCase()) &&
      item.typepanne?.toLowerCase().includes(searchByTypepanne.toLowerCase()),
  )

  return (
    <div>
      <div className="row text-center">
        <div className="col-sm mb-2">
          <CButton
            disabled={getIndispoParcPeriode.isFetching || !!getIndispoParcPeriode?.data !== true}
            onClick={() =>
              exportExcel('tbl_indispo_parc_periode', "Analyse D'indisponibilité par parc")
            }
            size="sm"
            color="success"
            variant="outline"
            className="rounded-pill"
          >
            Excel
          </CButton>
        </div>

        <div className="col-sm mb-2">
          <CFormSelect
            id="floatingSelect"
            floatingClassName="mb-3"
            floatingLabel="Choisir un parc"
            aria-label="Floating label select example"
            value={selectedParc}
            onChange={(e) => {
              setSelectedParc(e.target.value)
              setSelectedParcName(
                e.target.value !== '' ? e.target.options[e.target.selectedIndex].text : '',
              )
            }}
            // disabled={getParetoIndispParc.isFetching}
          >
            <option value="">Liste des parc</option>
            {getAllParcsQuery.data?.map((item, index) => (
              <option key={index} value={item.id}>
                {item.name}
              </option>
            ))}
          </CFormSelect>
        </div>

        <div className="col-sm mb-2">
          <CFormInput
            type="date"
            id="floatingInputDateDu"
            floatingClassName="mb-3"
            floatingLabel="Du"
            placeholder="Date"
            value={dateDu}
            onChange={(e) => setDateDu(e.target.value)}
            disabled={getIndispoParcPeriode.isFetching}
          />
        </div>

        <div className="col-sm mb-2">
          <CFormInput
            type="date"
            id="floatingInputDateAu"
            floatingClassName="mb-3"
            floatingLabel="Au"
            placeholder="Date"
            value={dateAu}
            onChange={(e) => setDateAu(e.target.value)}
            disabled={getIndispoParcPeriode.isFetching}
          />
        </div>

        <div className="col-sm mb-2">
          <CButton
            disabled={
              getIndispoParcPeriode.isFetching ||
              selectedParc === '' ||
              dateDu === '' ||
              dateAu === ''
            }
            onClick={handleClick}
            size="sm"
            color="secondary"
            variant="outline"
            className="rounded-pill"
          >
            <div className="d-flex gap-1 align-items-center">
              {getIndispoParcPeriode.isFetching && <CSpinner size="sm" />}
              <div> Générer le rapport</div>
            </div>
          </CButton>
        </div>
      </div>

      {error && (
        <div className="d-flex justify-content-center">
          <CAlert color="danger" className="text-center py-2">
            {error}
          </CAlert>
        </div>
      )}

      <div className="row">
        <div className="col-sm mb-2">
          <input
            type="search"
            className="form-control form-control-sm"
            placeholder="Type de panne..."
            value={searchByTypepanne}
            onChange={(e) => setSearchByTypepanne(e.target.value)}
          />
        </div>

        <div className="col-sm mb-2">
          <input
            type="search"
            className="form-control form-control-sm"
            placeholder="Panne..."
            value={searchByPanne}
            onChange={(e) => setSearchByPanne(e.target.value)}
          />
        </div>
      </div>

      {!getIndispoParcPeriode.isFetching &&
        !error &&
        selectedParc !== '' &&
        getIndispoParcPeriode?.data &&
        getIndispoParcPeriode?.data?.length > 0 && (
          <div>
            <CTable
              responsive
              striped
              hover
              size="sm"
              className="text-center text-uppercase"
              id="tbl_indispo_parc_periode"
            >
              <CTableHead>
                <CTableRow>
                  <CTableDataCell colSpan={6} className="text-start">
                    anlayse d'indispo pour le parc {selectedParcName} du{' '}
                    {dateDu.split('-').reverse().join('-')} au{' '}
                    {dateAu.split('-').reverse().join('-')}
                  </CTableDataCell>
                </CTableRow>
              </CTableHead>
              <CTableBody className="text-start">
                <CTableRow>
                  <CTableHeaderCell>TypePanne</CTableHeaderCell>
                  <CTableHeaderCell>Panne</CTableHeaderCell>
                  <CTableHeaderCell>NI</CTableHeaderCell>
                  {/* <CTableHeaderCell>NI_A</CTableHeaderCell> */}
                  <CTableHeaderCell>HIM</CTableHeaderCell>
                  {/* <CTableHeaderCell>HIM_A</CTableHeaderCell> */}
                </CTableRow>

                {filteredData?.map((item, index) => (
                  <CTableRow key={index}>
                    <CTableDataCell>{item?.typepanne}</CTableDataCell>
                    <CTableDataCell>{item?.panne}</CTableDataCell>
                    <CTableDataCell>{item?.ni_m}</CTableDataCell>
                    {/* <CTableDataCell>{item?.ni_a}</CTableDataCell> */}
                    <CTableDataCell>{item?.him_m}</CTableDataCell>
                    {/* <CTableDataCell>{item?.him_a}</CTableDataCell> */}
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </div>
        )}

      {!getIndispoParcPeriode.isFetching && getIndispoParcPeriode?.data?.length === 0 && !error && (
        <>
          <div className="text-center text-primary">
            Aucune données n'est enregistrée pour ce parc à cette période.
          </div>
        </>
      )}

      {getIndispoParcPeriode.isFetching && (
        <>
          <div className="text-center text-primary">
            {getIndispoParcPeriode.isFetching && (
              <div>
                <CSpinner size="sm" /> Chargement...
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default IndispoParcPeriode
