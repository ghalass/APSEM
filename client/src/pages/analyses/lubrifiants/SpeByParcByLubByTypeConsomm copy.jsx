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
import { useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'
import { getAnalyseSpcPeriodParcTypeConsommOptions } from '../../../hooks/useRapports'
import { useParcs } from '../../../hooks/useParcs'
import { useTypelubrifiants } from '../../../hooks/useTypelubrifiants'
import ChartCustom from '../../../components/ChartCustom'
import { toast } from 'react-toastify'

const SpeByParcByLubByTypeConsomm = () => {
  const [dateDu, setDateDu] = useState(new Date().toISOString().split('T')[0])
  const [dateAu, setDateAu] = useState(new Date().toISOString().split('T')[0])
  const [selectedParc, setSelectedParc] = useState('')
  const [selectedTypelubrifiant, setSelectedTypelubrifiant] = useState('')

  const getAllParcsQuery = useQuery(useParcs())
  const getAllTypelubrifiantsQuery = useQuery(useTypelubrifiants())

  const getAnalyse = useQuery(
    getAnalyseSpcPeriodParcTypeConsommOptions(selectedParc, dateDu, dateAu, selectedTypelubrifiant),
  )
  const [error, setError] = useState(null)
  const handleClick = () => {
    setError(null)
    const data = {
      dateDu,
      dateAu,
      selectedParc,
      selectedTypelubrifiant,
    }

    if (dateDu > dateAu) {
      setError('Attention la date Du doit être >= dateAu')
      toast.warn('Attention la date Du doit être >= dateAu')
      getAnalyse.reset()
      return
    }
    // console.log(data)
    getAnalyse.refetch()
  }

  return (
    <div>
      <div className="row text-center">
        <div className="col-sm mb-2">
          <CButton
            // disabled={getAnalyse.isFetching || !!getAnalyse?.data !== true}
            // onClick={() => exportExcel('tbl_rapportindispo', "Rapport D'indisponibilité")}
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
              // setSelectedParcName(
              //   e.target.value !== '' ? e.target.options[e.target.selectedIndex].text : '',
              // )
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
          <CFormSelect
            id="floatingSelect"
            floatingClassName="mb-3"
            floatingLabel="Choisir un lubrifiant"
            aria-label="Floating label select example"
            value={selectedTypelubrifiant}
            onChange={(e) => {
              setSelectedTypelubrifiant(e.target.value)
              // setSelectedTypeLubName(
              //   e.target.value !== '' ? e.target.options[e.target.selectedIndex].text : '',
              // )
            }}
            // disabled={getRapportSpecLub.isFetching}
          >
            <option value="">Liste des typelubrifiants</option>
            {getAllTypelubrifiantsQuery.data?.map((item, index) => (
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
            // disabled={getAnalyse.isFetching}
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
            disabled={getAnalyse.isFetching}
          />
        </div>

        <div className="col-sm mb-2">
          <CButton
            disabled={
              getAnalyse.isFetching ||
              selectedParc === '' ||
              dateDu === '' ||
              dateAu === '' ||
              selectedTypelubrifiant === ''
            }
            onClick={handleClick}
            size="sm"
            color="secondary"
            variant="outline"
            className="rounded-pill"
          >
            <div className="d-flex gap-1 align-items-center">
              {getAnalyse.isFetching && <CSpinner size="sm" />}
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

      {!getAnalyse.isFetching &&
        !error &&
        selectedParc !== '' &&
        getAnalyse?.data &&
        getAnalyse?.data?.length > 0 && (
          <div className="row">
            <div className="col-md">
              <CTable
                responsive
                striped
                hover
                size="sm"
                className="text-center text-uppercase"
                id="tbl_heures_chassis"
              >
                <CTableHead>
                  <CTableRow>
                    <CTableDataCell colSpan={6} className="text-start">
                      anlayse causes de consommation lub du {dateDu.split('-').reverse().join('-')}{' '}
                      au {dateAu.split('-').reverse().join('-')}
                    </CTableDataCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody className="text-start">
                  <CTableRow>
                    <CTableHeaderCell>Code</CTableHeaderCell>
                    <CTableHeaderCell>Qté</CTableHeaderCell>
                    <CTableHeaderCell>%</CTableHeaderCell>
                  </CTableRow>

                  {getAnalyse?.data?.map((item, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell>{item?.name}</CTableDataCell>
                      <CTableDataCell>{item?.sum}</CTableDataCell>
                      <CTableDataCell>{item?.percentage}</CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </div>
            <div className="col-md">
              {!getAnalyse.isFetching &&
                !error &&
                selectedParc !== '' &&
                getAnalyse?.data &&
                getAnalyse?.data?.length > 0 && (
                  // <ChartCustom
                  //   data={getAnalyse?.data}
                  //   xDataKey={'name'}
                  //   barDataKey={'percentage'}
                  //   type="bar"
                  // />
                  <ChartCustom
                    data={getAnalyse?.data}
                    xDataKey="name"
                    barDataKeys={['percentage']} // Multiple lines or bars
                    type="bar" // or "bar" depending on the type of chart you want
                  />
                )}
            </div>
          </div>
        )}

      {!getAnalyse.isFetching && getAnalyse?.data?.length === 0 && !error && (
        <>
          <div className="text-center text-primary">
            Aucune consommation n'est enregistrée pour ce parc à cette période.
          </div>
        </>
      )}

      {getAnalyse.isFetching && (
        <>
          <div className="text-center text-primary">
            {getAnalyse.isFetching && (
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

export default SpeByParcByLubByTypeConsomm
