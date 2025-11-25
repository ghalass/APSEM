// api/siteApi.js
import { API_PATHS } from '../utils/apiPaths';
import { apiRequest } from '../utils/apiRequest';

export const fetchParcs = async () => {
    return apiRequest(API_PATHS.PARCS.GET_ALL_PARCS, "GET");
};

export const fetchParcsByTypeparc = async (typeparcId) => {
    return apiRequest(API_PATHS.PARCS.GET_ALL_PARCS_BY_TYPEPARC(typeparcId), "GET");
};


export const createParc = async (parc) => {
    return apiRequest(API_PATHS.PARCS.ADD_PARC, "POST", parc);
};

export const updateParc = async (updatedParc) => {
    return apiRequest(API_PATHS.PARCS.UPDATE_PARC(updatedParc.id), "PATCH", updatedParc);
};

export const deleteParc = async (parc) => {
    return apiRequest(API_PATHS.PARCS.DELETE_PARC(parc.id), "DELETE", parc);
};