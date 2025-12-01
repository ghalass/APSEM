import { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CContainer,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  CNavItem,
  CNavLink,
  useColorModes,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilBadge, cilChatBubble, cilMenu } from '@coreui/icons'

import { AppHeaderDropdown } from './header/index'
import { NavLink } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'

const AppHeader = () => {
  const headerRef = useRef()
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')

  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)

  useEffect(() => {
    document.addEventListener('scroll', () => {
      headerRef.current &&
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
    })
  }, [])

  return (
    <CHeader position="sticky" className="mb-2 p-0" ref={headerRef}>
      <CContainer className="border-bottom px-4" fluid>
        <CHeaderToggler
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
          style={{ marginInlineStart: '-14px' }}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>

        <CHeaderNav className="d-none d-md-flex me-auto">
          <CNavItem>
            <CNavLink to="/about" as={NavLink} className="text-primary">
              <CIcon icon={cilBadge} size="lg" /> A propos
            </CNavLink>
          </CNavItem>
        </CHeaderNav>

        <CHeaderNav>
          {/* <CNavItem>
            <CNavLink to="/chat" as={NavLink} className="text-success">
              <CIcon icon={cilChatBubble} size="lg" /> Chat
            </CNavLink>
          </CNavItem> */}

          <ThemeToggle />

          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
    </CHeader>
  )
}

export default AppHeader
