import React, { useRef } from 'react'
import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import { cilSettings, cilUser, cilAccountLogout } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

// import avatar8 from './../../assets/images/avatars/8.jpg'
import avatar8 from './../../assets/images/avatars/icons8-user-80.png'
import { useNavigate } from 'react-router-dom'

// import Cookies from "universal-cookie";
import { useAuth } from '../../context/Auth'
import { apiRequest } from '../../helpers/apiRequest'
import { API_PATHS } from '../../helpers/apiPaths'

const AppHeaderDropdown = () => {
  const { user, isAdminOrSuperAdmin, logout } = useAuth()
  // const cookie = new Cookies();
  const navigate = useNavigate()
  const dropdownRef = useRef()

  const handleMenuItemClick = (action) => {
    // Fermer le dropdown en déclenchant un clic en dehors
    document.body.click()

    // Exécuter l'action après un petit délai pour la fermeture du dropdown
    setTimeout(() => {
      action()
    }, 100)
  }

  const handleProfileClick = () => {
    handleMenuItemClick(() => navigate('/user/profile'))
  }

  const handleAdminClick = () => {
    handleMenuItemClick(() => navigate('/admin'))
  }

  const handleLogout = () => {
    handleMenuItemClick(() => {
      /** LOGOUT FROM FRONT END - CONTEXT */
      // cookie.remove("Bearer");
      // REMOVE TOKEN FROM CONTEXT
      logout()

      /** LOGOUT FROM SERVER */
      const logoutApi = async () => {
        await apiRequest(API_PATHS.AUTH.LOGOUT, 'POST')
      }

      logoutApi()

      // REDIRECT TO LOGIN PAGE
      navigate('/login')
    })
  }

  return (
    <CDropdown variant="nav-item" alignment="end" ref={dropdownRef}>
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        <div className="d-flex align-items-center gap-2">
          {/* Avatar avec badge de statut */}
          <div className="position-relative">
            <CAvatar className="border border-2 border-primary" src={avatar8} size="md" />
            {/* Badge de statut en ligne */}
            <span
              className="position-absolute bottom-0 end-0 bg-success rounded-circle border border-2 border-white"
              style={{ width: '10px', height: '10px' }}
            ></span>
          </div>

          {/* Informations utilisateur - visible seulement sur desktop */}
          <div className="d-none d-sm-flex flex-column text-start">
            {/* Ligne 1: Message de bienvenue et nom */}
            <div className="d-flex align-items-center gap-1">
              <span className="text-muted small">Bienvenue</span>
              <span className="text-primary fw-semibold text-uppercase">{user && user?.name}</span>
            </div>

            {/* Ligne 2: Rôles avec badge */}
            <div className="d-flex align-items-center gap-1">
              <CBadge color="primary" shape="rounded-pill" className="px-2 py-1">
                {user.roles.map((r, i) => (
                  <span key={i} className="small">
                    {r.name}
                    {i + 1 < user.roles.length && ', '}
                  </span>
                ))}
              </CBadge>
            </div>
          </div>

          {/* Version mobile simplifiée */}
          <div className="d-sm-none">
            <div className="text-primary fw-bold text-uppercase small">{user && user?.name}</div>
          </div>
        </div>
      </CDropdownToggle>

      {/*  */}
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownItem
          as="button"
          type="button"
          onClick={handleProfileClick}
          className="d-flex align-items-center"
        >
          <CIcon icon={cilUser} className="me-2" />
          Profile
        </CDropdownItem>

        {isAdminOrSuperAdmin ? (
          <CDropdownItem
            as="button"
            type="button"
            onClick={handleAdminClick}
            className="d-flex align-items-center"
          >
            <CIcon icon={cilSettings} className="me-2" />
            Admin
          </CDropdownItem>
        ) : null}

        <CDropdownDivider />

        <CDropdownItem
          as="button"
          type="button"
          onClick={handleLogout}
          className="d-flex align-items-center"
        >
          <CIcon icon={cilAccountLogout} className="me-2" />
          Se déconnecter
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
