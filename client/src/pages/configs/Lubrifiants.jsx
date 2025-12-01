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
  CRow,
  CCol,
} from '@coreui/react'
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import { cilCloudDownload, cilPenNib, cilPlus, cilTrash, cilWarning } from '@coreui/icons'
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
import TableHead from '../../components/TableHead'
import { useParcs } from '../../hooks/useParcs'
import ConfigLayout from '../../layout/ConfigLayout'

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
            toast.success('Lubrifiant ajouté avec succès.')
          },
        })
        break
      case 'delete':
        deleteMutation.mutate(data, {
          onSuccess: () => {
            setVisible(!visible)
            handleResetAll()
            toast.success('Lubrifiant supprimé avec succès.')
          },
        })
        break
      case 'update':
        updateMutation.mutate(data, {
          onSuccess: () => {
            setVisible(!visible)
            handleResetAll()
            toast.success('Lubrifiant modifié avec succès.')
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

  // Filter the lubrifiants based on the search query
  const filteredLubrifiants = getAllQuery.data?.filter(
    (lubrifiant) =>
      lubrifiant?.name?.toLowerCase().includes(search.toLowerCase()) ||
      lubrifiant?.Typelubrifiant?.name?.toLowerCase().includes(search.toLowerCase()),
  )

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1)
  const [lubrifiantsPerPage, setLubrifiantsPerPage] = useState(10)

  // Calculate current lubrifiants to display
  const indexOfLastLubrifiant = currentPage * lubrifiantsPerPage
  const indexOfFirstLubrifiant = indexOfLastLubrifiant - lubrifiantsPerPage
  const currentLubrifiants = filteredLubrifiants?.slice(
    indexOfFirstLubrifiant,
    indexOfLastLubrifiant,
  )

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  // Calculate total pages
  const totalPages = Math.ceil(filteredLubrifiants?.length / lubrifiantsPerPage)

  //
  // PARC => LUBRIFIANT
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
        toast.success('Parc affecté avec succès.')
        const newParc = {
          id: newData?.parc?.id,
          name: newData?.parc?.name,
        }
        // Update state immutably
        setSelectedParcsByLubrifiant((prev) => ({
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
      lubrifiant_id: selectedParcsByLubrifiant?.id,
    }

    deleteAffectParcToLubrifiantMutation.mutate(data, {
      onSuccess: () => {
        toast.success('Affectation supprimée avec succès.')
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
        title="Liste des lubrifiants"
        getAllQuery={getAllQuery}
        search={search}
        handleSearch={handleSearch}
        setEntity={setEntity}
        initialVal={initialVal}
        setVisible={setVisible}
        visible={visible}
        setOperation={setOperation}
        tableId={'lubrifiantsTable'}
        excelFileName={'Liste des lubrifiants'}
        currentEntitys={currentLubrifiants}
        entitysPerPage={lubrifiantsPerPage}
        setEntitysPerPage={setLubrifiantsPerPage}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        handlePageChange={handlePageChange}
        totalPages={totalPages}
        filteredEntitys={filteredLubrifiants}
      />

      <CTable responsive striped hover className="mt-3" id="lubrifiantsTable">
        <CTableHead className="bg-body">
          <CTableRow>
            <CTableHeaderCell scope="col" className="text-body">
              Nom
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" className="text-body">
              Type
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
          {currentLubrifiants && currentLubrifiants?.length > 0 ? (
            currentLubrifiants?.map((lubrifiant) => (
              <CTableRow key={lubrifiant.id} className="bg-body">
                <CTableDataCell className="text-body fw-medium">{lubrifiant?.name}</CTableDataCell>

                <CTableDataCell className="text-body">
                  {lubrifiant?.Typelubrifiant?.name || '-'}
                </CTableDataCell>

                <CTableDataCell>
                  {lubrifiant?.parcs?.length > 0 ? (
                    <div className="d-flex flex-wrap gap-1">
                      {lubrifiant.parcs.map((parc, index) => (
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
                        setEntity(lubrifiant)
                        setOperation('update')
                        setVisible(true)
                      }}
                      title="Modifier le lubrifiant"
                    >
                      <CIcon icon={cilPenNib} />
                    </CButton>
                    <CButton
                      size="sm"
                      color="danger"
                      variant="outline"
                      className="rounded-pill"
                      onClick={() => {
                        setEntity(lubrifiant)
                        setOperation('delete')
                        setVisible(true)
                      }}
                      title="Supprimer le lubrifiant"
                    >
                      <CIcon icon={cilTrash} />
                    </CButton>
                    <CButton
                      size="sm"
                      color="info"
                      variant="outline"
                      className="rounded-pill"
                      onClick={() => {
                        setSelectedParcsByLubrifiant(lubrifiant)
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
              <CTableDataCell colSpan={4} className="text-center text-body py-4">
                {getAllQuery.isLoading ? (
                  <div className="d-flex align-items-center justify-content-center gap-2">
                    <CSpinner size="sm" />
                    <span>Chargement des lubrifiants...</span>
                  </div>
                ) : (
                  <div>
                    <CIcon icon={cilWarning} size="xl" className="text-body-secondary mb-2" />
                    <div>Aucun lubrifiant trouvé</div>
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
        aria-labelledby="LubrifiantModalLabel"
      >
        <CModalHeader className="bg-body">
          <CModalTitle id="LubrifiantModalLabel" className="text-body">
            {operation === 'create' && 'Créer un lubrifiant'}
            {operation === 'update' && 'Modifier le lubrifiant'}
            {operation === 'delete' && 'Supprimer le lubrifiant'}
          </CModalTitle>
        </CModalHeader>
        <CModalBody className="bg-body">
          {operation === 'delete' ? (
            <div className="text-center text-body">
              <CAlert color="warning" className="mb-3">
                <strong>Attention!</strong> Cette action est irréversible.
              </CAlert>
              <p>Voulez-vous vraiment supprimer le lubrifiant :</p>
              <div className="border rounded p-3 bg-body">
                <strong className="text-body">{entity.name}</strong>
                <div className="text-body-secondary">
                  {entity.Typelubrifiant?.name && `Type: ${entity.Typelubrifiant.name}`}
                </div>
              </div>
            </div>
          ) : (
            <>
              <CRow className="g-3">
                <CCol md={6}>
                  <CFormSelect
                    id="typeLubrifiantSelect"
                    floatingLabel="Type de lubrifiant"
                    value={entity.typelubrifiantId}
                    onChange={(e) => setEntity({ ...entity, typelubrifiantId: e.target.value })}
                    disabled={createMutation.isPending || updateMutation.isPending}
                  >
                    <option value="">Sélectionnez un type</option>
                    {getAllTypelubrifiantsQuery.data?.map((typelubrifiant) => (
                      <option key={typelubrifiant.id} value={typelubrifiant.id}>
                        {typelubrifiant.name}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>

                <CCol md={6}>
                  <CFormInput
                    type="text"
                    id="lubrifiantNameInput"
                    floatingLabel="Nom du lubrifiant"
                    placeholder="Entrez le nom"
                    value={entity.name}
                    onChange={(e) => setEntity({ ...entity, name: e.target.value })}
                    disabled={createMutation.isPending || updateMutation.isPending}
                  />
                </CCol>
              </CRow>

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
              disabled={
                createMutation.isPending ||
                updateMutation.isPending ||
                !entity.name ||
                !entity.typelubrifiantId
              }
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
        aria-labelledby="ParcAssignmentModalLabel"
        size="lg"
      >
        <CModalHeader className="bg-body">
          <CModalTitle id="ParcAssignmentModalLabel" className="text-body">
            Gestion des parcs - {selectedParcsByLubrifiant?.name}
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
                  disabled={affectParcLubrifiantMutation.isPending}
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
                  disabled={affectParcLubrifiantMutation.isPending || !selectedParc}
                >
                  {affectParcLubrifiantMutation.isPending ? (
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
                  Parcs associés ({selectedParcsByLubrifiant?.parcs?.length || 0})
                </h6>
                <div className="d-flex flex-wrap gap-2">
                  {selectedParcsByLubrifiant?.parcs?.length > 0 ? (
                    selectedParcsByLubrifiant.parcs.map((parc) => (
                      <CCard key={parc.id} className="flex-fill">
                        <CCardBody className="py-2 px-3 d-flex justify-content-between align-items-center">
                          <span className="text-body">{parc.name}</span>
                          <CButton
                            size="sm"
                            color="danger"
                            variant="ghost"
                            onClick={() => handleDeleteAffecter(parc)}
                            disabled={deleteAffectParcToLubrifiantMutation.isPending}
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

          {affectParcLubrifiantMutation.isError && (
            <CAlert color="danger" className="mb-0 mt-3">
              {affectParcLubrifiantMutation.error.message}
            </CAlert>
          )}

          {deleteAffectParcToLubrifiantMutation.isError && (
            <CAlert color="danger" className="mb-0 mt-3">
              {deleteAffectParcToLubrifiantMutation.error.message}
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

export default Lubrifiants
