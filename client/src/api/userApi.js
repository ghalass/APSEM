// api/siteApi.js
import { API_PATHS } from '../helpers/apiPaths'
import { apiRequest } from '../helpers/apiRequest'

export const fetchUsers = async () => {
  return await apiRequest(API_PATHS.AUTH.GET_ALL_USERS, 'GET')
}

export const createUser = async (site) => {
  return await apiRequest(API_PATHS.AUTH.REGISTER, 'POST', site)
}

export const updateUser = async (updatedSite) => {
  return await apiRequest(API_PATHS.AUTH.UPDATE_USER, 'PATCH', updatedSite)
}

export const deleteUser = async (user) => {
  return await apiRequest(API_PATHS.AUTH.DELETE_USER(user?.id), 'DELETE')
}

export const loginUser = async (data) => {
  return await apiRequest(API_PATHS.AUTH.LOGIN, 'POST', data)
}
