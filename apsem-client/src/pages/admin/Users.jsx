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
import { USER_TYPE } from '../../utils/types'
import TableHead from '../configs/TableHead'
import { fecthRolesQuery } from '../../hooks/useRoles'
import AdminLayout from '../../layout/AdminLayout'
// import TableHead from './TableHead'

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

    console.log(data)

    return
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
    el.name.toLowerCase().includes(search.toLowerCase()),
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
        tableId={'myTable'}
        excelFileName={'Liste des utilisateurs'}
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
            <CTableHeaderCell scope="col">Nom de l'utilisateur</CTableHeaderCell>
            <CTableHeaderCell scope="col">Email</CTableHeaderCell>
            <CTableHeaderCell scope="col">Rôles</CTableHeaderCell>
            <CTableHeaderCell scope="col">Permissions</CTableHeaderCell>
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
                  {item?.name}
                </CTableDataCell>

                <CTableDataCell>{item?.email}</CTableDataCell>
                {/* <CTableDataCell>{item?.role?.replace('_', ' ')}</CTableDataCell> */}
                <CTableDataCell>
                  {item?.roles.length > 0 ? (
                    <>
                      {item?.roles.map((role) => (
                        <CBadge key={role.id} color="primary" className="me-1">
                          {role.name}
                        </CBadge>
                      ))}
                    </>
                  ) : (
                    ''
                  )}
                </CTableDataCell>
                <CTableDataCell>
                  {item?.roles.length > 0 ? (
                    <>
                      {item?.roles.map((role) => (
                        <div key={role.id}>
                          {role?.permissions?.length > 0 ? (
                            <>
                              {role?.permissions?.map((perm) => (
                                <CBadge key={perm.id} color="success" className="me-1">
                                  {perm.resource} {perm.action}
                                </CBadge>
                              ))}
                            </>
                          ) : (
                            ''
                          )}
                        </div>
                      ))}
                    </>
                  ) : (
                    ''
                  )}
                </CTableDataCell>
                <CTableDataCell>
                  {item?.active ? (
                    <i className="bi bi-toggle2-on text-primary"></i>
                  ) : (
                    <i className="bi bi-toggle2-off text-secondary"></i>
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
          <CModalTitle id="StaticBackdropExampleLabel">Gestion d'un utilisateur</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="row">
            {/* <div className="col-8">
              <CFormSelect
                id="floatingSelect"
                floatingClassName="mb-3"
                floatingLabel="Choisir un rôle"
                aria-label="Floating label select example"
                value={entity?.role}
                onChange={(e) => setEntity({ ...entity, role: e.target.value })}
                disabled={
                  createMutation.isPending ||
                  updateMutation.isPending ||
                  deleteMutation.isPending ||
                  operation === 'delete'
                }
              >
                <option value={''}></option>
                {getAllRolesQuery?.data?.map((u_type, index) => (
                  <option key={index} value={u_type.name}>
                    {u_type.name}
                  </option>
                ))}
              </CFormSelect>
            </div> */}
            <div className="col">
              {/* <CFormCheck
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
              /> */}

              <CFormSwitch
                size="xl"
                label="Active"
                id="formSwitchCheckDefaultXL"
                checked={entity?.active}
                onChange={(e) => setEntity({ ...entity, active: !entity?.active })}
                disabled={
                  createMutation.isPending ||
                  updateMutation.isPending ||
                  deleteMutation.isPending ||
                  operation === 'delete'
                }
              />
            </div>
          </div>
          {/* <div className="row">{JSON.stringify(entity?.roles)}</div> */}

          <div className="d-flex gap-1 my-2">
            {getAllRolesQuery?.data &&
              getAllRolesQuery?.data.length > 0 &&
              getAllRolesQuery?.data.map((r) => {
                const check = entity?.roles?.some((role) => role.id === r.id)
                return (
                  <CBadge
                    key={r.id}
                    textBgColor="light"
                    className={`border ${check && 'bg-primary-subtle'}`}
                  >
                    {r.name}{' '}
                    {check && (
                      <span className="rounded rounded-circle border-primary text-danger">
                        <i className="bi bi-trash"></i>
                      </span>
                    )}
                  </CBadge>
                )
              })}
          </div>

          <div className="d-flex gap-1 mb-2">
            {entity?.roles &&
              entity?.roles.length > 0 &&
              entity?.roles.map((r) => (
                <CBadge key={r.id} textBgColor="light" className="border">
                  {r.name}
                </CBadge>
              ))}
          </div>
          <div className="d-flex gap-1 mb-2">
            {/* {JSON.stringify(entity?.roles)} */}
            {getAllRolesQuery?.data?.map((r, index) => (
              <CFormSwitch
                key={r.id}
                size="md"
                label={r.name}
                id={`role-switch-${r.id}`}
                checked={entity?.roles?.some((role) => role.id === r.id)}
                onChange={(e) => {
                  const isChecked = e.target.checked
                  const updatedRoles = isChecked
                    ? [...(entity?.roles || []), r] // Ajouter le rôle
                    : entity?.roles?.filter((role) => role.id !== r.id) || [] // Retirer le rôle

                  setEntity({ ...entity, roles: updatedRoles })
                }}
                disabled={
                  createMutation.isPending ||
                  updateMutation.isPending ||
                  deleteMutation.isPending ||
                  operation === 'delete'
                }
              />
            ))}
          </div>
          <CFormInput
            type="text"
            id="floatingInput"
            floatingClassName="mb-3"
            floatingLabel="Nom de l'utilisateur"
            placeholder="pg11"
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
            type="email"
            id="floatingInputemail"
            floatingClassName="mb-3"
            floatingLabel="Email de l'utilisateur"
            placeholder="email"
            value={entity.email}
            onChange={(e) => setEntity({ ...entity, email: e.target.value })}
            disabled={
              createMutation.isPending ||
              updateMutation.isPending ||
              deleteMutation.isPending ||
              operation === 'delete'
            }
          />

          <CFormInput
            type="password"
            id="floatingInputpassword"
            floatingClassName="mb-3"
            floatingLabel="Mode de passe de l'utilisateur"
            placeholder="password"
            value={entity.password}
            onChange={(e) => setEntity({ ...entity, password: e.target.value })}
            disabled={
              createMutation.isPending ||
              updateMutation.isPending ||
              deleteMutation.isPending ||
              operation === 'delete'
            }
          />

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
    </AdminLayout>
  )
}

export default Users
