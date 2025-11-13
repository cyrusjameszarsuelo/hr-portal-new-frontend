export function formatDate(value, removeTime = false) {
    if (!value) return "-";
    try {
        const date = new Date(value);
        if (removeTime) {
            return date.toLocaleDateString();
        }
        return date.toLocaleString();
    } catch {
        return String(value);
    }
}