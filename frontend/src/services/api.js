import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    validateStatus: function (status) {
        return status < 500;
    },
});

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            const errorMessage =
                error.response.data?.message || "An error occurred";
            return Promise.reject({
                message: errorMessage,
                status: error.response.status,
                data: error.response.data,
            });
        } else if (error.request) {
            return Promise.reject({
                message: "No response from server. Please try again shortly.",
                status: 0,
            });
        } else {
            return Promise.reject({
                message: error.message || "An error occurred",
                status: 0,
            });
        }
    }
);

export default api;
