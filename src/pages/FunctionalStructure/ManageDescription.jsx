import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import {
    getDescriptionById,
    manageDescription,
} from "../../database/functional_structure";
import { useEffect, useState } from "react";
import { Error, Loading } from "../../components/LoadingError";
import Title from "../../components/Title";

export default function ManageDescription() {
    const [description, setDescription] = useState({
        id: null,
        subfunctionId: null,
        deliverable: "",
        frequency_deliverable: "",
        responsible: "",
        accountable: "",
        support: "",
        consulted: "",
        informed: "",
    });
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const { subfunctionId, descriptionId } = useParams();

    const {
        data: descriptionData,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["description", descriptionId],
        queryFn: async () => getDescriptionById(descriptionId),
        enabled: descriptionId !== undefined && descriptionId !== null,
        refetchOnMount: true,
        refetchOnWindowFocus: true,
    });

    const goBack = () => {
        navigate("/");
    };

    const changeDescription = (e) => {
        const { name, value } = e.target;
        setDescription((prev) => ({
            ...prev,
            subfunctionId: subfunctionId,
            [name]: value,
        }));
    };

    useEffect(() => {
        // Clear state when id changes or before fetching new data
        setDescription({
            id: null,
            subfunctionId: null,
            deliverable: "",
            frequency_deliverable: "",
            responsible: "",
            accountable: "",
            support: "",
            consulted: "",
            informed: "",
        });
    }, [descriptionId, subfunctionId]);

    useEffect(() => {
        if (descriptionData && subfunctionId) {
            setDescription({
                id: descriptionData.id,
                subfunctionId: subfunctionId,
                deliverable: descriptionData.deliverable,
                frequency_deliverable: descriptionData.frequency_deliverable,
                responsible: descriptionData.responsible,
                accountable: descriptionData.accountable,
                support: descriptionData.support,
                consulted: descriptionData.consulted,
                informed: descriptionData.informed,
            });
        }
    }, [descriptionData, subfunctionId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // console.log("Submitted description:", description);
            await manageDescription(description);
            setShowSuccessModal(true);
        } catch (error) {
            console.error("Error submitting description:", error);
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
    if (isError) return <Error message="Failed to load Edit Functions." />;

    return (
        <div className=" mx-auto p-6 bg-white rounded-lg shadow mt-8">
            <div className="w-full sm:w-auto mb-5">
                {descriptionId ? (
                    <Title title="Edit Description" />
                ) : (
                    <Title title="Add Description" />
                )}
            </div>
            
            {/* Required Fields Note */}
            <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-blue-700">
                            <span className="font-medium">Note:</span> Fields marked with an asterisk (*) are required and must be filled out for successful submission.
                        </p>
                    </div>
                </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Deliverable <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="deliverable"
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                        required
                        value={description?.deliverable || ""}
                        onChange={(e) => changeDescription(e)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Frequency of Deliverables <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="frequency_deliverable"
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                        required
                        value={description?.frequency_deliverable || ""}
                        onChange={(e) => changeDescription(e)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Responsible <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="responsible"
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                        required
                        value={description?.responsible || ""}
                        onChange={(e) => changeDescription(e)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Accountable <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="accountable"
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                        required
                        value={description?.accountable || ""}
                        onChange={(e) => changeDescription(e)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Support
                    </label>
                    <input
                        type="text"
                        name="support"
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                        value={description?.support || ""}
                        onChange={(e) => changeDescription(e)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Consulted
                    </label>
                    <input
                        type="text"
                        name="consulted"
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                        value={description?.consulted || ""}
                        onChange={(e) => changeDescription(e)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Informed
                    </label>
                    <input
                        type="text"
                        name="informed"
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                        value={description?.informed || ""}
                        onChange={(e) => changeDescription(e)}
                    />
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
                        {isSubmitting ? "Submitting..." : "Submit"}
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
                                {descriptionId
                                    ? "Description has been updated successfully."
                                    : "Description has been created successfully."}
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
