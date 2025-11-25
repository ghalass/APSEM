// api/siteApi.js
import { API_PATHS } from '../utils/apiPaths';
import { apiRequest } from '../utils/apiRequest';

export const fetchPannes = async () => {
    return apiRequest(API_PATHS.PANNES.GET_ALL_PANNES, "GET");
};

export const fetchPannesByTypepanne = async (typepanneId) => {
    return apiRequest(API_PATHS.PANNES.GET_ALL_PANNES_BY_TYPEPANNE_ID(typepanneId), "GET");
};


export const createPanne = async (panne) => {
    return apiRequest(API_PATHS.PANNES.ADD_PANNE, "POST", panne);
};

export const updatePanne = async (updatedPanne) => {
    return apiRequest(API_PATHS.PANNES.UPDATE_PANNE(updatedPanne.id), "PATCH", updatedPanne);
};

export const deletePanne = async (panne) => {
    return apiRequest(API_PATHS.PANNES.DELETE_PANNE(panne.id), "DELETE", panne);
};