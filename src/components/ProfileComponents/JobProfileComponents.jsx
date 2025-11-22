import { InformationCircleIcon, ChevronDoubleDownIcon, ChevronDoubleUpIcon } from "@heroicons/react/24/outline";
import CustomDropdown from "../CustomDropdown";
import JobDescriptionItem from "./JobDescriptionItem";

/**
 * Header component for job profile with title and meta info
 */
export function JobProfileHeader({ title, department, level }) {
    return (
        <div className="relative bg-linear-to-r from-[#ee3124] to-red-500 text-white rounded-xl p-3 mb-6 shadow-md animate-fade-in">
            <h1 className="text-2xl font-bold mb-4 tracking-tight">{title}</h1>
            <div className="flex flex-wrap gap-2 text-sm">
                <span className="bg-black/80 text-white px-3 py-1.5 rounded-md font-medium">
                    Department: {department}
                </span>
                <span className="bg-black/80 text-white px-3 py-1.5 rounded-md font-medium">
                    Position Level: {level}
                </span>
                {/* <span className="bg-black/80 text-white px-3 py-1.5 rounded-md font-medium">
                    Reports to: {reportsTo}
                </span> */}
            </div>
        </div>
    );
}

/**
 * Job purpose section with red border accent
 */
export function JobPurposeSection({ jobPurpose }) {
    return (
        <div className="relative border-l-4 border-red-600 pl-4 mb-10 animate-slide-up">
            <h2 className="text-lg font-semibold text-[#ee3124] mb-2">
                Job Purpose
            </h2>
            <p className="text-gray-700 leading-relaxed text-base">
                {jobPurpose || "N/A"}
            </p>
        </div>
    );
}

/**
 * Job descriptions section with expand/collapse functionality
 */
export function JobDescriptionsSection({
    kras,
    isAllExpanded,
    openIndex,
    openIndexes,
    onToggleItem,
    onToggleAll,
}) {
    if (!kras || kras.length === 0) return null;

    return (
        <div className="relative bg-white p-6 rounded-xl border border-gray-100 shadow-sm mb-10">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[#ee3124] flex items-center gap-2">
                    <span className="inline-block w-1 h-6 bg-[#ee3124] rounded-full" />
                    Job Description
                </h2>
                <button
                    type="button"
                    className="inline-flex items-center gap-1 px-3 py-1 bg-gray-200 text-gray-900 text-sm rounded-md shadow-sm hover:bg-gray-300 transition"
                    onClick={onToggleAll}
                    title={isAllExpanded ? "Collapse All" : "Expand All"}
                >
                    {isAllExpanded ? (
                        <ChevronDoubleUpIcon className="w-4 h-4" />
                    ) : (
                        <ChevronDoubleDownIcon className="w-4 h-4" />
                    )}
                </button>
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
                            onToggle={(val) => onToggleItem(idx, val)}
                            count={idx + 1}
                        />
                    );
                })}
            </div>
        </div>
    );
}

/**
 * Individual dropdown item for performance standards, specifications, etc.
 */
export function DropdownItem({ item, open, onToggle }) {
    return (
        <div className="py-2">
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
                            setOpen={onToggle}
                            open={open}
                            level={0}
                        >
                            <svg
                                className={`w-4 h-4 ml-2 transform transition-transform duration-300 ${
                                    open ? "rotate-180" : ""
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
                            open ? "max-h opacity-100" : "max-h-0 opacity-0"
                        }`}
                    >
                        <ul className="mt-2 ml-1 list-disc list-inside text-sm text-gray-700 space-y-1">
                            {item.values && item.values.length > 0 ? (
                                item.values.map((val, vIdx) => (
                                    <li key={vIdx}>{val}</li>
                                ))
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
}

/**
 * Section card for dropdown items (Performance Standards, Job Specifications, etc.)
 */
export function DropdownSection({ title, items, openKeys, onToggleKey, sectionIndex }) {
    // Check if all items in this section are expanded
    const allItemKeys = items.map((_, iIdx) => `${sectionIndex}-${iIdx}`);
    const isAllExpanded = allItemKeys.every(key => openKeys.has(key));

    const toggleAllInSection = () => {
        if (isAllExpanded) {
            // Collapse all items in this section
            allItemKeys.forEach(key => onToggleKey(key, false));
        } else {
            // Expand all items in this section
            allItemKeys.forEach(key => onToggleKey(key, true));
        }
    };

    return (
        <div className="relative bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:border-red-300 transition-colors duration-300 overflow-visible">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[#ee3124] flex items-center gap-2">
                    <span className="inline-block w-1 h-6 bg-red-600 rounded-full" />
                    {title}
                </h2>
                <button
                    type="button"
                    className="inline-flex items-center gap-1 px-3 py-1 bg-gray-200 text-gray-900 text-sm rounded-md shadow-sm hover:bg-gray-300 transition"
                    onClick={toggleAllInSection}
                    title={isAllExpanded ? "Collapse All" : "Expand All"}
                >
                    {isAllExpanded ? (
                        <ChevronDoubleUpIcon className="w-4 h-4" />
                    ) : (
                        <ChevronDoubleDownIcon className="w-4 h-4" />
                    )}
                </button>
            </div>
            <div className="divide-y divide-gray-100">
                {items.map((item, iIdx) => {
                    const key = `${sectionIndex}-${iIdx}`;
                    const open = openKeys.has(key);
                    return (
                        <DropdownItem
                            key={key}
                            item={item}
                            open={open}
                            onToggle={() => onToggleKey(key, !open)}
                        />
                    );
                })}
            </div>
        </div>
    );
}
