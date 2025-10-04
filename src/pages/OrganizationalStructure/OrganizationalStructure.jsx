import OrgChartComponent from "../../components/OrgChartComponent";
import Title from "../../components/Title";
import { organizational_structure } from "../../data/organizational_structure";

export default function OrganizationalStructure() {
    const orgStructureData = organizational_structure;

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
