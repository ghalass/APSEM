// api/typelubrifiantApi.js
import { API_PATHS } from '../utils/apiPaths';
import { apiRequest } from '../utils/apiRequest';

export const fetchTypeconsommationlubs = async () => {
    return apiRequest(API_PATHS.TYPECONSOMMATIONLUBS.GET_ALL_TYPECONSOMMATIONLUBS, "GET");
};

export const createTypeconsommationlub = async (typeconsommationlub) => {
    return apiRequest(API_PATHS.TYPECONSOMMATIONLUBS.ADD_TYPECONSOMMATIONLUBS, "POST", typeconsommationlub);
};

export const updateTypeconsommationlub = async (typeconsommationlub) => {
    return apiRequest(API_PATHS.TYPECONSOMMATIONLUBS.UPDATE_TYPECONSOMMATIONLUBS(typeconsommationlub.id), "PATCH", typeconsommationlub);
};

export const deleteTypeconsommationlub = async (typeconsommationlub) => {
    return apiRequest(API_PATHS.TYPECONSOMMATIONLUBS.DELETE_TYPECONSOMMATIONLUBS(typeconsommationlub.id), "DELETE", typeconsommationlub);
};

// /************** AFFECTATION DE PARC AU CODE *********************** */
export const createAffectParcToCode = async (data) => {
    return apiRequest(API_PATHS.TYPECONSOMMATIONLUBS.ADD_PARC_TO_CODE, "POST", data);
};
export const deleteAffectParcToCode = async (data) => {
    return apiRequest(API_PATHS.TYPECONSOMMATIONLUBS.DELETE_PARC_TO_CODE, "DELETE", data);
};
