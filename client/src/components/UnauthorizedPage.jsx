import React from 'react'
import {
  CContainer,
  CCard,
  CCardBody,
  CCardHeader,
  CAlert,
  CButton,
  CCol,
  CRow,
} from '@coreui/react'
import { cilLockLocked, cilHome } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useNavigate } from 'react-router-dom'

const UnauthorizedPage = () => {
  const navigate = useNavigate()

  return (
    <div style={{ maxWidth: '500px' }} className="mx-auto ">
      <CCard className="shadow-sm">
        <CCardBody className="p-5 text-center">
          <CAlert color="warning" className="mb-4">
            <h2 className="h1 mb-0">Accès Refusé</h2>
            <p className="mb-0">
              Vous n'avez pas les permissions nécessaires pour accéder à cette page.
            </p>
          </CAlert>

          <div className="mb-4">
            <p className="text-body-secondary mb-3">
              Cette section est réservée aux administrateurs du système. Si vous pensez que c'est
              une erreur, veuillez contacter votre administrateur.
            </p>
          </div>

          <div className="d-grid gap-2 d-md-flex justify-content-md-center">
            <CButton color="primary" onClick={() => navigate('/')} className="me-md-2">
              <CIcon icon={cilHome} className="me-2" />
              Page d'Accueil
            </CButton>
          </div>
        </CCardBody>
      </CCard>
    </div>
  )
}

export default UnauthorizedPage
