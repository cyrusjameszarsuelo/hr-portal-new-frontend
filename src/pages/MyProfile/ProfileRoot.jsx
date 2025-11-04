import Tabs from "../../components/Tabs";
import {
    BriefcaseIcon,
    DocumentArrowDownIcon,
    EnvelopeIcon,
    MapPinIcon,
    PencilIcon,
    PhoneIcon,
    UserPlusIcon,
} from "@heroicons/react/24/outline";
import AboutProfile from "./about/AboutProfile";
import avatar from "../../assets/images/vacant.png";
import { useNavigate } from "react-router";
import { downloadPdfProfile, getMyProfileById } from "../../utils/my_profile";
import { useEffect, useMemo, useState } from "react";
import JobProfile from "@/pages/MyProfile/job-profile/JobProfile";
import Title from "@/components/Title";
import { getAboutById } from "@/utils/about";
import { useQuery } from "@tanstack/react-query";
import { getTeamMembers } from "@/utils/org_structure";
import PerformanceManagement from "./performance-management/PerformanceManagement";

export default function ProfileRoot({ orgStructureId }) {
    const navigate = useNavigate();
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [loadingMember, setLoadingMember] = useState(false);
    const [selectedAbout, setSelectedAbout] = useState(null);
    const [active, setActive] = useState("about");
    const [profileActive, setProfileActive] = useState(true);
    const BASE_URL = `${import.meta.env.VITE_API_URL}/storage/`;

    const { data: userProfile, isLoading: _isLoadingProfile } = useQuery({
        queryKey: ["user-profile", orgStructureId],
        queryFn: () => getMyProfileById(orgStructureId), // Temporarily using static ID for demo
        refetchOnWindowFocus: true,
        enabled: !!orgStructureId,
    });

    const { data: aboutProfile, isLoading: _isLoadingAbout } = useQuery({
        queryKey: ["about", orgStructureId],
        queryFn: () => getAboutById(orgStructureId), // Temporarily using static ID for demo
        refetchOnWindowFocus: true,
        enabled: !!orgStructureId,
    });

    const { data: teamMembers, isLoading: _isLoadingTeamMembers } = useQuery({
        queryKey: ["team-members", orgStructureId],
        queryFn: () => getTeamMembers(orgStructureId),
        refetchOnWindowFocus: true,
        enabled: !!orgStructureId,
    });

    const handleEditProfile = () => {
        const profileId = selectedProfile ? selectedProfile.id : userProfile.id;
        navigate(`/my-profile/${profileId}`);
    };

    const downloadPdf = async () => {
        const profileId = selectedProfile ? selectedProfile.id : userProfile.id;
        try {
            const blob = await downloadPdfProfile(profileId);
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `MyProfile_${profileId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error("Error downloading PDF:", error);
        }
    };

    const tabDefs = useMemo(() => {
        return [
            {
                id: "about",
                label: "About",
                content: <AboutProfile about={selectedAbout || aboutProfile} />,
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
                    <PerformanceManagement />
                ),
            },
        ];
    }, [userProfile, selectedProfile, aboutProfile, selectedAbout]);

    async function handleMemberClick(member) {
        if (!member?.email) return;
        try {
            setLoadingMember(true);
            setActive("about");
            const data = await getMyProfileById(member.id);
            setSelectedProfile(data);
            // Load About data for the selected member as well
            const aboutData = await getAboutById(member.id);
            setSelectedAbout(aboutData);
        } catch (e) {
            console.error("Failed to load member profile", e);
        } finally {
            setLoadingMember(false);
        }
    }

    useEffect(() => {
        const loadProfile = async () => {
            if (profileActive) {
                const data = await getMyProfileById(orgStructureId);
                setSelectedProfile(data);
                setSelectedProfile(null);
                setSelectedAbout(null);
            }
        };
        loadProfile();
    }, [orgStructureId, profileActive]);

    if (!userProfile) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-gray-200 border-t-[#ee3124] rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="w-full sm:w-auto mb-5 flex items-center justify-between">
                <Title title="My Profile" />
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        title="Edit Profile"
                        aria-label="Edit Profile"
                        className="group inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-[#ee3124] hover:text-[#ee3124] focus:outline-none focus:ring-2 focus:ring-[#ee3124]/30 transition"
                        onClick={handleEditProfile}
                    >
                        <PencilIcon className="w-5 h-5 text-[#ee3124]" />
                        <span className="hidden sm:inline">Edit Profile</span>
                    </button>

                    <button
                        type="button"
                        title="Download PDF"
                        aria-label="Download PDF"
                        className="group inline-flex items-center gap-2 rounded-lg bg-black px-3 py-2 text-sm font-semibold text-white hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-black/30 transition"
                        onClick={downloadPdf}
                    >
                        <DocumentArrowDownIcon className="w-5 h-5 text-white" />
                        <span className="hidden sm:inline">Download PDF</span>
                    </button>
                </div>
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

                                {userProfile?.job_profile?.reporting_to && (
                                    <>
                                        <hr className="m-6 border-gray-300" />
                                        <p className="text-xs font-bold text-gray-500">
                                            Reporting To
                                        </p>

                                        <div className="px-4 py-2 my-3">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={
                                                        userProfile?.image
                                                            ? BASE_URL +
                                                              userProfile
                                                                  .job_profile
                                                                  ?.reporting_to
                                                                  ?.image
                                                            : undefined
                                                    }
                                                    alt="Reporting to avatar"
                                                    className="w-10 h-10 rounded-full object-cover"
                                                />
                                                <div className="ml-3">
                                                    <div className="text-sm font-semibold text-gray-800">
                                                        {userProfile &&
                                                            userProfile
                                                                ?.job_profile
                                                                ?.reporting_to
                                                                ?.name}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {userProfile &&
                                                            userProfile
                                                                ?.job_profile
                                                                ?.reporting_to
                                                                ?.position_title}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}

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
                                                No Available
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
                                                San Juan City, Metro Manila
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
                                Direct Reporting ({teamMembers.length})
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

                    {teamMembers?.length > 0 && (
                        <button
                            className="w-full bg-[#ee3124] hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg mt-4"
                            onClick={() => setProfileActive((prev) => !prev)}
                        >
                            {profileActive
                                ? `Direct Reporting (${
                                      teamMembers && teamMembers.length
                                  })`
                                : "My Profile"}
                        </button>
                    )}

                    {userProfile.dept_head !== 0 && userProfile.dept_head && (
                        <button className="w-full bg-[#ee3124] hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg mt-4">
                            Indirect Reporting
                        </button>
                    )}

                    {!userProfile?.is_admin && (
                        <button
                            className="w-full bg-[#ee3124] hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg mt-4"
                            onClick={() => navigate("/all-employees")}
                        >
                            All Employees
                        </button>
                    )}
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
        </>
    );
}
