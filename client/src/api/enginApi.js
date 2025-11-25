// api/enginApi.js
import { API_PATHS } from '../utils/apiPaths';
import { apiRequest } from '../utils/apiRequest';

export const fetchEngins = async () => {
    return apiRequest(API_PATHS.ENGINS.GET_ALL_ENGINS, "GET");
};

export const createEngin = async (engin) => {
    return apiRequest(API_PATHS.ENGINS.ADD_ENGIN, "POST", engin);
};

export const updateEngin = async (updatedEngin) => {
    return apiRequest(API_PATHS.ENGINS.UPDATE_ENGIN(updatedEngin.id), "PATCH", updatedEngin);
};

export const deleteEngin = async (enginToDelete) => {
    return apiRequest(API_PATHS.ENGINS.DELETE_ENGIN(enginToDelete.id), "DELETE");
};

export const fetchEnginsByParcBySite = async (parcId, siteId) => {
    return await apiRequest(API_PATHS.ENGINS.GET_ALL_ENGINS_BY_PARCID_SITEID(parcId, siteId), "GET");
};