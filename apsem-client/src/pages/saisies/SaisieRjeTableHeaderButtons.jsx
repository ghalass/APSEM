import React from 'react'
import useSaisieRjeStore from '../../stores/useSaisieRjeStore'
import { CButton } from '@coreui/react'
import { cilHistory } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

const SaisieRjeTableHeaderButtons = () => {
  const { selectedFields, saisieRjeQueryStore, handleShowHRMModal, handleShowPanneModal } =
    useSaisieRjeStore()

  // DISABLE ADD PANNE BUTTON WHEN NO HRM AND NO ENGIN SELECTED
  const disableAddPanneButton = !(!!selectedFields.enginId && !!saisieRjeQueryStore?.data?.[0]?.hrm)
  return (
    <div className="d-flex gap-4 justify-content-center mb-2">
      <CButton
        onClick={handleShowPanneModal}
        size="sm"
        color="danger"
        variant="outline"
        className="rounded-pill"
        disabled={disableAddPanneButton}
      >
        <i className="bi bi-cone-striped"></i>
      </CButton>

      <CButton
        onClick={handleShowHRMModal}
        size="sm"
        color="primary"
        variant="outline"
        className="rounded-pill"
        disabled={!selectedFields.enginId}
      >
        <CIcon icon={cilHistory} />
      </CButton>
    </div>
  )
}

export default SaisieRjeTableHeaderButtons
