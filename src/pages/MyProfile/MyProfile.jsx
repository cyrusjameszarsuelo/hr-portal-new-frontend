import React, { useEffect, useState } from "react";
import useUser from "../../contexts/useUser";
import ProfileRoot from "./ProfileRoot";
import { getUserProfile } from "@/utils/org_structure";

export default function MyProfile() {
    const { user } = useUser();
    const [orgStructureId, setOrgStructureId] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                if (user) {
                    const result = await getUserProfile('bjhu@megawide.com.ph');
                    setOrgStructureId(result.id);
                }
            } catch (error) {
                console.error("Error fetching user profile:", error);
            }
        };

        fetchProfile();
    }, [user]);


    return (
        <div className="mx-auto p-4 md:p-6 bg-gray-50 border border-gray-200 rounded-lg shadow">
            <ProfileRoot
                orgStructureId={orgStructureId}
            />
        </div>
    );
}
