// hooks/usePermissions.js
import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchPermissions,
  createPermission,
  // updatePermission,
  deletePermission,
} from '../api/permissionApi'

export const fecthPermissionsQuery = () => {
  return queryOptions({
    queryKey: ['permissionsList'], // Clé de requête
    queryFn: fetchPermissions,
  })
}

export const useCreatePermission = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createPermission,
    onSuccess: () => {
      queryClient.invalidateQueries(['permissionsList']) // Rafraîchir la liste des permissions
    },
  })
}

// export const useUpdatePermission = () => {
//   const queryClient = useQueryClient()
//   return useMutation({
//     mutationFn: updatePermission,
//     onSuccess: () => {
//       queryClient.invalidateQueries(['permissionsList'])
//     },
//   })
// }

export const useDeletePermission = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deletePermission,
    onSuccess: () => {
      queryClient.invalidateQueries(['permissionsList'])
    },
  })
}
