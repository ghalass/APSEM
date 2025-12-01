// hooks/useTypeparcs.js
import { useQuery, useMutation, useQueryClient, queryOptions } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { createAffectParcToCode, createTypeconsommationlub, deleteAffectParcToCode, deleteTypeconsommationlub, fetchTypeconsommationlubs, updateTypeconsommationlub } from '../api/typeconsommationlubsApi';

export const useTypeconsommationlubs = () => {
    return queryOptions({
        queryKey: ['typeconsommationlubs'], // Clé de requête
        queryFn: fetchTypeconsommationlubs, // Fonction pour récupérer les typeparcs
    });
};

export const useCreateTypeconsommationlub = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createTypeconsommationlub,
        onSuccess: () => {
            queryClient.invalidateQueries(['typeconsommationlubs']); // Rafraîchir la liste des typeparcs
            // toast.success('Typeparc ajouté avec succès !'); // Notification de succès
        },
        onError: () => {
            toast.error('Erreur lors de l\'ajout du typeconsommationlubs.'); // Notification d'erreur
        },
    });
};

export const useUpdateTypeconsommationlub = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateTypeconsommationlub,
        onSuccess: () => {
            queryClient.invalidateQueries(['typeconsommationlubs']);
            // toast.success('Typeparc modifié avec succès !'); // Notification de succès
        },
        onError: () => {
            toast.error('Erreur lors de la modification du typeconsommationlubs.'); // Notification d'erreur
        },
    });
}

export const useDeleteTypeconsommationlub = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteTypeconsommationlub,
        onSuccess: () => {
            queryClient.invalidateQueries(['typeconsommationlubs']);
            // toast.success('Typeparc supprimé avec succès !'); // Notification de succès
        },
        onError: () => {
            // toast.error('Erreur lors de la suppression du typeconsommationlubs.'); // Notification d'erreur
        },
    });
};

// /************** AFFECTATION DE PARC AU CODE *********************** */
export const useCreateAffectParcToCode = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createAffectParcToCode,
        onSuccess: () => {
            queryClient.invalidateQueries(['typeconsommationlubs']); // Rafraîchir la liste des typeparcs
            // toast.success('Typeparc ajouté avec succès !'); // Notification de succès
        },
        onError: () => {
            // toast.error('Erreur lors de l\'ajout du affectparctocode.'); // Notification d'erreur
        },
    });
};
export const useDeleteAffectParcToCode = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteAffectParcToCode,
        onSuccess: () => {
            queryClient.invalidateQueries(['typeconsommationlubs']);
            // toast.success('Typeparc supprimé avec succès !'); // Notification de succès
        },
        onError: () => {
            // toast.error('Erreur lors de la suppression du typeconsommationlubs.'); // Notification d'erreur
        },
    });
};