export const initialJobForm = {
    reporting_to: null,
    department: "",
    jobPurpose: "",
    reportingRelationships: { primary: "", secondary: "", tertiary: "" },
    levelsOfAuthority: { lineAuthority: "", staffAuthority: "" },
    jobSpecifications: {
        educationalBackground: [],
        licenseRequirement: [],
        workExperience: [],
    },
    kras: [],
};

export function jobProfileReducer(state, action) {
    switch (action.type) {
        case "INIT": {
            return { ...state, ...action.payload };
        }
        case "UPDATE_FIELD": {
            const { section, field, value } = action.payload;
            if (section) {
                return {
                    ...state,
                    [section]: { ...state[section], [field]: value },
                };
            }
            return { ...state, [field]: value };
        }
        case "ADD_KRA": {
            // Get all currently used KRA IDs
            const usedKraIds = state.kras.map(kra => kra.kraId).filter(id => id !== null);
            
            // Get all available subfunctions from the action payload
            const subfunctions = action.subfunctions || [];
            
            // Find a subfunction with available KRAs
            let selectedSubfunction = null;
            let selectedKra = null;
            
            for (const subfunction of subfunctions) {
                const availableKras = (subfunction.job_profile_kras || []).filter(
                    kraOption => !usedKraIds.includes(kraOption.id)
                );
                
                if (availableKras.length > 0) {
                    selectedSubfunction = subfunction;
                    selectedKra = availableKras[0];
                    break;
                }
            }
            
            // Helper to map duties/profile_kra into UI shape
            const mapDuties = (kraObj) => {
                if (!kraObj) return [];
                if (Array.isArray(kraObj.profile_kra) && kraObj.profile_kra.length) {
                    return kraObj.profile_kra.map(p => ({ id: p.id, kra_description: p.kra_description || p.duties_and_responsibilities || '', description: p.description || p.deliverables || '' }));
                }
                if (Array.isArray(kraObj.job_profile_duties) && kraObj.job_profile_duties.length) {
                    return kraObj.job_profile_duties.map(p => ({ id: p.id, kra_description: p.duties_and_responsibilities || '', description: p.deliverables || '' }));
                }
                return [];
            };

            // Create new KRA with auto-populated values if available
            const newKra = selectedKra ? {
                subfunction: selectedSubfunction,
                kraId: selectedKra.id,
                kra: selectedKra.kra,
                description: selectedKra.kra_description,
                profile_kra: mapDuties(selectedKra),
            } : {
                subfunction: null,
                kraId: null,
                kra: "",
                description: "",
                profile_kra: [],
            };
            
            return {
                ...state,
                kras: [...state.kras, newKra],
            };
        }
        case "REMOVE_KRA": {
            return {
                ...state,
                kras: state.kras.filter((_, i) => i !== action.index),
            };
        }
        case "UPDATE_KRA_FIELD": {
            const { index, field, value } = action;
            return {
                ...state,
                kras: state.kras.map((kra, i) => {
                    if (i !== index) return kra;
                    if (field === "subfunction") {
                        // Get all currently used KRA IDs (excluding the current index)
                        const usedKraIds = state.kras
                            .map((k, idx) => (idx !== index ? k.kraId : null))
                            .filter(id => id !== null);
                        
                        // Find the first available KRA that hasn't been used
                        const availableKras = value?.job_profile_kras || [];
                        const firstAvailableKra = availableKras.find(
                            kraOption => !usedKraIds.includes(kraOption.id)
                        );

                        // Auto-populate with the first available KRA (include details)
                        if (firstAvailableKra) {
                            const mapDutiesLocal = (kraObj) => {
                                if (!kraObj) return [];
                                if (Array.isArray(kraObj.profile_kra) && kraObj.profile_kra.length) {
                                    return kraObj.profile_kra.map(p => ({ id: p.id, kra_description: p.kra_description || p.duties_and_responsibilities || '', description: p.description || p.deliverables || '' }));
                                }
                                if (Array.isArray(kraObj.job_profile_duties) && kraObj.job_profile_duties.length) {
                                    return kraObj.job_profile_duties.map(p => ({ id: p.id, kra_description: p.duties_and_responsibilities || '', description: p.deliverables || '' }));
                                }
                                return [];
                            };

                            return {
                                ...kra,
                                subfunction: value,
                                kraId: firstAvailableKra.id,
                                kra: firstAvailableKra.kra,
                                description: firstAvailableKra.kra_description,
                                profile_kra: mapDutiesLocal(firstAvailableKra),
                            };
                        }
                        
                        return {
                            ...kra,
                            subfunction: value,
                            kraId: null,
                            kra: "",
                            description: "",
                        };
                    }
                    return { ...kra, [field]: value };
                }),
            };
        }
        case "ADD_PROFILE_KRA": {
            return {
                ...state,
                kras: state.kras.map((kra, i) =>
                    i === action.kraIndex
                        ? {
                              ...kra,
                              profile_kra: [
                                  ...kra.profile_kra,
                                  { kra_description: "", description: "" },
                              ],
                          }
                        : kra,
                ),
            };
        }
        case "REMOVE_PROFILE_KRA": {
            const { kraIndex, profileIndex } = action;
            return {
                ...state,
                kras: state.kras.map((kra, i) =>
                    i === kraIndex
                        ? {
                              ...kra,
                              profile_kra: kra.profile_kra.filter(
                                  (_, p) => p !== profileIndex,
                              ),
                          }
                        : kra,
                ),
            };
        }
        case "UPDATE_PROFILE_KRA_FIELD": {
            const { kraIndex, profileIndex, field, value } = action;
            return {
                ...state,
                kras: state.kras.map((kra, i) =>
                    i === kraIndex
                        ? {
                              ...kra,
                              profile_kra: kra.profile_kra.map((pk, p) =>
                                  p === profileIndex
                                      ? { ...pk, [field]: value }
                                      : pk,
                              ),
                          }
                        : kra,
                ),
            };
        }
        case "SET_KRA_FROM_SELECTION": {
            const { index, selectedKra } = action;
            const mapDutiesLocal = (kraObj) => {
                if (!kraObj) return [];
                if (Array.isArray(kraObj.profile_kra) && kraObj.profile_kra.length) {
                    return kraObj.profile_kra.map(p => ({ id: p.id, kra_description: p.kra_description || p.duties_and_responsibilities || '', description: p.description || p.deliverables || '' }));
                }
                if (Array.isArray(kraObj.job_profile_duties) && kraObj.job_profile_duties.length) {
                    return kraObj.job_profile_duties.map(p => ({ id: p.id, kra_description: p.duties_and_responsibilities || '', description: p.deliverables || '' }));
                }
                return [];
            };

            return {
                ...state,
                kras: state.kras.map((k, i) =>
                    i === index
                        ? {
                              ...k,
                              kraId: selectedKra?.id || null,
                              kra: selectedKra?.kra || "",
                              description: selectedKra?.kra_description || "",
                              profile_kra: mapDutiesLocal(selectedKra),
                          }
                        : k,
                ),
            };
        }
        case "SET_PROFILE_KRA": {
            const { index, profile_kra } = action;
            return {
                ...state,
                kras: state.kras.map((k, i) => (i === index ? { ...k, profile_kra } : k)),
            };
        }
        case "AUTO_POPULATE_KRAS": {
            // Get all available KRAs from all subfunctions
            const subfunctions = action.subfunctions || [];
            const allKras = [];
            
            subfunctions.forEach(subfunction => {
                if (subfunction.job_profile_kras && Array.isArray(subfunction.job_profile_kras)) {
                    subfunction.job_profile_kras.forEach(kra => {
                        allKras.push({
                            subfunction: subfunction,
                            kraId: kra.id,
                            kra: kra.kra,
                            description: kra.kra_description,
                            profile_kra: [],
                        });
                    });
                }
            });
            
            return {
                ...state,
                kras: allKras,
            };
        }
        default:
            return state;
    }
}
