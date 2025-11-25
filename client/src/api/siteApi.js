// api/siteApi.js
import { API_PATHS } from '../utils/apiPaths';
import { apiRequest } from '../utils/apiRequest';

export const fetchSites = async () => {
    return apiRequest(API_PATHS.SITES.GET_ALL_SITES, "GET");
};

export const createSite = async (site) => {
    return apiRequest(API_PATHS.SITES.ADD_SITE, "POST", site);
};

export const updateSite = async (updatedSite) => {
    return apiRequest(API_PATHS.SITES.UPDATE_SITE(updatedSite.id), "PATCH", updatedSite);
};

export const deleteSite = async (siteToDelete) => {
    return apiRequest(API_PATHS.SITES.DELETE_SITE(siteToDelete.id), "DELETE");
};