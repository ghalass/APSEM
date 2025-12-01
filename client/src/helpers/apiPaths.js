// src/helpers/apiPaths.js
export const API_PATHS = {
  AUTH: {
    LOGIN: '/user/login',
    LOGOUT: '/user/logout',
    CHECK_TOKEN: '/user/checktoken',
    REGISTER: '/user/signup',
    UPDATE_USER: '/user/updateUser',
    DELETE_USER: (userId) => `/user/${userId}`,
    GET_USER_INFO: '/user/getUserInfo',
    GET_ALL_USERS: '/user/users',
  },
  ROLES: {
    GET_ALL_ROLES: '/roles',
    ADD_ROLE: '/roles',
    UPDATE_ROLE: (roleId) => `/roles/${roleId}`,
    DELETE_ROLE: (roleId) => `/roles/${roleId}`,
    ASSIGN_PERMISSION_TO_ROLE: `/assign/permission-to-role`,
    DELETE_RELATION_PERMISSION_TO_ROLE: `/assign/delete-relation-permission-to-role`,
  },
  PERMISSIONS: {
    GET_ALL_PERMISSIONS: '/permissions',
    ADD_PERMISSION: '/permissions',
    // UPDATE_PERMISSION: (permissionId) => `/permissions/${permissionId}`,
    DELETE_PERMISSION: (permissionId) => `/permissions/${permissionId}`,
  },
  RESOURCES: {
    GET_ALL_RESOURCES: '/resources',
    ADD_RESOURCE: '/resources',
    UPDATE_RESOURCE: (resourceId) => `/resources/${resourceId}`,
    DELETE_RESOURCE: (resourceId) => `/resources/${resourceId}`,
  },
  DASHBOARD: {
    GET_DATA: '/dashboard/',
  },
  SITES: {
    GET_ALL_SITES: '/sites',
    ADD_SITE: '/sites',
    UPDATE_SITE: (siteId) => `/sites/${siteId}`,
    DELETE_SITE: (siteId) => `/sites/${siteId}`,
    DOWNLOAD_SITES: '/sites/downloadexcel',
  },
  IMPORTER: {
    IMPORT_DATA: '/import',
  },
  OBJECTIFS: {
    GET_ALL_OBJECTIFS: '/objectifs',
    ADD_OBJECTIF: '/objectifs',
    UPDATE_OBJECTIF: (objectifId) => `/objectifs/${objectifId}`,
    DELETE_OBJECTIF: (objectifId) => `/objectifs/${objectifId}`,
    DOWNLOAD_OBJECTIFS: '/objectifs/downloadexcel',
  },
  TYPEPARCS: {
    GET_ALL_TYPEPARCS: '/typeparcs',
    ADD_TYPEPARC: '/typeparcs',
    UPDATE_TYPEPARC: (typeparcId) => `/typeparcs/${typeparcId}`,
    DELETE_TYPEPARC: (typeparcId) => `/typeparcs/${typeparcId}`,
    DOWNLOAD_TYPEPARCS: '/typeparcs/downloadexcel',
  },
  PARCS: {
    GET_ALL_PARCS: '/parcs',
    GET_ALL_PARCS_BY_TYPEPARC: (typeparcId) => `/parcs/typeparc/${typeparcId}`,
    ADD_PARC: '/parcs/',
    UPDATE_PARC: (parcId) => `/parcs/${parcId}`,
    DELETE_PARC: (parcId) => `/parcs/${parcId}`,
    DOWNLOAD_PARCs: '/parcs/downloadexcel',
  },
  ENGINS: {
    GET_ALL_ENGINS: '/engins',
    ADD_ENGIN: '/engins',
    GET_ALL_ENGINS_BY_PARCID_SITEID: (parcId, siteId) => `/engins/parc/${parcId}/site/${siteId}`,
    UPDATE_ENGIN: (enginId) => `/engins/${enginId}`,
    DELETE_ENGIN: (enginId) => `/engins/${enginId}`,
    DOWNLOAD_ENGINS: '/engins/downloadexcel',
  },
  TYPEPANNES: {
    GET_ALL_TYPEPANNES: '/typepannes',
    ADD_TYPEPANNE: '/typepannes',
    UPDATE_TYPEPANNE: (typepanneId) => `/typepannes/${typepanneId}`,
    DELETE_TYPEPANNE: (typepanneId) => `/typepannes/${typepanneId}`,
    DOWNLOAD_TYPEPANNES: '/typepannes/downloadexcel',
    // AFFECT PARC TO CODE
    ADD_PARC_TO_TYPEPANNE: '/typepannes/affectparctotypepanne',
    DELETE_PARC_TO_TYPEPANNE: '/typepannes/affectparctotypepanne/delete',
    //
    GET_ALL_TYPEPANNES_BY_PARCID: (id) => `/typepannes/byparcid/${id}`,
  },
  PANNES: {
    GET_ALL_PANNES: '/pannes',
    GET_ALL_PANNES_BY_TYPEPANNE_ID: (typepanneId) => `/pannes/typepanne/${typepanneId}`,

    ADD_PANNE: '/pannes/',
    UPDATE_PANNE: (panneId) => `/pannes/${panneId}`,
    DELETE_PANNE: (panneId) => `/pannes/${panneId}`,
    DOWNLOAD_PANNES: '/pannes/downloadexcel',
  },
  TYPELUBRIFIANTS: {
    GET_ALL_TYPELUBRIFIANTS: '/typelubrifiants',
    ADD_TYPELUBRIFIANT: '/typelubrifiants',
    UPDATE_TYPELUBRIFIANT: (typelubrifiantId) => `/typelubrifiants/${typelubrifiantId}`,
    DELETE_TYPELUBRIFIANT: (typelubrifiantId) => `/typelubrifiants/${typelubrifiantId}`,
    DOWNLOAD_TYPELUBRIFIANTS: '/typelubrifiants/downloadexcel',
  },
  LUBRIFIANTS: {
    GET_ALL_LUBRIFIANTS: '/lubrifiants',
    ADD_LUBRIFIANT: '/lubrifiants',
    UPDATE_LUBRIFIANT: (lubrifiantId) => `/lubrifiants/${lubrifiantId}`,
    DELETE_LUBRIFIANT: (lubrifiantId) => `/lubrifiants/${lubrifiantId}`,
    DOWNLOAD_LUBRIFIANTS: '/lubrifiants/downloadexcel',
    // AFFECT PARC TO CODE
    ADD_PARC_TO_LUBRIFIANT: '/lubrifiants/affectparctolubrifiant',
    DELETE_PARC_TO_LUBRIFIANT: '/lubrifiants/affectparctolubrifiant/delete',
    //
    GET_ALL_LUBRIFIANTS_BY_PARCID: (id) => `/lubrifiants/byparcid/${id}`,
  },
  TYPECONSOMMATIONLUBS: {
    GET_ALL_TYPECONSOMMATIONLUBS: '/typeconsommationlubs',
    ADD_TYPECONSOMMATIONLUBS: '/typeconsommationlubs',
    UPDATE_TYPECONSOMMATIONLUBS: (typeconsommationlubId) =>
      `/typeconsommationlubs/${typeconsommationlubId}`,
    DELETE_TYPECONSOMMATIONLUBS: (typeconsommationlubId) =>
      `/typeconsommationlubs/${typeconsommationlubId}`,
    DOWNLOAD_YPECONSOMMATIONLUBS: '/typeconsommationlubs/downloadexcel',
    // AFFECT PARC TO CODE
    ADD_PARC_TO_CODE: '/typeconsommationlubs/affectparctocode',
    DELETE_PARC_TO_CODE: '/typeconsommationlubs/affectparctocode/delete',
    //
    GET_ALL_TYPE_CONSOM_LUBRIFIANTS_BY_PARCID: (id) =>
      `/typeconsommationlubs/affectparctocode/byparcid/${id}`,
  },
  SAISIE_RJE: {
    GET_SAISIE_RJE: '/saisiehrm/getSaisieHrm',
    GET_SAISIE_RJE_DAY: '/saisiehrm/getSaisieHrmDay',

    ADD_SAISIE_RJE_HRM: `/saisiehrm/createSaisieHrm`,
    UPDATE_SAISIE_RJE_HRM: `/saisiehrm/updateSaisieHrm`,

    ADD_SAISIE_RJE_PANNE_HIM: '/saisiehrm/createSaisieHim',
    DELETE_SAISIE_RJE_PANNE_HIM: '/saisiehrm/deleteSaisieHim',
    UPDATE_SAISIE_RJE_PANNE_HIM: '/saisiehrm/updateSaisieHim',

    //
    INJECT_SAISIE_RJE_HRM: `/saisiehrm/injectSaisieHrm`,
    INJECT_SAISIE_RJE_HIM: `/saisiehrm/injectSaisieHim`,
  },
  SAISIE_LUBRIFIANT: {
    ADD_SAISIE_LUBRIFIANT: `/saisielubrifiant/createSaisieLubrifiant`,
    DELETE_SAISIE_LUBRIFIANT: `/saisielubrifiant/deleteSaisieLubrifiant`,
    GET_ALL_SAISIE_LUBRIFIANT_BY_MONTH: `/saisielubrifiant/getallsaisielubbymonth`,
  },
  RAPPORTS: {
    GENERATE_RJE: '/rapports/getRapportRje',
    GENERATE_UNITE_PHYSIQUE: '/rapports/getRapportUnitePhysique',
    GENERATE_ETAT_MENSUEL: '/rapports/getEtatMensuel',
    GENERATE_RAPPORT_INDISPO: '/rapports/getIndispoParParc',
    GENERATE_RAPPORT_HEURES_CHASSIS: '/rapports/getHeuresChassis',
    GENERATE_RAPPORT_SPEC_LUB: '/rapports/getSpecLub',
    GENERATE_PARETO_INDISPO_PARC: '/rapports/getParetoIndispoParc',
    GENERATE_PARETO_MTBF_PARC: '/rapports/getParetoMtbfParc',
    GENERATE_ANALYSE_LUB_PERIOD_PARC: '/rapports/getAnalyseSpcPeriodParcTypeConsomm',
    GENERATE_ANALYSE_INDISPO_PARC_PERIODE: '/rapports/getIndispoParcPeriode',
    GENERATE_ANALYSE_INDISPO_ENGINS_PERIODE: '/rapports/getIndispoEnginsPeriode',
    GENERATE_ANALYSE_PERFORMANCES_ENGINS_PERIODE: '/rapports/getPerormancesEnginsPeriode',
  },
  ANOMALIES: {
    GET_ALL_ANOMALIES: '/anomalies',
    GET_ANOMALIE_BY_ID: (id) => `/anomalies/${id}`,
    CREATE_ANOMALIE: '/anomalies',
    UPDATE_ANOMALIE: (id) => `/anomalies/${id}`,
    DELETE_ANOMALIE: (id) => `/anomalies/${id}`,
    GET_ANOMALIE_STATS: '/anomalies/stats',
    GET_ANOMALIE_HISTORIQUE: (anomalieId) => `/anomalies/${anomalieId}/historique`,
    CREATE_HISTORIQUE_ENTRY: '/anomalies/historique',
  },
}
