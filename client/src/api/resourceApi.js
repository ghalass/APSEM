// api/resourceApi.js
import { API_PATHS } from '../helpers/apiPaths'
import { apiRequest } from '../helpers/apiRequest'

//
export const fetchResources = async () => {
  return apiRequest(API_PATHS.RESOURCES.GET_ALL_RESOURCES, 'GET')
}

export const createResource = async (resource) => {
  return apiRequest(API_PATHS.RESOURCES.ADD_RESOURCE, 'POST', resource)
}

export const updateResource = async (updatedResource) => {
  return apiRequest(
    API_PATHS.RESOURCES.UPDATE_RESOURCE(updatedResource.id),
    'PATCH',
    updatedResource,
  )
}

export const deleteResource = async (resourceToDelete) => {
  return apiRequest(API_PATHS.RESOURCES.DELETE_RESOURCE(resourceToDelete.id), 'DELETE')
}
