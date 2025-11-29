import { useState } from 'react'
import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CSpinner,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { useLocation, useNavigate } from 'react-router-dom'
import { loginQuery } from '../../hooks/useUsers'
import { useAuth } from '../../context/Auth'
import ThemeToggle from '../../components/ThemeToggle'
import { toast } from 'react-toastify'

const Login = () => {
  const loginMutation = loginQuery()

  const [user, setUser] = useState({
    email: 'ghalass@gmail.com',
    password: '123456',
    // email: "ghalass@gmail.com",
    // password: "gh@l@ss@dmin",
  })

  const auth = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectPath = location.state?.path || '/'

  const onSubmit = (e) => {
    e.preventDefault()
    const loginData = { email: user.email, password: user.password }

    loginMutation.mutate(loginData, {
      onSuccess: (response) => {
        const token = response.token

        auth.login(response?.user)
        auth.setToken(token)
        navigate(redirectPath, { replace: true })

        toast.success('Connecté avec succès.')
      },
    })
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <ThemeToggle />
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={onSubmit}>
                    <h1>Se connecter</h1>
                    <p className="text-body-secondary">Sign In to your account</p>

                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        type="email"
                        placeholder="Email"
                        value={user?.email}
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                      />
                    </CInputGroup>

                    <CInputGroup className="mb-4 ">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        value={user.password}
                        onChange={(e) => setUser({ ...user, password: e.target.value })}
                      />
                    </CInputGroup>

                    <CRow>
                      <CCol>
                        <CButton
                          disabled={loginMutation.isPending}
                          color="primary"
                          className="px-4"
                          type="submit"
                        >
                          <div className="d-flex gap-1 align-items-center justify-content-end">
                            {loginMutation.isPending && <CSpinner size="sm" />}{' '}
                            <span>Se connecter</span>
                          </div>
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                  {loginMutation.isError && (
                    <CAlert color="danger" className="mb-0 mt-2">
                      {loginMutation.error.message}
                    </CAlert>
                  )}
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
