import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { generateRjeQueryOptions } from '../../hooks/useRapports'
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
} from '@coreui/react'
import { exportExcel } from '../../utils/func'

const RapportRje = () => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  const generateRjeQuery = useQuery(generateRjeQueryOptions(date))

  const handleClick = () => {
    generateRjeQuery.refetch() // 🔥 Déclenche la requête au clic
  }

  // filter data
  const [searchByEngin, setSearchByEngin] = useState('')
  const [searchBySite, setSearchBySite] = useState('')
  const filteredData = generateRjeQuery?.data?.filter(
    (item) =>
      item.engin?.toLowerCase().includes(searchByEngin.toLowerCase()) ||
      item.siteName?.toLowerCase().includes(searchBySite.toLowerCase()),
  )

  return (
    <div>
      <div className="row text-center">
        <div className="col-sm mb-2">
          <CButton
            disabled={generateRjeQuery.isFetching || !!generateRjeQuery?.data !== true}
            onClick={() => exportExcel('tbl_rje', 'Rapport RJE')}
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
            type="date"
            id="floatingInpuCTableHeaderCellate"
            floatingClassName="mb-3"
            floatingLabel="Date de saisie"
            placeholder="Date de saisie"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            disabled={generateRjeQuery.isFetching}
          />
        </div>

        <div className="col-sm mb-2">
          <CButton
            disabled={generateRjeQuery.isFetching}
            onClick={handleClick}
            size="sm"
            color="secondary"
            variant="outline"
            className="rounded-pill"
          >
            <div className="d-flex gap-1 align-items-center">
              {generateRjeQuery.isFetching && <CSpinner size="sm" />}
              <div> Générer le rapport</div>
            </div>
          </CButton>
        </div>
      </div>

      <div className="mb-2">
        <div className="d-flex gap-2">
          <input
            style={{ maxWidth: '200px' }}
            type="search"
            className="form-control form-control-sm"
            placeholder="Engin..."
            value={searchByEngin}
            onChange={(e) => setSearchByEngin(e.target.value)}
          />

          <input
            style={{ maxWidth: '200px' }}
            type="search"
            className="form-control form-control-sm"
            placeholder="Site..."
            value={searchBySite}
            onChange={(e) => setSearchBySite(e.target.value)}
          />
        </div>
      </div>

      <CTable
        responsive
        striped
        hover
        size="sm"
        className="text-center text-uppercase"
        id="tbl_rje"
      >
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell colSpan={22} className="text-start">
              Rapport Journalier Engins RJE du {date.split('-').reverse().join('-')}
            </CTableHeaderCell>
          </CTableRow>

          <CTableRow>
            <CTableHeaderCell colSpan={2}></CTableHeaderCell>

            <CTableHeaderCell className="text-center border-start" colSpan={10}>
              JOURNALIER
            </CTableHeaderCell>

            <CTableHeaderCell className="text-center bg-secondary-subtle" colSpan={10}>
              MENSUEL
            </CTableHeaderCell>

            <CTableHeaderCell className="text-center" colSpan={10}>
              ANNUEL
            </CTableHeaderCell>
          </CTableRow>

          <CTableRow>
            <CTableHeaderCell colSpan={2}></CTableHeaderCell>

            {/* JOURNALIER */}
            <CTableHeaderCell className="text-center border" colSpan={4}></CTableHeaderCell>
            <CTableHeaderCell className="text-center border" colSpan={2}>
              DISP
            </CTableHeaderCell>
            <CTableHeaderCell className="text-center border" colSpan={2}>
              MTBF
            </CTableHeaderCell>
            <CTableHeaderCell className="text-center border" colSpan={2}>
              TDM
            </CTableHeaderCell>

            {/* MENSUEL */}
            <CTableHeaderCell className="text-center" colSpan={4}></CTableHeaderCell>
            <CTableHeaderCell className="text-center border" colSpan={2}>
              DISP
            </CTableHeaderCell>
            <CTableHeaderCell className="text-center border" colSpan={2}>
              MTBF
            </CTableHeaderCell>
            <CTableHeaderCell className="text-center border" colSpan={2}>
              TDM
            </CTableHeaderCell>

            {/* ANNUEL */}
            <CTableHeaderCell className="text-center" colSpan={4}></CTableHeaderCell>
            <CTableHeaderCell className="text-center border" colSpan={2}>
              DISP
            </CTableHeaderCell>
            <CTableHeaderCell className="text-center border" colSpan={2}>
              MTBF
            </CTableHeaderCell>
            <CTableHeaderCell className="text-center border" colSpan={2}>
              TDM
            </CTableHeaderCell>
          </CTableRow>

          <CTableRow>
            <CTableHeaderCell>Engin</CTableHeaderCell>
            <CTableHeaderCell>Site</CTableHeaderCell>

            {/* JOURNALIER */}
            <CTableHeaderCell className="border-start">NHO</CTableHeaderCell>
            <CTableHeaderCell>HRM</CTableHeaderCell>
            <CTableHeaderCell>HIM</CTableHeaderCell>
            <CTableHeaderCell>NI</CTableHeaderCell>

            <CTableHeaderCell className="text-center border-start">réal</CTableHeaderCell>
            <CTableHeaderCell>OBJ</CTableHeaderCell>

            <CTableHeaderCell className="text-center border-start">réal</CTableHeaderCell>
            <CTableHeaderCell>OBJ</CTableHeaderCell>

            <CTableHeaderCell className="text-center border-start">réal</CTableHeaderCell>
            <CTableHeaderCell>OBJ</CTableHeaderCell>

            {/* MENSUEL */}
            <CTableHeaderCell className="bg-secondary-subtle">NHO</CTableHeaderCell>
            <CTableHeaderCell className="bg-secondary-subtle">HRM</CTableHeaderCell>
            <CTableHeaderCell className="bg-secondary-subtle">HIM</CTableHeaderCell>
            <CTableHeaderCell className="bg-secondary-subtle">NI</CTableHeaderCell>

            <CTableHeaderCell className="bg-secondary-subtle">réal</CTableHeaderCell>
            <CTableHeaderCell className="bg-secondary-subtle">Obj</CTableHeaderCell>

            <CTableHeaderCell className="bg-secondary-subtle">réal</CTableHeaderCell>
            <CTableHeaderCell className="bg-secondary-subtle">Obj</CTableHeaderCell>

            <CTableHeaderCell className="bg-secondary-subtle">TDM</CTableHeaderCell>
            <CTableHeaderCell className="bg-secondary-subtle">Obj</CTableHeaderCell>

            {/* ANNUEL */}
            <CTableHeaderCell className="border-start">NHO</CTableHeaderCell>
            <CTableHeaderCell>HRM</CTableHeaderCell>
            <CTableHeaderCell>HIM</CTableHeaderCell>
            <CTableHeaderCell>NI</CTableHeaderCell>

            <CTableHeaderCell className="text-center border-start">réal</CTableHeaderCell>
            <CTableHeaderCell>OBJ</CTableHeaderCell>

            <CTableHeaderCell className="text-center border-start">réal</CTableHeaderCell>
            <CTableHeaderCell>OBJ</CTableHeaderCell>

            <CTableHeaderCell className="text-center border-start">réal</CTableHeaderCell>
            <CTableHeaderCell>OBJ</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody className="text-end">
          {!generateRjeQuery.isFetching &&
            filteredData?.map((r, i) => (
              <CTableRow key={i}>
                <CTableDataCell>{r?.engin}</CTableDataCell>
                <CTableDataCell>{r?.siteName}</CTableDataCell>

                <CTableDataCell className="border-start">{r?.nho_j}</CTableDataCell>
                <CTableDataCell>{r?.hrm_j}</CTableDataCell>
                <CTableDataCell>{r?.him_j}</CTableDataCell>
                <CTableDataCell>{r?.ni_j}</CTableDataCell>

                <CTableDataCell className="text-center border-start">{r?.dispo_j}</CTableDataCell>
                <CTableDataCell>{r?.objectif_dispo}</CTableDataCell>

                <CTableDataCell className="text-center border-start">{r?.mtbf_j}</CTableDataCell>
                <CTableDataCell>{r?.objectif_mtbf}</CTableDataCell>

                <CTableDataCell className="text-center border-start">{r?.tdm_j}</CTableDataCell>
                <CTableDataCell>{r?.objectif_tdm}</CTableDataCell>

                <CTableDataCell className="bg-secondary-subtle">{r?.nho_m}</CTableDataCell>
                <CTableDataCell className="bg-secondary-subtle">{r?.hrm_m}</CTableDataCell>
                <CTableDataCell className="bg-secondary-subtle">{r?.him_m}</CTableDataCell>
                <CTableDataCell className="bg-secondary-subtle">{r?.ni_m}</CTableDataCell>

                <CTableDataCell className="bg-secondary-subtle">{r?.dispo_m}</CTableDataCell>
                <CTableDataCell className="bg-secondary-subtle">{r?.objectif_dispo}</CTableDataCell>

                <CTableDataCell className="bg-secondary-subtle">{r?.mtbf_m}</CTableDataCell>
                <CTableDataCell className="bg-secondary-subtle">{r?.objectif_mtbf}</CTableDataCell>

                <CTableDataCell className="bg-secondary-subtle">{r?.tdm_m}</CTableDataCell>
                <CTableDataCell className="bg-secondary-subtle">{r?.objectif_tdm}</CTableDataCell>

                <CTableDataCell>{r?.nho_a}</CTableDataCell>
                <CTableDataCell>{r?.hrm_a}</CTableDataCell>
                <CTableDataCell>{r?.him_a}</CTableDataCell>
                <CTableDataCell>{r?.ni_a}</CTableDataCell>

                <CTableDataCell>{r?.dispo_a}</CTableDataCell>
                <CTableDataCell>{r?.objectif_dispo}</CTableDataCell>

                <CTableDataCell>{r?.mtbf_a}</CTableDataCell>
                <CTableDataCell>{r?.objectif_mtbf}</CTableDataCell>

                <CTableDataCell>{r?.tdm_a}</CTableDataCell>
                <CTableDataCell>{r?.objectif_tdm}</CTableDataCell>
              </CTableRow>
            ))}

          {generateRjeQuery.isFetching && (
            <CTableRow>
              <CTableDataCell colSpan={23} className="text-center text-primary">
                {generateRjeQuery.isFetching && (
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
  )
}

export default RapportRje
