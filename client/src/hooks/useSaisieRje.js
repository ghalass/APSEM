// hooks/useSaisieRje.js
import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query';
import { addPanne, createSaisieHrm, deleteSaisiePanne, fecthSaisieRjeQuery, getSaisieHrmDay, injectHRM, updateSaisiePanne, upsetHrm } from '../api/saisieRjeApi';
import { toast } from 'react-toastify';

export default function fecthSaisieRjeQueryOptions(du, enginId) {
    return queryOptions({
        queryKey: ["saisieRjeList", du, enginId],
        queryFn: () => fecthSaisieRjeQuery(du, enginId), // ✅ Fix 1: Pass function reference
        enabled: !!(du !== "" && enginId !== "") // ✅ Fix 2: Ensure boolean
    })
}

export const useCreateSaisieHrm = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createSaisieHrm,
        onSuccess: () => {
            queryClient.invalidateQueries(['saisieRjeList']);
        }
    });
};

export const useDeleteSaisiePanne = () => {
    const queryClient = useQueryClient();
    return queryOptions({
        mutationFn: deleteSaisiePanne,
        onSuccess: () => {
            toast.success("Supprimé avec succès.");
            queryClient.invalidateQueries(['saisieRjeList']);
        },
    })
}

export const useUpdateSaisiePanne = (handleCloseEditPanneModal) => {
    const queryClient = useQueryClient();
    return queryOptions({
        mutationFn: updateSaisiePanne,
        onSuccess: () => {
            handleCloseEditPanneModal();
            toast.success("Modifié avec succès.");
            queryClient.invalidateQueries(['saisieRjeList']);
        }
    });
}

export const upsetHRMQueryOptions = () => {
    const queryClient = useQueryClient();
    return queryOptions({
        mutationFn: upsetHrm,
        onSuccess: () => {
            // toast.success("Ajouté avec succès.");
            // t.success("HRM Ajouté avec succès.");
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ["saisieRjeList"] });
        },
    })
}

export const addPanneQueryOptions = () => {
    const queryClient = useQueryClient();
    return queryOptions({
        mutationFn: addPanne,
        onSuccess: () => {
            // setUser({ name: "", email: "", password: "" });
            // handleClosePanneModal();
            // toast.success("Ajouté avec succès.");
            // t.success("Panne Ajouté avec succès.");
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ["saisieRjeList"] });
        }
    })
}


export const useGetSaisieHrmDay = (du) => {
    return queryOptions({
        queryKey: ["donneesSaisieRjeList"],
        queryFn: () => getSaisieHrmDay(du),
        enabled: false, // 🔥 Désactive la requête automatique
    })
}


// 
export const useInjectHRM = () => {
    const queryClient = useQueryClient();
    return queryOptions({
        mutationFn: injectHRM,
        onSuccess: () => {
            // toast.success("Ajouté avec succès.");
            // t.success("HRM Ajouté avec succès.");
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ["saisieRjeList"] });
        },
    })
}

