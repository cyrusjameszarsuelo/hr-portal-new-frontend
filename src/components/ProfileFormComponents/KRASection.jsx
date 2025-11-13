import React, { useMemo } from "react";
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/16/solid";
import { CheckIcon } from "@heroicons/react/20/solid";

export default function KRASection({ kras, subfunctions, dispatch, setOpenConfirm }) {
    // Get all used KRA IDs to filter them out from dropdowns
    const usedKraIds = useMemo(() => {
        return kras.map(kra => kra.kraId).filter(id => id !== null);
    }, [kras]);

    // Filter available KRAs for a specific index (exclude already selected ones except current)
    const getAvailableKras = (currentKra, currentIndex) => {
        if (!currentKra.subfunction?.job_profile_kras) return [];
        
        return currentKra.subfunction.job_profile_kras.filter(kraOption => {
            // Include if it's the currently selected KRA for this index
            if (kraOption.id === currentKra.kraId) return true;
            // Exclude if it's already used by another KRA
            return !usedKraIds.some((usedId, idx) => usedId === kraOption.id && idx !== currentIndex);
        });
    };

    return (
        <div className="space-y-4 mb-6">
            {kras.map((kra, kraIndex) => {
                const availableKras = getAvailableKras(kra, kraIndex);
                
                return (
                <div key={kraIndex} className="bg-white border border-gray-200 shadow-xl rounded-lg py-4 px-4">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-md font-semibold text-gray-800">KRA #{kraIndex + 1}</h3>
                        <button
                            type="button"
                            onClick={() =>
                                setOpenConfirm({
                                    open: true,
                                    title: "Remove KRA",
                                    message: "This will remove the KRA and all its details. Do you want to continue?",
                                    onConfirm: () => dispatch({ type: "REMOVE_KRA", index: kraIndex }),
                                })
                            }
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                            Remove KRA
                        </button>
                    </div>

                    {/* Subfunction */}
                    <div className="mb-4">
                        <label className="block text-sm/6 font-medium text-gray-700 mb-2">Subfunction</label>
                        <div className="relative mt-2">
                            <Listbox
                                value={kra.subfunction}
                                onChange={(val) => dispatch({ type: "UPDATE_KRA_FIELD", index: kraIndex, field: "subfunction", value: val })}
                            >
                                <ListboxButton className="grid w-full cursor-default grid-cols-1 rounded-md bg-white border border-gray-300 py-2 pr-2 pl-3 text-left text-gray-900 shadow-sm focus-visible:outline-none focus:ring focus:ring-[#ee3124] focus:border-[#ee3124] sm:text-sm/6">
                                    <span className="col-start-1 row-start-1 flex items-center gap-3 pr-6">
                                        <span className="block truncate">
                                            {kra?.subfunction?.name || "Select a subfunction"}
                                        </span>
                                    </span>
                                    <ChevronUpDownIcon aria-hidden="true" className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-400 sm:size-4" />
                                </ListboxButton>
                                <ListboxOptions className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base border border-gray-200 shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                                    {subfunctions.map((sf) => (
                                        <ListboxOption
                                            key={sf.id}
                                            value={sf}
                                            className="group relative cursor-default py-2 pr-9 pl-3 text-gray-900 select-none data-focus:bg-red-50 data-focus:outline-none"
                                        >
                                            <div className="flex items-center">
                                                <span className="ml-3 block truncate font-normal group-data-selected:font-semibold group-data-selected:text-[#ee3124]">
                                                    {sf.name}
                                                </span>
                                            </div>
                                            <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-[#ee3124] group-not-data-selected:hidden group-data-focus:text-[#ee3124]">
                                                <CheckIcon aria-hidden="true" className="size-5" />
                                            </span>
                                        </ListboxOption>
                                    ))}
                                </ListboxOptions>
                            </Listbox>
                        </div>
                    </div>

                    {/* KRA Name */}
                    <div className="mb-4">
                        <label className="block text-sm/6 font-medium text-gray-700 mb-2">KRA Name</label>
                        <div className="relative mt-2">
                            <Listbox
                                value={kra.kraId}
                                onChange={(selectedKraId) => {
                                    const selectedKra = kra.subfunction?.job_profile_kras?.find((k) => k.id === selectedKraId);
                                    dispatch({ type: "SET_KRA_FROM_SELECTION", index: kraIndex, selectedKra });
                                }}
                                disabled={!kra.subfunction}
                            >
                                <ListboxButton
                                    className={`grid w-full cursor-default grid-cols-1 rounded-md bg-white border border-gray-300 py-2 pr-2 pl-3 text-left text-gray-900 shadow-sm focus-visible:outline-none focus:ring focus:ring-[#ee3124] focus:border-[#ee3124] sm:text-sm/6 ${
                                        !kra.subfunction ? "opacity-50 cursor-not-allowed" : ""
                                    }`}
                                >
                                    <span className="col-start-1 row-start-1 flex items-center gap-3 pr-6">
                                        <span className="block truncate">
                                            {kra.kra || (kra.subfunction ? "Select a KRA" : "Select a subfunction first")}
                                        </span>
                                    </span>
                                    <ChevronUpDownIcon aria-hidden="true" className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-400 sm:size-4" />
                                </ListboxButton>
                                <ListboxOptions className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base border border-gray-200 shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                                    {availableKras.length > 0 ? (
                                        availableKras.map((kraOption) => (
                                            <ListboxOption
                                                key={kraOption.id}
                                                value={kraOption.id}
                                                className="group relative cursor-default py-2 pr-9 pl-3 text-gray-900 select-none data-focus:bg-red-50 data-focus:outline-none"
                                            >
                                                <div className="flex items-center">
                                                    <span className="ml-3 block truncate font-normal group-data-selected:font-semibold group-data-selected:text-[#ee3124]">
                                                        {kraOption.kra}
                                                    </span>
                                                </div>
                                                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-[#ee3124] group-not-data-selected:hidden group-data-focus:text-[#ee3124]">
                                                    <CheckIcon aria-hidden="true" className="size-5" />
                                                </span>
                                            </ListboxOption>
                                        ))
                                    ) : (
                                        <div className="py-2 px-3 text-sm text-gray-500">No KRAs available for this subfunction</div>
                                    )}
                                </ListboxOptions>
                            </Listbox>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-4">
                        <label className="block text-sm/6 font-medium text-gray-700 mb-2">KRA Description</label>
                        <textarea
                            className="block w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:ring-[#ee3124] focus:border-[#ee3124] px-3 py-2 shadow-sm sm:text-sm h-40 sm:h-20"
                            value={kra.description}
                            onChange={(e) => dispatch({ type: "UPDATE_KRA_FIELD", index: kraIndex, field: "description", value: e.target.value })}
                            placeholder="Describe the key result area..."
                        />
                    </div>

                    {/* Details */}
                    <div className="mt-4 border-t border-gray-200 pt-4">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-semibold text-gray-700">KRA Details</h4>
                            <button
                                type="button"
                                onClick={() => dispatch({ type: "ADD_PROFILE_KRA", kraIndex })}
                                className="px-2.5 py-1 bg-gray-600 hover:bg-gray-700 text-white text-xs font-medium rounded-md transition"
                            >
                                + KRA Details
                            </button>
                        </div>
                        {kra.profile_kra.length === 0 ? (
                            <div className="bg-gray-50 border border-dashed border-gray-300 rounded-md py-4 px-3 text-center">
                                <p className="text-gray-400 text-xs">No KRA descriptions added yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {kra.profile_kra.map((profileKra, profileIndex) => (
                                    <div key={profileIndex} className="bg-gray-50 border border-gray-200 rounded-md p-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-medium text-gray-600">Detail #{profileIndex + 1}</span>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setOpenConfirm({
                                                        open: true,
                                                        title: "Remove KRA Detail",
                                                        message: "This will remove this KRA detail. Do you want to continue?",
                                                        onConfirm: () =>
                                                            dispatch({
                                                                type: "REMOVE_PROFILE_KRA",
                                                                kraIndex,
                                                                profileIndex,
                                                            }),
                                                    })
                                                }
                                                className="text-red-500 hover:text-red-700 text-xs font-medium"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                        <div className="mb-2">
                                            <label className="block text-xs font-medium text-gray-600 mb-1">Duties & Responsibilities</label>
                                            <textarea
                                                className="block w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:ring-[#ee3124] focus:border-[#ee3124] px-2 py-1.5 shadow-sm text-xs h-40 sm:h-20"
                                                value={profileKra.kra_description}
                                                onChange={(e) =>
                                                    dispatch({
                                                        type: "UPDATE_PROFILE_KRA_FIELD",
                                                        kraIndex,
                                                        profileIndex,
                                                        field: "kra_description",
                                                        value: e.target.value,
                                                    })
                                                }
                                                placeholder="Provide a detailed description of a specific duty / responsibility under this KRA. (e.g., Gathers and analyzes relevant data to understand current business situation and industry factors.)"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">Deliverables</label>
                                            <textarea
                                                className="block w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:ring-[#ee3124] focus:border-[#ee3124] px-2 py-1.5 shadow-sm text-xs h-40 sm:h-20"
                                                value={profileKra.description}
                                                onChange={(e) =>
                                                    dispatch({
                                                        type: "UPDATE_PROFILE_KRA_FIELD",
                                                        kraIndex,
                                                        profileIndex,
                                                        field: "description",
                                                        value: e.target.value,
                                                    })
                                                }
                                                placeholder="Provide the corresponding output expected from this duty / responsibility, as applicable. (e.g., Business Report.)"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            );
            })}
        </div>
    );
}
