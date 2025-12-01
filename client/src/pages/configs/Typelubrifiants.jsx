import React, { useState } from 'react'
import {
  CAlert,
  CBadge,
  CFormInput,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import { cilPenNib, cilTrash, cilWarning } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import TableHead from '../../components/TableHead'
import {
  useCreateTypelubrifiant,
  useDeleteTypelubrifiant,
  useTypelubrifiants,
  useUpdateTypelubrifiant,
} from '../../hooks/useTypelubrifiants'
import ConfigLayout from '../../layout/ConfigLayout'

const Typelubrifiants = () => {
  const getAllQuery = useQuery(useTypelubrifiants())

  const [visible, setVisible] = useState(false)
  const [operation, setOperation] = useState('')

  const initialVal = { id: '', name: '' }

  const [entity, setEntity] = useState(initialVal)
  const createMutation = useCreateTypelubrifiant()
  const deleteMutation = useDeleteTypelubrifiant()
  const updateMutation = useUpdateTypelubrifiant()

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
            toast.success('Type de lubrifiant ajouté avec succès.')
          },
        })
        break
      case 'delete':
        deleteMutation.mutate(data, {
          onSuccess: () => {
            setVisible(!visible)
            handleResetAll()
            toast.success('Type de lubrifiant supprimé avec succès.')
          },
        })
        break
      case 'update':
        updateMutation.mutate(data, {
          onSuccess: () => {
            setVisible(!visible)
            handleResetAll()
            toast.success('Type de lubrifiant modifié avec succès.')
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
        title="Liste des types de lubrifiants"
        getAllQuery={getAllQuery}
        search={search}
        handleSearch={handleSearch}
        setEntity={setEntity}
        initialVal={initialVal}
        setVisible={setVisible}
        visible={visible}
        setOperation={setOperation}
        tableId={'typelubrifiantsTable'}
        excelFileName={'Liste des types de lubrifiants'}
        currentEntitys={currentTypes}
        entitysPerPage={typesPerPage}
        setEntitysPerPage={setTypesPerPage}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        handlePageChange={handlePageChange}
        totalPages={totalPages}
        filteredEntitys={filteredTypes}
      />

      <CTable responsive striped hover className="mt-3" id="typelubrifiantsTable">
        <CTableHead className="bg-body">
          <CTableRow>
            <CTableHeaderCell scope="col" className="text-body">
              Nom du type de lubrifiant
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
                  </div>
                </CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow className="bg-body">
              <CTableDataCell colSpan={2} className="text-center text-body py-4">
                {getAllQuery.isLoading ? (
                  <div className="d-flex align-items-center justify-content-center gap-2">
                    <CSpinner size="sm" />
                    <span>Chargement des types de lubrifiants...</span>
                  </div>
                ) : (
                  <div>
                    <CIcon icon={cilWarning} size="xl" className="text-body-secondary mb-2" />
                    <div>Aucun type de lubrifiant trouvé</div>
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
        aria-labelledby="TypelubrifiantModalLabel"
      >
        <CModalHeader className="bg-body">
          <CModalTitle id="TypelubrifiantModalLabel" className="text-body">
            {operation === 'create' && 'Créer un type de lubrifiant'}
            {operation === 'update' && 'Modifier le type de lubrifiant'}
            {operation === 'delete' && 'Supprimer le type de lubrifiant'}
          </CModalTitle>
        </CModalHeader>
        <CModalBody className="bg-body">
          {operation === 'delete' ? (
            <div className="text-center text-body">
              <CAlert color="warning" className="mb-3">
                <strong>Attention!</strong> Cette action est irréversible.
              </CAlert>
              <p>Voulez-vous vraiment supprimer le type de lubrifiant :</p>
              <div className="border rounded p-3 bg-body">
                <strong className="text-body">{entity.name}</strong>
              </div>
            </div>
          ) : (
            <>
              <CFormInput
                type="text"
                id="typelubrifiantNameInput"
                floatingLabel="Nom du type de lubrifiant"
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
    </ConfigLayout>
  )
}

export default Typelubrifiants
