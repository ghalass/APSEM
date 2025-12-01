// hooks/useSites.js
import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query';
import { createAffectParcToLubrifiant, createLubrifiant, deleteAffectParcToLubrifiant, deleteLubrifiant, fetchLubrifiants, getAllLubrifiantsByParcId, getAllTypeconsommationlubsByParcId, updateLubrifiant } from '../api/lubrifiantApi';

export const fecthLubrifiantsQuery = () => {
    return queryOptions({
        queryKey: ["lubrifiantList"], // Clé de requête
        queryFn: fetchLubrifiants
    });
};

export const useCreateLubrifiant = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createLubrifiant,
        onSuccess: () => {
            queryClient.invalidateQueries(['lubrifiantList']); // Rafraîchir la liste des lubrifiant
        }
    });
};

export const useUpdateLubrifiant = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateLubrifiant,
        onSuccess: () => {
            queryClient.invalidateQueries(['lubrifiantList']);
        }
    });
}

export const useDeleteLubrifiant = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteLubrifiant,
        onSuccess: () => {
            queryClient.invalidateQueries(['lubrifiantList']);
        }
    });
};


export const fetchGetAllTypeconsommationlubsByParcId = (parcId) => {
    return queryOptions({
        queryKey: ["typeconsommationlubs", parcId], // Clé de requête
        queryFn: () => getAllTypeconsommationlubsByParcId(parcId),
        enabled: !!(parcId !== "") && !!(parcId !== undefined)
    });
};

export const fetchGetAllLubrifiantsByParcId = (parcId) => {
    return queryOptions({
        queryKey: ["lubbyparc", parcId], // Clé de requête
        queryFn: () => getAllLubrifiantsByParcId(parcId),
        enabled: !!(parcId !== "") && !!(parcId !== undefined)
    });
};


// /************** AFFECTATION DE PARC AU LUBRIFIANT *********************** */
export const useCreateAffectParcToLubrifiant = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createAffectParcToLubrifiant,
        onSuccess: () => {
            queryClient.invalidateQueries(['parclubrifiant']); // Rafraîchir la liste des typeparcs
            // toast.success('Typeparc ajouté avec succès !'); // Notification de succès
        },
        onError: () => {
            // toast.error('Erreur lors de l\'ajout du affectparctocode.'); // Notification d'erreur
        },
    });
};

export const useDeleteAffectParcToLubrifiant = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteAffectParcToLubrifiant,
        onSuccess: () => {
            queryClient.invalidateQueries(['parclubrifiant']);
            // toast.success('Typeparc supprimé avec succès !'); // Notification de succès
        },
        onError: () => {
            // toast.error('Erreur lors de la suppression du typeconsommationlubs.'); // Notification d'erreur
        },
    });
};