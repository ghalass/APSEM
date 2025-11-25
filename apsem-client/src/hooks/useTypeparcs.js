// hooks/useTypeparcs.js
import { useQuery, useMutation, useQueryClient, queryOptions } from '@tanstack/react-query';
import { fetchTypeparcs, createTypeparc, updateTypeparc, deleteTypeparc } from '../api/typeparcApi';
import { toast } from 'react-toastify';

export const useTypeparcs = () => {
    return queryOptions({
        queryKey: ['typeparcs'], // Clé de requête
        queryFn: fetchTypeparcs, // Fonction pour récupérer les typeparcs
        staleTime: 1000 * 60 * 5, // Temps de cache (5 minutes)
    });
};

export const useCreateTypeparc = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createTypeparc,
        onSuccess: () => {
            queryClient.invalidateQueries(['typeparcs']); // Rafraîchir la liste des typeparcs
            // toast.success('Typeparc ajouté avec succès !'); // Notification de succès
        },
        onError: () => {
            toast.error('Erreur lors de l\'ajout du Typeparc.'); // Notification d'erreur
        },
    });
};

export const useUpdateTypeparc = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateTypeparc,
        onSuccess: () => {
            queryClient.invalidateQueries(['typeparcs']);
            // toast.success('Typeparc modifié avec succès !'); // Notification de succès
        },
        onError: () => {
            toast.error('Erreur lors de la modification du Typeparc.'); // Notification d'erreur
        },
    });
}

export const useDeleteTypeparc = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteTypeparc,
        onSuccess: () => {
            queryClient.invalidateQueries(['typeparcs']);
            // toast.success('Typeparc supprimé avec succès !'); // Notification de succès
        },
        onError: () => {
            toast.error('Erreur lors de la suppression du Typeparc.'); // Notification d'erreur
        },
    });
};