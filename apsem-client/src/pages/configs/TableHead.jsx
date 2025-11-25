import { cilCloudDownload, cilPlus } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CBadge, CButton, CPagination, CPaginationItem, CSpinner } from '@coreui/react'
import React from 'react'
import { exportExcel, getMultiplesOf } from '../../utils/func'

const TableHead = ({
  title,
  getAllQuery,
  search,
  handleSearch,
  setEntity,
  initialVal,
  setVisible,
  visible,
  setOperation,
  tableId,
  excelFileName,
  currentEntitys,
  entitysPerPage,
  setEntitysPerPage,
  setCurrentPage,
  currentPage,
  handlePageChange,
  totalPages,
  filteredEntitys,
}) => {
  return (
    <div>
      <div className="row text-center">
        <div className="col-sm mb-2">
          <div className="d-flex align-items-center gap-1 text-uppercase">
            {title}
            <div>
              <CBadge textBgColor="primary"> {getAllQuery.data?.length || 0}</CBadge>
            </div>
            {(getAllQuery.isLoading || getAllQuery.isPending || getAllQuery.isRefetching) && (
              <CSpinner color="primary" size="sm" />
            )}
          </div>
        </div>

        <div className="col-sm mb-2">
          <div className="d-flex gap-1 justify-content-end">
            <input
              type="search"
              placeholder="Chercher..."
              className="form-control form-control-sm "
              value={search}
              onChange={handleSearch}
            />

            <CButton
              size="sm"
              color="primary"
              variant="outline"
              className="rounded-pill"
              onClick={() => {
                setEntity(initialVal)
                setVisible(!visible)
                setOperation('create')
              }}
            >
              <CIcon icon={cilPlus} />
            </CButton>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-sm col-md-2 text-center text-sm-start mb-2">
          <CButton
            size="sm"
            color="success"
            variant="outline"
            onClick={() => exportExcel(tableId, excelFileName)}
            className="rounded-pill"
            disabled={!!currentEntitys?.length !== true}
          >
            Excel <CIcon icon={cilCloudDownload} />
          </CButton>
        </div>

        <div className="col-sm col-md-10 mb-2">
          <div className="d-flex gap-2 justify-content-end">
            <div style={{ width: '50px' }}>
              <select
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
              </select>
            </div>
            <div className="">
              <CPagination size="sm" aria-label="Page navigation example" className="mb-0">
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
              </CPagination>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TableHead
