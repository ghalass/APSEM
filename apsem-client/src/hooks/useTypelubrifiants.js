// hooks/useTypeparcs.js
import { useQuery, useMutation, useQueryClient, queryOptions } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { createTypelubrifiant, deleteTypelubrifiant, fetchTypelubrifiants, updateTypelubrifiant } from '../api/typelubrifiantsApi';

export const useTypelubrifiants = () => {
    return queryOptions({
        queryKey: ['typelubrifiants'], // Clé de requête
        queryFn: fetchTypelubrifiants, // Fonction pour récupérer les typeparcs
    });
};

export const useCreateTypelubrifiant = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createTypelubrifiant,
        onSuccess: () => {
            queryClient.invalidateQueries(['typelubrifiants']); // Rafraîchir la liste des typeparcs
            // toast.success('Typeparc ajouté avec succès !'); // Notification de succès
        },
        onError: () => {
            toast.error('Erreur lors de l\'ajout du typelubrifiants.'); // Notification d'erreur
        },
    });
};

export const useUpdateTypelubrifiant = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateTypelubrifiant,
        onSuccess: () => {
            queryClient.invalidateQueries(['typelubrifiants']);
            // toast.success('Typeparc modifié avec succès !'); // Notification de succès
        },
        onError: () => {
            toast.error('Erreur lors de la modification du typelubrifiants.'); // Notification d'erreur
        },
    });
}

export const useDeleteTypelubrifiant = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteTypelubrifiant,
        onSuccess: () => {
            queryClient.invalidateQueries(['typelubrifiants']);
            // toast.success('Typeparc supprimé avec succès !'); // Notification de succès
        },
        onError: () => {
            toast.error('Erreur lors de la suppression du typelubrifiants.'); // Notification d'erreur
        },
    });
};