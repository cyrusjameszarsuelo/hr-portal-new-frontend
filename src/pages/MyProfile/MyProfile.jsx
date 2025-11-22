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
                    // let result = await getUserProfile(user.email);
                    let result = await getUserProfile('bjhu@megawide.com.ph');
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
            {orgStructureId === undefined ? (
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center">
                        <svg width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="#ee3124" className="mb-4">
                            <circle cx="12" cy="12" r="10" strokeWidth="2" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 9h6M9 15h6" />
                        </svg>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">No Access</h2>
                        <p className="text-gray-500 text-center">You do not have permission to view this profile.</p>
                    </div>
                </div>
            ) : orgStructureId ? (
                <ProfileRoot orgStructureId={orgStructureId} />
            ) : (
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 border-4 border-gray-200 border-t-[#ee3124] rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-500">Loading profile...</p>
                    </div>
                </div>
            )}
        </div>
    );
}
