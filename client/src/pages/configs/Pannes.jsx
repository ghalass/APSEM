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
import { useCreatePanne, useDeletePanne, usePannes, useUpdatePanne } from '../../hooks/usePannes'
import { useTypepannes } from '../../hooks/useTypepannes'
import ConfigLayout from '../../layout/ConfigLayout'

const Pannes = () => {
  const getAllQuery = useQuery(usePannes())
  const getAllTypepannesQuery = useQuery(useTypepannes())

  const [visible, setVisible] = useState(false)
  const [operation, setOperation] = useState('')

  const initialVal = { id: '', name: '', typepanneId: '' }

  const [entity, setEntity] = useState(initialVal)
  const createMutation = useCreatePanne()
  const deleteMutation = useDeletePanne()
  const updateMutation = useUpdatePanne()

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = {
      id: entity.id,
      name: entity.name,
      typepanneId: entity.typepanneId,
    }

    switch (operation) {
      case 'create':
        createMutation.mutate(data, {
          onSuccess: () => {
            setVisible(!visible)
            handleResetAll()
            toast.success('Panne ajoutée avec succès.')
          },
        })
        break
      case 'delete':
        deleteMutation.mutate(data, {
          onSuccess: () => {
            setVisible(!visible)
            handleResetAll()
            toast.success('Panne supprimée avec succès.')
          },
        })
        break
      case 'update':
        updateMutation.mutate(data, {
          onSuccess: () => {
            setVisible(!visible)
            handleResetAll()
            toast.success('Panne modifiée avec succès.')
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

  // Filter the pannes based on the search query
  const filteredPannes = getAllQuery.data?.filter(
    (panne) =>
      panne?.name?.toLowerCase().includes(search.toLowerCase()) ||
      panne?.Typepanne?.name?.toLowerCase().includes(search.toLowerCase()),
  )

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1)
  const [pannesPerPage, setPannesPerPage] = useState(10)

  // Calculate current pannes to display
  const indexOfLastPanne = currentPage * pannesPerPage
  const indexOfFirstPanne = indexOfLastPanne - pannesPerPage
  const currentPannes = filteredPannes?.slice(indexOfFirstPanne, indexOfLastPanne)

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  // Calculate total pages
  const totalPages = Math.ceil(filteredPannes?.length / pannesPerPage)

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
        title="Liste des pannes"
        getAllQuery={getAllQuery}
        search={search}
        handleSearch={handleSearch}
        setEntity={setEntity}
        initialVal={initialVal}
        setVisible={setVisible}
        visible={visible}
        setOperation={setOperation}
        tableId={'pannesTable'}
        excelFileName={'Liste des pannes'}
        currentEntitys={currentPannes}
        entitysPerPage={pannesPerPage}
        setEntitysPerPage={setPannesPerPage}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        handlePageChange={handlePageChange}
        totalPages={totalPages}
        filteredEntitys={filteredPannes}
      />

      <CTable responsive striped hover className="mt-3" id="pannesTable">
        <CTableHead className="bg-body">
          <CTableRow>
            <CTableHeaderCell scope="col" className="text-body">
              Nom de la panne
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" className="text-body">
              Type de panne
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" className="text-body">
              Actions
            </CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {currentPannes && currentPannes?.length > 0 ? (
            currentPannes?.map((panne) => (
              <CTableRow key={panne.id} className="bg-body">
                <CTableDataCell className="text-body fw-medium">{panne?.name}</CTableDataCell>

                <CTableDataCell className="text-body">
                  {panne?.Typepanne?.name ? (
                    <CBadge color="primary">{panne.Typepanne.name}</CBadge>
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
                        setEntity(panne)
                        setOperation('update')
                        setVisible(true)
                      }}
                      title="Modifier la panne"
                    >
                      <CIcon icon={cilPenNib} />
                    </CButton>
                    <CButton
                      size="sm"
                      color="danger"
                      variant="outline"
                      className="rounded-pill"
                      onClick={() => {
                        setEntity(panne)
                        setOperation('delete')
                        setVisible(true)
                      }}
                      title="Supprimer la panne"
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
                    <span>Chargement des pannes...</span>
                  </div>
                ) : (
                  <div>
                    <CIcon icon={cilWarning} size="xl" className="text-body-secondary mb-2" />
                    <div>Aucune panne trouvée</div>
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
        aria-labelledby="PanneModalLabel"
      >
        <CModalHeader className="bg-body">
          <CModalTitle id="PanneModalLabel" className="text-body">
            {operation === 'create' && 'Créer une panne'}
            {operation === 'update' && 'Modifier la panne'}
            {operation === 'delete' && 'Supprimer la panne'}
          </CModalTitle>
        </CModalHeader>
        <CModalBody className="bg-body">
          {operation === 'delete' ? (
            <div className="text-center text-body">
              <CAlert color="warning" className="mb-3">
                <strong>Attention!</strong> Cette action est irréversible.
              </CAlert>
              <p>Voulez-vous vraiment supprimer la panne :</p>
              <div className="border rounded p-3 bg-body">
                <strong className="text-body">{entity.name}</strong>
                <div className="text-body-secondary">
                  {entity.Typepanne?.name && `Type: ${entity.Typepanne.name}`}
                </div>
              </div>
            </div>
          ) : (
            <>
              <CRow className="g-3">
                <CCol md={6}>
                  <CFormInput
                    type="text"
                    id="panneNameInput"
                    floatingLabel="Nom de la panne"
                    placeholder="Entrez le nom de la panne"
                    value={entity.name}
                    onChange={(e) => setEntity({ ...entity, name: e.target.value })}
                    disabled={createMutation.isPending || updateMutation.isPending}
                  />
                </CCol>

                <CCol md={6}>
                  <CFormSelect
                    id="typePanneSelect"
                    floatingLabel="Type de panne"
                    value={entity.typepanneId}
                    onChange={(e) => setEntity({ ...entity, typepanneId: e.target.value })}
                    disabled={createMutation.isPending || updateMutation.isPending}
                  >
                    <option value="">Sélectionnez un type</option>
                    {getAllTypepannesQuery.data?.map((typepanne) => (
                      <option key={typepanne.id} value={typepanne.id}>
                        {typepanne.name}
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
    </ConfigLayout>
  )
}

export default Pannes
