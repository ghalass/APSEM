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
        aria-hidden="false"
      >
        <CModalHeader>
          <CModalTitle id="LiveDemoExampleLabel">Supprimer une permission</CModalTitle>
        </CModalHeader>
        <CModalBody className="text-center">
          <div className="mt-2">
            Voulez-vous vraiment suppimer cette permission ?
            <div className="d-flex justify-content-center gap-2 border mt-2 rounded-pill align-items-center py-2">
              <span>Resource : {permissionToDelete.resource} </span>
              <span>Action : {permissionToDelete.action} </span>
            </div>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowDeletePermissionModal(false)}>
            Annuler
          </CButton>
          <CButton onClick={submitDeletePermissionRole} color="danger">
            Supprimer
          </CButton>
        </CModalFooter>
      </CModal>

      {/* ASSIGN_PERMISSION_TO_ROLE_MODAL */}
      <CModal
        backdrop="static"
        visible={showCreatePermissionModal}
        onClose={() => setShowCreatePermissionModal(false)}
        aria-labelledby="LiveDemoExampleLabel"
        aria-hidden="false"
      >
        <CModalHeader>
          <CModalTitle id="LiveDemoExampleLabel">Créer une permission</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <h6 className="text-center">Ressource : {permission.resource}</h6>
          <div className="my-2 d-flex gap-2 justify-content-center">
            {ACTIONS.map((action, index) => (
              <CFormCheck
                key={index}
                type="radio"
                name="flexRadioDefault"
                id={`action-${index}`}
                label={action}
                value={action}
                checked={permission.action === action}
                onChange={(e) => setPermission({ ...permission, action: e.target.value })}
              />
            ))}
          </div>
          {createPermissionMutation.isError && (
            <CAlert color="danger">{createPermissionMutation.error.message}</CAlert>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowCreatePermissionModal(false)}>
            Annuler
          </CButton>
          <CButton onClick={submitCreatePermissionRole} color="primary">
            Créer
          </CButton>
        </CModalFooter>
      </CModal>

      <div className="d-flex flex-wrap gap-2 mb-2">
        {getAllResourcesQuery.data?.length > 0 ? (
          getAllResourcesQuery.data?.map((resource) => (
            <div key={resource}>
              <CCard key={resource.id}>
                <CCardBody>
                  <CCardTitle>{resource.name}</CCardTitle>
                  <CCardSubtitle className="mb-2 text-body-secondary d-flex justify-content-between align-items-center gap-2">
                    <span>{resource}</span>
                    <CButton
                      onClick={() => createPermission(resource)}
                      size="sm"
                      color="primary"
                      variant="outline"
                      className="rounded-pill"
                    >
                      <CIcon size="sm" icon={cilPlus} />
                    </CButton>
                  </CCardSubtitle>
                  {/* <p>Actions : </p> */}
                  <div className="d-flex flex-wrap gap-1">
                    {getAllPermissionsQuery?.data?.length > 0 &&
                      getAllPermissionsQuery.data.map(
                        (p) =>
                          p.resource === resource && (
                            <CBadge
                              key={p.id}
                              textBgColor="light"
                              className="border mb-1 d-flex align-items-center gap-2"
                            >
                              {p.action}
                              <div
                                onClick={() => deletePermission(p)}
                                className="btn btn-sm d-flex align-content-end justify-content-center text-danger m-0 p-0"
                              >
                                <CIcon className="" size="sm" icon={cilTrash} />
                              </div>
                            </CBadge>
                          ),
                      )}
                  </div>
                </CCardBody>
              </CCard>
            </div>
          ))
        ) : (
          <p>Aucun rôle trouvé</p>
        )}
      </div>
    </AdminLayout>
  )
}
