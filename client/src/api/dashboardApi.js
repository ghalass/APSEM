// api/siteApi.js
import { API_PATHS } from '../helpers/apiPaths'
import { apiRequest } from '../helpers/apiRequest'

export const fetchDashboard = async () => {
  return apiRequest(API_PATHS.DASHBOARD.GET_DATA, 'GET')
}
