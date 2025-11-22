import { useEffect, useState } from "react";
import { getPositionTitle } from "@/database/position_title";

export default function LevelsOfAuthority({ values, onChange }) {
    const fields = [
        {
            key: "lineAuthority",
            label: "Line Authority",
            placeholder: "Indicate roles of your direct reports. Separate items by comma.",
        },
        {
            key: "staffAuthority",
            label: "Staff Authority",
            placeholder:
                "Indicate roles you have functional authority over. Separate items by comma.",
        },
    ];

    const [titles, setTitles] = useState([]);
    const [activeKey, setActiveKey] = useState(null);
    const [inputValue, setInputValue] = useState({ lineAuthority: '', staffAuthority: '' });

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

    // Get last entry after comma, trim spaces
    const getLastEntry = (val) => {
        const arr = String(val || "").split(",");
        return arr[arr.length - 1].trim();
    };

    // Simple filter: case-insensitive includes, ignore spaces
    const getSuggestions = (query) => {
        const q = String(query || "").toLowerCase().replace(/\s+/g, "");
        if (!q) return [];
        return titles
            .filter((t) => String(t).toLowerCase().replace(/\s+/g, "").includes(q))
            .slice(0, 8);
    };

    // Handle textarea input for multi-select and custom entry
    const handleInputChange = (key, val) => {
        setInputValue((prev) => ({ ...prev, [key]: val }));
        onChange(key, val);
    };

    // Handle keydown for custom entry (Enter or comma)
    const handleKeyDown = (e, key) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const value = inputValue[key] || '';
            // Add comma if not present
            if (!value.trim().endsWith(',')) {
                handleInputChange(key, value.trim() + ', ');
            }
        }
    };

    return (
        <>
            <div className="md:col-span-full mb-4">
                <h2 className="text-lg font-semibold text-[#ee3124] flex items-center gap-2">
                    <span className="inline-block w-1 h-6 bg-red-600 rounded-full" />
                    Levels of Authority
                </h2>
                <div className="text-sm/6">
                    <p className="text-gray-400">
                        If line authority, please state the terminal accountability you have over specific
                        functions/roles. If staff authority, please indicate the parties you provide professional,
                        expert advice and service.
                    </p>
                </div>
            </div>
            <div className="bg-white border border-gray-200 shadow-xl rounded-lg py-3 px-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {fields.map((item, idx) => {
                        const value = values[item.key] || "";
                        const lastEntry = getLastEntry(value);
                        const suggestions = getSuggestions(lastEntry);
                        const isActive = activeKey === item.key;
                        return (
                            <div key={item.key} className="md:col-span-1">
                                <label htmlFor={item.key} className="block text-sm/6 font-medium text-gray-700">
                                    {idx + 1}.0 {item.label} <span className="text-red-600">*</span>
                                </label>
                                <div className="relative mt-2">
                                    <textarea
                                        id={item.key}
                                        name={item.key}
                                        rows={3}
                                        value={inputValue[item.key] || value}
                                        onChange={(e) => handleInputChange(item.key, e.target.value)}
                                        onFocus={() => setActiveKey(item.key)}
                                        onKeyDown={(e) => handleKeyDown(e, item.key)}
                                        className="block w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:ring-[#ee3124] focus:border-[#ee3124] px-3 py-2 shadow-sm sm:text-sm"
                                        placeholder={item.placeholder}
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
                                                        e.preventDefault();
                                                        // Append suggestion to textarea
                                                        const current = inputValue[item.key] || value;
                                                        const arr = current.split(",");
                                                        arr[arr.length - 1] = ` ${s}`;
                                                        const newValue = arr.join(",").replace(/^,/, "").replace(/,,+/g, ",").replace(/\s+,/g, ',').trim();
                                                        handleInputChange(item.key, newValue + ', ');
                                                        setActiveKey(item.key); // keep dropdown open for more
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
