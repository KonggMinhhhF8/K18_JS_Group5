const API_URL = "https://k305jhbh09.execute-api.ap-southeast-1.amazonaws.com";

export async function login(email, password) {
    const response = await fetch(`${API_URL}/auth/signin`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        throw new Error("Sai email hoặc mật khẩu");
    }

    const { accessToken, refreshToken } = await response.json();

    // Lưu token vào localStorage
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);

    return accessToken;
}

// chech Token expired JWT
export function isTokenExpired(token) {
    if (!token) return true;
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const now = Math.floor(Date.now() / 1000);
        return payload.exp - now < 120; // sắp hết hạn trong 12 giây
    } catch {
        return true;
    }
}

// check xem có cái cũ r k cần cái mới
let refreshP = null;

export async function refreshAccessToken() {
    // Nếu có rồi không gọi lại mà sử dụng luôn cái cũ
    if (refreshP) return refreshP;

    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) return null;

    refreshP = (async () => {
        try {
            const response = await fetch(`${API_URL}/auth/refresh-token`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refreshToken }),
            });

            if (response.status === 401 || response.status === 403) {
                localStorage.clear();
                window.location.href = "login.html";
                return null;
            }

            const { accessToken, refreshToken: newRefreshToken } =
                await response.json();
            localStorage.setItem("access_token", accessToken);
            if (newRefreshToken) {
                localStorage.setItem("refresh_token", newRefreshToken);
            }
            return accessToken;
        } catch (error) {
            console.log(error);
        } finally {
            refreshP = null;
        }
    })();

    return await refreshP;
}

export async function checkAndRefreshToken() {
    const token = localStorage.getItem("access_token");
    if (token && !isTokenExpired(token)) return true;

    console.log("Token expired or missing. Refreshing...");
    const newToken = await refreshAccessToken();

    if (!newToken) {
        localStorage.clear();
        window.location.href = "login.html";
        return false;
    }
    return true;
}
