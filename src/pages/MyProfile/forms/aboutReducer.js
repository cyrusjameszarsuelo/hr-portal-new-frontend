export const initialAboutForm = {
  org_structure_id: "",
  employee_id: "",
  nickname: "",
  birthdate: "",
  gender: "",
  civil_status: "",
  phone_number: "",
  blood_type: "",
  emergency_contact_name: "",
  relationship_to_employee: "",
  emergency_contact_number: "",
  citizenship: "",
  birth_place: "",
  current_address_street: "",
  current_address_city: "",
  current_address_region: "",
  current_address_zip_code: "",
  permanent_address_street: "",
  permanent_address_city: "",
  permanent_address_region: "",
  permanent_address_zip_code: "",
  interests: [],
  skills: [],
  educational_backgrounds: [],
  licenses_certifications: [],
  megawide_work_experience: {
    position_title_id: "",
    department_id: "",
    sbu_id: "",
    level_id: "",
    employment_status: "",
    current_role_start_date: "",
    current_role_end_date: "",
    is_current: true,
    functions: [],
    previous_assignments: [],
  },
  previous_work_experiences: [],
  technical_proficiencies: [],
  language_proficiencies: [],
};

export function aboutReducer(state, action) {
  switch (action.type) {
    case "INIT": {
      return { ...state, ...action.payload };
    }
    case "UPDATE_FIELD": {
      const { key, value } = action;
      return { ...state, [key]: value };
    }
    case "UPDATE_NESTED": {
      const { objectKey, field, value } = action;
      return {
        ...state,
        [objectKey]: { ...(state[objectKey] || {}), [field]: value },
      };
    }
    case "ADD_ROW": {
      const { key, template } = action;
      const arr = Array.isArray(state[key]) ? state[key] : [];
      return { ...state, [key]: [...arr, template] };
    }
    case "REMOVE_ROW": {
      const { key, index } = action;
      const arr = Array.isArray(state[key]) ? state[key] : [];
      return { ...state, [key]: arr.filter((_, i) => i !== index) };
    }
    case "UPDATE_ROW": {
      const { key, index, field, value } = action;
      const arr = Array.isArray(state[key]) ? state[key] : [];
      return {
        ...state,
        [key]: arr.map((row, i) => (i === index ? { ...row, [field]: value } : row)),
      };
    }
    case "UPDATE_ROW_OBJECT": {
      // Update entire row at index with provided object
      const { key, index, updater } = action;
      const arr = Array.isArray(state[key]) ? state[key] : [];
      return {
        ...state,
        [key]: arr.map((row, i) => (i === index ? updater(row) : row)),
      };
    }
    case "MWE_TOGGLE_FUNCTION": {
      const { id, checked } = action;
      const current = state.megawide_work_experience || {};
      const list = Array.isArray(current.functions) ? current.functions : [];
      const next = checked
        ? [...list, { id }]
        : list.filter((f) => f.id !== id);
      return {
        ...state,
        megawide_work_experience: { ...current, functions: next },
      };
    }
    case "MWE_ADD_ASSIGNMENT": {
      const { template } = action;
      const current = state.megawide_work_experience || {};
      const list = Array.isArray(current.previous_assignments)
        ? current.previous_assignments
        : [];
      return {
        ...state,
        megawide_work_experience: {
          ...current,
          previous_assignments: [...list, template],
        },
      };
    }
    case "MWE_REMOVE_ASSIGNMENT": {
      const { index } = action;
      const current = state.megawide_work_experience || {};
      const list = Array.isArray(current.previous_assignments)
        ? current.previous_assignments
        : [];
      return {
        ...state,
        megawide_work_experience: {
          ...current,
          previous_assignments: list.filter((_, i) => i !== index),
        },
      };
    }
    case "MWE_UPDATE_ASSIGNMENT_FIELD": {
      const { index, field, value } = action;
      const current = state.megawide_work_experience || {};
      const list = Array.isArray(current.previous_assignments)
        ? current.previous_assignments
        : [];
      return {
        ...state,
        megawide_work_experience: {
          ...current,
          previous_assignments: list.map((a, i) =>
            i === index ? { ...a, [field]: value } : a
          ),
        },
      };
    }
    default:
      return state;
  }
}
