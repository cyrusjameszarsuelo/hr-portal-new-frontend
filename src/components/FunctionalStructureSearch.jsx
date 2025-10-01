import React, { useState, useEffect, useCallback } from "react";

export default function FunctionalStructureSearch({
    functionData,
    onSuggestionClick,
    onClearSearch,
}) {
    const [search, setSearch] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Flatten the tree structure for search
    const flattenItems = useCallback((items, parentPath = [], level = 0) => {
        let flat = [];
        items.forEach((item) => {
            const id = item.id || item.subfunction_id;
            // Only include level 0 and 1 for search
            if (level <= 1) {
                flat.push({
                    id,
                    label: item.label,
                    type: level === 0 ? "Function" : "Subfunction",
                    path: [...parentPath, id],
                    level,
                });
            }
            if (item.subfunction && item.subfunction.length > 0 && level < 1) {
                flat = flat.concat(
                    flattenItems(item.subfunction, [...parentPath, id], level + 1)
                );
            }
        });
        return flat;
    }, []);

    // Update suggestions as user types
    useEffect(() => {
        if (!search || !functionData) {
            setSuggestions([]);
            return;
        }
        const flat = flattenItems(functionData);
        const filtered = flat.filter((item) =>
            item.label.toLowerCase().includes(search.toLowerCase())
        );
        setSuggestions(filtered.slice(0, 4));
    }, [search, functionData, flattenItems]);

    const handleSuggestionClick = (item) => {
        setShowSuggestions(false);
        setSearch(item.label);
        onSuggestionClick(item);
    };

    const handleClearSearch = () => {
        setSearch("");
        setSuggestions([]);
        setShowSuggestions(false);
        onClearSearch();
    };

    return (
        <div className="mb-4 relative max-w-md">
            <div className="relative">
                <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 pr-10"
                    placeholder="Search function, or subfunction"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                />
                {search && (
                    <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 focus:outline-none"
                        onClick={handleClearSearch}
                        tabIndex={0}
                        aria-label="Clear search"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                )}
            </div>
            {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow mt-1 max-h-60 overflow-auto">
                    {suggestions.map((item, idx) => (
                        <li
                            key={item.id + idx}
                            className="px-4 py-2 cursor-pointer hover:bg-red-100"
                            onMouseDown={() => handleSuggestionClick(item)}
                        >
                            <span className="font-semibold text-gray-800">
                                {item.label}
                            </span>
                            <span className="ml-2 text-xs text-gray-500">
                                ({item.type})
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}