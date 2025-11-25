import React from 'react'
import useSaisieRjeStore from '../../stores/useSaisieRjeStore'
import { CButton, CTableDataCell, CTableRow } from '@coreui/react'
import SaisieRjeTableTotalRow from './SaisieRjeTableTotalRow'

const SaisieRjeTableItems = () => {
  const {
    saisieRjeQueryStore,
    handleShowLubModal,
    handleShowDeletePanneModal,
    setSelectedSaisieHim,
    handleShowEditPanneModal,
  } = useSaisieRjeStore()

  return (
    <>
      {saisieRjeQueryStore.data?.[0].Saisiehim?.map((saisie_him, index) => (
        <CTableRow key={index}>
          <CTableDataCell>
            <CButton
              onClick={() => handleShowEditPanneModal(saisie_him)}
              className="btn btn-sm btn-outline-success rounded-pill me-2"
            >
              <i className="bi bi-pencil"></i>
            </CButton>

            <CButton
              onClick={() => handleShowDeletePanneModal(saisie_him)}
              className="btn btn-sm btn-outline-danger rounded-pill"
              disabled={saisie_him?.Saisielubrifiant?.length > 0}
            >
              <i className="bi bi-trash3"></i>
            </CButton>
            <span> {saisie_him?.Panne?.name}</span>
          </CTableDataCell>
          <CTableDataCell>{saisie_him?.Panne?.Typepanne?.name}</CTableDataCell>
          <CTableDataCell className="text-center">{saisie_him?.him}</CTableDataCell>
          <CTableDataCell className="text-center">{saisie_him?.ni}</CTableDataCell>
          <CTableDataCell className="text-center">
            <CButton
              onClick={() => {
                handleShowLubModal()
                setSelectedSaisieHim(saisie_him)
              }}
              variant="outline-secondary"
              className="rounded-pill"
              size="sm"
              // disabled={disableAddPanneButton}
            >
              {saisie_him?.Saisielubrifiant?.length > 0 ? (
                <i className={`bi bi-droplet-fill me-2`}></i>
              ) : (
                <i className={`bi bi-droplet me-2`}></i>
              )}
              <span>{saisie_him?.Saisielubrifiant?.length}</span>
            </CButton>
          </CTableDataCell>
        </CTableRow>
      ))}
      <SaisieRjeTableTotalRow />
    </>
  )
}

export default SaisieRjeTableItems
