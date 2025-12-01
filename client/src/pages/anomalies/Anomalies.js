import React, { useState, useMemo } from 'react'
import {
  CAlert,
  CBadge,
  CFormInput,
  CFormSelect,
  CFormCheck,
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
  CCard,
  CCardBody,
  CCardHeader,
} from '@coreui/react'
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import {
  cilPenNib,
  cilPlus,
  cilTrash,
  cilWarning,
  cilInfo,
  cilCalendar,
  cilFilter,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import TableHead from '../../components/TableHead'
import { fecthEnginsQuery } from '../../hooks/useEngins'
import { fecthSitesQuery } from '../../hooks/useSites'
import {
  fetchAnomaliesQuery,
  useCreateAnomalie,
  useDeleteAnomalie,
  useUpdateAnomalie,
} from '../../hooks/useAnomalies'
import { useNavigate } from 'react-router-dom'

const Anomalies = () => {
  const getAllQuery = useQuery(fetchAnomaliesQuery())
  const enginsQuery = useQuery(fecthEnginsQuery())
  const sitesQuery = useQuery(fecthSitesQuery())

  const [visible, setVisible] = useState(false)
  const [operation, setOperation] = useState('')

  const initialVal = {
    id: '',
    numeroBacklog: '',
    dateDetection: '',
    description: '',
    source: 'VS',
    priorite: 'FAIBLE',
    besoinPDR: false,
    quantite: '',
    reference: '',
    code: '',
    stock: '',
    numeroBS: '',
    programmation: '',
    sortiePDR: '',
    equipe: '',
    statut: 'ATTENTE_PDR',
    dateExecution: '',
    confirmation: '',
    observations: '',
    enginId: '',
    siteId: '',
  }
  const [entity, setEntity] = useState(initialVal)
  const createMutation = useCreateAnomalie()
  const deleteMutation = useDeleteAnomalie()
  const updateMutation = useUpdateAnomalie()

  // États pour les filtres
  const [filters, setFilters] = useState({
    search: '',
    priorite: '',
    statut: '',
  })

  const [showFilters, setShowFilters] = useState(false)

  // Filtrer les engins selon le site sélectionné
  const filteredEngins = useMemo(() => {
    if (!enginsQuery.data || !entity.siteId) {
      return enginsQuery.data || []
    }
    return enginsQuery.data.filter((engin) => engin.siteId === entity.siteId)
  }, [enginsQuery.data, entity.siteId])

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = {
      ...entity,
      quantite: entity.quantite ? parseInt(entity.quantite) : null,
      besoinPDR: Boolean(entity.besoinPDR),
      // Gérer les dates vides
      dateExecution: entity.dateExecution || null,
    }

    switch (operation) {
      case 'create':
        createMutation.mutate(data, {
          onSuccess: () => {
            setVisible(!visible)
            handleResetAll()
            toast.success('Anomalie créée avec succès.')
          },
        })
        break
      case 'delete':
        deleteMutation.mutate(data, {
          onSuccess: () => {
            setVisible(!visible)
            handleResetAll()
            toast.success('Anomalie supprimée avec succès.')
          },
        })
        break
      case 'update':
        updateMutation.mutate(data, {
          onSuccess: () => {
            setVisible(!visible)
            handleResetAll()
            toast.success('Anomalie modifiée avec succès.')
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

  const handleSiteChange = (siteId) => {
    setEntity({
      ...entity,
      siteId,
      enginId: '', // Réinitialiser l'engin quand le site change
    })
  }

  const handleSearch = (e) => {
    setCurrentPage(1)
    const newSearchValue = e.target.value
    setFilters((prev) => ({ ...prev, search: newSearchValue }))
  }

  const handleFilterChange = (filterType, value) => {
    setCurrentPage(1)
    setFilters((prev) => ({ ...prev, [filterType]: value }))
  }

  const resetFilters = () => {
    setCurrentPage(1)
    setFilters({
      search: '',
      priorite: '',
      statut: '',
    })
  }

  // Filter anomalies based on search and filters
  const filteredAnomalies = getAllQuery.data?.data?.filter((anomalie) => {
    const matchesSearch =
      anomalie?.numeroBacklog?.toLowerCase().includes(filters.search.toLowerCase()) ||
      anomalie?.description?.toLowerCase().includes(filters.search.toLowerCase()) ||
      anomalie?.engin?.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
      anomalie?.site?.name?.toLowerCase().includes(filters.search.toLowerCase())

    const matchesPriorite = !filters.priorite || anomalie?.priorite === filters.priorite
    const matchesStatut = !filters.statut || anomalie?.statut === filters.statut

    return matchesSearch && matchesPriorite && matchesStatut
  })

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [anomaliesPerPage, setAnomaliesPerPage] = useState(10)

  const indexOfLastAnomalie = currentPage * anomaliesPerPage
  const indexOfFirstAnomalie = indexOfLastAnomalie - anomaliesPerPage
  const currentAnomalies = filteredAnomalies?.slice(indexOfFirstAnomalie, indexOfLastAnomalie)

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  const totalPages = Math.ceil(filteredAnomalies?.length / anomaliesPerPage)

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('fr-FR')
  }

  // Get badge color for priority
  const getPriorityColor = (priorite) => {
    switch (priorite) {
      case 'ELEVEE':
        return 'danger'
      case 'MOYENNE':
        return 'warning'
      case 'FAIBLE':
        return 'info'
      default:
        return 'secondary'
    }
  }

  // Get badge color for status
  const getStatusColor = (statut) => {
    switch (statut) {
      case 'EXECUTE':
        return 'success'
      case 'PROGRAMMEE':
        return 'primary'
      case 'PDR_PRET':
        return 'info'
      case 'ATTENTE_PDR':
        return 'warning'
      case 'NON_PROGRAMMEE':
        return 'secondary'
      default:
        return 'secondary'
    }
  }

  // Traduire les priorités
  const translatePriority = (priorite) => {
    const translations = {
      ELEVEE: 'Élevée',
      MOYENNE: 'Moyenne',
      FAIBLE: 'Faible',
    }
    return translations[priorite] || priorite
  }

  // Traduire les statuts
  const translateStatus = (statut) => {
    const translations = {
      ATTENTE_PDR: 'Attente PDR',
      PDR_PRET: 'PDR prêt',
      NON_PROGRAMMEE: 'Non programmée',
      PROGRAMMEE: 'Programmée',
      EXECUTE: 'Exécuté',
    }
    return translations[statut] || statut
  }

  // Compter les anomalies par filtre pour les indicateurs
  const filterCounts = useMemo(() => {
    if (!getAllQuery.data?.data) return { priorite: {}, statut: {} }

    const prioriteCounts = {}
    const statutCounts = {}

    getAllQuery.data.data.forEach((anomalie) => {
      prioriteCounts[anomalie.priorite] = (prioriteCounts[anomalie.priorite] || 0) + 1
      statutCounts[anomalie.statut] = (statutCounts[anomalie.statut] || 0) + 1
    })

    return { priorite: prioriteCounts, statut: statutCounts }
  }, [getAllQuery.data?.data])

  const navigate = useNavigate()
  return (
    <>
      {!getAllQuery?.isError ? (
        <>
          <TableHead
            title="Liste des anomalies"
            getAllQuery={getAllQuery}
            search={filters.search}
            handleSearch={handleSearch}
            setEntity={setEntity}
            initialVal={initialVal}
            setVisible={setVisible}
            visible={visible}
            setOperation={setOperation}
            tableId={'anomaliesTable'}
            excelFileName={'Liste des anomalies'}
            currentEntitys={currentAnomalies}
            entitysPerPage={anomaliesPerPage}
            setEntitysPerPage={setAnomaliesPerPage}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
            totalPages={totalPages}
            filteredEntitys={filteredAnomalies}
          />

          {/* Carte des filtres */}
          <CCard className="mb-3">
            <CCardHeader className="bg-body d-flex justify-content-between align-items-center">
              <h6 className="mb-0 d-flex align-items-center">
                <CIcon icon={cilFilter} className="me-2" />
                Filtres
              </h6>
              <div className="d-flex gap-2">
                <CButton
                  size="sm"
                  color="secondary"
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  {showFilters ? 'Masquer' : 'Afficher'} les filtres
                </CButton>
                {(filters.priorite || filters.statut) && (
                  <CButton size="sm" color="warning" variant="outline" onClick={resetFilters}>
                    Réinitialiser
                  </CButton>
                )}
              </div>
            </CCardHeader>
            {showFilters && (
              <CCardBody>
                <CRow className="g-3">
                  <CCol md={4}>
                    <CFormSelect
                      value={filters.priorite}
                      onChange={(e) => handleFilterChange('priorite', e.target.value)}
                      size="sm"
                    >
                      <option value="">Toutes les priorités</option>
                      <option value="ELEVEE">
                        Élevée{' '}
                        {filterCounts.priorite.ELEVEE ? `(${filterCounts.priorite.ELEVEE})` : ''}
                      </option>
                      <option value="MOYENNE">
                        Moyenne{' '}
                        {filterCounts.priorite.MOYENNE ? `(${filterCounts.priorite.MOYENNE})` : ''}
                      </option>
                      <option value="FAIBLE">
                        Faible{' '}
                        {filterCounts.priorite.FAIBLE ? `(${filterCounts.priorite.FAIBLE})` : ''}
                      </option>
                    </CFormSelect>
                  </CCol>
                  <CCol md={4}>
                    <CFormSelect
                      value={filters.statut}
                      onChange={(e) => handleFilterChange('statut', e.target.value)}
                      size="sm"
                    >
                      <option value="">Tous les statuts</option>
                      <option value="ATTENTE_PDR">
                        Attente PDR{' '}
                        {filterCounts.statut.ATTENTE_PDR
                          ? `(${filterCounts.statut.ATTENTE_PDR})`
                          : ''}
                      </option>
                      <option value="PDR_PRET">
                        PDR prêt{' '}
                        {filterCounts.statut.PDR_PRET ? `(${filterCounts.statut.PDR_PRET})` : ''}
                      </option>
                      <option value="NON_PROGRAMMEE">
                        Non programmée{' '}
                        {filterCounts.statut.NON_PROGRAMMEE
                          ? `(${filterCounts.statut.NON_PROGRAMMEE})`
                          : ''}
                      </option>
                      <option value="PROGRAMMEE">
                        Programmé{' '}
                        {filterCounts.statut.PROGRAMMEE
                          ? `(${filterCounts.statut.PROGRAMMEE})`
                          : ''}
                      </option>
                      <option value="EXECUTE">
                        Exécuté{' '}
                        {filterCounts.statut.EXECUTE ? `(${filterCounts.statut.EXECUTE})` : ''}
                      </option>
                    </CFormSelect>
                  </CCol>
                  <CCol md={4}>
                    <div className="d-flex align-items-center h-100">
                      <CBadge color="info" className="me-2">
                        {filteredAnomalies?.length || 0} résultat(s)
                      </CBadge>
                      {(filters.priorite || filters.statut) && (
                        <div className="small text-body-secondary">
                          Filtres actifs:
                          {filters.priorite && ` Priorité: ${translatePriority(filters.priorite)}`}
                          {filters.statut && ` Statut: ${translateStatus(filters.statut)}`}
                        </div>
                      )}
                    </div>
                  </CCol>
                </CRow>
              </CCardBody>
            )}
          </CCard>

          <CTable responsive striped hover className="mt-3" id="anomaliesTable">
            <CTableHead className="bg-body">
              <CTableRow>
                <CTableHeaderCell scope="col" className="text-body">
                  N° Backlog
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" className="text-body">
                  Date détection
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" className="text-body">
                  Description
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" className="text-body">
                  Engin
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" className="text-body">
                  Site
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" className="text-body">
                  Priorité
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
              {currentAnomalies && currentAnomalies?.length > 0 ? (
                currentAnomalies?.map((anomalie) => (
                  <CTableRow key={anomalie.id} className="bg-body">
                    <CTableDataCell className="text-body fw-medium">
                      {anomalie?.numeroBacklog}
                    </CTableDataCell>

                    <CTableDataCell className="text-body">
                      {formatDate(anomalie?.dateDetection)}
                    </CTableDataCell>

                    <CTableDataCell className="text-body" title={anomalie?.description}>
                      {anomalie?.description?.length > 50
                        ? `${anomalie.description.substring(0, 50)}...`
                        : anomalie?.description}
                    </CTableDataCell>

                    <CTableDataCell className="text-body">
                      {anomalie?.engin?.name || '-'}
                    </CTableDataCell>

                    <CTableDataCell className="text-body">
                      {anomalie?.site?.name || '-'}
                    </CTableDataCell>

                    <CTableDataCell>
                      <CBadge color={getPriorityColor(anomalie?.priorite)}>
                        {translatePriority(anomalie?.priorite)}
                      </CBadge>
                    </CTableDataCell>

                    <CTableDataCell>
                      <CBadge color={getStatusColor(anomalie?.statut)}>
                        {translateStatus(anomalie?.statut)}
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
                            setEntity({
                              ...anomalie,
                              dateDetection: anomalie.dateDetection
                                ? new Date(anomalie.dateDetection).toISOString().split('T')[0]
                                : '',
                              dateExecution: anomalie.dateExecution
                                ? new Date(anomalie.dateExecution).toISOString().split('T')[0]
                                : '',
                            })
                            setOperation('update')
                            setVisible(true)
                          }}
                          title="Modifier l'anomalie"
                        >
                          <CIcon icon={cilPenNib} />
                        </CButton>
                        <CButton
                          size="sm"
                          color="danger"
                          variant="outline"
                          className="rounded-pill"
                          onClick={() => {
                            setEntity(anomalie)
                            setOperation('delete')
                            setVisible(true)
                          }}
                          title="Supprimer l'anomalie"
                        >
                          <CIcon icon={cilTrash} />
                        </CButton>
                        <CButton
                          size="sm"
                          color="info"
                          variant="outline"
                          className="rounded-pill"
                          onClick={() => {
                            // Navigation vers la page de détail de l'anomalie
                            navigate(`/anomalies/${anomalie.id}`)
                          }}
                          title="Voir les détails"
                        >
                          <CIcon icon={cilInfo} />
                        </CButton>
                      </div>
                    </CTableDataCell>
                  </CTableRow>
                ))
              ) : (
                <CTableRow className="bg-body">
                  <CTableDataCell colSpan={8} className="text-center text-body py-4">
                    {getAllQuery.isLoading ? (
                      <div className="d-flex align-items-center justify-content-center gap-2">
                        <CSpinner size="sm" />
                        <span>Chargement des anomalies...</span>
                      </div>
                    ) : (
                      <div>
                        <CIcon icon={cilWarning} size="xl" className="text-body-secondary mb-2" />
                        <div>Aucune anomalie trouvée</div>
                        {filters.search && (
                          <div className="text-body-secondary small mt-1">
                            Aucun résultat pour "{filters.search}"
                          </div>
                        )}
                        {(filters.priorite || filters.statut) && (
                          <div className="text-body-secondary small mt-1">
                            Filtres actifs:
                            {filters.priorite &&
                              ` Priorité: ${translatePriority(filters.priorite)}`}
                            {filters.statut && ` Statut: ${translateStatus(filters.statut)}`}
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
            aria-labelledby="AnomalieModalLabel"
            size="lg"
          >
            <CModalHeader className="bg-body">
              <CModalTitle id="AnomalieModalLabel" className="text-body">
                {operation === 'create' && 'Créer une anomalie'}
                {operation === 'update' && "Modifier l'anomalie"}
                {operation === 'delete' && "Supprimer l'anomalie"}
              </CModalTitle>
            </CModalHeader>
            <CModalBody className="bg-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              {operation === 'delete' ? (
                <div className="text-center text-body">
                  <CAlert color="warning" className="mb-3">
                    <strong>Attention!</strong> Cette action est irréversible.
                  </CAlert>
                  <p>Voulez-vous vraiment supprimer l'anomalie :</p>
                  <div className="border rounded p-3 bg-body">
                    <strong className="text-body">{entity.numeroBacklog}</strong>
                    <div className="text-body-secondary">{entity.description}</div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Section Informations principales - Plus compacte */}
                  <h6 className="text-body mb-2 border-bottom pb-1 small fw-bold">
                    INFORMATIONS PRINCIPALES
                  </h6>
                  <CRow className="g-2 mb-2">
                    <CCol md={6}>
                      <CFormInput
                        type="text"
                        id="numeroBacklogInput"
                        floatingLabel="N° Backlog *"
                        placeholder="TO14-25-XXX"
                        value={entity.numeroBacklog}
                        onChange={(e) => setEntity({ ...entity, numeroBacklog: e.target.value })}
                        disabled={createMutation.isPending || updateMutation.isPending}
                        size="sm"
                      />
                    </CCol>
                    <CCol md={6}>
                      <CFormInput
                        type="date"
                        id="dateDetectionInput"
                        floatingLabel="Date détection *"
                        value={entity.dateDetection}
                        onChange={(e) => setEntity({ ...entity, dateDetection: e.target.value })}
                        disabled={createMutation.isPending || updateMutation.isPending}
                        size="sm"
                      />
                    </CCol>
                  </CRow>

                  <CRow className="g-2 mb-2">
                    <CCol md={12}>
                      <CFormInput
                        type="text"
                        id="descriptionInput"
                        floatingLabel="Description *"
                        placeholder="Description de l'anomalie..."
                        value={entity.description}
                        onChange={(e) => setEntity({ ...entity, description: e.target.value })}
                        disabled={createMutation.isPending || updateMutation.isPending}
                        size="sm"
                      />
                    </CCol>
                  </CRow>

                  {/* Section Classification - Plus compacte */}
                  <h6 className="text-body mb-2 border-bottom pb-1 small fw-bold">
                    CLASSIFICATION
                  </h6>
                  <CRow className="g-2 mb-2">
                    <CCol md={4}>
                      <CFormSelect
                        id="sourceSelect"
                        floatingLabel="Source *"
                        value={entity.source}
                        onChange={(e) => setEntity({ ...entity, source: e.target.value })}
                        disabled={createMutation.isPending || updateMutation.isPending}
                        size="sm"
                      >
                        <option value="VS">VS</option>
                        <option value="VJ">VJ</option>
                        <option value="INSPECTION">INSPECTION</option>
                        <option value="AUTRE">Autre</option>
                      </CFormSelect>
                    </CCol>
                    <CCol md={4}>
                      <CFormSelect
                        id="prioriteSelect"
                        floatingLabel="Priorité *"
                        value={entity.priorite}
                        onChange={(e) => setEntity({ ...entity, priorite: e.target.value })}
                        disabled={createMutation.isPending || updateMutation.isPending}
                        size="sm"
                      >
                        <option value="ELEVEE">Élevée</option>
                        <option value="MOYENNE">Moyenne</option>
                        <option value="FAIBLE">Faible</option>
                      </CFormSelect>
                    </CCol>
                    <CCol md={4}>
                      <CFormSelect
                        id="statutSelect"
                        floatingLabel="Statut *"
                        value={entity.statut}
                        onChange={(e) => setEntity({ ...entity, statut: e.target.value })}
                        disabled={createMutation.isPending || updateMutation.isPending}
                        size="sm"
                      >
                        <option value="ATTENTE_PDR">Attente PDR</option>
                        <option value="PDR_PRET">PDR prêt</option>
                        <option value="NON_PROGRAMMEE">Non programmée</option>
                        <option value="PROGRAMMEE">Programmée</option>
                        <option value="EXECUTE">Exécutée</option>
                      </CFormSelect>
                    </CCol>
                  </CRow>

                  {/* Section Localisation - Plus compacte */}
                  <h6 className="text-body mb-2 border-bottom pb-1 small fw-bold">LOCALISATION</h6>
                  <CRow className="g-2 mb-2">
                    <CCol md={6}>
                      <CFormSelect
                        id="siteSelect"
                        floatingLabel="Site *"
                        value={entity.siteId}
                        onChange={(e) => handleSiteChange(e.target.value)}
                        disabled={createMutation.isPending || updateMutation.isPending}
                        size="sm"
                      >
                        <option value="">Sélectionnez un site</option>
                        {sitesQuery.data?.map((site) => (
                          <option key={site.id} value={site.id}>
                            {site.name}
                          </option>
                        ))}
                      </CFormSelect>
                    </CCol>
                    <CCol md={6}>
                      <CFormSelect
                        id="enginSelect"
                        floatingLabel="Engin *"
                        value={entity.enginId}
                        onChange={(e) => setEntity({ ...entity, enginId: e.target.value })}
                        disabled={
                          createMutation.isPending || updateMutation.isPending || !entity.siteId
                        }
                        size="sm"
                      >
                        <option value="">
                          {entity.siteId ? 'Sélectionnez un engin' : "Sélectionnez d'abord un site"}
                        </option>
                        {filteredEngins.map((engin) => (
                          <option key={engin.id} value={engin.id}>
                            {engin.name}
                          </option>
                        ))}
                      </CFormSelect>
                      {entity.siteId && filteredEngins.length === 0 && (
                        <div className="small text-warning mt-1">
                          Aucun engin disponible pour ce site
                        </div>
                      )}
                    </CCol>
                  </CRow>

                  {/* Section PDR et Références - Plus compacte */}
                  <h6 className="text-body mb-2 border-bottom pb-1 small fw-bold">
                    PDR ET RÉFÉRENCES
                  </h6>
                  <CRow className="g-2 mb-2">
                    <CCol md={4}>
                      <div className="border rounded p-2 bg-body">
                        <label className="form-label text-body fw-medium mb-1 small">
                          Besoin PDR :
                        </label>
                        <div className="d-flex gap-2">
                          <CFormCheck
                            type="radio"
                            name="besoinPDR"
                            id="besoinPDRoui"
                            label="Oui"
                            checked={entity.besoinPDR}
                            onChange={(e) => setEntity({ ...entity, besoinPDR: true })}
                            disabled={createMutation.isPending || updateMutation.isPending}
                            className="text-body small"
                          />
                          <CFormCheck
                            type="radio"
                            name="besoinPDR"
                            id="besoinPDRnon"
                            label="Non"
                            checked={!entity.besoinPDR}
                            onChange={(e) => setEntity({ ...entity, besoinPDR: false })}
                            disabled={createMutation.isPending || updateMutation.isPending}
                            className="text-body small"
                          />
                        </div>
                      </div>
                    </CCol>
                    <CCol md={4}>
                      <CFormInput
                        type="number"
                        id="quantiteInput"
                        floatingLabel="Quantité"
                        placeholder="0"
                        min="0"
                        value={entity.quantite}
                        onChange={(e) => setEntity({ ...entity, quantite: e.target.value })}
                        disabled={createMutation.isPending || updateMutation.isPending}
                        size="sm"
                      />
                    </CCol>
                    <CCol md={4}>
                      <CFormInput
                        type="text"
                        id="numeroBSInput"
                        floatingLabel="N° BS"
                        placeholder="Numéro BS"
                        value={entity.numeroBS}
                        onChange={(e) => setEntity({ ...entity, numeroBS: e.target.value })}
                        disabled={createMutation.isPending || updateMutation.isPending}
                        size="sm"
                      />
                    </CCol>
                  </CRow>

                  <CRow className="g-2 mb-2">
                    <CCol md={6}>
                      <CFormInput
                        type="text"
                        id="referenceInput"
                        floatingLabel="Référence"
                        placeholder="Référence pièce"
                        value={entity.reference}
                        onChange={(e) => setEntity({ ...entity, reference: e.target.value })}
                        disabled={createMutation.isPending || updateMutation.isPending}
                        size="sm"
                      />
                    </CCol>
                    <CCol md={6}>
                      <CFormInput
                        type="text"
                        id="codeInput"
                        floatingLabel="Code"
                        placeholder="Code interne"
                        value={entity.code}
                        onChange={(e) => setEntity({ ...entity, code: e.target.value })}
                        disabled={createMutation.isPending || updateMutation.isPending}
                        size="sm"
                      />
                    </CCol>
                  </CRow>

                  <CRow className="g-2 mb-2">
                    <CCol md={12}>
                      <CFormInput
                        type="text"
                        id="stockInput"
                        floatingLabel="Stock"
                        placeholder="État du stock"
                        value={entity.stock}
                        onChange={(e) => setEntity({ ...entity, stock: e.target.value })}
                        disabled={createMutation.isPending || updateMutation.isPending}
                        size="sm"
                      />
                    </CCol>
                  </CRow>

                  {/* Section Planification - Plus compacte */}
                  <h6 className="text-body mb-2 border-bottom pb-1 small fw-bold">PLANIFICATION</h6>
                  <CRow className="g-2 mb-2">
                    <CCol md={6}>
                      <CFormInput
                        type="text"
                        id="programmationInput"
                        floatingLabel="Programmation"
                        placeholder="VS, VJ, PH..."
                        value={entity.programmation}
                        onChange={(e) => setEntity({ ...entity, programmation: e.target.value })}
                        disabled={createMutation.isPending || updateMutation.isPending}
                        size="sm"
                      />
                    </CCol>
                    <CCol md={6}>
                      <CFormInput
                        type="text"
                        id="sortiePDRInput"
                        floatingLabel="Sortie PDR"
                        placeholder="Sortie PDR"
                        value={entity.sortiePDR}
                        onChange={(e) => setEntity({ ...entity, sortiePDR: e.target.value })}
                        disabled={createMutation.isPending || updateMutation.isPending}
                        size="sm"
                      />
                    </CCol>
                  </CRow>

                  <CRow className="g-2 mb-2">
                    <CCol md={6}>
                      <CFormInput
                        type="text"
                        id="equipeInput"
                        floatingLabel="Équipe"
                        placeholder="Équipe responsable"
                        value={entity.equipe}
                        onChange={(e) => setEntity({ ...entity, equipe: e.target.value })}
                        disabled={createMutation.isPending || updateMutation.isPending}
                        size="sm"
                      />
                    </CCol>
                    <CCol md={6}>
                      <CFormInput
                        type="date"
                        id="dateExecutionInput"
                        floatingLabel="Date exécution"
                        value={entity.dateExecution}
                        onChange={(e) => setEntity({ ...entity, dateExecution: e.target.value })}
                        disabled={createMutation.isPending || updateMutation.isPending}
                        size="sm"
                      />
                    </CCol>
                  </CRow>

                  <CRow className="g-2 mb-2">
                    <CCol md={12}>
                      <CFormInput
                        type="text"
                        id="confirmationInput"
                        floatingLabel="Confirmation"
                        placeholder="Confirmation exécution"
                        value={entity.confirmation}
                        onChange={(e) => setEntity({ ...entity, confirmation: e.target.value })}
                        disabled={createMutation.isPending || updateMutation.isPending}
                        size="sm"
                      />
                    </CCol>
                  </CRow>

                  {/* Section Observations - Plus compacte */}
                  <h6 className="text-body mb-2 border-bottom pb-1 small fw-bold">OBSERVATIONS</h6>
                  <CRow className="g-2">
                    <CCol md={12}>
                      <CFormInput
                        as="textarea"
                        rows={2}
                        id="observationsInput"
                        floatingLabel="Observations"
                        placeholder="Observations supplémentaires..."
                        value={entity.observations}
                        onChange={(e) => setEntity({ ...entity, observations: e.target.value })}
                        disabled={createMutation.isPending || updateMutation.isPending}
                        size="sm"
                      />
                    </CCol>
                  </CRow>

                  {(createMutation.isError || updateMutation.isError) && (
                    <CAlert color="danger" className="mb-0 mt-2 small">
                      {createMutation.error?.message || updateMutation.error?.message}
                    </CAlert>
                  )}
                </>
              )}

              {deleteMutation.isError && (
                <CAlert color="danger" className="mb-0 mt-2 small">
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
                size="sm"
              >
                Annuler
              </CButton>

              {operation === 'delete' ? (
                <CButton
                  color="danger"
                  onClick={handleSubmit}
                  disabled={deleteMutation.isPending}
                  size="sm"
                >
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
                    !entity.numeroBacklog ||
                    !entity.dateDetection ||
                    !entity.description ||
                    !entity.enginId ||
                    !entity.siteId
                  }
                  size="sm"
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
        </>
      ) : (
        <>
          <CAlert color="danger" className="d-flex align-items-center">
            <CIcon icon={cilWarning} className="flex-shrink-0 me-2" width={24} height={24} />
            <div>{getAllQuery?.error?.message}</div>
          </CAlert>
        </>
      )}
    </>
  )
}

export default Anomalies
