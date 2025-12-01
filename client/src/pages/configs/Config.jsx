import React from 'react'
import { CCard, CCardBody, CBadge, CContainer } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSettings, cilCog } from '@coreui/icons'
import ConfigLayout from '../../layout/ConfigLayout'

export default function Config() {
  const configItems = [
    'Engins',
    'Parcs',
    'TypeParcs',
    'Pannes',
    'TypePannes',
    'Sites',
    'Objectifs',
    'Lubrifiants',
    'TypeLubrifiants',
    'TypeConsommationLubs',
  ]

  return (
    <ConfigLayout>
      <CContainer className="py-4">
        <CCard className="border-0">
          <CCardBody className="text-center p-4">
            {/* En-tête */}
            <div className="mb-4">
              <CIcon icon={cilSettings} size="xl" className="text-primary mb-3" />
              <h1 className="h3 mb-2 text-body">Configuration du Système</h1>
              <p className="text-body-secondary mb-0">Gestion des paramètres et référentiels</p>
            </div>

            {/* Éléments configurables */}
            <div className="mb-4">
              <h2 className="h5 mb-3 text-body">
                <CIcon icon={cilCog} className="me-2" />
                Éléments configurables
              </h2>
              <div className="d-flex flex-wrap justify-content-center gap-2">
                {configItems.map((item, index) => (
                  <CBadge key={index} color="primary" textColor="white" className="fs-6 px-3 py-2">
                    {item}
                  </CBadge>
                ))}
              </div>
            </div>

            {/* Séparateur */}
            <hr className="my-4" />

            {/* Message */}
            <div className="text-body-secondary small">
              <CIcon icon={cilSettings} className="me-1" />
              Accédez aux fonctionnalités via le menu de navigation
            </div>
          </CCardBody>
        </CCard>
      </CContainer>
    </ConfigLayout>
  )
}
