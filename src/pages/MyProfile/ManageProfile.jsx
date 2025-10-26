import React, { useEffect, useMemo, useState } from "react";
import Title from "../../components/Title";
import { ArrowLeftCircleIcon } from "@heroicons/react/24/outline";
import { useNavigate, useParams } from "react-router";
import {
    Label,
    Listbox,
    ListboxButton,
    ListboxOption,
    ListboxOptions,
} from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/16/solid";
import { CheckIcon } from "@heroicons/react/20/solid";
import Checkbox from "../../components/Forms/Checkbox";
import { getAllSubFunctions } from "../../utils/functional_structure";
import { addMyProfile } from "../../utils/my_profile";

export default function ManageProfile() {
    const navigate = useNavigate();
    const { profileId } = useParams();
    const stepDefs = useMemo(
        () => [
            { id: "about", label: "About" },
            { id: "job", label: "Job Profile" },
            { id: "dev", label: "Development Plan" },
            { id: "perf", label: "Performance Management" },
        ],
        [],
    );

    const [step, setStep] = useState(0);
    const [saving, setSaving] = useState(false);
    const [savedStepIds, setSavedStepIds] = useState({});
    const [subfunctions, setSubfunctions] = useState([]);
    const [selected, setSelected] = useState(null);

    // Track checked checkboxes by category
    const [checkedValues, setCheckedValues] = useState({
        quantity: [],
        quality: [],
        time: [],
        cost: [],
    });

    // Track "Others" input values by category
    const [othersInputs, setOthersInputs] = useState({
        quantity: "",
        quality: "",
        time: "",
        cost: "",
    });

    // Job Profile Form State
    const [jobForm, setJobForm] = useState({
        orgStructureId: profileId,
        subfunction: null,
        jobPurpose: "",
        performanceStandards: {
            quantity: [],
            quality: [],
            time: [],
            cost: [],
        },
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

    const currentStepId = stepDefs[step].id;

    // Update job form field
    const updateJobField = (section, field, value) => {
        if (section) {
            setJobForm((prev) => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [field]: value,
                },
            }));
        } else {
            setJobForm((prev) => ({
                ...prev,
                [field]: value,
            }));
        }
    };

    // KRA Management Functions
    const addKRA = () => {
        setJobForm((prev) => ({
            ...prev,
            kras: [
                ...prev.kras,
                {
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
            kras: prev.kras.map((kra, index) =>
                index === kraIndex ? { ...kra, [field]: value } : kra,
            ),
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
                              {
                                  kra_description: "",
                                  description: "",
                              },
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

    useEffect(() => {
        try {
            const fetchSubfunctions = async () => {
                getAllSubFunctions().then((data) => {
                    setSubfunctions(data);
                    setSelected(data[0]); // Default to first subfunction
                });
            };

            fetchSubfunctions();
        } catch (error) {
            console.log(error);
        }
    }, []);

    async function handleSave() {
        // Merge checked values with "Others" input values for performance standards
        const finalPerformanceStandards = Object.entries(checkedValues).reduce(
            (acc, [category, values]) => {
                acc[category] = values.map((v) => {
                    // If it's "Others: " and there's an input value, use that instead
                    if (v === "Others: " && othersInputs[category]) {
                        return othersInputs[category];
                    }
                    return v;
                });
                return acc;
            },
            {},
        );

        // Build backend-preferred payload (snake_case + arrays)
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
            kra: kra.kra || "",
            description: kra.description || "",
            profile_kra: (kra.profile_kra || []).map((p) => ({
                ...(p.id ? { id: p.id } : {}),
                kra_description: p.kra_description || "",
                description: p.description || "",
            })),
        }));

        const backendPayload = {
            org_structure_id: Number(profileId),
            subfunction: selected || null,
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

        // Log the complete payload to verify
        console.log("Job Profile Payload (backend format):", backendPayload);

        // Simulate save latency and then perform the actual save
        setSaving(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 700));
            // Await the API call so we don't mark as saved before it finishes
            await addMyProfile(backendPayload);
            setSavedStepIds((prev) => ({ ...prev, [currentStepId]: true }));
        } catch (err) {
            console.error("Failed to save profile:", err);
            // Optionally: surface error to UI (toast/snackbar) here
        } finally {
            setSaving(false);
        }
        // navigate("/my-profile");
    }

    const handleCheckboxChange = (category, value) => {
        setCheckedValues((prev) => {
            const currentValues = prev[category] || [];
            const isChecked = currentValues.includes(value);

            if (isChecked) {
                // Remove if already checked
                // Also clear the "Others" input if unchecking "Others: "
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
                // Add if not checked
                return {
                    ...prev,
                    [category]: [...currentValues, value],
                };
            }
        });
    };

    const handleOthersInputChange = (category, value) => {
        setOthersInputs((prev) => ({
            ...prev,
            [category]: value,
        }));
    };

    const isChecked = (category, value) => {
        return checkedValues[category]?.includes(value) || false;
    };

    const isFirst = step === 0;
    const isLast = step === stepDefs.length - 1;

    return (
        <div className="mx-auto p-4 md:p-6 bg-gray-50 border border-gray-200 rounded-lg shadow">
            <div className="w-full sm:w-auto mb-5 flex items-center justify-between">
                <Title title="Edit Profile" />
                <button
                    className=" p-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                    onClick={() => navigate("/my-profile")}
                >
                    <ArrowLeftCircleIcon className="w-5 h-5 hover:text-red-400 inline-block text-red-600 cursor-pointer" />
                </button>
            </div>

            {/* Stepper Header */}
            <div className="w-full mb-6 overflow-x-auto">
                <ol className="flex items-center w-max sm:w-full flex-nowrap gap-2 px-1">
                    {stepDefs.map((s, idx) => {
                        const active = idx === step;
                        const complete = savedStepIds[s.id];
                        return (
                            <li key={s.id} className="flex-none sm:flex-1">
                                <button
                                    type="button"
                                    onClick={() => setStep(idx)}
                                    className={
                                        "whitespace-nowrap w-auto sm:w-full flex items-center gap-2 md:gap-3 px-2 py-2 transition " +
                                        (active
                                            ? "text-[#ee3124]"
                                            : "text-gray-500 hover:text-[#ee3124]")
                                    }
                                >
                                    <span
                                        className={
                                            "flex h-6 w-6 md:h-7 md:w-7 items-center justify-center rounded-full text-[10px] md:text-xs font-semibold border-2 " +
                                            (complete
                                                ? "bg-[#ee3124] border-[#ee3124] text-white"
                                                : active
                                                ? "border-[#ee3124] text-[#ee3124]"
                                                : "border-gray-300 text-gray-500")
                                        }
                                    >
                                        {idx + 1}
                                    </span>
                                    <span className="hidden sm:inline text-sm font-medium">
                                        {s.label}
                                    </span>
                                </button>
                            </li>
                        );
                    })}
                </ol>
                <div className="mt-2 h-1 w-full bg-gray-200 rounded">
                    <div
                        className="h-1 bg-[#ee3124] rounded transition-all"
                        style={{
                            width: `${((step + 1) / stepDefs.length) * 100}%`,
                        }}
                    />
                </div>
            </div>

            {/* Step Content */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow">
                {currentStepId === "about" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={form.about.fullName}
                                onChange={(e) =>
                                    updateField(
                                        "about",
                                        "fullName",
                                        e.target.value,
                                    )
                                }
                                className="mt-1 w-full rounded-md border-gray-300 focus:border-[#ee3124] focus:ring-[#ee3124]"
                                placeholder="e.g., Juan Dela Cruz"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                type="email"
                                value={form.about.email}
                                onChange={(e) =>
                                    updateField(
                                        "about",
                                        "email",
                                        e.target.value,
                                    )
                                }
                                className="mt-1 w-full rounded-md border-gray-300 focus:border-[#ee3124] focus:ring-[#ee3124]"
                                placeholder="e.g., juan@company.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Phone
                            </label>
                            <input
                                type="tel"
                                value={form.about.phone}
                                onChange={(e) =>
                                    updateField(
                                        "about",
                                        "phone",
                                        e.target.value,
                                    )
                                }
                                className="mt-1 w-full rounded-md border-gray-300 focus:border-[#ee3124] focus:ring-[#ee3124]"
                                placeholder="e.g., 09XX-XXX-XXXX"
                            />
                        </div> */}
                    </div>
                )}

                {currentStepId === "job" && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-6">
                            <div className="md:col-span-full">
                                <Listbox
                                    value={selected}
                                    onChange={setSelected}
                                >
                                    <Label className="block text-sm/6 font-medium text-gray-700">
                                        Subfunction
                                    </Label>
                                    <div className="relative mt-2">
                                        <ListboxButton className="grid w-full cursor-default grid-cols-1 rounded-md bg-white border border-gray-300 py-2 pr-2 pl-3 text-left text-gray-900 shadow-sm focus-visible:outline-none focus:ring focus:ring-[#ee3124] focus:border-[#ee3124] sm:text-sm/6">
                                            <span className="col-start-1 row-start-1 flex items-center gap-3 pr-6">
                                                <span className="block truncate">
                                                    {selected.name}
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
                                            {subfunctions &&
                                                subfunctions.map((sf) => (
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
                                    </div>
                                </Listbox>
                            </div>

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
                                    <p className="text-gray-400 ">
                                        Number, Frequency, Percentage
                                    </p>
                                    <p className="text-gray-400 text-xs mb-2">
                                        (Please check all that apply)
                                    </p>
                                </div>
                            </div>
                            <div className="bg-white border border-gray-200 shadow-xl rounded-lg py-3 px-4">
                                <label
                                    htmlFor="quantiy"
                                    className="block text-sm/6 font-medium text-gray-700"
                                >
                                    1.0 Quantity
                                </label>
                                <div className="flex gap-3 mt-2">
                                    <Checkbox
                                        value="Volume of Transactions"
                                        name="quantity[]"
                                        checked={isChecked(
                                            "quantity",
                                            "Volume of Transactions",
                                        )}
                                        onChange={() =>
                                            handleCheckboxChange(
                                                "quantity",
                                                "Volume of Transactions",
                                            )
                                        }
                                    />
                                </div>
                                <div className="flex gap-3 mt-2">
                                    <Checkbox
                                        value="Output per manhour; per Channel"
                                        name="quantity[]"
                                        checked={isChecked(
                                            "quantity",
                                            "Output per manhour; per Channel",
                                        )}
                                        onChange={() =>
                                            handleCheckboxChange(
                                                "quantity",
                                                "Output per manhour; per Channel",
                                            )
                                        }
                                    />
                                </div>
                                <div className="flex gap-3 mt-2">
                                    <Checkbox
                                        value="Others: "
                                        name="quantity[]"
                                        checked={isChecked(
                                            "quantity",
                                            "Others: ",
                                        )}
                                        onChange={() =>
                                            handleCheckboxChange(
                                                "quantity",
                                                "Others: ",
                                            )
                                        }
                                        onOthersChange={(value) =>
                                            handleOthersInputChange(
                                                "quantity",
                                                value,
                                            )
                                        }
                                        othersValue={othersInputs.quantity}
                                    />
                                </div>
                            </div>
                            <div className="bg-white border border-gray-200 shadow-xl rounded-lg py-3 px-4">
                                <label
                                    htmlFor="quantiy"
                                    className="block text-sm/6 font-medium text-gray-700"
                                >
                                    2.0 Quality
                                </label>
                                <div className="flex gap-3 mt-2">
                                    <Checkbox
                                        value="Accuracy and Completeness"
                                        name="quality[]"
                                        checked={isChecked(
                                            "quality",
                                            "Accuracy and Completeness",
                                        )}
                                        onChange={() =>
                                            handleCheckboxChange(
                                                "quality",
                                                "Accuracy and Completeness",
                                            )
                                        }
                                    />
                                </div>
                                <div className="flex gap-3 mt-2">
                                    <Checkbox
                                        value="Conformance to Agreed Standards"
                                        name="quality[]"
                                        checked={isChecked(
                                            "quality",
                                            "Conformance to Agreed Standards",
                                        )}
                                        onChange={() =>
                                            handleCheckboxChange(
                                                "quality",
                                                "Conformance to Agreed Standards",
                                            )
                                        }
                                    />
                                </div>
                                <div className="flex gap-3 mt-2">
                                    <Checkbox
                                        value="Favorable feedback of Clients"
                                        name="quality[]"
                                        checked={isChecked(
                                            "quality",
                                            "Favorable feedback of Clients",
                                        )}
                                        onChange={() =>
                                            handleCheckboxChange(
                                                "quality",
                                                "Favorable feedback of Clients",
                                            )
                                        }
                                    />
                                </div>
                                <div className="flex gap-3 mt-2">
                                    <Checkbox
                                        value="Others: "
                                        name="quality[]"
                                        checked={isChecked(
                                            "quality",
                                            "Others: ",
                                        )}
                                        onChange={() =>
                                            handleCheckboxChange(
                                                "quality",
                                                "Others: ",
                                            )
                                        }
                                        onOthersChange={(value) =>
                                            handleOthersInputChange(
                                                "quality",
                                                value,
                                            )
                                        }
                                        othersValue={othersInputs.quality}
                                    />
                                </div>
                            </div>
                            <div className="bg-white border border-gray-200 shadow-xl rounded-lg py-3 px-4">
                                <label
                                    htmlFor="quantiy"
                                    className="block text-sm/6 font-medium text-gray-700"
                                >
                                    3.0 Time
                                </label>
                                <div className="flex gap-3 mt-2">
                                    <Checkbox
                                        value="Processing Time"
                                        name="time[]"
                                        checked={isChecked(
                                            "time",
                                            "Processing Time",
                                        )}
                                        onChange={() =>
                                            handleCheckboxChange(
                                                "time",
                                                "Processing Time",
                                            )
                                        }
                                    />
                                </div>
                                <div className="flex gap-3 mt-2">
                                    <Checkbox
                                        value="Turnaround Time"
                                        name="time[]"
                                        checked={isChecked(
                                            "time",
                                            "Turnaround Time",
                                        )}
                                        onChange={() =>
                                            handleCheckboxChange(
                                                "time",
                                                "Turnaround Time",
                                            )
                                        }
                                    />
                                </div>
                                <div className="flex gap-3 mt-2">
                                    <Checkbox
                                        value="Time for Project Completion "
                                        name="time[]"
                                        checked={isChecked(
                                            "time",
                                            "Time for Project Completion ",
                                        )}
                                        onChange={() =>
                                            handleCheckboxChange(
                                                "time",
                                                "Time for Project Completion ",
                                            )
                                        }
                                    />
                                </div>
                                <div className="flex gap-3 mt-2">
                                    <Checkbox
                                        value="Others: "
                                        name="time[]"
                                        checked={isChecked("time", "Others: ")}
                                        onChange={() =>
                                            handleCheckboxChange(
                                                "time",
                                                "Others: ",
                                            )
                                        }
                                        onOthersChange={(value) =>
                                            handleOthersInputChange(
                                                "time",
                                                value,
                                            )
                                        }
                                        othersValue={othersInputs.time}
                                    />
                                </div>
                            </div>
                            <div className="bg-white border border-gray-200 shadow-xl rounded-lg py-3 px-4">
                                <label
                                    htmlFor="quantiy"
                                    className="block text-sm/6 font-medium text-gray-700"
                                >
                                    4.0 Cost
                                </label>
                                <div className="flex gap-3 mt-2">
                                    <Checkbox
                                        value="Overhead Expense"
                                        name="cost[]"
                                        checked={isChecked(
                                            "cost",
                                            "Overhead Expense",
                                        )}
                                        onChange={() =>
                                            handleCheckboxChange(
                                                "cost",
                                                "Overhead Expense",
                                            )
                                        }
                                    />
                                </div>
                                <div className="flex gap-3 mt-2">
                                    <Checkbox
                                        value="Operating Cost"
                                        name="cost[]"
                                        checked={isChecked(
                                            "cost",
                                            "Operating Cost",
                                        )}
                                        onChange={() =>
                                            handleCheckboxChange(
                                                "cost",
                                                "Operating Cost",
                                            )
                                        }
                                    />
                                </div>
                                <div className="flex gap-3 mt-2">
                                    <Checkbox
                                        value="Budget Variance "
                                        name="cost[]"
                                        checked={isChecked(
                                            "cost",
                                            "Budget Variance ",
                                        )}
                                        onChange={() =>
                                            handleCheckboxChange(
                                                "cost",
                                                "Budget Variance ",
                                            )
                                        }
                                    />
                                </div>
                                <div className="flex gap-3 mt-2">
                                    <Checkbox
                                        value="Project Cost Savings "
                                        name="cost[]"
                                        checked={isChecked(
                                            "cost",
                                            "Project Cost Savings ",
                                        )}
                                        onChange={() =>
                                            handleCheckboxChange(
                                                "cost",
                                                "Project Cost Savings ",
                                            )
                                        }
                                    />
                                </div>
                                <div className="flex gap-3 mt-2">
                                    <Checkbox
                                        value="Others: "
                                        name="cost[]"
                                        checked={isChecked("cost", "Others: ")}
                                        onChange={() =>
                                            handleCheckboxChange(
                                                "cost",
                                                "Others: ",
                                            )
                                        }
                                        onOthersChange={(value) =>
                                            handleOthersInputChange(
                                                "cost",
                                                value,
                                            )
                                        }
                                        othersValue={othersInputs.cost}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-full mb-4">
                            <h2 className="text-lg font-semibold text-[#ee3124] flex items-center gap-2">
                                <span className="inline-block w-1 h-6 bg-red-600 rounded-full" />
                                Reporting Relationships
                            </h2>
                            <div className="text-sm/6">
                                <p className="text-gray-400 ">
                                    Please indicate the position of superiors as
                                    and when applicable.
                                </p>
                            </div>
                        </div>
                        <div className="bg-white border border-gray-200 shadow-xl rounded-lg py-3 px-4 mb-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="md:col-span-1">
                                    <label
                                        htmlFor="reporting-primary"
                                        className="block text-sm/6 font-medium text-gray-700"
                                    >
                                        1.0 Primary/Direct Reporting
                                        Relationship
                                    </label>
                                    <div className="relative mt-2">
                                        <input
                                            id="reporting-primary"
                                            name="reporting-primary"
                                            type="text"
                                            value={
                                                jobForm.reportingRelationships
                                                    .primary
                                            }
                                            onChange={(e) =>
                                                updateJobField(
                                                    "reportingRelationships",
                                                    "primary",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-3 py-2 shadow-sm sm:text-sm"
                                            placeholder="e.g., Management Associate"
                                        />
                                    </div>
                                </div>
                                <div className="md:col-span-1">
                                    <label
                                        htmlFor="reporting-secondary"
                                        className="block text-sm/6 font-medium text-gray-700"
                                    >
                                        2.0 Primary/Direct Reporting
                                        Relationship
                                    </label>
                                    <div className="relative mt-2">
                                        <input
                                            id="reporting-secondary"
                                            name="reporting-secondary"
                                            type="text"
                                            value={
                                                jobForm.reportingRelationships
                                                    .secondary
                                            }
                                            onChange={(e) =>
                                                updateJobField(
                                                    "reportingRelationships",
                                                    "secondary",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-3 py-2 shadow-sm sm:text-sm"
                                            placeholder="e.g., Management Associate"
                                        />
                                    </div>
                                </div>
                                <div className="md:col-span-1">
                                    <label
                                        htmlFor="reporting-tertiary"
                                        className="block text-sm/6 font-medium text-gray-700"
                                    >
                                        3.0 Primary/Direct Reporting
                                        Relationship
                                    </label>
                                    <div className="relative mt-2">
                                        <input
                                            id="reporting-tertiary"
                                            name="reporting-tertiary"
                                            type="text"
                                            value={
                                                jobForm.reportingRelationships
                                                    .tertiary
                                            }
                                            onChange={(e) =>
                                                updateJobField(
                                                    "reportingRelationships",
                                                    "tertiary",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-3 py-2 shadow-sm sm:text-sm"
                                            placeholder="e.g., Management Associate"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-full mb-4">
                            <h2 className="text-lg font-semibold text-[#ee3124] flex items-center gap-2">
                                <span className="inline-block w-1 h-6 bg-red-600 rounded-full" />
                                Levels of Authority
                            </h2>
                            <div className="text-sm/6">
                                <p className="text-gray-400 ">
                                    If line authority, please state the terminal
                                    accountability you have over specific
                                    functions/roles. If staff authority, please
                                    indicate the parties you provide
                                    professional, expert advice and service.
                                </p>
                            </div>
                        </div>

                        <div className="bg-white border border-gray-200 shadow-xl rounded-lg py-3 px-4 mb-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-1">
                                    <label
                                        htmlFor="line-authority"
                                        className="block text-sm/6 font-medium text-gray-700"
                                    >
                                        1.0 Line Authority
                                    </label>
                                    <div className="relative mt-2">
                                        <div className="mt-2">
                                            <textarea
                                                id="line-authority"
                                                name="line-authority"
                                                rows={3}
                                                value={
                                                    jobForm.levelsOfAuthority
                                                        .lineAuthority
                                                }
                                                onChange={(e) =>
                                                    updateJobField(
                                                        "levelsOfAuthority",
                                                        "lineAuthority",
                                                        e.target.value,
                                                    )
                                                }
                                                className="block w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:ring-[#ee3124] focus:border-[#ee3124] px-3 py-2 shadow-sm sm:text-sm"
                                                placeholder="Describe terminal accountability..."
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="md:col-span-1">
                                    <label
                                        htmlFor="staff-authority"
                                        className="block text-sm/6 font-medium text-gray-700"
                                    >
                                        2.0 Staff Authority
                                    </label>
                                    <div className="relative mt-2">
                                        <div className="mt-2">
                                            <textarea
                                                id="staff-authority"
                                                name="staff-authority"
                                                rows={3}
                                                value={
                                                    jobForm.levelsOfAuthority
                                                        .staffAuthority
                                                }
                                                onChange={(e) =>
                                                    updateJobField(
                                                        "levelsOfAuthority",
                                                        "staffAuthority",
                                                        e.target.value,
                                                    )
                                                }
                                                className="block w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:ring-[#ee3124] focus:border-[#ee3124] px-3 py-2 shadow-sm sm:text-sm"
                                                placeholder="Describe advisory roles..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-full mb-4">
                            <h2 className="text-lg font-semibold text-[#ee3124] flex items-center gap-2">
                                <span className="inline-block w-1 h-6 bg-red-600 rounded-full" />
                                Job Specifications
                            </h2>
                        </div>
                        <div className="bg-white border border-gray-200 shadow-xl rounded-lg py-3 px-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="md:col-span-1">
                                    <label
                                        htmlFor="educational-background"
                                        className="block text-sm/6 font-medium text-gray-700"
                                    >
                                        1.0 Educational Background
                                    </label>
                                    <div className="relative mt-2">
                                        <div className="mt-2">
                                            <textarea
                                                id="educational-background"
                                                name="educational-background"
                                                rows={3}
                                                value={
                                                    jobForm.jobSpecifications
                                                        .educationalBackground
                                                }
                                                onChange={(e) =>
                                                    updateJobField(
                                                        "jobSpecifications",
                                                        "educationalBackground",
                                                        e.target.value,
                                                    )
                                                }
                                                className="block w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:ring-[#ee3124] focus:border-[#ee3124] px-3 py-2 shadow-sm sm:text-sm"
                                                placeholder="e.g., Bachelor's degree in..."
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="md:col-span-1">
                                    <label
                                        htmlFor="license-requirement"
                                        className="block text-sm/6 font-medium text-gray-700"
                                    >
                                        2.0 License Requirement (if any)
                                    </label>
                                    <div className="relative mt-2">
                                        <div className="mt-2">
                                            <textarea
                                                id="license-requirement"
                                                name="license-requirement"
                                                rows={3}
                                                value={
                                                    jobForm.jobSpecifications
                                                        .licenseRequirement
                                                }
                                                onChange={(e) =>
                                                    updateJobField(
                                                        "jobSpecifications",
                                                        "licenseRequirement",
                                                        e.target.value,
                                                    )
                                                }
                                                className="block w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:ring-[#ee3124] focus:border-[#ee3124] px-3 py-2 shadow-sm sm:text-sm"
                                                placeholder="e.g., Professional Engineer License..."
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="md:col-span-1">
                                    <label
                                        htmlFor="work-experience"
                                        className="block text-sm/6 font-medium text-gray-700"
                                    >
                                        3.0 Years of Work Experience (Relevant
                                        to the Area of Professional Expertise)
                                    </label>
                                    <div className="relative mt-2">
                                        <div className="mt-2">
                                            <textarea
                                                id="work-experience"
                                                name="work-experience"
                                                rows={3}
                                                value={
                                                    jobForm.jobSpecifications
                                                        .workExperience
                                                }
                                                onChange={(e) =>
                                                    updateJobField(
                                                        "jobSpecifications",
                                                        "workExperience",
                                                        e.target.value,
                                                    )
                                                }
                                                className="block w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:ring-[#ee3124] focus:border-[#ee3124] px-3 py-2 shadow-sm sm:text-sm"
                                                placeholder="e.g., 5+ years in..."
                                            />
                                        </div>
                                    </div>
                                </div>
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
                                    No KRAs added yet. Click "Add KRA" to get
                                    started.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {jobForm.kras.map((kra, kraIndex) => (
                                    <div
                                        key={kraIndex}
                                        className="bg-white border border-gray-200 shadow-xl rounded-lg py-4 px-4"
                                    >
                                        {/* KRA Header with Remove Button */}
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="text-md font-semibold text-gray-800">
                                                KRA #{kraIndex + 1}
                                            </h3>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeKRA(kraIndex)
                                                }
                                                className="text-red-600 hover:text-red-800 text-sm font-medium"
                                            >
                                                Remove KRA
                                            </button>
                                        </div>

                                        {/* KRA Name */}
                                        <div className="mb-4">
                                            <label
                                                htmlFor={`kra-name-${kraIndex}`}
                                                className="block text-sm/6 font-medium text-gray-700 mb-2"
                                            >
                                                KRA Name
                                            </label>
                                            <input
                                                id={`kra-name-${kraIndex}`}
                                                type="text"
                                                value={kra.kra}
                                                onChange={(e) =>
                                                    updateKRA(
                                                        kraIndex,
                                                        "kra",
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-3 py-2 shadow-sm sm:text-sm"
                                                placeholder="e.g., Project Management"
                                            />
                                        </div>

                                        {/* KRA Description */}
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

                                        {/* Profile KRA Section */}
                                        <div className="mt-4 border-t border-gray-200 pt-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <h4 className="text-sm font-semibold text-gray-700">
                                                    KRA Details
                                                </h4>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        addProfileKRA(kraIndex)
                                                    }
                                                    className="px-2.5 py-1 bg-gray-600 hover:bg-gray-700 text-white text-xs font-medium rounded-md transition"
                                                >
                                                    + Add KRA Description
                                                </button>
                                            </div>

                                            {kra.profile_kra.length === 0 ? (
                                                <div className="bg-gray-50 border border-dashed border-gray-300 rounded-md py-4 px-3 text-center">
                                                    <p className="text-gray-400 text-xs">
                                                        No KRA descriptions
                                                        added yet.
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="space-y-3">
                                                    {kra.profile_kra.map(
                                                        (
                                                            profileKra,
                                                            profileIndex,
                                                        ) => (
                                                            <div
                                                                key={
                                                                    profileIndex
                                                                }
                                                                className="bg-gray-50 border border-gray-200 rounded-md p-3"
                                                            >
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <span className="text-xs font-medium text-gray-600">
                                                                        Detail #
                                                                        {profileIndex +
                                                                            1}
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

                                                                {/* KRA Description Field */}
                                                                <div className="mb-2">
                                                                    <label
                                                                        htmlFor={`profile-kra-desc-${kraIndex}-${profileIndex}`}
                                                                        className="block text-xs font-medium text-gray-600 mb-1"
                                                                    >
                                                                        KRA
                                                                        Description
                                                                    </label>
                                                                    <input
                                                                        id={`profile-kra-desc-${kraIndex}-${profileIndex}`}
                                                                        type="text"
                                                                        value={
                                                                            profileKra.kra_description
                                                                        }
                                                                        onChange={(
                                                                            e,
                                                                        ) =>
                                                                            updateProfileKRA(
                                                                                kraIndex,
                                                                                profileIndex,
                                                                                "kra_description",
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                            )
                                                                        }
                                                                        className="w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1.5 shadow-sm text-xs"
                                                                        placeholder="e.g., Budget Management"
                                                                    />
                                                                </div>

                                                                {/* Description Field */}
                                                                <div>
                                                                    <label
                                                                        htmlFor={`profile-desc-${kraIndex}-${profileIndex}`}
                                                                        className="block text-xs font-medium text-gray-600 mb-1"
                                                                    >
                                                                        Description
                                                                    </label>
                                                                    <textarea
                                                                        id={`profile-desc-${kraIndex}-${profileIndex}`}
                                                                        rows={2}
                                                                        value={
                                                                            profileKra.description
                                                                        }
                                                                        onChange={(
                                                                            e,
                                                                        ) =>
                                                                            updateProfileKRA(
                                                                                kraIndex,
                                                                                profileIndex,
                                                                                "description",
                                                                                e
                                                                                    .target
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
                    </>
                )}

                {currentStepId === "dev" && (
                    <div className="grid grid-cols-1 gap-4">
                        {/* <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Goals
                            </label>
                            <textarea
                                value={form.dev.goals}
                                onChange={(e) =>
                                    updateField("dev", "goals", e.target.value)
                                }
                                rows={3}
                                className="mt-1 w-full rounded-md border-gray-300 focus:border-[#ee3124] focus:ring-[#ee3124]"
                                placeholder="Short-term and long-term goals"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Training Needs
                            </label>
                            <textarea
                                value={form.dev.trainingNeeds}
                                onChange={(e) =>
                                    updateField(
                                        "dev",
                                        "trainingNeeds",
                                        e.target.value,
                                    )
                                }
                                rows={3}
                                className="mt-1 w-full rounded-md border-gray-300 focus:border-[#ee3124] focus:ring-[#ee3124]"
                                placeholder="Courses, certifications, workshops"
                            />
                        </div> */}
                    </div>
                )}

                {currentStepId === "perf" && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* <div className="md:col-span-1">
                            <label className="block text-sm font-medium text-gray-700">
                                Last Review Date
                            </label>
                            <input
                                type="date"
                                value={form.perf.lastReviewDate}
                                onChange={(e) =>
                                    updateField(
                                        "perf",
                                        "lastReviewDate",
                                        e.target.value,
                                    )
                                }
                                className="mt-1 w-full rounded-md border-gray-300 focus:border-[#ee3124] focus:ring-[#ee3124]"
                            />
                        </div>
                        <div className="md:col-span-1">
                            <label className="block text-sm font-medium text-gray-700">
                                Rating
                            </label>
                            <select
                                value={form.perf.rating}
                                onChange={(e) =>
                                    updateField(
                                        "perf",
                                        "rating",
                                        e.target.value,
                                    )
                                }
                                className="mt-1 w-full rounded-md border-gray-300 focus:border-[#ee3124] focus:ring-[#ee3124]"
                            >
                                <option value="">Select…</option>
                                <option value="1">1 - Needs Improvement</option>
                                <option value="2">2 - Fair</option>
                                <option value="3">
                                    3 - Meets Expectations
                                </option>
                                <option value="4">
                                    4 - Exceeds Expectations
                                </option>
                                <option value="5">5 - Outstanding</option>
                            </select>
                        </div>
                        <div className="md:col-span-3">
                            <label className="block text-sm font-medium text-gray-700">
                                Notes
                            </label>
                            <textarea
                                value={form.perf.notes}
                                onChange={(e) =>
                                    updateField("perf", "notes", e.target.value)
                                }
                                rows={3}
                                className="mt-1 w-full rounded-md border-gray-300 focus:border-[#ee3124] focus:ring-[#ee3124]"
                                placeholder="Manager feedback, achievements, etc."
                            />
                        </div> */}
                    </div>
                )}

                {/* Actions */}
                <div className="mt-6 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <div className="grid grid-cols-2 gap-2 w-full sm:w-auto sm:flex sm:items-center">
                        <button
                            type="button"
                            onClick={() => setStep((s) => Math.max(0, s - 1))}
                            disabled={isFirst}
                            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 w-full sm:w-auto"
                        >
                            Previous
                        </button>
                        <button
                            type="button"
                            onClick={() =>
                                setStep((s) =>
                                    Math.min(stepDefs.length - 1, s + 1),
                                )
                            }
                            disabled={isLast}
                            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 w-full sm:w-auto"
                        >
                            Next
                        </button>
                    </div>
                    <div className="flex items-center gap-3">
                        {savedStepIds[currentStepId] && (
                            <span className="text-sm text-green-600">
                                Saved
                            </span>
                        )}
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-[#ee3124] hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg disabled:opacity-50 w-full sm:w-auto"
                        >
                            {saving ? "Saving…" : "Save"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
