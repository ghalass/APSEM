import React, { useState } from 'react'
import { getParetoIndispParcOptions, getParetoMtbfParcOptions } from '../../hooks/useRapports'
import { useQuery } from '@tanstack/react-query'
import { CButton, CFormInput, CFormSelect, CSpinner, CTable } from '@coreui/react'
import { useParcs } from '../../hooks/useParcs'
import ChartCustom from '../../components/ChartCustom'

const ParetosInDispo = () => {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 7))
  const [selectedParc, setSelectedParc] = useState('')
  const [selectedParcName, setSelectedParcName] = useState('')

  const getAllParcsQuery = useQuery(useParcs())

  const getParetoIndispParc = useQuery(getParetoIndispParcOptions(selectedParc, date))
  const getParetoMtbfParc = useQuery(getParetoMtbfParcOptions(selectedParc, date))

  const handleClick = () => {
    getParetoIndispParc.refetch()
    getParetoMtbfParc.refetch()
  }
  return (
    <div>
      <div className="row text-center">
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
            disabled={getParetoIndispParc.isFetching}
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
            type="month"
            id="floatingInputDate"
            floatingClassName="mb-3"
            floatingLabel="Date"
            placeholder="Date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            disabled={getParetoIndispParc.isFetching}
          />
        </div>

        <div className="col-sm mb-2">
          <CButton
            disabled={getParetoIndispParc.isFetching || selectedParc == ''}
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
        <div className="col-lg">
          <div className="d-flex flex-column">
            <div>
              <h6 className="text-center text-uppercase">
                pareto indispo du parc {selectedParcName} au mois :{' '}
                {date.split('-').reverse().join('-')}
              </h6>
              {getParetoIndispParc.isFetching && (
                <div className="text-center text-primary">
                  <CSpinner size="sm" />
                </div>
              )}
              {!getParetoIndispParc.isFetching &&
              selectedParc !== '' &&
              getParetoIndispParc?.data &&
              getParetoIndispParc?.data?.length > 0 ? (
                // <ChartCustom
                //   data={getParetoIndispParc?.data?.slice(0, 10)}
                //   xDataKey={'panne'}
                //   barDataKey={'indispo'}
                // />

                <ChartCustom
                  data={getParetoIndispParc?.data?.slice(0, 10)}
                  xDataKey="panne"
                  barDataKeys={['indispo']} // Multiple lines or bars
                  type="bar" // or "bar" depending on the type of chart you want
                />
              ) : (
                <h6 className="text-center">
                  {selectedParc !== '' && "Aucune pannes n'est trouvées pour ce parc à cette date."}
                </h6>
              )}
            </div>

            <div>
              {!getParetoIndispParc.isFetching && (
                <CTable responsive striped hover size="sm" className="text-center text-uppercase">
                  <thead>
                    {selectedParc !== '' &&
                      getParetoIndispParc?.data &&
                      getParetoIndispParc?.data?.length > 0 && (
                        <tr>
                          <td colSpan={11}>les 10 engins le plus affectés [HIM]</td>
                        </tr>
                      )}
                  </thead>
                  <tbody>
                    {selectedParc !== '' &&
                      getParetoIndispParc?.data &&
                      getParetoIndispParc?.data?.length > 0 &&
                      getParetoIndispParc?.data?.slice(0, 9).map((panneObj, k) => (
                        <tr key={k}>
                          <td>{panneObj?.panne}</td>
                          {panneObj?.engins &&
                            panneObj?.engins?.length > 0 &&
                            panneObj?.engins?.map((e, r) => (
                              <td key={r}>
                                {e?.him !== 0 ? e?.name + ' ( ' + e?.him + ' ) ' : ''}
                              </td>
                            ))}
                        </tr>
                      ))}
                  </tbody>
                </CTable>
              )}
            </div>
          </div>
        </div>

        <div className="col-sm">
          <div className="d-flex flex-column">
            <h6 className="text-center text-uppercase">
              évolution mtbf du parc {selectedParcName} au mois :{' '}
              {date.split('-').reverse().join('-')}
            </h6>

            {!getParetoIndispParc.isFetching &&
              selectedParc !== '' &&
              getParetoMtbfParc?.data &&
              getParetoMtbfParc?.data?.length > 0 && (
                // <ChartCustom
                //   data={getParetoMtbfParc?.data}
                //   xDataKey={'mois'}
                //   barDataKey={'mtbf'}
                //   type="line"
                // />
                <ChartCustom
                  data={getParetoMtbfParc?.data}
                  xDataKey="mois"
                  barDataKeys={['mtbf', 'objectif_mtbf']} // Multiple lines or bars
                  type="line" // or "bar" depending on the type of chart you want
                />
              )}
          </div>

          <div>
            {getParetoIndispParc.isFetching && (
              <div className="text-center text-primary">
                <CSpinner size="sm" />
              </div>
            )}

            {!getParetoIndispParc.isFetching && (
              <CTable
                responsive
                striped
                bordered
                hover
                size="sm"
                className="text-center text-uppercase"
              >
                <thead>
                  {selectedParc !== '' &&
                    getParetoIndispParc?.data &&
                    getParetoIndispParc?.data?.length > 0 && (
                      <tr>
                        <td colSpan={11}>les 10 engins le plus affectés [NI]</td>
                      </tr>
                    )}
                </thead>
                <tbody>
                  {selectedParc !== '' &&
                    getParetoIndispParc?.data &&
                    getParetoIndispParc?.data?.length > 0 &&
                    getParetoIndispParc?.data?.slice(0, 9).map((panneObj, k) => (
                      <tr key={k}>
                        <td>{panneObj?.panne}</td>
                        {panneObj?.engins_mtbf &&
                          panneObj?.engins_mtbf?.length > 0 &&
                          panneObj?.engins_mtbf?.map((e, r) => (
                            <td key={r}>{e?.ni !== 0 ? e?.name + ' ( ' + e?.ni + ' ) ' : ''}</td>
                          ))}
                      </tr>
                    ))}
                </tbody>
              </CTable>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ParetosInDispo
