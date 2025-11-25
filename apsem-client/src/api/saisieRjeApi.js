// api/siteApi.js
import { API_PATHS } from '../utils/apiPaths';
import { apiRequest } from '../utils/apiRequest';

export const fecthSaisieRjeQuery = async (du, enginId) => {
    return await apiRequest(API_PATHS.SAISIE_RJE.GET_SAISIE_RJE, "POST", { du, enginId },);
};

export const createSaisieHrm = async (saisiehrm) => {
    return apiRequest(API_PATHS.SAISIE_RJE.ADD_SAISIE_RJE_HRM, "POST", saisiehrm);
};

export const deleteSaisiePanne = async (data) => {
    return await apiRequest(API_PATHS.SAISIE_RJE.DELETE_SAISIE_RJE_PANNE_HIM, "DELETE", data);
};

export const updateSaisiePanne = async (data) => {
    return await apiRequest(API_PATHS.SAISIE_RJE.UPDATE_SAISIE_RJE_PANNE_HIM, "PATCH", data);
};

export const getSaisieHrmDay = async (du) => {
    return await apiRequest(API_PATHS.SAISIE_RJE.GET_SAISIE_RJE_DAY, "POST", { du });
};

export const upsetHrm = async (upsetHRM) => {
    if (upsetHRM?.id === "") {
        return await apiRequest(API_PATHS.SAISIE_RJE.ADD_SAISIE_RJE_HRM, "POST", upsetHRM);
    } else {
        return await apiRequest(API_PATHS.SAISIE_RJE.UPDATE_SAISIE_RJE_HRM, "PATCH", upsetHRM);
    }
};

export const addPanne = async (data) => {
    return await apiRequest(API_PATHS.SAISIE_RJE.ADD_SAISIE_RJE_PANNE_HIM, "POST", data);
};

export const injectHRM = async (data) => {
    return await apiRequest(API_PATHS.SAISIE_RJE.INJECT_SAISIE_RJE_HRM, "POST", data);
};