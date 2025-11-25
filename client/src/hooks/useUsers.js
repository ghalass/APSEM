// hooks/useUsers.js
import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchUsers, createUser, updateUser, deleteUser, loginUser } from '../api/userApi'

export function fecthUsersQuery() {
  return queryOptions({
    queryKey: ['usersList'],
    queryFn: fetchUsers,
  })
}

export function createUserQuery() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['usersList'] })
    },
  })
}

export function updateUserQuery() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['usersList'] })
    },
  })
}

export function deleteUserQuery() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['usersList'] })
    },
  })
}

export function loginQuery() {
  return useMutation({
    mutationFn: loginUser,
  })
}
