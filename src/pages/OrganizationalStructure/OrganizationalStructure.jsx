import { useQuery } from "@tanstack/react-query";
import OrgChartComponent from "../../components/OrgChartComponent";
import Title from "../../components/Title";
import { getOrgStructure } from "../../utils/org_structure";
import { Error, Loading } from "../../components/LoadingError";

export default function OrganizationalStructure() {
    // Data fetching
    const {
        data: orgStructureData,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["functional-structure"],
        queryFn: getOrgStructure,
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
            </div>
            <div className="w-full h-[80vh] overflow-hidden">
                <OrgChartComponent orgData={orgStructureData} />
            </div>
        </section>
    );
}
