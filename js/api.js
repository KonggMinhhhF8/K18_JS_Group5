import { refreshAccessToken } from "./auth.js";

export const API_URL =
    "https://k305jhbh09.execute-api.ap-southeast-1.amazonaws.com";

export function isTokenExpired(token) {
    if (!token) return true;
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const now = Math.floor(Date.now() / 1000);
        return payload.exp - now < 30;
    } catch (e) {
        return true;
    }
}

export async function fetchWithAuth(url, options = {}) {
    let token = localStorage.getItem("access_token");

    const headers = {
        "Content-Type": "application/json",
        ...options.headers,
    };

    if (token) headers["Authorization"] = `Bearer ${token}`;

    try {
        let response = await fetch(url, { ...options, headers });

        if (response.status === 401 || response.status === 400) {
            const newToken = await refreshAccessToken();
            if (newToken) {
                return await fetch(url, { ...options, headers });
            } else {
                window.location.href = "login.html";
                return null;
            }
        }

        const result = response.json();
        console.log(result);
        return result;
    } catch (error) {
        throw new Error("Lỗi kết nối API:", error);
    }
}
