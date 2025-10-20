import { useQuery } from "@tanstack/react-query";
import OrgChartComponent from "../../components/OrgChartComponent";
import Title from "../../components/Title";
import { getHeadCount, getHeadCountPerDept, getOrgStructure } from "../../utils/org_structure";
import { Error, Loading } from "../../components/LoadingError";
import CustomModal from "../../components/CustomModal";
import React, { useState } from "react";
import ModalTabs from "../../components/ModalTabs";

export default function OrganizationalStructure() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const {
        data: orgStructureData,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["functional-structure"],
        queryFn: getOrgStructure,
        refetchOnWindowFocus: true,
    });

    // Data fetching
    const {
        data: orgHeadCount,
        isLoading: isLoadingHeadCount,
        refetch,
    } = useQuery({
        queryKey: ["head-count"],
        queryFn: getHeadCount,
        refetchOnWindowFocus: true,
    });

     const {
        data: orgHeadCountPerDept,
        isLoading: isLoadingDept,
        // refetch: refetchDept,
    } = useQuery({
        queryKey: ["head-count-per-dept"],
        queryFn: getHeadCountPerDept,
        refetchOnWindowFocus: true,
    });

    // Loading and error states
    if (isLoading) return <Loading />;
    if (isError)
        return <Error message="Failed to load functional structure." />;

    return (
        <section className="w-auto p-6 bg-white rounded-lg shadow">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="w-full sm:w-auto">
                    <Title title="Organizational Structure" />
                </div>
                <button
                    type="button"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#ee3124] text-white font-semibold rounded-lg shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transition-all duration-200 text-sm sm:ml-auto self-start w-32"
                    onClick={() => setIsModalOpen(true)}
                    aria-label="Open plantilla modal"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m19.5 8.25-7.5 7.5-7.5-7.5"
                        />
                    </svg>
                    Plantilla
                </button>
            </div>

            <CustomModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={`Head Count Breakdown`}
            >
                <ModalTabs
                    orgHeadCount={orgHeadCount}
                    isLoadingHeadCount={isLoadingHeadCount}
                    orgHeadCountPerDept={orgHeadCountPerDept}
                    isLoadingDept={isLoadingDept}
                />
            </CustomModal>

            <div className="w-full h-[80vh] overflow-hidden">
                <OrgChartComponent
                    orgData={orgStructureData}
                    refetch={refetch}
                />
            </div>
        </section>
    );
}
