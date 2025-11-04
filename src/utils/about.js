import api from "./api";

export async function addAbout(aboutPayload) {
    try {
        const response = await api.post(`/about/upsert`, aboutPayload);
        return response.data;
    } catch (error) {
        console.error("Error adding organizational node:", error);
        throw error;
    }
}

export async function getAboutById(profileId) {
    if (profileId === undefined || profileId === null) {
        return null;
    }
    try {
        const response = await api.get(`/about/${profileId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching My Profile with ID ${profileId}:`, error);
        throw error;
    }
}

export async function getAboutEdit(profileId) {
    if (profileId === undefined || profileId === null) {
        return null;
    }
    try {
        const response = await api.get(`/about/edit/${profileId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching About Edit data with ID ${profileId}:`, error);
        throw error;
    }
}