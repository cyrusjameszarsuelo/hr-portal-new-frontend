import { InfoField, InfoGrid } from "@/components/ProfileComponents/InfoField";
import { formatDate } from "@/helper/dateFormat";

const safe = (v, fallback = "N/A") =>
    v !== undefined && v !== null && v !== "" ? v : fallback;

export function PersonalInfoSection({ data, age }) {
    return (
        <>
            <InfoGrid>
                <InfoField label="Employee ID" value={safe(data?.employee_id)} />
                <InfoField label="Nickname" value={safe(data?.nickname)} />
                <InfoField label="Birth Date" value={safe(data?.birthdate)} />
                <InfoField label="Age" value={safe(age)} />
                <InfoField label="Gender" value={safe(data?.gender)} />
                <InfoField label="Civil Status" value={safe(data?.civil_status)} />
                <InfoField label="Phone Number" value={safe(data?.phone_number)} />
                <InfoField label="Blood Type" value={safe(data?.blood_type)} />
                <InfoField label="Citizenship" value={safe(data?.citizenship)} />
                <div className="md:col-span-2">
                    <InfoField label="Birth Place" value={safe(data?.birth_place)} />
                </div>
            </InfoGrid>

            <div className="mt-4 pt-4 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Emergency Contact
                </h3>
                <InfoGrid>
                    <InfoField
                        label="Contact Name"
                        value={safe(data?.emergency_contact_name)}
                    />
                    <InfoField
                        label="Relationship"
                        value={safe(data?.relationship_to_employee)}
                    />
                    <InfoField
                        label="Contact Number"
                        value={safe(data?.emergency_contact_number)}
                    />
                </InfoGrid>
            </div>
        </>
    );
}

export function AddressSection({ data, type = "current" }) {
    const prefix = type === "current" ? "current_address" : "permanent_address";
    return (
        <div className="text-sm space-y-2">
            <InfoField label="Street" value={safe(data?.[`${prefix}_street`])} />
            <InfoField label="City" value={safe(data?.[`${prefix}_city`])} />
            <InfoField label="Region" value={safe(data?.[`${prefix}_region`])} />
            <InfoField label="Zip Code" value={safe(data?.[`${prefix}_zip_code`])} />
        </div>
    );
}

export function EducationItem({ edu }) {
    const period =
        edu?.year_started && edu?.year_ended
            ? `${edu.year_started} - ${edu.year_ended}`
            : edu?.year_started && edu?.is_current
            ? `${edu.year_started} - Present`
            : edu?.year_started
            ? safe(edu.year_started)
            : "N/A";

    return (
        <div className="border border-gray-200 rounded-md p-4 text-sm">
            <InfoGrid cols={2}>
                <InfoField label="Education Level" value={safe(edu?.education_level)} />
                <InfoField label="School Attended" value={safe(edu?.school_attended)} />
                <InfoField
                    label="Degree/Program/Course"
                    value={safe(edu?.degree_program_course)}
                />
                <InfoField
                    label="Academic Achievements"
                    value={safe(edu?.academic_achievements)}
                />
                <InfoField label="Period" value={period} />
            </InfoGrid>
        </div>
    );
}

export function LicenseItem({ lic }) {
    return (
        <div className="border border-gray-200 rounded-md p-4 text-sm">
            <InfoGrid cols={2}>
                <InfoField label="Name" value={safe(lic?.license_certification_name)} />
                <InfoField
                    label="Issuing Organization"
                    value={safe(lic?.issuing_organization)}
                />
                <InfoField
                    label="Number"
                    value={safe(lic?.license_certification_number)}
                />
                <InfoField
                    label="Date Issued"
                    value={formatDate(safe(lic?.date_issued), true)}
                />
                <InfoField
                    label="Date of Expiration"
                    value={
                        lic?.non_expiring
                            ? "Non-Expiring"
                            : formatDate(safe(lic?.date_of_expiration), true)
                    }
                />
            </InfoGrid>
        </div>
    );
}

export function MegawideWorkSection({ megawide, functions }) {
    return (
        <div className="text-sm">
            <InfoGrid cols={2}>
                <InfoField label="Job Title" value={safe(megawide?.job_title)} />
                <InfoField label="Department" value={safe(megawide?.department)} />
                <InfoField label="Unit" value={safe(megawide?.unit)} />
                <InfoField label="Job Level" value={safe(megawide?.job_level)} />
                <InfoField
                    label="Employment Status"
                    value={safe(megawide?.employment_status)}
                />
                <InfoField
                    label="Start Date"
                    value={formatDate(safe(megawide?.current_role_start_date), true)}
                />
                <InfoField
                    label="End Date"
                    value={
                        megawide?.is_current
                            ? "Currently Working"
                            : formatDate(safe(megawide?.current_role_end_date), true)
                    }
                />
            </InfoGrid>

            {/* <div className="mt-4 pt-4 border-t border-gray-200">
                <h3 className="font-semibold mb-2">Subfunction Positions:</h3>
                {functions.length > 0 ? (
                    <div className="space-y-1">
                        {functions.map((f, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                                <span className="inline-block w-1.5 h-1.5 bg-gray-800 rounded-full mt-2" />
                                <div>{f}</div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-gray-500">N/A</div>
                )}
            </div> */}
        </div>
    );
}

export function PreviousAssignmentItem({ assign }) {
    return (
        <div className="border border-gray-200 rounded-md p-3">
            <InfoGrid cols={2}>
                <InfoField label="SBU" value={safe(assign?.sbu)} />
                <InfoField
                    label="Previous Department"
                    value={safe(assign?.previous_department)}
                />
                <InfoField
                    label="Previous Job Title"
                    value={safe(assign?.previous_job_title)}
                />
                <InfoField
                    label="Start Date"
                    value={formatDate(safe(assign?.previous_role_start_date), true)}
                />
                <InfoField
                    label="End Date"
                    value={formatDate(safe(assign?.end_of_assignment), true)}
                />
            </InfoGrid>
        </div>
    );
}

export function PreviousWorkItem({ work }) {
    return (
        <div className="border border-gray-200 rounded-md p-4 text-sm">
            <InfoGrid cols={2}>
                <InfoField label="Company" value={safe(work?.company)} />
                <InfoField label="Job Title" value={safe(work?.job_title)} />
                <InfoField label="Job Level" value={safe(work?.job_level)} />
                <InfoField label="Start Date" value={safe(work?.start_date)} />
                <InfoField label="End Date" value={safe(work?.end_date)} />
            </InfoGrid>
        </div>
    );
}

export function TechnicalSkillItem({ skill }) {
    return (
        <div className="border border-gray-200 rounded-md p-3 text-sm">
            <InfoField label="Skills" value={safe(skill?.skills)} />
            <div className="mt-2">
                <InfoField label="Proficiency" value={safe(skill?.proficiency)} />
            </div>
        </div>
    );
}

export function LanguageItem({ lang }) {
    return (
        <div className="border border-gray-200 rounded-md p-3 text-sm">
            <div className="font-semibold mb-2">{safe(lang?.language)}</div>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <span className="font-semibold">Written:</span>
                        <div className="mt-1">{lang?.w_prof ? safe(lang?.w_prof) : "N/A"}</div>
                    </div>
                    <div>
                        <span className="font-semibold">Spoken:</span>
                        <div className="mt-1">{lang?.s_prof ? safe(lang?.s_prof) : "N/A"}</div>
                    </div>
                </div>
        </div>
    );
}
