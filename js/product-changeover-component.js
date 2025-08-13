// js/components/product-changeover-component.js

class ProductChangeoverComponent extends BaseComponent {
    async render() {
        this.container.innerHTML = `
            <div class="fade-in">
                <div class="page-header mb-4">
                    <h2 class="page-title">
                        <i class="bi bi-arrow-repeat me-2"></i>
                        Checklist chuyển đổi sản phẩm
                    </h2>
                    <p class="text-muted">Ghi nhận các bước khi chuyển đổi sản phẩm</p>
                </div>

                <div class="modern-card">
                    <form id="productChangeoverForm">
                        <div class="card-body">
                           <div class="form-section">
                                <h5 class="form-section-title">Thông tin chuyển đổi</h5>
                                <div class="row g-3">
                                    <div class="col-md-6">
                                        <label class="form-label">Sản phẩm cũ</label>
                                        <input type="text" class="modern-input" placeholder="VD: Mì tôm chua cay">
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label">Sản phẩm mới</label>
                                        <input type="text" class="modern-input" placeholder="VD: Mì gà nấm hương">
                                    </div>
                                </div>
                           </div>
                           <div class="form-section">
                                <h5 class="form-section-title">Checklist</h5>
                                ${this.renderChecklistItems()}
                           </div>
                        </div>
                        <div class="card-body border-top bg-light">
                            <button type="submit" class="btn btn-modern btn-primary">Xác nhận chuyển đổi</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        this.attachEventListeners();
    }

    renderChecklistItems() {
        const items = ['Vệ sinh máy trộn', 'Vệ sinh máy cán', 'Thay đổi gia vị', 'Kiểm tra bao bì'];
        return items.map((item, index) => `
            <div class="form-check form-check-lg mb-2">
                <input class="form-check-input" type="checkbox" value="" id="changeoverCheck${index}">
                <label class="form-check-label" for="changeoverCheck${index}">${item}</label>
            </div>
        `).join('');
    }

    attachEventListeners() {
        const form = this.$('#productChangeoverForm');
        this.addEventListener(form, 'submit', (e) => {
            e.preventDefault();
            let storedData = JSON.parse(localStorage.getItem('qaProductChangeoverData') || '[]');
            storedData.push({ id: `pc-${Date.now()}`, timestamp: new Date().toISOString() });
            localStorage.setItem('qaProductChangeoverData', JSON.stringify(storedData));
            this.showToast('Thành công', 'Checklist chuyển đổi đã được lưu.', 'success');
        });
    }
}

componentLoader.register('product-changeover', ProductChangeoverComponent);
