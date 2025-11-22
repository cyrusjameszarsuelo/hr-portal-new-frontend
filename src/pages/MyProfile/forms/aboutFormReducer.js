// Reducer and initializer for AboutForm state

export function initialAboutForm(profileId) {
  return {
    org_structure_id: profileId || "",
    employee_id: "",
      firstname: "",
      middlename: "",
      lastname: "",
      suffix: "",
    nickname: "",
    birth_date: "",
    birthdate: "",
    gender: "",
    civil_status: "",
      number_of_children: "",
    phone_number: "",
      personal_email: "",
    blood_type: "",
    emergency_contact_name: "",
    relationship_to_employee: "",
    emergency_contact_number: "",
    citizenship: "",
    birth_place: "",
      upload_photo: "",
    current_address_street: "",
      current_address_barangay: "",
    current_address_city: "",
    current_address_region: "",
    current_address_zip_code: "",
    permanent_address_street: "",
      permanent_address_barangay: "",
    permanent_address_city: "",
    permanent_address_region: "",
    permanent_address_zip_code: "",
    interests: [],
    skills: [],
    educational_backgrounds: [],
    licenses_certifications: [],
    megawide_work_experience: {
      job_title: "",
      department: "",
      unit: "",
      job_level: "",
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
}

export function aboutFormReducer(state, action) {
  switch (action.type) {
    case 'APPLY_UPDATER': {
      // updater is a function(prevState) => newState
      try {
        return action.updater(state);
      } catch (e) {
        console.error('AboutForm reducer APPLY_UPDATER failed:', e);
        return state;
      }
    }
    case 'REPLACE': {
      return { ...state, ...action.payload };
    }
    case 'INIT': {
      return { ...state, ...action.payload };
    }
    default:
      return state;
  }
}

