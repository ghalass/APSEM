import React, { useState } from 'react'
import { useGetSaisieHrmDay } from '../../hooks/useSaisieRje'
import { useQuery } from '@tanstack/react-query'
import { CButton, CFormInput, CSpinner, CTable } from '@coreui/react'
import { exportExcel } from '../../utils/func'

const SaisieRjeDonnees = () => {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 7))
  const getSaisieHrmDay = useQuery(useGetSaisieHrmDay(date))

  const [searchByTypeparc, setSearchByTypeparc] = useState('')
  const [searchByParc, setSearchByParc] = useState('')
  const [searchByEngin, setSearchByEngin] = useState('')
  const [searchBySite, setSearchBySite] = useState('')

  const handleClick = () => {
    getSaisieHrmDay.refetch()
  }

  const filteredData = getSaisieHrmDay?.data?.filter(
    (item) =>
      item.typeparc?.toLowerCase().includes(searchByTypeparc.toLowerCase()) &&
      item.parc?.toLowerCase().includes(searchByParc.toLowerCase()) &&
      item.engin?.toLowerCase().includes(searchByEngin.toLowerCase()) &&
      item.site?.toLowerCase().includes(searchBySite.toLowerCase()),
  )

  return (
    <div>
      <div className="row text-center">
        <div className="col-sm mb-2">
          <CButton
            disabled={getSaisieHrmDay.isFetching || !!filteredData !== true}
            onClick={() => exportExcel('tbl_donnees_saisies', 'Données saisies')}
            size="sm"
            color="success"
            variant="outline"
            className="rounded-pill"
          >
            Excel
          </CButton>
        </div>

        <div className="col-sm mb-2 ">
          <CFormInput
            type="month"
            id="floatingInputDate"
            floatingClassName=""
            floatingLabel="Date de saisie"
            placeholder="pg11"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            disabled={getSaisieHrmDay.isFetching}
          />
        </div>

        <div className="col-sm mb-2">
          <CButton
            disabled={getSaisieHrmDay.isFetching}
            onClick={handleClick}
            size="sm"
            color="secondary"
            variant="outline"
            className="rounded-pill"
          >
            <div className="d-flex gap-1 align-items-center">
              {getSaisieHrmDay.isFetching && <CSpinner size="sm" />}
              <div> Générer le rapport</div>
            </div>
          </CButton>
        </div>
      </div>

      <div className="row text-center">
        <div className="col-sm mb-2">
          <input
            type="search"
            className="form-control form-control-sm"
            placeholder="Typeparc..."
            value={searchByTypeparc}
            onChange={(e) => setSearchByTypeparc(e.target.value)}
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
            placeholder="Engin..."
            value={searchByEngin}
            onChange={(e) => setSearchByEngin(e.target.value)}
          />
        </div>

        <div className="col-sm mb-2">
          <input
            type="search"
            className="form-control form-control-sm"
            placeholder="Site..."
            value={searchBySite}
            onChange={(e) => setSearchBySite(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-scroll" style={{ maxHeight: '500px' }}>
        <CTable
          responsive
          striped
          hover
          size="sm"
          className="text-center text-uppercase "
          id="tbl_donnees_saisies"
        >
          <thead>
            <tr>
              <td colSpan={10} className="text-start">
                les données hrm/him saisies pour la journée du {date.split('-').reverse().join('-')}
              </td>
            </tr>

            <tr>
              <th>Date</th>
              <th>Typeparc</th>
              <th>Parc</th>
              <th>Engin</th>
              <th>Site</th>
              <th>HRM</th>
              <th>Panne</th>
              <th>HIM</th>
              <th>NI</th>
              <th>LUB</th>
            </tr>
          </thead>
          <tbody>
            {!getSaisieHrmDay.isFetching &&
              filteredData?.map((r, i) => (
                <tr key={i}>
                  <td>{r?.date.split('-').reverse().join('-')}</td>
                  <td>{r?.typeparc}</td>
                  <td>{r?.parc}</td>
                  <td>{r?.engin}</td>
                  <td>{r?.site}</td>
                  <td>{r?.hrm}</td>
                  <td className="text-start">{r?.panne}</td>
                  <td>{r?.him}</td>
                  <td>{r?.ni}</td>
                  <td>
                    {r?.lubrifiants?.map((lub, j) => (
                      <span key={j}>
                        {lub?.name} ({lub?.qte}) |{' '}
                      </span>
                    ))}
                  </td>
                </tr>
              ))}

            {getSaisieHrmDay.isFetching && (
              <tr>
                <td colSpan={10} className="text-center text-primary">
                  <CSpinner size="sm" /> Chargement...
                </td>
              </tr>
            )}
          </tbody>
        </CTable>
      </div>
    </div>
  )
}

export default SaisieRjeDonnees
