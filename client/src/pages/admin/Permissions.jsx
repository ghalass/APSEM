import React from 'react'
import AdminLayout from '../../layout/AdminLayout'
import { fecthResourcesQuery } from '../../hooks/useResources'
import {
  CBadge,
  CCard,
  CCardBody,
  CCardSubtitle,
  CCardText,
  CCardTitle,
  CCol,
  CRow,
} from '@coreui/react'
import { useQuery } from '@tanstack/react-query'
import { fetchPermissions } from '../../api/PermissionApi'
import { fecthPermissionsQuery } from '../../hooks/usePermissions'

export default function Permissions() {
  const getAllResourcesQuery = useQuery(fecthResourcesQuery())
  const getAllPermissionsQuery = useQuery(fecthPermissionsQuery())

  return (
    <AdminLayout>
      {/* {JSON.stringify(getAllPermissionsQuery.data)} */}
      {/* {JSON.stringify(getAllResourcesQuery.data)} */}
      <CRow xs={{ cols: 1, gutter: 2 }} md={{ cols: 3, gutter: 2 }}>
        {getAllResourcesQuery.data?.length > 0 ? (
          getAllResourcesQuery.data?.map((resource) => (
            <CCol key={resource}>
              <CCard key={resource.id}>
                <CCardBody>
                  <CCardTitle>{resource.name}</CCardTitle>
                  <CCardSubtitle className="mb-2 text-body-secondary">{resource}</CCardSubtitle>
                  {getAllPermissionsQuery?.data?.length > 0 &&
                    getAllPermissionsQuery.data.map(
                      (p) =>
                        p.resource === resource && (
                          <CBadge key={p.id} textBgColor="light" className="border me-1 mb-1">
                            {p.action}
                          </CBadge>
                        ),
                    )}
                </CCardBody>
              </CCard>
            </CCol>
          ))
        ) : (
          <p>Aucun rôle trouvé</p>
        )}
      </CRow>
    </AdminLayout>
  )
}
