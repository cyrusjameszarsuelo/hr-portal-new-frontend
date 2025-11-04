const data = [
    {
        performance_area: "Individual Objectives & Deliverables",
        weight: "80%",
        actual_rating: "4.5",
        calculated_rating: "1.8",
        calibrated_rating: "4.3",
        objectives: [
            {
                description: "Complete project A with high standards",
                weight: "40%",
                actual_rating: "3",
                calculated_rating: "3",
                calibrated_rating: "3",
            },
            {
                description: "Complete project A with high standards",
                weight: "40%",
                actual_rating: "3",
                calculated_rating: "3",
                calibrated_rating: "3",
            },
        ],
    },
    {
        performance_area: "Competencies & Values",
        weight: "20%",
        actual_rating: "4.0",
        calculated_rating: "4.0",
        calibrated_rating: "4.0",
        objectives: [
            {
                description: "Meet all project deadlines",
                weight: "20%",
                actual_rating: "4",
                calculated_rating: "4",
                calibrated_rating: "4",
            },
        ],
    },
];

import React, { useState } from "react";

export default function PerformanceManagement() {
    const [expandedRows, setExpandedRows] = useState([]);

    // Compute summary values
    const totalWeight = data.reduce(
        (sum, row) => sum + parseFloat(row.weight),
        0,
    );
    const avgActual = (
        data.reduce((sum, row) => sum + parseFloat(row.actual_rating), 0) /
        data.length
    ).toFixed(2);
    const avgCalculated = (
        data.reduce((sum, row) => sum + parseFloat(row.calculated_rating), 0) /
        data.length
    ).toFixed(2);
    const avgCalibrated = (
        data.reduce((sum, row) => sum + parseFloat(row.calibrated_rating), 0) /
        data.length
    ).toFixed(2);

    const toggleRow = (idx) => {
        setExpandedRows((prev) =>
            prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx],
        );
    };

    return (
        <>
            <div className="relative border-l-4 border-red-600 pl-4 mb-10 animate-slide-up">
                <h2 className="text-lg font-semibold text-[#ee3124] mb-2">
                    Individual Contributor Form
                </h2>
                <p className="text-gray-700 leading-relaxed text-base">
                    Status: Department Head Calibration
                </p>
            </div>
            <div className="bg-white border border-gray-200 shadow-xl rounded-lg p-4 mb-4">
                <SectionTitle>Overall Rating</SectionTitle>
                <div className="mt-3 text-sm">
                    <div className="overflow-x-auto">
                        <div className="inline-block min-w-full align-middle">
                            <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                                <table className="min-w-full divide-y divide-gray-200 table-auto ">
                                    <thead className="bg-[#ee3124] ">
                                        <tr className="text-center">
                                            <th className="px-2 py-3 text-xs font-semibold text-white uppercase w-8"></th>
                                            <th className="px-4 py-3 text-xs font-semibold text-white uppercase">
                                                Performance Area
                                            </th>
                                            <th className="px-4 py-3 text-xs font-semibold text-white uppercase">
                                                Weight
                                            </th>
                                            <th className="px-4 py-3 text-xs font-semibold text-white uppercase">
                                                Actual Rating
                                            </th>
                                            <th className="px-4 py-3 text-xs font-semibold text-white uppercase">
                                                Calculated Rating
                                            </th>
                                            <th className="px-4 py-3 text-xs font-semibold text-white uppercase">
                                                Calibrated Rating
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-100  text-center">
                                        {data.map((row, idx) => (
                                            <React.Fragment key={idx}>
                                                <tr className="bg-white hover:bg-red-50">
                                                    <td
                                                        className="px-2 py-3 text-center cursor-pointer"
                                                        onClick={() =>
                                                            toggleRow(idx)
                                                        }
                                                    >
                                                        {expandedRows.includes(
                                                            idx,
                                                        ) ? (
                                                            <span className="text-xl font-bold text-[#ee3124]">
                                                                &minus;
                                                            </span>
                                                        ) : (
                                                            <span className="text-xl font-bold text-[#ee3124]">
                                                                +
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-700">
                                                        {row.performance_area}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-700">
                                                        {row.weight}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-700">
                                                        {row.actual_rating}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-700">
                                                        {row.calculated_rating}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-700">
                                                        {row.calibrated_rating}
                                                    </td>
                                                </tr>
                                                {expandedRows.includes(idx) && (
                                                    <React.Fragment>
                                                        {row.objectives.map(
                                                            (obj, oidx) => (
                                                                <tr
                                                                    key={oidx}
                                                                    className="bg-gray-50"
                                                                >
                                                                    <td></td>
                                                                    <td className="px-4 py-2 text-xs text-gray-700 border-l-4 border-[#ee3124]">
                                                                        {
                                                                            obj.description
                                                                        }
                                                                    </td>
                                                                    <td className="px-4 py-2 text-xs text-gray-700">
                                                                        {
                                                                            obj.weight
                                                                        }
                                                                    </td>
                                                                    <td className="px-4 py-2 text-xs text-gray-700">
                                                                        {
                                                                            obj.actual_rating
                                                                        }
                                                                    </td>
                                                                    <td className="px-4 py-2 text-xs text-gray-700">
                                                                        {
                                                                            obj.calculated_rating
                                                                        }
                                                                    </td>
                                                                    <td className="px-4 py-2 text-xs text-gray-700">
                                                                        {
                                                                            obj.calibrated_rating
                                                                        }
                                                                    </td>
                                                                </tr>
                                                            ),
                                                        )}
                                                    </React.Fragment>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr className="bg-gray-200 font-semibold text-center">
                                            <td></td>
                                            <td className="px-4 py-2 text-gray-700">
                                                Total Rating
                                            </td>
                                            <td className="px-4 py-2 text-gray-700">
                                                {totalWeight}%
                                            </td>
                                            <td className="px-4 py-2 text-gray-700">
                                                {avgActual}
                                                <p className="font-light text-[12px]">
                                                    Exceeds Expectations
                                                </p>
                                            </td>
                                            <td className="px-4 py-2 text-gray-700">
                                                {avgCalculated}
                                                <p className="font-light text-[12px]">
                                                    Exceeds Expectations
                                                </p>
                                            </td>
                                            <td className="px-4 py-2 text-gray-700">
                                                {avgCalibrated}
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-gray-200 shadow-xl rounded-lg p-4">
                <SectionTitle>Remarks</SectionTitle>
                <div className="mt-3 text-sm">
                    <div className="overflow-x-auto">
                        <div className="inline-block min-w-full align-middle">
                            <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                                <table className="min-w-full divide-y divide-gray-200 table-auto">
                                    <thead className="bg-[#ee3124]">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase">
                                                Employee Remarks
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase">
                                                Supervisor Remarks
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-100">
                                        <tr className="bg-gray-50">
                                            <td className="px-4 py-2 text-xs text-gray-700 h-20"></td>
                                            <td className="px-4 py-2 text-xs text-gray-700 h-20"></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

function SectionTitle({ children }) {
    return (
        <h2 className="text-lg font-semibold text-[#ee3124] flex items-center gap-2">
            <span className="inline-block w-1 h-6 bg-red-600 rounded-full" />
            {children}
        </h2>
    );
}
