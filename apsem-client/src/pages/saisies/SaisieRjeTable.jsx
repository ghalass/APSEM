import {
  CButton,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import React from 'react'
import useSaisieRjeStore from '../../stores/useSaisieRjeStore'
import SaisieRjeTableItems from './SaisieRjeTableItems'

const SaisieRjeTable = () => {
  const { saisieRjeQueryStore } = useSaisieRjeStore()

  const isloading = saisieRjeQueryStore?.isLoading

  return (
    <div className="d-flex justify-content-center mx-auto">
      <CTable responsive striped hover>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell scope="col">Panne</CTableHeaderCell>
            <CTableHeaderCell scope="col">Type</CTableHeaderCell>
            <CTableHeaderCell scope="col">HIM</CTableHeaderCell>
            <CTableHeaderCell scope="col">NI</CTableHeaderCell>
            <CTableHeaderCell scope="col">Lubrifiants</CTableHeaderCell>
          </CTableRow>
        </CTableHead>

        <CTableBody>
          {isloading && (
            <CTableRow>
              <CTableDataCell colSpan={6} className="text-center">
                {isloading && <CSpinner size="sm" />}
              </CTableDataCell>
            </CTableRow>
          )}

          {!isloading && saisieRjeQueryStore?.data?.[0]?.Saisiehim ? (
            <SaisieRjeTableItems />
          ) : (
            <>
              {!isloading && (
                <CTableRow>
                  <CTableDataCell colSpan={6} className="text-center">
                    <h6 className="text-start">Aucune panne n'ai saisie</h6>
                  </CTableDataCell>
                </CTableRow>
              )}
            </>
          )}
        </CTableBody>
      </CTable>
    </div>
  )
}

export default SaisieRjeTable
