// js/pho-technology-component.js - Data Công nghệ phở Component
class PhoTechnologyComponent extends BaseComponent {
    async initialize() {
        this.formData = {};
    }

    async render() {
        const id = this.generateId();
        const currentDate = new Date().toISOString().split('T')[0];
        const currentTime = new Date().toTimeString().slice(0, 8);

        this.container.innerHTML = `
            <div class="fade-in">
                <!-- Page Header -->
                <div class="page-header mb-4">
                    <h2 class="page-title">
                        <i class="bi bi-clipboard-data me-2"></i>
                        Data công nghệ phở
                    </h2>
                    <p class="text-muted">Nhập thông tin kiểm tra quá trình sản xuất phở</p>
                </div>

                <!-- Form Card -->
                <div class="modern-card">
                    <form id="phoTechnologyForm">
                        <!-- Basic Information Section -->
                        <div class="card-body">
                            <div class="form-section">
                                <h5 class="form-section-title">
                                    <i class="bi bi-info-circle me-2"></i>
                                    Thông tin cơ bản
                                </h5>
                                
                                <div class="row g-3">
                                    <div class="col-md-6">
                                        <label class="form-label">ID</label>
                                        <input type="text" class="modern-input" id="phoId" 
                                               value="${id}" readonly style="background: var(--bg-tertiary);">
                                    </div>
                                    
                                    <div class="col-md-6">
                                        <label class="form-label">
                                            Site <span class="text-danger">*</span>
                                        </label>
                                        <select class="modern-input modern-select" id="phoSite" required>
                                            <option value="">Chọn site...</option>
                                            <option value="MMB">MMB</option>
                                            <option value="MSI">MSI</option>
                                            <option value="MHG">MHG</option>
                                        </select>
                                    </div>
                                    
                                    <div class="col-md-4">
                                        <label class="form-label">Mã nhân viên QA</label>
                                        <input type="text" class="modern-input" id="phoMaNhanVien" 
                                               placeholder="VD: 25MB03590">
                                    </div>
                                    
                                    <div class="col-md-4">
                                        <label class="form-label">NSX (Ngày sản xuất)</label>
                                        <input type="date" class="modern-input" id="phoNSX" 
                                               value="${currentDate}">
                                    </div>
                                    
                                    <div class="col-md-4">
                                        <label class="form-label">Giờ kiểm tra</label>
                                        <input type="time" class="modern-input" id="phoGioKiemTra" 
                                               value="${currentTime}" step="1">
                                    </div>
                                    
                                    <div class="col-md-6">
                                        <label class="form-label">Line SX</label>
                                        <div class="selection-grid">
                                            ${[1,2,3,4].map(i => `
                                                <button type="button" class="grid-btn" data-pholine="${i}">
                                                    ${i}
                                                </button>
                                            `).join('')}
                                        </div>
                                    </div>
                                    
                                    <div class="col-md-6">
                                        <label class="form-label">Sản phẩm</label>
                                        <div class="selection-grid">
                                            <button type="button" class="grid-btn" data-product="Phở Story">
                                                Phở Story
                                            </button>
                                            <button type="button" class="grid-btn" data-product="Phở Story có thịt">
                                                Phở Story có thịt
                                            </button>
                                            <button type="button" class="grid-btn" data-product="Phở Chinsu">
                                                Phở Chinsu
                                            </button>
                                            <button type="button" class="grid-btn" data-product="Bánh phở khô">
                                                Bánh phở khô
                                            </button>
                                            <button type="button" class="grid-btn" data-product="Hủ tiếu">
                                                Hủ tiếu
                                            </button>
                                            <button type="button" class="grid-btn" data-product="Bánh Cuốn">
                                                Bánh Cuốn
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Kansui Parameters -->
                        <div class="card-body border-top">
                            <div class="form-section">
                                <h5 class="form-section-title">
                                    <i class="bi bi-droplet me-2"></i>
                                    Thông số Kansui
                                </h5>
                                
                                <div class="row g-3">
                                    <div class="col-md-6">
                                        <label class="form-label">Baume Kansui</label>
                                        <div class="input-group">
                                            <button class="btn btn-outline-secondary" type="button" 
                                                    onclick="adjustPhoNumber('phoBaumeKansui', -0.01)">
                                                <i class="bi bi-dash"></i>
                                            </button>
                                            <input type="number" class="form-control text-center" 
                                                   id="phoBaumeKansui" value="0.00" step="0.01" min="0">
                                            <button class="btn btn-outline-secondary" type="button" 
                                                    onclick="adjustPhoNumber('phoBaumeKansui', 0.01)">
                                                <i class="bi bi-plus"></i>
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div class="col-md-6">
                                        <label class="form-label">Ngoại quan Kansui</label>
                                        <div class="d-flex gap-3">
                                            <button type="button" class="btn btn-outline-success flex-fill ngoai-quan-btn" 
                                                    data-field="phoNgoaiQuanKansui" data-value="Đạt">
                                                <i class="bi bi-check-circle me-2"></i>
                                                Đạt
                                            </button>
                                            <button type="button" class="btn btn-outline-danger flex-fill ngoai-quan-btn" 
                                                    data-field="phoNgoaiQuanKansui" data-value="Không đạt">
                                                <i class="bi bi-x-circle me-2"></i>
                                                Không đạt
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Baume dịch trắng -->
                        <div class="card-body border-top">
                            <div class="form-section">
                                <h5 class="form-section-title">
                                    <i class="bi bi-droplet-half me-2"></i>
                                    Baume dịch trắng
                                </h5>
                                
                                <div class="row g-3">
                                    <div class="col-md-6">
                                        <label class="form-label">Baume dịch trắng</label>
                                        <div class="input-group">
                                            <button class="btn btn-outline-secondary" type="button" 
                                                    onclick="adjustPhoNumber('phoBaumeDichTrang', -0.01)">
                                                <i class="bi bi-dash"></i>
                                            </button>
                                            <input type="number" class="form-control text-center" 
                                                   id="phoBaumeDichTrang" value="0.00" step="0.01" min="0">
                                            <button class="btn btn-outline-secondary" type="button" 
                                                    onclick="adjustPhoNumber('phoBaumeDichTrang', 0.01)">
                                                <i class="bi bi-plus"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Độ dày tấm phở -->
                        <div class="card-body border-top">
                            <div class="form-section">
                                <h5 class="form-section-title">
                                    <i class="bi bi-rulers me-2"></i>
                                    Độ dày tấm phở hàng (mm)
                                </h5>
                                
                                <div class="row g-3">
                                    <div class="col-md-4">
                                        <label class="form-label">Độ dày tấm phở hàng trái</label>
                                        <div class="input-group">
                                            <button class="btn btn-outline-secondary" type="button" 
                                                    onclick="adjustPhoNumber('phoDoDayTrai', -0.01)">
                                                <i class="bi bi-dash"></i>
                                            </button>
                                            <input type="number" class="form-control text-center" 
                                                   id="phoDoDayTrai" value="0.00" step="0.01" min="0">
                                            <button class="btn btn-outline-secondary" type="button" 
                                                    onclick="adjustPhoNumber('phoDoDayTrai', 0.01)">
                                                <i class="bi bi-plus"></i>
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div class="col-md-4">
                                        <label class="form-label">Độ dày tấm phở hàng giữa</label>
                                        <div class="input-group">
                                            <button class="btn btn-outline-secondary" type="button" 
                                                    onclick="adjustPhoNumber('phoDoDayGiua', -0.01)">
                                                <i class="bi bi-dash"></i>
                                            </button>
                                            <input type="number" class="form-control text-center" 
                                                   id="phoDoDayGiua" value="0.00" step="0.01" min="0">
                                            <button class="btn btn-outline-secondary" type="button" 
                                                    onclick="adjustPhoNumber('phoDoDayGiua', 0.01)">
                                                <i class="bi bi-plus"></i>
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div class="col-md-4">
                                        <label class="form-label">Độ dày tấm phở hàng phải</label>
                                        <div class="input-group">
                                            <button class="btn btn-outline-secondary" type="button" 
                                                    onclick="adjustPhoNumber('phoDoDayPhai', -0.01)">
                                                <i class="bi bi-dash"></i>
                                            </button>
                                            <input type="number" class="form-control text-center" 
                                                   id="phoDoDayPhai" value="0.00" step="0.01" min="0">
                                            <button class="btn btn-outline-secondary" type="button" 
                                                    onclick="adjustPhoNumber('phoDoDayPhai', 0.01)">
                                                <i class="bi bi-plus"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Ngoại quan tấm phở sau hấp -->
                        <div class="card-body border-top">
                            <div class="form-section">
                                <h5 class="form-section-title">
                                    <i class="bi bi-steam me-2"></i>
                                    Ngoại quan tấm phở sau hấp
                                </h5>
                                
                                <div class="row g-3">
                                    <div class="col-md-6">
                                        <label class="form-label">Ngoại quan tấm phở sau hấp</label>
                                        <div class="d-flex gap-3">
                                            <button type="button" class="btn btn-outline-success flex-fill ngoai-quan-btn" 
                                                    data-field="phoNgoaiQuanTamPhoSauHap" data-value="Đạt">
                                                <i class="bi bi-check-circle me-2"></i>
                                                Đạt
                                            </button>
                                            <button type="button" class="btn btn-outline-danger flex-fill ngoai-quan-btn" 
                                                    data-field="phoNgoaiQuanTamPhoSauHap" data-value="Không đạt">
                                                <i class="bi bi-x-circle me-2"></i>
                                                Không đạt
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Độ ẩm vật sau sấy -->
                        <div class="card-body border-top">
                            <div class="form-section">
                                <h5 class="form-section-title">
                                    <i class="bi bi-moisture me-2"></i>
                                    Độ ẩm vật sau sấy
                                </h5>
                                
                                <div class="row g-3">
                                    <div class="col-md-6">
                                        <label class="form-label">Độ ẩm vật sau sấy (%)</label>
                                        <div class="input-group">
                                            <button class="btn btn-outline-secondary" type="button" 
                                                    onclick="adjustPhoNumber('phoDoAmVatSauSay', -0.01)">
                                                <i class="bi bi-dash"></i>
                                            </button>
                                            <input type="number" class="form-control text-center" 
                                                   id="phoDoAmVatSauSay" value="0.00" step="0.01" min="0">
                                            <button class="btn btn-outline-secondary" type="button" 
                                                    onclick="adjustPhoNumber('phoDoAmVatSauSay', 0.01)">
                                                <i class="bi bi-plus"></i>
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div class="col-md-6">
                                        <label class="form-label">Ngoại quan vật sau sấy</label>
                                        <div class="d-flex gap-3">
                                            <button type="button" class="btn btn-outline-success flex-fill ngoai-quan-btn" 
                                                    data-field="phoNgoaiQuanVatSauSay" data-value="Đạt">
                                                <i class="bi bi-check-circle me-2"></i>
                                                Đạt
                                            </button>
                                            <button type="button" class="btn btn-outline-danger flex-fill ngoai-quan-btn" 
                                                    data-field="phoNgoaiQuanVatSauSay" data-value="Không đạt">
                                                <i class="bi bi-x-circle me-2"></i>
                                                Không đạt
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Sensory Evaluation -->
                        <div class="card-body border-top">
                            <div class="form-section">
                                <h5 class="form-section-title">
                                    <i class="bi bi-star me-2"></i>
                                    Cảm quan sợi
                                </h5>
                                
                                <div class="row g-3">
                                    <div class="col-md-3">
                                        <label class="form-label">Cảm quan sợi (có tính)</label>
                                        <div class="selection-grid">
                                            ${[9.0, 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8].map(val => `
                                                <button type="button" class="grid-btn" data-camquan-cotinh="${val}">
                                                    ${val}
                                                </button>
                                            `).join('')}
                                        </div>
                                    </div>
                                    
                                    <div class="col-md-3">
                                        <label class="form-label">Cảm quan sợi (màu)</label>
                                        <div class="selection-grid">
                                            ${[9.0, 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8].map(val => `
                                                <button type="button" class="grid-btn" data-camquan-mau="${val}">
                                                    ${val}
                                                </button>
                                            `).join('')}
                                        </div>
                                    </div>
                                    
                                    <div class="col-md-3">
                                        <label class="form-label">Cảm quan sợi (mùi)</label>
                                        <div class="selection-grid">
                                            ${[9.0, 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8].map(val => `
                                                <button type="button" class="grid-btn" data-camquan-mui="${val}">
                                                    ${val}
                                                </button>
                                            `).join('')}
                                        </div>
                                    </div>
                                    
                                    <div class="col-md-3">
                                        <label class="form-label">Cảm quan sợi (vị)</label>
                                        <div class="selection-grid">
                                            ${[9.0, 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8].map(val => `
                                                <button type="button" class="grid-btn" data-camquan-vi="${val}">
                                                    ${val}
                                                </button>
                                            `).join('')}
                                        </div>
                                    </div>
                                    
                                    <div class="col-12">
                                        <label class="form-label">Mô tả CQ nếu không đạt</label>
                                        <textarea class="modern-input" id="phoMoTaCQ" rows="3" 
                                                  placeholder="Mô tả chi tiết nếu cảm quan không đạt..."></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div class="card-body border-top bg-light">
                            <div class="d-flex justify-content-end gap-2">
                                <button type="button" class="btn btn-modern btn-secondary" id="phoResetBtn">
                                    <i class="bi bi-arrow-clockwise"></i>
                                    Làm mới
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
        const form = this.$('#phoTechnologyForm');
        if (form) {
            this.addEventListener(form, 'submit', (e) => this.handleSubmit(e));
        }

        // Reset button
        const resetBtn = this.$('#phoResetBtn');
        if (resetBtn) {
            this.addEventListener(resetBtn, 'click', () => this.resetForm());
        }

        // Line selection
        this.$$('[data-pholine]').forEach(btn => {
            this.addEventListener(btn, 'click', () => {
                this.$$('[data-pholine]').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this.state.selectedLine = btn.dataset.pholine;
            });
        });

        // Product selection
        this.$$('[data-product]').forEach(btn => {
            this.addEventListener(btn, 'click', () => {
                this.$$('[data-product]').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this.state.selectedProduct = btn.dataset.product;
            });
        });

        // Ngoai quan buttons
        this.$$('.ngoai-quan-btn').forEach(btn => {
            this.addEventListener(btn, 'click', () => {
                const field = btn.dataset.field;
                const value = btn.dataset.value;
                
                // Clear other buttons for this field
                this.$$(`.ngoai-quan-btn[data-field="${field}"]`).forEach(b => {
                    b.classList.remove('btn-success', 'btn-danger');
                    b.classList.add(b.dataset.value === 'Đạt' ? 'btn-outline-success' : 'btn-outline-danger');
                });
                
                // Set selected button
                btn.classList.remove('btn-outline-success', 'btn-outline-danger');
                btn.classList.add(value === 'Đạt' ? 'btn-success' : 'btn-danger');
                
                // Store value
                this.state[field] = value;
            });
        });

        // Cam quan grid buttons
        ['cotinh', 'mau', 'mui', 'vi'].forEach(type => {
            this.$$(`[data-camquan-${type}]`).forEach(btn => {
                this.addEventListener(btn, 'click', () => {
                    const value = btn.dataset[`camquan${type.charAt(0).toUpperCase() + type.slice(1)}`];
                    this.$$(`[data-camquan-${type}]`).forEach(b => b.classList.remove('selected'));
                    btn.classList.add('selected');
                    this.state[`camQuan${type.charAt(0).toUpperCase() + type.slice(1)}`] = value;
                });
            });
        });

        // Initialize state
        this.state = {
            selectedLine: null,
            selectedProduct: null,
            phoNgoaiQuanKansui: null,
            phoNgoaiQuanTamPhoSauHap: null,
            phoNgoaiQuanVatSauSay: null,
            camQuanCotinh: null,
            camQuanMau: null,
            camQuanMui: null,
            camQuanVi: null
        };
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        // Validate required fields
        if (!this.$('#phoSite').value) {
            this.showToast('Lỗi', 'Vui lòng chọn Site', 'error');
            return;
        }

        if (!this.state.selectedLine) {
            this.showToast('Lỗi', 'Vui lòng chọn Line SX', 'error');
            return;
        }

        if (!this.state.selectedProduct) {
            this.showToast('Lỗi', 'Vui lòng chọn Sản phẩm', 'error');
            return;
        }

        // Collect form data
        const formData = this.collectFormData();
        
        // Save to localStorage
        let phoData = JSON.parse(localStorage.getItem('qaPhoTechnologyData') || '[]');
        phoData.push(formData);
        localStorage.setItem('qaPhoTechnologyData', JSON.stringify(phoData));

        this.showToast('Thành công', 'Dữ liệu công nghệ phở đã được lưu!', 'success');
        this.resetForm();
    }

    collectFormData() {
        const data = {
            id: this.$('#phoId').value,
            timestamp: new Date().toISOString(),
            formType: 'pho-technology',
            site: this.$('#phoSite').value,
            maNhanVien: this.$('#phoMaNhanVien').value,
            nsx: this.$('#phoNSX').value,
            gioKiemTra: this.$('#phoGioKiemTra').value,
            line: this.state.selectedLine,
            sanPham: this.state.selectedProduct,
            baumeKansui: this.$('#phoBaumeKansui').value,
            ngoaiQuanKansui: this.state.phoNgoaiQuanKansui,
            baumeDichTrang: this.$('#phoBaumeDichTrang').value,
            doDayTrai: this.$('#phoDoDayTrai').value,
            doDayGiua: this.$('#phoDoDayGiua').value,
            doDayPhai: this.$('#phoDoDayPhai').value,
            ngoaiQuanTamPhoSauHap: this.state.phoNgoaiQuanTamPhoSauHap,
            doAmVatSauSay: this.$('#phoDoAmVatSauSay').value,
            ngoaiQuanVatSauSay: this.state.phoNgoaiQuanVatSauSay,
            camQuanCotinh: this.state.camQuanCotinh,
            camQuanMau: this.state.camQuanMau,
            camQuanMui: this.state.camQuanMui,
            camQuanVi: this.state.camQuanVi,
            moTaCQ: this.$('#phoMoTaCQ').value
        };

        return data;
    }

    resetForm() {
        const form = this.$('#phoTechnologyForm');
        if (form) {
            form.reset();
        }
        
        // Clear selections
        this.$$('.grid-btn.selected').forEach(btn => btn.classList.remove('selected'));
        this.$$('.btn-success, .btn-danger').forEach(btn => {
            btn.classList.remove('btn-success', 'btn-danger');
            if (btn.classList.contains('ngoai-quan-btn')) {
                btn.classList.add(btn.dataset.value === 'Đạt' ? 'btn-outline-success' : 'btn-outline-danger');
            }
        });
        
        // Reset number inputs
        ['phoBaumeKansui', 'phoBaumeDichTrang', 'phoDoDayTrai', 'phoDoDayGiua', 'phoDoDayPhai', 'phoDoAmVatSauSay'].forEach(id => {
            this.$(`#${id}`).value = '0.00';
        });
        
        // Reset state
        this.state = {
            selectedLine: null,
            selectedProduct: null,
            phoNgoaiQuanKansui: null,
            phoNgoaiQuanTamPhoSauHap: null,
            phoNgoaiQuanVatSauSay: null,
            camQuanCotinh: null,
            camQuanMau: null,
            camQuanMui: null,
            camQuanVi: null
        };
        
        // Generate new ID and set current date/time
        this.$('#phoId').value = this.generateId();
        this.$('#phoNSX').value = new Date().toISOString().split('T')[0];
        this.$('#phoGioKiemTra').value = new Date().toTimeString().slice(0, 8);
    }

    generateId() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 8);
        return `PHO-${timestamp}-${random}`;
    }
}

// Global function for number input adjustment
window.adjustPhoNumber = function(inputId, delta) {
    const input = document.getElementById(inputId);
    if (input) {
        let currentValue = parseFloat(input.value) || 0;
        let newValue = currentValue + delta;
        newValue = Math.max(0, newValue);
        input.value = newValue.toFixed(2);
    }
};

// Register component
componentLoader.register('pho-technology', PhoTechnologyComponent);
