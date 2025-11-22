import React, { useEffect, useMemo, useState, useReducer } from "react";
import CustomModal from "../../../components/CustomModal";
import { getAllSubFunctions } from "../../../database/functional_structure";
import { addMyProfile, getMyProfileEdit } from "../../../database/my_profile";
import {
    getPositionTitle,
    addPositionTitle,
} from "../../../database/position_title";
import { useNavigate } from "react-router";
import FormActionBar from "../../../components/FormActionBar";
// Local reducer & components
import { jobProfileReducer, initialJobForm } from "./jobProfileReducer";
import KRASection from "../../../components/ProfileFormComponents/KRASection";
import PerformanceStandards from "../../../components/ProfileFormComponents/PerformanceStandards";
import ReportingRelationships from "../../../components/ProfileFormComponents/ReportingRelationships";
import LevelsOfAuthority from "../../../components/ProfileFormComponents/LevelsOfAuthority";
import JobSpecifications from "../../../components/ProfileFormComponents/JobSpecifications";
import ConfirmDialog from "../../../components/ProfileFormComponents/ConfirmDialog";

export default function JobProfileForm({
    profileId,
    onSaved,
    onPrev,
    onNext,
    prevDisabled,
    nextDisabled,
}) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showValidationModal, setShowValidationModal] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [subfunctions, setSubfunctions] = useState([]);
    const [confirmDialog, setConfirmDialog] = useState({
        open: false,
        title: "Confirm",
        message: "Are you sure?",
        onConfirm: null,
    });

    const [checkedValues, setCheckedValues] = useState({
        quantity: [],
        quality: [],
        time: [],
        cost: [],
    });
    const [othersInputs, setOthersInputs] = useState({
        quantity: "",
        quality: "",
        time: "",
        cost: "",
    });

    const [jobForm, dispatch] = useReducer(jobProfileReducer, initialJobForm);

    const performanceOptions = useMemo(
        () => ({
            quantity: [
                "Volume of Transactions",
                "Output per manhour; per channel",
            ],
            quality: [
                "Accuracy and Completeness",
                "Conformance to Agreed Standards",
                "Favorable feedback of Clients",
            ],
            time: [
                "Processing Time",
                "Turnaround Time",
                "Time for Project Completion",
            ],
            cost: [
                "Overhead Expense",
                "Operating Cost",
                "Budget Variance",
                "Project Cost Savings",
            ],
        }),
        [],
    );
    const reporetingRelationshipsConfig = useMemo(
        () => [
            {
                type: "primary",
                label: "Primary/Direct Reporting Relationship",
            },
            {
                type: "secondary",
                label: "Functional Reporting Relationship",
            },
            {
                type: "tertiary",
                label: "Administrative Reporting Relationship  \t(Attendance, Administrative Reporting) ",
            },
        ],
        [],
    );

    // Fetch existing profile for edit mode and hydrate reducer + performance standards
    useEffect(() => {
        let isMounted = true;
        const normalizeValue = (v) =>
            typeof v === "string"
                ? v.trim().toLowerCase()
                : String(v || "").toLowerCase();

        const fetchData = async () => {
            try {
                setLoading(true);
                const editData = await getMyProfileEdit(profileId);
                if (!isMounted) return;

                if (editData && editData.job_profile) {
                    const jobProfile = editData.job_profile;

                    const ensureArray = (v) =>
                        Array.isArray(v) ? v : v ? [String(v)] : [];
                    // Map KRAs. Normalize KRA details from either `profile_kra`
                    // or `job_profile_duties` into the UI shape `{ id, kra_description, description }`.
                    const kras = (jobProfile.job_descriptions || []).map((jd) => {
                        const fromProfileKra = Array.isArray(jd.profile_kra)
                            ? jd.profile_kra.map((p) => ({
                                  id: p.id,
                                  kra_description: p.kra_description || p.duties_and_responsibilities || "",
                                  description: p.description || p.deliverables || "",
                              }))
                            : null;

                        const fromDuties = Array.isArray(jd.job_profile_duties)
                            ? jd.job_profile_duties.map((p) => ({
                                  id: p.id,
                                  kra_description: p.duties_and_responsibilities || "",
                                  description: p.deliverables || "",
                              }))
                            : null;

                        const profile_kra = fromProfileKra || fromDuties || [];

                        return {
                            id: jd.id,
                            subfunction: jd.subfunction || jobProfile.subfunction || null,
                            kraId: typeof jd.kra === "object" ? jd.kra?.id : jd.kra,
                            kra: typeof jd.kra === "object" ? jd.kra?.kra : jd.kra_description || "",
                            description: jd.description || "",
                            profile_kra,
                        };
                    });

                    dispatch({
                        type: "INIT",
                        payload: {
                            reporting_to: Number(editData.reporting),
                            position_title: editData.position_title,
                            department: editData.department || "",
                            jobPurpose: jobProfile.job_purpose || "",
                            reportingRelationships: {
                                primary:
                                    jobProfile.reporting_relationships
                                        ?.primary || "",
                                secondary:
                                    jobProfile.reporting_relationships
                                        ?.secondary || "",
                                tertiary:
                                    jobProfile.reporting_relationships
                                        ?.tertiary || "",
                            },
                            levelsOfAuthority: {
                                lineAuthority:
                                    jobProfile.levels_of_authority
                                        ?.line_authority || "",
                                staffAuthority:
                                    jobProfile.levels_of_authority
                                        ?.staff_authority || "",
                            },
                            jobSpecifications: {
                                educationalBackground: ensureArray(
                                    jobProfile.job_specifications
                                        ?.educational_background,
                                ),
                                licenseRequirement: ensureArray(
                                    jobProfile.job_specifications
                                        ?.license_requirement,
                                ),
                                workExperience: ensureArray(
                                    jobProfile.job_specifications
                                        ?.work_experience,
                                ),
                            },
                            kras,
                        },
                    });

                    // Performance standards -> checkedValues / othersInputs
                    if (Array.isArray(jobProfile.job_performance_standards)) {
                        const newChecked = {
                            quantity: [],
                            quality: [],
                            time: [],
                            cost: [],
                        };
                        const newOthers = {
                            quantity: "",
                            quality: "",
                            time: "",
                            cost: "",
                        };

                        jobProfile.job_performance_standards.forEach(
                            (standard) => {
                                const category = standard.name;
                                if (
                                    !newChecked[category] ||
                                    !Array.isArray(standard.values)
                                )
                                    return;
                                standard.values.forEach((val) => {
                                    const isPredefined = (
                                        performanceOptions[category] || []
                                    ).some(
                                        (opt) =>
                                            normalizeValue(opt) ===
                                            normalizeValue(val),
                                    );
                                    if (isPredefined) {
                                        newChecked[category].push(val);
                                    } else {
                                        if (
                                            !newChecked[category].includes(
                                                "Others: ",
                                            )
                                        ) {
                                            newChecked[category].push(
                                                "Others: ",
                                            );
                                        }
                                        newOthers[category] = newOthers[
                                            category
                                        ]
                                            ? `${newOthers[category]}, ${val}`
                                            : val;
                                    }
                                });
                            },
                        );
                        setCheckedValues(newChecked);
                        setOthersInputs(newOthers);
                    }
                }
            } catch (err) {
                console.error("Error fetching job profile for edit:", err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchData();
        return () => {
            isMounted = false;
        };
    }, [profileId, performanceOptions]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Subfunctions effect: fetching based on department/position

                if (jobForm.department && jobForm.position_title) {
                    const department = jobForm.department;
                    const position_title = jobForm.position_title;
                    // console.log("Fetching subfunctions for:", department, position_title);

                    const subfunctionsData = await getAllSubFunctions(
                        department,
                        position_title,
                    );
                    setSubfunctions(subfunctionsData);
                    
                    // Auto-populate KRAs only if the KRA list is currently empty
                    // This happens in new forms or when department/position changes
                    if (jobForm.kras.length === 0 && subfunctionsData.length > 0) {
                        dispatch({ type: "AUTO_POPULATE_KRAS", subfunctions: subfunctionsData });
                    }

                        // Hydrate existing kras' profile_kra from the fetched subfunctions
                    // This covers edit/load mode where the initial `kras` may reference
                    // only ids but the detailed duties live under `subfunctionsData`.
                    if (jobForm.kras && jobForm.kras.length > 0) {
                        // Build a lookup map of kraId -> kra definition for fast lookup.
                        const kraMap = {};
                        for (const sf of subfunctionsData) {
                            const list = sf.job_profile_kras || [];
                            for (const k of list) {
                                if (k && k.id != null) kraMap[String(k.id)] = k;
                            }
                        }

                        const mapDuties = (kraObj) => {
                            if (!kraObj) return [];
                            if (Array.isArray(kraObj.profile_kra) && kraObj.profile_kra.length) {
                                return kraObj.profile_kra.map((p) => ({ id: p.id, kra_description: p.kra_description || p.duties_and_responsibilities || "", description: p.description || p.deliverables || "" }));
                            }
                            if (Array.isArray(kraObj.job_profile_duties) && kraObj.job_profile_duties.length) {
                                return kraObj.job_profile_duties.map((p) => ({ id: p.id, kra_description: p.duties_and_responsibilities || "", description: p.deliverables || "" }));
                            }
                            return [];
                        };

                        jobForm.kras.forEach((kraEntry, idx) => {
                            // only hydrate if profile_kra empty and we have a kraId
                            if ((!kraEntry.profile_kra || kraEntry.profile_kra.length === 0) && kraEntry.kraId) {
                                const found = kraMap[String(kraEntry.kraId)] || null;
                                if (found) {
                                    const mapped = mapDuties(found);
                                    if (mapped && mapped.length > 0) {
                                        dispatch({ type: "SET_PROFILE_KRA", index: idx, profile_kra: mapped });
                                    }
                                }
                            }
                        });
                    }
                }
            } catch (error) {
                console.error("Error fetching subfunctions:", error);
            }
        };

        fetchData();
    }, [jobForm.department, jobForm.position_title, jobForm.kras]);

    // Ensure hydration runs whenever both `subfunctions` and `jobForm.kras` are available.
    // This covers either order of arrival (subfunctions fetched before INIT or vice-versa).
    useEffect(() => {
        if (!subfunctions || subfunctions.length === 0) return;
        if (!jobForm.kras || jobForm.kras.length === 0) return;

        // Hydration effect running when both `subfunctions` and `jobForm.kras` are available

        const mapDuties = (kraObj) => {
            if (!kraObj) return [];
            if (Array.isArray(kraObj.profile_kra) && kraObj.profile_kra.length) {
                return kraObj.profile_kra.map((p) => ({ id: p.id, kra_description: p.kra_description || p.duties_and_responsibilities || "", description: p.description || p.deliverables || "" }));
            }
            if (Array.isArray(kraObj.job_profile_duties) && kraObj.job_profile_duties.length) {
                return kraObj.job_profile_duties.map((p) => ({ id: p.id, kra_description: p.duties_and_responsibilities || "", description: p.deliverables || "" }));
            }
            return [];
        };

        // Build a small lookup map of kraId -> kra object from `subfunctions` to avoid nested loops.
        const kraMap = {};
        for (const sf of subfunctions) {
            const list = sf.job_profile_kras || [];
            for (const k of list) {
                if (k && k.id != null) kraMap[String(k.id)] = k;
            }
        }

        jobForm.kras.forEach((kraEntry, idx) => {
            if ((!kraEntry.profile_kra || kraEntry.profile_kra.length === 0) && kraEntry.kraId) {
                const found = kraMap[String(kraEntry.kraId)] || null;
                if (found) {
                    const mapped = mapDuties(found);
                    if (mapped && mapped.length > 0) {
                        dispatch({ type: "SET_PROFILE_KRA", index: idx, profile_kra: mapped });
                    }
                }
            }
        });
    }, [subfunctions, jobForm.kras]);

    // Dispatch wrappers
    const updateJobField = (section, field, value) =>
        dispatch({ type: "UPDATE_FIELD", payload: { section, field, value } });
    const addKRA = () => dispatch({ type: "ADD_KRA", subfunctions });
    // Removed unused local wrapper functions; KRASection dispatches directly.

    // Performance standards helpers
    const handleCheckboxChange = (category, value) => {
        setCheckedValues((prev) => {
            const current = prev[category] || [];
            const isAlready = current.includes(value);
            if (isAlready) {
                // Uncheck
                if (value === "Others: ") {
                    setOthersInputs((inputs) => ({
                        ...inputs,
                        [category]: "",
                    }));
                }
                return {
                    ...prev,
                    [category]: current.filter((v) => v !== value),
                };
            }
            // Check
            return { ...prev, [category]: [...current, value] };
        });
    };
    const handleOthersInputChange = (category, value) =>
        setOthersInputs((prev) => ({ ...prev, [category]: value }));

    // Save handler
    async function handleSave() {
        // Required text fields (exclude job specifications which are arrays)
        const requiredTextFields = [
            jobForm.jobPurpose,
            jobForm.levelsOfAuthority.lineAuthority,
            jobForm.levelsOfAuthority.staffAuthority,
            jobForm.reportingRelationships.primary,
            jobForm.reportingRelationships.secondary,
            jobForm.reportingRelationships.tertiary,
        ];

        const allFilled = requiredTextFields.every(
            (v) => v && String(v).trim(),
        );
        // Job specifications must each have at least one non-empty entry
        const specs = jobForm.jobSpecifications || {};
        const specsFilled = [
            "educationalBackground",
            "licenseRequirement",
            "workExperience",
        ].every(
            (k) =>
                Array.isArray(specs[k]) &&
                specs[k].some((s) => String(s).trim()),
        );
        const hasKRA = (jobForm.kras || []).length > 0;
        const hasPerformance = Object.entries(checkedValues).some(
            ([cat, arr]) =>
                Array.isArray(arr) &&
                arr.some(
                    (v) =>
                        v !== "Others: " ||
                        (v === "Others: " &&
                            (othersInputs[cat] || "").trim() !== ""),
                ),
        );

        if (!allFilled || !specsFilled || !hasKRA || !hasPerformance) {
            setShowValidationModal(true);
            return;
        }
        // 1. Get all existing position titles
        let existingTitles = [];
        try {
            const data = await getPositionTitle();
            existingTitles = Array.isArray(data)
                ? data
                      .map((item) =>
                          typeof item === "string" ? item : item.position_title,
                      )
                      .filter(Boolean)
                : [];
        } catch (err) {
            existingTitles = [];
            console.error("Failed to fetch position titles:", err);
        }

        // 2. Get all entered titles from both fields
        const getCustomTitles = (value) =>
            String(value || "")
                .split(",")
                .map((v) => v.trim())
                .filter(
                    (v) =>
                        v &&
                        !existingTitles.some(
                            (t) => t.toLowerCase() === v.toLowerCase(),
                        ),
                );
        const lineCustom = getCustomTitles(
            jobForm.levelsOfAuthority.lineAuthority,
        );
        const staffCustom = getCustomTitles(
            jobForm.levelsOfAuthority.staffAuthority,
        );
        const allCustom = Array.from(new Set([...lineCustom, ...staffCustom]));

        // 3. Save new custom titles (simple, one by one)
        for (const title of allCustom) {
            await addPositionTitle(title);
        }

        // 4. Save the profile as usual
        const finalPerformance = Object.entries(checkedValues).reduce(
            (acc, [cat, values]) => {
                const expanded = (values || []).flatMap((v) => {
                    if (v === "Others: ") {
                        return (othersInputs[cat] || "")
                            .split(",")
                            .map((s) => s.trim())
                            .filter(Boolean);
                    }
                    return [v];
                });
                acc[cat] = expanded;
                return acc;
            },
            {},
        );

        const performanceArray = ["quantity", "quality", "time", "cost"].map(
            (name) => ({ name, values: finalPerformance[name] || [] }),
        );
        const jobDescriptionsArr = (jobForm.kras || []).map((kra) => ({
            ...(kra.id ? { id: kra.id } : {}),
            subfunction: kra.subfunction || null,
            kra: kra.kraId || null,
            description: kra.description || "",
            profile_kra: (kra.profile_kra || []).map((p) => ({
                ...(p.id ? { id: p.id } : {}),
                kra_description: p.kra_description || "",
                description: p.description || "",
            })),
        }));

        const backendPayload = {
            org_structure_id: Number(profileId),
            reporting_to: jobForm.reporting_to,
            job_purpose: jobForm.jobPurpose || "",
            job_performance_standards: performanceArray,
            reporting_relationships: {
                primary: jobForm.reportingRelationships.primary || "",
                secondary: jobForm.reportingRelationships.secondary || "",
                tertiary: jobForm.reportingRelationships.tertiary || "",
            },
            levels_of_authority: {
                line_authority: jobForm.levelsOfAuthority.lineAuthority || "",
                staff_authority: jobForm.levelsOfAuthority.staffAuthority || "",
            },
            job_specifications: {
                educational_background: Array.isArray(
                    jobForm.jobSpecifications.educationalBackground,
                )
                    ? jobForm.jobSpecifications.educationalBackground
                    : [],
                license_requirement: Array.isArray(
                    jobForm.jobSpecifications.licenseRequirement,
                )
                    ? jobForm.jobSpecifications.licenseRequirement
                    : [],
                work_experience: Array.isArray(
                    jobForm.jobSpecifications.workExperience,
                )
                    ? jobForm.jobSpecifications.workExperience
                    : [],
            },
            job_descriptions: jobDescriptionsArr,
        };

        setSaving(true);
        try {
            await addMyProfile(backendPayload);
            if (onSaved) onSaved();
            setShowSuccessModal(true);
        } catch (err) {
            console.error("Failed to save profile:", err);
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
            {/* Global confirm dialog */}
            <ConfirmDialog
                open={confirmDialog.open}
                title={confirmDialog.title}
                message={confirmDialog.message}
                onCancel={() =>
                    setConfirmDialog((d) => ({ ...d, open: false }))
                }
                onConfirm={() => {
                    if (typeof confirmDialog.onConfirm === "function")
                        confirmDialog.onConfirm();
                    setConfirmDialog((d) => ({ ...d, open: false }));
                }}
                confirmLabel="Delete"
            />

            {/* Success modal */}
            <CustomModal
                isOpen={showSuccessModal}
                onClose={() => {
                    setShowSuccessModal(false);
                    navigate(-1);
                }}
                title="Job Profile Saved"
            >
                <div className="space-y-4">
                    <p className="text-gray-700">
                        Your job profile has been saved successfully.
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

            {/* Validation modal */}
            <CustomModal
                isOpen={showValidationModal}
                onClose={() => setShowValidationModal(false)}
                title="Incomplete Form"
            >
                <div className="space-y-4">
                    <p className="text-gray-700">
                        Please complete all required fields marked with{" "}
                        <span className="text-red-600">*</span> before saving.
                    </p>
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setShowValidationModal(false)}
                            className="px-5 py-2 bg-[#ee3124] text-white rounded-md hover:bg-red-600"
                        >
                            Got it
                        </button>
                    </div>
                </div>
            </CustomModal>

            {/* Job Purpose */}
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-6">
                <div className="col-span-full">
                    <label
                        htmlFor="jobPurpose"
                        className="block text-sm/6 font-medium text-gray-700"
                    >
                        Job Purpose <span className="text-red-600">*</span>
                    </label>
                    <div className="mt-2">
                        <textarea
                            id="jobPurpose"
                            rows={3}
                            value={jobForm.jobPurpose}
                            onChange={(e) =>
                                updateJobField(
                                    null,
                                    "jobPurpose",
                                    e.target.value,
                                )
                            }
                            className="block w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:ring-[#ee3124] focus:border-[#ee3124] px-3 py-2 shadow-sm sm:text-sm"
                            placeholder="Describe the main purpose and objectives of this role: Why does this job exist in the organization in the first place?"
                        />
                    </div>
                </div>
            </div>

            {/* KRA header */}
            <div className="md:col-span-full mb-4 mt-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-[#ee3124] flex items-center gap-2">
                        <span className="inline-block w-1 h-6 bg-red-600 rounded-full" />
                        Key Result Areas (KRA){" "}
                        <span className="text-red-600">*</span>
                    </h2>
                    <button
                        type="button"
                        onClick={addKRA}
                        className="px-3 py-1.5 bg-[#ee3124] hover:bg-red-600 text-white text-sm font-medium rounded-md transition"
                    >
                        + Add KRA
                    </button>
                </div>
            </div>
            {jobForm.kras.length === 0 ? (
                <div className="bg-gray-50 border border-gray-200 rounded-lg py-8 px-4 text-center mb-6">
                    <p className="text-gray-500 text-sm">
                        No KRAs added yet. Click "Add KRA" to get started.
                    </p>
                </div>
            ) : (
                <KRASection
                    kras={jobForm.kras}
                    subfunctions={subfunctions}
                    dispatch={dispatch}
                    onAddKRA={addKRA}
                    openConfirm={confirmDialog}
                    setOpenConfirm={setConfirmDialog}
                />
            )}

            <PerformanceStandards
                performanceOptions={performanceOptions}
                checkedValues={checkedValues}
                othersInputs={othersInputs}
                onToggle={handleCheckboxChange}
                onOthersChange={handleOthersInputChange}
            />

            <ReportingRelationships
                config={reporetingRelationshipsConfig}
                values={jobForm.reportingRelationships}
                onChange={(field, value) =>
                    updateJobField("reportingRelationships", field, value)
                }
            />

            {/* Levels of Authority */}
            <LevelsOfAuthority
                values={jobForm.levelsOfAuthority}
                onChange={(field, value) =>
                    updateJobField("levelsOfAuthority", field, value)
                }
            />

            {/* Job Specifications */}
            <JobSpecifications
                values={jobForm.jobSpecifications}
                onChange={(field, value) =>
                    updateJobField("jobSpecifications", field, value)
                }
                setOpenConfirm={setConfirmDialog}
            />

            {/* Agreement */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg py-4 px-4 mt-6">
                <label className="flex items-start gap-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-[#ee3124] focus:ring-[#ee3124] cursor-pointer"
                    />
                    <span className="text-sm text-gray-700">
                        I have read and fully understood my Job Profile and the
                        related duties and responsibilities. I agree to fulfill
                        the requirements of the job to the best of my knowledge
                        and ability.
                    </span>
                </label>
            </div>

            <FormActionBar
                onPrev={onPrev}
                onNext={onNext}
                prevDisabled={prevDisabled}
                nextDisabled={nextDisabled}
                onSave={handleSave}
                saving={saving}
                saveDisabled={!agreedToTerms}
                saveLabel="Save Job Profile"
                rightContent={
                    !agreedToTerms ? (
                        <span className="text-xs text-gray-500">
                            Please agree to the statement to enable saving.
                        </span>
                    ) : null
                }
            />
        </>
    );
}
