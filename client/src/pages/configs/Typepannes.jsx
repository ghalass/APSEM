import React, { useState } from 'react'
import {
  CAlert,
  CBadge,
  CCard,
  CCardBody,
  CFormInput,
  CFormSelect,
  CPagination,
  CPaginationItem,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import { cilPenNib, cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import {
  useCreateAffectParcToTypepanne,
  useCreateTypepanne,
  useDeleteAffectParcToTypepanne,
  useDeleteTypepanne,
  useTypepannes,
  useUpdateTypepanne,
} from '../../hooks/useTypepannes'
import TableHead from './TableHead'
import { useParcs } from '../../hooks/useParcs'

const Typepannes = () => {
  const getAllQuery = useQuery(useTypepannes())

  const [visible, setVisible] = useState(false)
  const [operation, setOperation] = useState('')

  const initialVal = { id: '', name: '' }

  const [entity, setEntity] = useState(initialVal)
  const createMutation = useCreateTypepanne()
  const deleteMutation = useDeleteTypepanne()
  const updateMutation = useUpdateTypepanne()

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = {
      id: entity.id,
      name: entity.name,
    }

    switch (operation) {
      case 'create':
        createMutation.mutate(data, {
          onSuccess: () => {
            setVisible(!visible)
            handleResetAll()
            toast.success('Ajouté avec succès.')
          },
        })
        break
      case 'delete':
        deleteMutation.mutate(data, {
          onSuccess: () => {
            setVisible(!visible)
            handleResetAll()
            toast.success('Supprimé avec succès.')
          },
        })
        break
      case 'update':
        updateMutation.mutate(data, {
          onSuccess: () => {
            setVisible(!visible)
            handleResetAll()
            toast.success('Modifié avec succès.')
          },
        })
        break
      default:
        break
    }
  }

  const handleResetAll = () => {
    setEntity(initialVal)
    createMutation.reset()
    deleteMutation.reset()
    updateMutation.reset()
    setOperation('create')
  }

  const [search, setSearch] = useState('')
  const handleSearch = (e) => {
    setCurrentPage(1)
    const newSearchValue = e.target.value
    if (newSearchValue !== search) {
      setSearch(newSearchValue)
    }
  }
  // Filter the entitys based on the search query
  const filteredEntitys = getAllQuery.data?.filter((el) =>
    el?.name.toLowerCase().includes(search.toLowerCase()),
  )

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1)
  const [entitysPerPage, setEntitysPerPage] = useState(10)
  // Calculate current entitys to display
  const indexOfLastEntity = currentPage * entitysPerPage
  const indexOfFirstEntity = indexOfLastEntity - entitysPerPage
  const currentEntitys = filteredEntitys?.slice(indexOfFirstEntity, indexOfLastEntity)
  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }
  // Calculate total pages
  const totalPages = Math.ceil(filteredEntitys?.length / entitysPerPage)

  //
  //
  //***************** PARC => TYPEPANNE *********************************************************** */
  //
  const getAllParcsQuery = useQuery(useParcs())
  const [selectedParc, setSelectedParc] = useState('')
  const [visibleListParcs, setVisibleListParcs] = useState(false)
  const [selectedParcsByTypepanne, setSelectedParcsByTypepanne] = useState(null)

  const affectParcTypepanneMutation = useCreateAffectParcToTypepanne()
  const deleteAffectParcToTypepanneMutation = useDeleteAffectParcToTypepanne()

  const handleAffecter = () => {
    handleResetAllAffectModal()
    const data = {
      parc_id: selectedParc,
      typepanne_id: selectedParcsByTypepanne?.id,
    }
    affectParcTypepanneMutation.mutate(data, {
      onSuccess: (newData) => {
        toast.success('Affecté avec succès.')
        // console.log(newData)
        const newParc = {
          id: newData?.parc?.id,
          name: newData?.parc?.name,
        }
        // Update state immutably
        setSelectedParcsByTypepanne((prev) => ({
          ...prev,
          parcs: [...prev.parcs, newParc], // Add new parc to existing array
        }))
      },
    })
  }
  const handleDeleteAffecter = (affectation) => {
    handleResetAllAffectModal()

    const data = {
      parc_id: affectation?.id,
      typepanne_id: selectedParcsByTypepanne?.id,
    }

    console.log(data)

    deleteAffectParcToTypepanneMutation.mutate(data, {
      onSuccess: () => {
        toast.success('Supprimé avec succès.')
        const updatedData = {
          ...selectedParcsByTypepanne,
          parcs: selectedParcsByTypepanne.parcs.filter((parc) => parc.id !== affectation?.id),
        }
        setSelectedParcsByTypepanne(updatedData)
      },
    })
  }
  const handleResetAllAffectModal = () => {
    affectParcTypepanneMutation.reset()
    deleteAffectParcToTypepanneMutation.reset()
  }

  return (
    <div>
      <TableHead
        title="Liste des types des pannes"
        getAllQuery={getAllQuery}
        search={search}
        handleSearch={handleSearch}
        setEntity={setEntity}
        initialVal={initialVal}
        setVisible={setVisible}
        visible={visible}
        setOperation={setOperation}
        tableId={'myTable'}
        excelFileName={'Liste des types des pannes'}
        currentEntitys={currentEntitys}
        entitysPerPage={entitysPerPage}
        setEntitysPerPage={setEntitysPerPage}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        handlePageChange={handlePageChange}
        totalPages={totalPages}
        filteredEntitys={filteredEntitys}
      />

      <CTable responsive striped hover id="myTable">
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell scope="col">Nom du type de panne</CTableHeaderCell>
            <CTableHeaderCell scope="col">Parcs</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {currentEntitys && currentEntitys?.length > 0 ? (
            currentEntitys?.map((item, index) => (
              <CTableRow key={index}>
                <CTableDataCell>
                  <CButton
                    size="sm"
                    color="danger"
                    variant="outline"
                    className="rounded-pill"
                    onClick={() => {
                      setEntity(item)
                      setOperation('delete')
                      setVisible(!visible)
                    }}
                  >
                    <CIcon icon={cilTrash} />
                  </CButton>{' '}
                  <CButton
                    size="sm"
                    color="primary"
                    variant="outline"
                    className="rounded-pill"
                    onClick={() => {
                      setEntity(item)
                      setOperation('update')
                      setVisible(!visible)
                    }}
                  >
                    <CIcon icon={cilPenNib} />
                  </CButton>{' '}
                  {item?.name}
                </CTableDataCell>

                <CTableDataCell>
                  <CButton
                    size="sm"
                    color="primary"
                    variant="outline"
                    className="rounded-pill"
                    onClick={() => {
                      setSelectedParcsByTypepanne(item)
                      // // setOperation('update')
                      setVisibleListParcs(!visibleListParcs)
                    }}
                  >
                    <CIcon icon={cilPenNib} />
                  </CButton>{' '}
                  {item?.parcs &&
                    item?.parcs?.length > 0 &&
                    item?.parcs?.map((p, i) => <span key={i}>{p?.name} | </span>)}
                </CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan={2}>Aucune donnée trouvée.</CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>

      {/* CREATE/UPDATE/DELETE  */}
      <CModal
        backdrop="static"
        visible={visible}
        onClose={() => {
          setVisible(false)
          handleResetAll()
        }}
        aria-labelledby="StaticBackdropExampleLabel"
      >
        <CModalHeader>
          <CModalTitle id="StaticBackdropExampleLabel">Gestion d'un typepanne</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CFormInput
            type="text"
            id="floatingInput"
            floatingClassName="mb-3"
            floatingLabel="Nom du typepanne"
            placeholder="pg11"
            value={entity.name}
            onChange={(e) => setEntity({ ...entity, name: e.target.value })}
            disabled={
              createMutation.isPending ||
              updateMutation.isPending ||
              deleteMutation.isPending ||
              operation === 'delete'
            }
          />

          {createMutation.isError && (
            <CAlert color="danger" className="mb-0 mt-2 py-2">
              {createMutation.error.message}
            </CAlert>
          )}

          {updateMutation.isError && (
            <CAlert color="danger" className="mb-0 mt-2 py-2">
              {updateMutation.error.message}
            </CAlert>
          )}

          {deleteMutation.isError && (
            <CAlert color="danger" className="mb-0 mt-2 py-2">
              {deleteMutation.error.message}
            </CAlert>
          )}
        </CModalBody>
        <CModalFooter className="d-flex gap-1">
          {operation === 'delete' && (
            <CButton
              disabled={
                createMutation.isPending || updateMutation.isPending || deleteMutation.isPending
              }
              onClick={handleSubmit}
              size="sm"
              color="danger"
              variant="outline"
            >
              <div className="d-flex gap-1 align-items-center justify-content-end">
                {deleteMutation.isPending && <CSpinner size="sm" />} <span>Supprimer</span>
              </div>
            </CButton>
          )}

          {operation !== 'delete' && (
            <CButton
              disabled={
                deleteMutation.isPending || createMutation.isPending || updateMutation.isPending
              }
              onClick={handleSubmit}
              size="sm"
              color="success"
              variant="outline"
            >
              <div className="d-flex gap-1 align-items-center justify-content-end">
                {(createMutation.isPending || updateMutation.isPending) && <CSpinner size="sm" />}{' '}
                <span>Sauvegarder</span>
              </div>
            </CButton>
          )}
        </CModalFooter>
      </CModal>

      {/* PARC => CODE */}
      <CModal
        backdrop="static"
        visible={visibleListParcs}
        onClose={() => {
          setVisibleListParcs(false)
          handleResetAllAffectModal()
        }}
        aria-labelledby="StaticBackdropExampleLabel"
        size="lg"
      >
        <CModalHeader>
          <CModalTitle id="StaticBackdropExampleLabel">
            Gestion des types pannes par parc
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p className="text-center text-info">{selectedParcsByTypepanne?.name}</p>

          <div className="row">
            <div className="col-4">
              <div className="">
                <CFormSelect
                  id="floatingSelect"
                  floatingClassName="mb-3"
                  floatingLabel="Choisir un parc"
                  aria-label="Floating label select example"
                  value={selectedParc}
                  onChange={(e) => {
                    setSelectedParc(e.target.value)
                  }}
                  // disabled={getParetoIndispParc.isFetching}
                >
                  <option value="">Liste des parc</option>
                  {getAllParcsQuery.data?.map((item, index) => (
                    <option key={index} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </CFormSelect>
              </div>
              <div className="">
                <CButton
                  disabled={
                    affectParcTypepanneMutation.isPending ||
                    deleteAffectParcToTypepanneMutation.isPending ||
                    affectParcTypepanneMutation.isPending
                  }
                  onClick={handleAffecter}
                  size="sm"
                  color="success"
                  variant="outline"
                >
                  <div className="d-flex gap-1 align-items-center justify-content-end">
                    {(affectParcTypepanneMutation.isPending ||
                      deleteAffectParcToTypepanneMutation.isPending) && <CSpinner size="sm" />}
                    <span>Affecter</span>
                  </div>
                </CButton>
              </div>
            </div>

            <div className="col-8">
              <div className="d-flex flex-wrap gap-2 align-content-start">
                {selectedParcsByTypepanne?.parcs && selectedParcsByTypepanne?.parcs?.length > 0 ? (
                  selectedParcsByTypepanne?.parcs?.map((item, index) => (
                    <CCard key={index}>
                      <CCardBody className="py-1 px-2">
                        <div className="d-flex gap-2">
                          {item?.name}{' '}
                          <i
                            className="bi bi-trash3 text-danger"
                            role="button"
                            onClick={() => handleDeleteAffecter(item)}
                          ></i>
                        </div>
                      </CCardBody>
                    </CCard>
                  ))
                ) : (
                  <p>Aucune donnée trouvée.</p>
                )}
              </div>
            </div>
          </div>

          {affectParcTypepanneMutation.isError && (
            <CAlert color="danger" className="mb-0 mt-2 py-2">
              {affectParcTypepanneMutation.error.message}
            </CAlert>
          )}

          {updateMutation.isError && (
            <CAlert color="danger" className="mb-0 mt-2 py-2">
              {updateMutation.error.message}
            </CAlert>
          )}

          {deleteAffectParcToTypepanneMutation.isError && (
            <CAlert color="danger" className="mb-0 mt-2 py-2">
              {deleteAffectParcToTypepanneMutation.error.message}
            </CAlert>
          )}
        </CModalBody>
      </CModal>
    </div>
  )
}

export default Typepannes
