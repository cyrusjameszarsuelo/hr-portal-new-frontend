import React, { useEffect, useState } from "react";
import { getPositionTitle } from "@/database/position_title";

export default function ReportingRelationships({ config, values, onChange }) {
    // Minimal state: loaded titles and which field is active
    const [titles, setTitles] = useState([]);
    const [activeType, setActiveType] = useState(null);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const data = await getPositionTitle();
                if (!mounted) return;
                // Accept array of strings or objects with position_title
                const list = Array.isArray(data) ? data : [];
                const toText = (item) =>
                    typeof item === "string"
                        ? item
                        : item?.position_title || item?.title || item?.name || "";
                const normalized = list
                    .map(toText)
                    .filter(Boolean);
                setTitles(normalized);
            } catch (err) {
                console.error("Failed to load position titles:", err);
            }
        })();
        return () => {
            mounted = false;
        };
    }, []);

    // Very simple filter: case-insensitive includes; ignore spaces in query
    const getSuggestions = (query) => {
        const q = String(query || "").toLowerCase().replace(/\s+/g, "");
        if (!q) return [];
        return titles
            .filter((t) => String(t).toLowerCase().replace(/\s+/g, "").includes(q))
            .slice(0, 8);
    };

    return (
        <>
            <div className="md:col-span-full mb-4">
                <h2 className="text-lg font-semibold text-[#ee3124] flex items-center gap-2">
                    <span className="inline-block w-1 h-6 bg-red-600 rounded-full" />
                    Reporting Relationships
                </h2>
                <div className="text-sm/6">
                    <p className="text-gray-400">Please indicate the position of superiors as and when applicable.</p>
                </div>
            </div>
            <div className="bg-white border border-gray-200 shadow-xl rounded-lg py-3 px-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {config.map((data, idx) => {
                        const value = values[data.type] || "";
                        const suggestions = getSuggestions(value);
                        const isActive = activeType === data.type;
                        return (
                            <div key={data.type} className="md:col-span-1">
                                <label htmlFor={`reporting-${data.type}`} className="block text-sm/6 font-medium text-gray-700">
                                    {idx + 1}.0 {data.label} <span className="text-red-600">*</span>
                                </label>
                                <div className="relative mt-2">
                                    <input
                                        id={`reporting-${data.type}`}
                                        name={`reporting-${data.type}`}
                                        type="text"
                                        value={value}
                                        onChange={(e) => onChange(data.type, e.target.value)}
                                        onFocus={() => setActiveType(data.type)}
                                        onBlur={() => setActiveType(null)}
                                        className="w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-3 py-2 shadow-sm sm:text-sm"
                                        placeholder="e.g., Management Associate"
                                        autoComplete="off"
                                    />

                                    {/* Suggestions dropdown */}
                                    {isActive && suggestions.length > 0 && (
                                        <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                                            {suggestions.map((s) => (
                                                <button
                                                    key={s}
                                                    type="button"
                                                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 focus:bg-gray-100"
                                                    onMouseDown={(e) => {
                                                        // use onMouseDown to ensure it fires before input blur
                                                        e.preventDefault();
                                                        onChange(data.type, s);
                                                        setActiveType(null);
                                                    }}
                                                >
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
