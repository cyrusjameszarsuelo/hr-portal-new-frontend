import axios from "axios";

export function get(url, data = {}) {
    return axios.get(url, data);
}
