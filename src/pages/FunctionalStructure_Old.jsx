import React, { useState, useRef, useEffect } from "react";
import Title from "../components/Title";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { deleteFunction, getFunctionalStructure } from "../utils/functional_structure";
import { Loading, Error } from "../components/LoadingError";
import CustomDropdown from "../components/CustomDropdown";
import ButtonIcon from "../components/ButtonIcon";
import DynamicTable from "../components/DynamicTable";
import CustomModal from "../components/CustomModal";

function FunctionItems({
    data,
    level = 0,
    searchTargetId,
    onRef,
    parentPath = [],
    refetch,
    openItemId,
    setOpenItemId,
}) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteData, setDeleteData] = useState({
        id: null,
        type: null,
    });
    const itemRef = useRef(null);
    const currentPath = React.useMemo(
        () => [...parentPath, data.id || data.subfunction_id],
        [parentPath, data.id, data.subfunction_id],
    );
    
    const itemId = data.id || data.subfunction_id;
    const [childOpenItemId, setChildOpenItemId] = useState(null);
    
    // For level 0, use the passed openItemId. For level 1+, use local state
    const open = level === 0 ? openItemId === itemId : childOpenItemId === itemId;

    // Handle toggle for this specific item
    const handleToggle = React.useCallback((toggleFn) => {
        const newOpenState = typeof toggleFn === 'function' ? toggleFn(open) : toggleFn;
        
        if (level === 0) {
            // For level 0, use the global state
            setOpenItemId(newOpenState ? itemId : null);
        } else {
            // For level 1+, use local state
            setChildOpenItemId(newOpenState ? itemId : null);
        }
    }, [open, level, itemId, setOpenItemId, setChildOpenItemId]);

    useEffect(() => {
        if (onRef) {
            onRef(data.id || data.subfunction_id, {
                setOpen: handleToggle,
                ref: itemRef,
                path: currentPath,
            });
        }
    }, [onRef, data.id, data.subfunction_id, currentPath, handleToggle]);

    useEffect(() => {
        // Just handle scrolling to the search target, opening is handled by handleSuggestionClick
        if (
            searchTargetId &&
            (data.id === searchTargetId ||
                data.subfunction_id === searchTargetId)
        ) {
            if (itemRef.current) {
                setTimeout(() => {
                    itemRef.current.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                    });
                }, 100);
            }
        }
    }, [searchTargetId, data.id, data.subfunction_id]);
    const navigate = useNavigate();

    const handleEdit = (id, type) => {
        navigate(`/manage-function/${type}/${id}`);
    };

    // Delete logic with refetch
    const handleDelete = async () => {
        try {
            await deleteFunction(deleteData);
            if (typeof refetch === "function") {
                await refetch();
            }
        } finally {
            setShowDeleteModal(false);
        }
    };

    const handleDeleteFn = (id, type) => {
        setShowDeleteModal(true);
        setDeleteData({ id, type });
    };

    // Highlight if this function/subfunction is the search target
    const isHighlighted =
        searchTargetId &&
        (data.id === searchTargetId || data.subfunction_id === searchTargetId);
    return (
        <div
            ref={itemRef}
            className={`mb-3 ${level === 0 ? "border-b border-gray-200" : ""} ${
                isHighlighted ? "bg-gray-200 transition-all duration-300" : ""
            }`}
        >
            <div className="w-full flex items-center py-1 px-4">
                <CustomDropdown
                    label={data.label}
                    setOpen={handleToggle}
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
                <ButtonIcon data={data} handleEdit={handleEdit}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-gray-700"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828A2 2 0 019 17H7v-2a2 2 0 01.586-1.414z"
                        />
                    </svg>
                </ButtonIcon>
                <button
                    type="button"
                    className="ml-2 opacity-70 hover:opacity-100 focus:opacity-100 transition-opacity duration-200 bg-white border border-gray-300 rounded-full p-1 flex items-center justify-center shadow hover:bg-gray-100 focus:ring-2 focus:ring-red-400"
                    tabIndex={0}
                    title="Edit"
                    onClick={() =>
                        handleDeleteFn(
                            data.subfunction_id ?? data.id,
                            data.subfunction_id ? "subfunction" : "function",
                        )
                    }
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-red-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                    </svg>
                </button>
                {/* Delete Confirmation Modal */}
                <CustomModal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    title="Delete Confirmation"
                >
                    <div className="p-4">
                        <p className="mb-4 text-gray-700">
                            Are you sure you want to delete{" "}
                            <span className="font-semibold">{data.label}</span>?
                        </p>
                        <div className="flex justify-end gap-2">
                            <button
                                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                onClick={handleDelete}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </CustomModal>
            </div>
            <div
                className={`overflow-hidden transition-all duration-300 ${
                    open ? "max-h opacity-100" : "max-h-0 opacity-0"
                }`}
                style={{ paddingLeft: level * 20 }}
            >
                {data.description && data.description.length > 0 && (
                    <div className="pl-4 border-l border-gray-300 mt-3">
                        <div className="w-full ">
                            <div
                                className={`transition-all duration-300 ${
                                    open ? "opacity-100" : "max-h-0 opacity-0"
                                } overflow-hidden`}
                            >
                                {data.description.map((desc, idx) => {
                                    const descHighlighted =
                                        searchTargetId &&
                                        desc.descriptionId === searchTargetId;
                                    return (
                                        <div
                                            key={idx}
                                            className={`p-3 mb-3 bg-white border border-gray-200 rounded shadow-sm ${
                                                descHighlighted
                                                    ? " bg-gray-200 transition-all duration-300"
                                                    : ""
                                            }`}
                                        >
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                                <div className="flex items-center flex-wrap gap-x-2">
                                                    <span className="text-red-700 font-semibold">
                                                        Description:
                                                    </span>
                                                    <span className="text-gray-800 ml-1 ">
                                                        {desc.label}
                                                    </span>
                                                </div>
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transition-all duration-200 ml-auto sm:ml-0 sm:mr-0 w-auto text-sm mb-4"
                                                    onClick={() => {
                                                        navigate(
                                                            `/manage-description/${
                                                                data.subfunction_id ??
                                                                ""
                                                            }/${
                                                                desc.descriptionId ??
                                                                ""
                                                            }`,
                                                        );
                                                    }}
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-4 w-4"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                        strokeWidth={2}
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828A2 2 0 019 17H7v-2a2 2 0 01.586-1.414z"
                                                        />
                                                    </svg>
                                                    <span>Edit</span>
                                                </button>
                                            </div>
                                            <DynamicTable data={desc} />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {data.subfunction && data.subfunction.length > 0 && (
                    <div className="pl-4 border-l border-gray-300 mt-3">
                        {data.subfunction.map((sub, idx) => (
                            <FunctionItems
                                key={idx}
                                data={sub}
                                level={level + 1}
                                searchTargetId={searchTargetId}
                                onRef={onRef}
                                parentPath={currentPath}
                                refetch={refetch}
                                openItemId={childOpenItemId}
                                setOpenItemId={setChildOpenItemId}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function FunctionalStructure() {
    const navigate = useNavigate();
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

    // Search state
    const [search, setSearch] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [searchTargetId, setSearchTargetId] = useState(null);
    const refsMap = useRef({});
    
    // State to manage which level 0 item is open (only one at a time)
    const [openLevel0ItemId, setOpenLevel0ItemId] = useState(null);

    // Collect all items for search (flatten tree), but only include level 0 and 1 (no descriptions or level 2+)
    const flattenItems = React.useCallback(
        (items, parentPath = [], level = 0) => {
            let flat = [];
            items.forEach((item) => {
                const id = item.id || item.subfunction_id;
                // Only include level 0 and 1
                if (level <= 1) {
                    flat.push({
                        id,
                        label: item.label,
                        type: level === 0 ? "Function" : "Subfunction",
                        path: [...parentPath, id],
                        level,
                    });
                }
                if (
                    item.subfunction &&
                    item.subfunction.length > 0 &&
                    level < 1
                ) {
                    flat = flat.concat(
                        flattenItems(
                            item.subfunction,
                            [...parentPath, id],
                            level + 1,
                        ),
                    );
                }
            });
            return flat;
        },
        [],
    );

    // Update suggestions as user types
    useEffect(() => {
        if (!search || !functionData) {
            setSuggestions([]);
            return;
        }
        const flat = flattenItems(functionData);
        const filtered = flat.filter((item) =>
            item.label.toLowerCase().includes(search.toLowerCase()),
        );
        setSuggestions(filtered.slice(0, 4));
    }, [search, functionData, flattenItems]);

    // Register refs for navigation
    const handleRef = (id, refObj) => {
        refsMap.current[id] = refObj;
    };

    // When a suggestion is clicked, open all parents and scroll to item
    const handleSuggestionClick = (item) => {
        setShowSuggestions(false);
        setSearch(item.label);
        setSearchTargetId(
            item.type === "Description" ? item.parentId : item.id,
        );
        
        // Only open parent levels, not the item's own level
        if (item.path && item.level > 0) {
            // For level 1 items, open the level 0 parent
            const parentId = item.path[0];
            setOpenLevel0ItemId(parentId);
        }
        
        // Scroll to item
        setTimeout(() => {
            if (
                refsMap.current[
                    item.type === "Description" ? item.parentId : item.id
                ]?.ref?.current
            ) {
                refsMap.current[
                    item.type === "Description" ? item.parentId : item.id
                ].ref.current.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });
            }
        }, 200);
    };

    // Clear search and close all dropdowns
    const handleClearSearch = () => {
        setSearch("");
        setSuggestions([]);
        setShowSuggestions(false);
        setSearchTargetId(null);
        // Close all dropdowns
        setOpenLevel0ItemId(null);
    };

    const handleAdd = (type) => {
        navigate(`/manage-function/${type}`);
    };

    if (isLoading) return <Loading />;
    if (isError)
        return <Error message="Failed to load functional structure." />;

    return (
        <section className="w-auto p-6 bg-white rounded-lg shadow">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="w-full sm:w-auto">
                    <Title title="Functional Structure" />
                </div>

                <button
                    type="button"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transition-all duration-200 ml-auto sm:ml-0 sm:mr-0 w-auto text-sm"
                    onClick={() => handleAdd("add-function")}
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
            </div>
            {/* Search Bar */}
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
                        onBlur={() =>
                            setTimeout(() => setShowSuggestions(false), 150)
                        }
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
            {functionData?.map((data, idx) => (
                <FunctionItems
                    key={idx}
                    data={data}
                    searchTargetId={searchTargetId}
                    onRef={handleRef}
                    refetch={refetch}
                    openItemId={openLevel0ItemId}
                    setOpenItemId={setOpenLevel0ItemId}
                />
            ))}
        </section>
    );
}
