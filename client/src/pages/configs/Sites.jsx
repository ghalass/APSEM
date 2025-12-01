import React, { useState } from 'react'
import {
  CAlert,
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
import { fecthSitesQuery, useCreateSite, useDeleteSite, useUpdateSite } from '../../hooks/useSites'
import { toast } from 'react-toastify'
import TableHead from '../../components/TableHead'
import ConfigLayout from '../../layout/ConfigLayout'

const Sites = () => {
  const getAllQuery = useQuery(fecthSitesQuery())

  const [visible, setVisible] = useState(false)
  const [operation, setOperation] = useState('')
  const initialVal = { id: '', name: '' }

  const [entity, setEntity] = useState(initialVal)
  const createMutation = useCreateSite()
  const deleteMutation = useDeleteSite()
  const updateMutation = useUpdateSite()

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
            toast.success('Site ajouté avec succès.')
          },
        })
        break
      case 'delete':
        deleteMutation.mutate(data, {
          onSuccess: () => {
            setVisible(!visible)
            handleResetAll()
            toast.success('Site supprimé avec succès.')
          },
        })
        break
      case 'update':
        updateMutation.mutate(data, {
          onSuccess: () => {
            setVisible(!visible)
            handleResetAll()
            toast.success('Site modifié avec succès.')
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

  // Filter the sites based on the search query
  const filteredSites = getAllQuery.data?.filter((site) =>
    site.name.toLowerCase().includes(search.toLowerCase()),
  )

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1)
  const [sitesPerPage, setSitesPerPage] = useState(10)

  // Calculate current sites to display
  const indexOfLastSite = currentPage * sitesPerPage
  const indexOfFirstSite = indexOfLastSite - sitesPerPage
  const currentSites = filteredSites?.slice(indexOfFirstSite, indexOfLastSite)

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  // Calculate total pages
  const totalPages = Math.ceil(filteredSites?.length / sitesPerPage)

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
        title="Liste des sites"
        getAllQuery={getAllQuery}
        search={search}
        handleSearch={handleSearch}
        setEntity={setEntity}
        initialVal={initialVal}
        setVisible={setVisible}
        visible={visible}
        setOperation={setOperation}
        tableId={'sitesTable'}
        excelFileName={'Liste des sites'}
        currentEntitys={currentSites}
        entitysPerPage={sitesPerPage}
        setEntitysPerPage={setSitesPerPage}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        handlePageChange={handlePageChange}
        totalPages={totalPages}
        filteredEntitys={filteredSites}
      />

      <CTable responsive striped hover className="mt-3" id="sitesTable">
        <CTableHead className="bg-body">
          <CTableRow>
            <CTableHeaderCell scope="col" className="text-body">
              Nom du site
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" className="text-body">
              Actions
            </CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {currentSites && currentSites?.length > 0 ? (
            currentSites?.map((site) => (
              <CTableRow key={site.id} className="bg-body">
                <CTableDataCell className="text-body fw-medium">{site?.name}</CTableDataCell>

                <CTableDataCell>
                  <div className="d-flex gap-1">
                    <CButton
                      size="sm"
                      color="primary"
                      variant="outline"
                      className="rounded-pill"
                      onClick={() => {
                        setEntity(site)
                        setOperation('update')
                        setVisible(true)
                      }}
                      title="Modifier le site"
                    >
                      <CIcon icon={cilPenNib} />
                    </CButton>
                    <CButton
                      size="sm"
                      color="danger"
                      variant="outline"
                      className="rounded-pill"
                      onClick={() => {
                        setEntity(site)
                        setOperation('delete')
                        setVisible(true)
                      }}
                      title="Supprimer le site"
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
                    <span>Chargement des sites...</span>
                  </div>
                ) : (
                  <div>
                    <CIcon icon={cilWarning} size="xl" className="text-body-secondary mb-2" />
                    <div>Aucun site trouvé</div>
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
        aria-labelledby="SiteModalLabel"
      >
        <CModalHeader className="bg-body">
          <CModalTitle id="SiteModalLabel" className="text-body">
            {operation === 'create' && 'Créer un site'}
            {operation === 'update' && 'Modifier le site'}
            {operation === 'delete' && 'Supprimer le site'}
          </CModalTitle>
        </CModalHeader>
        <CModalBody className="bg-body">
          {operation === 'delete' ? (
            <div className="text-center text-body">
              <CAlert color="warning" className="mb-3">
                <strong>Attention!</strong> Cette action est irréversible.
              </CAlert>
              <p>Voulez-vous vraiment supprimer le site :</p>
              <div className="border rounded p-3 bg-body">
                <strong className="text-body">{entity.name}</strong>
              </div>
            </div>
          ) : (
            <>
              <CFormInput
                type="text"
                id="siteNameInput"
                floatingLabel="Nom du site"
                placeholder="Entrez le nom du site"
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

export default Sites
