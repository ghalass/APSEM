import React from 'react'
import { fecthRolesQuery } from '../../hooks/useRoles'
import { useQuery } from '@tanstack/react-query'
import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardLink,
  CCardSubtitle,
  CCardText,
  CCardTitle,
  CCol,
  CRow,
  CSpinner,
} from '@coreui/react'
import { cilCloudDownload, cilPlus } from '@coreui/icons'
import { exportExcel } from '../../helpers/func'
import AdminLayout from '../../layout/AdminLayout'
import CIcon from '@coreui/icons-react'

export default function Roles() {
  const getAllQuery = useQuery(fecthRolesQuery())
  const addPermission = (roleId) => {
    alert(JSON.stringify(roleId))
  }

  const createNewRole = () => {
    alert(JSON.stringify('new role'))
  }
  return (
    <AdminLayout>
      <div className="">
        <div className="d-flex align-items-center justify-content-between gap-1 text-uppercase">
          <div className="d-flex align-items-center gap-2">
            Liste des rôles
            <div>
              <CBadge textBgColor="primary"> {getAllQuery.data?.length || 0}</CBadge>
            </div>
            <div>
              {(getAllQuery.isLoading || getAllQuery.isPending || getAllQuery.isRefetching) && (
                <CSpinner color="primary" size="sm" />
              )}
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

        <div className="row">
          <div className="col-sm col-md-2 text-center text-sm-start mb-2">
            {/* <CButton
                  size="sm"
                  color="success"
                  variant="outline"
                  onClick={() => exportExcel(tableId, excelFileName)}
                  className="rounded-pill"
                  disabled={!!currentEntitys?.length !== true}
                >
                  Excel <CIcon icon={cilCloudDownload} />
                </CButton> */}
          </div>

          <div className="col-sm col-md-10 mb-2">
            <div className="d-flex gap-2 justify-content-end">
              <div style={{ width: '50px' }}>
                {/* <select
                      className="form-control form-control-sm"
                      defaultValue={entitysPerPage}
                      onChange={(e) => {
                        setEntitysPerPage(e.target.value)
                        setCurrentPage(1)
                      }}
                    >
                      {getMultiplesOf(filteredEntitys?.length, 5)?.map((item, i) => (
                        <option key={i} value={item}>
                          {item}
                        </option>
                      ))}
                    </select> */}
              </div>
              <div className="">
                {/* <CPagination size="sm" aria-label="Page navigation example" className="mb-0">
                      <CPaginationItem
                        aria-label="Previous"
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                      >
                        <span aria-hidden="true">&laquo;</span>
                      </CPaginationItem>
      
                      {Array.from({ length: totalPages }, (_, index) => (
                        <CPaginationItem
                          key={index}
                          active={index + 1 === currentPage}
                          size="sm"
                          onClick={() => handlePageChange(index + 1)}
                        >
                          {index + 1}
                        </CPaginationItem>
                      ))}
      
                      <CPaginationItem
                        aria-label="Next"
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                      >
                        <span aria-hidden="true">&raquo;</span>
                      </CPaginationItem>
                    </CPagination> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <CRow
        xs={{ cols: 1, gutter: 2 }}
        md={{ cols: 2 }}
        lg={{ cols: 3 }}
        xl={{ cols: 4 }}
        className="g-2 align-items-start"
      >
        {getAllQuery.data?.length > 0 ? (
          getAllQuery.data?.map((role) => (
            <CCol key={role.id}>
              <CCard>
                <CCardBody className="p-3">
                  {/* Padding réduit et uniforme */}
                  <div className="d-flex align-items-center justify-content-between gap-2 mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <strong className="small">Rôle:</strong>
                      <CBadge textBgColor="primary" className="border small">
                        {role.name}
                      </CBadge>
                    </div>
                    <div>
                      <CButton
                        onClick={() => addPermission(role.id)}
                        size="sm"
                        color="light"
                        variant="outline"
                        className="rounded-pill"
                      >
                        <CIcon size="sm" icon={cilPlus} />
                      </CButton>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <small className="text-body-secondary">Ressource</small>
                    <small className="text-body-secondary">Action</small>
                  </div>
                  {role?.permissions?.length > 0 ? (
                    role.permissions.map((perm) => (
                      <div
                        key={perm.id}
                        className="d-flex justify-content-between align-items-center mb-1"
                      >
                        <span className="small text-truncate pe-2" style={{ maxWidth: '60%' }}>
                          {perm.resource}
                        </span>
                        <CBadge textBgColor="light" className="border small">
                          {perm.action}
                        </CBadge>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted small text-center mb-0 mt-2">Aucune permission</p>
                  )}
                </CCardBody>
              </CCard>
            </CCol>
          ))
        ) : (
          <CCol xs={12}>
            <p className="text-center text-muted py-4">Aucun rôle trouvé</p>
          </CCol>
        )}
      </CRow>
    </AdminLayout>
  )
}
