import React from "react";
import Checkbox from "../Forms/Checkbox";

export default function PerformanceStandards({ performanceOptions, checkedValues, othersInputs, onToggle, onOthersChange }) {
    const isChecked = (category, value) => checkedValues[category]?.includes(value) || false;

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="md:col-span-full">
                <h2 className="text-lg font-semibold text-[#ee3124] flex items-center gap-2">
                    <span className="inline-block w-1 h-6 bg-red-600 rounded-full" />
                    Job Performance Standards <span className="text-red-600">*</span>
                </h2>
                <div className="text-sm/6">
                    <p className="text-gray-400">Number, Frequency, Percentage</p>
                    <p className="text-gray-400 text-xs mb-2">(Please check all that apply)</p>
                </div>
            </div>
            {["quantity", "quality", "time", "cost"].map((category, idx) => (
                <div key={category} className="bg-white border border-gray-200 shadow-xl rounded-lg py-3 px-4">
                    <label className="block text-sm/6 font-medium text-gray-700">
                        {idx + 1}.0 {category.charAt(0).toUpperCase() + category.slice(1)}
                    </label>
                    {performanceOptions[category].map((option) => (
                        <div key={option} className="flex gap-3 mt-2">
                            <Checkbox
                                value={option}
                                name={`${category}[]`}
                                checked={isChecked(category, option)}
                                onChange={() => onToggle(category, option)}
                            />
                        </div>
                    ))}
                    <div className="flex gap-3 mt-2">
                        <Checkbox
                            value="Others: "
                            name={`${category}[]`}
                            checked={isChecked(category, "Others: ")}
                            onChange={() => onToggle(category, "Others: ")}
                            onOthersChange={(value) => onOthersChange(category, value)}
                            othersValue={othersInputs[category]}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}
