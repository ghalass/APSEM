// api/objectifApi.js
import { API_PATHS } from '../utils/apiPaths';
import { apiRequest } from '../utils/apiRequest';

export const fetchObjectifs = async () => {
    return apiRequest(API_PATHS.OBJECTIFS.GET_ALL_OBJECTIFS, "GET");
};

export const createObjectif = async (objectif) => {
    return apiRequest(API_PATHS.OBJECTIFS.ADD_OBJECTIF, "POST", objectif);
};

export const updateObjectif = async (updatedObjectif) => {
    return apiRequest(API_PATHS.OBJECTIFS.UPDATE_OBJECTIF(updatedObjectif.id), "PATCH", updatedObjectif);
};

export const deleteObjectif = async (objectifToDelete) => {
    return apiRequest(API_PATHS.OBJECTIFS.DELETE_OBJECTIF(objectifToDelete.id), "DELETE");
};