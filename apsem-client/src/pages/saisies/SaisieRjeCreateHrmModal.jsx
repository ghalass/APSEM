import {
  CAlert,
  CButton,
  CFormInput,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CSpinner,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import useSaisieRjeStore from '../../stores/useSaisieRjeStore'
import { useMutation } from '@tanstack/react-query'
import { upsetHRMQueryOptions } from '../../hooks/useSaisieRje'
import { toast } from 'react-toastify'

const SaisieRjeCreateHrmModal = () => {
  const { hrm, setHrm, saisieRjeQueryStore, showHRMModal, handleCloseHRMModal, selectedFields } =
    useSaisieRjeStore()

  const [error, setError] = useState('')

  const mutationUpsetHRM = useMutation(upsetHRMQueryOptions(handleCloseHRMModal))

  // RESET INITIAL VALUES WHEN SHOW/HIDE MODAL OR DATA CHANGED
  useEffect(() => {
    setError('')
    setHrm(saisieRjeQueryStore?.data?.[0]?.hrm)
    mutationUpsetHRM.reset()
  }, [showHRMModal, saisieRjeQueryStore?.data])

  const handleSubmit = (e) => {
    setError('')
    e.preventDefault()

    if (!hrm || isNaN(hrm)) {
      console.log('error')

      setError("HRM Saisie n'est pas valide")
      return
    }

    const upsetHRM = {
      id: saisieRjeQueryStore.data?.[0]?.id || '',
      du: saisieRjeQueryStore.data?.[0]?.du || selectedFields?.du,
      enginId: saisieRjeQueryStore.data?.[0]?.enginId || selectedFields?.enginId,
      siteId: saisieRjeQueryStore.data?.[0]?.siteId || selectedFields?.siteId,
      hrm: hrm,
    }
    mutationUpsetHRM.mutate(upsetHRM, {
      onSuccess: () => {
        handleCloseHRMModal()
        handleResetAll()
        toast.success('Ajouté avec succès.')
      },
    })
  }

  const handleResetAll = () => {
    setHrm('')
    mutationUpsetHRM.reset()
  }

  return (
    <CModal
      backdrop="static"
      visible={showHRMModal}
      onClose={() => {
        handleCloseHRMModal()
        handleResetAll()
      }}
      aria-labelledby="StaticBackdropExampleLabel"
    >
      <CModalHeader>
        <CModalTitle id="StaticBackdropExampleLabel">Gestion HRM</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CFormInput
          type="number"
          id="floatingInputName"
          step="0.5"
          min={0}
          max={24}
          floatingClassName="mb-3"
          floatingLabel="HRM"
          placeholder="HRM"
          value={hrm || ''}
          onChange={(e) => setHrm(e.target.value)}
          disabled={mutationUpsetHRM.isPending}
        />

        {mutationUpsetHRM.isError && (
          <CAlert color="danger" className="mb-0 mt-2 py-2">
            {mutationUpsetHRM.error.message}
          </CAlert>
        )}

        {error && (
          <CAlert color="danger" className="mb-0 mt-2 py-2">
            {error}
          </CAlert>
        )}
      </CModalBody>

      <CModalFooter className="d-flex gap-1">
        <CButton
          disabled={mutationUpsetHRM.isPending}
          onClick={handleSubmit}
          size="sm"
          color="primary"
          variant="outline"
        >
          <div className="d-flex gap-1 align-items-center justify-content-end">
            {mutationUpsetHRM.isPending && <CSpinner size="sm" />} <span>Sauvegarder</span>
          </div>
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default SaisieRjeCreateHrmModal
