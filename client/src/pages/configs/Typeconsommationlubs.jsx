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
  CRow,
  CCol,
  CBadge,
} from '@coreui/react'
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import { cilPenNib, cilPlus, cilTrash, cilWarning } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import TableHead from '../../components/TableHead'
import {
  useCreateAffectParcToCode,
  useCreateTypeconsommationlub,
  useDeleteAffectParcToCode,
  useDeleteTypeconsommationlub,
  useTypeconsommationlubs,
  useUpdateTypeconsommationlub,
} from '../../hooks/useTypeconsommationlubs'
import { useParcs } from '../../hooks/useParcs'
import ConfigLayout from '../../layout/ConfigLayout'

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
            toast.success('Code de consommation ajouté avec succès.')
          },
        })
        break
      case 'delete':
        deleteMutation.mutate(data, {
          onSuccess: () => {
            setVisible(!visible)
            handleResetAll()
            toast.success('Code de consommation supprimé avec succès.')
          },
        })
        break
      case 'update':
        updateMutation.mutate(data, {
          onSuccess: () => {
            setVisible(!visible)
            handleResetAll()
            toast.success('Code de consommation modifié avec succès.')
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

  // Filter the codes based on the search query
  const filteredCodes = getAllQuery.data?.filter((code) => {
    const searchTerm = search.toLowerCase()
    const nameMatches = code?.name?.toLowerCase().includes(searchTerm)
    const parcMatches = code?.parcs?.some((p) => p?.parc?.name?.toLowerCase().includes(searchTerm))
    return nameMatches || parcMatches
  })

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1)
  const [codesPerPage, setCodesPerPage] = useState(10)

  // Calculate current codes to display
  const indexOfLastCode = currentPage * codesPerPage
  const indexOfFirstCode = indexOfLastCode - codesPerPage
  const currentCodes = filteredCodes?.slice(indexOfFirstCode, indexOfLastCode)

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  // Calculate total pages
  const totalPages = Math.ceil(filteredCodes?.length / codesPerPage)

  //
  // PARC => CODE
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
        toast.success('Parc affecté avec succès.')
        const newParc = {
          parcId: newData?.parcId,
          typeconsommationlubId: newData?.typeconsommationlubId,
          parc: newData?.parc,
        }
        setSelectedParcsByCode((prev) => ({
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
      parc_id: affectation?.parcId,
      typeconsommationlub_id: affectation?.typeconsommationlubId,
    }
    deleteAffectParcToCodeMutation.mutate(data, {
      onSuccess: () => {
        toast.success('Affectation supprimée avec succès.')
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
        title="Liste des codes de consommation"
        getAllQuery={getAllQuery}
        search={search}
        handleSearch={handleSearch}
        setEntity={setEntity}
        initialVal={initialVal}
        setVisible={setVisible}
        visible={visible}
        setOperation={setOperation}
        tableId={'codesTable'}
        excelFileName={'Liste des codes de consommation'}
        currentEntitys={currentCodes}
        entitysPerPage={codesPerPage}
        setEntitysPerPage={setCodesPerPage}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        handlePageChange={handlePageChange}
        totalPages={totalPages}
        filteredEntitys={filteredCodes}
      />

      <CTable responsive striped hover className="mt-3" id="codesTable">
        <CTableHead className="bg-body">
          <CTableRow>
            <CTableHeaderCell scope="col" className="text-body">
              Code
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
          {currentCodes && currentCodes?.length > 0 ? (
            currentCodes?.map((code) => (
              <CTableRow key={code.id} className="bg-body">
                <CTableDataCell className="text-body fw-medium">{code?.name}</CTableDataCell>

                <CTableDataCell>
                  {code?.parcs?.length > 0 ? (
                    <div className="d-flex flex-wrap gap-1">
                      {code.parcs.map((parcAffectation, index) => (
                        <CBadge key={index} color="primary" className="text-capitalize">
                          {parcAffectation.parc?.name}
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
                        setEntity(code)
                        setOperation('update')
                        setVisible(true)
                      }}
                      title="Modifier le code"
                    >
                      <CIcon icon={cilPenNib} />
                    </CButton>
                    <CButton
                      size="sm"
                      color="danger"
                      variant="outline"
                      className="rounded-pill"
                      onClick={() => {
                        setEntity(code)
                        setOperation('delete')
                        setVisible(true)
                      }}
                      title="Supprimer le code"
                    >
                      <CIcon icon={cilTrash} />
                    </CButton>
                    <CButton
                      size="sm"
                      color="info"
                      variant="outline"
                      className="rounded-pill"
                      onClick={() => {
                        setSelectedParcsByCode(code)
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
                    <span>Chargement des codes...</span>
                  </div>
                ) : (
                  <div>
                    <CIcon icon={cilWarning} size="xl" className="text-body-secondary mb-2" />
                    <div>Aucun code trouvé</div>
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
        aria-labelledby="CodeModalLabel"
      >
        <CModalHeader className="bg-body">
          <CModalTitle id="CodeModalLabel" className="text-body">
            {operation === 'create' && 'Créer un code de consommation'}
            {operation === 'update' && 'Modifier le code de consommation'}
            {operation === 'delete' && 'Supprimer le code de consommation'}
          </CModalTitle>
        </CModalHeader>
        <CModalBody className="bg-body">
          {operation === 'delete' ? (
            <div className="text-center text-body">
              <CAlert color="warning" className="mb-3">
                <strong>Attention!</strong> Cette action est irréversible.
              </CAlert>
              <p>Voulez-vous vraiment supprimer le code :</p>
              <div className="border rounded p-3 bg-body">
                <strong className="text-body">{entity.name}</strong>
              </div>
            </div>
          ) : (
            <>
              <CFormInput
                type="text"
                id="codeNameInput"
                floatingLabel="Nom du code de consommation"
                placeholder="Entrez le nom du code"
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
        aria-labelledby="ParcCodeAssignmentModalLabel"
        size="lg"
      >
        <CModalHeader className="bg-body">
          <CModalTitle id="ParcCodeAssignmentModalLabel" className="text-body">
            Gestion des parcs - {selectedParcsByCode?.name}
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
                  disabled={affectParcToCodeMutation.isPending}
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
                  disabled={affectParcToCodeMutation.isPending || !selectedParc}
                >
                  {affectParcToCodeMutation.isPending ? (
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
                  Parcs associés ({selectedParcsByCode?.parcs?.length || 0})
                </h6>
                <div className="d-flex flex-wrap gap-2">
                  {selectedParcsByCode?.parcs?.length > 0 ? (
                    selectedParcsByCode.parcs.map((parcAffectation) => (
                      <CCard key={parcAffectation.parcId} className="flex-fill">
                        <CCardBody className="py-2 px-3 d-flex justify-content-between align-items-center">
                          <span className="text-body">{parcAffectation.parc?.name}</span>
                          <CButton
                            size="sm"
                            color="danger"
                            variant="ghost"
                            onClick={() => handleDeleteAffecter(parcAffectation)}
                            disabled={deleteAffectParcToCodeMutation.isPending}
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

          {affectParcToCodeMutation.isError && (
            <CAlert color="danger" className="mb-0 mt-3">
              {affectParcToCodeMutation.error.message}
            </CAlert>
          )}

          {deleteAffectParcToCodeMutation.isError && (
            <CAlert color="danger" className="mb-0 mt-3">
              {deleteAffectParcToCodeMutation.error.message}
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

export default Typeconsommationlubs
