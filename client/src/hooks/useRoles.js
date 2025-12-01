// hooks/useRoles.js
import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchRoles,
  createRole,
  updateRole,
  deleteRole,
  assignPermissionToRole,
  deleteRelationPermissionToRole,
} from '../api/roleApi'

export const fecthRolesQuery = () => {
  return queryOptions({
    queryKey: ['rolesList'], // Clé de requête
    queryFn: fetchRoles,
  })
}

export const useCreateRole = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createRole,
    onSuccess: () => {
      queryClient.invalidateQueries(['rolesList']) // Rafraîchir la liste des roles
    },
  })
}

export const useUpdateRole = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateRole,
    onSuccess: () => {
      queryClient.invalidateQueries(['rolesList'])
    },
  })
}

export const useDeleteRole = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteRole,
    onSuccess: () => {
      queryClient.invalidateQueries(['rolesList'])
    },
  })
}

export const useAssignPermissionToRole = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: assignPermissionToRole,
    onSuccess: () => {
      queryClient.invalidateQueries(['rolesList'])
    },
  })
}

export const useDeleteRelationPermissionToRole = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteRelationPermissionToRole,
    onSuccess: () => {
      queryClient.invalidateQueries(['rolesList'])
    },
  })
}
