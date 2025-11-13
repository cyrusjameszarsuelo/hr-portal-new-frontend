import React, { useMemo, useState, lazy, Suspense } from "react";
import Title from "../../../components/Title";
import { ArrowLeftCircleIcon } from "@heroicons/react/24/outline";
import { useNavigate, useParams } from "react-router";
const JobProfileForm = lazy(() => import("./JobProfileForm"));
const AboutUsForm = lazy(() => import("./AboutForm"));
const PerformanceManagementForm = lazy(() => import("./PerformanceManagementForm"));

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
        <div className="mx-auto p-4 md:p-6 bg-gray-50 border border-gray-200 rounded-lg shadow">
            <div className="w-full sm:w-auto mb-5 flex items-center justify-between">
                <Title title="Edit Profile" />
                <button
                    className=" p-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeftCircleIcon className="w-5 h-5 hover:text-red-400 inline-block text-red-600 cursor-pointer" />
                </button>
            </div>

            {/* Stepper Header */}
            <div className="w-full mb-6 overflow-x-auto">
                <ol className="flex items-center w-max sm:w-full flex-nowrap gap-2 px-1">
                    {stepDefs.map((s, idx) => {
                        const active = idx === step;
                        const complete = savedStepIds[s.id];
                        return (
                            <li key={s.id} className="flex-none sm:flex-1">
                                <button
                                    type="button"
                                    onClick={() => setStep(idx)}
                                    className={
                                        "whitespace-nowrap w-auto sm:w-full flex items-center gap-2 md:gap-3 px-2 py-2 transition " +
                                        (active
                                            ? "text-[#ee3124]"
                                            : "text-gray-500 hover:text-[#ee3124]")
                                    }
                                >
                                    <span
                                        className={
                                            "flex h-6 w-6 md:h-7 md:w-7 items-center justify-center rounded-full text-[10px] md:text-xs font-semibold border-2 " +
                                            (complete
                                                ? "bg-[#ee3124] border-[#ee3124] text-white"
                                                : active
                                                ? "border-[#ee3124] text-[#ee3124]"
                                                : "border-gray-300 text-gray-500")
                                        }
                                    >
                                        {idx + 1}
                                    </span>
                                    <span className="text-xs sm:text-sm font-medium truncate max-w-[60px] sm:max-w-none">
                                        {s.label}
                                    </span>
                                </button>
                            </li>
                        );
                    })}
                </ol>
                <div className="mt-2 h-1 w-full bg-gray-200 rounded">
                    <div
                        className="h-1 bg-[#ee3124] rounded transition-all"
                        style={{
                            width: `${((step + 1) / stepDefs.length) * 100}%`,
                        }}
                    />
                </div>
            </div>

            {/* Step Content */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow">
                <Suspense fallback={<div className="py-10 text-center text-gray-500">Loading form...</div>}>
                {currentStepId === "about" && (
                    <AboutUsForm
                        profileId={profileId}
                        onSaved={() =>
                            setSavedStepIds((prev) => ({
                                ...prev,
                                about: true,
                            }))
                        }
                        onPrev={() => setStep((s) => Math.max(0, s - 1))}
                        onNext={() =>
                            setStep((s) => Math.min(stepDefs.length - 1, s + 1))
                        }
                        prevDisabled={isFirst}
                        nextDisabled={false}
                    />
                )}

                {currentStepId === "job" && (
                    <JobProfileForm
                        profileId={profileId}
                        onSaved={() =>
                            setSavedStepIds((prev) => ({ ...prev, job: true }))
                        }
                        onPrev={() => setStep((s) => Math.max(0, s - 1))}
                        onNext={() =>
                            setStep((s) => Math.min(stepDefs.length - 1, s + 1))
                        }
                        prevDisabled={false}
                        nextDisabled={false}
                    />
                )}

                {currentStepId === "dev" && (
                    <div className="grid grid-cols-1 gap-4">
                        {/* <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Goals
                            </label>
                            <textarea
                                value={form.dev.goals}
                                onChange={(e) =>
                                    updateField("dev", "goals", e.target.value)
                                }
                                rows={3}
                                className="mt-1 w-full rounded-md border-gray-300 focus:border-[#ee3124] focus:ring-[#ee3124]"
                                placeholder="Short-term and long-term goals"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Training Needs
                            </label>
                            <textarea
                                value={form.dev.trainingNeeds}
                                onChange={(e) =>
                                    updateField(
                                        "dev",
                                        "trainingNeeds",
                                        e.target.value,
                                    )
                                }
                                rows={3}
                                className="mt-1 w-full rounded-md border-gray-300 focus:border-[#ee3124] focus:ring-[#ee3124]"
                                placeholder="Courses, certifications, workshops"
                            />
                        </div> */}
                    </div>
                )}

                {currentStepId === "perf" && (
                    <PerformanceManagementForm
                        profileId={profileId}
                        onSaved={() =>
                            setSavedStepIds((prev) => ({ ...prev, job: true }))
                        }
                        onPrev={() => setStep((s) => Math.max(0, s - 1))}
                        onNext={() =>
                            setStep((s) => Math.min(stepDefs.length - 1, s + 1))
                        }
                        prevDisabled={false}
                        nextDisabled={isLast}
                    />
                )}
                {/* Navigation buttons are handled inside each form via FormActionBar */}
                </Suspense>
            </div>
        </div>
    );
}
