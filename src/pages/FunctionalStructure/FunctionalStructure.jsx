import React, { useState, useRef, useCallback } from "react";
import Title from "../../components/Title";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getFunctionalStructure } from "../../utils/functional_structure";
import { Loading, Error } from "../../components/LoadingError";
import FunctionalDropdownItem from "../../components/FunctionalDropdownItem";
import FunctionalStructureSearch from "../../components/FunctionalStructureSearch";

export default function FunctionalStructure() {
    const navigate = useNavigate();
    
    // Data fetching
    const {
        data: functionData,
        isLoading,
        isError,
        refetch,
    } = useQuery({
        queryKey: ["functional-structure"],
        queryFn: getFunctionalStructure,
        refetchOnWindowFocus: true,
    });

    // State management
    const [openLevel0ItemId, setOpenLevel0ItemId] = useState(null);
    const [openLevel0Items, setOpenLevel0Items] = useState(new Set());
    const [searchTargetId, setSearchTargetId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isAllExpanded, setIsAllExpanded] = useState(false);
    const refsMap = useRef({});

    // Handle level 0 toggle - can handle both single and multiple open items
    const handleLevel0Toggle = useCallback((itemData, shouldOpen) => {
        const itemId = itemData.id || itemData.subfunction_id;
        const itemIdStr = itemId.toString();
        
        if (isAllExpanded) {
            // When in expand all mode, manage multiple open items
            setOpenLevel0Items(prev => {
                const newSet = new Set(prev);
                if (shouldOpen) {
                    newSet.add(itemIdStr);
                } else {
                    newSet.delete(itemIdStr);
                }
                return newSet;
            });
        } else {
            // Normal mode - only one can be open at a time
            setOpenLevel0ItemId(shouldOpen ? itemIdStr : null);
        }
    }, [isAllExpanded]);

    // Register refs for search functionality
    const handleRef = useCallback((id, refObj) => {
        refsMap.current[id] = refObj;
    }, []);

    // Handle search suggestion clicks
    const handleSuggestionClick = useCallback((item) => {
        setSearchTargetId(item.type === "Description" ? item.parentId : item.id);
        setSearchTerm(item.label || "");
        
        // Only open parent levels, not the item's own level
        if (item.path && item.level > 0) {
            // For level 1 items, open the level 0 parent
            const parentId = item.path[0].toString();
            setOpenLevel0ItemId(parentId);
        }
        
        // Scroll to item after a brief delay to allow for opening
        setTimeout(() => {
            const targetId = item.type === "Description" ? item.parentId : item.id;
            if (refsMap.current[targetId]?.ref?.current) {
                refsMap.current[targetId].ref.current.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });
            }
        }, 200);
    }, []);

    // Clear search and close all dropdowns
    const handleClearSearch = useCallback(() => {
        setSearchTargetId(null);
        setSearchTerm("");
        if (isAllExpanded) {
            setOpenLevel0Items(new Set());
            setIsAllExpanded(false);
        } else {
            setOpenLevel0ItemId(null);
        }
    }, [isAllExpanded]);

    // Toggle all dropdowns to level 1 or collapse all
    const toggleAllDropdowns = useCallback(() => {
        if (isAllExpanded) {
            // Close all dropdowns and return to normal mode
            setOpenLevel0Items(new Set());
            setOpenLevel0ItemId(null);
            setIsAllExpanded(false);
        } else {
            // Open all level 0 items to show level 1 children
            if (functionData && functionData.length > 0) {
                const allLevel0Ids = functionData.map(item => {
                    const itemId = item.id || item.subfunction_id;
                    return itemId.toString();
                });
                setOpenLevel0Items(new Set(allLevel0Ids));
                setOpenLevel0ItemId(null); // Clear single selection
                setIsAllExpanded(true);
            }
        }
    }, [isAllExpanded, functionData]);

    // Navigate to add function page
    const handleAdd = useCallback(() => {
        navigate("/manage-function/add-function");
    }, [navigate]);

    // Loading and error states
    if (isLoading) return <Loading />;
    if (isError) return <Error message="Failed to load functional structure." />;

    return (
        <section className="w-auto p-6 bg-white rounded-lg shadow">
            {/* Header */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="w-full sm:w-auto">
                    <Title title="Functional Structure" />
                </div>
                <div className="flex gap-2">
                    <button
                        type="button"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transition-all duration-200 w-auto text-sm"
                        onClick={handleAdd}
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
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                        Add
                    </button>
                    <button
                        type="button"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white font-semibold rounded-lg shadow hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 transition-all duration-200 w-auto text-sm"
                        onClick={toggleAllDropdowns}
                        title={isAllExpanded ? "Collapse All" : "Expand All"}
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
                                d={isAllExpanded ? "m4.5 15.75 7.5-7.5 7.5 7.5" : "m19.5 8.25-7.5 7.5-7.5-7.5"}
                            />
                        </svg>
                        {isAllExpanded ? "Collapse All" : "Expand All"}
                    </button>
                </div>
            </div>

            {/* Search Component */}
            <FunctionalStructureSearch
                functionData={functionData}
                onSuggestionClick={handleSuggestionClick}
                onClearSearch={handleClearSearch}
            />

            {/* Function Items */}
            {functionData?.map((data, idx) => {
                const itemId = data.id || data.subfunction_id;
                const uniqueItemId = itemId.toString(); // Level 0 items use simple ID since no parent
                
                // Determine if this item should be open based on current mode
                const isItemOpen = isAllExpanded 
                    ? openLevel0Items.has(uniqueItemId)
                    : openLevel0ItemId === uniqueItemId;
                
                return (
                    <FunctionalDropdownItem
                        key={idx}
                        data={data}
                        level={0}
                        searchTargetId={searchTargetId}
                        searchTerm={searchTerm}
                        onRef={handleRef}
                        parentPath={[]}
                        refetch={refetch}
                        isOpen={isItemOpen}
                        onToggle={handleLevel0Toggle}
                    />
                );
            })}
        </section>
    );
}