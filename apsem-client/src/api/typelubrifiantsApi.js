// api/typelubrifiantApi.js
import { API_PATHS } from '../utils/apiPaths';
import { apiRequest } from '../utils/apiRequest';

export const fetchTypelubrifiants = async () => {
    return apiRequest(API_PATHS.TYPELUBRIFIANTS.GET_ALL_TYPELUBRIFIANTS, "GET");
};

export const createTypelubrifiant = async (typelubrifiant) => {
    return apiRequest(API_PATHS.TYPELUBRIFIANTS.ADD_TYPELUBRIFIANT, "POST", typelubrifiant);
};

export const updateTypelubrifiant = async (updatedTypelubrifiant) => {
    return apiRequest(API_PATHS.TYPELUBRIFIANTS.UPDATE_TYPELUBRIFIANT(updatedTypelubrifiant.id), "PATCH", updatedTypelubrifiant);
};

export const deleteTypelubrifiant = async (typelubrifiant) => {
    return apiRequest(API_PATHS.TYPELUBRIFIANTS.DELETE_TYPELUBRIFIANT(typelubrifiant.id), "DELETE", typelubrifiant);
};