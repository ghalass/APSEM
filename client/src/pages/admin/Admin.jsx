import React from 'react'
import { CCard, CCardBody, CBadge, CContainer } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilUser, cilShieldAlt } from '@coreui/icons'
import { useAuth } from '../../context/Auth'
import AdminLayout from '../../layout/AdminLayout'

export default function Admin() {
  const { user } = useAuth()

  return (
    <AdminLayout>
      <CContainer className="py-4">
        <CCard className="border-0">
          <CCardBody className="text-center p-4">
            {/* En-tête */}
            <div className="mb-4">
              <CIcon icon={cilShieldAlt} size="xl" className="text-primary mb-3" />
              <h1 className="h3 mb-2 text-body">Bienvenue, {user?.name} !</h1>
              <p className="text-body-secondary mb-0">
                Vous êtes connecté à l'espace administration
              </p>
            </div>

            {/* Rôles */}
            <div className="mb-4">
              <h2 className="h5 mb-3 text-body">
                <CIcon icon={cilUser} className="me-2" />
                Rôles attribués
              </h2>
              <div className="d-flex flex-wrap justify-content-center gap-2">
                {user?.roles?.map((role, index) => (
                  <CBadge key={index} color="primary" textColor="white" className="fs-6 px-3 py-2">
                    {role.name}
                  </CBadge>
                ))}
              </div>
            </div>

            {/* Séparateur */}
            <hr className="my-4" />

            {/* Message */}
            <div className="text-body-secondary small">
              <CIcon icon={cilShieldAlt} className="me-1" />
              Accédez aux fonctionnalités via le menu de navigation
            </div>
          </CCardBody>
        </CCard>
      </CContainer>
    </AdminLayout>
  )
}
