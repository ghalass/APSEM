// hooks/useEngins.js
import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query';
import { createEngin, deleteEngin, fetchEngins, fetchEnginsByParcBySite, updateEngin } from '../api/enginApi';

export const fecthEnginsQuery = () => {
    return queryOptions({
        queryKey: ["enginsList"], // Clé de requête
        queryFn: fetchEngins
    });
};

export default function fecthEnginsQueryByParcBySite(parcId, siteId) {
    return queryOptions({
        queryKey: ["enginsList", parcId, siteId],
        queryFn: () => fetchEnginsByParcBySite(parcId, siteId), // ✅ Fix 1: Pass function reference
        enabled: !!(parcId !== "" && siteId !== "") // ✅ Fix 2: Ensure boolean
    })
}

export const useCreateEngin = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createEngin,
        onSuccess: () => {
            queryClient.invalidateQueries(['enginsList']); // Rafraîchir la liste des engins
        }
    });
};

export const useUpdateEngin = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateEngin,
        onSuccess: () => {
            queryClient.invalidateQueries(['enginsList']);
        }
    });
}

export const useDeleteEngin = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteEngin,
        onSuccess: () => {
            queryClient.invalidateQueries(['enginsList']);
        }
    });
};