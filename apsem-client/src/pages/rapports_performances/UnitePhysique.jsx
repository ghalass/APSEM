import React, { useState } from 'react'
import { fecthSitesQuery } from '../../hooks/useSites'
import { useQuery } from '@tanstack/react-query'
import { generateUnitePhysiqueQueryOptions } from '../../hooks/useRapports'
import {
  CButton,
  CFormInput,
  CSpinner,
  CTable,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'

const UnitePhysique = () => {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 7))

  const getAllSitesQuery = useQuery(fecthSitesQuery())

  const generateUnitePhysiqueQuery = useQuery(generateUnitePhysiqueQueryOptions(date))

  const handleClick = () => {
    generateUnitePhysiqueQuery.refetch() // 🔥 Déclenche la requête au clic
  }

  // filter data
  const [searchByParc, setSearchByParc] = useState('')
  const filteredData = generateUnitePhysiqueQuery?.data?.filter((item) =>
    item.parc?.toLowerCase().includes(searchByParc.toLowerCase()),
  )

  return (
    <>
      <div className="row text-center">
        <div className="col-sm mb-2">
          <CButton
            disabled={
              generateUnitePhysiqueQuery.isFetching || !!generateUnitePhysiqueQuery?.data !== true
            }
            onClick={() => exportExcel('tbl_unite_physique', 'Rapport Unité Physique')}
            size="sm"
            color="success"
            variant="outline"
            className="rounded-pill"
          >
            Excel
          </CButton>
        </div>

        <div className="col-sm mb-2">
          <CFormInput
            type="month"
            id="floatingInpuCTableHeaderCellate"
            floatingClassName="mb-3"
            floatingLabel="Date de saisie"
            placeholder="Date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            disabled={generateUnitePhysiqueQuery.isFetching}
          />
        </div>

        <div className="col-sm mb-2">
          <CButton
            disabled={generateUnitePhysiqueQuery.isFetching}
            onClick={handleClick}
            size="sm"
            color="secondary"
            variant="outline"
            className="rounded-pill"
          >
            <div className="d-flex gap-1 align-items-center">
              {generateUnitePhysiqueQuery.isFetching && <CSpinner size="sm" />}
              <div> Générer le rapport</div>
            </div>
          </CButton>
        </div>
      </div>

      <div className="mb-2">
        <input
          style={{ maxWidth: '200px' }}
          type="search"
          className="form-control form-control-sm"
          placeholder="Parc..."
          value={searchByParc}
          onChange={(e) => setSearchByParc(e.target.value)}
        />
      </div>

      <CTable
        responsive
        striped
        hover
        size="sm"
        className="text-center text-uppercase"
        id="tbl_unite_physique"
      >
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell
              colSpan={Number(4 * getAllSitesQuery?.data?.length + 6) || 1}
              className="text-start"
            >
              Unité Physique du {date.split('-').reverse().join('-')}
            </CTableHeaderCell>
          </CTableRow>

          <CTableRow>
            <CTableHeaderCell colSpan={2}></CTableHeaderCell>

            {getAllSitesQuery?.data?.map((site, i) => (
              <CTableHeaderCell
                key={i}
                colSpan={4}
                className={`${(i + 4) % 2 !== 0 && 'bg-secondary-subtle'}`}
              >
                {site?.name}
              </CTableHeaderCell>
            ))}

            <CTableHeaderCell colSpan={4}>TOTAL</CTableHeaderCell>
          </CTableRow>

          <CTableRow>
            <CTableDataCell colSpan={2}></CTableDataCell>

            {getAllSitesQuery?.data?.map((site, i) => (
              <React.Fragment key={i}>
                <td colSpan={2} className={`${(i + 2) % 2 !== 0 && 'bg-secondary-subtle'}`}>
                  HRM
                </td>
                <td colSpan={2} className={`${(i + 2) % 2 !== 0 && 'bg-secondary-subtle'}`}>
                  HIM
                </td>
              </React.Fragment>
            ))}

            <CTableDataCell colSpan={2}>HRM</CTableDataCell>
            <CTableDataCell colSpan={2}>HIM</CTableDataCell>
          </CTableRow>

          <CTableRow>
            <CTableDataCell>Parc</CTableDataCell>
            <CTableDataCell>Nbre</CTableDataCell>

            {getAllSitesQuery.data?.map((site, i) => (
              <React.Fragment key={i}>
                <CTableDataCell className={`${(i + 2) % 2 !== 0 && 'bg-secondary-subtle'}`}>
                  M
                </CTableDataCell>
                <CTableDataCell className={`${(i + 2) % 2 !== 0 && 'bg-secondary-subtle'}`}>
                  A
                </CTableDataCell>
                <CTableDataCell className={`${(i + 2) % 2 !== 0 && 'bg-secondary-subtle'}`}>
                  M
                </CTableDataCell>
                <CTableDataCell className={`${(i + 2) % 2 !== 0 && 'bg-secondary-subtle'}`}>
                  A
                </CTableDataCell>
              </React.Fragment>
            ))}

            <CTableDataCell>M</CTableDataCell>
            <CTableDataCell>A</CTableDataCell>

            <CTableDataCell>M</CTableDataCell>
            <CTableDataCell>A</CTableDataCell>
          </CTableRow>
        </CTableHead>
        <tbody>
          {!generateUnitePhysiqueQuery.isFetching &&
            filteredData?.map((unitePhysique, i) => (
              <CTableRow key={i}>
                <CTableDataCell>{unitePhysique?.parc}</CTableDataCell>
                <CTableDataCell>{unitePhysique?.nombre_d_engin}</CTableDataCell>

                {getAllSitesQuery.data?.map((site, i) => (
                  <React.Fragment key={i}>
                    <CTableDataCell className={`${(i + 2) % 2 !== 0 && 'bg-secondary-subtle'}`}>
                      {unitePhysique.par_site?.map((s, i) => s?.site === site?.name && s?.hrm_m)}
                    </CTableDataCell>
                    <CTableDataCell className={`${(i + 2) % 2 !== 0 && 'bg-secondary-subtle'}`}>
                      {unitePhysique.par_site?.map((s, i) => s?.site === site?.name && s?.hrm_a)}
                    </CTableDataCell>
                    <CTableDataCell className={`${(i + 2) % 2 !== 0 && 'bg-secondary-subtle'}`}>
                      {unitePhysique.par_site?.map((s, i) => s?.site === site?.name && s?.him_m)}
                    </CTableDataCell>
                    <CTableDataCell className={`${(i + 2) % 2 !== 0 && 'bg-secondary-subtle'}`}>
                      {unitePhysique.par_site?.map((s, i) => s?.site === site?.name && s?.him_a)}
                    </CTableDataCell>
                  </React.Fragment>
                ))}

                <CTableDataCell>{unitePhysique?.hrm_m_total}</CTableDataCell>
                <CTableDataCell>{unitePhysique?.hrm_a_total}</CTableDataCell>

                <CTableDataCell>{unitePhysique?.him_m_total}</CTableDataCell>
                <CTableDataCell>{unitePhysique?.him_a_total}</CTableDataCell>
              </CTableRow>
            ))}

          {generateUnitePhysiqueQuery.isFetching && (
            <CTableRow>
              <CTableDataCell
                colSpan={Number(4 * getAllSitesQuery?.data?.length + 6)}
                className="text-center text-primary"
              >
                {generateUnitePhysiqueQuery.isFetching && (
                  <div>
                    <CSpinner size="sm" /> Chargement...
                  </div>
                )}
              </CTableDataCell>
            </CTableRow>
          )}
        </tbody>
      </CTable>
    </>
  )
}

export default UnitePhysique
