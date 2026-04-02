import { fetchData } from "./apis/api.js";

export function getStatusColor(status) {
    switch (status?.toUpperCase()) {
        case "DELIVERING":
            return "delivering";
        case "DONE":
            return "done";
        case "PENDING":
            return "pending";
        case "CANCEL":
            return "cancel";
        default:
            return "#ccc";
    }
}

export function getStatus(status) {
    switch (status?.toUpperCase()) {
        case "DELIVERING":
            return "Đang giao hàng";
        case "DONE":
            return "Hoàn thành";
        case "PENDING":
            return "Chờ xử lý";
        case "CANCEL":
            return "Đã hủy";
        default:
            return "--";
    }
}

export function getRankColor(rank) {
    switch (rank?.toUpperCase()) {
        case "GOLD":
            return "gold";
        case "SILVER":
            return "silver";
        case "BRONZE":
            return "bronze";
        default:
            return "#ccc";
    }
}

export function getRankVN(rank) {
    switch (rank?.toUpperCase()) {
        case "GOLD":
            return "VÀNG";
        case "SILVER":
            return "BẠC";
        case "BRONZE":
            return "ĐỒNG";
        default:
            return "-";
    }
}

export function getcategoriVN(category) {
    switch (category?.toUpperCase()) {
        case "DESKTOP":
            return "Máy tính";
        case "SMARTPHONE":
            return "Điện thoại";
        case "TABLET":
            return "Máy tính bảng";
        case "ACCESSORY":
            return "Phụ kiện";
        default:
            return "-";
    }
}

export function formatAndMaskPhone(phone) {
    if (!phone || phone.length < 10) return phone;
    return phone.replace(/(\d{4})(\d{3})(\d{3})/, "$1.$2.xxx");
}

export function formatVND(price) {
    return Number(price).toLocaleString("vi-VN") + "đ";
}

export function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

export function formatDay(dateValue) {
    if (!dateValue) return "";

    const dateObj = new Date(dateValue);

    return new Intl.DateTimeFormat("vi-VN", {
        month: "2-digit",
        day: "2-digit",
    })
        .format(dateObj)
        .replace("-", "/");
}

export const validateDataPayload = {
    product: (categoryId, name, option = {}) => {
        const options = { ...option };
        return {
            // Required (bắt buộc)
            categoryId: Number(categoryId || 0),
            name: String(name || ""),

            // Optaional (không bắt buộc)
            id: Number(options.id),
            imageId: String(options.imageId || ""),
            sku: String(options.sku || ""),
            price: Math.floor(Number(options.price || 0)),
            remaining: Math.floor(Number(options.remaining || 0)),
        };
    },
    customer: (email, name, option = {}) => {
        const options = { ...option };
        return {
            // Required (bắt buộc)
            email: String(email || ""),
            name: String(name || ""),

            // Optaional (không bắt buộc)
            id: Number(options.id),
            address: String(options.address || ""),
            phone: String(options.phone || ""),
            rank: String(options.rank || ""),
        };
    },
    order: (productId, customerId, option = {}) => {
        const options = { ...option };
        return {
            // Required (bắt buộc)
            productId: Number(productId),
            customerId: Number(customerId),

            // Optaional (không bắt buộc)
            id: Number(options.id),
            amount: Number(options.amount || 0),
            status: String(options.status || "peding"),
        };
    },
};

function showOrderModal(order) {
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";

    overlay.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Chi tiết đơn hàng #${order.id}</h3>
                <span class="close-modal">&times;</span>
            </div>
            <div class="modal-body">
                <div class="order-item">
                    <strong>Khách hàng:</strong>
                    <span>${order.customer?.name || "N/A"}</span>
                </div>
                <div class="order-item">
                    <strong>Số điện thoại:</strong>
                    <span>${order.customer?.phone || "N/A"}</span>
                </div>
                <hr>
                <div class="order-item">
                    <strong>Sản phẩm:</strong>
                    <span>${order.product?.name}</span>
                </div>
                <div class="order-item">
                    <strong>Số lượng:</strong>
                    <span>${order.amount}</span>
                </div>
                <div class="order-item">
                    <strong>Đơn giá:</strong>
                    <span>${formatVND(order.product?.price)}</span>
                </div>
                <div class="order-item" style="font-size: 1.2rem;>
                    <strong>Tổng cộng:</strong>
                    <strong>${formatVND(order.product?.price * order.amount)}</strong>
                </div>
                <div class="order-item">
                    <strong>Trạng thái:</strong>
                    <span class="badge ${order.status}">${order.status}</span>
                </div>
                <div class="order-item">
                    <strong>Ngày đặt:</strong>
                    <span>${order.date}</span>
                </div>
            </div>
            <button class="view-btn">Đóng</button>
        </div>
    `;

    const closeModal = () => overlay.remove();
    overlay.querySelector(".close-modal").onclick = closeModal;
    overlay.querySelector(".view-btn").onclick = closeModal;

    overlay.onclick = (e) => {
        if (e.target === overlay) closeModal();
    };

    document.body.appendChild(overlay);
}

export function createActionButtons({
    id,
    currentObject,
    endpoint,
    onSuccess,
}) {
    const container = document.createElement("div");
    container.className = "action-buttons";
    const editBtn = document.createElement("button");
    editBtn.className = "btn-icon edit";
    editBtn.title = "Chỉnh sửa";
    editBtn.innerHTML = `<i class="fas fa-edit"></i>`;
    editBtn.onclick = () => (window.location.hash = `/${endpoint}/edit/${id}`);

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn-icon delete";
    deleteBtn.title = "Xóa";
    deleteBtn.innerHTML = `<i class="fas fa-trash"></i>`;
    deleteBtn.onclick = async () => {
        if (!confirm("Bạn có chắc muốn xóa?")) return;
        deleteBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        deleteBtn.style.pointerEvents = "none";
        if (endpoint === "orders") {
            if (currentObject?.product?.id) {
                const categoryId = currentObject?.product?.category?.id;
                const productName = currentObject?.product?.name;
                const productRemaining = currentObject?.product?.remaining;

                const payload = validateDataPayload.product(
                    categoryId,
                    productName,
                    {
                        ...currentObject?.product,
                        remaining: productRemaining + currentObject.amount,
                    },
                );
                await fetchData.update("products", payload);
            }
        }
        const res = await fetchData.delete(endpoint, id);
        if (res && onSuccess) await onSuccess();
    };

    const viewBtn = document.createElement("button");
    viewBtn.className = "btn-icon view";
    viewBtn.title = "Xem chi tiết";
    viewBtn.innerHTML = `<i class="fas fa-eye"></i>`;
    viewBtn.onclick = () => showOrderModal(currentObject);

    if (endpoint === "orders") {
        const updateBtn = document.createElement("button");
        const cancelBtn = document.createElement("button");
        if (
            currentObject?.status === "pending" ||
            currentObject?.status === "delivering"
        ) {
            updateBtn.className = "btn-icon update";
            updateBtn.title = "Xử lý";
            updateBtn.innerHTML = `<i class="fas fa-check"></i>`;
            updateBtn.onclick = async () => {
                if (!confirm("Bạn có muốn tăng tiến độ không?")) return;

                const nextStatus =
                    currentObject?.status === "pending" ? "delivering" : "done";

                updateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                updateBtn.style.pointerEvents = "none";

                const payload = validateDataPayload.order(
                    currentObject.product.id,
                    currentObject.customer.id,
                    {
                        ...currentObject,
                        status: nextStatus,
                    },
                );

                const res = await fetchData.update("orders", payload);
                if (res && onSuccess) await onSuccess();
            };

            cancelBtn.className = "btn-icon cancel";
            cancelBtn.title = "Hủy đơn";
            cancelBtn.innerHTML = `<i class="fas fa-times"></i>`;

            cancelBtn.onclick = async () => {
                if (!confirm("Bạn có chắc muốn hủy đơn không?")) return;

                const payload = validateDataPayload.order(
                    currentObject.product.id,
                    currentObject.customer.id,
                    {
                        ...currentObject,
                        status: "cancel",
                    },
                );
                const res = await fetchData.update("orders", payload);
                container.remove(editBtn);
                if (res && onSuccess) await onSuccess();
            };

            container.append(editBtn, updateBtn, cancelBtn);

            if (currentObject?.status === "delivering") {
                container.removeChild(editBtn);
            }
        } else {
            container.append(viewBtn, deleteBtn);
        }
    } else {
        container.append(editBtn, deleteBtn);
    }

    return container;
}

export function resetForm(formId) {
    const form = document.querySelector(formId);

    if (form.tagName !== "FORM") return;

    let title = "";

    if (formId === "#productForm") {
        title = "sản phẩm";
    } else if (formId === "#customerForm") {
        title = "khách hàng";
    } else if (formId === "#orderForm") {
        title = "đơn hàng";
    }

    alert(`Chúc mừng bạn đã tạo thành công ${title}`);

    const inputs = form.querySelectorAll("[name]");
    return inputs.forEach((input) => {
        input.value = "";
    });
}

export function getBestSellerAll(orders) {
    if (!orders || !Array.isArray(orders)) return [];

    const salesMap = orders
        .filter((order) => order.status === "done")
        .reduce((acc, order) => {
            const productId = order.product?.id;

            if (!productId) return acc;

            if (!acc[productId]) {
                acc[productId] = {
                    info: order.product,
                    totalSold: 0,
                };
            }

            acc[productId].totalSold += Number(order.amount) || 0;

            return acc;
        }, {});

    const sortedSales = Object.values(salesMap).sort(
        (a, b) => b.totalSold - a.totalSold,
    );

    return sortedSales;
}

export function getPrevPeriod(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = end.getTime() - start.getTime();

    const prevEnd = new Date(start.getTime() - 1);
    const prevStart = new Date(prevEnd.getTime() - diff);

    return {
        prevStart: formatDate(prevStart),
        prevEnd: formatDate(prevEnd),
    };
}

export function calcTrend(current, previous) {
    if (previous === 0) return { value: current > 0 ? 100 : 0, up: true };
    const percent = ((current - previous) / previous) * 100;
    return {
        value: Math.abs(Math.round(percent)),
        up: percent >= 0,
    };
}

export function calcMetrics(data, manualRate = 0.3) {
    return data.reduce(
        (acc, order) => {
            if (order.status === "done") {
                const price = Number(order.product.price) || 0;
                const amount = Number(order.amount) || 0;
                const importPrice = order.product.importPrice;
                const revenue = price * amount;

                let profit = 0;
                if (
                    importPrice !== undefined &&
                    importPrice !== null &&
                    importPrice !== 0
                ) {
                    profit = (price - Number(importPrice)) * amount;
                } else {
                    profit = revenue * manualRate;
                }

                acc.revenue += revenue;
                acc.profit += profit;
                acc.count += 1;
            }
            return acc;
        },
        { revenue: 0, profit: 0, count: 0 },
    );
}

export function calcNewCus(currentDate, startDate, orders) {
    const currentCus = currentDate.map((order) => order.customer?.id);

    const uniqueCus = currentCus.filter((id, index) => {
        return id && currentCus.indexOf(id) === index;
    });

    const newCus = uniqueCus.filter((cusId) => {
        const buyBefore = orders.some(
            (order) => order.customer?.id === cusId && order.date < startDate,
        );

        return !buyBefore;
    });

    return newCus.length;
}
