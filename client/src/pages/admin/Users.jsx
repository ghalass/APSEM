import CIcon from '@coreui/icons-react'
import {
  CAlert,
  CBadge,
  CButton,
  CFormCheck,
  CFormInput,
  CFormSelect,
  CFormSwitch,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
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
import { useState } from 'react'
import {
  createUserQuery,
  deleteUserQuery,
  fecthUsersQuery,
  updateUserQuery,
} from '../../hooks/useUsers'
import { useQuery } from '@tanstack/react-query'
import { cilPenNib, cilTrash } from '@coreui/icons'
import { fecthRolesQuery } from '../../hooks/useRoles'
import AdminLayout from '../../layout/AdminLayout'
import TableHead from '../../components/TableHead'

const Users = () => {
  const getAllQuery = useQuery(fecthUsersQuery())
  const getAllRolesQuery = useQuery(fecthRolesQuery())

  const [visible, setVisible] = useState(false)
  const [operation, setOperation] = useState('')
  const initialVal = { id: '', name: '', email: '', password: '', active: true, roles: [] }

  const [entity, setEntity] = useState(initialVal)
  const createMutation = createUserQuery()
  const deleteMutation = deleteUserQuery()
  const updateMutation = updateUserQuery()

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = {
      id: entity.id,
      name: entity.name,
      email: entity.email,
      password: entity.password || '',
      roles: entity.roles,
      active: entity.active,
    }

    switch (operation) {
      case 'create':
        createMutation.mutate(data, {
          onSuccess: () => {
            setVisible(!visible)
            handleResetAll()
            toast.success('Utilisateur ajouté avec succès.')
          },
        })
        break
      case 'delete':
        deleteMutation.mutate(data, {
          onSuccess: () => {
            setVisible(!visible)
            handleResetAll()
            toast.success('Utilisateur supprimé avec succès.')
          },
        })
        break
      case 'update':
        updateMutation.mutate(data, {
          onSuccess: () => {
            setVisible(!visible)
            handleResetAll()
            toast.success('Utilisateur modifié avec succès.')
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

  // Filter the users based on the search query
  const filteredUsers = getAllQuery.data?.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase()),
  )

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1)
  const [usersPerPage, setUsersPerPage] = useState(10)

  // Calculate current users to display
  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = filteredUsers?.slice(indexOfFirstUser, indexOfLastUser)

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  // Calculate total pages
  const totalPages = Math.ceil(filteredUsers?.length / usersPerPage)

  return (
    <AdminLayout>
      <TableHead
        title="Liste des utilisateurs"
        getAllQuery={getAllQuery}
        search={search}
        handleSearch={handleSearch}
        setEntity={setEntity}
        initialVal={initialVal}
        setVisible={setVisible}
        visible={visible}
        setOperation={setOperation}
        tableId={'usersTable'}
        excelFileName={'Liste des utilisateurs'}
        currentEntitys={currentUsers}
        entitysPerPage={usersPerPage}
        setEntitysPerPage={setUsersPerPage}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        handlePageChange={handlePageChange}
        totalPages={totalPages}
        filteredEntitys={filteredUsers}
      />

      <CTable responsive striped hover className="mt-3" id="usersTable">
        <CTableHead className="bg-body">
          <CTableRow>
            <CTableHeaderCell scope="col" className="text-body">
              Nom
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" className="text-body">
              Email
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" className="text-body">
              Rôles
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" className="text-body">
              Permissions
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
          {currentUsers && currentUsers?.length > 0 ? (
            currentUsers?.map((user, index) => (
              <CTableRow key={user.id} className="bg-body">
                <CTableDataCell className="text-body fw-medium">{user?.name}</CTableDataCell>

                <CTableDataCell className="text-body">{user?.email}</CTableDataCell>

                <CTableDataCell>
                  {user?.roles?.length > 0 ? (
                    <div className="d-flex flex-wrap gap-1">
                      {user.roles.map((role) => (
                        <CBadge key={role.id} color="primary" className="text-capitalize">
                          {role.name}
                        </CBadge>
                      ))}
                    </div>
                  ) : (
                    <CBadge color="secondary" className="text-body">
                      Aucun rôle
                    </CBadge>
                  )}
                </CTableDataCell>

                <CTableDataCell>
                  {user?.roles?.some((role) => role?.permissions?.length > 0) ? (
                    <div className="d-flex flex-wrap gap-1">
                      {Array.from(
                        new Set(
                          user.roles.flatMap(
                            (role) =>
                              role.permissions?.map((perm) => `${perm.resource}:${perm.action}`) ||
                              [],
                          ),
                        ),
                      ).map((permissionKey) => {
                        const [resource, action] = permissionKey.split(':')
                        return (
                          <CBadge
                            key={permissionKey}
                            color="success"
                            className="text-capitalize small"
                          >
                            {resource}:{action}
                          </CBadge>
                        )
                      })}
                    </div>
                  ) : (
                    <CBadge color="secondary" className="text-body">
                      Aucune permission
                    </CBadge>
                  )}
                </CTableDataCell>

                <CTableDataCell>
                  <CBadge color={user?.active ? 'success' : 'secondary'}>
                    {user?.active ? 'Actif' : 'Inactif'}
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
                        setEntity(user)
                        setOperation('update')
                        setVisible(true)
                      }}
                      title="Modifier l'utilisateur"
                    >
                      <CIcon icon={cilPenNib} />
                    </CButton>
                    <CButton
                      size="sm"
                      color="danger"
                      variant="outline"
                      className="rounded-pill"
                      onClick={() => {
                        setEntity(user)
                        setOperation('delete')
                        setVisible(true)
                      }}
                      title="Supprimer l'utilisateur"
                    >
                      <CIcon icon={cilTrash} />
                    </CButton>
                  </div>
                </CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow className="bg-body">
              <CTableDataCell colSpan={6} className="text-center text-body py-4">
                {getAllQuery.isLoading ? (
                  <div className="d-flex align-items-center justify-content-center gap-2">
                    <CSpinner size="sm" />
                    <span>Chargement des utilisateurs...</span>
                  </div>
                ) : (
                  <div>
                    <CIcon icon={cilUser} size="xl" className="text-body-secondary mb-2" />
                    <div>Aucun utilisateur trouvé</div>
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
        aria-labelledby="UserModalLabel"
      >
        <CModalHeader className="bg-body">
          <CModalTitle id="UserModalLabel" className="text-body">
            {operation === 'create' && 'Créer un utilisateur'}
            {operation === 'update' && "Modifier l'utilisateur"}
            {operation === 'delete' && "Supprimer l'utilisateur"}
          </CModalTitle>
        </CModalHeader>
        <CModalBody className="bg-body">
          {operation === 'delete' ? (
            <div className="text-center text-body">
              <CAlert color="warning" className="mb-3">
                <strong>Attention!</strong> Cette action est irréversible.
              </CAlert>
              <p>Voulez-vous vraiment supprimer l'utilisateur :</p>
              <div className="border rounded p-3 bg-body">
                <strong className="text-body">{entity.name}</strong>
                <div className="text-body-secondary">{entity.email}</div>
              </div>
            </div>
          ) : (
            <>
              <CRow className="mb-3">
                <CCol>
                  <CFormSwitch
                    size="lg"
                    label="Utilisateur actif"
                    id="userActiveSwitch"
                    checked={entity?.active}
                    onChange={(e) => setEntity({ ...entity, active: e.target.checked })}
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="text-body"
                  />
                </CCol>
              </CRow>

              <div className="mb-3">
                <label className="form-label text-body fw-medium mb-2">Rôles attribués :</label>
                <CRow className="g-2">
                  {getAllRolesQuery?.data?.map((role) => (
                    <CCol xs={6} md={4} key={role.id}>
                      <div className="border rounded p-2 bg-body">
                        <CFormCheck
                          label={role.name}
                          id={`role-${role.id}`}
                          checked={entity?.roles?.some((r) => r.id === role.id)}
                          onChange={(e) => {
                            const isChecked = e.target.checked
                            const updatedRoles = isChecked
                              ? [...(entity?.roles || []), role]
                              : entity?.roles?.filter((r) => r.id !== role.id) || []

                            setEntity({ ...entity, roles: updatedRoles })
                          }}
                          disabled={createMutation.isPending || updateMutation.isPending}
                          className="text-body"
                        />
                      </div>
                    </CCol>
                  ))}
                </CRow>
              </div>

              <CFormInput
                type="text"
                id="userNameInput"
                floatingClassName="mb-3"
                floatingLabel="Nom de l'utilisateur"
                placeholder="Entrez le nom"
                value={entity.name}
                onChange={(e) => setEntity({ ...entity, name: e.target.value })}
                disabled={createMutation.isPending || updateMutation.isPending}
              />

              <CFormInput
                type="email"
                id="userEmailInput"
                floatingClassName="mb-3"
                floatingLabel="Email de l'utilisateur"
                placeholder="Entrez l'email"
                value={entity.email}
                onChange={(e) => setEntity({ ...entity, email: e.target.value })}
                disabled={createMutation.isPending || updateMutation.isPending}
              />

              <CFormInput
                type="password"
                id="userPasswordInput"
                floatingClassName="mb-3"
                floatingLabel="Mot de passe"
                placeholder={
                  operation === 'update'
                    ? 'Laisser vide pour ne pas modifier'
                    : 'Entrez le mot de passe'
                }
                value={entity.password || ''}
                onChange={(e) => setEntity({ ...entity, password: e.target.value })}
                disabled={createMutation.isPending || updateMutation.isPending}
              />

              {(createMutation.isError || updateMutation.isError) && (
                <CAlert color="danger" className="mb-0 mt-2">
                  {createMutation.error?.message || updateMutation.error?.message}
                </CAlert>
              )}
            </>
          )}

          {deleteMutation.isError && (
            <CAlert color="danger" className="mb-0 mt-2">
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
                !entity.email
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
    </AdminLayout>
  )
}

export default Users
