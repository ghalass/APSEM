import React from 'react'
import useSaisieRjeStore from '../../stores/useSaisieRjeStore'
import { CBadge, CTableDataCell, CTableRow } from '@coreui/react'

const SaisieRjeTableTotalRow = () => {
  const { saisieRjeQueryStore } = useSaisieRjeStore()
  return (
    <>
      <CTableRow className="">
        <CTableDataCell></CTableDataCell>
        <CTableDataCell></CTableDataCell>
        <CTableDataCell className="text-center">
          <CBadge color="danger" shape="rounded-pill">
            {saisieRjeQueryStore.data?.[0].Saisiehim?.reduce(
              (acc, val) => (acc = acc + val?.him),
              0,
            )}
          </CBadge>
        </CTableDataCell>
        <CTableDataCell className="text-center">
          <CBadge color="danger" shape="rounded-pill">
            {saisieRjeQueryStore.data?.[0].Saisiehim?.reduce(
              (acc, val) => (acc = acc + val?.ni),
              0,
            )}
          </CBadge>
        </CTableDataCell>
        <CTableDataCell className="text-center"></CTableDataCell>
      </CTableRow>
    </>
  )
}

export default SaisieRjeTableTotalRow
