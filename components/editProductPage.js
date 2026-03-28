/*
respone product by id
{
  "id": 1,
  "category": {
    "id": 1,
    "name": "string"
  },
  "imageUrl": "string",
  "name": "string",
  "sku": "string",
  "price": 1,
  "remaining": 1
}
*/
export function editProductPage(productId) {
  let select = `
   <select name="cater">
    <option value="0">Điện thoại</option>
    <option value="1">Máy tính bảng</option>
    <option value="2">Phụ kiện</option>
  </select>`;

  let product = {
    id: 1,
    category: {
      id: 1,
      name: "string",
    },
    imageUrl: "string",
    name: "string",
    sku: "string",
    price: 1,
    remaining: 1,
  };

  const editProduct = document.createElement("div");

  editProduct.innerHTML = `  
    <div class="header-actions">
      <a href="#" class="btn-back">
        <i class="fas fa-arrow-left"></i> Quay lại danh sách
      </a>
      <h2>Chỉnh sửa sản phẩm</h2>
    </div>

    <form id="productForm">        
      <div class="product-grid">
        <div class="left-col">
          <div class="card">
            <h3>Thông tin chung</h3>
            <div class="form-group">
              <label>Tên sản phẩm</label>
              <input
                type="text"
                placeholder="Nhập tên Product"
                value="${product.name}"
                name="name"
              />
            </div>
            <div class="form-group">
              <label>Mô tả sản phẩm</label>
              <textarea rows="5" placeholder="Nhập đặc điểm nổi bật..." name="description">Chưa có trên server</textarea>
            </div>
          </div>

          <div class="card">
            <h3>Giá cả & Kho hàng</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
              <div class="form-group">
                <label>Giá bán (VNĐ)</label>
                <input type="number" value="${product.price}" name="price" />
              </div>
              <div class="form-group">
                <label>Giá vốn (VNĐ)</label>
                <input type="text" value="chưa có dữ liệu trên server" />
              </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
              <div class="form-group">
                <label>Mã SKU</label>
                <input type="text" value="${product.sku}" name="sku"/>
              </div>
              <div class="form-group">
                <label>Số lượng tồn kho</label>
                <input type="number" value="${product.remaining}" name="remaining" />
              </div>
            </div>
          </div>
        </div>

        <div class="right-col">
          <div class="card">
            <h3>Hình ảnh sản phẩm</h3>
            <div class="image-upload">
              <i class="fas fa-cloud-upload-alt"></i>
              <p>Nhấp để tải ảnh lên</p>
              <input type="file" id="fileInput" hidden />
              <img id="imgPreview" class="preview-img" src="#" alt="Preview" />
            </div>
          </div>

          <div class="card">
            <h3>Phân loại</h3>
            <div class="form-group">
              <label>Danh mục</label>
              ${select}
            </div>
            <div class="form-group">
              <label>Trạng thái</label>
              <select name="status">
                <option>Đang bán</option>
                <option>Ngừng kinh doanh</option>
                <option>Hết hàng</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div class="form-footer">
        <button type="button" class="btn btn-cancel">Hủy bỏ</button>
        <button type="submit" class="btn btn-save">Lưu thay đổi</button>
      </div>
    </form>
  `;

  const form = editProduct.querySelector("#productForm");
  const btnCancel = editProduct.querySelector(".btn-cancel");
  const btnBack = editProduct.querySelector(".btn-back");

  btnCancel.addEventListener("click", () => {
    console.log("Hủy bỏ");
  });

  btnBack.addEventListener("click", (e) => {
    e.preventDefault();
    console.log("Quay lại danh sách");
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const updatedProduct = {
      name: formData.get("name"),
      price: Number(formData.get("price")),
      sku: formData.get("sku"),
      remaining: Number(formData.get("remaining")),
      status: formData.get("status"),
    };

    console.log("Dữ liệu submit:", updatedProduct);
  });

  return editProduct;
}
