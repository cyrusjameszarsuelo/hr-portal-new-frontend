import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router";
import CustomDropdown from "./CustomDropdown";
import ButtonIcon from "./ButtonIcon";
import CustomModal from "./CustomModal";
import DynamicTable from "./DynamicTable";
import { deleteFunction } from "../utils/functional_structure";

export default function FunctionalDropdownItem({
    data,
    level = 0,
    searchTargetId,
    searchTerm = "",
    onRef,
    parentPath = [],
    refetch,
    isOpen,
    onToggle,
}) {
    const navigate = useNavigate();
    const itemRef = useRef(null);
    
    // Delete modal state
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteData, setDeleteData] = useState({ id: null, type: null });
    
    // Each component instance manages its own child open state using refs
    const [openChildIndex, setOpenChildIndex] = useState(null);
    
    // State to control DynamicTable visibility for each description
    const [showDescriptionDetails, setShowDescriptionDetails] = useState({});
    
    // Item identification
    const itemId = data.id || data.subfunction_id;
    const currentPath = useMemo(() => [...parentPath, itemId], [parentPath, itemId]);
    
    // Determine if this item should be highlighted from search
    const isHighlighted = searchTargetId && 
        (data.id === searchTargetId || data.subfunction_id === searchTargetId);

    // Toggle handler for the item itself
    const handleToggle = useCallback(() => {
        const newOpenState = !isOpen;
        onToggle(data, newOpenState);
    }, [isOpen, onToggle, data]);

    // Child toggle handler - only one child can be open at a time per parent
    const handleChildToggle = useCallback((childData, shouldOpen, childIndex) => {
        setOpenChildIndex(shouldOpen ? childIndex : null);
    }, []);    // Register this item for search functionality
    useEffect(() => {
        if (onRef) {
            onRef(itemId, {
                setOpen: handleToggle,
                ref: itemRef,
                path: currentPath,
            });
        }
    }, [onRef, itemId, handleToggle, currentPath]);

    // Handle scroll to item when it's a search target
    useEffect(() => {
        if (isHighlighted && itemRef.current) {
            setTimeout(() => {
                itemRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });
            }, 100);
        }
    }, [isHighlighted]);

    // Navigation handlers
    const handleEdit = (id, type) => {
        navigate(`/manage-function/${type}/${id}`);
    };

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

    const handleDeleteClick = (id, type) => {
        setShowDeleteModal(true);
        setDeleteData({ id, type });
    };

    const handleDescriptionEdit = (descriptionId) => {
        navigate(`/manage-description/${data.subfunction_id || ""}/${descriptionId || ""}`);
    };

    const toggleDescriptionDetails = (descriptionIndex) => {
        setShowDescriptionDetails(prev => ({
            ...prev,
            [descriptionIndex]: !prev[descriptionIndex]
        }));
    };

    // Function to highlight the entire clicked text
    const highlightSearchTerm = (text, term) => {
        if (!term || !text) return text;
        
        // If the text exactly matches the search term, highlight the entire text
        if (text.toLowerCase() === term.toLowerCase()) {
            return (
                <span className="bg-red-500 text-white px-1 rounded font-semibold">
                    {text}
                </span>
            );
        }
        
        return text;
    };

    return (
        <div
            ref={itemRef}
            className={`mb-3 ${level === 0 ? "border-b border-gray-200" : ""} ${
                isHighlighted ? "bg-gray-200 transition-all duration-300" : ""
            }`}
        >
            {/* Main item header */}
            <div className="w-full flex items-center py-1 px-4">
                <CustomDropdown
                    label={isHighlighted && searchTerm ? highlightSearchTerm(data.label, searchTerm) : data.label}
                    setOpen={handleToggle}
                    open={isOpen}
                    level={level}
                >
                    <svg
                        className={`w-5 h-5 ml-2 transform transition-transform duration-300 ${
                            isOpen ? "rotate-180" : ""
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

                {/* Edit button */}
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

                {/* Delete button */}
                <button
                    type="button"
                    className="ml-2 opacity-70 hover:opacity-100 focus:opacity-100 transition-opacity duration-200 bg-white border border-gray-300 rounded-full p-1 flex items-center justify-center shadow hover:bg-gray-100 focus:ring-2 focus:ring-red-400"
                    tabIndex={0}
                    title="Delete"
                    onClick={() =>
                        handleDeleteClick(
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
            </div>

            {/* Collapsible content */}
            <div
                className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? "max-h opacity-100" : "max-h-0 opacity-0"
                }`}
                style={{ paddingLeft: level * 20 }}
            >
                {/* Descriptions */}
                {data.description && data.description.length > 0 && (
                    <div className="pl-4 border-l border-gray-300 mt-3">
                        <div className="w-full">
                            <div
                                className={`transition-all duration-300 ${
                                    isOpen ? "opacity-100" : "max-h-0 opacity-0"
                                } overflow-hidden`}
                            >
                                {data.description.map((desc, idx) => {
                                    const descHighlighted = searchTargetId && 
                                        desc.descriptionId === searchTargetId;
                                    const isDetailsVisible = showDescriptionDetails[idx] || false;
                                    
                                    return (
                                        <div
                                            key={idx}
                                            className={`p-3 mb-3 bg-white border border-gray-200 rounded shadow-sm ${
                                                descHighlighted
                                                    ? "bg-gray-200 transition-all duration-300"
                                                    : ""
                                            }`}
                                        >
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                                <div className="flex items-center flex-wrap gap-x-2">
                                                    <span className="text-red-700 font-semibold">
                                                        Description:
                                                    </span>
                                                    <span className="text-gray-800 ml-1">
                                                        {descHighlighted && searchTerm ? highlightSearchTerm(desc.label, searchTerm) : desc.label}
                                                    </span>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        type="button"
                                                        className="inline-flex items-center gap-2 px-3 py-2 bg-black text-white font-semibold rounded-lg shadow hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 transition-all duration-200 text-sm"
                                                        onClick={() => toggleDescriptionDetails(idx)}
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className={`h-4 w-4 transform transition-transform duration-200 ${
                                                                isDetailsVisible ? 'rotate-180' : ''
                                                            }`}
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                            strokeWidth={2}
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="M19 9l-7 7-7-7"
                                                            />
                                                        </svg>
                                                        <span>{isDetailsVisible ? 'See less' : 'See more'}</span>
                                                    </button>
                                                    {isDetailsVisible && (
                                                        <button
                                                            type="button"
                                                            className="inline-flex items-center gap-2 px-3 py-2 bg-red-600 text-white font-semibold rounded-lg shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transition-all duration-200 text-sm"
                                                            onClick={() => handleDescriptionEdit(desc.descriptionId)}
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
                                                    )}
                                                </div>
                                            </div>
                                            
                                            {/* DynamicTable - only show when details are visible */}
                                            <div 
                                                className={`overflow-hidden transition-all duration-300 ${
                                                    isDetailsVisible ? 'max-h-screen opacity-100 mt-3' : 'max-h-0 opacity-0'
                                                }`}
                                            >
                                                <DynamicTable data={desc} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* Subfunctions */}
                {data.subfunction && data.subfunction.length > 0 && (
                    <div className="pl-4 border-l border-gray-300 mt-3">
                        {data.subfunction.map((sub, idx) => {
                            return (
                                <FunctionalDropdownItem
                                    key={`${currentPath.join('-')}-${idx}`}
                                    data={sub}
                                    level={level + 1}
                                    searchTargetId={searchTargetId}
                                    searchTerm={searchTerm}
                                    onRef={onRef}
                                    parentPath={currentPath}
                                    refetch={refetch}
                                    isOpen={openChildIndex === idx}
                                    onToggle={(childData, shouldOpen) => handleChildToggle(childData, shouldOpen, idx)}
                                />
                            );
                        })}
                    </div>
                )}
            </div>

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
    );
}