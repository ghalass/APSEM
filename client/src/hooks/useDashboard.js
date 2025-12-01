// hooks/useDashbaord.js
import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchDashboard } from '../api/dashboardApi'

export const fecthDashbaordQuery = () => {
  return queryOptions({
    queryKey: ['dashbaordList'], // Clé de requête
    queryFn: fetchDashboard,
  })
}
