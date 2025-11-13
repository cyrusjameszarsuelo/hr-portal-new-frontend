import CustomDropdown from "../CustomDropdown";

export default function JobDescriptionItem({
    data,
    level = 0,
    open = false,
    onToggle = () => {},
    count,
}) {

    return (
        <div
            className={`mb-3 ${level === 0 ? "border-b border-gray-200" : ""}`}
        >
            <div className="w-full flex items-center py-1 px-4">
                <CustomDropdown
                    label={
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <span className="hidden lg:inline-block px-3 py-1 bg-[#ee3124] text-white text-xs font-bold rounded-full shadow-sm">
                                    SUBFUNCTION
                                </span>
                                <span className="text-base font-bold text-[#ee3124]">
                                    {data.subfunction_position.name}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 pl-1">
                                <span className="text-gray-600 text-sm font-medium">
                                    {count}.0 KRA:
                                </span>
                                <span className="text-gray-900 text-sm font-semibold">
                                    {data.job_profile_kra.kra}
                                </span>
                            </div>
                        </div>
                    }
                    setOpen={() => onToggle(!open)}
                    open={open}
                    level={level}
                >
                    <svg
                        className={`w-5 h-5 ml-2 transform transition-transform duration-300 ${
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

            <div
                className={`overflow-hidden transition-all duration-300 ${
                    open ? "max-h opacity-100" : "max-h-0 opacity-0"
                }`}
            >
                {data.description && (
                    <div className="pl-4 border-l border-gray-300 mt-3">
                        <div
                            className={`transition-all duration-300 ${
                                open ? "opacity-100" : "max-h-0 opacity-0"
                            } overflow-hidden`}
                        >
                            {data.description}

                            {data.profile_kras && (
                                <div className="overflow-x-auto mt-4 px-4 pb-4">
                                    <div className="inline-block min-w-full align-middle">
                                        <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                                            <table className="min-w-full divide-y divide-gray-200 table-auto">
                                                <thead className="bg-[#f3f4f6]">
                                                    <tr>
                                                        <th
                                                            scope="col"
                                                            className=" px-4 py-3 text-left text-xs font-semibold text-black uppercase"
                                                        >
                                                            Duties &
                                                            Responsibilities
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className=" px-4 py-3 text-left text-xs font-semibold text-black uppercase"
                                                        >
                                                            Deliverables
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-100">
                                                    {data.profile_kras.map(
                                                        (row, rowIndex) => (
                                                            <tr
                                                                key={rowIndex}
                                                                className={
                                                                    rowIndex %
                                                                        2 ===
                                                                    0
                                                                        ? "bg-white hover:bg-red-50"
                                                                        : "bg-gray-100 hover:bg-red-50"
                                                                }
                                                            >
                                                                <td className=" px-4 py-3 border-r border-gray-200 align-top text-sm text-gray-700 whitespace-pre-wrap">
                                                                    <span className="font-bold mr-2">
                                                                        {count}.
                                                                        {rowIndex +
                                                                            1}
                                                                    </span>
                                                                    {
                                                                        row.kra_description
                                                                    }
                                                                </td>
                                                                <td className=" px-4 py-3 align-top text-sm text-gray-700">
                                                                    {
                                                                        row.deliverables
                                                                    }
                                                                </td>
                                                            </tr>
                                                        ),
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
