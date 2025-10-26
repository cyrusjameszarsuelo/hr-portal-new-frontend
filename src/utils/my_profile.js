import api from "./api";

export async function addMyProfile(jobPayload) {
    try {
        const response = await api.post(`/my-profile/store`, jobPayload);
        return response.data;
    } catch (error) {
        console.error("Error adding organizational node:", error);
        throw error;
    }
}

export async function getMyProfileById(profileId) {
    if (profileId === undefined || profileId === null) {
        return null;
    }
    try {
        const response = await api.get(`/my-profile/${profileId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching My Profile with ID ${profileId}:`, error);
        throw error;
    }
}
