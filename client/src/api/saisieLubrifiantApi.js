// api/siteApi.js
import { API_PATHS } from '../utils/apiPaths';
import { apiRequest } from '../utils/apiRequest';

// export const fetchUsers = async () => {
//     return await apiRequest(API_PATHS.AUTH.GET_ALL_USERS, "GET");
// };

export const createSaisieLubrifiant = async (saisie) => {
    return await apiRequest(API_PATHS.SAISIE_LUBRIFIANT.ADD_SAISIE_LUBRIFIANT, "POST", saisie);
};

// export const updateUser = async (updatedSite) => {
//     return await apiRequest(API_PATHS.AUTH.UPDATE_USER, "PATCH", updatedSite);
// };

export const deleteSaisieLubrifiant = async (data) => {
    return await apiRequest(API_PATHS.SAISIE_LUBRIFIANT.DELETE_SAISIE_LUBRIFIANT, "DELETE", data);
};

export const getAllSaisieLubrifiantByMonth = async (data) => {
    return await apiRequest(API_PATHS.SAISIE_LUBRIFIANT.GET_ALL_SAISIE_LUBRIFIANT_BY_MONTH, "POST", data);
};


// export const loginUser = async (data) => {
//     return await apiRequest(API_PATHS.AUTH.LOGIN, "POST", data);
// };