import OrgChartComponent from "../components/OrgChartComponent";
import { functional_structure } from "../store/functional_structure_paid";

export default function OrgChartPaid() {
    const orgData = functional_structure;

    return (
        <div style={{ padding: 20 }}>
            <h2>Functional Structure</h2>
            <OrgChartComponent data={orgData} />
        </div>
    );
}
