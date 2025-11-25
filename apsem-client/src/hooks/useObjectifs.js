// hooks/useObjectifs.js
import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query';
import { createObjectif, deleteObjectif, fetchObjectifs, updateObjectif } from '../api/objectifApi';

export const fecthObjectifsQuery = () => {
    return queryOptions({
        queryKey: ["objectifsList"], // Clé de requête
        queryFn: fetchObjectifs
    });
};

export const useCreateObjectif = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createObjectif,
        onSuccess: () => {
            queryClient.invalidateQueries(['objectifsList']); // Rafraîchir la liste des objectifs
        }
    });
};

export const useUpdateObjectif = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateObjectif,
        onSuccess: () => {
            queryClient.invalidateQueries(['objectifsList']);
        }
    });
}

export const useDeleteObjectif = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteObjectif,
        onSuccess: () => {
            queryClient.invalidateQueries(['objectifsList']);
        }
    });
};