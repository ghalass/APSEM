// api/siteApi.js
import { API_PATHS } from '../helpers/apiPaths'
import { apiRequest } from '../helpers/apiRequest'

export const fetchRoles = async () => {
  return apiRequest(API_PATHS.ROLES.GET_ALL_ROLES, 'GET')
}

export const createRole = async (site) => {
  return apiRequest(API_PATHS.ROLES.ADD_ROLE, 'POST', site)
}

export const updateRole = async (updatedRole) => {
  return apiRequest(API_PATHS.ROLES.UPDATE_ROLE(updatedRole.id), 'PATCH', updatedRole)
}

export const deleteRole = async (siteToDelete) => {
  return apiRequest(API_PATHS.ROLES.DELETE_ROLE(siteToDelete.id), 'DELETE')
}
