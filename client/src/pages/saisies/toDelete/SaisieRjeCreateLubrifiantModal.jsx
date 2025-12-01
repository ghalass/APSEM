import { useQuery } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import {
  fetchGetAllLubrifiantsByParcId,
  fetchGetAllTypeconsommationlubsByParcId,
} from '../../hooks/useLubrifiants'
import {
  useCreateSaisieLubrifiant,
  useDeleteSaisieLubrifiant,
} from '../../hooks/useSaisieLubrifiant'
import {
  CAlert,
  CButton,
  CFormInput,
  CFormSelect,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CSpinner,
} from '@coreui/react'
import useSaisieRjeStore from '../../stores/useSaisieRjeStore'

const SaisieRjeCreateLubrifiantModal = () => {
  const {
    setHrm,
    saisieRjeQueryStore,
    selectedSaisieHim,
    handleCloseLubModal,
    showLubModal,
    setSelectedSaisieHim,
    selectedFields,
  } = useSaisieRjeStore()
  const [error, setError] = useState('')

  // RESET INITIAL VALUES WHEN SHOW/HIDE MODAL OR DATA CHANGED
  useEffect(() => {
    setError('')
    setQte('')
    setObs('')
    setSelectedLubrifiant('')
    setHrm(saisieRjeQueryStore?.data?.[0]?.hrm)
    createSaisieLubrifiant.reset()
  }, [showLubModal, saisieRjeQueryStore?.data])

  const [selectedLubrifiant, setSelectedLubrifiant] = useState('')
  const [selectedLubrifiantConsomCode, setSelectedLubrifiantConsomCode] = useState('')
  const [qte, setQte] = useState('')
  const [obs, setObs] = useState('')

  const getAllLubrifiantsQuery = useQuery(fetchGetAllLubrifiantsByParcId(selectedFields?.parcId))
  const getAllTypeconsommationlubsByParcId = useQuery(
    fetchGetAllTypeconsommationlubsByParcId(selectedFields?.parcId),
  )

  const createSaisieLubrifiant = useCreateSaisieLubrifiant()
  const deleteSaisieLubrifiant = useDeleteSaisieLubrifiant()

  const onSubmit = (e) => {
    e.preventDefault()
    const newSaisieLubrifiant = {
      lubrifiantId: selectedLubrifiant,
      qte,
      obs,
      saisiehimId: selectedSaisieHim?.id,
      typeconsommationlubId: selectedLubrifiantConsomCode,
    }
    createSaisieLubrifiant.mutate(newSaisieLubrifiant, {
      onSuccess: (res) => {
        setQte('')
        setObs('')
        setSelectedLubrifiant('')

        // PUSH THE ADDED LUB TO THE SELECTED HIM SAISIE 'BECAUSE REACT QUERY DONT REFRESH IT'
        selectedSaisieHim?.Saisielubrifiant.push(res)
        // toast.success("Ajouté avec succès.");
      },
    })
  }

  const handleDeleteLub = (lub) => {
    deleteSaisieLubrifiant.mutate(
      { id: lub?.id },
      {
        onSuccess: () => {
          const idToRemove = lub?.id // ID of the object to remove

          // PUSH THE ADDED LUB TO THE SELECTED HIM SAISIE 'BECAUSE REACT QUERY DONT REFRESH IT'
          const newArray = selectedSaisieHim?.Saisielubrifiant.filter(
            (item) => item.id !== idToRemove,
          )

          setSelectedSaisieHim({
            ...selectedSaisieHim,
            Saisielubrifiant: newArray,
          })
          toast.success('Supprimé avec succès.')
        },
      },
    )
  }

  return (
    <div>
      <CModal
        backdrop="static"
        visible={showLubModal}
        onClose={() => {
          handleCloseLubModal()
          //   handleResetAll()
        }}
        aria-labelledby="StaticBackdropExampleLabel"
        size="xl"
      >
        <CModalHeader>
          <CModalTitle id="StaticBackdropExampleLabel">
            Gestion de consommation lubrifiants
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="row">
            <div className="col-xl">
              <div className="mb-2">
                <p className="mb-0">
                  <strong>Panne :</strong>{' '}
                  <span className="text-danger">{selectedSaisieHim?.Panne?.name}</span>
                </p>
                <p className="mb-0">
                  <strong>Type de Panne : </strong>
                  <span className="text-danger">{selectedSaisieHim?.Panne?.Typepanne?.name}</span>
                </p>
              </div>
              <div>
                <div className="row">
                  <div className="col">
                    <CFormSelect
                      id="floatingSelect"
                      floatingClassName="mb-3"
                      floatingLabel="Choisir un lubrifiant"
                      aria-label="Floating label select example"
                      value={selectedLubrifiant}
                      onChange={(e) => setSelectedLubrifiant(e.target.value)}
                      disabled={
                        createSaisieLubrifiant.isPending || deleteSaisieLubrifiant.isPending
                      }
                    >
                      <option value="">Liste des Lubrifiants</option>
                      {getAllLubrifiantsQuery.data?.map((item, index) => (
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
                      floatingLabel="Code Consommation"
                      aria-label="Floating label select example"
                      value={selectedLubrifiantConsomCode}
                      onChange={(e) => setSelectedLubrifiantConsomCode(e.target.value)}
                      disabled={
                        createSaisieLubrifiant.isPending || deleteSaisieLubrifiant.isPending
                      }
                    >
                      <option value="">Liste des codes</option>
                      {getAllTypeconsommationlubsByParcId.data?.map((item, index) => (
                        <option key={index} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </CFormSelect>
                  </div>

                  <div className="col">
                    <CFormInput
                      type="number"
                      id="floatingInputHim"
                      step={0.1}
                      min={0}
                      floatingClassName="mb-3"
                      floatingLabel="Quantité"
                      placeholder="Quantité"
                      value={qte}
                      onChange={(e) => setQte(e.target.value)}
                      disabled={
                        createSaisieLubrifiant.isPending || deleteSaisieLubrifiant.isPending
                      }
                    />
                  </div>
                </div>

                <CFormInput
                  type="text"
                  id="floatingInputObs"
                  step={0.1}
                  min={0}
                  floatingClassName="mb-3"
                  floatingLabel="Observation"
                  placeholder="Observation"
                  value={obs}
                  onChange={(e) => setObs(e.target.value)}
                  disabled={createSaisieLubrifiant.isPending || deleteSaisieLubrifiant.isPending}
                />

                <div className="d-flex justify-content-end mb-3">
                  <CButton
                    disabled={createSaisieLubrifiant.isPending}
                    onClick={onSubmit}
                    size="sm"
                    color="primary"
                    variant="outline"
                  >
                    <div className="d-flex gap-1 align-items-center justify-content-end">
                      {createSaisieLubrifiant.isPending && <CSpinner size="sm" />}{' '}
                      <span>Sauvegarder</span>
                    </div>
                  </CButton>
                </div>
              </div>

              {createSaisieLubrifiant.isError && (
                <CAlert color="danger" className="mb-0 mt-2 py-2 mb-3">
                  {createSaisieLubrifiant.error.message}
                </CAlert>
              )}
            </div>

            <div className="col-xl">
              <table className="table table-sm table-hover">
                <thead>
                  <tr>
                    <td>Lubrifiant</td>
                    <td>Type</td>
                    <td>Qté</td>
                    <td>Code</td>
                    <td>OBS</td>
                  </tr>
                </thead>
                <tbody>
                  {selectedSaisieHim?.Saisielubrifiant?.map((saisie_lub, i) => (
                    <tr key={i}>
                      <td>
                        <CButton
                          disabled={
                            createSaisieLubrifiant.isPending || deleteSaisieLubrifiant.isPending
                          }
                          onClick={() => handleDeleteLub(saisie_lub)}
                          size="sm"
                          color="danger"
                          variant="outline"
                          className="rounded-pill me-2"
                        >
                          <i className="bi bi-trash3"></i>
                        </CButton>
                        {saisie_lub?.Lubrifiant?.name}
                      </td>
                      <td>{saisie_lub?.Lubrifiant?.Typelubrifiant?.name}</td>
                      <td>{saisie_lub?.qte}</td>
                      <td>{saisie_lub?.Typeconsommationlub?.name}</td>
                      <td>{saisie_lub?.obs}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CModalBody>
      </CModal>
    </div>
  )
}

export default SaisieRjeCreateLubrifiantModal
