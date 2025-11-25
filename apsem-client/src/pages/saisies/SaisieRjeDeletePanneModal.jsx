import React from 'react'
import useSaisieRjeStore from '../../stores/useSaisieRjeStore'
import { useMutation } from '@tanstack/react-query'
import {
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CSpinner,
} from '@coreui/react'
import { useDeleteSaisiePanne } from '../../hooks/useSaisieRje'

const SaisieRjeDeletePanneModal = () => {
  const { showDeletePanneModal, handleCloseDeletePanneModal, panneToDelete } = useSaisieRjeStore()
  const mutationDeletePanneHRM = useMutation(useDeleteSaisiePanne())
  const onSubmit = (e) => {
    e.preventDefault()
    const data = {
      id: panneToDelete?.id,
    }
    mutationDeletePanneHRM.mutate(data, {
      onSuccess: () => {
        handleCloseDeletePanneModal()
        // handleResetAll()
        toast.success('Supprimé avec succès.')
      },
    })
    // handleCloseDeletePanneModal();
  }
  const isloading = mutationDeletePanneHRM.isPending

  return (
    <div>
      <CModal
        backdrop="static"
        visible={showDeletePanneModal}
        onClose={() => {
          handleCloseDeletePanneModal()
          // handleResetAll()
        }}
        aria-labelledby="StaticBackdropExampleLabel"
      >
        <CModalHeader>
          <CModalTitle id="StaticBackdropExampleLabel">Gestion d'une panne</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="text-center">
            <strong className="text-danger">Voulez-vous supprimer cette panne ?</strong>

            <div className="text-danger d-flex justify-content-center flex-column gap-1 mt-2">
              <span>
                <span className="text-primary">PANNE: </span>
                {panneToDelete?.Panne?.name}
              </span>
              <span>
                <span className="text-primary">HIM:</span> {panneToDelete?.him}
              </span>
              <span>
                <span className="text-primary">NI:</span> {panneToDelete?.ni}
              </span>
              <span>
                <span className="text-primary">TYPE: </span>
                {panneToDelete?.Panne?.Typepanne?.name}
              </span>
            </div>
          </div>
        </CModalBody>

        <CModalFooter className="d-flex gap-1">
          <div className="d-flex justify-content-end">
            <CButton
              disabled={isloading}
              onClick={onSubmit}
              size="sm"
              color="primary"
              variant="outline"
            >
              <div className="d-flex gap-1 align-items-center justify-content-end">
                {isloading && <CSpinner size="sm" />} <span>Supprimer</span>
              </div>
            </CButton>
          </div>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default SaisieRjeDeletePanneModal
