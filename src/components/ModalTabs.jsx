import React, { useState } from "react";

export default function ModalTabs({
    orgHeadCount = { data: [], totals: {} },
    isLoadingHeadCount = false,
    orgHeadCountPerDept = { data: [] },
    isLoadingDept = false,
}) {
    const [activeModalTab, setActiveModalTab] = useState({
        active: 1,
        department: "",
    });

    return (
        <div>
            {/* Tab headers */}
            <div className="flex-1 border-b mb-4">
                <button
                    type="button"
                    className={`px-4 py-2 -mb-px font-medium ${
                        activeModalTab.active === 1
                            ? "border-b-2 border-[#ee3124] text-[#ee3124]"
                            : "text-gray-600"
                    }`}
                    onClick={() =>
                        setActiveModalTab((prev) => {
                            return { ...prev, active: 1 };
                        })
                    }
                >
                    Headcount
                </button>

                {!isLoadingHeadCount &&
                    orgHeadCount.data.map((row, key) => (
                        <button
                            key={key}
                            type="button"
                            className={`px-4 py-2 -mb-px font-medium ${
                                activeModalTab.active === key + 2
                                    ? "border-b-2 border-[#ee3124] text-[#ee3124]"
                                    : "text-gray-600"
                            }`}
                            onClick={() =>
                                setActiveModalTab((prev) => {
                                    return {
                                        ...prev,
                                        active: key + 2,
                                        department: row.department,
                                    };
                                })
                            }
                        >
                            {row.department}
                        </button>
                    ))}
            </div>

            {/* Tab panels */}
            <div>
                {activeModalTab.active === 1 && (
                    <div style={{ overflowX: "auto" }}>
                        <table
                            className="w-full text-sm"
                            style={{ borderCollapse: "collapse" }}
                        >
                            <thead>
                                <tr className="bg-[#ee3124] text-white">
                                    <th className="px-3 py-2 border border-black w-24">
                                        Department
                                    </th>
                                    <th className="px-3 py-2 border border-black w-24">
                                        Approved
                                    </th>
                                    <th className="px-3 py-2 border border-black w-24">
                                        Filled
                                    </th>
                                    <th className="px-3 py-2 border border-black w-24">
                                        Vacant
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {!isLoadingHeadCount &&
                                    orgHeadCount.data.map((row) => (
                                        <tr key={row.department}>
                                            <td className="px-3 py-2 text-center border border-black">
                                                {row.department}
                                            </td>
                                            <td className="px-3 py-2 text-center border border-black">
                                                {row.headcount}
                                            </td>
                                            <td className="px-3 py-2 text-center border border-black">
                                                {row.headcount - row.vacant}
                                            </td>
                                            <td className="px-3 py-2 text-center border border-black">
                                                {row.vacant}
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                            {!isLoadingHeadCount && (
                                <tfoot>
                                    <tr className="font-semibold text-black bg-[#dcdbdb]">
                                        <td className="px-3 py-2 text-center border border-black">
                                            Total
                                        </td>
                                        <td className="px-3 py-2 text-center border border-black">
                                            {orgHeadCount.totals.headcount}
                                        </td>
                                        <td className="px-3 py-2 text-center border border-black">
                                            {orgHeadCount.totals.filled}
                                        </td>
                                        <td className="px-3 py-2 text-center border border-black">
                                            {orgHeadCount.totals.vacant}
                                        </td>
                                    </tr>
                                </tfoot>
                            )}
                        </table>
                    </div>
                )}

                {!isLoadingDept &&
                    orgHeadCount.data.map(
                        (row, key) =>
                            activeModalTab.active === key + 2 && (
                                <div key={key} style={{ overflowX: "auto" }}>
                                    <h2 className="text-lg font-semibold mb-4">
                                        {activeModalTab.department} Department
                                    </h2>
                                    <table
                                        className="w-full text-sm"
                                        style={{ borderCollapse: "collapse" }}
                                    >
                                        <thead>
                                            <tr className="bg-[#ee3124] text-white">
                                                <th className="px-3 py-2 border border-black w-24">
                                                    Position
                                                </th>
                                                <th className="px-3 py-2 border border-black w-24">
                                                    Approved
                                                </th>
                                                <th className="px-3 py-2 border border-black w-24">
                                                    Filled
                                                </th>
                                                <th className="px-3 py-2 border border-black w-24">
                                                    Vacant
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {orgHeadCountPerDept.data
                                                .filter(
                                                    (dept) =>
                                                        dept.department ===
                                                        activeModalTab.department,
                                                )
                                                .map((dept, key) => (
                                                    <tr key={key}>
                                                        <td className="px-3 py-2 text-center border border-black">
                                                            {
                                                                dept.position_title
                                                            }
                                                        </td>
                                                        <td className="px-3 py-2 text-center border border-black">
                                                            {dept.headcount}
                                                        </td>
                                                        <td className="px-3 py-2 text-center border border-black">
                                                            {dept.headcount -
                                                                dept.vacant}
                                                        </td>
                                                        <td className="px-3 py-2 text-center border border-black">
                                                            {dept.vacant}
                                                        </td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                        <tfoot>
                                            <tr className="font-semibold text-black bg-[#dcdbdb]">
                                                <td className="px-3 py-2 text-center border border-black">
                                                    Total
                                                </td>
                                                <td className="px-3 py-2 text-center border border-black">
                                                    {row.headcount}
                                                </td>
                                                <td className="px-3 py-2 text-center border border-black">
                                                    {row.headcount - row.vacant}
                                                </td>
                                                <td className="px-3 py-2 text-center border border-black">
                                                    {row.vacant}
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            ),
                    )}
            </div>
        </div>
    );
}
