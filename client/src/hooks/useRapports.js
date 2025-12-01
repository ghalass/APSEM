// hooks/useRapports.js
import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAnalyseSpcPeriodParcTypeConsom, getIndispoEnginsPeriode, getIndispoParcPeriode, getParetoIndispParc, getParetoMtbfParc, getPerformancesEnginsPeriode, getRapportEtatMensuel, getRapportHeuresChassis, getRapportIndispo, getRapportRje, getRapportSpecLub, getRapportUnitePhysique } from '../api/rapportsApi';

export const generateRjeQueryOptions = (du) => {
    return queryOptions({
        queryKey: ["rapportRjeList"],
        queryFn: () => getRapportRje(du),
        enabled: false, // 🔥 Désactive la requête automatique
    })
}

export const generateUnitePhysiqueQueryOptions = (du) => {
    return queryOptions({
        queryKey: ["rapportUnitePhysiqueList"],
        queryFn: () => getRapportUnitePhysique(du),
        enabled: false, // 🔥 Désactive la requête automatique
    })
}

export const generateEtatMensuelOptions = (du) => {
    return queryOptions({
        queryKey: ["rapportEtatMensuelList"],
        queryFn: () => getRapportEtatMensuel(du),
        enabled: false, // 🔥 Désactive la requête automatique
    })
}

export const getRapportIndispoOptions = (du) => {
    return queryOptions({
        queryKey: ["rapportRapportIndispo"],
        queryFn: () => getRapportIndispo(du),
        enabled: false, // 🔥 Désactive la requête automatique
    })
}

export const getRapportHeuresChassisOptions = (du) => {
    return queryOptions({
        queryKey: ["rapportRapportHeuresChassis"],
        queryFn: () => getRapportHeuresChassis(du),
        enabled: false, // 🔥 Désactive la requête automatique
    })
}

export const getRapportSpecLubOptions = (typelubrifiantId, year, shouldFetch) => {
    return queryOptions({
        queryKey: ["rapportRapportSpecLub"],
        queryFn: () => getRapportSpecLub(typelubrifiantId, year),
        enabled: false
    })
}

export const getParetoIndispParcOptions = (parcId, date) => {
    return queryOptions({
        queryKey: ["rapportParetoIndispParc"],
        queryFn: () => getParetoIndispParc(parcId, date),
        enabled: false
    })
}

export const getParetoMtbfParcOptions = (parcId, date) => {
    return queryOptions({
        queryKey: ["rapportParetoMtbfParc"],
        queryFn: () => getParetoMtbfParc(parcId, date),
        enabled: false
    })
}

export const getAnalyseSpcPeriodParcTypeConsommOptions = (parcId, dateDu, dateAu, selectedTypelubrifiantId) => {
    return queryOptions({
        queryKey: ["rapportPnalyseSpcPeriodParc"],
        queryFn: () => getAnalyseSpcPeriodParcTypeConsom(parcId, dateDu, dateAu, selectedTypelubrifiantId),
        enabled: false
    })
}

export const getIndispoParcPeriodeOptions = (selectedParc, dateDu, dateAu) => {
    return queryOptions({
        queryKey: ["analyseIndispoParcPeriode"],
        queryFn: () => getIndispoParcPeriode(selectedParc, dateDu, dateAu),
        enabled: false
    })
}

export const getIndispoEnginsPeriodeOptions = (selectedParc, dateDu, dateAu) => {
    return queryOptions({
        queryKey: ["analyseIndispoEnginsPeriode"],
        queryFn: () => getIndispoEnginsPeriode(selectedParc, dateDu, dateAu),
        enabled: false
    })
}

export const getPerformancesEnginsPeriodeOptions = (selectedParc, dateDu, dateAu) => {
    return queryOptions({
        queryKey: ["analysePerformancesEnginsPeriode"],
        queryFn: () => getPerformancesEnginsPeriode(selectedParc, dateDu, dateAu),
        enabled: false
    })
}

