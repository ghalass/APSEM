// api/typepanneApi.js
import { API_PATHS } from '../utils/apiPaths';
import { apiRequest } from '../utils/apiRequest';

export const fetchTypepannes = async () => {
    return apiRequest(API_PATHS.TYPEPANNES.GET_ALL_TYPEPANNES, "GET");
};

export const createTypepanne = async (typepanne) => {
    return apiRequest(API_PATHS.TYPEPANNES.ADD_TYPEPANNE, "POST", typepanne);
};

export const updateTypepanne = async (updatedTypepanne) => {
    return apiRequest(API_PATHS.TYPEPANNES.UPDATE_TYPEPANNE(updatedTypepanne.id), "PATCH", updatedTypepanne);
};

export const deleteTypepanne = async (typepanne) => {
    return apiRequest(API_PATHS.TYPEPANNES.DELETE_TYPEPANNE(typepanne.id), "DELETE", typepanne);
};

// /************** AFFECTATION DE PARC AU CODE *********************** */
export const createAffectParcToTypepanne = async (data) => {
    return apiRequest(API_PATHS.TYPEPANNES.ADD_PARC_TO_TYPEPANNE, "POST", data);
};
export const deleteAffectParcToTypepanne = async (data) => {
    return apiRequest(API_PATHS.TYPEPANNES.DELETE_PARC_TO_TYPEPANNE, "DELETE", data);
};
export const getAllTypepannesByParcId = async (parcId) => {
    return apiRequest(API_PATHS.TYPEPANNES.GET_ALL_TYPEPANNES_BY_PARCID(parcId), "GET");
};
