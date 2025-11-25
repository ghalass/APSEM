import React, { useState } from 'react'
import {
  CAlert,
  CCard,
  CCardBody,
  CFormInput,
  CFormSelect,
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
import TableHead from './TableHead'
import {
  useCreateAffectParcToCode,
  useCreateTypeconsommationlub,
  useDeleteAffectParcToCode,
  useDeleteTypeconsommationlub,
  useTypeconsommationlubs,
  useUpdateTypeconsommationlub,
} from '../../hooks/useTypeconsommationlubs'
import { useParcs } from '../../hooks/useParcs'

const Typeconsommationlubs = () => {
  const getAllQuery = useQuery(useTypeconsommationlubs())

  const [visible, setVisible] = useState(false)
  const [operation, setOperation] = useState('')

  const initialVal = { id: '', name: '' }

  const [entity, setEntity] = useState(initialVal)
  const createMutation = useCreateTypeconsommationlub()
  const deleteMutation = useDeleteTypeconsommationlub()
  const updateMutation = useUpdateTypeconsommationlub()

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

  const filteredEntitys = getAllQuery.data?.filter((el) => {
    const searchTerm = search.toLowerCase()
    const nameMatches = el?.name?.toLowerCase().includes(searchTerm)
    const parcMatches = el?.parcs?.some((p) => p?.parc?.name?.toLowerCase().includes(searchTerm))
    return nameMatches || parcMatches // Include if either matches
  })

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
  //***************** PARC => CODE *********************************************************** */
  //
  const getAllParcsQuery = useQuery(useParcs())
  const [selectedParc, setSelectedParc] = useState('')
  const [visibleListParcs, setVisibleListParcs] = useState(false)
  const [selectedParcsByCode, setSelectedParcsByCode] = useState(null)

  const affectParcToCodeMutation = useCreateAffectParcToCode()
  const deleteAffectParcToCodeMutation = useDeleteAffectParcToCode()

  const handleAffecter = () => {
    handleResetAllAffectModal()
    const data = {
      parc_id: selectedParc,
      typeconsommationlub_id: selectedParcsByCode?.id,
    }
    affectParcToCodeMutation.mutate(data, {
      onSuccess: (newData) => {
        toast.success('Affecté avec succès.')
        const newParc = {
          parcId: newData?.parcId,
          typeconsommationlubId: newData?.typeconsommationlubId,
          parc: newData?.parc,
        }
        // Update state immutably
        setSelectedParcsByCode((prev) => ({
          ...prev,
          parcs: [...prev.parcs, newParc], // Add new parc to existing array
        }))
      },
    })
  }
  const handleDeleteAffecter = (affectation) => {
    handleResetAllAffectModal()
    const data = {
      parc_id: affectation?.parcId,
      typeconsommationlub_id: affectation?.typeconsommationlubId,
    }
    deleteAffectParcToCodeMutation.mutate(data, {
      onSuccess: () => {
        toast.success('Supprimé avec succès.')
        const updatedData = {
          ...selectedParcsByCode,
          parcs: selectedParcsByCode.parcs.filter((parc) => parc.parcId !== affectation?.parcId),
        }
        setSelectedParcsByCode(updatedData)
      },
    })
  }
  const handleResetAllAffectModal = () => {
    affectParcToCodeMutation.reset()
    deleteAffectParcToCodeMutation.reset()
  }
  return (
    <div>
      <TableHead
        title="Liste des code de consommation"
        getAllQuery={getAllQuery}
        search={search}
        handleSearch={handleSearch}
        setEntity={setEntity}
        initialVal={initialVal}
        setVisible={setVisible}
        visible={visible}
        setOperation={setOperation}
        tableId={'myTable'}
        excelFileName={'Liste des code de consommation'}
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
            <CTableHeaderCell scope="col">Code</CTableHeaderCell>
            <CTableHeaderCell scope="col">Parc</CTableHeaderCell>
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
                      setSelectedParcsByCode(item)
                      // setOperation('update')
                      setVisibleListParcs(!visibleListParcs)
                    }}
                  >
                    <CIcon icon={cilPenNib} />
                  </CButton>{' '}
                  {item?.parcs &&
                    item?.parcs?.length > 0 &&
                    item?.parcs?.map((p, i) => <span key={i}>{p?.parc?.name} | </span>)}
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
          <CModalTitle id="StaticBackdropExampleLabel">
            Gestion d'un type de consommation lub
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CFormInput
            type="text"
            id="floatingInput"
            floatingClassName="mb-3"
            floatingLabel="Nom du type de consommation lub"
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
          <CModalTitle id="StaticBackdropExampleLabel">Gestion des parcs</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p className="text-center text-info">{selectedParcsByCode?.name}</p>

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
                    affectParcToCodeMutation.isPending ||
                    deleteAffectParcToCodeMutation.isPending ||
                    affectParcToCodeMutation.isPending
                  }
                  onClick={handleAffecter}
                  size="sm"
                  color="success"
                  variant="outline"
                >
                  <div className="d-flex gap-1 align-items-center justify-content-end">
                    {(affectParcToCodeMutation.isPending ||
                      deleteAffectParcToCodeMutation.isPending) && <CSpinner size="sm" />}
                    <span>Affecter</span>
                  </div>
                </CButton>
              </div>
            </div>

            <div className="col-8">
              <div className="d-flex flex-wrap gap-2 align-content-start">
                {selectedParcsByCode?.parcs && selectedParcsByCode?.parcs?.length > 0 ? (
                  selectedParcsByCode?.parcs?.map((item, index) => (
                    <CCard key={index}>
                      <CCardBody className="py-1 px-2">
                        <div className="d-flex gap-2">
                          {item?.parc?.name}{' '}
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

          {affectParcToCodeMutation.isError && (
            <CAlert color="danger" className="mb-0 mt-2 py-2">
              {affectParcToCodeMutation.error.message}
            </CAlert>
          )}

          {/* {updateMutation.isError && (
                <CAlert color="danger" className="mb-0 mt-2 py-2">
                  {updateMutation.error.message}
                </CAlert>
              )} */}

          {deleteAffectParcToCodeMutation.isError && (
            <CAlert color="danger" className="mb-0 mt-2 py-2">
              {deleteAffectParcToCodeMutation.error.message}
            </CAlert>
          )}
        </CModalBody>
      </CModal>
    </div>
  )
}

export default Typeconsommationlubs
