// hooks/useTypeparcs.js
import { useMutation, useQueryClient, queryOptions } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { createParc, deleteParc, fetchParcs, fetchParcsByTypeparc, updateParc } from '../api/parcApi';

export const useParcs = () => {
    return queryOptions({
        queryKey: ['parcs'], // Clé de requête
        queryFn: fetchParcs, // Fonction pour récupérer les typeparcs
    });
};

export const useParcsByTypeParc = (typeparcId) => {
    return queryOptions({
        queryKey: ['parcsByTypeparc', typeparcId], // Clé de requête
        queryFn: () => fetchParcsByTypeparc(typeparcId), // Fonction pour récupérer les typeparcs
        enabled: !!(typeparcId !== "")
    });
};


export const useCreateParc = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createParc,
        onSuccess: () => {
            queryClient.invalidateQueries(['parcs']); // Rafraîchir la liste des typeparcs
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
        mutationFn: updateParc,
        onSuccess: () => {
            queryClient.invalidateQueries(['parcs']);
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
        mutationFn: deleteParc,
        onSuccess: () => {
            queryClient.invalidateQueries(['parcs']);
            // toast.success('Typeparc supprimé avec succès !'); // Notification de succès
        },
        onError: () => {
            toast.error('Erreur lors de la suppression du Typeparc.'); // Notification d'erreur
        },
    });
};