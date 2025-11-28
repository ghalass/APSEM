// api/resourceApi.js
import { API_PATHS } from '../helpers/apiPaths'
import { apiRequest } from '../helpers/apiRequest'

export const fetchPermissions = async () => {
  return apiRequest(API_PATHS.PERMISSIONS.GET_ALL_PERMISSIONS, 'GET')
}

export const createPermission = async (resource) => {
  return apiRequest(API_PATHS.PERMISSIONS.ADD_PERMISSION, 'POST', resource)
}

// export const updatePermission = async (updatedPermission) => {
//   return apiRequest(
//     API_PATHS.PERMISSIONS.UPDATE_PERMISSION(updatedPermission.id),
//     'PATCH',
//     updatedPermission,
//   )
// }

export const deletePermission = async (resourceToDelete) => {
  return apiRequest(API_PATHS.PERMISSIONS.DELETE_PERMISSION(resourceToDelete.id), 'DELETE')
}
