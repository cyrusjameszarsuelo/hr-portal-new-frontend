
import api from "./api";

export async function getFunctionalStructure() {
    try {
        const response = await api.get("/function-positions/nested");
        return response.data;
    } catch (error) {
        console.error("Error fetching functional structure:", error);
        throw error;
    }
}

export async function getFunctionById(id) {
    if (id === undefined || id === null) {
        return null;
    }
    try {
        const response = await api.get(`/functions/${id}`);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error(`Error fetching function with ID ${id}:`, error);
        throw error;
    }
}

export async function getSubFunctionById(id) {
    if (id === undefined || id === null) {
        return null;
    }
    try {
        const response = await api.get(`/subfunctions/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching Subfunction with ID ${id}:`, error);
        throw error;
    }
}

export async function manageFunction(data) {
    try {
        const response = await api.post("/manage-function", data);
        return response.data;
    } catch (error) {
        console.error("Error managing function:", error);
        throw error;
    }
}

export async function getDescriptionById(id) {
    if (id === undefined || id === null) {
        return null;
    }
    try {
        const response = await api.get(`/description/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching description with ID ${id}:`, error);
        throw error;
    }
}

export async function manageDescription(data) {
    try {
        const response = await api.post("/manage-description", data);
        return response.data;
    } catch (error) {
        console.error("Error managing description:", error);
        throw error;
    }
}

export async function deleteFunction(data) {
    try {
        const response = await api.post(`/delete-function`, data);
        return response.data;
    } catch (error) {
        console.error(`Error deleting function with ${data}:`, error);
        throw error;
    }
}