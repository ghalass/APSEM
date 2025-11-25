import { cilBadge } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CNav, CNavItem, CNavLink } from '@coreui/react'
import { NavLink } from 'react-router-dom'

export default function AdminLayout({ children }) {
  const pages = [
    { to: '/admin', label: 'Admin', icon: cilBadge, end: true },
    { to: '/admin/roles', label: 'Rôles' },
    { to: '/admin/permissions', label: 'Permissions', icon: cilBadge },
    { to: '/admin/resources', label: 'Resources', icon: cilBadge },
    { to: '/admin/users', label: 'Utilisateurs', icon: cilBadge },
  ]

  return (
    <div>
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
    </div>
  )
}
