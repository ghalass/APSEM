// api/importApi.js
import { API_PATHS } from '../helpers/apiPaths'
import { apiRequest } from '../helpers/apiRequest'

export const importData = async (data) => {
  return apiRequest(API_PATHS.IMPORTER.IMPORT_DATA, 'POST', data)
}
