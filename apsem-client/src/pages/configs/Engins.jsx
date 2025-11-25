import React, { useState } from 'react'
import {
  CAlert,
  CBadge,
  CFormCheck,
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
import {
  cilCloudDownload,
  cilPenNib,
  cilPlus,
  cilToggleOff,
  cilToggleOn,
  cilTrash,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { exportExcel, getMultiplesOf } from '../../utils/func'
import {
  fecthEnginsQuery,
  useCreateEngin,
  useDeleteEngin,
  useUpdateEngin,
} from '../../hooks/useEngins'
import { useTypeparcs } from '../../hooks/useTypeparcs'
import { useParcsByTypeParc } from '../../hooks/useParcs'
import { fecthSitesQuery } from '../../hooks/useSites'
import TableHead from './TableHead'

const Engins = () => {
  const getAllQuery = useQuery(fecthEnginsQuery())
  const getAllTypeparcsQuery = useQuery(useTypeparcs())

  const [selectedTypeparc, setSelectedTypeparc] = useState('')

  const parcsByTypeparcQuery = useQuery(useParcsByTypeParc(selectedTypeparc))
  const sitesQuery = useQuery(fecthSitesQuery())

  const [visible, setVisible] = useState(false)
  const [operation, setOperation] = useState('')

  const initialVal = {
    id: '',
    name: '',
    active: true,
    parcId: '',
    siteId: '',
    initialHeureChassis: '',
  }
  const [entity, setEntity] = useState(initialVal)
  const createMutation = useCreateEngin()
  const deleteMutation = useDeleteEngin()
  const updateMutation = useUpdateEngin()

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = {
      id: entity.id,
      name: entity.name,
      active: entity.active,
      parcId: entity.parcId,
      siteId: entity.siteId,
      initialHeureChassis: entity.initialHeureChassis,
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
    setSelectedTypeparc('')
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
    (el) =>
      el?.name.toLowerCase().includes(search.toLowerCase()) ||
      el?.Parc?.Typeparc?.name.toLowerCase().includes(search.toLowerCase()) ||
      el?.Parc?.name.toLowerCase().includes(search.toLowerCase()) ||
      el?.Site?.name.toLowerCase().includes(search.toLowerCase()),
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
        title="Liste des engins"
        getAllQuery={getAllQuery}
        search={search}
        handleSearch={handleSearch}
        setEntity={setEntity}
        initialVal={initialVal}
        setVisible={setVisible}
        visible={visible}
        setOperation={setOperation}
        tableId={'myTable'}
        excelFileName={'Liste des engins'}
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
            <CTableHeaderCell scope="col">Nom de l'engin</CTableHeaderCell>
            <CTableHeaderCell scope="col">Type de parc</CTableHeaderCell>
            <CTableHeaderCell scope="col">Parc</CTableHeaderCell>
            <CTableHeaderCell scope="col">Site</CTableHeaderCell>
            <CTableHeaderCell scope="col">Active</CTableHeaderCell>
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
                      const currentItem = {
                        id: item?.id,
                        name: item?.name,
                        active: item?.active,
                        parcId: item?.parcId,
                        siteId: item?.siteId,
                        initialHeureChassis: item?.initialHeureChassis,
                      }
                      setEntity(currentItem)
                      setSelectedTypeparc(item?.Parc?.typeparcId)
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
                      const currentItem = {
                        id: item?.id,
                        name: item?.name,
                        active: item?.active,
                        parcId: item?.parcId,
                        siteId: item?.siteId,
                        initialHeureChassis: item?.initialHeureChassis,
                      }
                      setEntity(currentItem)
                      setSelectedTypeparc(item?.Parc?.typeparcId)
                      setOperation('update')
                      setVisible(!visible)
                    }}
                  >
                    <CIcon icon={cilPenNib} />
                  </CButton>{' '}
                  {item?.name}
                </CTableDataCell>

                <CTableDataCell> {item?.Parc?.Typeparc?.name}</CTableDataCell>
                <CTableDataCell> {item?.Parc?.name}</CTableDataCell>
                <CTableDataCell> {item?.Site?.name}</CTableDataCell>
                <CTableDataCell>
                  {item?.active === true ? (
                    <CIcon icon={cilToggleOff} size="xl" className="text-primary" />
                  ) : (
                    <CIcon icon={cilToggleOn} size="xl" className="text-secondary" />
                  )}
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
          <CModalTitle id="StaticBackdropExampleLabel">Gestion d'un engin</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="d-flex gap-1 justify-content-between align-items-center">
            <CFormInput
              type="text"
              id="floatingInput"
              floatingClassName="mb-3"
              floatingLabel="Nom de l'engin"
              placeholder="321"
              value={entity.name}
              onChange={(e) => setEntity({ ...entity, name: e.target.value })}
              disabled={
                createMutation.isPending ||
                updateMutation.isPending ||
                deleteMutation.isPending ||
                operation === 'delete'
              }
            />
            <CFormInput
              type="number"
              id="floatingInput"
              floatingClassName="mb-3"
              floatingLabel="Heures chassis initial"
              placeholder="321"
              min={0}
              value={entity.initialHeureChassis}
              onChange={(e) => setEntity({ ...entity, initialHeureChassis: e.target.value })}
              disabled={
                createMutation.isPending ||
                updateMutation.isPending ||
                deleteMutation.isPending ||
                operation === 'delete'
              }
            />

            <div className="mb-3">
              <CFormCheck
                type="radio"
                name="inlineRadioOptions"
                id="inlineCheckbox1"
                value="option1"
                label="Active"
                checked={entity?.active}
                onChange={(e) => setEntity({ ...entity, active: true })}
                disabled={
                  createMutation.isPending ||
                  updateMutation.isPending ||
                  deleteMutation.isPending ||
                  operation === 'delete'
                }
              />
              <CFormCheck
                type="radio"
                name="inlineRadioOptions"
                id="inlineCheckbox2"
                value="option2"
                label="InActive"
                checked={!entity?.active}
                onChange={(e) => setEntity({ ...entity, active: false })}
                disabled={
                  createMutation.isPending ||
                  updateMutation.isPending ||
                  deleteMutation.isPending ||
                  operation === 'delete'
                }
              />
            </div>
          </div>

          <CFormSelect
            id="floatingSelect"
            floatingClassName="mb-3"
            floatingLabel="Choisir un type de parc"
            aria-label="Floating label select example"
            value={selectedTypeparc}
            onChange={(e) => setSelectedTypeparc(e.target.value)}
            disabled={
              createMutation.isPending ||
              updateMutation.isPending ||
              deleteMutation.isPending ||
              operation === 'delete'
            }
          >
            <option></option>
            {getAllTypeparcsQuery.data &&
              getAllTypeparcsQuery.data?.length > 0 &&
              getAllTypeparcsQuery.data?.map((typeparc, indx) => (
                <option key={indx} value={typeparc?.id}>
                  {typeparc?.name}
                </option>
              ))}
          </CFormSelect>

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
            {parcsByTypeparcQuery.data &&
              parcsByTypeparcQuery.data?.length > 0 &&
              parcsByTypeparcQuery.data?.map((parc, indx) => (
                <option key={indx} value={parc?.id}>
                  {parc?.name}
                </option>
              ))}
          </CFormSelect>

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

export default Engins
