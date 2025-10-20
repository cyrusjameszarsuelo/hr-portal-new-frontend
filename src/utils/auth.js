import api from "./api";

export async function logout(id) {
    try {
        const response = await api.post(`/logout/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error managing function:", error);
        throw error;
    }
}