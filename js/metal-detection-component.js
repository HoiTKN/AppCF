// Metal Detection Component
class MetalDetectionComponent extends BaseComponent {
    async initialize() {
        this.state = {
            selectedLine: null,
            selectedFe15: null,
            selectedFe20: null,
            nguoiNhiemTu: 0.00
        };
    }

    async render() {
        const id = this.generateId();
        const currentDate = new Date().toISOString().split('T')[0];
        const currentTime = new Date().toTimeString().slice(0, 5);

        this.container.innerHTML = `
            <div class="fade-in">
                <!-- Page Header -->
                <div class="page-header mb-4">
                    <h2 class="page-title">
                        <i class="bi bi-shield-check me-2"></i>
                        Kiểm soát máy dò kim loại
                    </h2>
                    <p class="text-muted">Kiểm tra và ghi nhận kết quả máy dò kim loại</p>
                </div>

                <!-- Form Card -->
                <div class="modern-card">
                    <form id="metalDetectionForm">
                        <!-- Basic Information -->
                        <div class="card-body">
                            <div class="form-section">
                                <h5 class="form-section-title">
                                    <i class="bi bi-info-circle me-2"></i>
                                    Thông tin cơ bản
                                </h5>
                                
                                <div class="row g-3">
                                    <div class="col-md-6">
                                        <label class="form-label">ID</label>
                                        <input type="text" class="modern-input" id="mdId" 
                                               value="${id}" readonly style="background: var(--bg-tertiary);">
                                    </div>
                                    
                                    <div class="col-md-6">
                                        <label class="form-label">
                                            Site <span class="text-danger">*</span>
                                        </label>
                                        <select class="modern-input modern-select" id="mdSite" required>
                                            <option value="">Chọn site...</option>
                                            <option value="MMB">MMB</option>
                                            <option value="MSI">MSI</option>
                                            <option value="MHD">MHD</option>
                                            <option value="MHG">MHG</option>
                                        </select>
                                    </div>
                                    
                                    <div class="col-md-4">
                                        <label class="form-label">Mã nhân viên QA</label>
                                        <input type="text" class="modern-input" id="mdMaNhanVien" 
                                               placeholder="VD: 25MB03590">
                                    </div>
                                    
                                    <div class="col-md-4">
                                        <label class="form-label">Ngày sản xuất</label>
                                        <input type="date" class="modern-input" id="mdNgaySanXuat" 
                                               value="${currentDate}">
                                    </div>
                                    
                                    <div class="col-md-4">
                                        <label class="form-label">Giờ kiểm tra</label>
                                        <input type="time" class="modern-input" id="mdGioKiemTra" 
                                               value="${currentTime}">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Detection Settings -->
                        <div class="card-body border-top">
                            <div class="form-section">
                                <h5 class="form-section-title">
                                    <i class="bi bi-sliders me-2"></i>
                                    Cài đặt kiểm tra
                                </h5>
                                
                                <div class="row g-3 mb-3">
                                    <div class="col-md-6">
                                        <label class="form-label">Đơn vị qua máy dò</label>
                                        <div class="d-flex gap-3">
                                            <div class="form-check">
                                                <input class="form-check-input" type="radio" 
                                                       name="donViQuaMayDo" id="mdGoi" value="Gói">
                                                <label class="form-check-label" for="mdGoi">
                                                    📦 Gói
                                                </label>
                                            </div>
                                            <div class="form-check">
                                                <input class="form-check-input" type="radio" 
                                                       name="donViQuaMayDo" id="mdThung" value="Thùng">
                                                <label class="form-check-label" for="mdThung">
                                                    📦 Thùng
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="col-md-6">
                                        <label class="form-label">Người nhiễm từ cài đặt</label>
                                        <div class="input-group">
                                            <button class="btn btn-outline-secondary" type="button" 
                                                    id="decreaseBtn">
                                                <i class="bi bi-dash"></i>
                                            </button>
                                            <input type="number" class="form-control text-center" 
                                                   id="mdNguoiNhiemTu" value="0.00" step="0.01" readonly>
                                            <button class="btn btn-outline-secondary" type="button" 
                                                    id="increaseBtn">
                                                <i class="bi bi-plus"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <!-- Line Selection -->
                                <div class="mb-3">
                                    <label class="form-label">Chọn Line</label>
                                    <div class="selection-grid">
                                        ${[1,2,3,4,5,6,7,8,'Phở'].map(line => `
                                            <button type="button" class="grid-btn" data-line="${line}">
                                                ${line}
                                            </button>
                                        `).join('')}
                                    </div>
                                </div>

                                <div class="mb-3">
                                    <label class="form-label">Lý do thay đổi người cài đặt (nếu có)</label>
                                    <textarea class="modern-input" id="mdLyDoThayDoi" rows="2" 
                                              placeholder="Nhập lý do nếu có thay đổi..."></textarea>
                                </div>
                            </div>
                        </div>

                        <!-- Fe Standards Testing -->
                        <div class="card-body border-top">
                            <div class="form-section">
                                <h5 class="form-section-title">
                                    <i class="bi bi-magnet me-2"></i>
                                    Kiểm tra mẫu chuẩn Fe
                                </h5>
                                
                                <!-- Fe 1.5 -->
                                <div class="mb-3">
                                    <label class="form-label">
                                        <span class="badge bg-primary">Fe 1.5</span>
                                        Số mẫu máy dò bắt được
                                    </label>
                                    <div class="selection-grid">
                                        ${[1,2,3,4,5,6,7,8,9,10].map(num => `
                                            <button type="button" class="grid-btn" data-fe15="${num}">
                                                ${num}
                                            </button>
                                        `).join('')}
                                    </div>
                                </div>

                                <!-- Fe 2.0 -->
                                <div class="mb-3">
                                    <label class="form-label">
                                        <span class="badge bg-success">Fe 2.0</span>
                                        Số mẫu máy dò bắt được
                                    </label>
                                    <div class="selection-grid">
                                        ${[1,2,3,4,5,6,7,8,9,10].map(num => `
                                            <button type="button" class="grid-btn" data-fe20="${num}">
                                                ${num}
                                            </button>
                                        `).join('')}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div class="card-body border-top bg-light">
                            <div class="d-flex justify-content-end gap-2">
                                <button type="button" class="btn btn-modern btn-secondary" id="cancelBtn">
                                    <i class="bi bi-x-circle"></i>
                                    Hủy
                                </button>
                                <button type="submit" class="btn btn-modern btn-primary">
                                    <i class="bi bi-save"></i>
                                    Lưu dữ liệu
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        `;

        this.attachEventListeners();
    }

    attachEventListeners() {
        // Form submit
        const form = this.$('#metalDetectionForm');
        if (form) {
            this.addEventListener(form, 'submit', (e) => this.handleSubmit(e));
        }

        // Cancel button
        const cancelBtn = this.$('#cancelBtn');
        if (cancelBtn) {
            this.addEventListener(cancelBtn, 'click', () => this.handleCancel());
        }

        // Line selection
        this.$$('[data-line]').forEach(btn => {
            this.addEventListener(btn, 'click', (e) => {
                this.$$('[data-line]').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this.state.selectedLine = btn.dataset.line;
            });
        });

        // Fe 1.5 selection
        this.$$('[data-fe15]').forEach(btn => {
            this.addEventListener(btn, 'click', (e) => {
                this.$$('[data-fe15]').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this.state.selectedFe15 = btn.dataset.fe15;
            });
        });

        // Fe 2.0 selection
        this.$$('[data-fe20]').forEach(btn => {
            this.addEventListener(btn, 'click', (e) => {
                this.$$('[data-fe20]').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this.state.selectedFe20 = btn.dataset.fe20;
            });
        });

        // Number input controls
        const decreaseBtn = this.$('#decreaseBtn');
        const increaseBtn = this.$('#increaseBtn');
        const numberInput = this.$('#mdNguoiNhiemTu');

        if (decreaseBtn) {
            this.addEventListener(decreaseBtn, 'click', () => {
                let value = parseFloat(numberInput.value) || 0;
                value = Math.max(0, value - 0.01);
                numberInput.value = value.toFixed(2);
                this.state.nguoiNhiemTu = value;
            });
        }

        if (increaseBtn) {
            this.addEventListener(increaseBtn, 'click', () => {
                let value = parseFloat(numberInput.value) || 0;
                value = value + 0.01;
                numberInput.value = value.toFixed(2);
                this.state.nguoiNhiemTu = value;
            });
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        // Validate
        if (!this.$('#mdSite').value) {
            this.showToast('Lỗi', 'Vui lòng chọn Site', 'error');
            return;
        }

        if (!this.state.selectedLine) {
            this.showToast('Lỗi', 'Vui lòng chọn Line', 'error');
            return;
        }

        // Collect data
        const formData = {
            id: this.$('#mdId').value,
            timestamp: new Date().toISOString(),
            site: this.$('#mdSite').value,
            maNhanVien: this.$('#mdMaNhanVien').value,
            ngaySanXuat: this.$('#mdNgaySanXuat').value,
            gioKiemTra: this.$('#mdGioKiemTra').value,
            donViQuaMayDo: document.querySelector('input[name="donViQuaMayDo"]:checked')?.value || '',
            line: this.state.selectedLine,
            nguoiNhiemTu: this.state.nguoiNhiemTu,
            lyDoThayDoi: this.$('#mdLyDoThayDoi').value,
            fe15: this.state.selectedFe15,
            fe20: this.state.selectedFe20
        };

        // Save to localStorage
        let metalData = JSON.parse(localStorage.getItem('qaMetalDetectionData') || '[]');
        metalData.push(formData);
        localStorage.setItem('qaMetalDetectionData', JSON.stringify(metalData));

        this.showToast('Thành công', 'Dữ liệu đã được lưu!', 'success');
        
        // Reset form
        this.resetForm();
    }

    handleCancel() {
        if (confirm('Bạn có chắc muốn hủy và xóa dữ liệu đã nhập?')) {
            this.resetForm();
        }
    }

    resetForm() {
        const form = this.$('#metalDetectionForm');
        if (form) {
            form.reset();
        }
        
        // Clear selections
        this.$$('.grid-btn.selected').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // Reset state
        this.state = {
            selectedLine: null,
            selectedFe15: null,
            selectedFe20: null,
            nguoiNhiemTu: 0.00
        };
        
        // Reset values
        this.$('#mdNguoiNhiemTu').value = '0.00';
        
        // Generate new ID and set current date/time
        this.$('#mdId').value = this.generateId();
        this.$('#mdNgaySanXuat').value = new Date().toISOString().split('T')[0];
        this.$('#mdGioKiemTra').value = new Date().toTimeString().slice(0, 5);
    }

    generateId() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 8);
        return `MD-${timestamp}-${random}`;
    }
}

// Register component
componentLoader.register('metal-detection', MetalDetectionComponent);
