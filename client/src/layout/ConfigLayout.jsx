import { cibPlayerMe, cil3d, cilBadge, cilCloudUpload, cilUser } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CNav, CNavItem, CNavLink } from '@coreui/react'
import { NavLink } from 'react-router-dom'

export default function ConfigLayout({ children }) {
  const pages = [
    { to: '/configs', label: 'Configs', icon: cil3d, end: true },
    { to: '/configs/engins', label: 'Engins', icon: cilBadge },
    { to: '/configs/parcs', label: 'Parcs', icon: cilBadge },
    { to: '/configs/typeparcs', label: 'Typeparcs', icon: cilBadge },
    { to: '/configs/pannes', label: 'Pannes', icon: cilBadge },
    { to: '/configs/typepannes', label: 'Typepannes', icon: cilBadge },
    { to: '/configs/sites', label: 'Sites', icon: cilBadge },
    { to: '/configs/objectifs', label: 'Objectifs', icon: cilBadge },
    { to: '/configs/lubrifiants', label: 'Lubrifiants', icon: cilBadge },
    { to: '/configs/typelubrifiants', label: 'TypeLubrifiants', icon: cilBadge },
    { to: '/configs/typeconsommationlubs', label: 'Typeconsommationlubs', icon: cilBadge },
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
