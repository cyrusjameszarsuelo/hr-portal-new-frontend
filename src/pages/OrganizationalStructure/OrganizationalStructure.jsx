import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import OrgChartComponent from "../../components/OrgChartComponent";
import Title from "../../components/Title";
import {
    getHeadCount,
    getHeadCountPerDept,
    getOrgStructure,
} from "../../utils/org_structure";
import { Error, Loading } from "../../components/LoadingError";
import CustomModal from "../../components/CustomModal";
import ModalTabs from "../../components/ModalTabs";
import {
    ChevronDoubleDownIcon,
    InformationCircleIcon,
} from "@heroicons/react/24/outline";

export default function OrganizationalStructure() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const {
        data: orgStructureData,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["org-structure"],
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
        return <Error message="Failed to load Organizational Structure." />;

    return (
        <section className="w-auto p-6 bg-white rounded-lg shadow">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="w-full sm:w-auto">
                    <Title title="Organizational Structure" />
                </div>

                <div className="flex gap-3 w-full sm:w-auto">
                    <button
                        type="button"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white font-semibold rounded-lg shadow hover:bg-black/75 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transition-all duration-200 text-sm sm:ml-auto self-start w-32"
                        onClick={() => navigate('/org-structure-audit-logs')}
                        aria-label="Audit Trails"
                    >
                        <InformationCircleIcon className="h-5 w-5" />
                        Logs
                    </button>

                    <button
                        type="button"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#ee3124] text-white font-semibold rounded-lg shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transition-all duration-200 text-sm sm:ml-auto self-start w-32"
                        onClick={() => setIsModalOpen(true)}
                        aria-label="Open plantilla modal"
                    >
                        <ChevronDoubleDownIcon className="h-5 w-5" />
                        Plantilla
                    </button>
                </div>
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
