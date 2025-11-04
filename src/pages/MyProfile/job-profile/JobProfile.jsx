import { useState } from "react";
import { buildDropdownSections } from "../../../helper/normalize";
import JobDescriptionItem from "../../../components/JobDescriptionItem";
import CustomDropdown from "../../../components/CustomDropdown";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

export default function JobProfile({ jobProfile }) {
    const title = jobProfile?.position_title;
    const level = jobProfile?.level;
    const department = jobProfile?.department;
    const reportsTo = jobProfile?.job_profile?.reporting_to?.name;
    const kras = jobProfile?.job_profile?.job_descriptions;
    const performanceStandards =
        jobProfile?.job_profile?.job_performance_standards;
    const jobSpecifications = jobProfile?.job_profile?.job_specifications;
    const reportingRelationships =
        jobProfile?.job_profile?.reporting_relationships;
    const levelsOfAuthority = jobProfile?.job_profile?.levels_of_authority;

    // Controlled open state: single open by default, and expand-all mode
    const [openIndex, setOpenIndex] = useState(null);
    const [openIndexes, setOpenIndexes] = useState(new Set());
    const [isAllExpanded, setIsAllExpanded] = useState(false);

    const handleToggleItem = (idx, shouldOpen) => {
        if (isAllExpanded) {
            setOpenIndexes((prev) => {
                const copy = new Set(prev);
                if (shouldOpen) copy.add(String(idx));
                else copy.delete(String(idx));
                return copy;
            });
        } else {
            setOpenIndex(shouldOpen ? idx : null);
        }
    };

    const toggleAll = () => {
        if (isAllExpanded) {
            setOpenIndexes(new Set());
            setOpenIndex(null);
            setIsAllExpanded(false);
        } else {
            const all = new Set(kras.map((_, i) => String(i)));
            setOpenIndexes(all);
            setOpenIndex(null);
            setIsAllExpanded(true);
        }
    };

    return (
        <div>
            {/* Header */}
            <div className="relative bg-linear-to-r from-[#ee3124] to-red-500 text-white rounded-xl p-6 mb-8 shadow-md animate-fade-in">
                <h1 className="text-4xl font-bold mb-4 tracking-tight">
                    {title}
                </h1>
                <div className="flex flex-wrap gap-2 text-sm">
                    <span className="bg-black/80 text-white px-3 py-1.5 rounded-md font-medium">
                        Department: {department}
                    </span>
                    <span className="bg-black/80 text-white px-3 py-1.5 rounded-md font-medium">
                        Position Level: {level}
                    </span>
                    <span className="bg-black/80 text-white px-3 py-1.5 rounded-md font-medium">
                        Reports to: {reportsTo}
                    </span>
                </div>
            </div>

            {/* Job Purpose */}
            <div className="relative border-l-4 border-red-600 pl-4 mb-10 animate-slide-up">
                <h2 className="text-lg font-semibold text-[#ee3124] mb-2">
                    Job Purpose
                </h2>
                <p className="text-gray-700 leading-relaxed text-base">
                    {jobProfile?.job_profile?.job_purpose || "N/A"}
                </p>
            </div>

            {kras && kras !== undefined && (
                <div className="relative bg-white p-6 rounded-xl border border-gray-100 shadow-sm mb-10 ">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-[#ee3124] flex items-center gap-2">
                            <span className="inline-block w-1 h-6 bg-[#ee3124] rounded-full" />
                            Job Description
                        </h2>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white text-sm rounded-md shadow-sm hover:bg-gray-800"
                                onClick={toggleAll}
                            >
                                {isAllExpanded ? "Collapse All" : "Expand All"}
                            </button>
                        </div>
                    </div>
                    <div className="space-y-2">
                        {kras.map((data, idx) => {
                            const idStr = String(idx);
                            const isOpen = isAllExpanded
                                ? openIndexes.has(idStr)
                                : openIndex === idx;
                            return (
                                <JobDescriptionItem
                                    key={idx}
                                    data={data}
                                    open={!!isOpen}
                                    onToggle={(val) =>
                                        handleToggleItem(idx, val)
                                    }
                                    count={idx + 1}
                                />
                            );
                        })}
                    </div>
                </div>
            )}

            {/* 3-column grid (Dropdown style like Job Description) */}
            <DropdownGrid
                performanceStandards={performanceStandards}
                jobSpecifications={jobSpecifications}
                reportingRelationships={reportingRelationships}
                levelsOfAuthority={levelsOfAuthority}
            />
        </div>
    );
}

// Local component: 3-column dropdowns for standards/specs/relationships
function DropdownGrid({
    performanceStandards,
    jobSpecifications,
    reportingRelationships,
    levelsOfAuthority,
}) {
    const sections = buildDropdownSections(
        performanceStandards,
        jobSpecifications,
        reportingRelationships,
        levelsOfAuthority,
    );

    // Track open state per item using a Set keyed by sectionIdx-itemIdx
    const [openKeys, setOpenKeys] = useState(() => new Set());

    const toggleKey = (key, shouldOpen) => {
        setOpenKeys((prev) => {
            const next = new Set(prev);
            if (shouldOpen) next.add(key);
            else next.delete(key);
            return next;
        });
    };

    if (sections.length === 0) return null;

    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
            {sections.map((section, sIdx) => (
                <div
                    key={sIdx}
                    className="relative bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:border-red-300 transition-colors duration-300 overflow-visible"
                >
                    <h2 className="text-lg font-semibold text-[#ee3124] mb-4 flex items-center gap-2">
                        <span className="inline-block w-1 h-6 bg-red-600 rounded-full" />
                        {section.title}
                    </h2>
                    <div className="divide-y divide-gray-100">
                        {section.items.map((item, iIdx) => {
                            const key = `${sIdx}-${iIdx}`;
                            const open = openKeys.has(key);
                            return (
                                <div key={key} className="py-2">
                                    <div className="flex items-start gap-3 px-1">
                                        <dt className="flex items-center justify-center w-8 shrink-0 mt-0.5">
                                            <InformationCircleIcon
                                                className="h-5 w-5 text-[#ee3124]"
                                                aria-hidden="true"
                                            />
                                        </dt>
                                        <dd className="flex-1">
                                            <div className="w-full flex items-center">
                                                <CustomDropdown
                                                    label={
                                                        <span className="text-sm text-gray-800 font-semibold">
                                                            {item.name}
                                                        </span>
                                                    }
                                                    setOpen={() =>
                                                        toggleKey(key, !open)
                                                    }
                                                    open={open}
                                                    level={0}
                                                >
                                                    <svg
                                                        className={`w-4 h-4 ml-2 transform transition-transform duration-300 ${
                                                            open
                                                                ? "rotate-180"
                                                                : ""
                                                        }`}
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M19 9l-7 7-7-7"
                                                        />
                                                    </svg>
                                                </CustomDropdown>
                                            </div>

                                            {/* Collapsible content */}
                                            <div
                                                className={`overflow-hidden transition-all duration-300 ${
                                                    open
                                                        ? "max-h opacity-100"
                                                        : "max-h-0 opacity-0"
                                                }`}
                                            >
                                                <ul className="mt-2 ml-1 list-disc list-inside text-sm text-gray-700 space-y-1">
                                                    {item.values &&
                                                    item.values.length > 0 ? (
                                                        item.values.map(
                                                            (val, vIdx) => (
                                                                <li key={vIdx}>
                                                                    {val}
                                                                </li>
                                                            ),
                                                        )
                                                    ) : (
                                                        <li className="italic text-gray-500">
                                                            No values provided
                                                        </li>
                                                    )}
                                                </ul>
                                            </div>
                                        </dd>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}
