import React, { useEffect, useState } from 'react'
import useSaisieRjeStore from '../../stores/useSaisieRjeStore'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useTypepannes } from '../../hooks/useTypepannes'
import { usePannesByTypePanne } from '../../hooks/usePannes'
import { useUpdateSaisiePanne } from '../../hooks/useSaisieRje'
import {
  CAlert,
  CButton,
  CFormInput,
  CFormSelect,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CSpinner,
} from '@coreui/react'

const SaisieRjeEditPanneModal = () => {
  const { showEditPanneModal, handleCloseEditPanneModal, panneToEdit } = useSaisieRjeStore()

  const [selectedTypepanne, setSelectedTypepanne] = useState()
  const [selectedPanne, setSelectedPanne] = useState()
  const [him, setHim] = useState()
  const [ni, setNi] = useState()

  // RESET INITIAL VALUES WHEN SHOW/HIDE MODAL OR DATA CHANGED
  useEffect(() => {
    mutationUpdatePanneHRM.reset()
    setSelectedTypepanne(panneToEdit?.Panne?.Typepanne?.id)
    setSelectedPanne(panneToEdit?.panneId)
    setHim(panneToEdit?.him)
    setNi(panneToEdit?.ni)
  }, [showEditPanneModal])

  const typepannesQuery = useQuery(useTypepannes())
  const pannesByTypepanneQuery = useQuery(usePannesByTypePanne(selectedTypepanne))

  const onSubmit = (e) => {
    e.preventDefault()
    const panneToUpdate = {
      id: panneToEdit?.id,
      panneId: selectedPanne,
      him: him,
      ni: ni,
      saisiehrmId: panneToEdit?.saisiehrmId,
    }

    mutationUpdatePanneHRM.mutate(panneToUpdate)
  }

  const mutationUpdatePanneHRM = useMutation(useUpdateSaisiePanne(handleCloseEditPanneModal))

  const isloading =
    typepannesQuery.isLoading ||
    pannesByTypepanneQuery.isLoading ||
    mutationUpdatePanneHRM.isPending

  const handleResetAll = () => {
    // setSelectedTypepanne('')
    // setSelectedPanne('')
    // setHim('')
    // setNi('')
    // mutationAddPanneHRM.reset()
  }

  return (
    <CModal
      backdrop="static"
      visible={showEditPanneModal}
      onClose={() => {
        handleCloseEditPanneModal()
        handleResetAll()
      }}
      aria-labelledby="StaticBackdropExampleLabel"
    >
      <CModalHeader>
        <CModalTitle id="StaticBackdropExampleLabel">Modifier une panne</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div className="row">
          <div className="col">
            <CFormSelect
              id="floatingSelect"
              floatingClassName="mb-3"
              floatingLabel="Choisir un type de parc"
              aria-label="Floating label select example"
              value={selectedTypepanne}
              onChange={(e) => setSelectedTypepanne(e.target.value)}
              disabled={isloading}
            >
              <option value="">Liste des Typepannes</option>
              {typepannesQuery?.data?.map((item, index) => (
                <option key={index} value={item.id}>
                  {item.name}
                </option>
              ))}
            </CFormSelect>
          </div>
          <div className="col">
            <CFormSelect
              id="floatingSelect"
              floatingClassName="mb-3"
              floatingLabel="Choisir un type de parc"
              aria-label="Floating label select example"
              value={selectedPanne}
              onChange={(e) => setSelectedPanne(e.target.value)}
              disabled={isloading}
            >
              <option value="">Liste des Pannes</option>
              {pannesByTypepanneQuery?.data?.map((item, index) => (
                <option key={index} value={item.id}>
                  {item.name}
                </option>
              ))}
            </CFormSelect>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <CFormInput
              type="number"
              id="floatingInputHim"
              step="0.5"
              min={0}
              max={24}
              floatingClassName="mb-3"
              floatingLabel="HIM"
              placeholder="HIM"
              value={him}
              onChange={(e) => setHim(e.target.value)}
              disabled={isloading}
            />
          </div>

          <div className="col">
            {' '}
            <CFormInput
              type="number"
              id="floatingInputNi"
              step="1"
              min={0}
              floatingClassName="mb-3"
              floatingLabel="NI"
              placeholder="NI"
              value={ni}
              onChange={(e) => setNi(e.target.value)}
              disabled={isloading}
            />
          </div>
        </div>

        {mutationUpdatePanneHRM.isError && (
          <CAlert color="danger" className="mb-0 mt-2 py-2">
            {mutationUpdatePanneHRM.error.message}
          </CAlert>
        )}
      </CModalBody>

      <CModalFooter className="d-flex gap-1">
        <CButton
          disabled={isloading}
          onClick={onSubmit}
          size="sm"
          color="primary"
          variant="outline"
        >
          <div className="d-flex gap-1 align-items-center justify-content-end">
            {isloading && <CSpinner size="sm" />} <span>Sauvegarder</span>
          </div>
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default SaisieRjeEditPanneModal
