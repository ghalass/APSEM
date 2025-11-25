// stores/useSaisieRjeStore.js
import { create } from 'zustand';

const useSaisieRjeStore = create((set) => ({
    // selectedFields
    selectedFields: {
        du: new Date().toISOString().split("T")[0],
        enginId: "",
        siteId: "",
        parcId: "",
        typeparcId: "",
    },
    setSelectedFields: (fields) => set({ selectedFields: fields }),

    // saisieRjeQuery
    saisieRjeQueryStore: null,
    setSaisieRjeQueryStore: (query) => set({ saisieRjeQueryStore: query }),

    hrm: "",
    setHrm: (hrm) => set({ hrm }),

    // HRM
    showHRMModal: false,
    handleShowHRMModal: () => set({ showHRMModal: true }),
    handleCloseHRMModal: () => set({ showHRMModal: false }),

    // LUB
    showLubModal: false,
    handleShowLubModal: () => set({ showLubModal: true }),
    handleCloseLubModal: () => set({ showLubModal: false }),

    // SAISIE HIM
    selectedSaisieHim: {},
    setSelectedSaisieHim: (selectedSaisieHim) => set({ selectedSaisieHim }),

    // PANNE
    showPanneModal: false,
    handleShowPanneModal: () => set({ showPanneModal: true }),
    handleClosePanneModal: () => set({ showPanneModal: false }),

    // DELETE PANNE
    panneToDelete: null,
    showDeletePanneModal: false,
    handleShowDeletePanneModal: (panne_to_delete) => set({ showDeletePanneModal: true, panneToDelete: panne_to_delete }),
    handleCloseDeletePanneModal: () => set({ showDeletePanneModal: false }),

    // EDIT PANNE
    panneToEdit: null,
    showEditPanneModal: false,
    handleShowEditPanneModal: (panne_to_edit) => set({ showEditPanneModal: true, panneToEdit: panne_to_edit }),
    handleCloseEditPanneModal: () => set({ showEditPanneModal: false }),

}));

export default useSaisieRjeStore;