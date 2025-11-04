import React, { useMemo, useState, useEffect } from "react";
import Tabs from "../../../components/Tabs";
import { capitalizeFirstLetter } from "../../../helper/capitalizedFirstLetter";

// Re-usable line title with red accent, to match JobProfile visuals
function SectionTitle({ children }) {
    return (
        <h2 className="text-lg font-semibold text-[#ee3124] flex items-center gap-2">
            <span className="inline-block w-1 h-6 bg-red-600 rounded-full" />
            {children}
        </h2>
    );
}

export default function AboutProfile({ about }) {
    // Accept either the direct about object or { about: {...} }
    const data = about?.about || about || {};

    // Helpers
    const safe = (v, fallback = "N/A") =>
        v !== undefined && v !== null && v !== "" ? v : fallback;

    const age = useMemo(() => {
        const b = data?.birthdate;
        if (!b) return "N/A";
        const d = new Date(b);
        if (isNaN(d)) return "N/A";
        const diff = Date.now() - d.getTime();
        const ageDt = new Date(diff);
        return Math.abs(ageDt.getUTCFullYear() - 1970);
    }, [data?.birthdate]);

    // Interests can be string[], or [{interest}] depending on API
    const interests = useMemo(() => {
        const raw = data?.interests || [];
        if (!Array.isArray(raw)) return [];
        return raw
            .map((i) => (typeof i === "string" ? i : i?.interest))
            .filter(Boolean);
    }, [data?.interests]);

    const functions = useMemo(() => {
        const raw = data?.functions || [];
        if (!Array.isArray(raw)) return [];
        return raw
            .map((i) => (typeof i === "string" ? i : i?.name))
            .filter(Boolean);
    }, [data?.functions]);

    const educList = useMemo(() => {
        const list = Array.isArray(data?.educ_prof_backgrounds)
            ? data.educ_prof_backgrounds
            : [];
        return list.map((e) => ({
            id: e?.id,
            education_level: e?.education_level ?? "",
            school: e?.school ?? "",
            course: e?.course ?? "",
            start_date: e?.start_date ?? "",
            end_date: e?.end_date ?? "",
            honors: e?.honors ?? "",
            licenses: Array.isArray(e?.lic_and_certs)
                ? e.lic_and_certs.map((l) => l?.lic_and_cert).filter(Boolean)
                : [],
        }));
    }, [data?.educ_prof_backgrounds]);

    const megawide = useMemo(() => {
        const list = Array.isArray(data?.megawide_work_experiences)
            ? data.megawide_work_experiences
            : [];
        return list[0] || {};
    }, [data?.megawide_work_experiences]);

    const previous = useMemo(() => {
        const list = Array.isArray(data?.prev_work_exp)
            ? data.prev_work_exp
            : [];
        return list[0] || {};
    }, [data?.prev_work_exp]);

    const techSkills = Array.isArray(data?.technical_proficiencies)
        ? data.technical_proficiencies
        : [];
    const languages = Array.isArray(data?.language_proficiencies)
        ? data.language_proficiencies
        : [];

    // Only the Educational & Professional Background section should be tabbed.
    const educTabs = useMemo(() => {
        return educList.map((e, idx) => ({
            id: String(e.id ?? idx),
            label: capitalizeFirstLetter(e.education_level),
            content: (
                <div className="text-sm space-y-2">
                    <div>
                        <span className="font-semibold">Education Level:</span>{" "}
                        {safe(e.education_level)}
                    </div>
                    <div>
                        <span className="font-semibold">School:</span>{" "}
                        {safe(e.school)}
                    </div>
                    <div>
                        <span className="font-semibold">Course:</span>{" "}
                        {safe(e.course)}
                    </div>
                    <div>
                        <span className="font-semibold">Start Date:</span>{" "}
                        {safe(e.start_date)}
                    </div>
                    <div>
                        <span className="font-semibold">End Date:</span>{" "}
                        {safe(e.end_date)}
                    </div>
                    <div>
                        <span className="font-semibold">Honors:</span>{" "}
                        {safe(e.honors)}
                    </div>
                    <div>
                        <span className="font-semibold">
                            Licenses and Certifications:
                        </span>
                        {e.licenses.length > 0 ? (
                            <div className="mt-1 space-y-1">
                                {e.licenses.map((lic, lidx) => (
                                    <div
                                        key={lidx}
                                        className="flex items-start gap-2"
                                    >
                                        <span className="inline-block w-1.5 h-1.5 bg-gray-800 rounded-full mt-2 ml-2" />
                                        <div>{lic}</div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <span className="text-gray-500 ml-1"> N/A</span>
                        )}
                    </div>
                </div>
            ),
        }));
    }, [educList]);

    const [activeEduc, setActiveEduc] = useState(educTabs[0]?.id);
    useEffect(() => {
        if (!educTabs.find((t) => t.id === activeEduc)) {
            setActiveEduc(educTabs[0]?.id);
        }
    }, [educTabs, activeEduc]);

    return (
        <div className="space-y-6">
            {/* Top 2-column grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* About Me */}
                <div className="bg-white border border-gray-200 shadow-xl rounded-lg p-4">
                    <SectionTitle>About Me:</SectionTitle>
                    <div className="mt-3 text-sm">
                        <div className="mb-2">
                            <span className="font-semibold">Name:</span>{" "}
                            {safe(data?.org_structure_id?.name)}
                        </div>
                        <div className="mb-2">
                            <span className="font-semibold">Birthday:</span>{" "}
                            {safe(data?.birthdate)}
                        </div>
                        <div className="mb-2">
                            <span className="font-semibold">
                                Marital Status:
                            </span>{" "}
                            {safe(data?.marital_status)}
                        </div>
                        <div className="mb-2">
                            <span className="font-semibold">Age:</span>{" "}
                            {safe(age)}
                        </div>
                        <div className="mb-2">
                            <span className="font-semibold">Interests:</span>{" "}
                            {interests.length ? interests.join(", ") : "N/A"}
                        </div>
                    </div>
                </div>

                {/* Educational and Professional Background (tabbed) */}
                <div className="bg-white border border-gray-200 shadow-xl rounded-lg p-4">
                    <SectionTitle>
                        Educational and Professional Background:
                    </SectionTitle>
                    <div className="mt-3">
                        {educTabs.length === 0 ? (
                            <div className="text-sm text-gray-500">N/A</div>
                        ) : (
                            <Tabs
                                tabs={educTabs}
                                active={activeEduc}
                                onChange={setActiveEduc}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Middle 2-column grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* My Megawide Work Experience */}
                <div className="bg-white border border-gray-200 shadow-xl rounded-lg p-4">
                    <SectionTitle>My Megawide Work Experience</SectionTitle>
                    <div className="mt-3 text-sm">
                        <div className="mb-2">
                            <span className="font-semibold">Position:</span>{" "}
                            {safe(megawide?.position)}
                        </div>
                        <div className="mb-2">
                            <span className="font-semibold">Department:</span>{" "}
                            {safe(megawide?.department)}
                        </div>
                        <div className="mb-2">
                            <span className="font-semibold">Rank:</span>{" "}
                            {safe(megawide?.rank)}
                        </div>
                        <div className="mb-2">
                            <span className="font-semibold">Start Date:</span>{" "}
                            {safe(megawide?.start_date)}
                        </div>
                        <div className="mt-3">
                            <span className="font-semibold">
                                My Job Functions:
                            </span>
                        </div>
                        <div className="mt-2 space-y-2">
                            {functions.length > 0 ? (
                                functions.map((f, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-start gap-2"
                                    >
                                        <span className="inline-block w-1.5 h-1.5 bg-gray-800 rounded-full mt-2 ml-2" />
                                        <div>{f}</div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-gray-500">N/A</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* My Previous Work Experience */}
                <div className="bg-white border border-gray-200 shadow-xl rounded-lg p-4">
                    <SectionTitle>My Previous Work Experience:</SectionTitle>
                    <div className="mt-3 text-sm">
                        <div className="mb-2">
                            <span className="font-semibold">Position:</span>{" "}
                            {safe(previous?.position)}
                        </div>
                        <div className="mb-2">
                            <span className="font-semibold">
                                Megawide Position Equivalent:
                            </span>{" "}
                            {safe(previous?.megawide_position_equivalent)}
                        </div>
                        <div className="mb-2">
                            <span className="font-semibold">Department:</span>{" "}
                            {safe(previous?.department)}
                        </div>
                        <div className="mb-2">
                            <span className="font-semibold">Company:</span>{" "}
                            {safe(previous?.company)}
                        </div>
                        <div className="mb-2">
                            <span className="font-semibold">Rank:</span>{" "}
                            {safe(previous?.rank)}
                        </div>
                        <div className="mb-2">
                            <span className="font-semibold">
                                Functions / Job Description:
                            </span>{" "}
                            {safe(previous?.functions_jd)}
                        </div>
                        <div className="mb-2">
                            <span className="font-semibold">Start Date:</span>{" "}
                            {safe(previous?.start_date)}
                        </div>
                        <div className="mb-2">
                            <span className="font-semibold">End Date:</span>{" "}
                            {safe(previous?.end_date)}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom 2-column grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Technical Proficiency */}
                <div className="bg-white border border-gray-200 shadow-xl rounded-lg p-4">
                    <SectionTitle>Technical Proficiency:</SectionTitle>
                    <div className="mt-3 text-sm space-y-1">
                        {techSkills.length > 0 ? (
                            techSkills.map((s, idx) => (
                                <div key={idx} className="mb-2">
                                    <span className="font-semibold">
                                        {s?.skills}:
                                    </span>{" "}
                                    {safe(s?.proficiency)}
                                </div>
                            ))
                        ) : (
                            <div className="text-gray-500">N/A</div>
                        )}
                    </div>
                </div>

                {/* Language Proficiency */}
                <div className="bg-white border border-gray-200 shadow-xl rounded-lg p-4">
                    <SectionTitle>Language Proficiency:</SectionTitle>
                    <div className="mt-3 text-sm">
                        {languages.length > 0 ? (
                            <div className="overflow-x-auto">
                                <div className="inline-block min-w-full align-middle">
                                    <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                                        <table className="min-w-full divide-y divide-gray-200 table-auto">
                                            <thead className="bg-[#ee3124]">
                                                <tr>
                                                    <th
                                                        scope="col"
                                                        className="px-4 py-3 text-left text-xs font-semibold text-white uppercase"
                                                    >
                                                        Language
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-4 py-3 text-left text-xs font-semibold text-white uppercase"
                                                    >
                                                        Written
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-4 py-3 text-left text-xs font-semibold text-white uppercase"
                                                    >
                                                        Spoken
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-100">
                                                {languages.map((lang, idx) => (
                                                    <tr
                                                        key={idx}
                                                        className={
                                                            idx % 2 === 0
                                                                ? "bg-white hover:bg-red-50"
                                                                : "bg-gray-100 hover:bg-red-50"
                                                        }
                                                    >
                                                        <td className="px-4 py-3 text-sm text-gray-700">
                                                            {lang?.language ||
                                                                `Language ${
                                                                    idx + 1
                                                                }`}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-700">
                                                            {safe(lang?.w_prof)}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-700">
                                                            {safe(lang?.s_prof)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-gray-500">N/A</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
