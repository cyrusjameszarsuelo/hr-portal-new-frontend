import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import {
    getDescriptionById,
    manageDescription,
} from "../utils/functional_structure";
import { useEffect, useState } from "react";

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
    const navigate = useNavigate();
    const { subfunctionId, descriptionId } = useParams();

    const { data: descriptionData } = useQuery({
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

    const handleSubmit = (e) => {
        e.preventDefault();
        // console.log("Submitted description:", description);
        manageDescription(description);
        goBack();
    };
    return (
        <div className=" mx-auto p-6 bg-white rounded-lg shadow mt-8">
            <h2 className="text-2xl font-bold mb-6">Description Details</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Deliverable
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
                        Frequency of Deliverables
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
                        Responsible
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
                        Accountable
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
                        required
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
                        required
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
                        required
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
                        className="w-full sm:w-auto py-2 px-4 bg-black text-white font-semibold rounded hover:bg-gray-800"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
}
