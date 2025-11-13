
import api from "./api";

export async function getFunctionAuditLogs(params = {}) {
    try {
        const response = await api.get(`/functional-audit-logs`, { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching audit logs:", error);
        throw error;
    }
}

export async function getOrgStructureAuditLogs(params = {}) {
    try {
        const response = await api.get(`/org-structure-audit-logs`, { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching audit logs:", error);
        throw error;
    }
}