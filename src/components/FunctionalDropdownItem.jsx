import React, {
    useState,
    useRef,
    useEffect,
    useCallback,
    useMemo,
} from "react";
import { useNavigate } from "react-router";
import CustomDropdown from "./CustomDropdown";
import ButtonIcon from "./ButtonIcon";
import CustomModal from "./CustomModal";
import DynamicTable from "./DynamicTable";
import {
    deleteFunction,
    reorderSubfunctions,
    reorderDescriptions,
} from "../database/functional_structure";
import useUser from "../contexts/useUser";

function useDraggableList(initial = []) {
    const [items, setItems] = useState(() => (initial ? [...initial] : []));
    useEffect(() => setItems(initial ? [...initial] : []), [initial]);
    const dragSrc = useRef(null);
    const [dragOver, setDragOver] = useState(null);

    const onDragStart = useCallback((e, idx) => {
        e.stopPropagation();
        dragSrc.current = idx;
        e.dataTransfer.effectAllowed = "move";
        try {
            e.dataTransfer.setData("text/plain", String(idx));
        } catch {
            // ignore setDataTransfer errors on some browsers
        }
    }, []);

    const onDragOver = useCallback((e, idx) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOver(idx);
    }, []);

    const onDrop = useCallback(
        (e, idx, persistFn) => {
            e.preventDefault();
            e.stopPropagation();
            const src =
                dragSrc.current != null
                    ? dragSrc.current
                    : Number(e.dataTransfer.getData("text/plain"));
            if (isNaN(src) || src === idx) {
                setDragOver(null);
                dragSrc.current = null;
                return;
            }
            const prev = Array.from(items);
            const copy = Array.from(items);
            const [moved] = copy.splice(src, 1);
            copy.splice(idx, 0, moved);
            // update UI immediately
            setItems(copy);
            setDragOver(null);
            dragSrc.current = null;
            // optional persistence
            if (persistFn) {
                // pass previous list so the persister can revert on failure
                persistFn(copy, prev).catch((err) => {
                    console.error("persist error", err);
                    // revert UI
                    try {
                        setItems(prev);
                    } catch (revertErr) {
                        console.error("revert error", revertErr);
                    }
                });
            }
            return copy;
        },
        [items],
    );

    const onDragEnd = useCallback((e) => {
        e.stopPropagation();
        setDragOver(null);
        dragSrc.current = null;
    }, []);

    return {
        items,
        setItems,
        dragSrc,
        dragOver,
        onDragStart,
        onDragOver,
        onDrop,
        onDragEnd,
    };
}

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
    onReorder,
}) {
    const navigate = useNavigate();
    const itemRef = useRef(null);
    const { user } = useUser();
    const jobTitle = user ? (user.job_title || "").toLowerCase() : "";

    // Delete modal state
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteData, setDeleteData] = useState({ id: null, type: null });

    // Local lists: subfunctions and descriptions (to support reorder UI)
    const subInitial = useMemo(
        () => (data.subfunction ? [...data.subfunction] : []),
        [data.subfunction],
    );
    const descInitial = useMemo(
        () => (data.description ? [...data.description] : []),
        [data.description],
    );

    const {
        items: subItems,
        setItems: setSubItems,
        dragOver: subDragOver,
        onDragStart: handleSubDragStart,
        onDragOver: handleSubDragOver,
        onDrop: handleSubDrop,
        onDragEnd: handleSubDragEnd,
    } = useDraggableList(subInitial);

    const {
        items: descriptions,
        setItems: setDescriptions,
        dragOver: descDragOver,
        // description drag handlers (enabled)
        onDragStart: handleDescDragStart,
        onDragOver: handleDescDragOver,
        onDrop: handleDescDrop,
        onDragEnd: handleDescDragEnd,
    } = useDraggableList(descInitial);

    useEffect(
        () => setSubItems(data.subfunction ? [...data.subfunction] : []),
        [data.subfunction, setSubItems],
    );
    useEffect(
        () => setDescriptions(data.description ? [...data.description] : []),
        [data.description, setDescriptions],
    );

    // Item identification
    const itemId = data.id || data.subfunction_id;
    const currentPath = useMemo(
        () => [...parentPath, itemId],
        [parentPath, itemId],
    );

    // Register this item for search functionality
    useEffect(() => {
        if (onRef) {
            onRef(itemId, {
                setOpen: () => onToggle(data, !isOpen),
                ref: itemRef,
                path: currentPath,
            });
        }
    }, [onRef, itemId, onToggle, data, isOpen, currentPath]);

    const isHighlighted =
        searchTargetId &&
        (data.id === searchTargetId || data.subfunction_id === searchTargetId);

    // child open index
    const [openChildIndex, setOpenChildIndex] = useState(null);
    const handleChildToggle = useCallback(
        (_, shouldOpen, idx) => setOpenChildIndex(shouldOpen ? idx : null),
        [],
    );

    // Navigation / actions
    const handleEdit = (id, type) => navigate(`/manage-function/${type}/${id}`);
    const handleDeleteClick = (id, type) => {
        setShowDeleteModal(true);
        setDeleteData({ id, type });
    };
    const handleDelete = async () => {
        try {
            await deleteFunction(deleteData);
            if (typeof refetch === "function") await refetch();
        } finally {
            setShowDeleteModal(false);
        }
    };

    const handleDescriptionEdit = (subfunctionDescriptionId, paramId) => {
        navigate(
            `/manage-description/${subfunctionDescriptionId || ""}/${paramId || ""}`,
        );
    };

    // description details visibility map
    const [showDescriptionDetails, setShowDescriptionDetails] = useState({});
    const toggleDescriptionDetails = (idx) =>
        setShowDescriptionDetails((p) => ({ ...p, [idx]: !p[idx] }));

    // Audit logs were consolidated to a dedicated page; per-item audit UI removed.

    // Persist helpers
    const persistSubOrder = useCallback(
        async (items, prev) => {
            try {
                const orderedIds = items.map((i) => i.subfunction_id || i.id);
                // console.debug('persistSubOrder request', { parentId: data.id || data.subfunction_id, orderedIds });
                await reorderSubfunctions(
                    data.id || data.subfunction_id,
                    orderedIds,
                );
                if (typeof refetch === "function") await refetch();
                if (typeof onReorder === "function") onReorder(items, data);
            } catch (err) {
                console.error("persistSubOrder failed", err, {
                    parent: data,
                    items,
                    prev,
                });
                throw err;
            }
        },
        [data, refetch, onReorder],
    );

    // persistDescOrder is commented out while description reordering is disabled.
    const persistDescOrder = useCallback(
        async (items, prev) => {
            try {
                const orderedIds = items.map((d) => d.descriptionId || d.id);
                // console.debug('persistDescOrder request', { parentId: data.subfunction_id || data.id, orderedIds });
                await reorderDescriptions(
                    data.subfunction_id || data.id,
                    orderedIds,
                );
                if (typeof refetch === "function") await refetch();
                if (typeof onReorder === "function") onReorder(items, data);
            } catch (err) {
                console.error("persistDescOrder failed", err, {
                    parent: data,
                    items,
                    prev,
                });
                throw err;
            }
        },
        [data, refetch, onReorder],
    );

    // Wire draggable list drop handlers to persistence functions
    const onSubDrop = useCallback(
        (e, idx) => {
            console.debug("onSubDrop called", { idx });
            return handleSubDrop(e, idx, persistSubOrder);
        },
        [handleSubDrop, persistSubOrder],
    );
    const onDescDrop = useCallback(
        (e, idx) => {
            console.debug("onDescDrop called", { idx });
            return handleDescDrop(e, idx, persistDescOrder);
        },
        [handleDescDrop, persistDescOrder],
    );

    // Highlight helper
    const highlightSearchTerm = (text, term) => {
        if (!term || !text) return text;
        if (text.toLowerCase() === term.toLowerCase())
            return (
                <span className="bg-red-500 text-white px-1 rounded font-semibold">
                    {text}
                </span>
            );
        return text;
    };

    // Audit diff rendering logic removed — audit viewing moved to centralized page.

    return (
        <div
            ref={itemRef}
            className={`mb-3 ${level === 0 ? "border-b border-gray-200" : ""} ${
                isHighlighted ? "bg-gray-200 transition-all duration-300" : ""
            }`}
        >
            <div className="w-full flex items-center py-1 px-4">
                <CustomDropdown
                    label={
                        isHighlighted && searchTerm
                            ? highlightSearchTerm(data.label, searchTerm)
                            : data.label
                    }
                    setOpen={() => onToggle(data, !isOpen)}
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

                {jobTitle &&
                    (jobTitle.includes("admin") ||
                        jobTitle.includes("hr") ||
                        jobTitle.includes("developer")) && (
                        <>
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
                                title="Delete"
                                onClick={() =>
                                    handleDeleteClick(
                                        data.subfunction_id ?? data.id,
                                        data.subfunction_id
                                            ? "subfunction"
                                            : "function",
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
                        </>
                    )}
            </div>

            <div
                className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? "max-h opacity-100" : "max-h-0 opacity-0"
                }`}
            >
                {/* Descriptions */}
                {descriptions && descriptions.length > 0 && (
                    <div className="pl-4 border-l border-gray-300 mt-3">
                        <div
                            className={`transition-all duration-300 ${
                                isOpen ? "opacity-100" : "max-h-0 opacity-0"
                            } overflow-hidden`}
                        >
                            {descriptions.map((desc, idx) => {
                                const descHighlighted =
                                    searchTargetId &&
                                    (desc.paramId === searchTargetId ||
                                        desc.id === searchTargetId);
                                const isDetailsVisible =
                                    showDescriptionDetails[idx] || false;
                                const dragOverClass =
                                    descDragOver === idx
                                        ? "opacity-70 border-2 border-dashed border-gray-300 rounded"
                                        : "";
                                return (
                                    <div
                                        key={desc.id ?? idx}
                                        className={`mb-3 sm:flex sm:items-start sm:gap-2 sm:w-full ${dragOverClass}`}
                                    >
                                        <div
                                            draggable
                                            onDragStart={(e) =>
                                                handleDescDragStart(e, idx)
                                            }
                                            onDragOver={(e) =>
                                                handleDescDragOver(e, idx)
                                            }
                                            onDrop={(e) => onDescDrop(e, idx)}
                                            onDragEnd={handleDescDragEnd}
                                            className="hidden sm:flex items-center justify-center w-8 h-8 bg-gray-100 rounded cursor-grab"
                                            title="Drag to reorder"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4 text-gray-600"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M4 7h16M4 12h16M4 17h16"
                                                />
                                            </svg>
                                        </div>
                                        <div
                                            className={`flex-1 p-3 bg-white border border-gray-200 rounded shadow-sm ${
                                                descHighlighted
                                                    ? "bg-gray-200 transition-all duration-300"
                                                    : ""
                                            }`}
                                        >
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center flex-wrap gap-x-2">
                                                        <span className="text-red-700 font-semibold">
                                                            Description:
                                                        </span>
                                                        <span className="text-gray-800 ml-1">
                                                            {descHighlighted &&
                                                            searchTerm
                                                                ? highlightSearchTerm(
                                                                      desc.label,
                                                                      searchTerm,
                                                                  )
                                                                : desc.label}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-2 justify-end">
                                                    <button
                                                        type="button"
                                                        className="inline-flex items-center gap-2 px-3 py-2 bg-black text-white font-semibold rounded-lg shadow hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 transition-all duration-200 text-sm flex-shrink-0 min-w-[96px] justify-center"
                                                        onClick={() =>
                                                            toggleDescriptionDetails(
                                                                idx,
                                                            )
                                                        }
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className={`h-4 w-4 transform transition-transform duration-200 ${
                                                                isDetailsVisible
                                                                    ? "rotate-180"
                                                                    : ""
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
                                                        <span>
                                                            {isDetailsVisible
                                                                ? "See less"
                                                                : "See more"}
                                                        </span>
                                                    </button>
                                                    {isDetailsVisible &&
                                                        jobTitle &&
                                                        (jobTitle.includes(
                                                            "admin",
                                                        ) ||
                                                            jobTitle.includes(
                                                                "hr",
                                                            ) ||
                                                            jobTitle.includes(
                                                                "developer",
                                                            )) && (
                                                            <button
                                                                type="button"
                                                                className="inline-flex items-center gap-2 px-3 py-2 bg-red-600 text-white font-semibold rounded-lg shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transition-all duration-200 text-sm flex-shrink-0"
                                                                onClick={() =>
                                                                    handleDescriptionEdit(
                                                                        desc.descriptionId,
                                                                        desc.paramId,
                                                                    )
                                                                }
                                                            >
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    className="h-4 w-4"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    stroke="currentColor"
                                                                    strokeWidth={
                                                                        2
                                                                    }
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828A2 2 0 019 17H7v-2a2 2 0 01.586-1.414z"
                                                                    />
                                                                </svg>
                                                                <span>
                                                                    Edit
                                                                </span>
                                                            </button>
                                                        )}
                                                </div>
                                            </div>

                                            <div
                                                className={`overflow-hidden transition-all duration-300 ${
                                                    isDetailsVisible
                                                        ? "max-h-screen opacity-100 mt-3"
                                                        : "max-h-0 opacity-0"
                                                }`}
                                            >
                                                <DynamicTable data={desc} />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Subfunctions */}
                {subItems && subItems.length > 0 && (
                    <div className="pl-4 border-l border-gray-300 mt-3">
                        {subItems.map((sub, idx) => {
                            const dragOverClass =
                                subDragOver === idx
                                    ? "opacity-70 border-2 border-dashed border-gray-300 rounded"
                                    : "";
                            return (
                                <div
                                    key={`${currentPath.join("-")}-${idx}`}
                                    className={`mb-2 flex  ${dragOverClass}`}
                                >
                                    <div
                                        draggable
                                        onDragStart={(e) =>
                                            handleSubDragStart(e, idx)
                                        }
                                        onDragOver={(e) =>
                                            handleSubDragOver(e, idx)
                                        }
                                        onDrop={(e) => onSubDrop(e, idx)}
                                        onDragEnd={handleSubDragEnd}
                                        className="hidden sm:flex items-center justify-center w-8 h-8 bg-gray-100 rounded cursor-grab"
                                        title="Drag to reorder"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4 text-gray-600"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M4 7h16M4 12h16M4 17h16"
                                            />
                                        </svg>
                                    </div>
                                    <div className="flex-1 w-10">
                                        <FunctionalDropdownItem
                                            data={sub}
                                            level={level + 1}
                                            searchTargetId={searchTargetId}
                                            searchTerm={searchTerm}
                                            onRef={onRef}
                                            parentPath={currentPath}
                                            refetch={refetch}
                                            isOpen={openChildIndex === idx}
                                            onToggle={(childData, shouldOpen) =>
                                                handleChildToggle(
                                                    childData,
                                                    shouldOpen,
                                                    idx,
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

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
