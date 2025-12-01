import { cilContrast, cilMoon, cilSun } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeaderNav,
  useColorModes,
} from '@coreui/react'
import React, { useRef } from 'react'

export default function ThemeToggle() {
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const dropdownRef = useRef()

  const handleThemeChange = (theme) => {
    setColorMode(theme)
    // Fermer le dropdown en déclenchant un clic en dehors
    document.body.click()
  }

  return (
    <CHeaderNav className="d-flex justify-content-end">
      <CDropdown variant="nav-item" placement="bottom-end" ref={dropdownRef}>
        <CDropdownToggle caret={false}>
          {colorMode === 'dark' ? (
            <CIcon icon={cilMoon} size="lg" />
          ) : colorMode === 'auto' ? (
            <CIcon icon={cilContrast} size="lg" />
          ) : (
            <CIcon icon={cilSun} size="lg" />
          )}
        </CDropdownToggle>
        <CDropdownMenu>
          <CDropdownItem
            active={colorMode === 'light'}
            className="d-flex align-items-center"
            as="button"
            type="button"
            onClick={() => handleThemeChange('light')}
          >
            <CIcon className="me-2" icon={cilSun} size="lg" /> Light
          </CDropdownItem>
          <CDropdownItem
            active={colorMode === 'dark'}
            className="d-flex align-items-center"
            as="button"
            type="button"
            onClick={() => handleThemeChange('dark')}
          >
            <CIcon className="me-2" icon={cilMoon} size="lg" /> Dark
          </CDropdownItem>
          <CDropdownItem
            active={colorMode === 'auto'}
            className="d-flex align-items-center"
            as="button"
            type="button"
            onClick={() => handleThemeChange('auto')}
          >
            <CIcon className="me-2" icon={cilContrast} size="lg" /> Auto
          </CDropdownItem>
        </CDropdownMenu>
      </CDropdown>
    </CHeaderNav>
  )
}
