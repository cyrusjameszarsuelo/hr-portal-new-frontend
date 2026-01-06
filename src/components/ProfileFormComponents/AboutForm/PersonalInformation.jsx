import React from "react";

export default function PersonalInformation({ form, dispatch }) {
    const updateField = (key, value) =>
        dispatch({
            type: "APPLY_UPDATER",
            updater: (p) => ({ ...p, [key]: value }),
        });

    const permanentComplete = Boolean(
        form.permanent_address_street &&
            form.permanent_address_city &&
            form.permanent_address_region &&
            form.permanent_address_zip_code,
    );

    const currentComplete = Boolean(
        form.current_address_street &&
            form.current_address_city &&
            form.current_address_region &&
            form.current_address_zip_code,
    );

    const handleCopyCurrentToPermanent = () => {
        if (!currentComplete) return;
        dispatch({
            type: "APPLY_UPDATER",
            updater: (p) => ({
                ...p,
                permanent_address_street: p.current_address_street,
                permanent_address_barangay: p.current_address_barangay,
                permanent_address_city: p.current_address_city,
                permanent_address_region: p.current_address_region,
                permanent_address_zip_code: p.current_address_zip_code,
            }),
        });
    };

    return (
        <div className="bg-white border border-gray-200 shadow-xl rounded-lg p-4 mb-6">
            <h2 className="text-lg font-semibold text-[#ee3124] flex items-center gap-2">
                <span className="inline-block w-1 h-6 bg-red-600 rounded-full" />
                Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                <div>
                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                    <input
                        type="text"
                        value={form.firstname}
                        onChange={(e) => updateField("firstname", e.target.value)}
                        className="mt-2 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-3 py-2 shadow-sm sm:text-sm"
                        placeholder="e.g., Juan"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Middle Name</label>
                    <input
                        type="text"
                        value={form.middlename}
                        onChange={(e) => updateField("middlename", e.target.value)}
                        className="mt-2 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-3 py-2 shadow-sm sm:text-sm"
                        placeholder="e.g., Santos"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input
                        type="text"
                        value={form.lastname}
                        onChange={(e) => updateField("lastname", e.target.value)}
                        className="mt-2 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-3 py-2 shadow-sm sm:text-sm"
                        placeholder="e.g., Dela Cruz"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Suffix</label>
                    <input
                        type="text"
                        value={form.suffix}
                        onChange={(e) => updateField("suffix", e.target.value)}
                        className="mt-2 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-3 py-2 shadow-sm sm:text-sm"
                        placeholder="e.g., Jr., Sr., III"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Employee ID</label>
                    <input
                        type="text"
                        value={form.employee_id}
                        onChange={(e) => updateField("employee_id", e.target.value)}
                        className="mt-2 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-3 py-2 shadow-sm sm:text-sm"
                        placeholder="e.g., 00123456"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Nickname</label>
                    <input
                        type="text"
                        value={form.nickname}
                        onChange={(e) => updateField("nickname", e.target.value)}
                        className="mt-2 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-3 py-2 shadow-sm sm:text-sm"
                        placeholder="e.g., John"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Birth Date</label>
                    <input
                        type="date"
                        value={form.birthdate}
                        onChange={(e) => updateField("birthdate", e.target.value)}
                        className="mt-2 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-3 py-2 shadow-sm sm:text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Gender</label>
                    <select
                        value={form.gender}
                        onChange={(e) => updateField("gender", e.target.value)}
                        className="mt-2 w-full rounded-md bg-white border border-gray-300 text-gray-900 focus:border-[#ee3124] focus:ring-[#ee3124] px-3 py-2 shadow-sm sm:text-sm"
                    >
                        <option value="">Select gender...</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Civil Status</label>
                    <select
                        value={form.civil_status}
                        onChange={(e) => updateField("civil_status", e.target.value)}
                        className="mt-2 w-full rounded-md bg-white border border-gray-300 text-gray-900 focus:border-[#ee3124] focus:ring-[#ee3124] px-3 py-2 shadow-sm sm:text-sm"
                    >
                        <option value="">Select status...</option>
                        <option value="single">Single</option>
                        <option value="married">Married</option>
                        <option value="common-law">Common-law</option>
                        <option value="separated">Separated</option>
                        <option value="widowed">Widowed</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Number of Children</label>
                    <input
                        type="number"
                        min="0"
                        value={form.number_of_children}
                        onChange={(e) => updateField("number_of_children", e.target.value)}
                        className="mt-2 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-3 py-2 shadow-sm sm:text-sm"
                        placeholder="e.g., 2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                        type="text"
                        value={form.phone_number}
                        onChange={(e) => updateField("phone_number", e.target.value)}
                        className="mt-2 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-3 py-2 shadow-sm sm:text-sm"
                        placeholder="e.g., +63 917 123 4567"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Personal Email</label>
                    <input
                        type="email"
                        value={form.personal_email}
                        onChange={(e) => updateField("personal_email", e.target.value)}
                        className="mt-2 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-3 py-2 shadow-sm sm:text-sm"
                        placeholder="e.g., name@example.com"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Blood Type</label>
                    <select
                        value={form.blood_type}
                        onChange={(e) => updateField("blood_type", e.target.value)}
                        className="mt-2 w-full rounded-md bg-white border border-gray-300 text-gray-900 focus:border-[#ee3124] focus:ring-[#ee3124] px-3 py-2 shadow-sm sm:text-sm"
                    >
                        <option value="">Select blood type...</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="Unknown">Unknown/Not sure</option>
                    </select>
                </div>

                {/* <div>
                    <label className="block text-sm font-medium text-gray-700">Upload Photo</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => updateField("upload_photo", e.target.files?.[0]?.name || "")}
                        className="mt-2 w-full text-sm"
                    />
                </div> */}
            </div>

            {/* Emergency Contact */}
            <div className="mt-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Emergency Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Contact Name</label>
                            <input
                                type="text"
                                value={form.emergency_contact_name}
                                onChange={(e) => updateField("emergency_contact_name", e.target.value)}
                                className="mt-2 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-3 py-2 shadow-sm sm:text-sm"
                                placeholder="e.g., John Doe"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Relationship</label>
                            <select
                                value={form.relationship_to_employee}
                                onChange={(e) => updateField("relationship_to_employee", e.target.value)}
                                className="mt-2 w-full rounded-md bg-white border border-gray-300 text-gray-900 focus:border-[#ee3124] focus:ring-[#ee3124] px-3 py-2 shadow-sm sm:text-sm"
                            >
                                <option value="">Select relationship...</option>
                                <option value="spouse">Spouse</option>
                                <option value="parent">Parent</option>
                                <option value="sibling">Sibling</option>
                                <option value="child">Child</option>
                                <option value="relative">Relative</option>
                                <option value="friend">Friend</option>
                                <option value="guardian">Guardian</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                            <input
                                type="text"
                                value={form.emergency_contact_number}
                                onChange={(e) => updateField("emergency_contact_number", e.target.value)}
                                className="mt-2 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-3 py-2 shadow-sm sm:text-sm"
                                placeholder="e.g., +63 918 765 4321"
                            />
                        </div>
                </div>
            </div>

            {/* Citizenship & Birth Place */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Citizenship</label>
                    <input
                        type="text"
                        value={form.citizenship}
                        onChange={(e) => updateField("citizenship", e.target.value)}
                        className="mt-2 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-3 py-2 shadow-sm sm:text-sm"
                        placeholder="e.g., Filipino"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Birth Place</label>
                    <input
                        type="text"
                        value={form.birth_place}
                        onChange={(e) => updateField("birth_place", e.target.value)}
                        className="mt-2 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-3 py-2 shadow-sm sm:text-sm"
                        placeholder="e.g., Manila, Philippines"
                    />
                </div>
            </div>

            {/* Current Address (now displayed first) */}
            <div className="mt-8">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-gray-700">Current Address</h3>
                    <button
                        type="button"
                        onClick={handleCopyCurrentToPermanent}
                        disabled={!currentComplete}
                        className={`px-2 py-1 rounded-md text-xs font-medium transition border ${
                            currentComplete
                                ? "bg-gray-600 text-white hover:bg-gray-700"
                                : "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                        }`}
                    >
                        Copy Current
                    </button>
                </div>
                {!currentComplete && (
                    <p className="text-xs text-red-600 mb-2">Fill out the Current Address above to enable copying into Permanent Address.</p>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-gray-700">Street</label>
                        <input
                            type="text"
                            value={form.current_address_street}
                            onChange={(e) => updateField("current_address_street", e.target.value)}
                            className="mt-1 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-3 py-2 shadow-sm sm:text-sm"
                            placeholder="e.g., 123 Rizal Street, Barangay San Antonio"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-700">Barangay</label>
                        <input
                            type="text"
                            value={form.current_address_barangay}
                            onChange={(e) => updateField("current_address_barangay", e.target.value)}
                            className="mt-1 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-3 py-2 shadow-sm sm:text-sm"
                            placeholder="e.g., Barangay San Antonio"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-700">City</label>
                        <input
                            type="text"
                            value={form.current_address_city}
                            onChange={(e) => updateField("current_address_city", e.target.value)}
                            className="mt-1 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-3 py-2 shadow-sm sm:text-sm"
                            placeholder="e.g., Makati City"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-700">Region</label>
                        <input
                            type="text"
                            value={form.current_address_region}
                            onChange={(e) => updateField("current_address_region", e.target.value)}
                            className="mt-1 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-3 py-2 shadow-sm sm:text-sm"
                            placeholder="e.g., NCR"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-700">Zip Code</label>
                        <input
                            type="text"
                            value={form.current_address_zip_code}
                            onChange={(e) => updateField("current_address_zip_code", e.target.value)}
                            className="mt-1 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-3 py-2 shadow-sm sm:text-sm"
                            placeholder="e.g., 1200"
                        />
                    </div>
                </div>
                {currentComplete && (
                    <p className="text-[11px] text-green-600 mt-2">Current address complete. You can now copy it into Permanent Address.</p>
                )}
            </div>

            {/* Permanent Address (now displayed after Current) */}
            <div className="mt-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Permanent Address</h3>
                {!currentComplete && (
                    <p className="text-xs text-red-600 mb-2">Fill out the Current Address above first to enable editing or copying.</p>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-gray-700">Street</label>
                        <input
                            type="text"
                            value={form.permanent_address_street}
                            onChange={(e) => updateField("permanent_address_street", e.target.value)}
                            disabled={!currentComplete}
                            className="mt-1 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-3 py-2 shadow-sm sm:text-sm"
                            placeholder="e.g., 456 Luna Avenue, Barangay Poblacion"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-700">Barangay</label>
                        <input
                            type="text"
                            value={form.permanent_address_barangay}
                            onChange={(e) => updateField("permanent_address_barangay", e.target.value)}
                            disabled={!currentComplete}
                            className="mt-1 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-3 py-2 shadow-sm sm:text-sm"
                            placeholder="e.g., Barangay Poblacion"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-700">City</label>
                        <input
                            type="text"
                            value={form.permanent_address_city}
                            onChange={(e) => updateField("permanent_address_city", e.target.value)}
                            disabled={!currentComplete}
                            className="mt-1 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-3 py-2 shadow-sm sm:text-sm"
                            placeholder="e.g., Quezon City"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-700">Region</label>
                        <input
                            type="text"
                            value={form.permanent_address_region}
                            onChange={(e) => updateField("permanent_address_region", e.target.value)}
                            disabled={!currentComplete}
                            className="mt-1 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-3 py-2 shadow-sm sm:text-sm"
                            placeholder="e.g., NCR"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-700">Zip Code</label>
                        <input
                            type="text"
                            value={form.permanent_address_zip_code}
                            onChange={(e) => updateField("permanent_address_zip_code", e.target.value)}
                            disabled={!currentComplete}
                            className="mt-1 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-3 py-2 shadow-sm sm:text-sm"
                            placeholder="e.g., 1100"
                        />
                    </div>
                </div>
                {permanentComplete && (
                    <p className="text-[11px] text-green-600 mt-2">Permanent address complete.</p>
                )}
            </div>
        </div>
    );
}
