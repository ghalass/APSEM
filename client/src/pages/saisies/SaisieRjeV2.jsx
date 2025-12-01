import React, { useState, useEffect } from 'react'
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CForm,
  CFormInput,
  CFormSelect,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CAlert,
  CSpinner,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CBadge,
} from '@coreui/react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

// Import des hooks
import fecthSaisieRjeQueryOptions, {
  useUpsetHRM,
  useAddPanne,
  useDeleteSaisiePanne,
  useUpdateSaisiePanne,
} from '../../hooks/useSaisieRje'

import { useTypeparcs } from '../../hooks/useTypeparcs'
import { useParcsByTypeParc } from '../../hooks/useParcs'
import { fecthSitesQuery } from '../../hooks/useSites'
import fecthEnginsQueryByParcBySite from '../../hooks/useEngins'
import { useGetAllTypepannesByParcId } from '../../hooks/useTypepannes'
import { usePannesByTypePanne } from '../../hooks/usePannes'
import {
  fetchGetAllLubrifiantsByParcId,
  fetchGetAllTypeconsommationlubsByParcId,
} from '../../hooks/useLubrifiants'
import {
  useCreateSaisieLubrifiant,
  useDeleteSaisieLubrifiant,
} from '../../hooks/useSaisieLubrifiant'

const SaisieRjeV2Page = () => {
  const queryClient = useQueryClient()

  // États pour les sélections
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedTypeParc, setSelectedTypeParc] = useState('')
  const [selectedParc, setSelectedParc] = useState('')
  const [selectedSite, setSelectedSite] = useState('')
  const [selectedEngin, setSelectedEngin] = useState('')

  // États pour la saisie
  const [hrmValue, setHrmValue] = useState('')

  // États pour les modales
  const [showHRMModal, setShowHRMModal] = useState(false)
  const [showPanneModal, setShowPanneModal] = useState(false)
  const [showLubrifiantModal, setShowLubrifiantModal] = useState(false)
  const [showDeletePanneModal, setShowDeletePanneModal] = useState(false)
  const [panneToDelete, setPanneToDelete] = useState(null)

  // États pour la nouvelle panne
  const [newPanne, setNewPanne] = useState({
    typePanneId: '',
    panneId: '',
    him: '',
    ni: '',
  })

  // États pour le nouveau lubrifiant
  const [newLubrifiant, setNewLubrifiant] = useState({
    lubrifiantId: '',
    typeConsommationId: '',
    qte: '',
    obs: '',
  })

  const [selectedSaisieHIM, setSelectedSaisieHIM] = useState(null)

  // Queries pour les données de référence
  const typeparcsQuery = useQuery(useTypeparcs())
  const parcsByTypeparcQuery = useQuery(useParcsByTypeParc(selectedTypeParc))
  const sitesQuery = useQuery(fecthSitesQuery())
  const enginsQuery = useQuery(fecthEnginsQueryByParcBySite(selectedParc, selectedSite))

  // Query pour les données de saisie
  const saisieRjeQuery = useQuery(fecthSaisieRjeQueryOptions(selectedDate, selectedEngin))

  // Queries pour les modales
  const typepannesQuery = useQuery(useGetAllTypepannesByParcId(selectedParc))
  const pannesByTypepanneQuery = useQuery(usePannesByTypePanne(newPanne.typePanneId))
  const lubrifiantsQuery = useQuery(fetchGetAllLubrifiantsByParcId(selectedParc))
  const typeConsommationsQuery = useQuery(fetchGetAllTypeconsommationlubsByParcId(selectedParc))

  // Mutations
  const mutationUpsetHRM = useUpsetHRM()
  const mutationAddPanne = useAddPanne()
  const mutationDeletePanne = useDeleteSaisiePanne()
  const mutationCreateLubrifiant = useCreateSaisieLubrifiant()
  const mutationDeleteLubrifiant = useDeleteSaisieLubrifiant()

  // Effet pour mettre à jour la valeur HRM quand les données changent
  useEffect(() => {
    if (saisieRjeQuery.data?.[0]?.hrm !== undefined) {
      setHrmValue(saisieRjeQuery.data[0].hrm.toString())
    } else {
      setHrmValue('')
    }
  }, [saisieRjeQuery.data])

  // Gestionnaires d'événements
  const handleCreateOrUpdateHRM = async () => {
    if (!selectedEngin || !selectedSite || !hrmValue) {
      toast.error('Veuillez remplir tous les champs obligatoires')
      return
    }

    if (parseFloat(hrmValue) > 24 || parseFloat(hrmValue) < 0) {
      toast.error('HRM ne doit pas dépasser 24h')
      return
    }

    const upsetHRM = {
      id: saisieRjeQuery.data?.[0]?.id || '',
      du: selectedDate,
      enginId: selectedEngin,
      siteId: selectedSite,
      hrm: parseFloat(hrmValue),
    }

    mutationUpsetHRM.mutate(upsetHRM, {
      onSuccess: () => {
        toast.success('HRM sauvegardé avec succès')
        setShowHRMModal(false)
      },
      onError: (error) => {
        toast.error(error.message || 'Erreur lors de la sauvegarde')
      },
    })
  }

  const handleCreatePanne = async () => {
    if (!newPanne.panneId || !newPanne.him || !newPanne.ni) {
      toast.error('Veuillez remplir tous les champs')
      return
    }

    // Vérification du total HRM + HIM
    const currentHRM = saisieRjeQuery.data?.[0]?.hrm || 0
    const currentHIM =
      saisieRjeQuery.data?.[0]?.Saisiehim?.reduce((sum, him) => sum + him.him, 0) || 0
    const totalHRMHIM = currentHIM + parseFloat(newPanne.him) + currentHRM

    if (totalHRMHIM > 24) {
      toast.error(`Total HRM + HIM = ${totalHRMHIM}h > 24h - Impossible de dépasser 24h`)
      return
    }

    const panneToAdd = {
      saisiehrmId: saisieRjeQuery.data?.[0]?.id,
      panneId: newPanne.panneId,
      him: parseFloat(newPanne.him),
      ni: parseInt(newPanne.ni),
    }

    mutationAddPanne.mutate(panneToAdd, {
      onSuccess: () => {
        toast.success('Panne ajoutée avec succès')
        setShowPanneModal(false)
        setNewPanne({ typePanneId: '', panneId: '', him: '', ni: '' })
      },
    })
  }

  const handleDeletePanne = async () => {
    if (!panneToDelete) return

    const data = { id: panneToDelete.id }

    mutationDeletePanne.mutate(data, {
      onSuccess: () => {
        toast.success('Panne supprimée avec succès')
        handleCloseDeletePanneModal()
      },
    })
  }

  const handleAddLubrifiant = async () => {
    if (!newLubrifiant.lubrifiantId || !newLubrifiant.qte) {
      toast.error('Veuillez sélectionner un lubrifiant et saisir la quantité')
      return
    }

    const lubrifiantData = {
      ...newLubrifiant,
      saisiehimId: selectedSaisieHIM.id,
      qte: parseFloat(newLubrifiant.qte),
    }

    mutationCreateLubrifiant.mutate(lubrifiantData, {
      onSuccess: () => {
        toast.success('Lubrifiant ajouté avec succès')
        setShowLubrifiantModal(false)
        setNewLubrifiant({ lubrifiantId: '', typeConsommationId: '', qte: '', obs: '' })

        // Mise à jour manuelle des données locales
        if (selectedSaisieHIM) {
          const updatedSaisieHIM = {
            ...selectedSaisieHIM,
            Saisielubrifiant: [...(selectedSaisieHIM.Saisielubrifiant || []), lubrifiantData],
          }
          setSelectedSaisieHIM(updatedSaisieHIM)
        }
      },
    })
  }

  const handleDeleteLubrifiant = async (lubrifiantId) => {
    mutationDeleteLubrifiant.mutate(
      { id: lubrifiantId },
      {
        onSuccess: () => {
          toast.success('Lubrifiant supprimé avec succès')

          // Mise à jour manuelle des données locales
          if (selectedSaisieHIM) {
            const updatedSaisielubrifiant = selectedSaisieHIM.Saisielubrifiant?.filter(
              (lub) => lub.id !== lubrifiantId,
            )
            setSelectedSaisieHIM({
              ...selectedSaisieHIM,
              Saisielubrifiant: updatedSaisielubrifiant,
            })
          }
        },
      },
    )
  }

  const handleShowDeletePanneModal = (saisieHIM) => {
    setPanneToDelete(saisieHIM)
    setShowDeletePanneModal(true)
  }

  const handleCloseDeletePanneModal = () => {
    setShowDeletePanneModal(false)
    setPanneToDelete(null)
  }

  // Calcul des totaux
  const saisiesHIM = saisieRjeQuery.data?.[0]?.Saisiehim || []
  const totalHIM = saisiesHIM.reduce((sum, him) => sum + him.him, 0)
  const totalNI = saisiesHIM.reduce((sum, him) => sum + him.ni, 0)
  const currentHRM = saisieRjeQuery.data?.[0]?.hrm || 0

  // États de chargement
  const isLoading =
    typeparcsQuery.isLoading ||
    parcsByTypeparcQuery.isLoading ||
    sitesQuery.isLoading ||
    enginsQuery.isLoading ||
    saisieRjeQuery.isLoading

  const isMutationLoading =
    mutationUpsetHRM.isPending ||
    mutationAddPanne.isPending ||
    mutationDeletePanne.isPending ||
    mutationCreateLubrifiant.isPending ||
    mutationDeleteLubrifiant.isPending

  // ETAT DES ERREURS
  const hasError =
    typepannesQuery.isError ||
    pannesByTypepanneQuery.isError ||
    lubrifiantsQuery.isError ||
    typeConsommationsQuery.isError ||
    mutationUpsetHRM.isError ||
    mutationDeletePanne.isError ||
    mutationCreateLubrifiant.isError ||
    mutationDeleteLubrifiant.isError ||
    typeparcsQuery.isError

  // MESSAGES DES ERREURS
  const ErrorMsg =
    hasError &&
    (typepannesQuery?.error?.message ||
      pannesByTypepanneQuery?.error?.message ||
      lubrifiantsQuery?.error?.message ||
      typeConsommationsQuery?.error?.message ||
      mutationUpsetHRM?.error?.message ||
      mutationDeletePanne?.error?.message ||
      mutationCreateLubrifiant?.error?.message ||
      mutationDeleteLubrifiant?.error?.message ||
      typeparcsQuery?.error?.message)

  return (
    <CContainer fluid>
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>
              <h5 className="mb-0">Saisie RJE - HRM & HIM</h5>
            </CCardHeader>
            <CCardBody>
              {/* Sélecteurs */}
              <CRow className="g-3 mb-4">
                <CCol md={2}>
                  <CFormInput
                    type="date"
                    label="Date de saisie"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </CCol>
                <CCol md={2}>
                  <CFormSelect
                    label="Type de parc"
                    value={selectedTypeParc}
                    onChange={(e) => {
                      setSelectedTypeParc(e.target.value)
                      setSelectedParc('')
                      setSelectedEngin('')
                    }}
                    disabled={isLoading}
                  >
                    <option value="">Sélectionner...</option>
                    {typeparcsQuery.data?.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>
                <CCol md={2}>
                  <CFormSelect
                    label="Parc"
                    value={selectedParc}
                    onChange={(e) => {
                      setSelectedParc(e.target.value)
                      setSelectedEngin('')
                    }}
                    disabled={!selectedTypeParc || isLoading}
                  >
                    <option value="">Sélectionner...</option>
                    {parcsByTypeparcQuery.data?.map((parc) => (
                      <option key={parc.id} value={parc.id}>
                        {parc.name}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>
                <CCol md={2}>
                  <CFormSelect
                    label="Site"
                    value={selectedSite}
                    onChange={(e) => {
                      setSelectedSite(e.target.value)
                      setSelectedEngin('')
                    }}
                    disabled={isLoading}
                  >
                    <option value="">Sélectionner...</option>
                    {sitesQuery.data?.map((site) => (
                      <option key={site.id} value={site.id}>
                        {site.name}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>
                <CCol md={2}>
                  <CFormSelect
                    label="Engin"
                    value={selectedEngin}
                    onChange={(e) => setSelectedEngin(e.target.value)}
                    disabled={!selectedParc || !selectedSite || isLoading}
                  >
                    <option value="">Sélectionner...</option>
                    {enginsQuery.data
                      ?.filter((engin) => engin.active)
                      ?.map((engin) => (
                        <option key={engin.id} value={engin.id}>
                          {engin.name}
                        </option>
                      ))}
                  </CFormSelect>
                </CCol>
                <CCol md={2} className="d-flex align-items-end">
                  <CButton
                    color="primary"
                    onClick={() => saisieRjeQuery.refetch()}
                    disabled={!selectedEngin || isLoading}
                  >
                    {saisieRjeQuery.isFetching && <CSpinner size="sm" className="me-2" />}
                    Charger
                  </CButton>
                </CCol>
              </CRow>

              {/* Informations */}
              {saisieRjeQuery.data?.[0] && (
                <CRow className="mb-3">
                  <CCol>
                    <div className="d-flex gap-4 align-items-center">
                      <CBadge color="danger" shape="rounded-pill">
                        {saisiesHIM.length}
                      </CBadge>
                      <span>Pannes</span>

                      <div className="d-flex align-items-center gap-3">
                        <i className="bi bi-clock text-info"></i>
                        <span>HRM : {currentHRM}h</span>

                        <i className="bi bi-geo-alt text-success"></i>
                        <span>Site : {saisieRjeQuery.data[0].Site?.name}</span>

                        <i className="bi bi-speedometer2 text-warning"></i>
                        <span>Total HIM : {totalHIM}h</span>
                      </div>
                    </div>
                  </CCol>
                </CRow>
              )}

              {/* Boutons d'action */}
              <CRow className="mb-3">
                <CCol className="text-center">
                  <CButton
                    color="primary"
                    variant="outline"
                    className="me-2 rounded-pill"
                    onClick={() => setShowHRMModal(true)}
                    disabled={!selectedEngin || isMutationLoading}
                  >
                    <i className="bi bi-clock me-2"></i>
                    Gérer HRM
                  </CButton>

                  <CButton
                    color="danger"
                    variant="outline"
                    className="rounded-pill"
                    onClick={() => setShowPanneModal(true)}
                    disabled={!saisieRjeQuery.data?.[0] || isMutationLoading}
                  >
                    <i className="bi bi-cone-striped me-2"></i>
                    Ajouter Panne
                  </CButton>
                </CCol>
              </CRow>

              {/* Tableau des pannes */}
              <CTable responsive striped hover>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Panne</CTableHeaderCell>
                    <CTableHeaderCell>Type</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">HIM</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">NI</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Lubrifiants</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {saisiesHIM.map((saisieHIM) => (
                    <CTableRow key={saisieHIM.id}>
                      <CTableDataCell>{saisieHIM.Panne?.name}</CTableDataCell>
                      <CTableDataCell>{saisieHIM.Panne?.Typepanne?.name}</CTableDataCell>
                      <CTableDataCell className="text-center">{saisieHIM.him}</CTableDataCell>
                      <CTableDataCell className="text-center">{saisieHIM.ni}</CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CButton
                          color="secondary"
                          variant="outline"
                          size="sm"
                          className="rounded-pill"
                          onClick={() => {
                            setSelectedSaisieHIM(saisieHIM)
                            setShowLubrifiantModal(true)
                          }}
                          disabled={isMutationLoading}
                        >
                          <i
                            className={`bi bi-droplet${saisieHIM.Saisielubrifiant?.length > 0 ? '-fill' : ''} me-2`}
                          ></i>
                          {saisieHIM.Saisielubrifiant?.length || 0}
                        </CButton>
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CButton
                          color="danger"
                          variant="outline"
                          size="sm"
                          className="rounded-pill"
                          onClick={() => handleShowDeletePanneModal(saisieHIM)}
                          disabled={
                            saisieHIM.Saisielubrifiant?.length > 0 || mutationDeletePanne.isPending
                          }
                        >
                          {mutationDeletePanne.isPending ? (
                            <CSpinner size="sm" />
                          ) : (
                            <i className="bi bi-trash3"></i>
                          )}
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))}

                  {/* Ligne de total */}
                  {saisiesHIM.length > 0 && (
                    <CTableRow>
                      <CTableDataCell colSpan="2" className="text-end">
                        <strong>Total :</strong>
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CBadge color="danger" shape="rounded-pill">
                          {totalHIM}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CBadge color="danger" shape="rounded-pill">
                          {totalNI}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell colSpan="2"></CTableDataCell>
                    </CTableRow>
                  )}

                  {saisiesHIM.length === 0 && saisieRjeQuery.data?.[0] && (
                    <CTableRow>
                      <CTableDataCell colSpan="6" className="text-center text-muted">
                        Aucune panne saisie pour cet engin
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>

              {!selectedEngin && !hasError && (
                <CAlert color="info" className="text-center">
                  Veuillez sélectionner un engin pour afficher les données
                </CAlert>
              )}

              {saisieRjeQuery.isError && (
                <CAlert color="danger" className="text-center">
                  {saisieRjeQuery?.error?.message}
                </CAlert>
              )}

              {typeparcsQuery.isError && (
                <CAlert color="danger" className="text-center">
                  {typeparcsQuery?.error?.message}
                </CAlert>
              )}

              {pannesByTypepanneQuery.isError && (
                <CAlert color="danger" className="text-center">
                  {pannesByTypepanneQuery?.error?.message}
                </CAlert>
              )}

              {lubrifiantsQuery.isError && (
                <CAlert color="danger" className="text-center">
                  {lubrifiantsQuery?.error?.message}
                </CAlert>
              )}

              {typeConsommationsQuery.isError && (
                <CAlert color="danger" className="text-center">
                  {typeConsommationsQuery?.error?.message}
                </CAlert>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Modal HRM */}
      <CModal backdrop="static" visible={showHRMModal} onClose={() => setShowHRMModal(false)}>
        <CModalHeader>
          <CModalTitle>Gestion HRM</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CFormInput
            type="number"
            step="0.5"
            min="0"
            max="24"
            label="HRM (heures)"
            value={hrmValue}
            onChange={(e) => setHrmValue(e.target.value)}
            disabled={mutationUpsetHRM.isPending}
          />
          {mutationUpsetHRM.isError && (
            <CAlert color="danger" className="mt-2">
              {mutationUpsetHRM.error.message}
            </CAlert>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            onClick={() => setShowHRMModal(false)}
            disabled={mutationUpsetHRM.isPending}
          >
            Annuler
          </CButton>
          <CButton
            color="primary"
            onClick={handleCreateOrUpdateHRM}
            disabled={mutationUpsetHRM.isPending}
          >
            {mutationUpsetHRM.isPending && <CSpinner size="sm" className="me-2" />}
            Sauvegarder
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Modal Panne */}
      <CModal backdrop="static" visible={showPanneModal} onClose={() => setShowPanneModal(false)}>
        <CModalHeader>
          <CModalTitle>Ajouter une Panne</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow className="g-3">
            <CCol md={6}>
              <CFormSelect
                label="Type de panne"
                value={newPanne.typePanneId}
                onChange={(e) =>
                  setNewPanne({ ...newPanne, typePanneId: e.target.value, panneId: '' })
                }
                disabled={mutationAddPanne.isPending}
              >
                <option value="">Sélectionner...</option>
                {typepannesQuery.data?.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
            <CCol md={6}>
              <CFormSelect
                label="Panne"
                value={newPanne.panneId}
                onChange={(e) => setNewPanne({ ...newPanne, panneId: e.target.value })}
                disabled={!newPanne.typePanneId || mutationAddPanne.isPending}
              >
                <option value="">Sélectionner...</option>
                {pannesByTypepanneQuery.data?.map((panne) => (
                  <option key={panne.id} value={panne.id}>
                    {panne.name}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
            <CCol md={6}>
              <CFormInput
                type="number"
                step="0.5"
                min="0"
                max="24"
                label="HIM (heures)"
                value={newPanne.him}
                onChange={(e) => setNewPanne({ ...newPanne, him: e.target.value })}
                disabled={mutationAddPanne.isPending}
              />
            </CCol>
            <CCol md={6}>
              <CFormInput
                type="number"
                step="1"
                min="0"
                label="NI"
                value={newPanne.ni}
                onChange={(e) => setNewPanne({ ...newPanne, ni: e.target.value })}
                disabled={mutationAddPanne.isPending}
              />
            </CCol>
          </CRow>
          {mutationAddPanne.isError && (
            <CAlert color="danger" className="mt-2">
              {mutationAddPanne.error.message}
            </CAlert>
          )}

          {hasError && (
            <CAlert color="danger" className="mt-2">
              {ErrorMsg}
            </CAlert>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            onClick={() => setShowPanneModal(false)}
            disabled={mutationAddPanne.isPending}
          >
            Annuler
          </CButton>
          <CButton
            color="primary"
            onClick={handleCreatePanne}
            disabled={mutationAddPanne.isPending}
          >
            {mutationAddPanne.isPending && <CSpinner size="sm" className="me-2" />}
            Ajouter
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Modal Lubrifiant */}
      <CModal
        backdrop="static"
        visible={showLubrifiantModal}
        onClose={() => setShowLubrifiantModal(false)}
        size="lg"
      >
        <CModalHeader>
          <CModalTitle>Gestion des Lubrifiants</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedSaisieHIM && (
            <>
              <div className="mb-3">
                <p>
                  <strong>Panne :</strong>{' '}
                  <span className="text-danger">{selectedSaisieHIM.Panne?.name}</span>
                </p>
                <p>
                  <strong>Type de Panne :</strong>{' '}
                  <span className="text-danger">{selectedSaisieHIM.Panne?.Typepanne?.name}</span>
                </p>
              </div>

              <CRow className="g-3">
                <CCol md={4}>
                  <CFormSelect
                    label="Lubrifiant"
                    value={newLubrifiant.lubrifiantId}
                    onChange={(e) =>
                      setNewLubrifiant({ ...newLubrifiant, lubrifiantId: e.target.value })
                    }
                    disabled={
                      mutationCreateLubrifiant.isPending || mutationDeleteLubrifiant.isPending
                    }
                  >
                    <option value="">Sélectionner...</option>
                    {lubrifiantsQuery.data?.map((lub) => (
                      <option key={lub.id} value={lub.id}>
                        {lub.name}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>
                <CCol md={4}>
                  <CFormSelect
                    label="Code Consommation"
                    value={newLubrifiant.typeConsommationId}
                    onChange={(e) =>
                      setNewLubrifiant({ ...newLubrifiant, typeConsommationId: e.target.value })
                    }
                    disabled={
                      mutationCreateLubrifiant.isPending || mutationDeleteLubrifiant.isPending
                    }
                  >
                    <option value="">Sélectionner...</option>
                    {typeConsommationsQuery.data?.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>
                <CCol md={4}>
                  <CFormInput
                    type="number"
                    step="0.1"
                    min="0"
                    label="Quantité"
                    value={newLubrifiant.qte}
                    onChange={(e) => setNewLubrifiant({ ...newLubrifiant, qte: e.target.value })}
                    disabled={
                      mutationCreateLubrifiant.isPending || mutationDeleteLubrifiant.isPending
                    }
                  />
                </CCol>
                <CCol md={12}>
                  <CFormInput
                    label="Observation"
                    value={newLubrifiant.obs}
                    onChange={(e) => setNewLubrifiant({ ...newLubrifiant, obs: e.target.value })}
                    disabled={
                      mutationCreateLubrifiant.isPending || mutationDeleteLubrifiant.isPending
                    }
                  />
                </CCol>
              </CRow>

              {/* Liste des lubrifiants existants */}
              {selectedSaisieHIM.Saisielubrifiant?.length > 0 && (
                <div className="mt-4">
                  <h6>Lubrifiants consommés :</h6>
                  <CTable size="sm">
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>Lubrifiant</CTableHeaderCell>
                        <CTableHeaderCell>Type</CTableHeaderCell>
                        <CTableHeaderCell>Qté</CTableHeaderCell>
                        <CTableHeaderCell>Code</CTableHeaderCell>
                        <CTableHeaderCell>OBS</CTableHeaderCell>
                        <CTableHeaderCell>Actions</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {selectedSaisieHIM.Saisielubrifiant.map((lub, index) => (
                        <CTableRow key={index}>
                          <CTableDataCell>{lub.Lubrifiant?.name}</CTableDataCell>
                          <CTableDataCell>{lub.Lubrifiant?.Typelubrifiant?.name}</CTableDataCell>
                          <CTableDataCell>{lub.qte}</CTableDataCell>
                          <CTableDataCell>{lub.Typeconsommationlub?.name}</CTableDataCell>
                          <CTableDataCell>{lub.obs}</CTableDataCell>
                          <CTableDataCell>
                            <CButton
                              color="danger"
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteLubrifiant(lub.id)}
                              disabled={mutationDeleteLubrifiant.isPending}
                            >
                              <i className="bi bi-trash3"></i>
                            </CButton>
                          </CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                </div>
              )}

              {(mutationCreateLubrifiant.isError || mutationDeleteLubrifiant.isError) && (
                <CAlert color="danger" className="mt-2">
                  {mutationCreateLubrifiant.error?.message ||
                    mutationDeleteLubrifiant.error?.message}
                </CAlert>
              )}
            </>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            onClick={() => setShowLubrifiantModal(false)}
            disabled={mutationCreateLubrifiant.isPending || mutationDeleteLubrifiant.isPending}
          >
            Fermer
          </CButton>
          <CButton
            color="primary"
            onClick={handleAddLubrifiant}
            disabled={mutationCreateLubrifiant.isPending || mutationDeleteLubrifiant.isPending}
          >
            {mutationCreateLubrifiant.isPending && <CSpinner size="sm" className="me-2" />}
            Ajouter
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Modal de suppression de panne */}
      <CModal
        backdrop="static"
        visible={showDeletePanneModal}
        onClose={handleCloseDeletePanneModal}
      >
        <CModalHeader>
          <CModalTitle>Confirmation de suppression</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="text-center">
            <CAlert color="warning">
              <strong>Voulez-vous vraiment supprimer cette panne ?</strong>
            </CAlert>
            {panneToDelete && (
              <div className="mt-3">
                <p>
                  <strong>Panne :</strong> {panneToDelete.Panne?.name}
                </p>
                <p>
                  <strong>Type :</strong> {panneToDelete.Panne?.Typepanne?.name}
                </p>
                <p>
                  <strong>HIM :</strong> {panneToDelete.him}h
                </p>
                <p>
                  <strong>NI :</strong> {panneToDelete.ni}
                </p>
              </div>
            )}

            {hasError && (
              <CAlert color="danger" className="mt-2">
                {ErrorMsg}
              </CAlert>
            )}
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            onClick={handleCloseDeletePanneModal}
            disabled={mutationDeletePanne.isPending}
          >
            Annuler
          </CButton>
          <CButton
            color="danger"
            onClick={handleDeletePanne}
            disabled={mutationDeletePanne.isPending}
          >
            {mutationDeletePanne.isPending && <CSpinner size="sm" className="me-2" />}
            Supprimer
          </CButton>
        </CModalFooter>
      </CModal>
    </CContainer>
  )
}

export default SaisieRjeV2Page
