// config/excelHeaders.js
const REQUIRED_HEADERS = {
  sites: ["name"],
  typeparcs: ["name"],
  parcs: ["name", "typeparcName"],
  engins: ["name", "parcName", "siteName", "active", "initialHeureChassis"],
  saisiehrm: ["du", "enginName", "siteName", "hrm"],
  saisiehim: ["panneName", "him", "ni", "saisiehrmDu", "enginName", "obs"],
  objectifs: [
    "annee",
    "parcName",
    "siteName",
    "dispo",
    "mtbf",
    "tdm",
    "spe_huile",
    "spe_go",
    "spe_graisse",
  ],
  // ... autres configurations
};

const HEADER_MAPPINGS = {
  engins: {
    "Nom Engin": "name",
    Parc: "parcName",
    Site: "siteName",
    Actif: "active",
    "Heures Chassis Initiales": "initialHeureChassis",
  },
  saisiehrm: {
    Date: "du",
    Engin: "enginName",
    Site: "siteName",
    HRM: "hrm",
  },
  // ... autres mappings
};

module.exports = {
  REQUIRED_HEADERS,
  HEADER_MAPPINGS,
};
