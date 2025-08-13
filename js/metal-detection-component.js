// js/components/daily-hygiene-component.js

class DailyHygieneComponent extends BaseComponent {
    async render() {
        this.container.innerHTML = `
            <div class="fade-in">
                <div class="page-header mb-4">
                    <h2 class="page-title">
                        <i class="bi bi-droplet-half me-2"></i>
                        Đánh giá vệ sinh hàng ngày
                    </h2>
                     <p class="text-muted">Checklist vệ sinh khu vực sản xuất</p>
                </div>

                <div class="modern-card">
                    <form id="dailyHygieneForm">
                        <div class="card-body">
                            ${this.renderChecklistItems()}
                        </div>
                        <div class="card-body border-top bg-light">
                            <button type="submit" class="btn btn-modern btn-primary w-100">Hoàn tất & Lưu</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        this.attachEventListeners();
    }

    renderChecklistItems() {
        const items = [
            'Sàn nhà, tường, trần',
            'Băng chuyền, máy móc',
            'Dụng cụ, khay nhựa',
            'Tuân thủ BHLĐ',
        ];
        return items.map((item, index) => `
            <div class="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
                <span class="fw-semibold">${item}</span>
                <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" role="switch" id="hygieneCheck${index}">
                    <label class="form-check-label" for="hygieneCheck${index}">Đạt</label>
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
        let storedData = JSON.parse(localStorage.getItem('qaDailyHygieneData') || '[]');
        storedData.push({ id: `dh-${Date.now()}`, timestamp: new Date().toISOString() });
        localStorage.setItem('qaDailyHygieneData', JSON.stringify(storedData));
        this.showToast('Thành công', 'Checklist vệ sinh đã được lưu.', 'success');
    }
}

componentLoader.register('daily-hygiene', DailyHygieneComponent);
