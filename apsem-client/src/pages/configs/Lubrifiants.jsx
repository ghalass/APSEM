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
import { cilCloudDownload, cilPenNib, cilPlus, cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import {
  fecthLubrifiantsQuery,
  useCreateAffectParcToLubrifiant,
  useCreateLubrifiant,
  useDeleteAffectParcToLubrifiant,
  useDeleteLubrifiant,
  useUpdateLubrifiant,
} from '../../hooks/useLubrifiants'
import { useTypelubrifiants } from '../../hooks/useTypelubrifiants'
import TableHead from './TableHead'
import { useParcs } from '../../hooks/useParcs'

const Lubrifiants = () => {
  const getAllTypelubrifiantsQuery = useQuery(useTypelubrifiants())

  const getAllQuery = useQuery(fecthLubrifiantsQuery())

  const [visible, setVisible] = useState(false)
  const [operation, setOperation] = useState('')

  const initialVal = { id: '', name: '', typelubrifiantId: '' }

  const [entity, setEntity] = useState(initialVal)
  const createMutation = useCreateLubrifiant()
  const deleteMutation = useDeleteLubrifiant()
  const updateMutation = useUpdateLubrifiant()

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = {
      id: entity.id,
      name: entity.name,
      typelubrifiantId: entity.typelubrifiantId,
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
  const filteredEntitys = getAllQuery.data?.filter(
    (ele) =>
      ele?.name.toLowerCase().includes(search.toLowerCase()) ||
      ele?.Typelubrifiant?.name.toLowerCase().includes(search.toLowerCase()),
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
  //***************** PARC => LUBRIFIANT *********************************************************** */
  //
  const getAllParcsQuery = useQuery(useParcs())
  const [selectedParc, setSelectedParc] = useState('')
  const [selectedParcsByLubrifiant, setSelectedParcsByLubrifiant] = useState(null)
  const [visibleListParcs, setVisibleListParcs] = useState(false)

  const affectParcLubrifiantMutation = useCreateAffectParcToLubrifiant()
  const deleteAffectParcToLubrifiantMutation = useDeleteAffectParcToLubrifiant()

  const handleAffecter = () => {
    handleResetAllAffectModal()
    const data = {
      parc_id: selectedParc,
      lubrifiant_id: selectedParcsByLubrifiant?.id,
    }
    affectParcLubrifiantMutation.mutate(data, {
      onSuccess: (newData) => {
        toast.success('Affecté avec succès.')
        // console.log(newData)
        const newParc = {
          id: newData?.parc?.id,
          name: newData?.parc?.name,
        }
        // Update state immutably
        setSelectedParcsByLubrifiant((prev) => ({
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
      lubrifiant_id: selectedParcsByLubrifiant?.id,
    }

    deleteAffectParcToLubrifiantMutation.mutate(data, {
      onSuccess: () => {
        toast.success('Supprimé avec succès.')
        const updatedData = {
          ...selectedParcsByLubrifiant,
          parcs: selectedParcsByLubrifiant.parcs.filter((parc) => parc.id !== affectation?.id),
        }
        setSelectedParcsByLubrifiant(updatedData)
      },
    })
  }

  const handleResetAllAffectModal = () => {
    affectParcLubrifiantMutation.reset()
    deleteAffectParcToLubrifiantMutation.reset()
  }

  return (
    <div>
      <TableHead
        title="Liste des lubrifiants"
        getAllQuery={getAllQuery}
        search={search}
        handleSearch={handleSearch}
        setEntity={setEntity}
        initialVal={initialVal}
        setVisible={setVisible}
        visible={visible}
        setOperation={setOperation}
        tableId={'myTable'}
        excelFileName={'Liste des lubrifiants'}
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
            <CTableHeaderCell scope="col">Nom du lubrifiant</CTableHeaderCell>
            <CTableHeaderCell scope="col">Type de lubrifiant</CTableHeaderCell>
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

                <CTableDataCell> {item?.typelubrifiant?.name}</CTableDataCell>

                <CTableDataCell>
                  <CButton
                    size="sm"
                    color="primary"
                    variant="outline"
                    className="rounded-pill"
                    onClick={() => {
                      setSelectedParcsByLubrifiant(item)
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
          <CModalTitle id="StaticBackdropExampleLabel">Gestion d'un lubrifiant</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CFormSelect
            id="floatingSelect"
            floatingClassName="mb-3"
            floatingLabel="Choisir un type de lubrifiant"
            aria-label="Floating label select example"
            value={entity?.typelubrifiant?.id}
            onChange={(e) => setEntity({ ...entity, typelubrifiantId: e.target.value })}
            disabled={
              createMutation.isPending ||
              updateMutation.isPending ||
              deleteMutation.isPending ||
              operation === 'delete'
            }
          >
            <option></option>
            {getAllTypelubrifiantsQuery.data &&
              getAllTypelubrifiantsQuery.data?.length > 0 &&
              getAllTypelubrifiantsQuery.data?.map((typelubrifiant, indx) => (
                <option key={indx} value={typelubrifiant?.id}>
                  {typelubrifiant?.name}
                </option>
              ))}
          </CFormSelect>

          <CFormInput
            type="text"
            id="floatingInput"
            floatingClassName="mb-3"
            floatingLabel="Nom du lubrifiant"
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
            Gestion des lubrifiants par parc
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p className="text-center text-info">{selectedParcsByLubrifiant?.name}</p>

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
                    affectParcLubrifiantMutation.isPending ||
                    deleteAffectParcToLubrifiantMutation.isPending ||
                    affectParcLubrifiantMutation.isPending
                  }
                  onClick={handleAffecter}
                  size="sm"
                  color="success"
                  variant="outline"
                >
                  <div className="d-flex gap-1 align-items-center justify-content-end">
                    {(affectParcLubrifiantMutation.isPending ||
                      deleteAffectParcToLubrifiantMutation.isPending) && <CSpinner size="sm" />}
                    <span>Affecter</span>
                  </div>
                </CButton>
              </div>
            </div>

            <div className="col-8">
              <div className="d-flex flex-wrap gap-2 align-content-start">
                {selectedParcsByLubrifiant?.parcs &&
                selectedParcsByLubrifiant?.parcs?.length > 0 ? (
                  selectedParcsByLubrifiant?.parcs?.map((item, index) => (
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

          {affectParcLubrifiantMutation.isError && (
            <CAlert color="danger" className="mb-0 mt-2 py-2">
              {affectParcLubrifiantMutation.error.message}
            </CAlert>
          )}

          {updateMutation.isError && (
            <CAlert color="danger" className="mb-0 mt-2 py-2">
              {updateMutation.error.message}
            </CAlert>
          )}

          {deleteAffectParcToLubrifiantMutation.isError && (
            <CAlert color="danger" className="mb-0 mt-2 py-2">
              {deleteAffectParcToLubrifiantMutation.error.message}
            </CAlert>
          )}
        </CModalBody>
      </CModal>
    </div>
  )
}

export default Lubrifiants
