import React, { useEffect, useState } from "react";
import Title from "../../components/Title";
import Tabs from "../../components/Tabs";
import {
    BriefcaseIcon,
    EnvelopeIcon,
    MapPinIcon,
    PencilIcon,
    PhoneIcon,
    UserPlusIcon,
} from "@heroicons/react/24/outline";
import avatar from "../../assets/images/vacant.png";
import useUser from "../../contexts/useUser";
import { useQuery } from "@tanstack/react-query";
import { getTeamMembers, getUserProfile } from "../../utils/org_structure";
import JobProfile from "../../components/MyProfile/JobProfile";
import { useNavigate } from "react-router";
import { getMyProfileById } from "../../utils/my_profile";

export default function MyProfile() {
    const navigate = useNavigate();
    const [active, setActive] = useState("about");
    const [profileActive, setProfileActive] = useState(true);
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [loadingMember, setLoadingMember] = useState(false);
    const { user } = useUser();
    const BASE_URL = `${import.meta.env.VITE_API_URL}/storage/`;

    const { data: userProfile, isLoading: _isLoadingProfile } = useQuery({
        queryKey: ["user-profile", user?.email],
        queryFn: () => getMyProfileById(3), // Temporarily using static ID for demo
        refetchOnWindowFocus: true,
        enabled: !!user?.email,
    });

    const { data: teamMembers, isLoading: _isLoadingTeamMembers } = useQuery({
        queryKey: ["team-members", user?.email],
        queryFn: () => getTeamMembers(3),
        refetchOnWindowFocus: true,
        enabled: !!user?.email,
    });

    const tabDefs = React.useMemo(() => {
        return [
            {
                id: "about",
                label: "About",
                content: <p>Content for About tab goes here.</p>,
            },
            {
                id: "job",
                label: "Job Profile",
                content: (
                    <JobProfile jobProfile={selectedProfile || userProfile} />
                ),
            },
            {
                id: "dev",
                label: "Development Plan",
                content: <p>Content for Development Plan tab goes here.</p>,
            },
            {
                id: "perf",
                label: "Performance Management",
                content: (
                    <p>Content for Performance Management tab goes here.</p>
                ),
            },
        ];
    }, [userProfile, selectedProfile]);

    async function handleMemberClick(member) {
        if (!member?.email) return;
        try {
            setLoadingMember(true);
            setActive("job");
            const data = await getUserProfile(member.email);
            setSelectedProfile(data);
        } catch (e) {
            console.error("Failed to load member profile", e);
        } finally {
            setLoadingMember(false);
        }
    }

    useEffect(() => {
        const loadProfile = async () => {
            if (profileActive) {
                const data = await getMyProfileById(3);
                setSelectedProfile(data);
                setSelectedProfile(null);
            }
        };
        loadProfile();
    }, [profileActive]);

    const handleEditProfile = () => {
        const profileId = selectedProfile ? selectedProfile.id : userProfile.id;
        navigate(`/my-profile/${profileId}`);
    };

    return (
        <div className="mx-auto p-4 md:p-6 bg-gray-50 border border-gray-200 rounded-lg shadow">
            <div className="w-full sm:w-auto mb-5 flex items-center justify-between">
                <Title title="My Profile" />
                <button
                    className=" p-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                    onClick={handleEditProfile}
                >
                    <PencilIcon className="w-5 h-5 hover:text-red-400 inline-block text-red-600 cursor-pointer" />
                </button>
            </div>

            <div className="flex flex-col md:flex-row ">
                <div className="w-full md:w-96">
                    {profileActive && (
                        <div className="bg-white border border-gray-200 shadow-xl rounded-lg py-3 px-4">
                            <div className="photo-wrapper p-2">
                                <img
                                    className="w-32 h-32 rounded-full mx-auto object-cover"
                                    src={
                                        userProfile?.image
                                            ? BASE_URL + userProfile.image
                                            : undefined
                                    }
                                    alt="profile"
                                />
                            </div>
                            <div className="p-2">
                                <h3 className="text-center text-2xl text-gray-900 font-medium leading-8">
                                    {userProfile && userProfile.name}
                                </h3>
                                <div className="text-center text-gray-400 text-xs font-semibold">
                                    <p>
                                        {userProfile &&
                                            userProfile.position_title}
                                    </p>
                                </div>
                                <div className="text-center text-black text-xs font-semibold mt-3 border-2 border-gray-300 w-40 mx-auto rounded-2xl bg-gray-300 p-1">
                                    ID #00{userProfile && userProfile.emp_no}
                                </div>
                                <hr className="m-6 border-gray-300" />
                                <p className="text-xs font-bold text-gray-500">
                                    Reporting To
                                </p>

                                <div className="px-4 py-2 my-3">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={avatar}
                                            alt="Reporting to avatar"
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                        <div className="ml-3">
                                            <div className="text-sm font-semibold text-gray-800">
                                                {userProfile &&
                                                    userProfile.reporting}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                Management Associate
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <hr className="m-6 border-gray-300" />
                                <p className="text-xs font-bold text-gray-500">
                                    Personal Details
                                </p>
                                <table className="text-sm my-3 w-full">
                                    <tbody>
                                        <tr>
                                            <td className="text-sm px-2 py-2 text-gray-500 font-semibold">
                                                <PhoneIcon className="w-4 h-4 inline-block mr-1 text-[#ee3124]" />
                                            </td>
                                            <td className="text-sm px-2 py-2">
                                                +977 9955221114
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="text-sm px-2 py-2 text-gray-500 font-semibold">
                                                <EnvelopeIcon className="w-4 h-4 inline-block mr-1 text-[#ee3124]" />
                                            </td>
                                            <td className="text-sm px-2 py-2">
                                                {userProfile &&
                                                    userProfile.email}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="text-sm px-2 py-2 text-gray-500 font-semibold">
                                                <MapPinIcon className="w-4 h-4 inline-block mr-1 text-[#ee3124]" />
                                            </td>
                                            <td className="text-sm px-2 py-2">
                                                Quezon City, Philippines
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <hr className="m-6 border-gray-300" />

                                <p className="text-xs font-bold text-gray-500">
                                    Job Details
                                </p>
                                <table className="text-sm my-3 w-full">
                                    <tbody>
                                        <tr>
                                            <td className="text-sm px-2 py-2 text-gray-500 font-semibold">
                                                <BriefcaseIcon className="w-4 h-4 inline-block mr-1 text-[#ee3124]" />
                                            </td>
                                            <td className="text-sm px-2 py-2">
                                                {userProfile &&
                                                    userProfile.department}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="text-sm px-2 py-2 text-gray-500 font-semibold">
                                                <UserPlusIcon className="w-4 h-4 inline-block mr-1 text-[#ee3124]" />
                                            </td>
                                            <td className="text-sm px-2 py-2">
                                                {userProfile &&
                                                    userProfile.level}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {!profileActive && (
                        <div className="bg-white border border-gray-200 shadow-xl rounded-lg py-3 px-4">
                            <p className="text-xs font-bold text-gray-500 px-2">
                                My Team
                            </p>

                            <div className="mt-2">
                                {_isLoadingTeamMembers ? (
                                    <div className="px-4 py-6 text-center text-sm text-gray-500">
                                        Loading team members…
                                    </div>
                                ) : teamMembers && teamMembers.length > 0 ? (
                                    teamMembers.map((member, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() =>
                                                handleMemberClick(member)
                                            }
                                            className="w-full text-left px-4 py-2 my-2 rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200 transition"
                                        >
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={
                                                        member?.image
                                                            ? BASE_URL +
                                                              member.image
                                                            : avatar
                                                    }
                                                    alt={
                                                        member?.name ||
                                                        "Team member"
                                                    }
                                                    className="w-10 h-10 rounded-full object-cover"
                                                />
                                                <div className="ml-1">
                                                    <div className="text-sm font-semibold text-gray-800">
                                                        {member?.name ||
                                                            "Unnamed"}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {member?.position_title ||
                                                            "Job Title"}
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    ))
                                ) : (
                                    <div className="px-4 py-6 text-center text-sm text-gray-500">
                                        No team members to display.
                                    </div>
                                )}
                            </div>

                            {loadingMember && (
                                <div className="px-4 py-2 text-xs text-gray-500">
                                    Loading selected profile…
                                </div>
                            )}
                        </div>
                    )}

                    <button
                        className="w-full bg-[#ee3124] hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg mt-4"
                        onClick={() => setProfileActive((prev) => !prev)}
                    >
                        {profileActive ? "My Team" : "My Profile"}
                    </button>
                </div>

                <div className="flex-1 mt-4 md:mt-0 md:ml-6 bg-white border border-gray-200 rounded-lg p-4">
                    {loadingMember || _isLoadingProfile ? (
                        <div className="flex items-center justify-center min-h-[400px]">
                            <div className="relative">
                                <div className="w-16 h-16 border-4 border-gray-200 border-t-[#ee3124] rounded-full animate-spin"></div>
                            </div>
                        </div>
                    ) : (
                        <Tabs
                            tabs={tabDefs}
                            active={active}
                            onChange={setActive}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
