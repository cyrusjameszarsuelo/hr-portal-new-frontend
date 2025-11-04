import ProfileRoot from "../ProfileRoot";
import { useParams } from "react-router";

export default function SelectedEmployee() {
    const { id } = useParams();

    return (
        <div className="mx-auto p-4 md:p-6 bg-gray-50 border border-gray-200 rounded-lg shadow">
            <ProfileRoot orgStructureId={id} />
        </div>
    );
}
