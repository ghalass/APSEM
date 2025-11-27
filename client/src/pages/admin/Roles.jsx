import { useState } from 'react'
import {
  fecthRolesQuery,
  useAssignPermissionToRole,
  useDeleteRelationPermissionToRole,
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

  const createNewRole = () => {
    alert(JSON.stringify('new role'))
  }

  return (
    <AdminLayout>
      {/* ADD_PERMISSION_MODAL */}
      <CModal
        backdrop="static"
        visible={showAddPermissionModal}
        onClose={() => setShowAddPermissionModal(false)}
        aria-labelledby="LiveDemoExampleLabel"
      >
        <CModalHeader>
          <CModalTitle id="LiveDemoExampleLabel">Attribuer une permission à un rôle</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <h6 className="text-center">Rôle : {attibuerPermissionToRole?.role?.name}</h6>
          <div className="mt-2">
            <CFormSelect
              id="floatingSelect"
              floatingClassName="mb-3"
              floatingLabel="Choisir un rôle"
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
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowAddPermissionModal(false)}>
            Close
          </CButton>
          <CButton onClick={submitAttribuerPermissionRole} color="primary">
            Save
          </CButton>
        </CModalFooter>
      </CModal>

      {/* DELETE_PERMISSION_MODAL */}
      <CModal
        backdrop="static"
        visible={showDeletePermissionModal}
        onClose={() => setShowDeletePermissionModal(false)}
        aria-labelledby="LiveDemoExampleLabel"
      >
        <CModalHeader>
          <CModalTitle id="LiveDemoExampleLabel">Supprimer une permission</CModalTitle>
        </CModalHeader>
        <CModalBody className="text-center">
          <h6>Rôle :{deletePermissionToRole.role.name} </h6>
          <div className="mt-2">
            Voulez-vous vraiment suppimer cette permission ?
            <div className="d-flex justify-content-center gap-2 border mt-2 rounded-pill align-items-center py-2">
              <span>{deletePermissionToRole.permission.resource}</span>
              <span>{deletePermissionToRole.permission.action}</span>
            </div>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowDeletePermissionModal(false)}>
            Close
          </CButton>
          <CButton onClick={submitDeletePermissionRole} color="danger">
            Save
          </CButton>
        </CModalFooter>
      </CModal>

      {/*  */}
      <div className="d-flex align-items-center justify-content-between gap-1 text-uppercase mb-2">
        <div className="d-flex align-items-center gap-2">
          Liste des rôles
          <div>
            <CBadge textBgColor="primary"> {getAllRolesQuery.data?.length || 0}</CBadge>
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
        </CButton>
      </div>

      {/*  */}
      <div className="d-flex flex-wrap gap-2 mb-2">
        {getAllRolesQuery?.data?.length > 0 &&
          getAllRolesQuery?.data.map((role, index) => (
            <CCard style={{ width: '18rem' }} key={index}>
              <CCardBody>
                <CCardTitle className="d-flex align-content-center justify-content-between">
                  {role.name}
                  <CButton
                    onClick={() => attribuerPermissionRole(role)}
                    size="sm"
                    color="primary"
                    variant="outline"
                    className="rounded-pill"
                  >
                    <CIcon size="sm" icon={cilPlus} />
                  </CButton>
                </CCardTitle>
                <div className="d-flex justify-content-between">
                  <CCardSubtitle className="mb-2 text-body-secondary">Resource</CCardSubtitle>
                  <CCardSubtitle className="mb-2 text-body-secondary">Action</CCardSubtitle>
                </div>
                <div>
                  {role.permissions.map((perm, i) => (
                    <div
                      key={i}
                      className="d-flex justify-content-between rounded-pill border p-1 mb-1"
                    >
                      <div className="ms-1">{perm.resource}</div>
                      <div className="d-flex gap-1 justify-content-end align-content-center">
                        <div>{perm.action}</div>
                        <div
                          onClick={() => deletePermission(perm, role)}
                          className="btn btn-sm d-flex align-content-end justify-content-center text-danger"
                        >
                          <CIcon className="" size="sm" icon={cilTrash} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CCardBody>
            </CCard>
          ))}
      </div>
    </AdminLayout>
  )
}
