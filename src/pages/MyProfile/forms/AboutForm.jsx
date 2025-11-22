import React, { useEffect, useState, useReducer } from "react";
import ConfirmDialog from "../../../components/ProfileFormComponents/ConfirmDialog";
import CustomModal from "../../../components/CustomModal";
import InterestsSection from "../../../components/ProfileFormComponents/AboutForm/InterestsSection";
import SkillsSection from "../../../components/ProfileFormComponents/AboutForm/SkillsSection";
import EducationalBackground from "../../../components/ProfileFormComponents/AboutForm/EducationalBackground";
import PersonalInformation from "../../../components/ProfileFormComponents/AboutForm/PersonalInformation";
import LicensesCertifications from "../../../components/ProfileFormComponents/AboutForm/LicensesCertifications";
import WorkExperience from "../../../components/ProfileFormComponents/AboutForm/WorkExperience";
import TechnicalProficiency from "../../../components/ProfileFormComponents/AboutForm/TechnicalProficiency";
import LanguageProficiency from "../../../components/ProfileFormComponents/AboutForm/LanguageProficiency";
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
    const addRow = (key, template) =>
        dispatch({
            type: "APPLY_UPDATER",
            updater: (p) => {
                const existing = p[key] || [];
                // Prevent duplicate entries for certain lists by exact unique field
                if (template && typeof template === "object") {
                    if (key === "technical_proficiencies" && typeof template.skills === "string") {
                        if (existing.some((r) => r.skills === template.skills)) {
                            return { ...p, [key]: existing };
                        }
                    }
                    if (key === "language_proficiencies" && typeof template.language === "string") {
                        if (existing.some((r) => r.language === template.language)) {
                            return { ...p, [key]: existing };
                        }
                    }
                }
                return { ...p, [key]: [...existing, template] };
            },
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

                // Map language proficiencies (DB no longer stores boolean flags for written/spoken)
                const language_proficiencies = Array.isArray(
                    about.language_proficiencies,
                )
                    ? about.language_proficiencies.map((l) => ({
                          id: l?.id,
                          language: l?.language ?? "",
                          // store proficiency strings (or null/empty) directly
                          w_prof: l?.w_prof ?? null,
                          s_prof: l?.s_prof ?? null,
                      }))
                    : [];

                dispatch({
                    type: "REPLACE",
                    payload: {
                        // Personal Information
                        employee_id: about?.employee_id ?? "",
                        firstname: about?.firstname ?? "",
                        middlename: about?.middlename ?? "",
                        lastname: about?.lastname ?? "",
                        suffix: about?.suffix ?? "",
                        nickname: about?.nickname ?? "",
                        birth_date: about?.birth_date ?? "",
                        birthdate: about?.birthdate ?? about?.birth_date ?? "",
                        gender: about?.gender ?? "",
                        civil_status: about?.civil_status ?? "",
                        number_of_children: about?.number_of_children ?? "",
                        phone_number: about?.phone_number ?? "",
                        personal_email: about?.personal_email ?? "",
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
                        current_address_barangay:
                            about?.current_address_barangay ?? "",
                        current_address_city: about?.current_address_city ?? "",
                        current_address_region:
                            about?.current_address_region ?? "",
                        current_address_zip_code:
                            about?.current_address_zip_code ?? "",

                        // Permanent Address
                        permanent_address_street:
                            about?.permanent_address_street ?? "",
                        permanent_address_barangay:
                            about?.permanent_address_barangay ?? "",
                        permanent_address_city:
                            about?.permanent_address_city ?? "",
                        permanent_address_region:
                            about?.permanent_address_region ?? "",
                        permanent_address_zip_code:
                            about?.permanent_address_zip_code ?? "",
                        upload_photo: about?.upload_photo ?? "",

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
        "No Experience",
        "Basic",
        "Intermediate",
        "Advanced",
        "Expert",
    ];
    const langLevelOptions = ["Not Applicable", "Beginner", "Intermediate", "Fluent / Advanced"];

    async function handleSave() {
        // Build payload matching the new structure
        const payload = {
            org_structure_id: Number(profileId),

            // Personal Information
            employee_id: form.employee_id || "",
            firstname: form.firstname || "",
            middlename: form.middlename || "",
            lastname: form.lastname || "",
            suffix: form.suffix || "",
            nickname: form.nickname || "",
            birthdate: form.birthdate || form.birth_date || "",
            gender: form.gender || "",
            civil_status: form.civil_status || "",
            number_of_children: form.number_of_children || "",
            phone_number: form.phone_number || "",
            personal_email: form.personal_email || "",
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
            current_address_barangay: form.current_address_barangay || "",
            current_address_city: form.current_address_city || "",
            current_address_region: form.current_address_region || "",
            current_address_zip_code: form.current_address_zip_code || "",

            // Permanent Address
            permanent_address_street: form.permanent_address_street || "",
            permanent_address_barangay: form.permanent_address_barangay || "",
            permanent_address_city: form.permanent_address_city || "",
            permanent_address_region: form.permanent_address_region || "",
            permanent_address_zip_code: form.permanent_address_zip_code || "",
            upload_photo: form.upload_photo || "",

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

            // Language Proficiencies (send only proficiencies; boolean flags removed)
            language_proficiencies: (form.language_proficiencies || []).map(
                (l) => ({
                    ...(l.id ? { id: l.id } : {}),
                    language: l.language || "",
                    w_prof: l.w_prof || null,
                    s_prof: l.s_prof || null,
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

            {/* Personal Information Section (moved to separate component) */}
            <PersonalInformation form={form} dispatch={dispatch} />

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

            {/* Educational Backgrounds (moved to component) */}
            <div className="mb-6">
                <EducationalBackground
                    form={form}
                    dispatch={dispatch}
                    options={educationLevelOptions}
                    setConfirmState={setConfirmState}
                />
            </div>

            <LicensesCertifications
                form={form}
                addRow={addRow}
                updateRow={updateRow}
                confirmRemoveRow={confirmRemoveRow}
            />

            <div className="mb-6">
                <WorkExperience
                    form={form}
                    dispatch={dispatch}
                    functionsList={functionsList}
                    department={department}
                    addRow={addRow}
                    updateRow={updateRow}
                    confirmRemoveAssignment={confirmRemoveAssignment}
                    confirmRemoveRow={confirmRemoveRow}
                />
            </div>
                                  

            {/* Proficiencies */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <TechnicalProficiency
                    form={form}
                    addRow={addRow}
                    updateRow={updateRow}
                    confirmRemoveRow={confirmRemoveRow}
                    proficiencyOptions={proficiencyOptions}
                />

                <LanguageProficiency
                    form={form}
                    addRow={addRow}
                    updateRow={updateRow}
                    confirmRemoveRow={confirmRemoveRow}
                    langLevelOptions={langLevelOptions}
                />
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
