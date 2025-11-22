import React, { useMemo } from "react";
import {
    PersonalInfoSection,
    AddressSection,
    EducationItem,
    LicenseItem,
    MegawideWorkSection,
    PreviousAssignmentItem,
    PreviousWorkItem,
    TechnicalSkillItem,
    LanguageItem,
} from "@/components/ProfileComponents/AboutComponents";
import InfoCard from "@/components/ProfileComponents/InfoCard";
import { useState } from "react";
import BulletList from "@/components/BulletList";
import { ChevronDoubleDownIcon, ChevronDoubleUpIcon } from "@heroicons/react/24/outline";

export default function AboutProfile({ about }) {
    const data = about?.about || about || {};

    const age = useMemo(() => {
        const b = data?.birth_date;
        if (!b) return "N/A";
        const d = new Date(b);
        if (isNaN(d)) return "N/A";
        const diff = Date.now() - d.getTime();
        const ageDt = new Date(diff);
        return Math.abs(ageDt.getUTCFullYear() - 1970);
    }, [data?.birth_date]);

    // Parse arrays
    const interests = useMemo(() => {
        const raw = data?.interests || [];
        if (!Array.isArray(raw)) return [];
        return raw
            .map((i) => (typeof i === "string" ? i : i?.interest))
            .filter(Boolean);
    }, [data?.interests]);

    const skills = useMemo(() => {
        const raw = data?.skills || [];
        if (!Array.isArray(raw)) return [];
        return raw
            .map((s) => (typeof s === "string" ? s : s?.skill))
            .filter(Boolean);
    }, [data?.skills]);

    const educList = Array.isArray(data?.educational_backgrounds)
        ? data.educational_backgrounds
        : Array.isArray(data?.educ_prof_backgrounds)
        ? data.educ_prof_backgrounds
        : [];

    const licensesList = Array.isArray(data?.licenses_certifications)
        ? data.licenses_certifications
        : Array.isArray(data?.lic_and_certs)
        ? data.lic_and_certs
        : [];

    const megawide = data?.megawide_work_experience || {};

    const functions = useMemo(() => {
        const raw = megawide?.functions || megawide?.subfunction_positions || [];
        if (!Array.isArray(raw)) return [];
        return raw
            .map((f) => (typeof f === "string" ? f : f?.subfunction_title || f?.name))
            .filter(Boolean);
    }, [megawide?.functions, megawide?.subfunction_positions]);

    const previousAssignments = Array.isArray(megawide?.previous_assignments)
        ? megawide.previous_assignments
        : [];

    const previousWork = Array.isArray(data?.previous_work_experiences)
        ? data.previous_work_experiences
        : Array.isArray(data?.prev_work_experiences)
        ? data.prev_work_experiences
        : [];

    const techSkills = Array.isArray(data?.technical_proficiencies)
        ? data.technical_proficiencies
        : [];

    const languages = Array.isArray(data?.language_proficiencies)
        ? data.language_proficiencies
        : [];

    // Collapsible state for each InfoCard
    const [openCards, setOpenCards] = useState({
        personal: false,
        interests: false,
        skills: false,
        education: false,
        licenses: false,
        megawide: false,
        previousWork: false,
        technical: false,
        language: false,
    });

    const toggleCard = (key) => {
        setOpenCards((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="space-y-6">
            {/* Personal Information */}
            <div className="border rounded-lg shadow-sm bg-white">
                <button
                    type="button"
                    className="w-full flex justify-between items-center px-4 py-3 bg-white rounded-t-lg focus:outline-none"
                    onClick={() => toggleCard("personal")}
                >
                    <div className="flex items-center">
                        <span className="w-1 h-6 bg-[#ee3124] rounded mr-3" />
                        <span className="text-[#ee3124] font-semibold text-base">Personal Information</span>
                    </div>
                    <span className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 shadow-sm">
                        {openCards.personal ? (
                            <ChevronDoubleUpIcon className="w-4 h-4" />
                        ) : (
                            <ChevronDoubleDownIcon className="w-4 h-4" />
                        )}
                    </span>
                </button>
                {openCards.personal && (
                    <div className="px-4 py-4">
                        <PersonalInfoSection data={data} age={age} />
                        <hr className="my-4 border-gray-200" />
                        <div className="mb-4">
                            <h3 className="text-sm font-semibold mb-2">
                                Current Address
                            </h3>
                            <AddressSection data={data} type="current" />
                        </div>
                        <hr className="my-4 border-gray-200" />
                        <div>
                            <h3 className="text-sm font-semibold mb-2">
                                Permanent Address
                            </h3>
                            <AddressSection data={data} type="permanent" />
                        </div>
                    </div>
                )}
            </div>

            {/* Interests and Skills */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-lg shadow-sm bg-white">
                    <button
                        type="button"
                        className="w-full flex justify-between items-center px-4 py-3 bg-white rounded-t-lg focus:outline-none"
                        onClick={() => toggleCard("interests")}
                    >
                        <div className="flex items-center">
                            <span className="w-1 h-6 bg-[#ee3124] rounded mr-3" />
                            <span className="text-[#ee3124] font-semibold text-base">Interests</span>
                        </div>
                        <span className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 shadow-sm">
                            {openCards.interests ? (
                                <ChevronDoubleUpIcon className="w-4 h-4" />
                            ) : (
                                <ChevronDoubleDownIcon className="w-4 h-4" />
                            )}
                        </span>
                    </button>
                    {openCards.interests && (
                        <div className="px-4 py-4">
                            <BulletList items={interests} />
                        </div>
                    )}
                </div>
                <div className="border rounded-lg shadow-sm bg-white">
                    <button
                        type="button"
                        className="w-full flex justify-between items-center px-4 py-3 bg-white rounded-t-lg focus:outline-none"
                        onClick={() => toggleCard("skills")}
                    >
                        <div className="flex items-center">
                            <span className="w-1 h-6 bg-[#ee3124] rounded mr-3" />
                            <span className="text-[#ee3124] font-semibold text-base">Skills</span>
                        </div>
                        <span className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 shadow-sm">
                            {openCards.skills ? (
                                <ChevronDoubleUpIcon className="w-4 h-4" />
                            ) : (
                                <ChevronDoubleDownIcon className="w-4 h-4" />
                            )}
                        </span>
                    </button>
                    {openCards.skills && (
                        <div className="px-4 py-4">
                            <BulletList items={skills} />
                        </div>
                    )}
                </div>
            </div>

            {/* Educational Background */}
            <div className="border rounded-lg shadow-sm bg-white">
                <button
                    type="button"
                    className="w-full flex justify-between items-center px-4 py-3 bg-white rounded-t-lg focus:outline-none"
                    onClick={() => toggleCard("education")}
                >
                    <div className="flex items-center">
                        <span className="w-1 h-6 bg-[#ee3124] rounded mr-3" />
                        <span className="text-[#ee3124] font-semibold text-base">Educational Background</span>
                    </div>
                    <span className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 shadow-sm">
                        {openCards.education ? (
                            <ChevronDoubleUpIcon className="w-4 h-4" />
                        ) : (
                            <ChevronDoubleDownIcon className="w-4 h-4" />
                        )}
                    </span>
                </button>
                {openCards.education && (
                    <div className="px-4 py-4">
                        {educList.length > 0 ? (
                            <div className="space-y-4">
                                {educList.map((edu, idx) => (
                                    <EducationItem key={idx} edu={edu} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-sm text-gray-500">N/A</div>
                        )}
                    </div>
                )}
            </div>

            {/* Licenses & Certifications */}
            <div className="border rounded-lg shadow-sm bg-white">
                <button
                    type="button"
                    className="w-full flex justify-between items-center px-4 py-3 bg-white rounded-t-lg focus:outline-none"
                    onClick={() => toggleCard("licenses")}
                >
                    <div className="flex items-center">
                        <span className="w-1 h-6 bg-[#ee3124] rounded mr-3" />
                        <span className="text-[#ee3124] font-semibold text-base">Licenses & Certifications</span>
                    </div>
                    <span className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 shadow-sm">
                        {openCards.licenses ? (
                            <ChevronDoubleUpIcon className="w-4 h-4" />
                        ) : (
                            <ChevronDoubleDownIcon className="w-4 h-4" />
                        )}
                    </span>
                </button>
                {openCards.licenses && (
                    <div className="px-4 py-4">
                        {licensesList.length > 0 ? (
                            <div className="space-y-4">
                                {licensesList.map((lic, idx) => (
                                    <LicenseItem key={idx} lic={lic} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-sm text-gray-500">N/A</div>
                        )}
                    </div>
                )}
            </div>

            {/* Megawide Work Experience */}
            <div className="border rounded-lg shadow-sm bg-white">
                <button
                    type="button"
                    className="w-full flex justify-between items-center px-4 py-3 bg-white rounded-t-lg focus:outline-none"
                    onClick={() => toggleCard("megawide")}
                >
                    <div className="flex items-center">
                        <span className="w-1 h-6 bg-[#ee3124] rounded mr-3" />
                        <span className="text-[#ee3124] font-semibold text-base">Megawide Work Experience</span>
                    </div>
                    <span className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 shadow-sm">
                        {openCards.megawide ? (
                            <ChevronDoubleUpIcon className="w-4 h-4" />
                        ) : (
                            <ChevronDoubleDownIcon className="w-4 h-4" />
                        )}
                    </span>
                </button>
                {openCards.megawide && (
                    <div className="px-4 py-4">
                        <MegawideWorkSection
                            megawide={megawide}
                            functions={functions}
                        />
                        {previousAssignments.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <h3 className="text-sm font-semibold mb-3">
                                    Previous Assignments within Megawide:
                                </h3>
                                <div className="space-y-3">
                                    {previousAssignments.map((assign, idx) => (
                                        <PreviousAssignmentItem
                                            key={idx}
                                            assign={assign}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Previous Work Experience */}
            <div className="border rounded-lg shadow-sm bg-white">
                <button
                    type="button"
                    className="w-full flex justify-between items-center px-4 py-3 bg-white rounded-t-lg focus:outline-none"
                    onClick={() => toggleCard("previousWork")}
                >
                    <div className="flex items-center">
                        <span className="w-1 h-6 bg-[#ee3124] rounded mr-3" />
                        <span className="text-[#ee3124] font-semibold text-base">Previous Work Experience</span>
                    </div>
                    <span className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 shadow-sm">
                        {openCards.previousWork ? (
                            <ChevronDoubleUpIcon className="w-4 h-4" />
                        ) : (
                            <ChevronDoubleDownIcon className="w-4 h-4" />
                        )}
                    </span>
                </button>
                {openCards.previousWork && (
                    <div className="px-4 py-4">
                        {previousWork.length > 0 ? (
                            <div className="space-y-4">
                                {previousWork.map((work, idx) => (
                                    <PreviousWorkItem key={idx} work={work} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-sm text-gray-500">N/A</div>
                        )}
                    </div>
                )}
            </div>

            {/* Proficiencies */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Technical Proficiency */}
                <div className="border rounded-lg shadow-sm bg-white">
                    <button
                        type="button"
                        className="w-full flex justify-between items-center px-4 py-3 bg-white rounded-t-lg focus:outline-none"
                        onClick={() => toggleCard("technical")}
                    >
                        <div className="flex items-center">
                            <span className="w-1 h-6 bg-[#ee3124] rounded mr-3" />
                            <span className="text-[#ee3124] font-semibold text-base">Technical Proficiency</span>
                        </div>
                        <span className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 shadow-sm">
                            {openCards.technical ? (
                                <ChevronDoubleUpIcon className="w-4 h-4" />
                            ) : (
                                <ChevronDoubleDownIcon className="w-4 h-4" />
                            )}
                        </span>
                    </button>
                    {openCards.technical && (
                        <div className="px-4 py-4">
                            {techSkills.length > 0 ? (
                                <div className="space-y-3">
                                    {techSkills.map((skill, idx) => (
                                        <TechnicalSkillItem
                                            key={idx}
                                            skill={skill}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-sm text-gray-500">N/A</div>
                            )}
                        </div>
                    )}
                </div>

                {/* Language Proficiency */}
                <div className="border rounded-lg shadow-sm bg-white">
                    <button
                        type="button"
                        className="w-full flex justify-between items-center px-4 py-3 bg-white rounded-t-lg focus:outline-none"
                        onClick={() => toggleCard("language")}
                    >
                        <div className="flex items-center">
                            <span className="w-1 h-6 bg-[#ee3124] rounded mr-3" />
                            <span className="text-[#ee3124] font-semibold text-base">Language Proficiency</span>
                        </div>
                        <span className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 shadow-sm">
                            {openCards.language ? (
                                <ChevronDoubleUpIcon className="w-4 h-4" />
                            ) : (
                                <ChevronDoubleDownIcon className="w-4 h-4" />
                            )}
                        </span>
                    </button>
                    {openCards.language && (
                        <div className="px-4 py-4">
                            {languages.length > 0 ? (
                                <div className="space-y-3">
                                    {languages.map((lang, idx) => (
                                        <LanguageItem key={idx} lang={lang} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-sm text-gray-500">N/A</div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
