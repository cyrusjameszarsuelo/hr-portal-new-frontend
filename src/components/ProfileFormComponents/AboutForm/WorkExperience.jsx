import React, { useEffect, useState } from "react";
import { getPositionTitle } from "@/database/position_title";

export default function WorkExperience({
    form,
    dispatch,
    functionsList = [],
    department,
    addRow,
    updateRow,
    confirmRemoveAssignment,
    confirmRemoveRow,
}) {
    const [positionTitles, setPositionTitles] = useState([]);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const data = await getPositionTitle();
                if (!mounted) return;
                const list = Array.isArray(data) ? data : [];
                const toText = (item) =>
                    typeof item === "string"
                        ? item
                        : item?.position_title || item?.title || item?.name || "";
                const normalized = Array.from(new Set(list.map(toText).filter(Boolean)));
                setPositionTitles(normalized);
            } catch (err) {
                console.error("Failed to load position titles:", err);
            }
        })();
        return () => {
            mounted = false;
        };
    }, []);
    const updateMegawideField = (key, value) =>
        dispatch({
            type: "APPLY_UPDATER",
            updater: (p) => ({
                ...p,
                megawide_work_experience: {
                    ...p.megawide_work_experience,
                    [key]: value,
                },
            }),
        });

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Left column: Megawide Work Experience */}
            <div>
                <div className="bg-white border border-gray-200 shadow-xl rounded-lg p-4 h-full">
                    <h2 className="text-lg font-semibold text-[#ee3124] flex items-center gap-2">
                        <span className="inline-block w-1 h-6 bg-red-600 rounded-full" />
                        Megawide Work Experience
                    </h2>
                    <div className="mt-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-700">Job Title</label>
                                <select
                                    value={form.megawide_work_experience.job_title}
                                    onChange={(e) => updateMegawideField("job_title", e.target.value)}
                                    className="mt-1 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1.5 shadow-sm text-xs"
                                >
                                    <option value="">Select position…</option>
                                    {positionTitles.map((t) => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700">Department</label>
                                <input
                                    type="text"
                                    value={form.megawide_work_experience.department}
                                    onChange={(e) => updateMegawideField("department", e.target.value)}
                                    className="mt-1 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1.5 shadow-sm text-xs"
                                    placeholder="e.g., OCEO"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700">Unit</label>
                                <input
                                    type="text"
                                    value={form.megawide_work_experience.unit}
                                    onChange={(e) => updateMegawideField("unit", e.target.value)}
                                    className="mt-1 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1.5 shadow-sm text-xs"
                                    placeholder="e.g., OCEO"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700">Job Level</label>
                                <input
                                    type="text"
                                    value={form.megawide_work_experience.job_level}
                                    onChange={(e) => updateMegawideField("job_level", e.target.value)}
                                    className="mt-1 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1.5 shadow-sm text-xs"
                                    placeholder="e.g., Managerial"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700">Employment Status</label>
                                <input
                                    type="text"
                                    value={form.megawide_work_experience.employment_status}
                                    onChange={(e) => updateMegawideField("employment_status", e.target.value)}
                                    className="mt-1 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1.5 shadow-sm text-xs"
                                    placeholder="e.g., Regular"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700">Current Role Start Date</label>
                                <input
                                    type="date"
                                    value={form.megawide_work_experience.current_role_start_date}
                                    onChange={(e) => updateMegawideField("current_role_start_date", e.target.value)}
                                    className="mt-1 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1.5 shadow-sm text-xs"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700">Current Role End Date</label>
                                <input
                                    type="date"
                                    value={form.megawide_work_experience.current_role_end_date}
                                    onChange={(e) => updateMegawideField("current_role_end_date", e.target.value)}
                                    className="mt-1 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1.5 shadow-sm text-xs"
                                    disabled={!!form.megawide_work_experience.is_current}
                                />
                            </div>
                            <div className="flex items-center">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={!!form.megawide_work_experience.is_current}
                                        onChange={(e) => updateMegawideField("is_current", e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300 text-[#ee3124] focus:ring-[#ee3124]"
                                    />
                                    <span className="text-xs font-medium text-gray-700">Currently Working</span>
                                </label>
                            </div>
                        </div>

                        {/* Subfunction Positions Multi-Select */}
                        <div className="mt-4">
                            <label className="block text-xs font-medium text-gray-700 mb-2">Subfunction Positions</label>
                            <div className="border border-gray-300 rounded-md p-3 bg-gray-50 max-h-48 overflow-y-auto">
                                {!department ? (
                                    <p className="text-xs text-gray-500 italic">Loading department information...</p>
                                ) : functionsList.length > 0 ? (
                                    functionsList.map((subfunc) => (
                                        <label key={subfunc.id} className="flex items-center gap-2 mb-2 hover:bg-gray-100 p-1 rounded">
                                            <input
                                                type="checkbox"
                                                checked={form.megawide_work_experience.functions.some((f) => f.id === subfunc.id)}
                                                onChange={(e) => {
                                                    dispatch({
                                                        type: "APPLY_UPDATER",
                                                        updater: (p) => ({
                                                            ...p,
                                                            megawide_work_experience: {
                                                                ...p.megawide_work_experience,
                                                                functions: e.target.checked
                                                                    ? [
                                                                          ...p.megawide_work_experience.functions,
                                                                          { id: subfunc.id },
                                                                      ]
                                                                    : p.megawide_work_experience.functions.filter((f) => f.id !== subfunc.id),
                                                            },
                                                        }),
                                                    });
                                                }}
                                                className="h-4 w-4 rounded border-gray-300 text-[#ee3124] focus:ring-[#ee3124]"
                                            />
                                            <span className="text-xs text-gray-700">{subfunc.subfunction_title || subfunc.name}</span>
                                        </label>
                                    ))
                                ) : (
                                    <p className="text-xs text-gray-500 italic">No subfunction positions available for this department.</p>
                                )}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Selected: {form.megawide_work_experience.functions.length} subfunction position(s)</p>
                        </div>

                        {/* Previous Assignments within Megawide */}
                        <div className="mt-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-semibold text-gray-700">Previous Assignments within Megawide</span>
                                <button
                                    type="button"
                                    onClick={() =>
                                        dispatch({
                                            type: "APPLY_UPDATER",
                                            updater: (p) => ({
                                                ...p,
                                                megawide_work_experience: {
                                                    ...p.megawide_work_experience,
                                                    previous_assignments: [
                                                        ...(p.megawide_work_experience.previous_assignments || []),
                                                        {
                                                            sbu: "",
                                                            worked_in_megawide: true,
                                                            previous_department: "",
                                                            previous_job_title: "",
                                                            previous_role_start_date: "",
                                                            end_of_assignment: "",
                                                        },
                                                    ],
                                                },
                                            }),
                                        })
                                    }
                                    className="px-2 py-1 bg-gray-600 hover:bg-gray-700 text-white text-[11px] font-medium rounded-md"
                                >
                                    + Add Assignment
                                </button>
                            </div>

                            {form.megawide_work_experience.previous_assignments?.length ? (
                                <div className="space-y-3">
                                    {form.megawide_work_experience.previous_assignments.map((assign, aIdx) => (
                                        <div key={aIdx} className="border border-gray-200 rounded-md p-2">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                <div>
                                                    <label className="block text-[11px] font-medium text-gray-700">SBU</label>
                                                    <input
                                                        type="text"
                                                        value={assign.sbu}
                                                        onChange={(e) =>
                                                            dispatch({
                                                                type: "APPLY_UPDATER",
                                                                updater: (p) => ({
                                                                    ...p,
                                                                    megawide_work_experience: {
                                                                        ...p.megawide_work_experience,
                                                                        previous_assignments: p.megawide_work_experience.previous_assignments.map((a, i) =>
                                                                            i === aIdx ? { ...a, sbu: e.target.value } : a,
                                                                        ),
                                                                    },
                                                                }),
                                                            })
                                                        }
                                                        className="mt-1 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1 shadow-sm text-[11px]"
                                                        placeholder="e.g., CORP"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-medium text-gray-700">Previous Department</label>
                                                    <input
                                                        type="text"
                                                        value={assign.previous_department}
                                                        onChange={(e) =>
                                                            dispatch({
                                                                type: "APPLY_UPDATER",
                                                                updater: (p) => ({
                                                                    ...p,
                                                                    megawide_work_experience: {
                                                                        ...p.megawide_work_experience,
                                                                        previous_assignments: p.megawide_work_experience.previous_assignments.map((a, i) =>
                                                                            i === aIdx ? { ...a, previous_department: e.target.value } : a,
                                                                        ),
                                                                    },
                                                                }),
                                                            })
                                                        }
                                                        className="mt-1 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1 shadow-sm text-[11px]"
                                                        placeholder="e.g., HRD"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-medium text-gray-700">Previous Job Title</label>
                                                    <input
                                                        type="text"
                                                        value={assign.previous_job_title}
                                                        onChange={(e) =>
                                                            dispatch({
                                                                type: "APPLY_UPDATER",
                                                                updater: (p) => ({
                                                                    ...p,
                                                                    megawide_work_experience: {
                                                                        ...p.megawide_work_experience,
                                                                        previous_assignments: p.megawide_work_experience.previous_assignments.map((a, i) =>
                                                                            i === aIdx ? { ...a, previous_job_title: e.target.value } : a,
                                                                        ),
                                                                    },
                                                                }),
                                                            })
                                                        }
                                                        className="mt-1 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1 shadow-sm text-[11px]"
                                                        placeholder="e.g., Intern"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-medium text-gray-700">Start Date</label>
                                                    <input
                                                        type="date"
                                                        value={assign.previous_role_start_date}
                                                        onChange={(e) =>
                                                            dispatch({
                                                                type: "APPLY_UPDATER",
                                                                updater: (p) => ({
                                                                    ...p,
                                                                    megawide_work_experience: {
                                                                        ...p.megawide_work_experience,
                                                                        previous_assignments: p.megawide_work_experience.previous_assignments.map((a, i) =>
                                                                            i === aIdx ? { ...a, previous_role_start_date: e.target.value } : a,
                                                                        ),
                                                                    },
                                                                }),
                                                            })
                                                        }
                                                        className="mt-1 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1 shadow-sm text-[11px]"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-medium text-gray-700">End Date</label>
                                                    <input
                                                        type="date"
                                                        value={assign.end_of_assignment}
                                                        onChange={(e) =>
                                                            dispatch({
                                                                type: "APPLY_UPDATER",
                                                                updater: (p) => ({
                                                                    ...p,
                                                                    megawide_work_experience: {
                                                                        ...p.megawide_work_experience,
                                                                        previous_assignments: p.megawide_work_experience.previous_assignments.map((a, i) =>
                                                                            i === aIdx ? { ...a, end_of_assignment: e.target.value } : a,
                                                                        ),
                                                                    },
                                                                }),
                                                            })
                                                        }
                                                        className="mt-1 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1 shadow-sm text-[11px]"
                                                    />
                                                </div>
                                            </div>
                                            <div className="mt-2 text-right">
                                                <button type="button" onClick={() => confirmRemoveAssignment(aIdx)} className="text-red-600 hover:text-red-800 text-[11px] font-medium">Remove</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-gray-500 text-xs">No previous assignments yet.</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right column: Previous Work Experience */}
            <div>
                <div className="bg-white border border-gray-200 shadow-xl rounded-lg p-4 h-full">
                    <h2 className="text-lg font-semibold text-[#ee3124] flex items-center gap-2">
                        <span className="inline-block w-1 h-6 bg-red-600 rounded-full" />
                        Previous Work Experience
                    </h2>
                    <div className="mt-3">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">Add your prior roles</span>
                            <button
                                type="button"
                                onClick={() => addRow("previous_work_experiences", { company: "", job_title: "", job_level: "", start_date: "", end_date: "" })}
                                className="px-2.5 py-1 bg-gray-600 hover:bg-gray-700 text-white text-xs font-medium rounded-md"
                            >
                                + Add Previous Work
                            </button>
                        </div>

                        {form.previous_work_experiences?.length ? (
                            <div className="space-y-3">
                                {form.previous_work_experiences.map((w, wIdx) => (
                                    <div key={wIdx} className="border border-gray-200 rounded-md p-3">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Company</label>
                                                <input
                                                    type="text"
                                                    value={w.company}
                                                    onChange={(ev) => updateRow("previous_work_experiences", wIdx, "company", ev.target.value)}
                                                    className="mt-1 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1.5 shadow-sm text-xs"
                                                    placeholder="e.g., ABC Corporation"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Job Title</label>
                                                <input
                                                    type="text"
                                                    value={w.job_title}
                                                    onChange={(ev) => updateRow("previous_work_experiences", wIdx, "job_title", ev.target.value)}
                                                    className="mt-1 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1.5 shadow-sm text-xs"
                                                    placeholder="e.g., Software Engineer"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Job Level</label>
                                                <input
                                                    type="text"
                                                    value={w.job_level}
                                                    onChange={(ev) => updateRow("previous_work_experiences", wIdx, "job_level", ev.target.value)}
                                                    className="mt-1 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1.5 shadow-sm text-xs"
                                                    placeholder="e.g., Senior, Manager, etc."
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                                                <input
                                                    type="date"
                                                    value={w.start_date}
                                                    onChange={(ev) => updateRow("previous_work_experiences", wIdx, "start_date", ev.target.value)}
                                                    className="mt-1 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1.5 shadow-sm text-xs"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">End Date</label>
                                                <input
                                                    type="date"
                                                    value={w.end_date}
                                                    onChange={(ev) => updateRow("previous_work_experiences", wIdx, "end_date", ev.target.value)}
                                                    className="mt-1 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1.5 shadow-sm text-xs"
                                                />
                                            </div>
                                        </div>
                                        <div className="mt-2 text-right">
                                            <button type="button" onClick={() => confirmRemoveRow("previous_work_experiences", wIdx, "Previous Work")} className="text-red-600 hover:text-red-800 text-xs font-medium">Remove Previous Work</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-gray-500 text-sm">No previous work experience yet.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}