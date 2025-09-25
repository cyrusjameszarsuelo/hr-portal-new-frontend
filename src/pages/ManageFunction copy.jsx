import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
    getFunctionById,
    getSubFunctionById,
    manageFunction,
} from "../utils/functional_structure";
import { Error, Loading } from "../components/LoadingError";

function ManageFunction() {
    const [func, setFunc] = useState({
        id: "",
        function: "",
    });
    const [subfunctions, setSubfunctions] = useState([""]);
    const [descriptions, setDescriptions] = useState([""]);
    const { type, id } = useParams();
    const navigate = useNavigate();

    // Use both queries, but only enable the relevant one
    const subfunctionQuery = useQuery({
        queryKey: ["subfunction"],
        queryFn: () => getSubFunctionById(id),
        enabled: type === "subfunction",
    });
    const functionQuery = useQuery({
        queryKey: ["function"],
        queryFn: () => getFunctionById(id),
        enabled: type !== "subfunction",
    });

    const isLoading = subfunctionQuery.isLoading || functionQuery.isLoading;
    const isError = subfunctionQuery.isError || functionQuery.isError;
    let functionData;

    if (type === "subfunction") {
        functionData = subfunctionQuery.data;
    } else {
        functionData = functionQuery.data;
    }

    const goBack = () => {
        navigate('/');
    }

    const handleSubfunctionChange = (id, value) => {
        setSubfunctions((prev) =>
            prev.map((sf, idx) => {
                // If it's a new entry (no id), assign a new id on change
                if (
                    (!id && !sf.id && idx === prev.length - 1) ||
                    sf.id === id
                ) {
                    return {
                        ...sf,
                        subfunction: value,
                        id: sf.id || generateId(),
                    };
                }
                return sf;
            }),
        );
    };
    const handleDescriptionChange = (idx, value) => {
        setDescriptions((prev) =>
            prev.map((desc, i) => {
                if (i === idx) {
                    // If no id, assign a new one
                    if (!desc.id) {
                        return {
                            id: generateId(),
                            description: value,
                        };
                    }
                    return {
                        ...desc,
                        description: value,
                    };
                }
                return desc;
            }),
        );
    };
    // Helper to generate a unique ID (timestamp + random)
    const generateId = () =>
        `${Date.now()}${Math.floor(Math.random() * 10000)}`;

    const addSubfunction = () =>
        setSubfunctions([
            ...subfunctions,
            { id: generateId(), subfunction: "" },
        ]);
    const removeSubfunction = (idx) =>
        setSubfunctions(subfunctions.filter((_, i) => i !== idx));
    const addDescription = () => setDescriptions([...descriptions, ""]);
    const removeDescription = (idx) =>
        setDescriptions(descriptions.filter((_, i) => i !== idx));

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here

        if (type === "function") {
            const data = { func, subfunctions };

            manageFunction(data);
        } else if (type === "subfunction") {
            const data = { func, subfunctions, descriptions };

            manageFunction(data);
        } else {
            const data = { func, subfunctions };

            manageFunction(data);
        }

        goBack();
    };

    useEffect(() => {
        if (functionData) {
            setFunc({
                id: functionData.functionId || "",
                function: functionData.function || "",
            });
            setSubfunctions(
                functionData.subfunctions?.length
                    ? functionData.subfunctions
                    : functionData.subfunction?.length
                    ? [
                          {
                              id: functionData.subfunctionId || "",
                              subfunction: functionData.subfunction || "",
                          },
                      ]
                    : [""],
            );
            setDescriptions(
                functionData.descriptions?.length
                    ? functionData.descriptions
                    : [""],
            );
        } else {
            setFunc("");
            setSubfunctions([""]);
            setDescriptions([""]);
        }
    }, [functionData]);

    if (isLoading) return <Loading />;
    if (isError)
        return <Error message="Failed to load functional structure." />;

    return (
        <div className=" mx-auto p-6 bg-white rounded-lg shadow mt-8">
            <h2 className="text-2xl font-bold mb-6">Manage Function</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Function
                    </label>
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                        value={func.function ?? func}
                        onChange={(e) =>
                            setFunc({
                                id: func.id ?? "",
                                function: e.target.value,
                            })
                        }
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Subfunction(s)
                    </label>
                    {subfunctions.map((sf, idx) => (
                        <div key={idx} className="flex items-center mb-2">
                            <input
                                type="text"
                                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                                value={sf.subfunction ?? sf}
                                onChange={(e) =>
                                    handleSubfunctionChange(
                                        sf.id,
                                        e.target.value,
                                    )
                                }
                                required
                            />
                            {subfunctions.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeSubfunction(idx)}
                                    className="ml-2 px-2 py-1 text-red-600 hover:text-white hover:bg-red-600 rounded"
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                    ))}
                    {type !== "subfunction" && (
                        <button
                            type="button"
                            onClick={addSubfunction}
                            className="mt-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                            Add Subfunction
                        </button>
                    )}
                </div>
                {type === "subfunction" && (
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Description(s)
                        </label>
                        {descriptions.map((desc, idx) => (
                            <div key={idx} className="flex items-center mb-2">
                                <input
                                    type="text"
                                    className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                                    value={desc.description ?? desc}
                                    onChange={(e) =>
                                        handleDescriptionChange(
                                            idx,
                                            e.target.value,
                                        )
                                    }
                                    required
                                />
                                {descriptions.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeDescription(idx)}
                                        className="ml-2 px-2 py-1 text-red-600 hover:text-white hover:bg-red-600 rounded"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addDescription}
                            className="mt-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                            Add Description
                        </button>
                    </div>
                )}

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
                        className="w-full sm:w-auto py-2 px-4 bg-black text-white font-semibold rounded hover:bg-gray-800"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ManageFunction;
