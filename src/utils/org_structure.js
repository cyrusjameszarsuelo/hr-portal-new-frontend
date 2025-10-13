import api from "./api";

export async function getOrgStructure() {
    try {
        const response = await api.get("/organization-structure");
        return response.data;
    } catch (error) {
        console.error("Error fetching organizational structure:", error);
        throw error;
    }
}

export async function updateOrgStructure(updatedData) {
    try {
        const response = await api.put("/organization-structure/update", updatedData);
        return response.data;
    } catch (error) {
        console.error("Error updating organizational structure:", error);
        throw error;
    }
}

export async function deleteOrgNode(nodeId) {
    try {
        const response = await api.delete(`/organization-structure/delete/${nodeId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting organizational node:", error);
        throw error;
    }
}

export async function addOrgNode(nodeId) {
    try {
        const response = await api.post(`/organization-structure/add/${nodeId}`);
        return response.data;
    } catch (error) {
        console.error("Error adding organizational node:", error);
        throw error;
    }
}