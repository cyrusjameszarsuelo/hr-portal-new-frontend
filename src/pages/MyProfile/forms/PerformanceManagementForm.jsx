import React, { useState } from "react";
import CustomModal from "../../../components/CustomModal";
import ConfirmDialog from "../../../components/ProfileFormComponents/ConfirmDialog";
import FormActionBar from "../../../components/FormActionBar";
import Tabs from "../../../components/Tabs";

function SectionTitle({ children }) {
    return (
        <h2 className="text-lg font-semibold text-[#ee3124] flex items-center gap-2">
            <span className="inline-block w-1 h-6 bg-red-600 rounded-full" />
            {children}
        </h2>
    );
}

export default function PerformanceManagementForm({ renderSection, onSaved, onPrev, onNext, prevDisabled, nextDisabled }) {
    const [loading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [confirmState, setConfirmState] = useState({
        open: false,
        title: "",
        message: "",
        onConfirm: null,
    });
    const [expandedObjectives, setExpandedObjectives] = useState([]);
    const [expandedCompetencies, setExpandedCompetencies] = useState([]);
    const [activeTab, setActiveTab] = useState("objectives");
    const [competencies, setCompetencies] = useState([
        {
            title: "Implementing Objectives and Initiatives",
            weight: "",
            individualRating: "",
            finalRating: "",
            description: "",
            example: { date: "", time: "", notes: "" },
        },
    ]);

    const [objectives, setObjectives] = useState([
        {
            title: "",
            weight: "",
            individualRating: "",
            finalRating: "",
            description: "",
            keyPerformanceIndicators: "",
            ratingStandards: {
                5: "",
                4: "",
                3: "",
                2: "",
                1: "",
            },
            deliverables: "",
            accomplishments: "",
        },
    ]);

    const toggleObjective = (index) => {
        setExpandedObjectives((prev) =>
            prev.includes(index)
                ? prev.filter((i) => i !== index)
                : [...prev, index]
        );
    };

    const addObjective = () => {
        setObjectives([
            ...objectives,
            {
                title: "",
                weight: "",
                individualRating: "",
                finalRating: "",
                description: "",
                keyPerformanceIndicators: "",
                ratingStandards: {
                    5: "",
                    4: "",
                    3: "",
                    2: "",
                    1: "",
                },
                deliverables: "",
                accomplishments: "",
            },
        ]);
        setExpandedObjectives([...expandedObjectives, objectives.length]);
    };

    const removeObjectiveDirect = (index) => {
        setObjectives(objectives.filter((_, i) => i !== index));
        setExpandedObjectives(expandedObjectives.filter((i) => i !== index));
    };

    const confirmRemoveObjective = (index) => {
        setConfirmState({
            open: true,
            title: "Remove Objective",
            message: "This will remove the selected objective and its data. Continue?",
            onConfirm: () => removeObjectiveDirect(index),
        });
    };

    const updateObjective = (index, field, value) => {
        setObjectives(
            objectives.map((obj, i) =>
                i === index ? { ...obj, [field]: value } : obj
            )
        );
    };

    const updateRatingStandard = (objIndex, rating, value) => {
        setObjectives(
            objectives.map((obj, i) =>
                i === objIndex
                    ? {
                          ...obj,
                          ratingStandards: {
                              ...obj.ratingStandards,
                              [rating]: value,
                          },
                      }
                    : obj
            )
        );
    };

    // Competencies helpers
    const toggleCompetency = (index) => {
        setExpandedCompetencies((prev) =>
            prev.includes(index)
                ? prev.filter((i) => i !== index)
                : [...prev, index]
        );
    };

    const addCompetency = () => {
        setCompetencies((prev) => [
            ...prev,
            {
                title: `Competency ${prev.length + 1}`,
                weight: "",
                individualRating: "",
                finalRating: "",
                description: "",
                example: { date: "", time: "", notes: "" },
            },
        ]);
        setExpandedCompetencies((prev) => [...prev, competencies.length]);
    };

    const removeCompetencyDirect = (index) => {
        setCompetencies((prev) => prev.filter((_, i) => i !== index));
        setExpandedCompetencies((prev) => prev.filter((i) => i !== index));
    };

    const confirmRemoveCompetency = (index) => {
        setConfirmState({
            open: true,
            title: "Remove Competency",
            message: "This will remove the selected competency. Continue?",
            onConfirm: () => removeCompetencyDirect(index),
        });
    };

    const updateCompetency = (index, field, value) => {
        setCompetencies((prev) =>
            prev.map((c, i) => (i === index ? { ...c, [field]: value } : c))
        );
    };

    const updateExample = (index, field, value) => {
        setCompetencies((prev) =>
            prev.map((c, i) =>
                i === index
                    ? { ...c, example: { ...c.example, [field]: value } }
                    : c
            )
        );
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            // TODO: Add API call to save objectives
            console.log("Saving objectives:", objectives);
            console.log("Saving competencies:", competencies);
            setShowSuccessModal(true);
        } catch (error) {
            console.error("Error saving objectives:", error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-gray-500">Loading...</div>
            </div>
        );
    }

    const objectivesContent = (
        <div className="space-y-4">
                {objectives.map((objective, index) => (
                    <div
                        key={index}
                        className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                        {/* Objective Header */}
                        <div
                            className="bg-gray-50 px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-gray-100"
                            onClick={() => toggleObjective(index)}
                        >
                            <div className="flex-1">
                                <h3 className="text-base font-semibold text-[#ee3124]">
                                    Objective {index + 1}:{" "}
                                    {objective.title || "Untitled Objective"}
                                </h3>
                            </div>
                            <div className="flex items-center gap-4">
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleObjective(index);
                                    }}
                                    className="text-gray-600 hover:text-[#ee3124] font-semibold"
                                >
                                    {expandedObjectives.includes(index)
                                        ? "See less"
                                        : "See more"}
                                </button>
                            </div>
                        </div>

                        {/* Objective Content */}
                        {expandedObjectives.includes(index) && (
                            <div className="p-4 space-y-4">
                                {/* Title Input */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Objective Title{" "}
                                        <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={objective.title}
                                        onChange={(e) =>
                                            updateObjective(
                                                index,
                                                "title",
                                                e.target.value
                                            )
                                        }
                                        className="w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-3 py-2 shadow-sm text-sm"
                                        placeholder="e.g., To update Governance Structure and Charters..."
                                    />
                                </div>

                                {/* Weight, Individual Rating, Final Rating */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Weight
                                        </label>
                                        <input
                                            type="text"
                                            value={objective.weight}
                                            onChange={(e) =>
                                                updateObjective(
                                                    index,
                                                    "weight",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-3 py-2 shadow-sm text-sm"
                                            placeholder="--"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Individual Rating
                                        </label>
                                        <select
                                            value={objective.individualRating}
                                            onChange={(e) =>
                                                updateObjective(
                                                    index,
                                                    "individualRating",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full rounded-md bg-white border border-gray-300 text-gray-900 focus:border-[#ee3124] focus:ring-[#ee3124] px-3 py-2 shadow-sm text-sm"
                                        >
                                            <option value="">--</option>
                                            <option value="5">5</option>
                                            <option value="4">4</option>
                                            <option value="3">3</option>
                                            <option value="2">2</option>
                                            <option value="1">1</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Final Rating
                                        </label>
                                        <input
                                            type="text"
                                            value={objective.finalRating}
                                            onChange={(e) =>
                                                updateObjective(
                                                    index,
                                                    "finalRating",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-3 py-2 shadow-sm text-sm"
                                            placeholder="--"
                                        />
                                    </div>
                                </div>

                                {/* Three Column Layout: Description, Rating Standards, Deliverables */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                    {/* Description */}
                                    <div>
                                        <label className="block text-sm font-semibold text-[#ee3124] mb-2">
                                            Description
                                        </label>
                                        <textarea
                                            value={objective.description}
                                            onChange={(e) =>
                                                updateObjective(
                                                    index,
                                                    "description",
                                                    e.target.value
                                                )
                                            }
                                            rows={4}
                                            className="w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-3 py-2 shadow-sm text-sm"
                                            placeholder="• Text"
                                        />
                                        <div className="mt-4">
                                            <label className="block text-sm font-semibold text-[#ee3124] mb-2">
                                                Key Performance Indicators
                                            </label>
                                            <textarea
                                                value={
                                                    objective.keyPerformanceIndicators
                                                }
                                                onChange={(e) =>
                                                    updateObjective(
                                                        index,
                                                        "keyPerformanceIndicators",
                                                        e.target.value
                                                    )
                                                }
                                                rows={4}
                                                className="w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-3 py-2 shadow-sm text-sm"
                                                placeholder="• Text"
                                            />
                                        </div>
                                    </div>

                                    {/* Rating Standards */}
                                    <div>
                                        <label className="block text-sm font-semibold text-[#ee3124] mb-2">
                                            Rating Standards
                                        </label>
                                        <div className="space-y-2">
                                            {[5, 4, 3, 2, 1].map((rating) => (
                                                <div key={rating}>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="w-8 h-8 flex items-center justify-center bg-gray-200 text-gray-700 font-semibold rounded text-sm">
                                                            {rating}
                                                        </span>
                                                        <textarea
                                                            value={
                                                                objective
                                                                    .ratingStandards[
                                                                    rating
                                                                ]
                                                            }
                                                            onChange={(e) =>
                                                                updateRatingStandard(
                                                                    index,
                                                                    rating,
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            rows={2}
                                                            className="flex-1 rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1 shadow-sm text-xs"
                                                            placeholder="• Text"
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Deliverables & Accomplishments */}
                                    <div>
                                        <label className="block text-sm font-semibold text-[#ee3124] mb-2">
                                            Deliverables
                                        </label>
                                        <textarea
                                            value={objective.deliverables}
                                            onChange={(e) =>
                                                updateObjective(
                                                    index,
                                                    "deliverables",
                                                    e.target.value
                                                )
                                            }
                                            rows={4}
                                            className="w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-3 py-2 shadow-sm text-sm"
                                            placeholder="• Text"
                                        />
                                        <div className="mt-4">
                                            <label className="block text-sm font-semibold text-[#ee3124] mb-2">
                                                Accomplishments
                                            </label>
                                            <textarea
                                                value={
                                                    objective.accomplishments
                                                }
                                                onChange={(e) =>
                                                    updateObjective(
                                                        index,
                                                        "accomplishments",
                                                        e.target.value
                                                    )
                                                }
                                                rows={4}
                                                className="w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-3 py-2 shadow-sm text-sm"
                                                placeholder="• Text"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Remove Objective Button */}
                                {objectives.length > 1 && (
                                    <div className="flex justify-end pt-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                confirmRemoveObjective(index)
                                            }
                                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md"
                                        >
                                            Remove Objective
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            {/* Add New Objective Button */}
            <div className="mt-6 flex justify-end">
                <button
                    type="button"
                    onClick={addObjective}
                    className="px-4 py-2 bg-white border-2 border-[#ee3124] text-[#ee3124] hover:bg-[#ee3124] hover:text-white text-sm font-medium rounded-md flex items-center gap-2"
                >
                    <span className="text-xl font-bold">+</span>
                    Add New Objective
                </button>
            </div>
        </div>
    );

    const competenciesContent = (
        <div className="space-y-4">
                    {competencies.map((comp, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                            {/* Header */}
                            <div
                                className="bg-gray-50 px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-gray-100"
                                onClick={() => toggleCompetency(index)}
                            >
                                <div className="flex-1">
                                    <h3 className="text-base font-semibold text-[#ee3124]">
                                        {comp.title || `Competency ${index + 1}`}
                                    </h3>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleCompetency(index);
                                        }}
                                        className="text-gray-600 hover:text-[#ee3124] font-semibold"
                                    >
                                        {expandedCompetencies.includes(index) ? "See less" : "See more"}
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            {expandedCompetencies.includes(index) && (
                                <div className="p-4 space-y-4">
                                    {/* Title Input */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Competency Title <span className="text-red-600">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={comp.title}
                                            onChange={(e) => updateCompetency(index, "title", e.target.value)}
                                            className="w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-3 py-2 shadow-sm text-sm"
                                            placeholder="e.g., Implementing Objectives and Initiatives"
                                        />
                                    </div>
                                    {/* Weight, Ratings */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                                            <input
                                                type="text"
                                                value={comp.weight}
                                                onChange={(e) => updateCompetency(index, "weight", e.target.value)}
                                                className="w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-3 py-2 shadow-sm text-sm"
                                                placeholder="--"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Individual Rating</label>
                                            <select
                                                value={comp.individualRating}
                                                onChange={(e) => updateCompetency(index, "individualRating", e.target.value)}
                                                className="w-full rounded-md bg-white border border-gray-300 text-gray-900 focus:border-[#ee3124] focus:ring-[#ee3124] px-3 py-2 shadow-sm text-sm"
                                            >
                                                <option value="">--</option>
                                                <option value="5">5</option>
                                                <option value="4">4</option>
                                                <option value="3">3</option>
                                                <option value="2">2</option>
                                                <option value="1">1</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Final Rating</label>
                                            <input
                                                type="text"
                                                value={comp.finalRating}
                                                onChange={(e) => updateCompetency(index, "finalRating", e.target.value)}
                                                className="w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-3 py-2 shadow-sm text-sm"
                                                placeholder="--"
                                            />
                                        </div>
                                    </div>

                                    {/* Two columns: Description and Cite Critical Examples */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-[#ee3124] mb-2">Description</label>
                                            <textarea
                                                value={comp.description}
                                                onChange={(e) => updateCompetency(index, "description", e.target.value)}
                                                rows={8}
                                                className="w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-3 py-2 shadow-sm text-sm"
                                                placeholder="• Text"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-[#ee3124] mb-2">Cite Critical Examples</label>
                                            <div className="grid grid-cols-2 gap-3 mb-2">
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">Date:</label>
                                                    <input
                                                        type="date"
                                                        value={comp.example.date}
                                                        onChange={(e) => updateExample(index, "date", e.target.value)}
                                                        className="w-full rounded-md bg-white border border-gray-300 text-gray-900 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1.5 shadow-sm text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">Time:</label>
                                                    <input
                                                        type="time"
                                                        value={comp.example.time}
                                                        onChange={(e) => updateExample(index, "time", e.target.value)}
                                                        className="w-full rounded-md bg-white border border-gray-300 text-gray-900 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1.5 shadow-sm text-sm"
                                                    />
                                                </div>
                                            </div>
                                            <textarea
                                                value={comp.example.notes}
                                                onChange={(e) => updateExample(index, "notes", e.target.value)}
                                                rows={8}
                                                className="w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-3 py-2 shadow-sm text-sm"
                                                placeholder="• Text"
                                            />
                                        </div>
                                    </div>

                                    {/* Remove Competency */}
                                    {competencies.length > 1 && (
                                        <div className="flex justify-end pt-2">
                                            <button
                                                type="button"
                                                onClick={() => confirmRemoveCompetency(index)}
                                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md"
                                            >
                                                Remove Competency
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                {/* Add New Competency */}
                <div className="mt-6 flex justify-end">
                    <button
                        type="button"
                        onClick={addCompetency}
                        className="px-4 py-2 bg-white border-2 border-[#ee3124] text-[#ee3124] hover:bg-[#ee3124] hover:text-white text-sm font-medium rounded-md flex items-center gap-2"
                    >
                        <span className="text-xl font-bold">+</span>
                        Add New Competency
                    </button>
                </div>
        </div>
    );
    // If caller asked to render only a specific section, return that content (wrapped similarly)
    if (renderSection === "objectives") {
        return (
            <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-6">
                <SectionTitle>Individual Objectives & Deliverables</SectionTitle>
                <div className="mt-4">{objectivesContent}</div>
            </div>
        );
    }

    if (renderSection === "competencies") {
        return (
            <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-6">
                <SectionTitle>Competencies & Values</SectionTitle>
                <div className="mt-4">{competenciesContent}</div>
            </div>
        );
    }

    return (
        <div className="bg-white border border-gray-200 shadow-xl rounded-lg p-6">
            <SectionTitle>Performance Management</SectionTitle>

            <div className="mt-4">
                <Tabs
                    tabs={[
                        {
                            id: "objectives",
                            label: "Individual Objectives & Deliverables",
                            content: objectivesContent,
                        },
                        {
                            id: "competencies",
                            label: "Competencies & Values",
                            content: competenciesContent,
                        },
                    ]}
                    active={activeTab}
                    onChange={setActiveTab}
                />
            </div>

            {/* Save Button */}
            <FormActionBar
                onPrev={onPrev}
                onNext={onNext}
                prevDisabled={prevDisabled}
                nextDisabled={nextDisabled}
                onSave={handleSave}
                saving={saving}
                saveLabel="Save Performance"
            />

            {/* Success Modal */}
            {showSuccessModal && (
                <CustomModal
                    isOpen={showSuccessModal}
                    onClose={() => {
                        setShowSuccessModal(false);
                        if (onSaved) onSaved();
                    }}
                    title="Success"
                    message="Performance objectives have been saved successfully!"
                />
            )}

            {/* Confirm Delete Dialog */}
            <ConfirmDialog
                open={confirmState.open}
                title={confirmState.title}
                message={confirmState.message}
                onCancel={() => setConfirmState((p) => ({ ...p, open: false }))}
                onConfirm={() => {
                    try {
                        confirmState.onConfirm && confirmState.onConfirm();
                    } finally {
                        setConfirmState((p) => ({ ...p, open: false }));
                    }
                }}
            />
        </div>
    );
}
