import React, { useEffect } from "react";

export default function TechnicalProficiency({
    form,
    addRow,
    updateRow,
    confirmRemoveRow,
    proficiencyOptions = [],
}) {
    const defaultSkills = [
        "Microsoft Word",
        "Microsoft Excel",
        "Microsoft PowerPoint",
        "Microsoft Power BI",
        "Microsoft Power Apps",
        "Microsoft List",
        "SAP",
    ];

    useEffect(() => {
        if (!form.technical_proficiencies || form.technical_proficiencies.length === 0) {
            defaultSkills.forEach((skill) => {
                addRow("technical_proficiencies", { skills: skill, proficiency: "" });
            });
        }
        // run once on mount; addRow comes from parent
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <div className="bg-white border border-gray-200 shadow-xl rounded-lg p-4">
            <h2 className="text-lg font-semibold text-[#ee3124] flex items-center gap-2">
                <span className="inline-block w-1 h-6 bg-red-600 rounded-full" />
                Technical Proficiency
            </h2>
            <div className="mt-3">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">List your technical skills</span>
                    <button
                        type="button"
                        onClick={() =>
                            addRow("technical_proficiencies", {
                                skills: "",
                                proficiency: "",
                            })
                        }
                        className="px-2.5 py-1 bg-gray-600 hover:bg-gray-700 text-white text-xs font-medium rounded-md"
                    >
                        + Add Skill
                    </button>
                </div>

                {form.technical_proficiencies?.length ? (
                    <div className="space-y-2">
                        {form.technical_proficiencies.map((t, tIdx) => (
                            <div
                                key={tIdx}
                                className="grid grid-cols-1 md:grid-cols-2 gap-2 items-center"
                            >
                                <input
                                    type="text"
                                    value={t.skills}
                                    onChange={(ev) =>
                                        updateRow(
                                            "technical_proficiencies",
                                            tIdx,
                                            "skills",
                                            ev.target.value,
                                        )
                                    }
                                    className="w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1.5 shadow-sm text-xs"
                                    placeholder="e.g., JavaScript, React, Node.js"
                                />
                                <select
                                    value={t.proficiency}
                                    onChange={(ev) =>
                                        updateRow(
                                            "technical_proficiencies",
                                            tIdx,
                                            "proficiency",
                                            ev.target.value,
                                        )
                                    }
                                    className="w-full rounded-md bg-white border border-gray-300 text-gray-900 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1.5 shadow-sm text-xs"
                                >
                                    <option value="">Select proficiency…</option>
                                    {proficiencyOptions.map((opt) => (
                                        <option key={opt} value={opt}>
                                            {opt}
                                        </option>
                                    ))}
                                </select>
                                <div className="md:col-span-2 text-right">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            confirmRemoveRow(
                                                "technical_proficiencies",
                                                tIdx,
                                                "Technical Skill",
                                            )
                                        }
                                        className="text-red-600 hover:text-red-800 text-xs font-medium"
                                    >
                                        Remove Skill
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-gray-500 text-sm">No technical skills yet.</div>
                )}
            </div>
        </div>
    );
}
