import React, { useState } from 'react'
import {
  CAlert,
  CBadge,
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
import { cilPenNib, cilTrash, cilWarning } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import TableHead from '../../components/TableHead'
import { useCreateParc, useDeleteParc, useParcs, useUpdateParc } from '../../hooks/useParcs'
import { useTypeparcs } from '../../hooks/useTypeparcs'
import ConfigLayout from '../../layout/ConfigLayout'

const Parcs = () => {
  const getAllQuery = useQuery(useParcs())
  const getAllTypeparcsQuery = useQuery(useTypeparcs())

  const [visible, setVisible] = useState(false)
  const [operation, setOperation] = useState('')

  const initialVal = { id: '', name: '', typeparcId: '' }

  const [entity, setEntity] = useState(initialVal)
  const createMutation = useCreateParc()
  const deleteMutation = useDeleteParc()
  const updateMutation = useUpdateParc()

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = {
      id: entity.id,
      name: entity.name,
      typeparcId: entity.typeparcId,
    }

    switch (operation) {
      case 'create':
        createMutation.mutate(data, {
          onSuccess: () => {
            setVisible(!visible)
            handleResetAll()
            toast.success('Parc ajouté avec succès.')
          },
        })
        break
      case 'delete':
        deleteMutation.mutate(data, {
          onSuccess: () => {
            setVisible(!visible)
            handleResetAll()
            toast.success('Parc supprimé avec succès.')
          },
        })
        break
      case 'update':
        updateMutation.mutate(data, {
          onSuccess: () => {
            setVisible(!visible)
            handleResetAll()
            toast.success('Parc modifié avec succès.')
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

  // Filter the parcs based on the search query
  const filteredParcs = getAllQuery.data?.filter(
    (parc) =>
      parc?.name?.toLowerCase().includes(search.toLowerCase()) ||
      parc?.Typeparc?.name?.toLowerCase().includes(search.toLowerCase()),
  )

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1)
  const [parcsPerPage, setParcsPerPage] = useState(10)

  // Calculate current parcs to display
  const indexOfLastParc = currentPage * parcsPerPage
  const indexOfFirstParc = indexOfLastParc - parcsPerPage
  const currentParcs = filteredParcs?.slice(indexOfFirstParc, indexOfLastParc)

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  // Calculate total pages
  const totalPages = Math.ceil(filteredParcs?.length / parcsPerPage)

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
        title="Liste des parcs"
        getAllQuery={getAllQuery}
        search={search}
        handleSearch={handleSearch}
        setEntity={setEntity}
        initialVal={initialVal}
        setVisible={setVisible}
        visible={visible}
        setOperation={setOperation}
        tableId={'parcsTable'}
        excelFileName={'Liste des parcs'}
        currentEntitys={currentParcs}
        entitysPerPage={parcsPerPage}
        setEntitysPerPage={setParcsPerPage}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        handlePageChange={handlePageChange}
        totalPages={totalPages}
        filteredEntitys={filteredParcs}
      />

      <CTable responsive striped hover className="mt-3" id="parcsTable">
        <CTableHead className="bg-body">
          <CTableRow>
            <CTableHeaderCell scope="col" className="text-body">
              Nom du parc
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" className="text-body">
              Type de parc
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" className="text-body">
              Actions
            </CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {currentParcs && currentParcs?.length > 0 ? (
            currentParcs?.map((parc) => (
              <CTableRow key={parc.id} className="bg-body">
                <CTableDataCell className="text-body fw-medium">{parc?.name}</CTableDataCell>

                <CTableDataCell className="text-body">
                  {parc?.Typeparc?.name ? (
                    <CBadge color="primary">{parc.Typeparc.name}</CBadge>
                  ) : (
                    <span className="text-body-secondary">Non défini</span>
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
                        setEntity(parc)
                        setOperation('update')
                        setVisible(true)
                      }}
                      title="Modifier le parc"
                    >
                      <CIcon icon={cilPenNib} />
                    </CButton>
                    <CButton
                      size="sm"
                      color="danger"
                      variant="outline"
                      className="rounded-pill"
                      onClick={() => {
                        setEntity(parc)
                        setOperation('delete')
                        setVisible(true)
                      }}
                      title="Supprimer le parc"
                    >
                      <CIcon icon={cilTrash} />
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
                    <span>Chargement des parcs...</span>
                  </div>
                ) : (
                  <div>
                    <CIcon icon={cilWarning} size="xl" className="text-body-secondary mb-2" />
                    <div>Aucun parc trouvé</div>
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
        aria-labelledby="ParcModalLabel"
      >
        <CModalHeader className="bg-body">
          <CModalTitle id="ParcModalLabel" className="text-body">
            {operation === 'create' && 'Créer un parc'}
            {operation === 'update' && 'Modifier le parc'}
            {operation === 'delete' && 'Supprimer le parc'}
          </CModalTitle>
        </CModalHeader>
        <CModalBody className="bg-body">
          {operation === 'delete' ? (
            <div className="text-center text-body">
              <CAlert color="warning" className="mb-3">
                <strong>Attention!</strong> Cette action est irréversible.
              </CAlert>
              <p>Voulez-vous vraiment supprimer le parc :</p>
              <div className="border rounded p-3 bg-body">
                <strong className="text-body">{entity.name}</strong>
                <div className="text-body-secondary">
                  {entity.Typeparc?.name && `Type: ${entity.Typeparc.name}`}
                </div>
              </div>
            </div>
          ) : (
            <>
              <CRow className="g-3">
                <CCol md={6}>
                  <CFormInput
                    type="text"
                    id="parcNameInput"
                    floatingLabel="Nom du parc"
                    placeholder="Entrez le nom du parc"
                    value={entity.name}
                    onChange={(e) => setEntity({ ...entity, name: e.target.value })}
                    disabled={createMutation.isPending || updateMutation.isPending}
                  />
                </CCol>

                <CCol md={6}>
                  <CFormSelect
                    id="typeParcSelect"
                    floatingLabel="Type de parc"
                    value={entity.typeparcId}
                    onChange={(e) => setEntity({ ...entity, typeparcId: e.target.value })}
                    disabled={createMutation.isPending || updateMutation.isPending}
                  >
                    <option value="">Sélectionnez un type</option>
                    {getAllTypeparcsQuery.data?.map((typeparc) => (
                      <option key={typeparc.id} value={typeparc.id}>
                        {typeparc.name}
                      </option>
                    ))}
                  </CFormSelect>
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
                !entity.typeparcId
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
    </ConfigLayout>
  )
}

export default Parcs
