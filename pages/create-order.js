import { fetchData } from "../apis/api.js";

export async function createOrder() {
    const products = await fetchData.get("products");

    const customers = await fetchData.get("customers");

    const container = document.createElement("div");

    container.innerHTML = `<div class="header-actions">
            <a href="#/orders" class="btn-back">
                <i class="fas fa-arrow-left"></i> Quay lại order
            </a>
             <h1>create order</h1>
        </div>
         <form id="customerForm">
            <div class="form form-one-col" >
                <div class="card">
                    <div class="form-group">
                        <label>Khách hàng</label>
                        <select name="customerId">
                            <option value="">Chọn khách hàng</option>
                            ${customers
                                .map((customer) => {
                                    return `<option value="${customer.id}">${customer.name}</option>`;
                                })
                                .join("")}
                        </select>
                    </div>
    
                    <div class="form-group">
                        <label> Sản phẩm </label>
                         <select name="productId">
                            <option value="">Chọn sản phẩm</option>
                            ${products
                                .map((product) => {
                                    return `<option value="${product.id}">${product.name}</option>`;
                                })
                                .join("")}
                        </select>
                    </div>
    
                    <div class="form-group">
                        <label>Số lượng</label>
                         <input name="amount" type="number" />
                    </div>
                </div>
            </div>

            <div class="form-footer">
                <button type="reset" class="btn btn-cancel">Hủy bỏ</button>
                <button type="submit" class="btn btn-save">Lưu đơn hàng</button>
            </div>
        </form>
    `;

    const form = container.querySelector("#customerForm");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = Object.fromEntries(new FormData(form).entries());
        formData.customerId = Number(formData.customerId);
        formData.productId = Number(formData.productId);
        formData.amount = Number(formData.amount);

        if (isNaN(formData.customerId) || formData.customerId <= 0) {
            alert("Khách hàng không hợp lệ");
            return;
        }
        if (isNaN(formData.productId) || formData.productId <= 0) {
            alert("Sản phẩm không hợp lệ");
            return;
        }
        if (Number(formData.amount) <= 0 || formData.amount <= 0) {
            alert("Số lượng không hợp lệ");
            return;
        }

        const isPostOrder = confirm(`
            Bạn có muốn tạo đơn hàng này không? 
            Khách hàng: ${customers.find((c) => c.id === Number(formData.customerId))?.name}
            Sản phẩm: ${products.find((p) => p.id === Number(formData.productId))?.name}
            `);
        if (isPostOrder) {
            const res = await fetchData.create("orders", { ...formData, status: "pending" });
            if (res.status === "pending") {
                alert("tạo đơn hàng thành công");
            }
            form.reset();
        }
        return;
    });

    return container;
}
