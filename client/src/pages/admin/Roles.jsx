import { useState } from 'react'
import {
  fecthRolesQuery,
  useAssignPermissionToRole,
  useCreateRole,
  useDeleteRelationPermissionToRole,
  useDeleteRole,
} from '../../hooks/useRoles'
import { useQuery } from '@tanstack/react-query'
import {
  CAlert,
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardSubtitle,
  CCardTitle,
  CFormInput,
  CFormSelect,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CSpinner,
} from '@coreui/react'
import { cilPlus, cilTrash } from '@coreui/icons'
import AdminLayout from '../../layout/AdminLayout'
import CIcon from '@coreui/icons-react'
import { fecthPermissionsQuery } from '../../hooks/usePermissions'

export default function Roles() {
  const getAllRolesQuery = useQuery(fecthRolesQuery())
  const getAllPermissionsQuery = useQuery(fecthPermissionsQuery())

  // ASSIGN PERMISSION TO ROLE
  const [showAddPermissionModal, setShowAddPermissionModal] = useState(false)
  const assignPermissionToRoleMutation = useAssignPermissionToRole()
  const [attibuerPermissionToRole, setAttibuerPermissionToRole] = useState({
    role: {},
    permissionId: '',
  })
  const attribuerPermissionRole = (role) => {
    setAttibuerPermissionToRole({ ...attibuerPermissionToRole, role: role })
    setShowAddPermissionModal(!showAddPermissionModal)
  }
  const submitAttribuerPermissionRole = () => {
    const data = {
      roleId: attibuerPermissionToRole.role.id,
      permissionId: attibuerPermissionToRole.permissionId,
    }
    assignPermissionToRoleMutation.mutate(data, {
      onSuccess: () => {
        setShowAddPermissionModal(false)
      },
    })
  }

  // DELETE PERMISSION
  const [showDeletePermissionModal, setShowDeletePermissionModal] = useState(false)
  const deletePermissionToRoleMutation = useDeleteRelationPermissionToRole()
  const [deletePermissionToRole, setDeletePermissionToRole] = useState({
    permission: {},
    role: {},
  })
  const deletePermission = (perm, role) => {
    setDeletePermissionToRole({ permission: perm, role: role })
    setShowDeletePermissionModal(!showDeletePermissionModal)
  }
  const submitDeletePermissionRole = () => {
    const data = {
      roleId: deletePermissionToRole.role.id,
      permissionId: deletePermissionToRole.permission?.id,
    }
    deletePermissionToRoleMutation.mutate(data, {
      onSuccess: () => {
        setShowDeletePermissionModal(false)
      },
    })
  }

  // CREATE ROLE
  const [showCreateRoleModal, setShowCreateRoleModal] = useState(false)
  const createRoleMutation = useCreateRole()
  const [roleName, setRoleName] = useState('')
  const createNewRole = () => {
    setShowCreateRoleModal(!showCreateRoleModal)
  }
  const submitCreateRole = () => {
    const data = {
      name: roleName,
    }
    createRoleMutation.mutate(data, {
      onSuccess: () => {
        setShowCreateRoleModal(false)
        setRoleName('')
      },
    })
  }

  // DELETE ROLE
  const [showDeleteRoleModal, setShowDeleteRoleModal] = useState(false)
  const deleteRoleMutation = useDeleteRole()
  const [roleToDelete, setRoleToDelete] = useState({})
  const deleteRole = (role) => {
    setRoleToDelete(role)
    setShowDeleteRoleModal(!showDeleteRoleModal)
  }
  const submitDeleteRoleRole = () => {
    const data = {
      id: roleToDelete.id,
      name: roleToDelete.name,
    }
    deleteRoleMutation.mutate(data, {
      onSuccess: () => {
        setShowDeleteRoleModal(false)
      },
    })
  }

  return (
    <AdminLayout>
      {/* ASSIGN_PERMISSION_TO_ROLE_MODAL */}
      <CModal
        backdrop="static"
        visible={showAddPermissionModal}
        onClose={() => setShowAddPermissionModal(false)}
        aria-labelledby="LiveDemoExampleLabel"
        aria-hidden="false"
      >
        <CModalHeader className="bg-body">
          <CModalTitle id="LiveDemoExampleLabel">Attribuer une permission à un rôle</CModalTitle>
        </CModalHeader>
        <CModalBody className="bg-body">
          <h6 className="text-center text-body">Rôle : {attibuerPermissionToRole?.role?.name}</h6>
          <div className="mt-2">
            <CFormSelect
              id="floatingSelect"
              floatingClassName="mb-3"
              floatingLabel="Choisir une permission"
              aria-label="Floating label select example"
              value={attibuerPermissionToRole.permissionId}
              onChange={(e) =>
                setAttibuerPermissionToRole({
                  ...attibuerPermissionToRole,
                  permissionId: e.target.value,
                })
              }
              disabled={assignPermissionToRoleMutation.isPending}
            >
              <option value={''}></option>
              {getAllPermissionsQuery?.data?.map((perm, index) => (
                <option key={index} value={perm.id}>
                  {perm.action} {perm.resource}
                </option>
              ))}
            </CFormSelect>
            {assignPermissionToRoleMutation.isError && (
              <CAlert color="danger">{assignPermissionToRoleMutation.error.message}</CAlert>
            )}
          </div>
        </CModalBody>
        <CModalFooter className="bg-body">
          <CButton color="secondary" onClick={() => setShowAddPermissionModal(false)}>
            Annuler
          </CButton>
          <CButton onClick={submitAttribuerPermissionRole} color="primary">
            Attribuer
          </CButton>
        </CModalFooter>
      </CModal>

      {/* DELETE_PERMISSION_MODAL */}
      <CModal
        backdrop="static"
        visible={showDeletePermissionModal}
        onClose={() => setShowDeletePermissionModal(false)}
        aria-labelledby="LiveDemoExampleLabel"
        aria-hidden="false"
      >
        <CModalHeader className="bg-body">
          <CModalTitle id="LiveDemoExampleLabel">Supprimer une permission</CModalTitle>
        </CModalHeader>
        <CModalBody className="text-center bg-body">
          <h6 className="text-body">Rôle : {deletePermissionToRole.role.name} </h6>
          <div className="mt-2 text-body">
            Voulez-vous vraiment supprimer cette permission ?
            <div className="d-flex justify-content-center gap-2 border mt-2 rounded-pill align-items-center py-2 bg-body">
              <span className="text-body">{deletePermissionToRole.permission.resource}</span>
              <span className="text-body">{deletePermissionToRole.permission.action}</span>
            </div>
          </div>
        </CModalBody>
        <CModalFooter className="bg-body">
          <CButton color="secondary" onClick={() => setShowDeletePermissionModal(false)}>
            Annuler
          </CButton>
          <CButton onClick={submitDeletePermissionRole} color="danger">
            Supprimer
          </CButton>
        </CModalFooter>
      </CModal>

      {/* CREATE_ROLE_MODAL */}
      <CModal
        backdrop="static"
        visible={showCreateRoleModal}
        onClose={() => setShowCreateRoleModal(false)}
        aria-labelledby="LiveDemoExampleLabel"
        aria-hidden="false"
      >
        <CModalHeader className="bg-body">
          <CModalTitle id="LiveDemoExampleLabel">Nouveau rôle</CModalTitle>
        </CModalHeader>
        <CModalBody className="text-center bg-body">
          <CFormInput
            type="text"
            id="floatingInputname"
            floatingClassName="mb-3"
            floatingLabel="Rôle"
            placeholder="Nom du rôle"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            disabled={createRoleMutation.isPending}
          />
          {createRoleMutation.isError && (
            <CAlert color="danger">{createRoleMutation.error.message}</CAlert>
          )}
        </CModalBody>
        <CModalFooter className="bg-body">
          <CButton color="secondary" onClick={() => setShowCreateRoleModal(false)}>
            Annuler
          </CButton>
          <CButton onClick={submitCreateRole} color="primary">
            Créer
          </CButton>
        </CModalFooter>
      </CModal>

      {/* DELETE_ROLE_MODAL */}
      <CModal
        backdrop="static"
        visible={showDeleteRoleModal}
        onClose={() => setShowDeleteRoleModal(false)}
        aria-labelledby="LiveDemoExampleLabel"
        aria-hidden="false"
      >
        <CModalHeader className="bg-body">
          <CModalTitle id="LiveDemoExampleLabel">Supprimer un rôle</CModalTitle>
        </CModalHeader>
        <CModalBody className="text-center bg-body">
          <h6 className="text-body">Rôle : {roleToDelete.name} </h6>
          <div className="mt-2 text-body">Voulez-vous vraiment supprimer ce rôle ?</div>

          {deleteRoleMutation.isError && (
            <CAlert color="danger">{deleteRoleMutation.error.message}</CAlert>
          )}
        </CModalBody>
        <CModalFooter className="bg-body">
          <CButton color="secondary" onClick={() => setShowDeleteRoleModal(false)}>
            Annuler
          </CButton>
          <CButton onClick={submitDeleteRoleRole} color="danger">
            Supprimer
          </CButton>
        </CModalFooter>
      </CModal>

      {/* HEADER SECTION */}
      <div className="d-flex align-items-center justify-content-between gap-1 text-uppercase mb-4">
        <div className="d-flex align-items-center gap-2 text-body">
          Liste des rôles
          <div>
            <CBadge color="primary"> {getAllRolesQuery.data?.length || 0}</CBadge>
          </div>
          <div>
            {(getAllRolesQuery.isLoading ||
              getAllRolesQuery.isPending ||
              getAllRolesQuery.isRefetching) && <CSpinner color="primary" size="sm" />}
          </div>
        </div>
        <CButton
          onClick={createNewRole}
          size="sm"
          color="primary"
          variant="outline"
          className="rounded-pill"
        >
          <CIcon size="sm" icon={cilPlus} />
          Nouveau rôle
        </CButton>
      </div>

      {/* ROLES GRID */}
      <div className="d-flex flex-wrap gap-3 mb-2">
        {getAllRolesQuery?.data?.length > 0 ? (
          getAllRolesQuery.data.map((role, index) => (
            <CCard style={{ width: '18rem', minHeight: '300px' }} key={index} className="shadow-sm">
              <CCardBody className="d-flex flex-column">
                <CCardTitle className="d-flex align-items-center justify-content-between mb-3">
                  <span className="fw-bold text-body">{role.name}</span>
                  <div className="d-flex gap-1">
                    <CButton
                      onClick={() => attribuerPermissionRole(role)}
                      size="sm"
                      color="primary"
                      variant="outline"
                      className="rounded-pill"
                      title="Ajouter une permission"
                    >
                      <CIcon size="sm" icon={cilPlus} />
                    </CButton>
                    <CButton
                      onClick={() => deleteRole(role)}
                      size="sm"
                      color="danger"
                      variant="outline"
                      className="rounded-pill"
                      title="Supprimer le rôle"
                    >
                      <CIcon size="sm" icon={cilTrash} />
                    </CButton>
                  </div>
                </CCardTitle>

                <div className="d-flex justify-content-between mb-2">
                  <CCardSubtitle className="text-body-secondary small fw-bold">
                    Resource
                  </CCardSubtitle>
                  <CCardSubtitle className="text-body-secondary small fw-bold">
                    Action
                  </CCardSubtitle>
                </div>

                <div className="flex-grow-1">
                  {role.permissions.length > 0 ? (
                    role.permissions.map((perm, i) => (
                      <div
                        key={i}
                        className="d-flex justify-content-between align-items-center rounded-pill border p-2 mb-2 bg-body"
                      >
                        <span className="text-body small">{perm.resource}</span>
                        <div className="d-flex align-items-center gap-2">
                          <span className="text-body small">{perm.action}</span>
                          <CButton
                            onClick={() => deletePermission(perm, role)}
                            size="sm"
                            color="danger"
                            variant="ghost"
                            className="p-1"
                            title="Supprimer la permission"
                          >
                            <CIcon size="sm" icon={cilTrash} />
                          </CButton>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-body-secondary py-3">
                      <small>Aucune permission attribuée</small>
                    </div>
                  )}
                </div>
              </CCardBody>
            </CCard>
          ))
        ) : (
          <div className="w-100 text-center py-5">
            <div className="text-body-secondary">Aucun rôle trouvé</div>
            <CButton
              onClick={createNewRole}
              color="primary"
              variant="outline"
              className="mt-2 rounded-pill"
            >
              <CIcon size="sm" icon={cilPlus} className="me-1" />
              Créer le premier rôle
            </CButton>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
