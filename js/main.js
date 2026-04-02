import { sidebar } from "../components/sidebar.js";
import { home } from "../pages/home.js";
import { product } from "../pages/product.js";
import { order } from "../pages/orders.js";
import { customer } from "../pages/customer.js";
import { report } from "../pages/report.js";
import { checkAndRefreshToken } from "../apis/auth.js";
import {
    createProduct,
    createOrder,
    createCustomer,
} from "../pages/creates.js";

const routes = {
    "/": home,
    "/products": product,
    "/orders": order,
    "/customers": customer,
    "/reports": report,
    "/products/create": createProduct,
    "/products/edit/:id": createProduct,
    "/orders/create": createOrder,
    "/orders/edit/:id": createOrder,
    "/customers/create": createCustomer,
    "/customers/edit/:id": createCustomer,
};
const app = document.querySelector("#app");
let authCheckTimeout = null;

async function startAutoRefresh() {
    // Xóa timeout cũ nếu có để tránh trùng lặp
    if (authCheckTimeout) clearTimeout(authCheckTimeout);

    const token = localStorage.getItem("access_token");

    if (token) {
        try {
            // Đợi hàm check hoàn tất
            await checkAndRefreshToken();
        } catch (error) {
            console.error("Lỗi khi auto refresh:", error);
        }
    }

    // auto check lại sau 1 phút để khi hết gần hết hạn accessToken gọi cái mới về
    authCheckTimeout = setTimeout(startAutoRefresh, 60 * 1000);
}

startAutoRefresh();

const matchRoute = (path, routes) => {
    for (const route in routes) {
        const paramNames = [];

        // chuyển "/customers/edit/:id" → regex
        const regexPath = route.replace(/:([^/]+)/g, (_, paramName) => {
            paramNames.push(paramName);
            return "([^/]+)";
        });

        const regex = new RegExp(`^${regexPath}$`);
        const match = path.match(regex);

        if (match) {
            const params = {};

            paramNames.forEach((name, index) => {
                params[name] = match[index + 1];
            });

            return {
                page: routes[route],
                params,
            };
        }
    }

    return null;
};

const getPath = () => {
    const hash = window.location.hash.replace("#", "");
    if (!hash) return "/";
    return hash.startsWith("/") ? hash : `/${hash}`;
};

const toggleLoading = (isLoading) => {
    const loader = document.querySelector("#loader");
    if (isLoading) {
        loader.classList.remove("hidden");
        app.style.opacity = "0"; // コンテンツを薄くする
    } else {
        loader.classList.add("hidden");
        app.style.opacity = "1";
    }
};

const render = async () => {
    try {
        toggleLoading(true);

        // check refresh token
        const isAuth = await checkAndRefreshToken();
        if (!isAuth) {
            return;
        }

        // sử dụng khi sài live sever
        const path = getPath();
        // có server
        // const path = window.location.pathname

        const match = matchRoute(path, routes);
        document.querySelector("#sidebar").innerHTML = sidebar(path);

        if (match) {
            const { page, params } = match;
            const content = await page(params);

            app.innerHTML = "";
            if (content instanceof HTMLElement) {
                app.appendChild(content);
            } else {
                app.innerHTML = content;
            }
        } else {
            app.innerHTML = "<h2>404 - Not Found</h2>";
        }

        bindLinks();
    } catch (error) {
        console.error("Lỗi hệ thống:", error);
    } finally {
        toggleLoading(false);
    }
};

const bindLinks = () => {
    document.querySelectorAll("a[data-link]").forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const href = link.getAttribute("href");
            window.history.pushState(null, null, href);
            render();
        });
    });
};

// sử dụng khi sài live sever
window.addEventListener("hashchange", render);

// có server
// window.addEventListener("popstate", render);
document.addEventListener("DOMContentLoaded", render);
