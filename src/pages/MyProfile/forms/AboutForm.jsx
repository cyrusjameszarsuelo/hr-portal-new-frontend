import React, { useEffect, useState, useReducer } from "react";
import ConfirmDialog from "../../../components/ProfileFormComponents/ConfirmDialog";
import CustomModal from "../../../components/CustomModal";
import InterestsSection from "../../../components/ProfileFormComponents/AboutForm/InterestsSection";
import SkillsSection from "../../../components/ProfileFormComponents/AboutForm/SkillsSection";
import EducationSection from "../../../components/ProfileFormComponents/AboutForm/EducationSection";
import { useNavigate } from "react-router";
import { addAbout, getAboutEdit } from "../../../database/about";
import { aboutFormReducer, initialAboutForm } from "./aboutFormReducer";
import FormActionBar from "../../../components/FormActionBar";
import { getAllSubFunctions } from "../../../database/functional_structure";
import { getMyProfileEdit } from "../../../database/my_profile";

// A compact red-accent section title, consistent with JobProfile visuals
function SectionTitle({ children }) {
    return (
        <h2 className="text-lg font-semibold text-[#ee3124] flex items-center gap-2">
            <span className="inline-block w-1 h-6 bg-red-600 rounded-full" />
            {children}
        </h2>
    );
}

export default function AboutForm({
    profileId,
    onSaved,
    onPrev,
    onNext,
    prevDisabled,
    nextDisabled,
}) {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [functionsList, setFunctionsList] = useState([]);
    const [department, setDepartment] = useState("");
    const [positionTitle, setPositionTitle] = useState("");
    const navigate = useNavigate();

    // Main About form state matching the provided schema
    const [form, dispatch] = useReducer(
        aboutFormReducer,
        profileId,
        initialAboutForm,
    );

    // Confirmation dialog state
    const [confirmState, setConfirmState] = useState({
        open: false,
        title: "",
        message: "",
        confirmLabel: "Delete",
        onConfirm: null,
    });

    // Helpers to update nested arrays cleanly
    const updateField = (key, value) =>
        dispatch({
            type: "APPLY_UPDATER",
            updater: (p) => ({ ...p, [key]: value }),
        });

    const addRow = (key, template) =>
        dispatch({
            type: "APPLY_UPDATER",
            updater: (p) => ({ ...p, [key]: [...(p[key] || []), template] }),
        });

    const removeRow = (key, index) =>
        dispatch({
            type: "APPLY_UPDATER",
            updater: (p) => ({
                ...p,
                [key]: (p[key] || []).filter((_, i) => i !== index),
            }),
        });

    const confirmRemoveRow = (key, index, label = "Item") => {
        setConfirmState({
            open: true,
            title: `Remove ${label}`,
            message: `This will permanently remove the ${label.toLowerCase()}. Do you want to continue?`,
            confirmLabel: "Remove",
            onConfirm: () => {
                removeRow(key, index);
                setConfirmState((s) => ({ ...s, open: false }));
            },
        });
    };

    const confirmRemoveAssignment = (index) => {
        setConfirmState({
            open: true,
            title: "Remove Assignment",
            message: "This will remove the previous assignment record.",
            confirmLabel: "Remove",
            onConfirm: () => {
                dispatch({
                    type: "APPLY_UPDATER",
                    updater: (p) => ({
                        ...p,
                        megawide_work_experience: {
                            ...p.megawide_work_experience,
                            previous_assignments:
                                p.megawide_work_experience.previous_assignments.filter(
                                    (_, i) => i !== index,
                                ),
                        },
                    }),
                });
                setConfirmState((s) => ({ ...s, open: false }));
            },
        });
    };

    const updateRow = (key, index, field, value) =>
        dispatch({
            type: "APPLY_UPDATER",
            updater: (p) => ({
                ...p,
                [key]: (p[key] || []).map((row, i) =>
                    i === index ? { ...row, [field]: value } : row,
                ),
            }),
        });

    // Note: Nested helpers for arrays are omitted now; only education.licAndCerts is nested and handled inline.

    // Load department from MyProfile
    useEffect(() => {
        const loadDepartment = async () => {
            try {
                const editData = await getMyProfileEdit(profileId);
                if (editData?.department) {
                    setDepartment(editData.department);
                    setPositionTitle(editData.position_title);
                }
            } catch (error) {
                console.error("Failed to load department:", error);
            }
        };
        loadDepartment();
    }, [profileId]);

    // Load subfunction positions based on department
    useEffect(() => {
        const loadSubFunctions = async () => {
            try {
                if ((department, positionTitle)) {
                    const subfunctionsData = await getAllSubFunctions(
                        department,
                        positionTitle,
                    );
                    setFunctionsList(subfunctionsData || []);
                } else {
                    setFunctionsList([]);
                }
            } catch (error) {
                console.error(
                    "Failed to load subfunction positions list:",
                    error,
                );
                setFunctionsList([]);
            }
        };
        loadSubFunctions();
    }, [department, positionTitle]);

    // Load existing About data if available
    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const editData = await getAboutEdit(profileId);

                // Shape the incoming edit data defensively
                const about = editData?.about || {};

                // Map interests
                const interests = Array.isArray(about.interests)
                    ? about.interests.map((i) =>
                          typeof i === "string"
                              ? { interest: i }
                              : { id: i?.id, interest: i?.interest ?? "" },
                      )
                    : [];

                // Map skills
                const skills = Array.isArray(about.skills)
                    ? about.skills.map((s) =>
                          typeof s === "string"
                              ? { skill: s }
                              : { id: s?.id, skill: s?.skill ?? "" },
                      )
                    : [];

                // Map educational backgrounds
                const educational_backgrounds = Array.isArray(
                    about.educational_backgrounds,
                )
                    ? about.educational_backgrounds.map((e) => ({
                          id: e?.id,
                          education_level: e?.education_level ?? "",
                          school_attended: e?.school_attended ?? "",
                          degree_program_course: e?.degree_program_course ?? "",
                          academic_achievements: e?.academic_achievements ?? "",
                          year_started: e?.year_started ?? "",
                          year_ended: e?.year_ended ?? "",
                          is_current: Boolean(e?.is_current),
                      }))
                    : [];

                // Map licenses & certifications
                const licenses_certifications = Array.isArray(
                    about.licenses_certifications,
                )
                    ? about.licenses_certifications.map((l) => ({
                          id: l?.id,
                          license_certification_name:
                              l?.license_certification_name ?? "",
                          issuing_organization: l?.issuing_organization ?? "",
                          license_certification_number:
                              l?.license_certification_number ?? "",
                          date_issued: l?.date_issued ?? "",
                          date_of_expiration: l?.date_of_expiration ?? "",
                          non_expiring: Boolean(l?.non_expiring),
                      }))
                    : [];

                // Map Megawide work experience (single object with previous assignments)
                const megawide_work_experience = about.megawide_work_experience
                    ? {
                          job_title:
                              about.megawide_work_experience.job_title ?? "",
                          department:
                              about.megawide_work_experience.department ?? "",
                          unit: about.megawide_work_experience.unit ?? "",
                          job_level:
                              about.megawide_work_experience.job_level ?? "",
                          employment_status:
                              about.megawide_work_experience
                                  .employment_status ?? "",
                          current_role_start_date:
                              about.megawide_work_experience
                                  .current_role_start_date ?? "",
                          current_role_end_date:
                              about.megawide_work_experience
                                  .current_role_end_date ?? "",
                          is_current: Boolean(
                              about.megawide_work_experience.is_current,
                          ),
                          functions: Array.isArray(
                              about.megawide_work_experience.functions,
                          )
                              ? about.megawide_work_experience.functions
                              : [],
                          previous_assignments: Array.isArray(
                              about.megawide_work_experience
                                  .previous_assignments,
                          )
                              ? about.megawide_work_experience.previous_assignments.map(
                                    (a) => ({
                                        id: a?.id,
                                        sbu: a?.sbu ?? "",
                                        worked_in_megawide: Boolean(
                                            a?.worked_in_megawide ?? true,
                                        ),
                                        previous_department:
                                            a?.previous_department ?? "",
                                        previous_job_title:
                                            a?.previous_job_title ?? "",
                                        previous_role_start_date:
                                            a?.previous_role_start_date ?? "",
                                        end_of_assignment:
                                            a?.end_of_assignment ?? "",
                                    }),
                                )
                              : [],
                      }
                    : {
                          job_title: "",
                          department: "",
                          unit: "",
                          job_level: "",
                          employment_status: "",
                          current_role_start_date: "",
                          current_role_end_date: "",
                          is_current: false,
                          functions: [],
                          previous_assignments: [],
                      };

                // Map previous work experiences
                const previous_work_experiences = Array.isArray(
                    about.previous_work_experiences,
                )
                    ? about.previous_work_experiences.map((w) => ({
                          id: w?.id,
                          company: w?.company ?? "",
                          job_title: w?.job_title ?? "",
                          job_level: w?.job_level ?? "",
                          start_date: w?.start_date ?? "",
                          end_date: w?.end_date ?? "",
                      }))
                    : [];

                // Map technical proficiencies
                const technical_proficiencies = Array.isArray(
                    about.technical_proficiencies,
                )
                    ? about.technical_proficiencies.map((t) => ({
                          id: t?.id,
                          skills: t?.skills ?? "",
                          proficiency: t?.proficiency ?? "",
                      }))
                    : [];

                // Map language proficiencies
                const language_proficiencies = Array.isArray(
                    about.language_proficiencies,
                )
                    ? about.language_proficiencies.map((l) => ({
                          id: l?.id,
                          language: l?.language ?? "",
                          written: Boolean(l?.written),
                          w_prof: l?.w_prof ?? "",
                          spoken: Boolean(l?.spoken),
                          s_prof: l?.s_prof ?? "",
                      }))
                    : [];

                dispatch({
                    type: "REPLACE",
                    payload: {
                        // Personal Information
                        employee_id: about?.employee_id ?? "",
                        nickname: about?.nickname ?? "",
                        birth_date: about?.birth_date ?? "",
                        gender: about?.gender ?? "",
                        civil_status: about?.civil_status ?? "",
                        phone_number: about?.phone_number ?? "",
                        blood_type: about?.blood_type ?? "",

                        // Emergency Contact
                        emergency_contact_name:
                            about?.emergency_contact_name ?? "",
                        relationship_to_employee:
                            about?.relationship_to_employee ?? "",
                        emergency_contact_number:
                            about?.emergency_contact_number ?? "",

                        // Citizenship & Birth Place
                        citizenship: about?.citizenship ?? "",
                        birth_place: about?.birth_place ?? "",

                        // Current Address
                        current_address_street:
                            about?.current_address_street ?? "",
                        current_address_city: about?.current_address_city ?? "",
                        current_address_region:
                            about?.current_address_region ?? "",
                        current_address_zip_code:
                            about?.current_address_zip_code ?? "",

                        // Permanent Address
                        permanent_address_street:
                            about?.permanent_address_street ?? "",
                        permanent_address_city:
                            about?.permanent_address_city ?? "",
                        permanent_address_region:
                            about?.permanent_address_region ?? "",
                        permanent_address_zip_code:
                            about?.permanent_address_zip_code ?? "",

                        // Arrays
                        interests,
                        skills,
                        educational_backgrounds,
                        licenses_certifications,
                        megawide_work_experience,
                        previous_work_experiences,
                        technical_proficiencies,
                        language_proficiencies,
                    },
                });
            } catch (e) {
                console.error("Failed loading About data:", e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [profileId]);

    const educationLevelOptions = [
        "Elementary School",
        "Junior High School",
        "Senior High School",
        "Vocational/Technical",
        "Associate Degree",
        "Bachelor's Degree",
        "Post-Graduate Certificate/Diploma",
        "Master's Degree",
        "Doctorate/PhD",
        "Professional Degree (MD, JD, etc.)",
    ];
    const proficiencyOptions = [
        "Beginner",
        "Intermediate",
        "Advanced",
        "Expert",
    ];
    const langLevelOptions = ["Beginner", "Intermediate", "Advanced", "Native"];

    async function handleSave() {
        // Build payload matching the new structure
        const payload = {
            org_structure_id: Number(profileId),

            // Personal Information
            employee_id: form.employee_id || "",
            nickname: form.nickname || "",
            birth_date: form.birth_date || "",
            gender: form.gender || "",
            civil_status: form.civil_status || "",
            phone_number: form.phone_number || "",
            blood_type: form.blood_type || "",

            // Emergency Contact
            emergency_contact_name: form.emergency_contact_name || "",
            relationship_to_employee: form.relationship_to_employee || "",
            emergency_contact_number: form.emergency_contact_number || "",

            // Citizenship & Birth Place
            citizenship: form.citizenship || "",
            birth_place: form.birth_place || "",

            // Current Address
            current_address_street: form.current_address_street || "",
            current_address_city: form.current_address_city || "",
            current_address_region: form.current_address_region || "",
            current_address_zip_code: form.current_address_zip_code || "",

            // Permanent Address
            permanent_address_street: form.permanent_address_street || "",
            permanent_address_city: form.permanent_address_city || "",
            permanent_address_region: form.permanent_address_region || "",
            permanent_address_zip_code: form.permanent_address_zip_code || "",

            // Interests
            interests: (form.interests || []).map((i) => ({
                ...(i.id ? { id: i.id } : {}),
                interest: i.interest || "",
            })),

            // Skills
            skills: (form.skills || []).map((s) => ({
                ...(s.id ? { id: s.id } : {}),
                skill: s.skill || "",
            })),

            // Educational Backgrounds
            educational_backgrounds: (form.educational_backgrounds || []).map(
                (e) => ({
                    ...(e.id ? { id: e.id } : {}),
                    education_level: e.education_level || "",
                    school_attended: e.school_attended || "",
                    degree_program_course: e.degree_program_course || "",
                    academic_achievements: e.academic_achievements || "",
                    year_started: e.year_started || "",
                    year_ended: e.year_ended || "",
                    is_current: Boolean(e.is_current),
                }),
            ),

            // Licenses & Certifications
            licenses_certifications: (form.licenses_certifications || []).map(
                (l) => ({
                    ...(l.id ? { id: l.id } : {}),
                    license_certification_name:
                        l.license_certification_name || "",
                    issuing_organization: l.issuing_organization || "",
                    license_certification_number:
                        l.license_certification_number || "",
                    date_issued: l.date_issued || "",
                    date_of_expiration: l.non_expiring
                        ? null
                        : l.date_of_expiration || "",
                    non_expiring: Boolean(l.non_expiring),
                }),
            ),

            // Megawide Work Experience
            megawide_work_experience: {
                job_title: form.megawide_work_experience.job_title || "",
                department: form.megawide_work_experience.department || "",
                unit: form.megawide_work_experience.unit || "",
                job_level: form.megawide_work_experience.job_level || "",
                employment_status:
                    form.megawide_work_experience.employment_status || "",
                current_role_start_date:
                    form.megawide_work_experience.current_role_start_date || "",
                current_role_end_date: form.megawide_work_experience.is_current
                    ? null
                    : form.megawide_work_experience.current_role_end_date || "",
                is_current: Boolean(form.megawide_work_experience.is_current),
                functions: form.megawide_work_experience.functions || [],
                previous_assignments: (
                    form.megawide_work_experience.previous_assignments || []
                ).map((a) => ({
                    ...(a.id ? { id: a.id } : {}),
                    sbu: a.sbu || "",
                    worked_in_megawide: true,
                    previous_department: a.previous_department || "",
                    previous_job_title: a.previous_job_title || "",
                    previous_role_start_date: a.previous_role_start_date || "",
                    end_of_assignment: a.end_of_assignment || "",
                })),
            },

            // Previous Work Experiences
            previous_work_experiences: (
                form.previous_work_experiences || []
            ).map((w) => ({
                ...(w.id ? { id: w.id } : {}),
                company: w.company || "",
                job_title: w.job_title || "",
                job_level: w.job_level || "",
                start_date: w.start_date || "",
                end_date: w.end_date || "",
            })),

            // Technical Proficiencies
            technical_proficiencies: (form.technical_proficiencies || []).map(
                (t) => ({
                    ...(t.id ? { id: t.id } : {}),
                    skills: t.skills || "",
                    proficiency: t.proficiency || "",
                }),
            ),

            // Language Proficiencies
            language_proficiencies: (form.language_proficiencies || []).map(
                (l) => ({
                    ...(l.id ? { id: l.id } : {}),
                    language: l.language || "",
                    written: Boolean(l.written),
                    w_prof: l.written ? l.w_prof || "" : null,
                    spoken: Boolean(l.spoken),
                    s_prof: l.spoken ? l.s_prof || "" : null,
                }),
            ),
        };

        setSaving(true);
        try {
            await addAbout(payload);
            if (onSaved) onSaved();
            setShowSuccessModal(true);
        } catch (e) {
            console.error("Failed to save About:", e);
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="text-gray-500">Loading...</div>
            </div>
        );
    }

    // Determine if permanent address is fully filled
    const permanentComplete = Boolean(
        form.permanent_address_street &&
            form.permanent_address_city &&
            form.permanent_address_region &&
            form.permanent_address_zip_code,
    );

    const handleCopyPermanentToCurrent = () => {
        if (!permanentComplete) return;
        dispatch({
            type: "APPLY_UPDATER",
            updater: (p) => ({
                ...p,
                current_address_street: p.permanent_address_street,
                current_address_city: p.permanent_address_city,
                current_address_region: p.permanent_address_region,
                current_address_zip_code: p.permanent_address_zip_code,
            }),
        });
    };

    return (
        <>
            {/* Success Modal */}
            <CustomModal
                isOpen={showSuccessModal}
                onClose={() => {
                    setShowSuccessModal(false);
                    navigate(-1);
                }}
                title="About Details Saved"
            >
                <div className="space-y-4">
                    <p className="text-gray-700">
                        Your "About" details have been saved successfully.
                    </p>
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => {
                                setShowSuccessModal(false);
                                navigate(-1);
                            }}
                            className="px-5 py-2 bg-[#ee3124] text-white rounded-md hover:bg-red-600"
                        >
                            Go to My Profile
                        </button>
                    </div>
                </div>
            </CustomModal>

            {/* Personal Information Section */}
            <div className="bg-white border border-gray-200 shadow-xl rounded-lg p-4 mb-6">
                <SectionTitle>Personal Information</SectionTitle>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Employee ID
                        </label>
                        <input
                            type="text"
                            value={form.employee_id}
                            onChange={(e) =>
                                updateField("employee_id", e.target.value)
                            }
                            className="mt-2 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-3 py-2 shadow-sm sm:text-sm"
                            placeholder="e.g., 00123456"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Nickname
                        </label>
                        <input
                            type="text"
                            value={form.nickname}
                            onChange={(e) =>
                                updateField("nickname", e.target.value)
                            }
                            className="mt-2 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-3 py-2 shadow-sm sm:text-sm"
                            placeholder="e.g., John"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Birth Date
                        </label>
                        <input
                            type="date"
                            value={form.birth_date}
                            onChange={(e) =>
                                updateField("birth_date", e.target.value)
                            }
                            className="mt-2 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-3 py-2 shadow-sm sm:text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Gender
                        </label>
                        <select
                            value={form.gender}
                            onChange={(e) =>
                                updateField("gender", e.target.value)
                            }
                            className="mt-2 w-full rounded-md bg-white border border-gray-300 text-gray-900 focus:border-[#ee3124] focus:ring-[#ee3124] px-3 py-2 shadow-sm sm:text-sm"
                        >
                            <option value="">Select gender...</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Civil Status
                        </label>
                        <select
                            value={form.civil_status}
                            onChange={(e) =>
                                updateField("civil_status", e.target.value)
                            }
                            className="mt-2 w-full rounded-md bg-white border border-gray-300 text-gray-900 focus:border-[#ee3124] focus:ring-[#ee3124] px-3 py-2 shadow-sm sm:text-sm"
                        >
                            <option value="">Select status...</option>
                            <option value="Single">Single</option>
                            <option value="Married">Married</option>
                            <option value="Widowed">Widowed</option>
                            <option value="Divorced">Divorced</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Phone Number
                        </label>
                        <input
                            type="text"
                            value={form.phone_number}
                            onChange={(e) =>
                                updateField("phone_number", e.target.value)
                            }
                            className="mt-2 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-3 py-2 shadow-sm sm:text-sm"
                            placeholder="e.g., +63 917 123 4567"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Blood Type
                        </label>
                        <input
                            type="text"
                            value={form.blood_type}
                            onChange={(e) =>
                                updateField("blood_type", e.target.value)
                            }
                            className="mt-2 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-3 py-2 shadow-sm sm:text-sm"
                            placeholder="e.g., O+"
                        />
                    </div>
                </div>

                {/* Emergency Contact */}
                <div className="mt-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">
                        Emergency Contact
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Contact Name
                            </label>
                            <input
                                type="text"
                                value={form.emergency_contact_name}
                                onChange={(e) =>
                                    updateField(
                                        "emergency_contact_name",
                                        e.target.value,
                                    )
                                }
                                className="mt-2 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-3 py-2 shadow-sm sm:text-sm"
                                placeholder="e.g., John Doe"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Relationship
                            </label>
                            <input
                                type="text"
                                value={form.relationship_to_employee}
                                onChange={(e) =>
                                    updateField(
                                        "relationship_to_employee",
                                        e.target.value,
                                    )
                                }
                                className="mt-2 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-3 py-2 shadow-sm sm:text-sm"
                                placeholder="e.g., Mother"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Contact Number
                            </label>
                            <input
                                type="text"
                                value={form.emergency_contact_number}
                                onChange={(e) =>
                                    updateField(
                                        "emergency_contact_number",
                                        e.target.value,
                                    )
                                }
                                className="mt-2 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-3 py-2 shadow-sm sm:text-sm"
                                placeholder="e.g., +63 918 765 4321"
                            />
                        </div>
                    </div>
                </div>

                {/* Citizenship & Birth Place */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Citizenship
                        </label>
                        <input
                            type="text"
                            value={form.citizenship}
                            onChange={(e) =>
                                updateField("citizenship", e.target.value)
                            }
                            className="mt-2 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-3 py-2 shadow-sm sm:text-sm"
                            placeholder="e.g., Filipino"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Birth Place
                        </label>
                        <input
                            type="text"
                            value={form.birth_place}
                            onChange={(e) =>
                                updateField("birth_place", e.target.value)
                            }
                            className="mt-2 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-3 py-2 shadow-sm sm:text-sm"
                            placeholder="e.g., Manila, Philippines"
                        />
                    </div>
                </div>

                {/* Permanent Address (must precede current) */}
                <div className="mt-8">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">
                        Permanent Address
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="md:col-span-2">
                            <label className="block text-xs font-medium text-gray-700">
                                Street
                            </label>
                            <input
                                type="text"
                                value={form.permanent_address_street}
                                onChange={(e) =>
                                    updateField(
                                        "permanent_address_street",
                                        e.target.value,
                                    )
                                }
                                className="mt-1 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-3 py-2 shadow-sm sm:text-sm"
                                placeholder="e.g., 456 Luna Avenue, Barangay Poblacion"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700">
                                City
                            </label>
                            <input
                                type="text"
                                value={form.permanent_address_city}
                                onChange={(e) =>
                                    updateField(
                                        "permanent_address_city",
                                        e.target.value,
                                    )
                                }
                                className="mt-1 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-3 py-2 shadow-sm sm:text-sm"
                                placeholder="e.g., Quezon City"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700">
                                Region
                            </label>
                            <input
                                type="text"
                                value={form.permanent_address_region}
                                onChange={(e) =>
                                    updateField(
                                        "permanent_address_region",
                                        e.target.value,
                                    )
                                }
                                className="mt-1 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-3 py-2 shadow-sm sm:text-sm"
                                placeholder="e.g., NCR"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700">
                                Zip Code
                            </label>
                            <input
                                type="text"
                                value={form.permanent_address_zip_code}
                                onChange={(e) =>
                                    updateField(
                                        "permanent_address_zip_code",
                                        e.target.value,
                                    )
                                }
                                className="mt-1 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-3 py-2 shadow-sm sm:text-sm"
                                placeholder="e.g., 1100"
                            />
                        </div>
                    </div>
                    {permanentComplete && (
                        <p className="text-[11px] text-green-600 mt-2">
                            Permanent address complete. You can now edit or copy
                            into Current Address.
                        </p>
                    )}
                </div>

                {/* Current Address (disabled until permanent filled) */}
                <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-semibold text-gray-700">
                            Current Address
                        </h3>
                        <button
                            type="button"
                            onClick={handleCopyPermanentToCurrent}
                            disabled={!permanentComplete}
                            className={`px-2 py-1 rounded-md text-xs font-medium transition border ${
                                permanentComplete
                                    ? "bg-gray-600 text-white hover:bg-gray-700"
                                    : "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                            }`}
                        >
                            Copy Permanent
                        </button>
                    </div>
                    {!permanentComplete && (
                        <p className="text-xs text-red-600 mb-2">
                            Fill out the Permanent Address below first to enable
                            editing or copying.
                        </p>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="md:col-span-2">
                            <label className="block text-xs font-medium text-gray-700">
                                Street
                            </label>
                            <input
                                type="text"
                                value={form.current_address_street}
                                onChange={(e) =>
                                    updateField(
                                        "current_address_street",
                                        e.target.value,
                                    )
                                }
                                disabled={!permanentComplete}
                                className="mt-1 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-3 py-2 shadow-sm sm:text-sm"
                                placeholder="e.g., 123 Rizal Street, Barangay San Antonio"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700">
                                City
                            </label>
                            <input
                                type="text"
                                value={form.current_address_city}
                                onChange={(e) =>
                                    updateField(
                                        "current_address_city",
                                        e.target.value,
                                    )
                                }
                                disabled={!permanentComplete}
                                className="mt-1 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-3 py-2 shadow-sm sm:text-sm"
                                placeholder="e.g., Makati City"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700">
                                Region
                            </label>
                            <input
                                type="text"
                                value={form.current_address_region}
                                onChange={(e) =>
                                    updateField(
                                        "current_address_region",
                                        e.target.value,
                                    )
                                }
                                disabled={!permanentComplete}
                                className="mt-1 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-3 py-2 shadow-sm sm:text-sm"
                                placeholder="e.g., NCR"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700">
                                Zip Code
                            </label>
                            <input
                                type="text"
                                value={form.current_address_zip_code}
                                onChange={(e) =>
                                    updateField(
                                        "current_address_zip_code",
                                        e.target.value,
                                    )
                                }
                                disabled={!permanentComplete}
                                className="mt-1 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-3 py-2 shadow-sm sm:text-sm"
                                placeholder="e.g., 1200"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Interests & Skills Section (components) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <InterestsSection
                    values={form.interests}
                    onAdd={() => addRow("interests", { interest: "" })}
                    onUpdate={(idx, val) =>
                        updateRow("interests", idx, "interest", val)
                    }
                    onRemove={(idx) =>
                        confirmRemoveRow("interests", idx, "Interest")
                    }
                />
                <SkillsSection
                    values={form.skills}
                    onAdd={() => addRow("skills", { skill: "" })}
                    onUpdate={(idx, val) =>
                        updateRow("skills", idx, "skill", val)
                    }
                    onRemove={(idx) => confirmRemoveRow("skills", idx, "Skill")}
                />
            </div>

            {/* Educational Backgrounds (component) */}
            <div className="mb-6">
                <EducationSection
                    values={form.educational_backgrounds}
                    options={educationLevelOptions}
                    onAdd={() =>
                        addRow("educational_backgrounds", {
                            education_level: "",
                            school_attended: "",
                            degree_program_course: "",
                            academic_achievements: "",
                            year_started: "",
                            year_ended: "",
                            is_current: false,
                        })
                    }
                    onUpdateField={(idx, field, val) =>
                        updateRow("educational_backgrounds", idx, field, val)
                    }
                    onToggleCurrent={(idx, checked) =>
                        updateRow(
                            "educational_backgrounds",
                            idx,
                            "is_current",
                            checked,
                        )
                    }
                    onRemove={(idx) =>
                        confirmRemoveRow(
                            "educational_backgrounds",
                            idx,
                            "Education",
                        )
                    }
                />
            </div>

            {/* Licenses & Certifications */}
            <div className="bg-white border border-gray-200 shadow-xl rounded-lg p-4 mb-6">
                <SectionTitle>Licenses & Certifications</SectionTitle>
                <div className="mt-3">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">
                            Add your licenses and certifications
                        </span>
                        <button
                            type="button"
                            onClick={() =>
                                addRow("licenses_certifications", {
                                    license_certification_name: "",
                                    issuing_organization: "",
                                    license_certification_number: "",
                                    date_issued: "",
                                    date_of_expiration: "",
                                    non_expiring: false,
                                })
                            }
                            className="px-2.5 py-1 bg-gray-600 hover:bg-gray-700 text-white text-xs font-medium rounded-md"
                        >
                            + Add License/Cert
                        </button>
                    </div>

                    {form.licenses_certifications?.length ? (
                        <div className="space-y-4">
                            {form.licenses_certifications.map((lic, lIdx) => (
                                <div
                                    key={lIdx}
                                    className="border border-gray-200 rounded-md p-3"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700">
                                                License/Certification Name
                                            </label>
                                            <input
                                                type="text"
                                                value={
                                                    lic.license_certification_name
                                                }
                                                onChange={(ev) =>
                                                    updateRow(
                                                        "licenses_certifications",
                                                        lIdx,
                                                        "license_certification_name",
                                                        ev.target.value,
                                                    )
                                                }
                                                className="mt-1 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1.5 shadow-sm text-xs"
                                                placeholder="e.g., PMP"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700">
                                                Issuing Organization
                                            </label>
                                            <input
                                                type="text"
                                                value={lic.issuing_organization}
                                                onChange={(ev) =>
                                                    updateRow(
                                                        "licenses_certifications",
                                                        lIdx,
                                                        "issuing_organization",
                                                        ev.target.value,
                                                    )
                                                }
                                                className="mt-1 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1.5 shadow-sm text-xs"
                                                placeholder="e.g., Project Management Institute"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700">
                                                License/Certification Number
                                            </label>
                                            <input
                                                type="text"
                                                value={
                                                    lic.license_certification_number
                                                }
                                                onChange={(ev) =>
                                                    updateRow(
                                                        "licenses_certifications",
                                                        lIdx,
                                                        "license_certification_number",
                                                        ev.target.value,
                                                    )
                                                }
                                                className="mt-1 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1.5 shadow-sm text-xs"
                                                placeholder="e.g., PMP-123456"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700">
                                                Date Issued
                                            </label>
                                            <input
                                                type="date"
                                                value={lic.date_issued}
                                                onChange={(ev) =>
                                                    updateRow(
                                                        "licenses_certifications",
                                                        lIdx,
                                                        "date_issued",
                                                        ev.target.value,
                                                    )
                                                }
                                                className="mt-1 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1.5 shadow-sm text-xs"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700">
                                                Date of Expiration
                                            </label>
                                            <input
                                                type="date"
                                                value={lic.date_of_expiration}
                                                onChange={(ev) =>
                                                    updateRow(
                                                        "licenses_certifications",
                                                        lIdx,
                                                        "date_of_expiration",
                                                        ev.target.value,
                                                    )
                                                }
                                                className="mt-1 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1.5 shadow-sm text-xs"
                                                disabled={!!lic.non_expiring}
                                            />
                                        </div>
                                        <div className="flex items-center">
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={!!lic.non_expiring}
                                                    onChange={(ev) =>
                                                        updateRow(
                                                            "licenses_certifications",
                                                            lIdx,
                                                            "non_expiring",
                                                            ev.target.checked,
                                                        )
                                                    }
                                                    className="h-4 w-4 rounded border-gray-300 text-[#ee3124] focus:ring-[#ee3124]"
                                                />
                                                <span className="text-xs font-medium text-gray-700">
                                                    Non-Expiring
                                                </span>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="mt-3 text-right">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                confirmRemoveRow(
                                                    "licenses_certifications",
                                                    lIdx,
                                                    "License/Certification",
                                                )
                                            }
                                            className="text-red-600 hover:text-red-800 text-xs font-medium"
                                        >
                                            Remove License/Cert
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-gray-500 text-sm">
                            No licenses or certifications yet.
                        </div>
                    )}
                </div>
            </div>

            {/* Work Experience */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Megawide Work Experience */}
                <div className="bg-white border border-gray-200 shadow-xl rounded-lg p-4">
                    <SectionTitle>Megawide Work Experience</SectionTitle>
                    <div className="mt-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-700">
                                    Job Title
                                </label>
                                <input
                                    type="text"
                                    value={
                                        form.megawide_work_experience.job_title
                                    }
                                    onChange={(e) =>
                                        dispatch({
                                            type: "APPLY_UPDATER",
                                            updater: (p) => ({
                                                ...p,
                                                megawide_work_experience: {
                                                    ...p.megawide_work_experience,
                                                    job_title: e.target.value,
                                                },
                                            }),
                                        })
                                    }
                                    className="mt-1 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1.5 shadow-sm text-xs"
                                    placeholder="e.g., Management Associate"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700">
                                    Department
                                </label>
                                <input
                                    type="text"
                                    value={
                                        form.megawide_work_experience.department
                                    }
                                    onChange={(e) =>
                                        dispatch({
                                            type: "APPLY_UPDATER",
                                            updater: (p) => ({
                                                ...p,
                                                megawide_work_experience: {
                                                    ...p.megawide_work_experience,
                                                    department: e.target.value,
                                                },
                                            }),
                                        })
                                    }
                                    className="mt-1 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1.5 shadow-sm text-xs"
                                    placeholder="e.g., OCEO"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700">
                                    Unit
                                </label>
                                <input
                                    type="text"
                                    value={form.megawide_work_experience.unit}
                                    onChange={(e) =>
                                        dispatch({
                                            type: "APPLY_UPDATER",
                                            updater: (p) => ({
                                                ...p,
                                                megawide_work_experience: {
                                                    ...p.megawide_work_experience,
                                                    unit: e.target.value,
                                                },
                                            }),
                                        })
                                    }
                                    className="mt-1 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1.5 shadow-sm text-xs"
                                    placeholder="e.g., OCEO"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700">
                                    Job Level
                                </label>
                                <input
                                    type="text"
                                    value={
                                        form.megawide_work_experience.job_level
                                    }
                                    onChange={(e) =>
                                        dispatch({
                                            type: "APPLY_UPDATER",
                                            updater: (p) => ({
                                                ...p,
                                                megawide_work_experience: {
                                                    ...p.megawide_work_experience,
                                                    job_level: e.target.value,
                                                },
                                            }),
                                        })
                                    }
                                    className="mt-1 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1.5 shadow-sm text-xs"
                                    placeholder="e.g., Managerial"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700">
                                    Employment Status
                                </label>
                                <input
                                    type="text"
                                    value={
                                        form.megawide_work_experience
                                            .employment_status
                                    }
                                    onChange={(e) =>
                                        dispatch({
                                            type: "APPLY_UPDATER",
                                            updater: (p) => ({
                                                ...p,
                                                megawide_work_experience: {
                                                    ...p.megawide_work_experience,
                                                    employment_status:
                                                        e.target.value,
                                                },
                                            }),
                                        })
                                    }
                                    className="mt-1 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1.5 shadow-sm text-xs"
                                    placeholder="e.g., Regular"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700">
                                    Current Role Start Date
                                </label>
                                <input
                                    type="date"
                                    value={
                                        form.megawide_work_experience
                                            .current_role_start_date
                                    }
                                    onChange={(e) =>
                                        dispatch({
                                            type: "APPLY_UPDATER",
                                            updater: (p) => ({
                                                ...p,
                                                megawide_work_experience: {
                                                    ...p.megawide_work_experience,
                                                    current_role_start_date:
                                                        e.target.value,
                                                },
                                            }),
                                        })
                                    }
                                    className="mt-1 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1.5 shadow-sm text-xs"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700">
                                    Current Role End Date
                                </label>
                                <input
                                    type="date"
                                    value={
                                        form.megawide_work_experience
                                            .current_role_end_date
                                    }
                                    onChange={(e) =>
                                        dispatch({
                                            type: "APPLY_UPDATER",
                                            updater: (p) => ({
                                                ...p,
                                                megawide_work_experience: {
                                                    ...p.megawide_work_experience,
                                                    current_role_end_date:
                                                        e.target.value,
                                                },
                                            }),
                                        })
                                    }
                                    className="mt-1 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1.5 shadow-sm text-xs"
                                    disabled={
                                        !!form.megawide_work_experience
                                            .is_current
                                    }
                                />
                            </div>
                            <div className="flex items-center">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={
                                            !!form.megawide_work_experience
                                                .is_current
                                        }
                                        onChange={(e) =>
                                            dispatch({
                                                type: "APPLY_UPDATER",
                                                updater: (p) => ({
                                                    ...p,
                                                    megawide_work_experience: {
                                                        ...p.megawide_work_experience,
                                                        is_current:
                                                            e.target.checked,
                                                    },
                                                }),
                                            })
                                        }
                                        className="h-4 w-4 rounded border-gray-300 text-[#ee3124] focus:ring-[#ee3124]"
                                    />
                                    <span className="text-xs font-medium text-gray-700">
                                        Currently Working
                                    </span>
                                </label>
                            </div>
                        </div>

                        {/* Subfunction Positions Multi-Select */}
                        <div className="mt-4">
                            <label className="block text-xs font-medium text-gray-700 mb-2">
                                Subfunction Positions
                            </label>
                            <div className="border border-gray-300 rounded-md p-3 bg-gray-50 max-h-48 overflow-y-auto">
                                {!department ? (
                                    <p className="text-xs text-gray-500 italic">
                                        Loading department information...
                                    </p>
                                ) : functionsList.length > 0 ? (
                                    functionsList.map((subfunc) => (
                                        <label
                                            key={subfunc.id}
                                            className="flex items-center gap-2 mb-2 hover:bg-gray-100 p-1 rounded"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={form.megawide_work_experience.functions.some(
                                                    (f) => f.id === subfunc.id,
                                                )}
                                                onChange={(e) => {
                                                    dispatch({
                                                        type: "APPLY_UPDATER",
                                                        updater: (p) => ({
                                                            ...p,
                                                            megawide_work_experience:
                                                                {
                                                                    ...p.megawide_work_experience,
                                                                    functions: e
                                                                        .target
                                                                        .checked
                                                                        ? [
                                                                              ...p
                                                                                  .megawide_work_experience
                                                                                  .functions,
                                                                              {
                                                                                  id: subfunc.id,
                                                                              },
                                                                          ]
                                                                        : p.megawide_work_experience.functions.filter(
                                                                              (
                                                                                  f,
                                                                              ) =>
                                                                                  f.id !==
                                                                                  subfunc.id,
                                                                          ),
                                                                },
                                                        }),
                                                    });
                                                }}
                                                className="h-4 w-4 rounded border-gray-300 text-[#ee3124] focus:ring-[#ee3124]"
                                            />
                                            <span className="text-xs text-gray-700">
                                                {subfunc.subfunction_title ||
                                                    subfunc.name}
                                            </span>
                                        </label>
                                    ))
                                ) : (
                                    <p className="text-xs text-gray-500 italic">
                                        No subfunction positions available for
                                        this department.
                                    </p>
                                )}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                Selected:{" "}
                                {form.megawide_work_experience.functions.length}{" "}
                                subfunction position(s)
                            </p>
                        </div>

                        {/* Previous Assignments within Megawide */}
                        <div className="mt-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-semibold text-gray-700">
                                    Previous Assignments within Megawide
                                </span>
                                <button
                                    type="button"
                                    onClick={() =>
                                        dispatch({
                                            type: "APPLY_UPDATER",
                                            updater: (p) => ({
                                                ...p,
                                                megawide_work_experience: {
                                                    ...p.megawide_work_experience,
                                                    previous_assignments: [
                                                        ...(p
                                                            .megawide_work_experience
                                                            .previous_assignments ||
                                                            []),
                                                        {
                                                            sbu: "",
                                                            worked_in_megawide: true,
                                                            previous_department:
                                                                "",
                                                            previous_job_title:
                                                                "",
                                                            previous_role_start_date:
                                                                "",
                                                            end_of_assignment:
                                                                "",
                                                        },
                                                    ],
                                                },
                                            }),
                                        })
                                    }
                                    className="px-2 py-1 bg-gray-600 hover:bg-gray-700 text-white text-[11px] font-medium rounded-md"
                                >
                                    + Add Assignment
                                </button>
                            </div>

                            {form.megawide_work_experience.previous_assignments
                                ?.length ? (
                                <div className="space-y-3">
                                    {form.megawide_work_experience.previous_assignments.map(
                                        (assign, aIdx) => (
                                            <div
                                                key={aIdx}
                                                className="border border-gray-200 rounded-md p-2"
                                            >
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                    <div>
                                                        <label className="block text-[11px] font-medium text-gray-700">
                                                            SBU
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={assign.sbu}
                                                            onChange={(e) =>
                                                                dispatch({
                                                                    type: "APPLY_UPDATER",
                                                                    updater: (
                                                                        p,
                                                                    ) => ({
                                                                        ...p,
                                                                        megawide_work_experience:
                                                                            {
                                                                                ...p.megawide_work_experience,
                                                                                previous_assignments:
                                                                                    p.megawide_work_experience.previous_assignments.map(
                                                                                        (
                                                                                            a,
                                                                                            i,
                                                                                        ) =>
                                                                                            i ===
                                                                                            aIdx
                                                                                                ? {
                                                                                                      ...a,
                                                                                                      sbu: e
                                                                                                          .target
                                                                                                          .value,
                                                                                                  }
                                                                                                : a,
                                                                                    ),
                                                                            },
                                                                    }),
                                                                })
                                                            }
                                                            className="mt-1 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1 shadow-sm text-[11px]"
                                                            placeholder="e.g., CORP"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[11px] font-medium text-gray-700">
                                                            Previous Department
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={
                                                                assign.previous_department
                                                            }
                                                            onChange={(e) =>
                                                                dispatch({
                                                                    type: "APPLY_UPDATER",
                                                                    updater: (
                                                                        p,
                                                                    ) => ({
                                                                        ...p,
                                                                        megawide_work_experience:
                                                                            {
                                                                                ...p.megawide_work_experience,
                                                                                previous_assignments:
                                                                                    p.megawide_work_experience.previous_assignments.map(
                                                                                        (
                                                                                            a,
                                                                                            i,
                                                                                        ) =>
                                                                                            i ===
                                                                                            aIdx
                                                                                                ? {
                                                                                                      ...a,
                                                                                                      previous_department:
                                                                                                          e
                                                                                                              .target
                                                                                                              .value,
                                                                                                  }
                                                                                                : a,
                                                                                    ),
                                                                            },
                                                                    }),
                                                                })
                                                            }
                                                            className="mt-1 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1 shadow-sm text-[11px]"
                                                            placeholder="e.g., HRD"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[11px] font-medium text-gray-700">
                                                            Previous Job Title
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={
                                                                assign.previous_job_title
                                                            }
                                                            onChange={(e) =>
                                                                dispatch({
                                                                    type: "APPLY_UPDATER",
                                                                    updater: (
                                                                        p,
                                                                    ) => ({
                                                                        ...p,
                                                                        megawide_work_experience:
                                                                            {
                                                                                ...p.megawide_work_experience,
                                                                                previous_assignments:
                                                                                    p.megawide_work_experience.previous_assignments.map(
                                                                                        (
                                                                                            a,
                                                                                            i,
                                                                                        ) =>
                                                                                            i ===
                                                                                            aIdx
                                                                                                ? {
                                                                                                      ...a,
                                                                                                      previous_job_title:
                                                                                                          e
                                                                                                              .target
                                                                                                              .value,
                                                                                                  }
                                                                                                : a,
                                                                                    ),
                                                                            },
                                                                    }),
                                                                })
                                                            }
                                                            className="mt-1 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1 shadow-sm text-[11px]"
                                                            placeholder="e.g., Intern"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[11px] font-medium text-gray-700">
                                                            Start Date
                                                        </label>
                                                        <input
                                                            type="date"
                                                            value={
                                                                assign.previous_role_start_date
                                                            }
                                                            onChange={(e) =>
                                                                dispatch({
                                                                    type: "APPLY_UPDATER",
                                                                    updater: (
                                                                        p,
                                                                    ) => ({
                                                                        ...p,
                                                                        megawide_work_experience:
                                                                            {
                                                                                ...p.megawide_work_experience,
                                                                                previous_assignments:
                                                                                    p.megawide_work_experience.previous_assignments.map(
                                                                                        (
                                                                                            a,
                                                                                            i,
                                                                                        ) =>
                                                                                            i ===
                                                                                            aIdx
                                                                                                ? {
                                                                                                      ...a,
                                                                                                      previous_role_start_date:
                                                                                                          e
                                                                                                              .target
                                                                                                              .value,
                                                                                                  }
                                                                                                : a,
                                                                                    ),
                                                                            },
                                                                    }),
                                                                })
                                                            }
                                                            className="mt-1 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1 shadow-sm text-[11px]"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[11px] font-medium text-gray-700">
                                                            End Date
                                                        </label>
                                                        <input
                                                            type="date"
                                                            value={
                                                                assign.end_of_assignment
                                                            }
                                                            onChange={(e) =>
                                                                dispatch({
                                                                    type: "APPLY_UPDATER",
                                                                    updater: (
                                                                        p,
                                                                    ) => ({
                                                                        ...p,
                                                                        megawide_work_experience:
                                                                            {
                                                                                ...p.megawide_work_experience,
                                                                                previous_assignments:
                                                                                    p.megawide_work_experience.previous_assignments.map(
                                                                                        (
                                                                                            a,
                                                                                            i,
                                                                                        ) =>
                                                                                            i ===
                                                                                            aIdx
                                                                                                ? {
                                                                                                      ...a,
                                                                                                      end_of_assignment:
                                                                                                          e
                                                                                                              .target
                                                                                                              .value,
                                                                                                  }
                                                                                                : a,
                                                                                    ),
                                                                            },
                                                                    }),
                                                                })
                                                            }
                                                            className="mt-1 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1 shadow-sm text-[11px]"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="mt-2 text-right">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            confirmRemoveAssignment(
                                                                aIdx,
                                                            )
                                                        }
                                                        className="text-red-600 hover:text-red-800 text-[11px] font-medium"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        ),
                                    )}
                                </div>
                            ) : (
                                <div className="text-gray-500 text-xs">
                                    No previous assignments yet.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Previous Work Experience - Outside Megawide */}
                <div className="bg-white border border-gray-200 shadow-xl rounded-lg p-4">
                    <SectionTitle>Previous Work Experience</SectionTitle>
                    <div className="mt-3">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">
                                Add your prior roles
                            </span>
                            <button
                                type="button"
                                onClick={() =>
                                    addRow("previous_work_experiences", {
                                        company: "",
                                        job_title: "",
                                        job_level: "",
                                        start_date: "",
                                        end_date: "",
                                    })
                                }
                                className="px-2.5 py-1 bg-gray-600 hover:bg-gray-700 text-white text-xs font-medium rounded-md"
                            >
                                + Add Previous Work
                            </button>
                        </div>

                        {form.previous_work_experiences?.length ? (
                            <div className="space-y-3">
                                {form.previous_work_experiences.map(
                                    (w, wIdx) => (
                                        <div
                                            key={wIdx}
                                            className="border border-gray-200 rounded-md p-3"
                                        >
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700">
                                                        Company
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={w.company}
                                                        onChange={(ev) =>
                                                            updateRow(
                                                                "previous_work_experiences",
                                                                wIdx,
                                                                "company",
                                                                ev.target.value,
                                                            )
                                                        }
                                                        className="mt-1 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1.5 shadow-sm text-xs"
                                                        placeholder="e.g., ABC Corporation"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700">
                                                        Job Title
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={w.job_title}
                                                        onChange={(ev) =>
                                                            updateRow(
                                                                "previous_work_experiences",
                                                                wIdx,
                                                                "job_title",
                                                                ev.target.value,
                                                            )
                                                        }
                                                        className="mt-1 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1.5 shadow-sm text-xs"
                                                        placeholder="e.g., Software Engineer"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700">
                                                        Job Level
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={w.job_level}
                                                        onChange={(ev) =>
                                                            updateRow(
                                                                "previous_work_experiences",
                                                                wIdx,
                                                                "job_level",
                                                                ev.target.value,
                                                            )
                                                        }
                                                        className="mt-1 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1.5 shadow-sm text-xs"
                                                        placeholder="e.g., Senior, Manager, etc."
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700">
                                                        Start Date
                                                    </label>
                                                    <input
                                                        type="date"
                                                        value={w.start_date}
                                                        onChange={(ev) =>
                                                            updateRow(
                                                                "previous_work_experiences",
                                                                wIdx,
                                                                "start_date",
                                                                ev.target.value,
                                                            )
                                                        }
                                                        className="mt-1 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1.5 shadow-sm text-xs"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700">
                                                        End Date
                                                    </label>
                                                    <input
                                                        type="date"
                                                        value={w.end_date}
                                                        onChange={(ev) =>
                                                            updateRow(
                                                                "previous_work_experiences",
                                                                wIdx,
                                                                "end_date",
                                                                ev.target.value,
                                                            )
                                                        }
                                                        className="mt-1 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1.5 shadow-sm text-xs"
                                                    />
                                                </div>
                                            </div>
                                            <div className="mt-2 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        confirmRemoveRow(
                                                            "previous_work_experiences",
                                                            wIdx,
                                                            "Previous Work",
                                                        )
                                                    }
                                                    className="text-red-600 hover:text-red-800 text-xs font-medium"
                                                >
                                                    Remove Previous Work
                                                </button>
                                            </div>
                                        </div>
                                    ),
                                )}
                            </div>
                        ) : (
                            <div className="text-gray-500 text-sm">
                                No previous work experience yet.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Proficiencies */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Technical Proficiency */}
                <div className="bg-white border border-gray-200 shadow-xl rounded-lg p-4">
                    <SectionTitle>Technical Proficiency</SectionTitle>
                    <div className="mt-3">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">
                                List your technical skills
                            </span>
                            <button
                                type="button"
                                onClick={() =>
                                    addRow("technical_proficiencies", {
                                        skills: "",
                                        proficiency: "",
                                    })
                                }
                                className="px-2.5 py-1 bg-gray-600 hover:bg-gray-700 text-white text-xs font-medium rounded-md"
                            >
                                + Add Skill
                            </button>
                        </div>
                        {form.technical_proficiencies?.length ? (
                            <div className="space-y-2">
                                {form.technical_proficiencies.map((t, tIdx) => (
                                    <div
                                        key={tIdx}
                                        className="grid grid-cols-1 md:grid-cols-2 gap-2 items-center"
                                    >
                                        <input
                                            type="text"
                                            value={t.skills}
                                            onChange={(ev) =>
                                                updateRow(
                                                    "technical_proficiencies",
                                                    tIdx,
                                                    "skills",
                                                    ev.target.value,
                                                )
                                            }
                                            className="w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1.5 shadow-sm text-xs"
                                            placeholder="e.g., JavaScript, React, Node.js"
                                        />
                                        <select
                                            value={t.proficiency}
                                            onChange={(ev) =>
                                                updateRow(
                                                    "technical_proficiencies",
                                                    tIdx,
                                                    "proficiency",
                                                    ev.target.value,
                                                )
                                            }
                                            className="w-full rounded-md bg-white border border-gray-300 text-gray-900 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1.5 shadow-sm text-xs"
                                        >
                                            <option value="">
                                                Select proficiency…
                                            </option>
                                            {proficiencyOptions.map((opt) => (
                                                <option key={opt} value={opt}>
                                                    {opt}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="md:col-span-2 text-right">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    confirmRemoveRow(
                                                        "technical_proficiencies",
                                                        tIdx,
                                                        "Technical Skill",
                                                    )
                                                }
                                                className="text-red-600 hover:text-red-800 text-xs font-medium"
                                            >
                                                Remove Skill
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-gray-500 text-sm">
                                No technical skills yet.
                            </div>
                        )}
                    </div>
                </div>

                {/* Language Proficiency */}
                <div className="bg-white border border-gray-200 shadow-xl rounded-lg p-4">
                    <SectionTitle>Language Proficiency</SectionTitle>
                    <div className="mt-3">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">
                                Add languages you know
                            </span>
                            <button
                                type="button"
                                onClick={() =>
                                    addRow("language_proficiencies", {
                                        language: "",
                                        written: false,
                                        w_prof: "",
                                        spoken: false,
                                        s_prof: "",
                                    })
                                }
                                className="px-2.5 py-1 bg-gray-600 hover:bg-gray-700 text-white text-xs font-medium rounded-md"
                            >
                                + Add Language
                            </button>
                        </div>
                        {form.language_proficiencies?.length ? (
                            <div className="space-y-3">
                                {form.language_proficiencies.map((l, lIdx) => (
                                    <div
                                        key={lIdx}
                                        className="border border-gray-200 rounded-md p-3"
                                    >
                                        {/* Row 1: Language label and input inline */}
                                        <div className="flex items-center gap-3">
                                            <label className="text-xs font-medium text-gray-700 w-24">
                                                Language
                                            </label>
                                            <input
                                                type="text"
                                                value={l.language}
                                                onChange={(ev) =>
                                                    updateRow(
                                                        "language_proficiencies",
                                                        lIdx,
                                                        "language",
                                                        ev.target.value,
                                                    )
                                                }
                                                className="flex-1 rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1.5 shadow-sm text-xs"
                                                placeholder="e.g., English"
                                            />
                                        </div>

                                        {/* Row 2: Written and Spoken each with checkbox + dropdown, inline in one row */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                                            <div className="flex items-center gap-3">
                                                <label className="text-xs font-medium text-gray-700 flex items-center gap-2 m-0">
                                                    <input
                                                        type="checkbox"
                                                        checked={!!l.written}
                                                        onChange={(ev) =>
                                                            updateRow(
                                                                "language_proficiencies",
                                                                lIdx,
                                                                "written",
                                                                ev.target
                                                                    .checked,
                                                            )
                                                        }
                                                        className="h-4 w-4 rounded border-gray-300 text-[#ee3124] focus:ring-[#ee3124]"
                                                    />
                                                    Written
                                                </label>
                                                <select
                                                    value={l.w_prof}
                                                    onChange={(ev) =>
                                                        updateRow(
                                                            "language_proficiencies",
                                                            lIdx,
                                                            "w_prof",
                                                            ev.target.value,
                                                        )
                                                    }
                                                    className="rounded-md bg-white border border-gray-300 text-gray-900 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1.5 shadow-sm text-xs w-full"
                                                    disabled={!l.written}
                                                >
                                                    <option value="">
                                                        Proficiency…
                                                    </option>
                                                    {langLevelOptions.map(
                                                        (opt) => (
                                                            <option
                                                                key={opt}
                                                                value={opt}
                                                            >
                                                                {opt}
                                                            </option>
                                                        ),
                                                    )}
                                                </select>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <label className="text-xs font-medium text-gray-700 flex items-center gap-2 m-0">
                                                    <input
                                                        type="checkbox"
                                                        checked={!!l.spoken}
                                                        onChange={(ev) =>
                                                            updateRow(
                                                                "language_proficiencies",
                                                                lIdx,
                                                                "spoken",
                                                                ev.target
                                                                    .checked,
                                                            )
                                                        }
                                                        className="h-4 w-4 rounded border-gray-300 text-[#ee3124] focus:ring-[#ee3124]"
                                                    />
                                                    Spoken
                                                </label>
                                                <select
                                                    value={l.s_prof}
                                                    onChange={(ev) =>
                                                        updateRow(
                                                            "language_proficiencies",
                                                            lIdx,
                                                            "s_prof",
                                                            ev.target.value,
                                                        )
                                                    }
                                                    className="rounded-md bg-white border border-gray-300 text-gray-900 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1.5 shadow-sm text-xs w-full"
                                                    disabled={!l.spoken}
                                                >
                                                    <option value="">
                                                        Proficiency…
                                                    </option>
                                                    {langLevelOptions.map(
                                                        (opt) => (
                                                            <option
                                                                key={opt}
                                                                value={opt}
                                                            >
                                                                {opt}
                                                            </option>
                                                        ),
                                                    )}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="mt-2 text-right">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    confirmRemoveRow(
                                                        "language_proficiencies",
                                                        lIdx,
                                                        "Language",
                                                    )
                                                }
                                                className="text-red-600 hover:text-red-800 text-xs font-medium"
                                            >
                                                Remove Language
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-gray-500 text-sm">
                                No language proficiencies yet.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Confirmation Dialog */}
            <ConfirmDialog
                open={confirmState.open}
                title={confirmState.title}
                message={confirmState.message}
                confirmLabel={confirmState.confirmLabel}
                onCancel={() => setConfirmState((s) => ({ ...s, open: false }))}
                onConfirm={confirmState.onConfirm}
            />

            {/* Actions */}
            <FormActionBar
                onPrev={onPrev}
                onNext={onNext}
                prevDisabled={prevDisabled}
                nextDisabled={nextDisabled}
                onSave={handleSave}
                saving={saving}
                saveLabel="Save About"
            />
        </>
    );
}
