// hooks/useSites.js
import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchSites, createSite, updateSite, deleteSite } from '../api/siteApi';

export const fecthSitesQuery = () => {
    return queryOptions({
        queryKey: ["sitesList"], // Clé de requête
        queryFn: fetchSites
    });
};

export const useCreateSite = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createSite,
        onSuccess: () => {
            queryClient.invalidateQueries(['sitesList']); // Rafraîchir la liste des sites
        }
    });
};

export const useUpdateSite = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateSite,
        onSuccess: () => {
            queryClient.invalidateQueries(['sitesList']);
        }
    });
}

export const useDeleteSite = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteSite,
        onSuccess: () => {
            queryClient.invalidateQueries(['sitesList']);
        }
    });
};