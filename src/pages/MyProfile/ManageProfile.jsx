import React, { useMemo, useState } from "react";
import Title from "../../components/Title";
import { ArrowLeftCircleIcon } from "@heroicons/react/24/outline";
import { useNavigate, useParams } from "react-router";
import JobProfileForm from "./JobProfileForm";

export default function ManageProfile() {
    const navigate = useNavigate();
    const { profileId } = useParams();

    const stepDefs = useMemo(
        () => [
            { id: "about", label: "About" },
            { id: "job", label: "Job Profile" },
            { id: "dev", label: "Development Plan" },
            { id: "perf", label: "Performance Management" },
        ],
        [],
    );

    const [step, setStep] = useState(0);
    const [savedStepIds, setSavedStepIds] = useState({});

    const currentStepId = stepDefs[step].id;
    const isFirst = step === 0;
    const isLast = step === stepDefs.length - 1;

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center gap-3 mb-4">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="flex items-center text-gray-600 hover:text-gray-800"
                >
                    <ArrowLeftCircleIcon className="h-6 w-6 mr-1" />
                    Back
                </button>
                <Title title="Manage Profile" />
            </div>

            {/* Stepper */}
            <div className="mb-6 flex flex-wrap gap-2">
                {stepDefs.map((s, idx) => (
                    <button
                        key={s.id}
                        type="button"
                        onClick={() => setStep(idx)}
                        className={`px-3 py-1.5 rounded-md text-sm ${idx === step ? "bg-[#ee3124] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                    >
                        {s.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div>
                {currentStepId === "job" && (
                    <JobProfileForm
                        profileId={profileId}
                        onSaved={() =>
                            setSavedStepIds((prev) => ({ ...prev, job: true }))
                        }
                    />
                )}

                {currentStepId === "about" && (
                    <div className="p-4 bg-white border rounded-md text-gray-500">
                        About section (to be implemented)
                    </div>
                )}

                {currentStepId === "dev" && (
                    <div className="p-4 bg-white border rounded-md text-gray-500">
                        Development Plan (to be implemented)
                    </div>
                )}

                {currentStepId === "perf" && (
                    <div className="p-4 bg-white border rounded-md text-gray-500">
                        Performance Management (to be implemented)
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="grid grid-cols-2 gap-2 w-full sm:w-auto sm:flex sm:items-center">
                    <button
                        type="button"
                        onClick={() => setStep((s) => Math.max(0, s - 1))}
                        disabled={isFirst}
                        className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 w-full sm:w-auto"
                    >
                        Previous
                    </button>
                    <button
                        type="button"
                        onClick={() => setStep((s) => Math.min(stepDefs.length - 1, s + 1))}
                        disabled={isLast}
                        className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 w-full sm:w-auto"
                    >
                        Next
                    </button>
                </div>
                <div className="flex items-center gap-3">
                    {savedStepIds[currentStepId] && (
                        <span className="text-sm text-green-600">Saved</span>
                    )}
                    {currentStepId !== "job" && (
                        <button
                            type="button"
                            disabled
                            className="bg-[#ee3124] text-white font-semibold px-4 py-2 rounded-lg opacity-50 cursor-not-allowed w-full sm:w-auto"
                            title="Save is handled in the Job Profile section"
                        >
                            Save
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
