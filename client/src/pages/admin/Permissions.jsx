import React, { useState } from 'react'
import AdminLayout from '../../layout/AdminLayout'
import { fecthResourcesQuery } from '../../hooks/useResources'
import {
  CAlert,
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardSubtitle,
  CCardText,
  CCardTitle,
  CCol,
  CFormCheck,
  CFormSelect,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CSpinner,
} from '@coreui/react'
import { useQuery } from '@tanstack/react-query'
import {
  fecthPermissionsQuery,
  useCreatePermission,
  useDeletePermission,
} from '../../hooks/usePermissions'
import { cilInfo, cilPlus, cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { ACTIONS } from '../../helpers/constantes'

export default function Permissions() {
  const getAllResourcesQuery = useQuery(fecthResourcesQuery())
  const getAllPermissionsQuery = useQuery(fecthPermissionsQuery())

  // DELETE PERMISSION
  const [showDeletePermissionModal, setShowDeletePermissionModal] = useState(false)
  const deletePermissionMutation = useDeletePermission()
  const [permissionToDelete, setDeletePermissionToRole] = useState({})
  const deletePermission = (permission) => {
    setDeletePermissionToRole(permission)
    setShowDeletePermissionModal(!showDeletePermissionModal)
  }
  const submitDeletePermissionRole = () => {
    const data = {
      id: permissionToDelete.id,
    }
    deletePermissionMutation.mutate(data, {
      onSuccess: () => {
        setShowDeletePermissionModal(false)
      },
    })
  }

  // CREATE PERMISSION
  const [showCreatePermissionModal, setShowCreatePermissionModal] = useState(false)
  const createPermissionMutation = useCreatePermission()
  const [permission, setPermission] = useState({ resource: '', action: '' })
  const createPermission = (resource) => {
    setPermission({ resource: resource, action: '' })
    setShowCreatePermissionModal(!showCreatePermissionModal)
  }
  const submitCreatePermissionRole = () => {
    const data = permission
    createPermissionMutation.mutate(data, {
      onSuccess: () => {
        setShowCreatePermissionModal(false)
        setPermission({ resource: '', action: '' })
      },
    })
  }

  return (
    <AdminLayout>
      {/* DELETE_PERMISSION_MODAL */}
      <CModal
        backdrop="static"
        visible={showDeletePermissionModal}
        onClose={() => setShowDeletePermissionModal(false)}
        aria-labelledby="LiveDemoExampleLabel"
      >
        <CModalHeader className="bg-body">
          <CModalTitle id="LiveDemoExampleLabel" className="text-body">
            Supprimer une permission
          </CModalTitle>
        </CModalHeader>
        <CModalBody className="text-center bg-body">
          <div className="mt-2 text-body">
            Voulez-vous vraiment supprimer cette permission ?
            <div className="d-flex justify-content-center gap-3 border mt-3 rounded p-3 bg-body">
              <div className="text-body">
                <strong>Resource :</strong> {permissionToDelete.resource}
              </div>
              <div className="text-body">
                <strong>Action :</strong> {permissionToDelete.action}
              </div>
            </div>
          </div>
          {deletePermissionMutation.isError && (
            <CAlert color="danger" className="mt-3">
              {deletePermissionMutation.error.message}
            </CAlert>
          )}
        </CModalBody>
        <CModalFooter className="bg-body">
          <CButton
            color="secondary"
            onClick={() => setShowDeletePermissionModal(false)}
            disabled={deletePermissionMutation.isPending}
          >
            Annuler
          </CButton>
          <CButton
            onClick={submitDeletePermissionRole}
            color="danger"
            disabled={deletePermissionMutation.isPending}
          >
            {deletePermissionMutation.isPending ? <CSpinner size="sm" /> : 'Supprimer'}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* CREATE_PERMISSION_MODAL */}
      <CModal
        backdrop="static"
        visible={showCreatePermissionModal}
        onClose={() => setShowCreatePermissionModal(false)}
        aria-labelledby="LiveDemoExampleLabel"
      >
        <CModalHeader className="bg-body">
          <CModalTitle id="LiveDemoExampleLabel" className="text-body">
            Créer une permission
          </CModalTitle>
        </CModalHeader>
        <CModalBody className="bg-body">
          <h6 className="text-center text-body mb-3">
            Ressource : <strong>{permission.resource}</strong>
          </h6>
          <div className="my-3">
            <CCardSubtitle className="text-body mb-3 text-center fw-bold">
              Sélectionnez une action :
            </CCardSubtitle>
            <CRow className="justify-content-center">
              {ACTIONS.map((action, index) => (
                <CCol xs={6} sm={4} key={index} className="mb-2">
                  <div className="border rounded p-2 bg-body text-center">
                    <CFormCheck
                      type="radio"
                      name="actionRadio"
                      id={`action-${index}`}
                      label={action}
                      value={action}
                      checked={permission.action === action}
                      onChange={(e) => setPermission({ ...permission, action: e.target.value })}
                      disabled={createPermissionMutation.isPending}
                      className="text-body justify-content-center"
                    />
                  </div>
                </CCol>
              ))}
            </CRow>
          </div>
          {createPermissionMutation.isError && (
            <CAlert color="danger">{createPermissionMutation.error.message}</CAlert>
          )}
        </CModalBody>
        <CModalFooter className="bg-body">
          <CButton
            color="secondary"
            onClick={() => setShowCreatePermissionModal(false)}
            disabled={createPermissionMutation.isPending}
          >
            Annuler
          </CButton>
          <CButton
            onClick={submitCreatePermissionRole}
            color="primary"
            disabled={!permission.action || createPermissionMutation.isPending}
          >
            {createPermissionMutation.isPending ? <CSpinner size="sm" /> : 'Créer'}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* HEADER SECTION */}
      <div className="d-flex align-items-center justify-content-between gap-1 mb-4">
        <div className="d-flex align-items-center gap-3">
          <h4 className="text-body mb-0">Gestion des Permissions</h4>
          <CBadge color="primary">{getAllResourcesQuery.data?.length || 0} ressources</CBadge>
          {(getAllResourcesQuery.isLoading || getAllPermissionsQuery.isLoading) && (
            <CSpinner color="primary" size="sm" />
          )}
        </div>
      </div>

      {/* RESOURCES GRID */}
      <CRow className="g-3">
        {getAllResourcesQuery.data?.length > 0 ? (
          getAllResourcesQuery.data?.map((resource, index) => {
            const resourcePermissions =
              getAllPermissionsQuery.data?.filter((p) => p.resource === resource) || []

            return (
              <CCol lg={4} md={6} sm={12} key={resource}>
                <CCard className="h-100 shadow-sm">
                  <CCardBody className="d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <CCardTitle className="text-body fw-bold text-capitalize">
                        {resource}
                      </CCardTitle>
                      <CButton
                        onClick={() => createPermission(resource)}
                        size="sm"
                        color="primary"
                        variant="outline"
                        className="rounded-circle"
                        title="Ajouter une permission"
                      >
                        <CIcon size="sm" icon={cilPlus} />
                      </CButton>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <CCardSubtitle className="text-body-secondary mb-0">
                        Permissions
                      </CCardSubtitle>
                      <CBadge color={resourcePermissions.length > 0 ? 'success' : 'secondary'}>
                        {resourcePermissions.length}
                      </CBadge>
                    </div>

                    <div className="flex-grow-1">
                      {resourcePermissions.length > 0 ? (
                        <div className="d-flex flex-column gap-2">
                          {resourcePermissions.map((p) => (
                            <div
                              key={p.id}
                              className="d-flex justify-content-between align-items-center border rounded p-2 bg-body"
                            >
                              <span className="text-body fw-medium">{p.action}</span>
                              <CButton
                                onClick={() => deletePermission(p)}
                                size="sm"
                                color="danger"
                                variant="ghost"
                                className="p-1"
                                title="Supprimer cette permission"
                              >
                                <CIcon size="sm" icon={cilTrash} />
                              </CButton>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center text-body-secondary py-4">
                          <CIcon icon={cilInfo} className="mb-2" size="xl" />
                          <div className="small">Aucune permission définie</div>
                          <CButton
                            onClick={() => createPermission(resource)}
                            size="sm"
                            color="primary"
                            variant="outline"
                            className="mt-2 rounded-pill"
                          >
                            <CIcon icon={cilPlus} className="me-1" />
                            Ajouter une permission
                          </CButton>
                        </div>
                      )}
                    </div>
                  </CCardBody>
                </CCard>
              </CCol>
            )
          })
        ) : (
          <CCol xs={12}>
            <div className="text-center py-5">
              <CIcon icon={cilInfo} size="xxl" className="text-body-secondary mb-3" />
              <h5 className="text-body-secondary">Aucune ressource trouvée</h5>
              <p className="text-body-secondary">
                Les ressources apparaîtront ici une fois disponibles.
              </p>
            </div>
          </CCol>
        )}
      </CRow>

      {/* LOADING STATE */}
      {(getAllResourcesQuery.isLoading || getAllPermissionsQuery.isLoading) && (
        <div className="text-center py-5">
          <CSpinner color="primary" />
          <div className="text-body mt-2">Chargement des permissions...</div>
        </div>
      )}

      {/* ERROR STATE */}
      {(getAllResourcesQuery.isError || getAllPermissionsQuery.isError) && (
        <CAlert color="danger" className="mt-3">
          Erreur lors du chargement des données. Veuillez réessayer.
        </CAlert>
      )}
    </AdminLayout>
  )
}
