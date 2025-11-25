// hooks/useTypeparcs.js
import { useMutation, useQueryClient, queryOptions } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { createParc, deleteParc, fetchParcs, fetchParcsByTypeparc, updateParc } from '../api/parcApi';
import { createPanne, deletePanne, fetchPannes, fetchPannesByTypepanne, updatePanne } from '../api/panneApi';

export const usePannes = () => {
    return queryOptions({
        queryKey: ['pannes'], // Clé de requête
        queryFn: fetchPannes, // Fonction pour récupérer les typeparcs
    });
};

export const usePannesByTypePanne = (typepanneId) => {
    return queryOptions({
        queryKey: ['pannesByTypepanne', typepanneId], // Clé de requête
        queryFn: () => fetchPannesByTypepanne(typepanneId), // Fonction pour récupérer les typeparcs
        enabled: !!(typepanneId !== "") && typepanneId !== undefined
    });
};


export const useCreatePanne = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createPanne,
        onSuccess: () => {
            queryClient.invalidateQueries(['pannes']); // Rafraîchir la liste des typeparcs
            // toast.success('Typeparc ajouté avec succès !'); // Notification de succès
        },
        onError: () => {
            toast.error('Erreur lors de l\'ajout du Panne.'); // Notification d'erreur
        },
    });
};

export const useUpdatePanne = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updatePanne,
        onSuccess: () => {
            queryClient.invalidateQueries(['pannes']);
            // toast.success('Typeparc modifié avec succès !'); // Notification de succès
        },
        onError: () => {
            toast.error('Erreur lors de la modification du Panne.'); // Notification d'erreur
        },
    });
}

export const useDeletePanne = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deletePanne,
        onSuccess: () => {
            queryClient.invalidateQueries(['pannes']);
            // toast.success('Typeparc supprimé avec succès !'); // Notification de succès
        },
        onError: () => {
            toast.error('Erreur lors de la suppression du Panne.'); // Notification d'erreur
        },
    });
};