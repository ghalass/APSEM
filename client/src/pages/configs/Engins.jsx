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
  CRow,
  CCol,
} from '@coreui/react'
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import {
  cilCloudDownload,
  cilPenNib,
  cilPlus,
  cilToggleOff,
  cilToggleOn,
  cilTrash,
  cilWarning,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { exportExcel, getMultiplesOf } from '../../helpers/func'
import {
  fecthEnginsQuery,
  useCreateEngin,
  useDeleteEngin,
  useUpdateEngin,
} from '../../hooks/useEngins'
import { useTypeparcs } from '../../hooks/useTypeparcs'
import { useParcsByTypeParc } from '../../hooks/useParcs'
import { fecthSitesQuery } from '../../hooks/useSites'
import TableHead from '../../components/TableHead'
import ConfigLayout from '../../layout/ConfigLayout'

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
            toast.success('Engin ajouté avec succès.')
          },
        })
        break
      case 'delete':
        deleteMutation.mutate(data, {
          onSuccess: () => {
            setVisible(!visible)
            handleResetAll()
            toast.success('Engin supprimé avec succès.')
          },
        })
        break
      case 'update':
        updateMutation.mutate(data, {
          onSuccess: () => {
            setVisible(!visible)
            handleResetAll()
            toast.success('Engin modifié avec succès.')
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

  // Filter the engins based on the search query
  const filteredEngins = getAllQuery.data?.filter(
    (engin) =>
      engin?.name?.toLowerCase().includes(search.toLowerCase()) ||
      engin?.Parc?.Typeparc?.name?.toLowerCase().includes(search.toLowerCase()) ||
      engin?.Parc?.name?.toLowerCase().includes(search.toLowerCase()) ||
      engin?.Site?.name?.toLowerCase().includes(search.toLowerCase()),
  )

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1)
  const [enginsPerPage, setEnginsPerPage] = useState(10)

  // Calculate current engins to display
  const indexOfLastEngin = currentPage * enginsPerPage
  const indexOfFirstEngin = indexOfLastEngin - enginsPerPage
  const currentEngins = filteredEngins?.slice(indexOfFirstEngin, indexOfLastEngin)

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  // Calculate total pages
  const totalPages = Math.ceil(filteredEngins?.length / enginsPerPage)

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
        title="Liste des engins"
        getAllQuery={getAllQuery}
        search={search}
        handleSearch={handleSearch}
        setEntity={setEntity}
        initialVal={initialVal}
        setVisible={setVisible}
        visible={visible}
        setOperation={setOperation}
        tableId={'enginsTable'}
        excelFileName={'Liste des engins'}
        currentEntitys={currentEngins}
        entitysPerPage={enginsPerPage}
        setEntitysPerPage={setEnginsPerPage}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        handlePageChange={handlePageChange}
        totalPages={totalPages}
        filteredEntitys={filteredEngins}
      />

      <CTable responsive striped hover className="mt-3" id="enginsTable">
        <CTableHead className="bg-body">
          <CTableRow>
            <CTableHeaderCell scope="col" className="text-body">
              Nom
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" className="text-body">
              Type de parc
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" className="text-body">
              Parc
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" className="text-body">
              Site
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" className="text-body">
              Heures chassis
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" className="text-body">
              Statut
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" className="text-body">
              Actions
            </CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {currentEngins && currentEngins?.length > 0 ? (
            currentEngins?.map((engin) => (
              <CTableRow key={engin.id} className="bg-body">
                <CTableDataCell className="text-body fw-medium">{engin?.name}</CTableDataCell>

                <CTableDataCell className="text-body">
                  {engin?.Parc?.Typeparc?.name || '-'}
                </CTableDataCell>

                <CTableDataCell className="text-body">{engin?.Parc?.name || '-'}</CTableDataCell>

                <CTableDataCell className="text-body">{engin?.Site?.name || '-'}</CTableDataCell>

                <CTableDataCell className="text-body">
                  {engin?.initialHeureChassis ? (
                    <CBadge color="info">{engin.initialHeureChassis}h</CBadge>
                  ) : (
                    <span className="text-body-secondary">Non défini</span>
                  )}
                </CTableDataCell>

                <CTableDataCell>
                  <CBadge color={engin?.active ? 'success' : 'secondary'}>
                    {engin?.active ? 'Actif' : 'Inactif'}
                  </CBadge>
                </CTableDataCell>

                <CTableDataCell>
                  <div className="d-flex gap-1">
                    <CButton
                      size="sm"
                      color="primary"
                      variant="outline"
                      className="rounded-pill"
                      onClick={() => {
                        const currentEngin = {
                          id: engin?.id,
                          name: engin?.name,
                          active: engin?.active,
                          parcId: engin?.parcId,
                          siteId: engin?.siteId,
                          initialHeureChassis: engin?.initialHeureChassis,
                        }
                        setEntity(currentEngin)
                        setSelectedTypeparc(engin?.Parc?.typeparcId)
                        setOperation('update')
                        setVisible(true)
                      }}
                      title="Modifier l'engin"
                    >
                      <CIcon icon={cilPenNib} />
                    </CButton>
                    <CButton
                      size="sm"
                      color="danger"
                      variant="outline"
                      className="rounded-pill"
                      onClick={() => {
                        const currentEngin = {
                          id: engin?.id,
                          name: engin?.name,
                          active: engin?.active,
                          parcId: engin?.parcId,
                          siteId: engin?.siteId,
                          initialHeureChassis: engin?.initialHeureChassis,
                        }
                        setEntity(currentEngin)
                        setSelectedTypeparc(engin?.Parc?.typeparcId)
                        setOperation('delete')
                        setVisible(true)
                      }}
                      title="Supprimer l'engin"
                    >
                      <CIcon icon={cilTrash} />
                    </CButton>
                  </div>
                </CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow className="bg-body">
              <CTableDataCell colSpan={7} className="text-center text-body py-4">
                {getAllQuery.isLoading ? (
                  <div className="d-flex align-items-center justify-content-center gap-2">
                    <CSpinner size="sm" />
                    <span>Chargement des engins...</span>
                  </div>
                ) : (
                  <div>
                    <CIcon icon={cilWarning} size="xl" className="text-body-secondary mb-2" />
                    <div>Aucun engin trouvé</div>
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
        aria-labelledby="EnginModalLabel"
      >
        <CModalHeader className="bg-body">
          <CModalTitle id="EnginModalLabel" className="text-body">
            {operation === 'create' && 'Créer un engin'}
            {operation === 'update' && "Modifier l'engin"}
            {operation === 'delete' && "Supprimer l'engin"}
          </CModalTitle>
        </CModalHeader>
        <CModalBody className="bg-body">
          {operation === 'delete' ? (
            <div className="text-center text-body">
              <CAlert color="warning" className="mb-3">
                <strong>Attention!</strong> Cette action est irréversible.
              </CAlert>
              <p>Voulez-vous vraiment supprimer l'engin :</p>
              <div className="border rounded p-3 bg-body">
                <strong className="text-body">{entity.name}</strong>
                <div className="text-body-secondary">
                  {entity.initialHeureChassis && `Heures chassis: ${entity.initialHeureChassis}h`}
                </div>
              </div>
            </div>
          ) : (
            <>
              <CRow className="g-3 mb-3">
                <CCol md={6}>
                  <CFormInput
                    type="text"
                    id="enginNameInput"
                    floatingLabel="Nom de l'engin"
                    placeholder="Entrez le nom de l'engin"
                    value={entity.name}
                    onChange={(e) => setEntity({ ...entity, name: e.target.value })}
                    disabled={createMutation.isPending || updateMutation.isPending}
                  />
                </CCol>
                <CCol md={6}>
                  <CFormInput
                    type="number"
                    id="enginHoursInput"
                    floatingLabel="Heures chassis initiales"
                    placeholder="Entrez les heures chassis"
                    min={0}
                    value={entity.initialHeureChassis}
                    onChange={(e) => setEntity({ ...entity, initialHeureChassis: e.target.value })}
                    disabled={createMutation.isPending || updateMutation.isPending}
                  />
                </CCol>
              </CRow>

              <CRow className="g-3 mb-3">
                <CCol md={6}>
                  <div className="border rounded p-3 bg-body">
                    <label className="form-label text-body fw-medium mb-2">Statut :</label>
                    <div className="d-flex gap-3">
                      <CFormCheck
                        type="radio"
                        name="enginStatus"
                        id="enginActive"
                        label="Actif"
                        checked={entity?.active}
                        onChange={(e) => setEntity({ ...entity, active: true })}
                        disabled={createMutation.isPending || updateMutation.isPending}
                        className="text-body"
                      />
                      <CFormCheck
                        type="radio"
                        name="enginStatus"
                        id="enginInactive"
                        label="Inactif"
                        checked={!entity?.active}
                        onChange={(e) => setEntity({ ...entity, active: false })}
                        disabled={createMutation.isPending || updateMutation.isPending}
                        className="text-body"
                      />
                    </div>
                  </div>
                </CCol>
              </CRow>

              <CRow className="g-3">
                <CCol md={6}>
                  <CFormSelect
                    id="typeParcSelect"
                    floatingLabel="Type de parc"
                    value={selectedTypeparc}
                    onChange={(e) => setSelectedTypeparc(e.target.value)}
                    disabled={createMutation.isPending || updateMutation.isPending}
                  >
                    <option value="">Sélectionnez un type de parc</option>
                    {getAllTypeparcsQuery.data?.map((typeparc) => (
                      <option key={typeparc.id} value={typeparc.id}>
                        {typeparc.name}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>

                <CCol md={6}>
                  <CFormSelect
                    id="parcSelect"
                    floatingLabel="Parc"
                    value={entity.parcId}
                    onChange={(e) => setEntity({ ...entity, parcId: e.target.value })}
                    disabled={
                      createMutation.isPending || updateMutation.isPending || !selectedTypeparc
                    }
                  >
                    <option value="">Sélectionnez un parc</option>
                    {parcsByTypeparcQuery.data?.map((parc) => (
                      <option key={parc.id} value={parc.id}>
                        {parc.name}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>

                <CCol md={6}>
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

export default Engins
