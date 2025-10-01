import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Error, Loading } from "../components/LoadingError";
import { getFunctionById, manageFunction } from "../utils/functional_structure";
import { useQuery } from "@tanstack/react-query";
import Title from "../components/Title";

function ManageFunction() {
    const navigate = useNavigate();
    const { type, id } = useParams();
    const initialFunctionState = React.useCallback(
        () => ({
            functionId: generateId(),
            function: "",
            subfunctions: [
                {
                    id: generateId(),
                    subfunction: "",
                    descriptions: [{ id: generateId(), description: "" }],
                },
            ],
        }),
        [],
    );
    const [functionState, setFunctionState] = useState(initialFunctionState());
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data: functionData, isLoading, isError } = useQuery({
        queryKey: ["function", id],
        queryFn: () => getFunctionById(id),
        enabled: (type === "function" || type === "subfunction") && !!id,
        refetchOnWindowFocus: true,
        refetchOnMount: true,
    });

    // Reset state to blank if on add-function, otherwise set from API if editing
    useEffect(() => {
        if (type === "add-function") {
            setFunctionState(initialFunctionState());
        } else if (functionData) {
            setFunctionState(functionData);
        }
    }, [type, functionData, initialFunctionState]);

    function generateId() {
        return `${Date.now()}${Math.floor(Math.random() * 10000)}`;
    }

    const goBack = () => {
        navigate("/");
    };

    // Update subfunction label
    const handleSubfunctionChange = (id, value) => {
        setFunctionState((prev) => ({
            ...prev,
            subfunctions: prev.subfunctions.map((sf) =>
                sf.id === id ? { ...sf, subfunction: value } : sf,
            ),
        }));
    };

    // Update description for a subfunction
    const handleDescriptionChange = (sfIdx, descIdx, value) => {
        setFunctionState((prev) => ({
            ...prev,
            subfunctions: prev.subfunctions.map((sf, i) => {
                if (i !== sfIdx) return sf;
                const newDescs = sf.descriptions.map((desc, j) =>
                    j === descIdx ? { ...desc, description: value } : desc,
                );
                return { ...sf, descriptions: newDescs };
            }),
        }));
    };

    // Add a new subfunction (with one empty description)
    const addSubfunction = () => {
        setFunctionState((prev) => ({
            ...prev,
            subfunctions: [
                ...prev.subfunctions,
                {
                    id: generateId(),
                    subfunction: "",
                    descriptions: [{ id: generateId(), description: "" }],
                },
            ],
        }));
    };

    // Remove a subfunction
    const removeSubfunction = (idx) => {
        setFunctionState((prev) => ({
            ...prev,
            subfunctions: prev.subfunctions.filter((_, i) => i !== idx),
        }));
    };

    // Add a description to a subfunction
    const addDescription = (sfIdx) => {
        setFunctionState((prev) => ({
            ...prev,
            subfunctions: prev.subfunctions.map((sf, i) =>
                i === sfIdx
                    ? {
                          ...sf,
                          descriptions: [
                              ...sf.descriptions,
                              { id: generateId(), description: "" },
                          ],
                      }
                    : sf,
            ),
        }));
    };

    // Remove a description from a subfunction
    const removeDescription = (sfIdx, descIdx) => {
        setFunctionState((prev) => ({
            ...prev,
            subfunctions: prev.subfunctions.map((sf, i) =>
                i === sfIdx
                    ? {
                          ...sf,
                          descriptions: sf.descriptions.filter(
                              (_, j) => j !== descIdx,
                          ),
                      }
                    : sf,
            ),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            await manageFunction(functionState);
            setShowSuccessModal(true);
        } catch (error) {
            console.error('Error submitting function:', error);
            // You can add error handling here if needed
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleModalOk = () => {
        setShowSuccessModal(false);
        goBack();
    };

    if (isLoading) return <Loading />;
        if (isError)
            return <Error message="Failed to load Edit Functions." />;

    return (
        <div className=" mx-auto p-6 bg-white rounded-lg shadow mt-8">
            <div className="w-full sm:w-auto mb-5">
                {id ? (<Title title="Edit Functions" />) : (<Title title="Add Functions" />)}
                
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Function
                    </label>
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                        value={functionState.function ?? ""}
                        onChange={(e) =>
                            setFunctionState({
                                functionId:
                                    functionState.functionId ?? generateId(),
                                function: e.target.value,
                                subfunctions: [...functionState.subfunctions],
                            })
                        }
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">
                        Subfunction(s)
                    </label>
                    {functionState.subfunctions.map((sf, sfIdx) => (
                        <div
                            key={sf.id}
                            className="mb-4 border border-gray-200 rounded p-3 bg-gray-50"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <input
                                    type="text"
                                    className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                                    value={sf.subfunction}
                                    onChange={(e) =>
                                        handleSubfunctionChange(
                                            sf.id,
                                            e.target.value,
                                        )
                                    }
                                    required
                                    placeholder="Subfunction name"
                                />
                                {functionState.subfunctions.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeSubfunction(sfIdx)}
                                        className="px-2 py-1 text-red-600 hover:text-white hover:bg-red-600 rounded"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                            <div className="ml-0 sm:ml-4">
                                <label className="block text-xs font-medium mb-1">
                                    Description(s)
                                </label>
                                {sf.descriptions.map((desc, descIdx) => (
                                    <div
                                        key={desc.id}
                                        className="flex items-center mb-2 gap-2"
                                    >
                                        <input
                                            type="text"
                                            className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                                            value={desc.description}
                                            onChange={(e) =>
                                                handleDescriptionChange(
                                                    sfIdx,
                                                    descIdx,
                                                    e.target.value,
                                                )
                                            }
                                            required
                                            placeholder="Description"
                                        />
                                        {sf.descriptions.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeDescription(
                                                        sfIdx,
                                                        descIdx,
                                                    )
                                                }
                                                className="px-2 py-1 text-red-600 hover:text-white hover:bg-red-600 rounded"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => addDescription(sfIdx)}
                                    className="mt-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                                >
                                    Add Description
                                </button>
                            </div>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addSubfunction}
                        className="mt-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        Add Subfunction
                    </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        type="button"
                        className="w-full sm:w-auto py-2 px-4 bg-gray-200 text-gray-800 font-semibold rounded hover:bg-gray-300 border border-gray-300"
                        onClick={() => goBack()}
                    >
                        Back
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full sm:w-auto py-2 px-4 bg-black text-white font-semibold rounded hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                    </button>
                </div>
            </form>

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md mx-4 w-full">
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                                <svg
                                    className="h-6 w-6 text-green-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M4.5 12.75l6 6 9-13.5"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Success!
                            </h3>
                            <p className="text-sm text-gray-500 mb-6">
                                {id ? 'Function has been updated successfully.' : 'Function has been created successfully.'}
                            </p>
                            <button
                                onClick={handleModalOk}
                                className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ManageFunction;
