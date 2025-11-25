// hooks/useResources.js
import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchResources, createResource, updateResource, deleteResource } from '../api/resourceApi'

export const fecthResourcesQuery = () => {
  return queryOptions({
    queryKey: ['resourcesList'], // Clé de requête
    queryFn: fetchResources,
  })
}

export const useCreateResource = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createResource,
    onSuccess: () => {
      queryClient.invalidateQueries(['resourcesList']) // Rafraîchir la liste des resources
    },
  })
}

export const useUpdateResource = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateResource,
    onSuccess: () => {
      queryClient.invalidateQueries(['resourcesList'])
    },
  })
}

export const useDeleteResource = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteResource,
    onSuccess: () => {
      queryClient.invalidateQueries(['resourcesList'])
    },
  })
}
