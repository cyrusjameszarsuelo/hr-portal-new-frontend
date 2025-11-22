import React from "react";

function SectionTitle({ children }) {
    return (
        <h2 className="text-lg font-semibold text-[#ee3124] flex items-center gap-2">
            <span className="inline-block w-1 h-6 bg-red-600 rounded-full" />
            {children}
        </h2>
    );
}

export default function LicensesCertifications({ form, addRow, updateRow, confirmRemoveRow }) {
    return (
        <div className="bg-white border border-gray-200 shadow-xl rounded-lg p-4 mb-6">
            <SectionTitle>Licenses & Certifications</SectionTitle>
            <div className="mt-3">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Add your licenses and certifications</span>
                    <button
                        type="button"
                        onClick={() =>
                            addRow("licenses_certifications", {
                                license_certification_name: "",
                                issuing_organization: "",
                                license_certification_number: "",
                                date_issued: "",
                                date_of_expiration: "",
                                non_expiring: false,
                            })
                        }
                        className="px-2.5 py-1 bg-gray-600 hover:bg-gray-700 text-white text-xs font-medium rounded-md"
                    >
                        + Add License/Cert
                    </button>
                </div>

                {form.licenses_certifications?.length ? (
                    <div className="space-y-4">
                        {form.licenses_certifications.map((lic, lIdx) => (
                            <div key={lIdx} className="border border-gray-200 rounded-md p-3">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700">
                                            License/Certification Name
                                        </label>
                                        <input
                                            type="text"
                                            value={lic.license_certification_name}
                                            onChange={(ev) =>
                                                updateRow(
                                                    "licenses_certifications",
                                                    lIdx,
                                                    "license_certification_name",
                                                    ev.target.value,
                                                )
                                            }
                                            className="mt-1 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1.5 shadow-sm text-xs"
                                            placeholder="e.g., PMP"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700">
                                            Issuing Organization
                                        </label>
                                        <input
                                            type="text"
                                            value={lic.issuing_organization}
                                            onChange={(ev) =>
                                                updateRow(
                                                    "licenses_certifications",
                                                    lIdx,
                                                    "issuing_organization",
                                                    ev.target.value,
                                                )
                                            }
                                            className="mt-1 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1.5 shadow-sm text-xs"
                                            placeholder="e.g., Project Management Institute"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700">
                                            License/Certification Number
                                        </label>
                                        <input
                                            type="text"
                                            value={lic.license_certification_number}
                                            onChange={(ev) =>
                                                updateRow(
                                                    "licenses_certifications",
                                                    lIdx,
                                                    "license_certification_number",
                                                    ev.target.value,
                                                )
                                            }
                                            className="mt-1 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1.5 shadow-sm text-xs"
                                            placeholder="e.g., PMP-123456"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700">
                                            Date Issued
                                        </label>
                                        <input
                                            type="date"
                                            value={lic.date_issued}
                                            onChange={(ev) =>
                                                updateRow(
                                                    "licenses_certifications",
                                                    lIdx,
                                                    "date_issued",
                                                    ev.target.value,
                                                )
                                            }
                                            className="mt-1 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1.5 shadow-sm text-xs"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700">
                                            Date of Expiration
                                        </label>
                                        <input
                                            type="date"
                                            value={lic.date_of_expiration}
                                            onChange={(ev) =>
                                                updateRow(
                                                    "licenses_certifications",
                                                    lIdx,
                                                    "date_of_expiration",
                                                    ev.target.value,
                                                )
                                            }
                                            className="mt-1 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1.5 shadow-sm text-xs"
                                            disabled={!!lic.non_expiring}
                                        />
                                    </div>
                                    <div className="flex items-center">
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={!!lic.non_expiring}
                                                onChange={(ev) =>
                                                    updateRow(
                                                        "licenses_certifications",
                                                        lIdx,
                                                        "non_expiring",
                                                        ev.target.checked,
                                                    )
                                                }
                                                className="h-4 w-4 rounded border-gray-300 text-[#ee3124] focus:ring-[#ee3124]"
                                            />
                                            <span className="text-xs font-medium text-gray-700">
                                                Non-Expiring
                                            </span>
                                        </label>
                                    </div>
                                </div>

                                <div className="mt-3 text-right">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            confirmRemoveRow(
                                                "licenses_certifications",
                                                lIdx,
                                                "License/Certification",
                                            )
                                        }
                                        className="text-red-600 hover:text-red-800 text-xs font-medium"
                                    >
                                        Remove License/Cert
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-gray-500 text-sm">No licenses or certifications yet.</div>
                )}
            </div>
        </div>
    );
}
