import React, { useEffect, useMemo, useState } from "react";
import {
    Label,
    Listbox,
    ListboxButton,
    ListboxOption,
    ListboxOptions,
} from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/16/solid";
import { CheckIcon } from "@heroicons/react/20/solid";
import Checkbox from "../../../components/Forms/Checkbox";
import CustomModal from "../../../components/CustomModal";
import { getAllSubFunctions } from "../../../utils/functional_structure";
import { addMyProfile, getMyProfileEdit } from "../../../utils/my_profile";
import { useNavigate } from "react-router";
import FormActionBar from "../../../components/FormActionBar";

export default function JobProfileForm({ profileId, onSaved, onPrev, onNext, prevDisabled, nextDisabled }) {
    const [subfunctions, setSubfunctions] = useState([]);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const navigate = useNavigate();

    const performanceOptions = useMemo(
        () => ({
            quantity: [
                "Volume of Transactions",
                "Output per manhour; per Channel",
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

    // Normalize strings for robust comparison against backend values
    const normalize = (s) => (s ?? "").trim().toLowerCase();

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

    const [jobForm, setJobForm] = useState({
        department: "",
        jobPurpose: "",
        reportingRelationships: {
            primary: "",
            secondary: "",
            tertiary: "",
        },
        levelsOfAuthority: {
            lineAuthority: "",
            staffAuthority: "",
        },
        jobSpecifications: {
            educationalBackground: "",
            licenseRequirement: "",
            workExperience: "",
        },
        kras: [],
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const editData = await getMyProfileEdit(profileId);

                if (editData && editData.job_profile) {
                    const jobProfile = editData.job_profile;

                    // Auto-fill all form fields
                    setJobForm((prev) => ({
                        ...prev,
                        department: editData.department || "",
                        jobPurpose: jobProfile.job_purpose || "",
                        reportingRelationships: {
                            primary:
                                jobProfile.reporting_relationships?.primary ||
                                "",
                            secondary:
                                jobProfile.reporting_relationships?.secondary ||
                                "",
                            tertiary:
                                jobProfile.reporting_relationships?.tertiary ||
                                "",
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
                            educationalBackground:
                                jobProfile.job_specifications
                                    ?.educational_background || "",
                            licenseRequirement:
                                jobProfile.job_specifications
                                    ?.license_requirement || "",
                            workExperience:
                                jobProfile.job_specifications
                                    ?.work_experience || "",
                        },
                        kras: (jobProfile.job_descriptions || []).map((jd) => ({
                            id: jd.id,
                            subfunction:
                                jd.subfunction ||
                                jobProfile.subfunction ||
                                null,
                            kraId:
                                typeof jd.kra === "object"
                                    ? jd.kra?.id
                                    : jd.kra,
                            // Display name of KRA; prefer object.kra (name). Fallback to previous stored string if any.
                            kra:
                                typeof jd.kra === "object"
                                    ? jd.kra?.kra
                                    : jd.kra_description || "",
                            description: jd.description || "",
                            profile_kra: Array.isArray(jd.profile_kra)
                                ? jd.profile_kra
                                : [],
                        })),
                    }));

                    // Auto-fill performance standards with "Others" logic
                    if (jobProfile.job_performance_standards) {
                        const newCheckedValues = {
                            quantity: [],
                            quality: [],
                            time: [],
                            cost: [],
                        };
                        const newOthersInputs = {
                            quantity: "",
                            quality: "",
                            time: "",
                            cost: "",
                        };

                        jobProfile.job_performance_standards.forEach(
                            (standard) => {
                                const category = standard.name;
                                if (
                                    newCheckedValues[category] &&
                                    standard.values
                                ) {
                                    standard.values.forEach((value) => {
                                        const isPredefined = (
                                            performanceOptions[category] || []
                                        ).some(
                                            (opt) =>
                                                normalize(opt) ===
                                                normalize(value),
                                        );

                                        if (isPredefined) {
                                            // Predefined option - just check it
                                            newCheckedValues[category].push(
                                                value,
                                            );
                                        } else {
                                            // Custom value - check "Others: " and fill input
                                            if (
                                                !newCheckedValues[
                                                    category
                                                ].includes("Others: ")
                                            ) {
                                                newCheckedValues[category].push(
                                                    "Others: ",
                                                );
                                            }
                                            // If there are multiple custom values, append them
                                            newOthersInputs[category] =
                                                newOthersInputs[category]
                                                    ? `${newOthersInputs[category]}, ${value}`
                                                    : value;
                                        }
                                    });
                                }
                            },
                        );

                        setCheckedValues(newCheckedValues);
                        setOthersInputs(newOthersInputs);
                    }
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [profileId, performanceOptions]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (jobForm.department) {
                    const department = jobForm.department;
                    const subfunctionsData = await getAllSubFunctions(
                        department,
                    );

                    setSubfunctions(subfunctionsData);
                }
            } catch (error) {
                console.error("Error fetching subfunctions:", error);
            }
        };

        fetchData();
    }, [jobForm.department]);

    const updateJobField = (section, field, value) => {
        if (section) {
            setJobForm((prev) => ({
                ...prev,
                [section]: { ...prev[section], [field]: value },
            }));
        } else {
            setJobForm((prev) => ({ ...prev, [field]: value }));
        }
    };

    const addKRA = () => {
        setJobForm((prev) => ({
            ...prev,
            kras: [
                ...prev.kras,
                {
                    subfunction: null,
                    kraId: null,
                    kra: "",
                    description: "",
                    profile_kra: [],
                },
            ],
        }));
    };

    const removeKRA = (kraIndex) => {
        setJobForm((prev) => ({
            ...prev,
            kras: prev.kras.filter((_, index) => index !== kraIndex),
        }));
    };

    const updateKRA = (kraIndex, field, value) => {
        setJobForm((prev) => ({
            ...prev,
            kras: prev.kras.map((kra, index) => {
                if (index === kraIndex) {
                    // If subfunction is being changed, clear the KRA selection
                    if (field === "subfunction") {
                        return {
                            ...kra,
                            [field]: value,
                            kraId: null,
                            kra: "",
                            description: "",
                        };
                    }
                    return { ...kra, [field]: value };
                }
                return kra;
            }),
        }));
    };

    const addProfileKRA = (kraIndex) => {
        setJobForm((prev) => ({
            ...prev,
            kras: prev.kras.map((kra, index) =>
                index === kraIndex
                    ? {
                          ...kra,
                          profile_kra: [
                              ...kra.profile_kra,
                              { kra_description: "", description: "" },
                          ],
                      }
                    : kra,
            ),
        }));
    };

    const removeProfileKRA = (kraIndex, profileIndex) => {
        setJobForm((prev) => ({
            ...prev,
            kras: prev.kras.map((kra, index) =>
                index === kraIndex
                    ? {
                          ...kra,
                          profile_kra: kra.profile_kra.filter(
                              (_, pIndex) => pIndex !== profileIndex,
                          ),
                      }
                    : kra,
            ),
        }));
    };

    const updateProfileKRA = (kraIndex, profileIndex, field, value) => {
        setJobForm((prev) => ({
            ...prev,
            kras: prev.kras.map((kra, index) =>
                index === kraIndex
                    ? {
                          ...kra,
                          profile_kra: kra.profile_kra.map(
                              (profileKra, pIndex) =>
                                  pIndex === profileIndex
                                      ? { ...profileKra, [field]: value }
                                      : profileKra,
                          ),
                      }
                    : kra,
            ),
        }));
    };

    const handleCheckboxChange = (category, value) => {
        setCheckedValues((prev) => {
            const currentValues = prev[category] || [];
            const isChecked = currentValues.includes(value);

            if (isChecked) {
                if (value === "Others: ") {
                    setOthersInputs((prevInputs) => ({
                        ...prevInputs,
                        [category]: "",
                    }));
                }
                return {
                    ...prev,
                    [category]: currentValues.filter((v) => v !== value),
                };
            } else {
                return {
                    ...prev,
                    [category]: [...currentValues, value],
                };
            }
        });
    };

    const handleOthersInputChange = (category, value) => {
        setOthersInputs((prev) => ({ ...prev, [category]: value }));
    };

    const isChecked = (category, value) => {
        return checkedValues[category]?.includes(value) || false;
    };

    async function handleSave() {
        const finalPerformanceStandards = Object.entries(checkedValues).reduce(
            (acc, [category, values]) => {
                acc[category] = values.map((v) => {
                    if (v === "Others: " && othersInputs[category]) {
                        return othersInputs[category];
                    }
                    return v;
                });
                return acc;
            },
            {},
        );

        const jobPerformanceStandardsArr = [
            "quantity",
            "quality",
            "time",
            "cost",
        ].map((name) => ({
            name,
            values: finalPerformanceStandards[name] || [],
        }));

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
            job_purpose: jobForm.jobPurpose || "",
            job_performance_standards: jobPerformanceStandardsArr,
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
                educational_background:
                    jobForm.jobSpecifications.educationalBackground || "",
                license_requirement:
                    jobForm.jobSpecifications.licenseRequirement || "",
                work_experience: jobForm.jobSpecifications.workExperience || "",
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
            {/* Success Modal */}
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
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-6">
                <div className="col-span-full">
                    <label
                        htmlFor="jobPurpose"
                        className="block text-sm/6 font-medium text-gray-700"
                    >
                        Job Purpose
                    </label>
                    <div className="mt-2">
                        <textarea
                            id="jobPurpose"
                            name="jobPurpose"
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
                            placeholder="Describe the main purpose and objectives of this role..."
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="md:col-span-full">
                    <h2 className="text-lg font-semibold text-[#ee3124] flex items-center gap-2">
                        <span className="inline-block w-1 h-6 bg-red-600 rounded-full" />
                        Job Performance Standards
                    </h2>
                    <div className="text-sm/6">
                        <p className="text-gray-400">
                            Number, Frequency, Percentage
                        </p>
                        <p className="text-gray-400 text-xs mb-2">
                            (Please check all that apply)
                        </p>
                    </div>
                </div>

                {/* Performance Standards */}
                {["quantity", "quality", "time", "cost"].map(
                    (category, idx) => (
                        <div
                            key={category}
                            className="bg-white border border-gray-200 shadow-xl rounded-lg py-3 px-4"
                        >
                            <label className="block text-sm/6 font-medium text-gray-700">
                                {idx + 1}.0{" "}
                                {category.charAt(0).toUpperCase() +
                                    category.slice(1)}
                            </label>
                            {performanceOptions[category].map((option) => (
                                <div key={option} className="flex gap-3 mt-2">
                                    <Checkbox
                                        value={option}
                                        name={`${category}[]`}
                                        checked={isChecked(category, option)}
                                        onChange={() =>
                                            handleCheckboxChange(
                                                category,
                                                option,
                                            )
                                        }
                                    />
                                </div>
                            ))}
                            <div className="flex gap-3 mt-2">
                                <Checkbox
                                    value="Others: "
                                    name={`${category}[]`}
                                    checked={isChecked(category, "Others: ")}
                                    onChange={() =>
                                        handleCheckboxChange(
                                            category,
                                            "Others: ",
                                        )
                                    }
                                    onOthersChange={(value) =>
                                        handleOthersInputChange(category, value)
                                    }
                                    othersValue={othersInputs[category]}
                                />
                            </div>
                        </div>
                    ),
                )}
            </div>

            {/* Reporting Relationships */}
            <div className="md:col-span-full mb-4">
                <h2 className="text-lg font-semibold text-[#ee3124] flex items-center gap-2">
                    <span className="inline-block w-1 h-6 bg-red-600 rounded-full" />
                    Reporting Relationships
                </h2>
                <div className="text-sm/6">
                    <p className="text-gray-400">
                        Please indicate the position of superiors as and when
                        applicable.
                    </p>
                </div>
            </div>
            <div className="bg-white border border-gray-200 shadow-xl rounded-lg py-3 px-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {["primary", "secondary", "tertiary"].map((type, idx) => (
                        <div key={type} className="md:col-span-1">
                            <label
                                htmlFor={`reporting-${type}`}
                                className="block text-sm/6 font-medium text-gray-700"
                            >
                                {idx + 1}.0 Primary/Direct Reporting
                                Relationship
                            </label>
                            <div className="relative mt-2">
                                <input
                                    id={`reporting-${type}`}
                                    name={`reporting-${type}`}
                                    type="text"
                                    value={jobForm.reportingRelationships[type]}
                                    onChange={(e) =>
                                        updateJobField(
                                            "reportingRelationships",
                                            type,
                                            e.target.value,
                                        )
                                    }
                                    className="w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-3 py-2 shadow-sm sm:text-sm"
                                    placeholder="e.g., Management Associate"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Levels of Authority */}
            <div className="md:col-span-full mb-4">
                <h2 className="text-lg font-semibold text-[#ee3124] flex items-center gap-2">
                    <span className="inline-block w-1 h-6 bg-red-600 rounded-full" />
                    Levels of Authority
                </h2>
                <div className="text-sm/6">
                    <p className="text-gray-400">
                        If line authority, please state the terminal
                        accountability you have over specific functions/roles.
                        If staff authority, please indicate the parties you
                        provide professional, expert advice and service.
                    </p>
                </div>
            </div>

            <div className="bg-white border border-gray-200 shadow-xl rounded-lg py-3 px-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        {
                            key: "lineAuthority",
                            label: "Line Authority",
                            placeholder: "Describe terminal accountability...",
                        },
                        {
                            key: "staffAuthority",
                            label: "Staff Authority",
                            placeholder: "Describe advisory roles...",
                        },
                    ].map((item, idx) => (
                        <div key={item.key} className="md:col-span-1">
                            <label
                                htmlFor={item.key}
                                className="block text-sm/6 font-medium text-gray-700"
                            >
                                {idx + 1}.0 {item.label}
                            </label>
                            <div className="relative mt-2">
                                <textarea
                                    id={item.key}
                                    name={item.key}
                                    rows={3}
                                    value={jobForm.levelsOfAuthority[item.key]}
                                    onChange={(e) =>
                                        updateJobField(
                                            "levelsOfAuthority",
                                            item.key,
                                            e.target.value,
                                        )
                                    }
                                    className="block w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:ring-[#ee3124] focus:border-[#ee3124] px-3 py-2 shadow-sm sm:text-sm"
                                    placeholder={item.placeholder}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Job Specifications */}
            <div className="md:col-span-full mb-4">
                <h2 className="text-lg font-semibold text-[#ee3124] flex items-center gap-2">
                    <span className="inline-block w-1 h-6 bg-red-600 rounded-full" />
                    Job Specifications
                </h2>
            </div>
            <div className="bg-white border border-gray-200 shadow-xl rounded-lg py-3 px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        {
                            key: "educationalBackground",
                            label: "Educational Background",
                            placeholder: "e.g., Bachelor's degree in...",
                        },
                        {
                            key: "licenseRequirement",
                            label: "License Requirement (if any)",
                            placeholder:
                                "e.g., Professional Engineer License...",
                        },
                        {
                            key: "workExperience",
                            label: "Years of Work Experience (Relevant to the Area of Professional Expertise)",
                            placeholder: "e.g., 5+ years in...",
                        },
                    ].map((item, idx) => (
                        <div key={item.key} className="md:col-span-1">
                            <label
                                htmlFor={item.key}
                                className="block text-sm/6 font-medium text-gray-700"
                            >
                                {idx + 1}.0 {item.label}
                            </label>
                            <div className="relative mt-2">
                                <textarea
                                    id={item.key}
                                    name={item.key}
                                    rows={3}
                                    value={jobForm.jobSpecifications[item.key]}
                                    onChange={(e) =>
                                        updateJobField(
                                            "jobSpecifications",
                                            item.key,
                                            e.target.value,
                                        )
                                    }
                                    className="block w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:ring-[#ee3124] focus:border-[#ee3124] px-3 py-2 shadow-sm sm:text-sm"
                                    placeholder={item.placeholder}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Key Result Areas (KRA) Section */}
            <div className="md:col-span-full mb-4 mt-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-[#ee3124] flex items-center gap-2">
                        <span className="inline-block w-1 h-6 bg-red-600 rounded-full" />
                        Key Result Areas (KRA)
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
                <div className="bg-gray-50 border border-gray-200 rounded-lg py-8 px-4 text-center">
                    <p className="text-gray-500 text-sm">
                        No KRAs added yet. Click "Add KRA" to get started.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {jobForm.kras.map((kra, kraIndex) => (
                        <div
                            key={kraIndex}
                            className="bg-white border border-gray-200 shadow-xl rounded-lg py-4 px-4"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-md font-semibold text-gray-800">
                                    KRA #{kraIndex + 1}
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => removeKRA(kraIndex)}
                                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                                >
                                    Remove KRA
                                </button>
                            </div>

                            {/* Subfunction per KRA */}
                            <div className="mb-4">
                                <label
                                    htmlFor="subfunction"
                                    className="block text-sm/6 font-medium text-gray-700 mb-2"
                                >
                                    Subfunction
                                </label>
                                <div className="relative mt-2">
                                    <Listbox
                                        value={kra.subfunction}
                                        onChange={(val) =>
                                            updateKRA(
                                                kraIndex,
                                                "subfunction",
                                                val,
                                            )
                                        }
                                    >
                                        <ListboxButton className="grid w-full cursor-default grid-cols-1 rounded-md bg-white border border-gray-300 py-2 pr-2 pl-3 text-left text-gray-900 shadow-sm focus-visible:outline-none focus:ring focus:ring-[#ee3124] focus:border-[#ee3124] sm:text-sm/6">
                                            <span className="col-start-1 row-start-1 flex items-center gap-3 pr-6">
                                                <span className="block truncate">
                                                    {kra?.subfunction?.name ||
                                                        "Select a subfunction"}
                                                </span>
                                            </span>
                                            <ChevronUpDownIcon
                                                aria-hidden="true"
                                                className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-400 sm:size-4"
                                            />
                                        </ListboxButton>

                                        <ListboxOptions
                                            transition
                                            className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base border border-gray-200 shadow-lg ring-1 ring-black/5 focus:outline-none data-leave:transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0 sm:text-sm"
                                        >
                                            {subfunctions.map((sf) => (
                                                <ListboxOption
                                                    key={sf.id}
                                                    value={sf}
                                                    className="group relative cursor-default py-2 pr-9 pl-3 text-gray-900 select-none data-focus:bg-red-50 data-focus:outline-none"
                                                >
                                                    <div className="flex items-center">
                                                        <span className="ml-3 block truncate font-normal group-data-selected:font-semibold group-data-selected:text-[#ee3124]">
                                                            {sf.name}
                                                        </span>
                                                    </div>
                                                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-[#ee3124] group-not-data-selected:hidden group-data-focus:text-[#ee3124]">
                                                        <CheckIcon
                                                            aria-hidden="true"
                                                            className="size-5"
                                                        />
                                                    </span>
                                                </ListboxOption>
                                            ))}
                                        </ListboxOptions>
                                    </Listbox>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label
                                    htmlFor={`kra-name-${kraIndex}`}
                                    className="block text-sm/6 font-medium text-gray-700 mb-2"
                                >
                                    KRA Name
                                </label>
                                <div className="relative mt-2">
                                    <Listbox
                                        value={kra.kraId}
                                        onChange={(selectedKraId) => {
                                            const selectedKra =
                                                kra.subfunction?.job_profile_kras?.find(
                                                    (k) => k.id === selectedKraId,
                                                );
                                            // Update kraId, display name (kra), and auto-fill description
                                            setJobForm((prev) => ({
                                                ...prev,
                                                kras: prev.kras.map((k, idx) =>
                                                    idx === kraIndex
                                                        ? {
                                                              ...k,
                                                              kraId: selectedKra?.id || null,
                                                              kra: selectedKra?.kra || "",
                                                              description:
                                                                  (selectedKra?.kra_description ?? "") || "",
                                                          }
                                                        : k,
                                                ),
                                            }));
                                        }}
                                        disabled={!kra.subfunction}
                                    >
                                        <ListboxButton
                                            className={`grid w-full cursor-default grid-cols-1 rounded-md bg-white border border-gray-300 py-2 pr-2 pl-3 text-left text-gray-900 shadow-sm focus-visible:outline-none focus:ring focus:ring-[#ee3124] focus:border-[#ee3124] sm:text-sm/6 ${
                                                !kra.subfunction
                                                    ? "opacity-50 cursor-not-allowed"
                                                    : ""
                                            }`}
                                        >
                                            <span className="col-start-1 row-start-1 flex items-center gap-3 pr-6">
                                                <span className="block truncate">
                                                    {kra.kra ||
                                                        (kra.subfunction
                                                            ? "Select a KRA"
                                                            : "Select a subfunction first")}
                                                </span>
                                            </span>
                                            <ChevronUpDownIcon
                                                aria-hidden="true"
                                                className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-400 sm:size-4"
                                            />
                                        </ListboxButton>

                                        <ListboxOptions
                                            transition
                                            className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base border border-gray-200 shadow-lg ring-1 ring-black/5 focus:outline-none data-leave:transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0 sm:text-sm"
                                        >
                                            {kra.subfunction &&
                                            kra.subfunction.job_profile_kras &&
                                            kra.subfunction.job_profile_kras
                                                .length > 0 ? (
                                                kra.subfunction.job_profile_kras.map(
                                                    (kraOption) => (
                                                        <ListboxOption
                                                            key={kraOption.id}
                                                            value={kraOption.id}
                                                            className="group relative cursor-default py-2 pr-9 pl-3 text-gray-900 select-none data-focus:bg-red-50 data-focus:outline-none"
                                                        >
                                                            <div className="flex items-center">
                                                                <span className="ml-3 block truncate font-normal group-data-selected:font-semibold group-data-selected:text-[#ee3124]">
                                                                    {kraOption.kra}
                                                                </span>
                                                            </div>
                                                            <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-[#ee3124] group-not-data-selected:hidden group-data-focus:text-[#ee3124]">
                                                                <CheckIcon
                                                                    aria-hidden="true"
                                                                    className="size-5"
                                                                />
                                                            </span>
                                                        </ListboxOption>
                                                    ),
                                                )
                                            ) : (
                                                <div className="py-2 px-3 text-sm text-gray-500">
                                                    No KRAs available for this
                                                    subfunction
                                                </div>
                                            )}
                                        </ListboxOptions>
                                    </Listbox>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label
                                    htmlFor={`kra-description-${kraIndex}`}
                                    className="block text-sm/6 font-medium text-gray-700 mb-2"
                                >
                                    KRA Description
                                </label>
                                <textarea
                                    id={`kra-description-${kraIndex}`}
                                    rows={2}
                                    value={kra.description}
                                    onChange={(e) =>
                                        updateKRA(
                                            kraIndex,
                                            "description",
                                            e.target.value,
                                        )
                                    }
                                    className="block w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:ring-[#ee3124] focus:border-[#ee3124] px-3 py-2 shadow-sm sm:text-sm"
                                    placeholder="Describe the key result area..."
                                />
                            </div>

                            <div className="mt-4 border-t border-gray-200 pt-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-sm font-semibold text-gray-700">
                                        KRA Details
                                    </h4>
                                    <button
                                        type="button"
                                        onClick={() => addProfileKRA(kraIndex)}
                                        className="px-2.5 py-1 bg-gray-600 hover:bg-gray-700 text-white text-xs font-medium rounded-md transition"
                                    >
                                        + Add KRA Description
                                    </button>
                                </div>

                                {kra.profile_kra.length === 0 ? (
                                    <div className="bg-gray-50 border border-dashed border-gray-300 rounded-md py-4 px-3 text-center">
                                        <p className="text-gray-400 text-xs">
                                            No KRA descriptions added yet.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {kra.profile_kra.map(
                                            (profileKra, profileIndex) => (
                                                <div
                                                    key={profileIndex}
                                                    className="bg-gray-50 border border-gray-200 rounded-md p-3"
                                                >
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-xs font-medium text-gray-600">
                                                            Detail #
                                                            {profileIndex + 1}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeProfileKRA(
                                                                    kraIndex,
                                                                    profileIndex,
                                                                )
                                                            }
                                                            className="text-red-500 hover:text-red-700 text-xs font-medium"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>

                                                    <div className="mb-2">
                                                        <label
                                                            htmlFor={`profile-kra-desc-${kraIndex}-${profileIndex}`}
                                                            className="block text-xs font-medium text-gray-600 mb-1"
                                                        >
                                                            Duties &
                                                            Responsibilities
                                                        </label>
                                                        <input
                                                            id={`profile-kra-desc-${kraIndex}-${profileIndex}`}
                                                            type="text"
                                                            value={
                                                                profileKra.kra_description
                                                            }
                                                            onChange={(e) =>
                                                                updateProfileKRA(
                                                                    kraIndex,
                                                                    profileIndex,
                                                                    "kra_description",
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className="w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1.5 shadow-sm text-xs"
                                                            placeholder="e.g., Budget Management"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label
                                                            htmlFor={`profile-desc-${kraIndex}-${profileIndex}`}
                                                            className="block text-xs font-medium text-gray-600 mb-1"
                                                        >
                                                            Deliverables
                                                        </label>
                                                        <textarea
                                                            id={`profile-desc-${kraIndex}-${profileIndex}`}
                                                            rows={2}
                                                            value={
                                                                profileKra.description
                                                            }
                                                            onChange={(e) =>
                                                                updateProfileKRA(
                                                                    kraIndex,
                                                                    profileIndex,
                                                                    "description",
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className="block w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:ring-[#ee3124] focus:border-[#ee3124] px-2 py-1.5 shadow-sm text-xs"
                                                            placeholder="Detailed description..."
                                                        />
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Agreement Checkbox */}
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
                        <span className="text-xs text-gray-500">Please agree to the statement to enable saving.</span>
                    ) : null
                }
            />
        </>
    );
}
