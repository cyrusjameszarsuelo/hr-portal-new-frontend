import api from "./api";

export async function getPositionTitle() {
    try {
        const response = await api.get(`/position-titles`);
        return response.data;
    } catch (error) {
        console.error("Error fetching audit logs:", error);
        throw error;
    }
}

// Add new position title to the database
export async function addPositionTitle(title) {
    try {
        const response = await api.post(`/position-titles`, { position_title: title });
        return response.data;
    } catch (error) {
        console.error("Error adding position title:", error);
        throw error;
    }
}