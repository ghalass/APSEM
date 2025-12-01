import { API_PATHS } from '../helpers/apiPaths'
import { apiRequest } from '../helpers/apiRequest'

export const fetchAnomalies = async () => {
  return apiRequest(API_PATHS.ANOMALIES.GET_ALL_ANOMALIES, 'GET')
}

export const fetchAnomalieById = async (id) => {
  return apiRequest(API_PATHS.ANOMALIES.GET_ANOMALIE_BY_ID(id), 'GET')
}

export const createAnomalie = async (anomalie) => {
  return apiRequest(API_PATHS.ANOMALIES.CREATE_ANOMALIE, 'POST', anomalie)
}

export const updateAnomalie = async (anomalie) => {
  return apiRequest(API_PATHS.ANOMALIES.UPDATE_ANOMALIE(anomalie.id), 'PUT', anomalie)
}

export const deleteAnomalie = async (anomalie) => {
  return apiRequest(API_PATHS.ANOMALIES.DELETE_ANOMALIE(anomalie.id), 'DELETE')
}

export const fetchAnomalieStats = async (filters = {}) => {
  const queryParams = new URLSearchParams(filters).toString()
  const url = queryParams
    ? `${API_PATHS.ANOMALIES.GET_ANOMALIE_STATS}?${queryParams}`
    : API_PATHS.ANOMALIES.GET_ANOMALIE_STATS
  return apiRequest(url, 'GET')
}
