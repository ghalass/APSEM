import React from 'react'
import AdminLayout from '../../layout/AdminLayout'
import { fecthResourcesQuery } from '../../hooks/useResources'
import { CCard, CCardBody, CCardSubtitle, CCardTitle, CCol, CRow } from '@coreui/react'
import { useQuery } from '@tanstack/react-query'

export default function Resources() {
  const getAllQuery = useQuery(fecthResourcesQuery())

  return (
    <AdminLayout>
      <CRow xs={{ cols: 20, gutter: 2 }}>
        {getAllQuery.data?.length > 0 ? (
          getAllQuery.data?.map((role) => (
            <CCol key={role}>
              <CCard key={role.id}>
                <CCardBody>
                  <CCardTitle>{role.name}</CCardTitle>
                  <CCardSubtitle className="mb-2 text-body-secondary">{role}</CCardSubtitle>
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
