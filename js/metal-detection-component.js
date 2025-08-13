// js/components/metal-detection-component.js

class MetalDetectionComponent extends BaseComponent {
    async initialize() {
        this.selectedValues = {};
        this.formId = 'metalDetectionForm';
    }

    async render() {
        this.container.innerHTML = this.getTemplate();
        this.attachEventListeners();
        this.setCurrentDateTime();
        this.generateId();
    }

    getTemplate() {
        const gridOptions = [
            { id: 'line', title: 'Line', values: ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8'] },
            { id: 'fe15', title: 'Fe 1.5mm', values: ['1', '2', '3', '4', '5', '6'] },
            { id: 'inox20', title: 'Inox 2.0mm', values: ['1', '2', '3', '4', '5', '6'] },
            { id: 'metal25', title: 'Kim loại màu 2.5mm', values: ['1', '2', '3', '4', '5', '6'] }
        ];

        return `
            <div class="fade-in">
                <div class="page-header mb-4">
                    <h2 class="page-title">
                        <i class="bi bi-shield-check me-2"></i>
                        Kiểm soát máy dò kim loại
                    </h2>
                    <p class="text-muted">Ghi nhận kết quả kiểm tra máy dò kim loại chi tiết.</p>
                </div>

                <div class="modern-card">
                    <form id="${this.formId}">
                        <input type="hidden" id="mdId">

                        <div class="card-body">
                            <div class="form-section">
                                <h5 class="form-section-title"><i class="bi bi-info-circle me-2"></i>Thông tin chung</h5>
                                <div class="row g-3">
                                    <div class="col-md-3">
                                        <label class="form-label">Site <span class="text-danger">*</span></label>
                                        <select class="modern-input modern-select" id="mdSite" required>
                                            <option value="MMB">MMB</option><option value="MSI">MSI</option><option value="MHD">MHD</option><option value="MHG">MHG</option>
                                        </select>
                                    </div>
                                    <div class="col-md-3">
                                        <label class="form-label">Ngày sản xuất</label>
                                        <input type="date" class="modern-input" id="mdNgaySanXuat">
                                    </div>
                                    <div class="col-md-3">
                                        <label class="form-label">Giờ kiểm tra</label>
                                        <input type="time" class="modern-input" id="mdGioKiemTra">
                                    </div>
                                     <div class="col-md-3">
                                        <label class="form-label">Mã nhân viên</label>
                                        <input type="text" class="modern-input" id="mdMaNhanVien" placeholder="VD: QA001">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="card-body border-top">
                           <div class="form-section">
                                <h5 class="form-section-title"><i class="bi bi-grid-3x3-gap me-2"></i>Lựa chọn kiểm tra</h5>
                                ${gridOptions.map(grid => this.renderGrid(grid.id, grid.title, grid.values)).join('')}
                           </div>
                        </div>
                        
                        <div class="card-body border-top">
                           <div class="form-section">
                                <h5 class="form-section-title"><i class="bi bi-clipboard2-check me-2"></i>Kết quả & Ghi chú</h5>
                                <div class="row g-3">
                                     <div class="col-md-6">
                                        <label class="form-label">Kết luận Test</label>
                                        <div class="d-flex gap-3 pt-2">
                                            <div class="form-check form-check-inline">
                                                <input class="form-check-input" type="radio" name="ketLuanTest" id="ketLuanDat" value="Đạt" checked>
                                                <label class="form-check-label" for="ketLuanDat">✅ Đạt</label>
                                            </div>
                                            <div class="form-check form-check-inline">
                                                <input class="form-check-input" type="radio" name="ketLuanTest" id="ketLuanKhongDat" value="Không đạt">
                                                <label class="form-check-label" for="ketLuanKhongDat">❌ Không đạt</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label">Mô tả kim loại (nếu có)</label>
                                        <input type="text" class="modern-input" id="mdMoTaKimLoai">
                                    </div>
                                </div>
                           </div>
                        </div>

                        <div class="card-footer text-end">
                            <button type="button" class="btn btn-modern btn-outline me-2" id="mdCancelBtn">Hủy</button>
                            <button type="submit" class="btn btn-modern btn-primary">
                                <i class="bi bi-save me-2"></i>Lưu kết quả
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }

    renderGrid(id, title, values) {
        return `
            <div class="mb-4">
                <label class="form-label fw-semibold">${title}</label>
                <div class="selection-grid" id="${id}Grid">
                    ${values.map(val => `<button class="grid-btn" data-value="${val}">${val}</button>`).join('')}
                </div>
                <input type="hidden" id="md${id.charAt(0).toUpperCase() + id.slice(1)}">
            </div>
        `;
    }

    attachEventListeners() {
        const form = this.$(`#${this.formId}`);
        if (form) {
            this.addEventListener(form, 'submit', (e) => this.handleSubmit(e));
        }

        const cancelBtn = this.$('#mdCancelBtn');
        if(cancelBtn) {
            this.addEventListener(cancelBtn, 'click', () => this.render());
        }

        this.$$('.grid-btn').forEach(btn => {
            this.addEventListener(btn, 'click', (e) => {
                e.preventDefault();
                const grid = e.target.closest('.selection-grid');
                this.handleGridSelection(grid.id, e.target);
            });
        });
    }

    handleGridSelection(gridId, selectedBtn) {
        const grid = this.$(`#${gridId}`);
        grid.querySelectorAll('.grid-btn').forEach(btn => btn.classList.remove('selected'));
        selectedBtn.classList.add('selected');
        
        const inputId = `md${gridId.replace('Grid', '').charAt(0).toUpperCase() + gridId.slice(1).replace('Grid', '')}`;
        const inputElement = this.$(`#${inputId}`);
        if (inputElement) {
            inputElement.value = selectedBtn.dataset.value;
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        const formData = this.collectFormData();
        
        // Basic validation
        if (!formData.site || !formData.line) {
            this.showToast('Lỗi', 'Vui lòng chọn Site và Line.', 'error');
            return;
        }

        let storedData = JSON.parse(localStorage.getItem('qaMetalDetectionData') || '[]');
        storedData.push(formData);
        localStorage.setItem('qaMetalDetectionData', JSON.stringify(storedData));

        this.showToast('Thành công', 'Dữ liệu máy dò kim loại đã được lưu.', 'success');
        this.render(); // Re-render to reset form
    }

    collectFormData() {
        const getValue = (id) => this.$(id)?.value || '';
        const getRadio = (name) => this.$(`input[name="${name}"]:checked`)?.value || '';

        return {
            id: getValue('#mdId'),
            timestamp: new Date().toISOString(),
            formType: 'metal-detection',
            site: getValue('#mdSite'),
            ngaySanXuat: getValue('#mdNgaySanXuat'),
            gioKiemTra: getValue('#mdGioKiemTra'),
            maNhanVien: getValue('#mdMaNhanVien'),
            line: getValue('#mdLine'),
            fe15: getValue('#mdFe15'),
            inox20: getValue('#mdInox20'),
            metal25: getValue('#mdMetal25'),
            ketLuanTest: getRadio('ketLuanTest'),
            moTaKimLoai: getValue('#mdMoTaKimLoai'),
        };
    }
    
    generateId() {
        const idField = this.$('#mdId');
        if (idField) {
            idField.value = `md-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 8)}`;
        }
    }

    setCurrentDateTime() {
        const now = new Date();
        const dateField = this.$('#mdNgaySanXuat');
        if (dateField) {
            dateField.value = now.toISOString().split('T')[0];
        }
        const timeField = this.$('#mdGioKiemTra');
        if (timeField) {
            timeField.value = now.toTimeString().slice(0,5);
        }
    }
}

componentLoader.register('metal-detection', MetalDetectionComponent);
