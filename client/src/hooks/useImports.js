// hooks/useImports.js
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { importData } from '../api/importApi'

export const useImport = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: importData,
    onSuccess: () => {
      queryClient.invalidateQueries(['importList']) // Rafraîchir la liste des sites
    },
  })
}
