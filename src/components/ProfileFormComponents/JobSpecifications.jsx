import React, { useState } from "react";

export default function JobSpecifications({
    values,
    onChange,
    setOpenConfirm,
}) {
    const fields = [
        {
            key: "educationalBackground",
            label: "Educational Background",
            placeholder: "e.g., Bachelor's degree in...",
        },
        {
            key: "licenseRequirement",
            label: "License Requirement (if any)",
            placeholder: "e.g., Professional Engineer License...",
        },
        {
            key: "workExperience",
            label: "Years of Work Experience (Relevant to the Area of Professional Expertise)",
            placeholder: "e.g., 5+ years in...",
        },
    ];

    // Local inputs for adding new values per field
    const [inputs, setInputs] = useState({
        educationalBackground: "",
        licenseRequirement: "",
        workExperience: "",
    });

    const addValue = (key) => {
        const raw = inputs[key] ?? "";
        const val = raw.trim();
        if (!val) return;
        const current = Array.isArray(values[key]) ? values[key] : [];
        // prevent duplicates (case-insensitive)
        const exists = current.some(
            (v) => String(v).toLowerCase() === val.toLowerCase(),
        );
        if (exists) {
            // clear input but don't add duplicate
            setInputs((prev) => ({ ...prev, [key]: "" }));
            return;
        }
        onChange(key, [...current, val]);
        setInputs((prev) => ({ ...prev, [key]: "" }));
    };

    const removeValue = (key, index) => {
        const current = Array.isArray(values[key]) ? values[key] : [];
        const next = current.filter((_, i) => i !== index);
        onChange(key, next);
    };

    return (
        <>
            <div className="md:col-span-full mb-4">
                <h2 className="text-lg font-semibold text-[#ee3124] flex items-center gap-2">
                    <span className="inline-block w-1 h-6 bg-red-600 rounded-full" />
                    Job Specifications
                </h2>
            </div>
            <div className="bg-white border border-gray-200 shadow-xl rounded-lg py-3 px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {fields.map((item, idx) => {
                        const items = Array.isArray(values[item.key])
                            ? values[item.key]
                            : [];
                        return (
                            <div key={item.key} className="md:col-span-1">
                                <label
                                    htmlFor={item.key}
                                    className="block text-sm/6 font-medium text-gray-700"
                                >
                                    {idx + 1}.0 {item.label}{" "}
                                    <span className="text-red-600">*</span>
                                </label>
                                <div className="mt-2">
                                    {/* Chips/List */}
                                    {items.length > 0 ? (
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {items.map((val, i) => (
                                                <span
                                                    key={`${item.key}-${i}`}
                                                    className="inline-flex items-center gap-1 bg-gray-100 border border-gray-300 text-gray-700 px-2 py-1 rounded-lg text-xs"
                                                >
                                                    {val}
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setOpenConfirm({
                                                                open: true,
                                                                title: "Remove Entry",
                                                                message:
                                                                    "This will remove the entry for the Job Specifications. Do you want to continue?",
                                                                onConfirm: () =>
                                                                    removeValue(
                                                                        item.key,
                                                                        i,
                                                                    ),
                                                            })
                                                        }
                                                        className="ml-1 text-gray-500 hover:text-red-600"
                                                        aria-label={`Remove ${val}`}
                                                    >
                                                        ✕
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-xs text-gray-400 mb-2">
                                            No entries yet.
                                        </p>
                                    )}

                                    {/* Add input */}
                                    <div className="flex items-start gap-2">
                                        <textarea
                                            id={item.key}
                                            name={item.key}
                                            value={inputs[item.key] || ""}
                                            onChange={(e) =>
                                                setInputs((prev) => ({
                                                    ...prev,
                                                    [item.key]: e.target.value,
                                                }))
                                            }
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" && !e.shiftKey) {
                                                    e.preventDefault();
                                                    addValue(item.key);
                                                }
                                            }}
                                            className="block w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:ring-[#ee3124] focus:border-[#ee3124] px-3 py-2 shadow-sm sm:text-sm h-20 sm:h-20"
                                            placeholder={`${item.placeholder} (press Enter to add)`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => addValue(item.key)}
                                            className="shrink-0 px-3 py-2 bg-[#ee3124] hover:bg-red-600 text-white text-xs font-medium rounded-md"
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
