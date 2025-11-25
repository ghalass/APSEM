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
} from '@coreui/react'
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import { cilPenNib, cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import TableHead from './TableHead'
import {
  fecthObjectifsQuery,
  useCreateObjectif,
  useDeleteObjectif,
  useUpdateObjectif,
} from '../../hooks/useObjectifs'
import { fecthSitesQuery } from '../../hooks/useSites'
import { useParcs } from '../../hooks/useParcs'

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
  const filteredEntitys = getAllQuery.data?.filter((el) =>
    String(el?.annee || '')
      .toLowerCase()
      .includes(search.toLowerCase()),
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

  return (
    <div>
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
        tableId={'myTable'}
        excelFileName={'Liste des objectifs'}
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
            <CTableHeaderCell scope="col"></CTableHeaderCell>
            <CTableHeaderCell scope="col"></CTableHeaderCell>
            <CTableHeaderCell scope="col"></CTableHeaderCell>
            <CTableHeaderCell scope="col"></CTableHeaderCell>
            <CTableHeaderCell scope="col"></CTableHeaderCell>
            <CTableHeaderCell scope="col"></CTableHeaderCell>
            <CTableHeaderCell scope="col" colSpan={3} className="text-center border">
              SPÉCIFIQUE
            </CTableHeaderCell>
          </CTableRow>

          <CTableRow>
            <CTableHeaderCell scope="col">Année</CTableHeaderCell>
            <CTableHeaderCell scope="col">Parc</CTableHeaderCell>
            <CTableHeaderCell scope="col">Site</CTableHeaderCell>
            <CTableHeaderCell scope="col">DISP</CTableHeaderCell>
            <CTableHeaderCell scope="col">MTBF</CTableHeaderCell>
            <CTableHeaderCell scope="col">TDM</CTableHeaderCell>
            <CTableHeaderCell scope="col" className="text-center border-start">
              HUILE
            </CTableHeaderCell>
            <CTableHeaderCell scope="col">GO</CTableHeaderCell>
            <CTableHeaderCell scope="col" className="text-center border-end">
              GRAISSE
            </CTableHeaderCell>
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
                  {item?.annee}
                </CTableDataCell>

                <CTableDataCell>{item?.Parc?.name}</CTableDataCell>
                <CTableDataCell>{item?.Site?.name}</CTableDataCell>
                <CTableDataCell>{item?.dispo}</CTableDataCell>
                <CTableDataCell>{item?.mtbf}</CTableDataCell>
                <CTableDataCell> {item?.tdm}</CTableDataCell>

                <CTableDataCell className="text-center border-start">
                  {item?.spe_huile}
                </CTableDataCell>

                <CTableDataCell> {item?.spe_go}</CTableDataCell>

                <CTableDataCell className="text-center border-end">
                  {item?.spe_graisse}
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
          <CModalTitle id="StaticBackdropExampleLabel">Gestion d'un objectif</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="row">
            <div className="col">
              <CFormInput
                type="number"
                id="floatingInput"
                floatingClassName="mb-3"
                floatingLabel="Année"
                min={2000}
                max={2100}
                step={1}
                placeholder="pg11"
                value={entity.annee}
                onChange={(e) => setEntity({ ...entity, annee: e.target.value })}
                disabled={
                  createMutation.isPending ||
                  updateMutation.isPending ||
                  deleteMutation.isPending ||
                  operation === 'delete'
                }
              />
            </div>
            <div className="col">
              <CFormSelect
                id="floatingSelect"
                floatingClassName="mb-3"
                floatingLabel="Choisir un site"
                aria-label="Floating label select example"
                value={entity?.siteId}
                onChange={(e) => setEntity({ ...entity, siteId: e.target.value })}
                disabled={
                  createMutation.isPending ||
                  updateMutation.isPending ||
                  deleteMutation.isPending ||
                  operation === 'delete'
                }
              >
                <option></option>
                {sitesQuery.data &&
                  sitesQuery.data?.length > 0 &&
                  sitesQuery.data?.map((site, indx) => (
                    <option key={indx} value={site?.id}>
                      {site?.name}
                    </option>
                  ))}
              </CFormSelect>
            </div>

            <div className="col">
              <CFormSelect
                id="floatingSelect"
                floatingClassName="mb-3"
                floatingLabel="Choisir un parc"
                aria-label="Floating label select example"
                value={entity?.parcId}
                onChange={(e) => setEntity({ ...entity, parcId: e.target.value })}
                disabled={
                  createMutation.isPending ||
                  updateMutation.isPending ||
                  deleteMutation.isPending ||
                  operation === 'delete'
                }
              >
                <option></option>
                {parcsQuery.data &&
                  parcsQuery.data?.length > 0 &&
                  parcsQuery.data?.map((parc, indx) => (
                    <option key={indx} value={parc?.id}>
                      {parc?.name}
                    </option>
                  ))}
              </CFormSelect>
            </div>
          </div>

          <div className="row">
            <div className="col">
              <CFormInput
                type="number"
                min={0}
                id="floatingInput"
                floatingClassName="mb-3"
                floatingLabel="DISPO"
                placeholder="pg11"
                value={entity.dispo}
                onChange={(e) => setEntity({ ...entity, dispo: e.target.value })}
                disabled={
                  createMutation.isPending ||
                  updateMutation.isPending ||
                  deleteMutation.isPending ||
                  operation === 'delete'
                }
              />
            </div>
            <div className="col">
              <CFormInput
                type="number"
                min={0}
                id="floatingInput"
                floatingClassName="mb-3"
                floatingLabel="MTBF"
                placeholder="pg11"
                value={entity.mtbf}
                onChange={(e) => setEntity({ ...entity, mtbf: e.target.value })}
                disabled={
                  createMutation.isPending ||
                  updateMutation.isPending ||
                  deleteMutation.isPending ||
                  operation === 'delete'
                }
              />
            </div>
            <div className="col">
              <CFormInput
                type="number"
                min={0}
                id="floatingInput"
                floatingClassName="mb-3"
                floatingLabel="TDM"
                placeholder="pg11"
                value={entity.tdm}
                onChange={(e) => setEntity({ ...entity, tdm: e.target.value })}
                disabled={
                  createMutation.isPending ||
                  updateMutation.isPending ||
                  deleteMutation.isPending ||
                  operation === 'delete'
                }
              />
            </div>
          </div>

          <div className="row">
            <div className="col">
              <CFormInput
                type="number"
                min={0}
                id="floatingInput"
                floatingClassName="mb-3"
                floatingLabel="SPE HUILE"
                placeholder="pg11"
                value={entity.spe_huile}
                onChange={(e) => setEntity({ ...entity, spe_huile: e.target.value })}
                disabled={
                  createMutation.isPending ||
                  updateMutation.isPending ||
                  deleteMutation.isPending ||
                  operation === 'delete'
                }
              />
            </div>
            <div className="col">
              <CFormInput
                type="number"
                min={0}
                id="floatingInput"
                floatingClassName="mb-3"
                floatingLabel="SPE GO"
                placeholder="pg11"
                value={entity.spe_go}
                onChange={(e) => setEntity({ ...entity, spe_go: e.target.value })}
                disabled={
                  createMutation.isPending ||
                  updateMutation.isPending ||
                  deleteMutation.isPending ||
                  operation === 'delete'
                }
              />
            </div>
            <div className="col">
              <CFormInput
                type="number"
                min={0}
                id="floatingInput"
                floatingClassName="mb-3"
                floatingLabel="SPE GRAISSE"
                placeholder="pg11"
                value={entity.spe_graisse}
                onChange={(e) => setEntity({ ...entity, spe_graisse: e.target.value })}
                disabled={
                  createMutation.isPending ||
                  updateMutation.isPending ||
                  deleteMutation.isPending ||
                  operation === 'delete'
                }
              />
            </div>
          </div>

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
    </div>
  )
}

export default Objectifs
