import React, { useState } from 'react'
import {
  CAlert,
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
import { cilPenNib, cilTrash, cilWarning } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import TableHead from '../../components/TableHead'
import {
  fecthObjectifsQuery,
  useCreateObjectif,
  useDeleteObjectif,
  useUpdateObjectif,
} from '../../hooks/useObjectifs'
import { fecthSitesQuery } from '../../hooks/useSites'
import { useParcs } from '../../hooks/useParcs'
import ConfigLayout from '../../layout/ConfigLayout'

const Objectifs = () => {
  const getAllQuery = useQuery(fecthObjectifsQuery())
  const sitesQuery = useQuery(fecthSitesQuery())
  const parcsQuery = useQuery(useParcs())

  const [visible, setVisible] = useState(false)
  const [operation, setOperation] = useState('')
  const initialVal = {
    id: '',
    annee: new Date().getFullYear().toString(),
    parcId: '',
    siteId: '',
    dispo: '',
    mtbf: '',
    tdm: '',
    spe_huile: '',
    spe_go: '',
    spe_graisse: '',
  }

  const [entity, setEntity] = useState(initialVal)
  const createMutation = useCreateObjectif()
  const deleteMutation = useDeleteObjectif()
  const updateMutation = useUpdateObjectif()

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = {
      id: entity.id,
      annee: entity.annee,
      parcId: entity.parcId,
      siteId: entity.siteId,
      dispo: entity.dispo,
      mtbf: entity.mtbf,
      tdm: entity.tdm,
      spe_huile: entity.spe_huile,
      spe_go: entity.spe_go,
      spe_graisse: entity.spe_graisse,
    }

    switch (operation) {
      case 'create':
        createMutation.mutate(data, {
          onSuccess: () => {
            setVisible(!visible)
            handleResetAll()
            toast.success('Objectif ajouté avec succès.')
          },
        })
        break
      case 'delete':
        deleteMutation.mutate(data, {
          onSuccess: () => {
            setVisible(!visible)
            handleResetAll()
            toast.success('Objectif supprimé avec succès.')
          },
        })
        break
      case 'update':
        updateMutation.mutate(data, {
          onSuccess: () => {
            setVisible(!visible)
            handleResetAll()
            toast.success('Objectif modifié avec succès.')
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

  // Filter the objectifs based on the search query
  const filteredObjectifs = getAllQuery.data?.filter((objectif) =>
    String(objectif?.annee || '')
      .toLowerCase()
      .includes(search.toLowerCase()),
  )

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1)
  const [objectifsPerPage, setObjectifsPerPage] = useState(10)

  // Calculate current objectifs to display
  const indexOfLastObjectif = currentPage * objectifsPerPage
  const indexOfFirstObjectif = indexOfLastObjectif - objectifsPerPage
  const currentObjectifs = filteredObjectifs?.slice(indexOfFirstObjectif, indexOfLastObjectif)

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  // Calculate total pages
  const totalPages = Math.ceil(filteredObjectifs?.length / objectifsPerPage)

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
        title="Liste des objectifs"
        getAllQuery={getAllQuery}
        search={search}
        handleSearch={handleSearch}
        setEntity={setEntity}
        initialVal={initialVal}
        setVisible={setVisible}
        visible={visible}
        setOperation={setOperation}
        tableId={'objectifsTable'}
        excelFileName={'Liste des objectifs'}
        currentEntitys={currentObjectifs}
        entitysPerPage={objectifsPerPage}
        setEntitysPerPage={setObjectifsPerPage}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        handlePageChange={handlePageChange}
        totalPages={totalPages}
        filteredEntitys={filteredObjectifs}
      />

      <CTable responsive striped hover className="mt-3" id="objectifsTable">
        <CTableHead className="bg-body">
          <CTableRow>
            <CTableHeaderCell scope="col" className="text-body border-end"></CTableHeaderCell>
            <CTableHeaderCell scope="col" className="text-body border-end"></CTableHeaderCell>
            <CTableHeaderCell scope="col" className="text-body border-end"></CTableHeaderCell>
            <CTableHeaderCell scope="col" className="text-body border-end"></CTableHeaderCell>
            <CTableHeaderCell scope="col" className="text-body border-end"></CTableHeaderCell>
            <CTableHeaderCell scope="col" className="text-body border-end"></CTableHeaderCell>
            <CTableHeaderCell scope="col" colSpan={3} className="text-center border bg-body">
              SPÉCIFIQUE
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" className="text-body">
              Actions
            </CTableHeaderCell>
          </CTableRow>

          <CTableRow>
            <CTableHeaderCell scope="col" className="text-body">
              Année
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" className="text-body">
              Parc
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" className="text-body">
              Site
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" className="text-body">
              DISP
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" className="text-body">
              MTBF
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" className="text-body">
              TDM
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" className="text-body text-center border-start">
              HUILE
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" className="text-body text-center">
              GO
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" className="text-body text-center border-end">
              GRAISSE
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" className="text-body"></CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {currentObjectifs && currentObjectifs?.length > 0 ? (
            currentObjectifs?.map((objectif) => (
              <CTableRow key={objectif.id} className="bg-body">
                <CTableDataCell className="text-body fw-medium">{objectif?.annee}</CTableDataCell>

                <CTableDataCell className="text-body">{objectif?.Parc?.name || '-'}</CTableDataCell>

                <CTableDataCell className="text-body">{objectif?.Site?.name || '-'}</CTableDataCell>

                <CTableDataCell className="text-body">
                  <CBadge color="info">{objectif?.dispo || '0'}</CBadge>
                </CTableDataCell>

                <CTableDataCell className="text-body">
                  <CBadge color="primary">{objectif?.mtbf || '0'}</CBadge>
                </CTableDataCell>

                <CTableDataCell className="text-body">
                  <CBadge color="warning">{objectif?.tdm || '0'}</CBadge>
                </CTableDataCell>

                <CTableDataCell className="text-body text-center border-start">
                  <CBadge color="success">{objectif?.spe_huile || '0'}</CBadge>
                </CTableDataCell>

                <CTableDataCell className="text-body text-center">
                  <CBadge color="success">{objectif?.spe_go || '0'}</CBadge>
                </CTableDataCell>

                <CTableDataCell className="text-body text-center border-end">
                  <CBadge color="success">{objectif?.spe_graisse || '0'}</CBadge>
                </CTableDataCell>

                <CTableDataCell>
                  <div className="d-flex gap-1">
                    <CButton
                      size="sm"
                      color="primary"
                      variant="outline"
                      className="rounded-pill"
                      onClick={() => {
                        setEntity(objectif)
                        setOperation('update')
                        setVisible(true)
                      }}
                      title="Modifier l'objectif"
                    >
                      <CIcon icon={cilPenNib} />
                    </CButton>
                    <CButton
                      size="sm"
                      color="danger"
                      variant="outline"
                      className="rounded-pill"
                      onClick={() => {
                        setEntity(objectif)
                        setOperation('delete')
                        setVisible(true)
                      }}
                      title="Supprimer l'objectif"
                    >
                      <CIcon icon={cilTrash} />
                    </CButton>
                  </div>
                </CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow className="bg-body">
              <CTableDataCell colSpan={10} className="text-center text-body py-4">
                {getAllQuery.isLoading ? (
                  <div className="d-flex align-items-center justify-content-center gap-2">
                    <CSpinner size="sm" />
                    <span>Chargement des objectifs...</span>
                  </div>
                ) : (
                  <div>
                    <CIcon icon={cilWarning} size="xl" className="text-body-secondary mb-2" />
                    <div>Aucun objectif trouvé</div>
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
        aria-labelledby="ObjectifModalLabel"
        size="lg"
      >
        <CModalHeader className="bg-body">
          <CModalTitle id="ObjectifModalLabel" className="text-body">
            {operation === 'create' && 'Créer un objectif'}
            {operation === 'update' && "Modifier l'objectif"}
            {operation === 'delete' && "Supprimer l'objectif"}
          </CModalTitle>
        </CModalHeader>
        <CModalBody className="bg-body">
          {operation === 'delete' ? (
            <div className="text-center text-body">
              <CAlert color="warning" className="mb-3">
                <strong>Attention!</strong> Cette action est irréversible.
              </CAlert>
              <p>Voulez-vous vraiment supprimer l'objectif :</p>
              <div className="border rounded p-3 bg-body">
                <strong className="text-body">Année: {entity.annee}</strong>
                <div className="text-body-secondary">
                  Parc: {entity.Parc?.name || entity.parcId} | Site:{' '}
                  {entity.Site?.name || entity.siteId}
                </div>
              </div>
            </div>
          ) : (
            <>
              <CRow className="g-3 mb-3">
                <CCol md={4}>
                  <CFormInput
                    type="number"
                    id="anneeInput"
                    floatingLabel="Année"
                    min={2000}
                    max={2100}
                    step={1}
                    placeholder="Ex: 2024"
                    value={entity.annee}
                    onChange={(e) => setEntity({ ...entity, annee: e.target.value })}
                    disabled={createMutation.isPending || updateMutation.isPending}
                  />
                </CCol>
                <CCol md={4}>
                  <CFormSelect
                    id="siteSelect"
                    floatingLabel="Site"
                    value={entity.siteId}
                    onChange={(e) => setEntity({ ...entity, siteId: e.target.value })}
                    disabled={createMutation.isPending || updateMutation.isPending}
                  >
                    <option value="">Sélectionnez un site</option>
                    {sitesQuery.data?.map((site) => (
                      <option key={site.id} value={site.id}>
                        {site.name}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>
                <CCol md={4}>
                  <CFormSelect
                    id="parcSelect"
                    floatingLabel="Parc"
                    value={entity.parcId}
                    onChange={(e) => setEntity({ ...entity, parcId: e.target.value })}
                    disabled={createMutation.isPending || updateMutation.isPending}
                  >
                    <option value="">Sélectionnez un parc</option>
                    {parcsQuery.data?.map((parc) => (
                      <option key={parc.id} value={parc.id}>
                        {parc.name}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>
              </CRow>

              <CRow className="g-3 mb-3">
                <CCol md={4}>
                  <CFormInput
                    type="number"
                    min={0}
                    step="0.01"
                    id="dispoInput"
                    floatingLabel="DISPO (%)"
                    placeholder="Ex: 95.5"
                    value={entity.dispo}
                    onChange={(e) => setEntity({ ...entity, dispo: e.target.value })}
                    disabled={createMutation.isPending || updateMutation.isPending}
                  />
                </CCol>
                <CCol md={4}>
                  <CFormInput
                    type="number"
                    min={0}
                    step="0.01"
                    id="mtbfInput"
                    floatingLabel="MTBF (heures)"
                    placeholder="Ex: 150.5"
                    value={entity.mtbf}
                    onChange={(e) => setEntity({ ...entity, mtbf: e.target.value })}
                    disabled={createMutation.isPending || updateMutation.isPending}
                  />
                </CCol>
                <CCol md={4}>
                  <CFormInput
                    type="number"
                    min={0}
                    step="0.01"
                    id="tdmInput"
                    floatingLabel="TDM (%)"
                    placeholder="Ex: 85.2"
                    value={entity.tdm}
                    onChange={(e) => setEntity({ ...entity, tdm: e.target.value })}
                    disabled={createMutation.isPending || updateMutation.isPending}
                  />
                </CCol>
              </CRow>

              <CRow className="g-3">
                <CCol md={4}>
                  <CFormInput
                    type="number"
                    min={0}
                    step="0.01"
                    id="speHuileInput"
                    floatingLabel="SPE HUILE"
                    placeholder="Ex: 1.2"
                    value={entity.spe_huile}
                    onChange={(e) => setEntity({ ...entity, spe_huile: e.target.value })}
                    disabled={createMutation.isPending || updateMutation.isPending}
                  />
                </CCol>
                <CCol md={4}>
                  <CFormInput
                    type="number"
                    min={0}
                    step="0.01"
                    id="speGoInput"
                    floatingLabel="SPE GO"
                    placeholder="Ex: 0.8"
                    value={entity.spe_go}
                    onChange={(e) => setEntity({ ...entity, spe_go: e.target.value })}
                    disabled={createMutation.isPending || updateMutation.isPending}
                  />
                </CCol>
                <CCol md={4}>
                  <CFormInput
                    type="number"
                    min={0}
                    step="0.01"
                    id="speGraisseInput"
                    floatingLabel="SPE GRAISSE"
                    placeholder="Ex: 0.3"
                    value={entity.spe_graisse}
                    onChange={(e) => setEntity({ ...entity, spe_graisse: e.target.value })}
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
                !entity.annee ||
                !entity.parcId ||
                !entity.siteId
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

export default Objectifs
