import React, { useState } from 'react'
import { useTypelubrifiants } from '../../hooks/useTypelubrifiants'
import { useQuery } from '@tanstack/react-query'
import { getRapportSpecLubOptions } from '../../hooks/useRapports'
import { CBadge, CButton, CFormInput, CFormSelect, CSpinner, CTable } from '@coreui/react'
import { exportExcel } from '../../utils/func'

const RapportSpecLub = () => {
  const [date, setDate] = useState(new Date().getFullYear())
  // const year = date.split('-')[0] // Extrait l'année
  const year = date // Extrait l'année
  const [selectedTypeLubName, setSelectedTypeLubName] = useState('')

  const [selectedTypelubrifiant, setSelectedTypelubrifiant] = useState('')

  const getAllTypelubrifiantsQuery = useQuery(useTypelubrifiants())

  const getRapportSpecLub = useQuery(getRapportSpecLubOptions(selectedTypelubrifiant, year))

  const handleClick = () => {
    getRapportSpecLub.refetch() // 🔥 Déclenche la requête au clic
  }

  // filter data
  const [searchByParc, setSearchByParc] = useState('')
  const filteredData = getRapportSpecLub?.data?.filter((item) =>
    item.parc?.toLowerCase().includes(searchByParc.toLowerCase()),
  )

  return (
    <div>
      <div className="row text-center">
        <div className="col-sm mb-2">
          <CButton
            disabled={getRapportSpecLub.isFetching || !!getRapportSpecLub?.data !== true}
            onClick={() => exportExcel('tbl_rapport_speclub', 'Rapport Spéc Lub')}
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
            floatingLabel="Choisir un lubrifiant"
            aria-label="Floating label select example"
            value={selectedTypelubrifiant}
            onChange={(e) => {
              setSelectedTypelubrifiant(e.target.value)
              setSelectedTypeLubName(
                e.target.value !== '' ? e.target.options[e.target.selectedIndex].text : '',
              )
            }}
            disabled={getRapportSpecLub.isFetching}
          >
            <option value="">Liste des typelubrifiants</option>
            {getAllTypelubrifiantsQuery.data?.map((item, index) => (
              <option key={index} value={item.id}>
                {item.name}
              </option>
            ))}
          </CFormSelect>
        </div>

        <div className="col-sm mb-2" style={{ maxWidth: '150px' }}>
          <CFormInput
            type="number"
            id="floatingInputDate"
            min={2000}
            max={2040}
            floatingClassName="mb-3"
            floatingLabel="Année"
            placeholder="Année"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            disabled={getRapportSpecLub.isFetching}
          />
        </div>

        <div className="col-sm mb-2">
          <CButton
            disabled={getRapportSpecLub.isFetching || selectedTypelubrifiant == ''}
            onClick={handleClick}
            size="sm"
            color="secondary"
            variant="outline"
            className="rounded-pill"
          >
            <div className="d-flex gap-1 align-items-center">
              {getRapportSpecLub.isFetching && <CSpinner size="sm" />}
              <div> Générer le rapport</div>
            </div>
          </CButton>
        </div>
      </div>

      <div className="row">
        <div className="col-sm mb-2">
          <input
            style={{ maxWidth: '200px' }}
            type="search"
            className="form-control form-control-sm"
            placeholder="Parc..."
            value={searchByParc}
            onChange={(e) => setSearchByParc(e.target.value)}
          />
        </div>
      </div>

      <CTable
        responsive
        striped
        hover
        size="sm"
        className="text-center text-uppercase"
        id="tbl_rapport_speclub"
      >
        <thead>
          <tr>
            <td colSpan={12 * 3 + 6} className="text-start">
              évolution du spécifique
              <CBadge color="info" shape="rounded-pill" className="fw-bold fst-italic mx-2">
                {selectedTypeLubName}
              </CBadge>
              par parc : {/* {date.split('-').reverse().join('-')} */}
              <CBadge textBgColor="light" shape="rounded-pill" className="fw-bold fst-italic mx-2">
                {date}
              </CBadge>
            </td>
          </tr>
          <tr>
            <th colSpan={3}>{year}</th>

            <th colSpan={3}>cumulé</th>

            <th colSpan={3} className="bg-secondary-subtle">
              janvier
            </th>

            <th colSpan={3}>février</th>

            <th colSpan={3} className="bg-secondary-subtle">
              mars
            </th>

            <th colSpan={3}>avril</th>

            <th colSpan={3} className="bg-secondary-subtle">
              mai
            </th>

            <th colSpan={3}>juin</th>

            <th colSpan={3} className="bg-secondary-subtle">
              juillet
            </th>

            <th colSpan={3}>août</th>

            <th colSpan={3} className="bg-secondary-subtle">
              septembre
            </th>

            <th colSpan={3}>octobre</th>

            <th colSpan={3} className="bg-secondary-subtle">
              novembre
            </th>

            <th colSpan={3}>décembre</th>
          </tr>

          <tr>
            <td>Parc</td>
            <td>NBR</td>
            <td>LUB</td>

            <td>HRM</td>
            <td>QTE</td>
            <td>SPE</td>

            <td className="bg-secondary-subtle">HRM</td>
            <td className="bg-secondary-subtle">QTE</td>
            <td className="bg-secondary-subtle">SPE</td>

            <td>HRM</td>
            <td>QTE</td>
            <td>SPE</td>

            <td className="bg-secondary-subtle">HRM</td>
            <td className="bg-secondary-subtle">QTE</td>
            <td className="bg-secondary-subtle">SPE</td>

            <td>HRM</td>
            <td>QTE</td>
            <td>SPE</td>

            <td className="bg-secondary-subtle">HRM</td>
            <td className="bg-secondary-subtle">QTE</td>
            <td className="bg-secondary-subtle">SPE</td>

            <td>HRM</td>
            <td>QTE</td>
            <td>SPE</td>

            <td className="bg-secondary-subtle">HRM</td>
            <td className="bg-secondary-subtle">QTE</td>
            <td className="bg-secondary-subtle">SPE</td>

            <td>HRM</td>
            <td>QTE</td>
            <td>SPE</td>

            <td className="bg-secondary-subtle">HRM</td>
            <td className="bg-secondary-subtle">QTE</td>
            <td className="bg-secondary-subtle">SPE</td>

            <td>HRM</td>
            <td>QTE</td>
            <td>SPE</td>

            <td className="bg-secondary-subtle">HRM</td>
            <td className="bg-secondary-subtle">QTE</td>
            <td className="bg-secondary-subtle">SPE</td>

            <td>HRM</td>
            <td>QTE</td>
            <td>SPE</td>
          </tr>
        </thead>
        <tbody>
          {!getRapportSpecLub.isFetching &&
            filteredData?.map((item, i) => (
              <tr key={i}>
                <td>{item?.parc}</td>
                <td>{item?.nombe_engin}</td>
                <td>{item?.typelubrifiant}</td>

                <td>{item?.hrm_total}</td>
                <td>{item?.qte_total}</td>
                <td>{item?.spec_total}</td>

                <td className="bg-secondary-subtle">{item?.hrm_1}</td>
                <td className="bg-secondary-subtle">{item?.qte_1}</td>
                <td className="bg-secondary-subtle">{item?.spec_1}</td>

                <td>{item?.hrm_2}</td>
                <td>{item?.qte_2}</td>
                <td>{item?.spec_2}</td>

                <td className="bg-secondary-subtle">{item?.hrm_3}</td>
                <td className="bg-secondary-subtle">{item?.qte_3}</td>
                <td className="bg-secondary-subtle">{item?.spec_3}</td>

                <td>{item?.hrm_4}</td>
                <td>{item?.qte_4}</td>
                <td>{item?.spec_4}</td>

                <td className="bg-secondary-subtle">{item?.hrm_5}</td>
                <td className="bg-secondary-subtle">{item?.qte_5}</td>
                <td className="bg-secondary-subtle">{item?.spec_5}</td>

                <td>{item?.hrm_6}</td>
                <td>{item?.qte_6}</td>
                <td>{item?.spec_6}</td>

                <td className="bg-secondary-subtle">{item?.hrm_7}</td>
                <td className="bg-secondary-subtle">{item?.qte_7}</td>
                <td className="bg-secondary-subtle">{item?.spec_7}</td>

                <td>{item?.hrm_8}</td>
                <td>{item?.qte_8}</td>
                <td>{item?.spec_8}</td>

                <td className="bg-secondary-subtle">{item?.hrm_9}</td>
                <td className="bg-secondary-subtle">{item?.qte_9}</td>
                <td className="bg-secondary-subtle">{item?.spec_9}</td>

                <td>{item?.hrm_10}</td>
                <td>{item?.qte_10}</td>
                <td>{item?.spec_10}</td>

                <td className="bg-secondary-subtle">{item?.hrm_11}</td>
                <td className="bg-secondary-subtle">{item?.qte_11}</td>
                <td className="bg-secondary-subtle">{item?.spec_11}</td>

                <td>{item?.hrm_12}</td>
                <td>{item?.qte_12}</td>
                <td>{item?.spec_12}</td>
              </tr>
            ))}

          {getRapportSpecLub.isFetching && (
            <tr>
              <td colSpan={21} className="text-center text-primary">
                {getRapportSpecLub.isFetching && (
                  <div>
                    <CSpinner size="sm" /> Chargement...
                  </div>
                )}
              </td>
            </tr>
          )}
        </tbody>
      </CTable>
    </div>
  )
}

export default RapportSpecLub
