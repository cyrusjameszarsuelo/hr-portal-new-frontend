
import api from "./api";

export async function getAuditLogs(id) {
    try {
        const response = await api.get(`/audit-logs/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching functional structure:", error);
        throw error;
    }
}