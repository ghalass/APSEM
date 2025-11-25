import { useAuth } from '../context/Auth'
import { apiRequest } from '../utils/apiRequest'
import { Outlet, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { API_PATHS } from '../utils/apiPaths'
import { CSpinner } from '@coreui/react'

const PersistLogin = () => {
  // GET THE CUURENT USER FROM CONTEXT
  const auth = useAuth()
  const token = auth.token

  const location = useLocation()

  const [isLoading, setisLoading] = useState(true)

  useEffect(() => {
    const refreshToken = async () => {
      try {
        const response = await apiRequest(API_PATHS.AUTH.CHECK_TOKEN, 'GET')
        // SAVE USER & TOKEN IN THE CONTEXT
        auth.login(response?.user)
        auth.setToken(token)
      } catch (error) {
      } finally {
        setisLoading(false)
      }
    }
    !token && location?.pathname !== '/login' ? refreshToken() : setisLoading(false)
  }, [])

  return isLoading ? (
    <div className="pt-3 text-center">
      <CSpinner color="primary" variant="grow" />
    </div>
  ) : (
    <Outlet />
  )
}

export default PersistLogin
