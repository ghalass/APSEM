import { cibPlayerMe, cil3d, cilBadge, cilCloudUpload, cilUser } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CNav, CNavItem, CNavLink } from '@coreui/react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/Auth'
import UnauthorizedPage from '../components/UnauthorizedPage'

export default function AdminLayout({ children }) {
  const pages = [
    { to: '/admin', label: 'Admin', icon: cil3d, end: true },
    { to: '/admin/roles', label: 'Rôles', icon: cilBadge },
    { to: '/admin/permissions', label: 'Permissions', icon: cibPlayerMe },
    { to: '/admin/users', label: 'Utilisateurs', icon: cilUser },
    { to: '/admin/import', label: 'Importation', icon: cilCloudUpload },
  ]

  const { isAdminOrSuperAdmin } = useAuth()

  return (
    <div>
      {isAdminOrSuperAdmin ? (
        <>
          <CNav variant="tabs" className="justify-content-center mb-2">
            {pages.map((p) => (
              <CNavItem key={p.to}>
                <CNavLink
                  to={p.to}
                  as={NavLink}
                  end={p.end}
                  className={({ isActive }) => (isActive ? 'text-primary active' : 'text-primary')}
                >
                  <CIcon icon={p.icon} size="lg" /> {p.label}
                </CNavLink>
              </CNavItem>
            ))}
          </CNav>
          <div>{children}</div>
        </>
      ) : (
        <UnauthorizedPage />
      )}
    </div>
  )
}
