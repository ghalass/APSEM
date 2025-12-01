import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createAnomalie,
  deleteAnomalie,
  fetchAnomalies,
  fetchAnomalieById,
  updateAnomalie,
  fetchAnomalieStats,
} from '../api/anomalieApi'

export const fetchAnomaliesQuery = () => {
  return queryOptions({
    queryKey: ['anomaliesList'],
    queryFn: fetchAnomalies,
  })
}

export const fetchAnomalieByIdQuery = (id) => {
  return queryOptions({
    queryKey: ['anomalie', id],
    queryFn: () => fetchAnomalieById(id),
    enabled: !!id,
  })
}

export const fetchAnomalieStatsQuery = (filters = {}) => {
  return queryOptions({
    queryKey: ['anomalieStats', filters],
    queryFn: () => fetchAnomalieStats(filters),
  })
}

export const useCreateAnomalie = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createAnomalie,
    onSuccess: () => {
      queryClient.invalidateQueries(['anomaliesList'])
      queryClient.invalidateQueries(['anomalieStats'])
    },
  })
}

export const useUpdateAnomalie = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateAnomalie,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['anomaliesList'])
      queryClient.invalidateQueries(['anomalie', variables.id])
      queryClient.invalidateQueries(['anomalieStats'])
    },
  })
}

export const useDeleteAnomalie = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteAnomalie,
    onSuccess: () => {
      queryClient.invalidateQueries(['anomaliesList'])
      queryClient.invalidateQueries(['anomalieStats'])
    },
  })
}
