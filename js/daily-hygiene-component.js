// js/components/daily-hygiene-component.js

class DailyHygieneComponent extends BaseComponent {
    async initialize() {
        this.formId = 'dailyHygieneForm';
    }

    async render() {
        this.container.innerHTML = `
            <div class="fade-in">
                <div class="page-header mb-4">
                    <h2 class="page-title">
                        <i class="bi bi-droplet-half me-2"></i>
                        Đánh giá vệ sinh hàng ngày
                    </h2>
                    <p class="text-muted">Checklist vệ sinh khu vực sản xuất theo tiêu chuẩn.</p>
                </div>

                <div class="modern-card">
                    <form id="${this.formId}">
                        <div class="card-body">
                            <div class="form-section">
                                <h5 class="form-section-title"><i class="bi bi-calendar-check me-2"></i>Thông tin kiểm tra</h5>
                                <div class="row g-3">
                                    <div class="col-md-4">
                                        <label class="form-label">Site</label>
                                        <select class="modern-input modern-select" id="dhSite">
                                            <option value="MMB">MMB</option><option value="MSI">MSI</option>
                                        </select>
                                    </div>
                                    <div class="col-md-4">
                                        <label class="form-label">Khu vực</label>
                                        <input type="text" class="modern-input" id="dhKhuVuc" placeholder="VD: Khu vực trộn bột">
                                    </div>
                                    <div class="col-md-4">
                                        <label class="form-label">Line</label>
                                        <select class="modern-input modern-select" id="dhLine">
                                            <option value="L1">Line 1</option><option value="L2">Line 2</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="form-section">
                                <h5 class="form-section-title"><i class="bi bi-list-check me-2"></i>Hạng mục kiểm tra</h5>
                                ${this.renderChecklistItems()}
                            </div>
                        </div>

                        <div class="card-footer text-end">
                            <button type="submit" class="btn btn-modern btn-primary">
                                <i class="bi bi-check-circle me-2"></i>Hoàn tất & Lưu
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        this.attachEventListeners();
    }

    renderChecklistItems() {
        const items = [
            { id: 'sanNha', label: 'Sàn nhà, tường, trần' },
            { id: 'bangChuyen', label: 'Băng chuyền, máy móc' },
            { id: 'dungCu', label: 'Dụng cụ, khay nhựa' },
            { id: 'bhld', label: 'Tuân thủ BHLĐ' }
        ];

        return items.map(item => `
            <div class="checklist-item">
                <label for="${item.id}" class="form-check-label flex-grow-1">${item.label}</label>
                <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" role="switch" id="${item.id}" checked>
                    <label class="form-check-label" for="${item.id}"></label>
                </div>
            </div>
        `).join('');
    }

    attachEventListeners() {
        const form = this.$('#dailyHygieneForm');
        this.addEventListener(form, 'submit', (e) => this.handleSubmit(e));
    }

    handleSubmit(e) {
        e.preventDefault();
        const site = this.$('#dhSite').value;
        if (!site) {
            this.showToast('Lỗi', 'Vui lòng chọn Site.', 'error');
            return;
        }

        let storedData = JSON.parse(localStorage.getItem('qaDailyHygieneData') || '[]');
        storedData.push({ 
            id: `dh-${Date.now()}`, 
            timestamp: new Date().toISOString(),
            site: site
        });
        localStorage.setItem('qaDailyHygieneData', JSON.stringify(storedData));
        this.showToast('Thành công', 'Checklist vệ sinh đã được lưu.', 'success');
        this.render();
    }
}

componentLoader.register('daily-hygiene', DailyHygieneComponent);
