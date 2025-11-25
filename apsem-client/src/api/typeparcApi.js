// api/siteApi.js
import { API_PATHS } from '../utils/apiPaths';
import { apiRequest } from '../utils/apiRequest';

export const fetchTypeparcs = async () => {
    return apiRequest(API_PATHS.TYPEPARCS.GET_ALL_TYPEPARCS, "GET");
};

export const createTypeparc = async (typeparc) => {
    return apiRequest(API_PATHS.TYPEPARCS.ADD_TYPEPARC, "POST", typeparc);
};

export const updateTypeparc = async (updatedTypeparc) => {
    return apiRequest(API_PATHS.TYPEPARCS.UPDATE_TYPEPARC(updatedTypeparc.id), "PATCH", updatedTypeparc);
};

export const deleteTypeparc = async (typeparc) => {
    return apiRequest(API_PATHS.TYPEPARCS.DELETE_TYPEPARC(typeparc.id), "DELETE", typeparc);
};