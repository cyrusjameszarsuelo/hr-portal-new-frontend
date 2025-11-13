import { useState } from "react";
import { buildDropdownSections } from "../../../helper/normalize";
import JobDescriptionItem from "../../../components/ProfileComponents/JobDescriptionItem";
import {
    JobProfileHeader,
    JobPurposeSection,
    JobDescriptionsSection,
    DropdownSection,
} from "@/components/ProfileComponents/JobProfileComponents";

export default function JobProfile({ jobProfile }) {
    const title = jobProfile?.position_title;
    const level = jobProfile?.level;
    const department = jobProfile?.department;
    const reportsTo = jobProfile?.job_profile?.reporting_to?.name;
    const kras = jobProfile?.job_profile?.job_descriptions;
    const performanceStandards =
        jobProfile?.job_profile?.job_performance_standards;
    const jobSpecifications = jobProfile?.job_profile?.job_specifications;
    const reportingRelationships =
        jobProfile?.job_profile?.reporting_relationships;
    const levelsOfAuthority = jobProfile?.job_profile?.levels_of_authority;

    // Controlled open state: single open by default, and expand-all mode
    const [openIndex, setOpenIndex] = useState(null);
    const [openIndexes, setOpenIndexes] = useState(new Set());
    const [isAllExpanded, setIsAllExpanded] = useState(false);

    const handleToggleItem = (idx, shouldOpen) => {
        if (isAllExpanded) {
            setOpenIndexes((prev) => {
                const copy = new Set(prev);
                if (shouldOpen) copy.add(String(idx));
                else copy.delete(String(idx));
                return copy;
            });
        } else {
            setOpenIndex(shouldOpen ? idx : null);
        }
    };

    const toggleAll = () => {
        if (isAllExpanded) {
            setOpenIndexes(new Set());
            setOpenIndex(null);
            setIsAllExpanded(false);
        } else {
            const all = new Set(kras.map((_, i) => String(i)));
            setOpenIndexes(all);
            setOpenIndex(null);
            setIsAllExpanded(true);
        }
    };

    return (
        <div>
            <JobProfileHeader
                title={title}
                department={department}
                level={level}
                reportsTo={reportsTo}
            />

            <JobPurposeSection
                jobPurpose={jobProfile?.job_profile?.job_purpose}
            />

            <JobDescriptionsSection
                kras={kras}
                isAllExpanded={isAllExpanded}
                openIndex={openIndex}
                openIndexes={openIndexes}
                onToggleItem={handleToggleItem}
                onToggleAll={toggleAll}
                JobDescriptionItemComponent={JobDescriptionItem}
            />

            <DropdownGrid
                performanceStandards={performanceStandards}
                jobSpecifications={jobSpecifications}
                reportingRelationships={reportingRelationships}
                levelsOfAuthority={levelsOfAuthority}
            />
        </div>
    );
}

// Local component: Grid of dropdown sections
function DropdownGrid({
    performanceStandards,
    jobSpecifications,
    reportingRelationships,
    levelsOfAuthority,
}) {
    const sections = buildDropdownSections(
        performanceStandards,
        jobSpecifications,
        reportingRelationships,
        levelsOfAuthority,
    );

    const [openKeys, setOpenKeys] = useState(() => new Set());

    const toggleKey = (key, shouldOpen) => {
        setOpenKeys((prev) => {
            const next = new Set(prev);
            if (shouldOpen) next.add(key);
            else next.delete(key);
            return next;
        });
    };

    if (sections.length === 0) return null;

    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
            {sections.map((section, sIdx) => {
                // Create unique key for each item within this section
                const sectionKey = `section-${sIdx}`;
                return (
                    <DropdownSection
                        key={sectionKey}
                        title={section.title}
                        items={section.items}
                        openKeys={openKeys}
                        onToggleKey={toggleKey}
                        sectionIndex={sIdx}
                    />
                );
            })}
        </div>
    );
}
