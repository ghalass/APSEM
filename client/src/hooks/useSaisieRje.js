// hooks/useSaisieRje.js - CORRECTION
import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  addPanne,
  createSaisieHrm,
  deleteSaisiePanne,
  fecthSaisieRjeQuery,
  getSaisieHrmDay,
  injectHRM,
  updateSaisiePanne,
  upsetHrm,
} from '../api/saisieRjeApi'
import { toast } from 'react-toastify'

export default function fecthSaisieRjeQueryOptions(du, enginId) {
  return queryOptions({
    queryKey: ['saisieRjeList', du, enginId],
    queryFn: () => fecthSaisieRjeQuery(du, enginId),
    enabled: !!(du !== '' && enginId !== ''),
  })
}

// ✅ CORRECTION : Retourner directement la configuration de mutation
export const useUpsetHRM = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: upsetHrm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saisieRjeList'] })
    },
    onError: (error) => {
      toast.error(error.message || 'Erreur lors de la sauvegarde HRM')
    },
  })
}

// ✅ CORRECTION : Retourner directement la configuration de mutation
export const useAddPanne = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: addPanne,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saisieRjeList'] })
    },
    onError: (error) => {
      toast.error(error.message || "Erreur lors de l'ajout de la panne")
    },
  })
}

export const useDeleteSaisiePanne = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteSaisiePanne,
    onSuccess: () => {
      queryClient.invalidateQueries(['saisieRjeList'])
    },
    onError: (error) => {
      toast.error(error.message || 'Erreur lors de la suppression')
    },
  })
}

export const useUpdateSaisiePanne = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateSaisiePanne,
    onSuccess: () => {
      queryClient.invalidateQueries(['saisieRjeList'])
    },
    onError: (error) => {
      toast.error(error.message || 'Erreur lors de la modification')
    },
  })
}

export const useGetSaisieHrmDay = (du) => {
  return queryOptions({
    queryKey: ['donneesSaisieRjeList'],
    queryFn: () => getSaisieHrmDay(du),
    enabled: false,
  })
}

export const useInjectHRM = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: injectHRM,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saisieRjeList'] })
    },
    onError: (error) => {
      toast.error(error.message || "Erreur lors de l'injection HRM")
    },
  })
}
