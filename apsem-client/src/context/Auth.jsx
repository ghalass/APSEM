import React, { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)

  const login = (user) => setUser(user)
  const logout = () => setUser(null)

  const isAdminOrSuperAdmin = user?.roles?.some(
    (r) => r.name?.toLowerCase() === 'admin' || r.name?.toLowerCase() === 'super admin',
  )

  const value = { user, token, setToken, login, logout, isAdminOrSuperAdmin }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

const useAuth = () => useContext(AuthContext)

export { AuthContext, AuthProvider, useAuth }
