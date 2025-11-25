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
import React, { useEffect, useState } from 'react'
import useSaisieRjeStore from '../../stores/useSaisieRjeStore'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useGetAllTypepannesByParcId, useTypepannes } from '../../hooks/useTypepannes'
import { usePannesByTypePanne } from '../../hooks/usePannes'
import { addPanneQueryOptions } from '../../hooks/useSaisieRje'
import { toast } from 'react-toastify'

const SaisieRjeCreatePanneModal = () => {
  const { showPanneModal, handleClosePanneModal, saisieRjeQueryStore, selectedFields } =
    useSaisieRjeStore()

  const [selectedTypepanne, setSelectedTypepanne] = useState('')
  const [selectedPanne, setSelectedPanne] = useState('')
  const [him, setHim] = useState('')
  const [ni, setNi] = useState('')

  const typepannesQuery = useQuery(useGetAllTypepannesByParcId(selectedFields?.parcId))
  const pannesByTypepanneQuery = useQuery(usePannesByTypePanne(selectedTypepanne))
  const mutationAddPanneHRM = useMutation(addPanneQueryOptions(handleClosePanneModal))

  // RESET INITIAL VALUES WHEN SHOW/HIDE MODAL OR DATA CHANGED
  useEffect(() => {
    handleResetAll()
  }, [showPanneModal])

  const onSubmit = (e) => {
    e.preventDefault()
    const panneToAdd = {
      saisiehrmId: saisieRjeQueryStore?.data?.[0]?.id,
      panneId: selectedPanne,
      him,
      ni,
    }
    mutationAddPanneHRM.mutate(panneToAdd, {
      onSuccess: () => {
        handleClosePanneModal()
        handleResetAll()
        toast.success('Ajouté avec succès.')
      },
    })
  }

  const handleResetAll = () => {
    setSelectedTypepanne('')
    setSelectedPanne('')
    setHim('')
    setNi('')
    mutationAddPanneHRM.reset()
  }

  const isloading =
    typepannesQuery.isLoading || pannesByTypepanneQuery.isLoading || mutationAddPanneHRM.isPending

  return (
    <CModal
      backdrop="static"
      visible={showPanneModal}
      onClose={() => {
        handleClosePanneModal()
        handleResetAll()
      }}
      aria-labelledby="StaticBackdropExampleLabel"
    >
      <CModalHeader>
        <CModalTitle id="StaticBackdropExampleLabel">Gestion d'une panne</CModalTitle>
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

        {mutationAddPanneHRM.isError && (
          <CAlert color="danger" className="mb-0 mt-2 py-2">
            {mutationAddPanneHRM.error.message}
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

export default SaisieRjeCreatePanneModal
