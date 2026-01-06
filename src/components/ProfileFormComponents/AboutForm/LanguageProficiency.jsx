import React, { useEffect } from "react";

export default function LanguageProficiency({
    form,
    loading,
    addRow,
    updateRow,
    confirmRemoveRow,
    langLevelOptions = [],
}) {
    // Default languages to auto-populate on first load
    const defaultLanguages = [
        "English",
        "Filipino (Tagalog)",
        "Cebuano",
        "Hiligaynon",
        "Mandarin",
        "Hokkien",
    ];

    useEffect(() => {
        // Only populate defaults after parent finished loading data to avoid the
        // case where defaults are added then cleared by the parent's REPLACE.
        if (loading) return;
        if (!form.language_proficiencies || form.language_proficiencies.length === 0) {
            defaultLanguages.forEach((lang) => {
                addRow("language_proficiencies", {
                    language: lang,
                    w_prof: "",
                    s_prof: "",
                });
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading]);
    return (
        <div className="bg-white border border-gray-200 shadow-xl rounded-lg p-4">
            <h2 className="text-lg font-semibold text-[#ee3124] flex items-center gap-2">
                <span className="inline-block w-1 h-6 bg-red-600 rounded-full" />
                Language Proficiency
            </h2>
            <div className="mt-3">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Add languages you know</span>
                    <button
                        type="button"
                        onClick={() =>
                            addRow("language_proficiencies", {
                                language: "",
                                w_prof: "",
                                s_prof: "",
                            })
                        }
                        className="px-2.5 py-1 bg-gray-600 hover:bg-gray-700 text-white text-xs font-medium rounded-md"
                    >
                        + Add Language
                    </button>
                </div>

                {form.language_proficiencies?.length ? (
                    <div className="space-y-3">
                        {form.language_proficiencies.map((l, lIdx) => (
                            <div key={lIdx} className="border border-gray-200 rounded-md p-3">
                                <div className="flex items-center gap-3">
                                    <label className="text-xs font-medium text-gray-700 w-24">Language</label>
                                    <input
                                        type="text"
                                        value={l.language}
                                        onChange={(ev) =>
                                            updateRow(
                                                "language_proficiencies",
                                                lIdx,
                                                "language",
                                                ev.target.value,
                                            )
                                        }
                                        className="flex-1 rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1.5 shadow-sm text-xs"
                                        placeholder="e.g., English"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                                    <div>
                                        <label className="text-xs font-medium text-gray-700 m-0">Written</label>
                                        <select
                                            value={l.w_prof}
                                            onChange={(ev) =>
                                                updateRow(
                                                    "language_proficiencies",
                                                    lIdx,
                                                    "w_prof",
                                                    ev.target.value,
                                                )
                                            }
                                            className="mt-1 rounded-md bg-white border border-gray-300 text-gray-900 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1.5 shadow-sm text-xs w-full"
                                        >
                                            <option value="">Proficiency…</option>
                                            {langLevelOptions.map((opt) => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-xs font-medium text-gray-700 m-0">Spoken</label>
                                        <select
                                            value={l.s_prof}
                                            onChange={(ev) =>
                                                updateRow(
                                                    "language_proficiencies",
                                                    lIdx,
                                                    "s_prof",
                                                    ev.target.value,
                                                )
                                            }
                                            className="mt-1 rounded-md bg-white border border-gray-300 text-gray-900 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1.5 shadow-sm text-xs w-full"
                                        >
                                            <option value="">Proficiency…</option>
                                            {langLevelOptions.map((opt) => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="mt-2 text-right">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            confirmRemoveRow(
                                                "language_proficiencies",
                                                lIdx,
                                                "Language",
                                            )
                                        }
                                        className="text-red-600 hover:text-red-800 text-xs font-medium"
                                    >
                                        Remove Language
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-gray-500 text-sm">No language proficiencies yet.</div>
                )}
            </div>
        </div>
    );
}
