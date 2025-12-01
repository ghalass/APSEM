import React, { useState } from 'react'
import {
  CAlert,
  CBadge,
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
  CRow,
  CCol,
} from '@coreui/react'
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import { cilPenNib, cilPlus, cilTrash, cilWarning } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import TableHead from '../../components/TableHead'
import {
  useCreateAffectParcToTypepanne,
  useCreateTypepanne,
  useDeleteAffectParcToTypepanne,
  useDeleteTypepanne,
  useTypepannes,
  useUpdateTypepanne,
} from '../../hooks/useTypepannes'
import { useParcs } from '../../hooks/useParcs'
import ConfigLayout from '../../layout/ConfigLayout'

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
            toast.success('Type de panne ajouté avec succès.')
          },
        })
        break
      case 'delete':
        deleteMutation.mutate(data, {
          onSuccess: () => {
            setVisible(!visible)
            handleResetAll()
            toast.success('Type de panne supprimé avec succès.')
          },
        })
        break
      case 'update':
        updateMutation.mutate(data, {
          onSuccess: () => {
            setVisible(!visible)
            handleResetAll()
            toast.success('Type de panne modifié avec succès.')
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

  // Filter the types based on the search query
  const filteredTypes = getAllQuery.data?.filter((type) =>
    type?.name.toLowerCase().includes(search.toLowerCase()),
  )

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1)
  const [typesPerPage, setTypesPerPage] = useState(10)

  // Calculate current types to display
  const indexOfLastType = currentPage * typesPerPage
  const indexOfFirstType = indexOfLastType - typesPerPage
  const currentTypes = filteredTypes?.slice(indexOfFirstType, indexOfLastType)

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  // Calculate total pages
  const totalPages = Math.ceil(filteredTypes?.length / typesPerPage)

  //
  // PARC => TYPEPANNE
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
        toast.success('Parc affecté avec succès.')
        const newParc = {
          id: newData?.parc?.id,
          name: newData?.parc?.name,
        }
        setSelectedParcsByTypepanne((prev) => ({
          ...prev,
          parcs: [...prev.parcs, newParc],
        }))
        setSelectedParc('')
      },
    })
  }

  const handleDeleteAffecter = (affectation) => {
    handleResetAllAffectModal()
    const data = {
      parc_id: affectation?.id,
      typepanne_id: selectedParcsByTypepanne?.id,
    }

    deleteAffectParcToTypepanneMutation.mutate(data, {
      onSuccess: () => {
        toast.success('Affectation supprimée avec succès.')
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

  if (getAllQuery.isError) {
    return (
      <CAlert color="warning" className="d-flex align-items-center">
        <CIcon icon={cilWarning} className="flex-shrink-0 me-2" width={24} height={24} />
        <div>{getAllQuery?.error?.message}</div>
      </CAlert>
    )
  }

  return (
    <ConfigLayout>
      <TableHead
        title="Liste des types de pannes"
        getAllQuery={getAllQuery}
        search={search}
        handleSearch={handleSearch}
        setEntity={setEntity}
        initialVal={initialVal}
        setVisible={setVisible}
        visible={visible}
        setOperation={setOperation}
        tableId={'typepannesTable'}
        excelFileName={'Liste des types de pannes'}
        currentEntitys={currentTypes}
        entitysPerPage={typesPerPage}
        setEntitysPerPage={setTypesPerPage}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        handlePageChange={handlePageChange}
        totalPages={totalPages}
        filteredEntitys={filteredTypes}
      />

      <CTable responsive striped hover className="mt-3" id="typepannesTable">
        <CTableHead className="bg-body">
          <CTableRow>
            <CTableHeaderCell scope="col" className="text-body">
              Nom du type de panne
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" className="text-body">
              Parcs associés
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" className="text-body">
              Actions
            </CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {currentTypes && currentTypes?.length > 0 ? (
            currentTypes?.map((type) => (
              <CTableRow key={type.id} className="bg-body">
                <CTableDataCell className="text-body fw-medium">{type?.name}</CTableDataCell>

                <CTableDataCell>
                  {type?.parcs?.length > 0 ? (
                    <div className="d-flex flex-wrap gap-1">
                      {type.parcs.map((parc, index) => (
                        <CBadge key={index} color="primary" className="text-capitalize">
                          {parc.name}
                        </CBadge>
                      ))}
                    </div>
                  ) : (
                    <CBadge color="secondary" className="text-body">
                      Aucun parc
                    </CBadge>
                  )}
                </CTableDataCell>

                <CTableDataCell>
                  <div className="d-flex gap-1">
                    <CButton
                      size="sm"
                      color="primary"
                      variant="outline"
                      className="rounded-pill"
                      onClick={() => {
                        setEntity(type)
                        setOperation('update')
                        setVisible(true)
                      }}
                      title="Modifier le type"
                    >
                      <CIcon icon={cilPenNib} />
                    </CButton>
                    <CButton
                      size="sm"
                      color="danger"
                      variant="outline"
                      className="rounded-pill"
                      onClick={() => {
                        setEntity(type)
                        setOperation('delete')
                        setVisible(true)
                      }}
                      title="Supprimer le type"
                    >
                      <CIcon icon={cilTrash} />
                    </CButton>
                    <CButton
                      size="sm"
                      color="info"
                      variant="outline"
                      className="rounded-pill"
                      onClick={() => {
                        setSelectedParcsByTypepanne(type)
                        setVisibleListParcs(true)
                      }}
                      title="Gérer les parcs"
                    >
                      <CIcon icon={cilPlus} />
                    </CButton>
                  </div>
                </CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow className="bg-body">
              <CTableDataCell colSpan={3} className="text-center text-body py-4">
                {getAllQuery.isLoading ? (
                  <div className="d-flex align-items-center justify-content-center gap-2">
                    <CSpinner size="sm" />
                    <span>Chargement des types de pannes...</span>
                  </div>
                ) : (
                  <div>
                    <CIcon icon={cilWarning} size="xl" className="text-body-secondary mb-2" />
                    <div>Aucun type de panne trouvé</div>
                    {search && (
                      <div className="text-body-secondary small mt-1">
                        Aucun résultat pour "{search}"
                      </div>
                    )}
                  </div>
                )}
              </CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>

      {/* CREATE/UPDATE/DELETE MODAL */}
      <CModal
        backdrop="static"
        visible={visible}
        onClose={() => {
          setVisible(false)
          handleResetAll()
        }}
        aria-labelledby="TypepanneModalLabel"
      >
        <CModalHeader className="bg-body">
          <CModalTitle id="TypepanneModalLabel" className="text-body">
            {operation === 'create' && 'Créer un type de panne'}
            {operation === 'update' && 'Modifier le type de panne'}
            {operation === 'delete' && 'Supprimer le type de panne'}
          </CModalTitle>
        </CModalHeader>
        <CModalBody className="bg-body">
          {operation === 'delete' ? (
            <div className="text-center text-body">
              <CAlert color="warning" className="mb-3">
                <strong>Attention!</strong> Cette action est irréversible.
              </CAlert>
              <p>Voulez-vous vraiment supprimer le type de panne :</p>
              <div className="border rounded p-3 bg-body">
                <strong className="text-body">{entity.name}</strong>
              </div>
            </div>
          ) : (
            <>
              <CFormInput
                type="text"
                id="typepanneNameInput"
                floatingLabel="Nom du type de panne"
                placeholder="Entrez le nom du type"
                value={entity.name}
                onChange={(e) => setEntity({ ...entity, name: e.target.value })}
                disabled={createMutation.isPending || updateMutation.isPending}
              />

              {(createMutation.isError || updateMutation.isError) && (
                <CAlert color="danger" className="mb-0 mt-3">
                  {createMutation.error?.message || updateMutation.error?.message}
                </CAlert>
              )}
            </>
          )}

          {deleteMutation.isError && (
            <CAlert color="danger" className="mb-0 mt-3">
              {deleteMutation.error.message}
            </CAlert>
          )}
        </CModalBody>
        <CModalFooter className="bg-body">
          <CButton
            color="secondary"
            onClick={() => {
              setVisible(false)
              handleResetAll()
            }}
            disabled={
              createMutation.isPending || updateMutation.isPending || deleteMutation.isPending
            }
          >
            Annuler
          </CButton>

          {operation === 'delete' ? (
            <CButton color="danger" onClick={handleSubmit} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? (
                <>
                  <CSpinner size="sm" className="me-2" />
                  Suppression...
                </>
              ) : (
                'Supprimer'
              )}
            </CButton>
          ) : (
            <CButton
              color="primary"
              onClick={handleSubmit}
              disabled={createMutation.isPending || updateMutation.isPending || !entity.name}
            >
              {createMutation.isPending || updateMutation.isPending ? (
                <>
                  <CSpinner size="sm" className="me-2" />
                  {operation === 'create' ? 'Création...' : 'Modification...'}
                </>
              ) : operation === 'create' ? (
                'Créer'
              ) : (
                'Modifier'
              )}
            </CButton>
          )}
        </CModalFooter>
      </CModal>

      {/* PARC ASSIGNMENT MODAL */}
      <CModal
        backdrop="static"
        visible={visibleListParcs}
        onClose={() => {
          setVisibleListParcs(false)
          handleResetAllAffectModal()
          setSelectedParc('')
        }}
        aria-labelledby="ParcTypepanneAssignmentModalLabel"
        size="lg"
      >
        <CModalHeader className="bg-body">
          <CModalTitle id="ParcTypepanneAssignmentModalLabel" className="text-body">
            Gestion des parcs - {selectedParcsByTypepanne?.name}
          </CModalTitle>
        </CModalHeader>
        <CModalBody className="bg-body">
          <CRow className="g-3">
            <CCol md={4}>
              <div className="border rounded p-3 bg-body h-100">
                <h6 className="text-body mb-3">Ajouter un parc</h6>
                <CFormSelect
                  id="parcSelect"
                  floatingLabel="Sélectionner un parc"
                  value={selectedParc}
                  onChange={(e) => setSelectedParc(e.target.value)}
                  disabled={affectParcTypepanneMutation.isPending}
                >
                  <option value="">Choisir un parc</option>
                  {getAllParcsQuery.data?.map((parc) => (
                    <option key={parc.id} value={parc.id}>
                      {parc.name}
                    </option>
                  ))}
                </CFormSelect>

                <CButton
                  color="primary"
                  className="w-100 mt-3"
                  onClick={handleAffecter}
                  disabled={affectParcTypepanneMutation.isPending || !selectedParc}
                >
                  {affectParcTypepanneMutation.isPending ? (
                    <>
                      <CSpinner size="sm" className="me-2" />
                      Affectation...
                    </>
                  ) : (
                    'Affecter le parc'
                  )}
                </CButton>
              </div>
            </CCol>

            <CCol md={8}>
              <div className="border rounded p-3 bg-body h-100">
                <h6 className="text-body mb-3">
                  Parcs associés ({selectedParcsByTypepanne?.parcs?.length || 0})
                </h6>
                <div className="d-flex flex-wrap gap-2">
                  {selectedParcsByTypepanne?.parcs?.length > 0 ? (
                    selectedParcsByTypepanne.parcs.map((parc) => (
                      <CCard key={parc.id} className="flex-fill">
                        <CCardBody className="py-2 px-3 d-flex justify-content-between align-items-center">
                          <span className="text-body">{parc.name}</span>
                          <CButton
                            size="sm"
                            color="danger"
                            variant="ghost"
                            onClick={() => handleDeleteAffecter(parc)}
                            disabled={deleteAffectParcToTypepanneMutation.isPending}
                            title="Supprimer l'affectation"
                          >
                            <CIcon icon={cilTrash} />
                          </CButton>
                        </CCardBody>
                      </CCard>
                    ))
                  ) : (
                    <div className="text-center text-body-secondary w-100 py-3">
                      <CIcon icon={cilWarning} className="mb-2" />
                      <div>Aucun parc associé</div>
                    </div>
                  )}
                </div>
              </div>
            </CCol>
          </CRow>

          {affectParcTypepanneMutation.isError && (
            <CAlert color="danger" className="mb-0 mt-3">
              {affectParcTypepanneMutation.error.message}
            </CAlert>
          )}

          {deleteAffectParcToTypepanneMutation.isError && (
            <CAlert color="danger" className="mb-0 mt-3">
              {deleteAffectParcToTypepanneMutation.error.message}
            </CAlert>
          )}
        </CModalBody>
        <CModalFooter className="bg-body">
          <CButton
            color="secondary"
            onClick={() => {
              setVisibleListParcs(false)
              handleResetAllAffectModal()
              setSelectedParc('')
            }}
          >
            Fermer
          </CButton>
        </CModalFooter>
      </CModal>
    </ConfigLayout>
  )
}

export default Typepannes
