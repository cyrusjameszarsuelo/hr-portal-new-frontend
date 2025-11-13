import React, { useEffect, useState } from "react";
import useUser from "../../contexts/useUser";
import ProfileRoot from "./ProfileRoot";
import { getUserProfile } from "@/database/org_structure";

export default function MyProfile() {
    const { user } = useUser();
    // console.log(user);
    const [orgStructureId, setOrgStructureId] = useState(null);
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                if (user) {
                    let result = await getUserProfile(user.email);
                    if (result.length === undefined || result.length === 0) {
                        result = await getUserProfile("bjhu@megawide.com.ph");
                    }
                    setOrgStructureId(result.id);
                }
            } catch (error) {
                console.error("Error fetching user profile:", error);
            }
        };

        fetchProfile();
    }, [user]);

    return (
        <div className="mx-auto lg:p-4 pt-4 bg-gray-50 border border-gray-200 rounded-lg shadow">
            <ProfileRoot orgStructureId={orgStructureId} />
        </div>
    );
}
