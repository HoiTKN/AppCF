// Process Data Form Component - Updated (keeping original layout)
class ProcessDataComponent extends BaseComponent {
    async initialize() {
        this.formData = {};
        this.parameters = [];
        await this.loadParameters();
    }

    async loadParameters() {
        // Load từ SharePoint hoặc mock data
        this.parameters = sharepointManager.parameters || [];
    }

    async render() {
        const currentDate = new Date().toISOString().split('T')[0];
        const currentTime = new Date().toTimeString().slice(0, 8);

        this.container.innerHTML = `
            <div class="fade-in">
                <!-- Page Header -->
                <div class="page-header mb-4">
                    <h2 class="page-title">
                        <i class="bi bi-clipboard-data me-2"></i>
                        Data công nghệ mì
                    </h2>
                    <p class="text-muted">Nhập thông tin kiểm tra quá trình sản xuất mì</p>
                </div>

                <!-- Form Card -->
                <div class="modern-card">
                    <form id="processDataForm">
                        <!-- Basic Information Section -->
                        <div class="card-body">
                            <div class="form-section">
                                <h5 class="form-section-title">
                                    <i class="bi bi-info-circle me-2"></i>
                                    Thông tin cơ bản
                                </h5>
                                
                                <div class="row g-3">
                                    <div class="col-md-4">
                                        <label class="form-label">
                                            Site <span class="text-danger">*</span>
                                        </label>
                                        <select class="modern-input modern-select" id="site" required>
                                            <option value="">Chọn site...</option>
                                            <option value="MMB">MMB</option>
                                            <option value="MSI">MSI</option>
                                            <option value="MHD">MHD</option>
                                            <option value="MHG">MHG</option>
                                        </select>
                                    </div>
                                    
                                    <div class="col-md-4">
                                        <label class="form-label">
                                            Mã nhân viên QA <span class="text-danger">*</span>
                                        </label>
                                        <input type="text" class="modern-input" id="maNhanVien" 
                                               placeholder="VD: QA001" required>
                                    </div>
                                    
                                    <div class="col-md-4">
                                        <label class="form-label">NSX (Ngày sản xuất)</label>
                                        <input type="date" class="modern-input" id="nsx" 
                                               value="${currentDate}">
                                    </div>
                                    
                                    <div class="col-md-4">
                                        <label class="form-label">Giờ kiểm tra</label>
                                        <input type="time" class="modern-input" id="gioKiemTra" 
                                               value="${currentTime}" step="1">
                                    </div>
                                    
                                    <div class="col-md-4">
                                        <label class="form-label">
                                            Line SX <span class="text-danger">*</span>
                                        </label>
                                        <select class="modern-input modern-select" id="lineSX" required>
                                            <option value="">Chọn line...</option>
                                            ${[1,2,3,4,5,6,7,8].map(i => `<option value="L${i}">Line ${i}</option>`).join('')}
                                        </select>
                                    </div>
                                    
                                    <div class="col-md-4">
                                        <label class="form-label">
                                            Mã ĐKSX <span class="text-danger">*</span>
                                        </label>
                                        <select class="modern-input modern-select" id="maDKSX" required>
                                            <option value="">Chọn mã ĐKSX...</option>
                                            ${this.renderProductOptions()}
                                        </select>
                                        <div class="form-helper">
                                            Sản phẩm: <span id="productName" class="fw-semibold">-</span>
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
                                    <div class="col-md-4">
                                        <label class="form-label">Brix Kansui</label>
                                        <input type="number" class="modern-input" id="brixKansui" 
                                               step="0.1" min="0" placeholder="VD: 8.2">
                                        <div class="form-helper">
                                            Range: <span id="brixKansuiRange">-</span>
                                        </div>
                                    </div>
                                    
                                    <div class="col-md-4">
                                        <label class="form-label">Nhiệt độ Kansui (°C)</label>
                                        <input type="number" class="modern-input" id="nhietDoKansui" 
                                               step="0.1" min="0" placeholder="VD: 22.5">
                                        <div class="form-helper">
                                            Range: <span id="nhietKansuiRange">-</span>
                                        </div>
                                    </div>
                                    
                                    <div class="col-md-4">
                                        <label class="form-label">Ngoại quan Kansui</label>
                                        <select class="modern-input modern-select" id="ngoaiQuanKansui">
                                            <option value="">Chọn...</option>
                                            <option value="Đạt">✅ Đạt</option>
                                            <option value="Không đạt">❌ Không đạt</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Seasoning Parameters -->
                        <div class="card-body border-top">
                            <div class="form-section">
                                <h5 class="form-section-title">
                                    <i class="bi bi-cup-hot me-2"></i>
                                    Thông số Seasoning
                                </h5>
                                
                                <div class="row g-3">
                                    <div class="col-md-4">
                                        <label class="form-label">Brix Seasoning</label>
                                        <input type="number" class="modern-input" id="brixSeasoning" 
                                               step="0.1" min="0" placeholder="VD: 20.5">
                                        <div class="form-helper">
                                            Range: <span id="brixSeaRange">-</span>
                                        </div>
                                    </div>
                                    
                                    <div class="col-md-4">
                                        <label class="form-label">Ngoại quan Seasoning</label>
                                        <select class="modern-input modern-select" id="ngoaiQuanSeasoning">
                                            <option value="">Chọn...</option>
                                            <option value="Đạt">✅ Đạt</option>
                                            <option value="Không đạt">❌ Không đạt</option>
                                        </select>
                                    </div>
                                    
                                    <div class="col-md-4">
                                        <label class="form-label">Độ dày lá bột (mm)</label>
                                        <input type="number" class="modern-input" id="doDayLaBot" 
                                               step="0.01" min="0" placeholder="VD: 1.5">
                                        <div class="form-helper">
                                            Range: <span id="doDayRange">-</span>
                                        </div>
                                    </div>
                                    
                                    <!-- NEW: Ngoại quan sợi -->
                                    <div class="col-md-6">
                                        <label class="form-label">Ngoại quan sợi</label>
                                        <select class="modern-input modern-select" id="ngoaiQuanSoi">
                                            <option value="">Chọn...</option>
                                            <option value="Đạt">✅ Đạt</option>
                                            <option value="Không đạt">❌ Không đạt</option>
                                        </select>
                                    </div>
                                    
                                    <!-- NEW: Mô tả sợi (hiện khi không đạt) -->
                                    <div class="col-md-6" id="moTaSoiContainer" style="display: none;">
                                        <label class="form-label">Mô tả (nếu không đạt)</label>
                                        <textarea class="modern-input" id="moTaSoi" rows="2" 
                                                  placeholder="Mô tả chi tiết nếu không đạt..."></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- NEW: ĐKSX, áp suất hơi van thành phần -->
                        <div class="card-body border-top">
                            <div class="form-section">
                                <h5 class="form-section-title">
                                    <i class="bi bi-speedometer me-2"></i>
                                    ĐKSX, áp suất hơi van thành phần
                                </h5>
                                
                                <div class="row g-3">
                                    <div class="col-md-6">
                                        <label class="form-label">Áp suất hơi van thành phần</label>
                                        <select class="modern-input modern-select" id="apSuatHoiVan">
                                            <option value="">Chọn...</option>
                                            <option value="Đạt">✅ Đạt</option>
                                            <option value="Không đạt">❌ Không đạt</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Temperature Grid -->
                        <div class="card-body border-top">
                            <div class="form-section">
                                <h5 class="form-section-title">
                                    <i class="bi bi-thermometer-half me-2"></i>
                                    Nhiệt độ chiên (°C)
                                </h5>
                                
                                <div class="temperature-grid">
                                    ${this.renderTemperatureInputs()}
                                </div>
                            </div>
                        </div>

                        <!-- NEW: Ngoại quan phôi mì -->
                        <div class="card-body border-top">
                            <div class="form-section">
                                <h5 class="form-section-title">
                                    <i class="bi bi-box me-2"></i>
                                    Ngoại quan phôi mì
                                </h5>
                                
                                <div class="row g-3">
                                    <div class="col-md-6">
                                        <label class="form-label">Ngoại quan phôi mì</label>
                                        <select class="modern-input modern-select" id="ngoaiQuanPhoiMi">
                                            <option value="">Chọn...</option>
                                            <option value="Đạt">✅ Đạt</option>
                                            <option value="Không đạt">❌ Không đạt</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- NEW: Van châm BHA/BHT -->
                        <div class="card-body border-top">
                            <div class="form-section">
                                <h5 class="form-section-title">
                                    <i class="bi bi-valve me-2"></i>
                                    Van châm BHA/BHT
                                </h5>
                                
                                <div class="row g-3">
                                    <div class="col-md-6">
                                        <label class="form-label">Van châm BHA/BHT</label>
                                        <select class="modern-input modern-select" id="vanChamBHA">
                                            <option value="">Chọn...</option>
                                            <option value="Đạt">✅ Đạt</option>
                                            <option value="Không đạt">❌ Không đạt</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Sensory Evaluation -->
                        <div class="card-body border-top">
                            <div class="form-section">
                                <h5 class="form-section-title">
                                    <i class="bi bi-star me-2"></i>
                                    Đánh giá cảm quan
                                </h5>
                                
                                <div class="row g-3">
                                    ${this.renderSensoryInputs()}
                                    
                                    <!-- NEW: Mô tả cảm quan -->
                                    <div class="col-12">
                                        <label class="form-label">Mô tả cảm quan (nếu có)</label>
                                        <textarea class="modern-input" id="moTaCamQuan" rows="3" 
                                                  placeholder="Mô tả chi tiết về cảm quan nếu có ghi chú đặc biệt..."></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div class="card-body border-top bg-light">
                            <div class="d-flex justify-content-end gap-2">
                                <button type="button" class="btn btn-modern btn-secondary" id="resetBtn">
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

    renderProductOptions() {
        if (this.parameters.length === 0) {
            return '<option value="">Không có dữ liệu</option>';
        }
        
        return this.parameters.map(param => {
            const fields = param.fields || param;
            const code = fields['M_x00e3__x0020__x0110_KSX'] || fields['MaDKSX'];
            const name = fields['T_x00ea_n_x0020_tr_x00ea_n_x00'] || fields['TenTrenDKSX'];
            return `<option value="${code}">${code} - ${name}</option>`;
        }).join('');
    }

    renderTemperatureInputs() {
        const positions = [
            { id: 'nhietDauTrai', label: 'Đầu trái' },
            { id: 'nhietDauPhai', label: 'Đầu phải' },
            { id: 'nhietGiua1Trai', label: 'Giữa 1 trái' },
            { id: 'nhietGiua1Phai', label: 'Giữa 1 phải' },
            { id: 'nhietGiua2Trai', label: 'Giữa 2 trái' },
            { id: 'nhietGiua2Phai', label: 'Giữa 2 phải' },
            { id: 'nhietGiua3Trai', label: 'Giữa 3 trái' },
            { id: 'nhietGiua3Phai', label: 'Giữa 3 phải' },
            { id: 'nhietCuoiTrai', label: 'Cuối trái' },
            { id: 'nhietCuoiPhai', label: 'Cuối phải' }
        ];

        return `
            <div class="row g-3">
                ${positions.map(pos => `
                    <div class="col-6 col-md-4 col-lg-2">
                        <label class="form-label small">${pos.label}</label>
                        <input type="number" class="modern-input" id="${pos.id}" 
                               step="0.1" placeholder="0.0">
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderSensoryInputs() {
        const criteria = [
            { id: 'camQuanCoTinh', label: 'Cơ tính sợi', icon: 'texture' },
            { id: 'camQuanMau', label: 'Màu sắc', icon: 'palette' },
            { id: 'camQuanMui', label: 'Mùi', icon: 'wind' },
            { id: 'camQuanVi', label: 'Vị', icon: 'cup-straw' }
        ];

        return criteria.map(item => `
            <div class="col-md-3">
                <label class="form-label">
                    <i class="bi bi-${item.icon} me-1"></i>
                    ${item.label}
                </label>
                <select class="modern-input modern-select" id="${item.id}">
                    <option value="">Chọn điểm...</option>
                    ${[8.9, 9.0, 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8]
                        .map(val => `<option value="${val}">${val}</option>`).join('')}
                </select>
            </div>
        `).join('');
    }

    attachEventListeners() {
        // Form submit
        const form = this.$('#processDataForm');
        if (form) {
            this.addEventListener(form, 'submit', (e) => this.handleSubmit(e));
        }

        // Reset button
        const resetBtn = this.$('#resetBtn');
        if (resetBtn) {
            this.addEventListener(resetBtn, 'click', () => this.resetForm());
        }

        // Product selection
        const maDKSX = this.$('#maDKSX');
        if (maDKSX) {
            this.addEventListener(maDKSX, 'change', () => this.loadProductParameters());
        }

        // Site selection
        const site = this.$('#site');
        if (site) {
            this.addEventListener(site, 'change', () => this.filterProducts());
        }

        // Ngoại quan sợi change listener
        const ngoaiQuanSoi = this.$('#ngoaiQuanSoi');
        if (ngoaiQuanSoi) {
            this.addEventListener(ngoaiQuanSoi, 'change', () => {
                const moTaContainer = this.$('#moTaSoiContainer');
                if (moTaContainer) {
                    moTaContainer.style.display = ngoaiQuanSoi.value === 'Không đạt' ? 'block' : 'none';
                }
            });
        }
    }

    loadProductParameters() {
        const maDKSX = this.$('#maDKSX').value;
        if (!maDKSX) return;

        const param = this.parameters.find(p => {
            const fields = p.fields || p;
            return fields['M_x00e3__x0020__x0110_KSX'] === maDKSX;
        });

        if (param) {
            const fields = param.fields || param;
            
            // Update product name
            this.$('#productName').textContent = 
                fields['T_x00ea_n_x0020_tr_x00ea_n_x00'] || '-';
            
            // Update ranges
            this.$('#brixKansuiRange').textContent = 
                `${fields['Brix_x0020_Kansui_x0020_Min']} - ${fields['Brix_x0020_Kansui_x0020_Max']}`;
            
            this.$('#nhietKansuiRange').textContent = 
                `${fields['Nhi_x1ec7_t_x0020_Kanshui_x00']} - ${fields['Nhi_x1ec7_t_x0020_Kanshui_x000']}°C`;
            
            this.$('#brixSeaRange').textContent = 
                `${fields['Brix_x0020_Sea_x0020_Min']} - ${fields['Brix_x0020_Sea_x0020_Max']}`;
            
            this.$('#doDayRange').textContent = 
                `${fields['_x0110__x1ed9__x0020_d_x00e0_y_x0']} - ${fields['_x0110__x1ed9__x0020_d_x00e0_y_x1']} mm`;
        }
    }

    filterProducts() {
        // Filter products based on selected site
        const site = this.$('#site').value;
        // Implementation for filtering...
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        // Collect form data
        const formData = this.collectFormData();
        
        // Save to localStorage/SharePoint
        await sharepointManager.createItem(formData);
        
        this.showToast('Thành công', 'Dữ liệu đã được lưu!', 'success');
        this.resetForm();
    }

    collectFormData() {
        const fields = [
            'site', 'maNhanVien', 'nsx', 'gioKiemTra', 'lineSX', 'maDKSX', // UPDATED: added nsx, gioKiemTra
            'brixKansui', 'nhietDoKansui', 'ngoaiQuanKansui',
            'brixSeasoning', 'ngoaiQuanSeasoning', 'doDayLaBot',
            'ngoaiQuanSoi', 'moTaSoi',  // NEW
            'apSuatHoiVan',  // NEW
            'nhietDauTrai', 'nhietDauPhai', 'nhietGiua1Trai', 'nhietGiua1Phai',
            'nhietGiua2Trai', 'nhietGiua2Phai', 'nhietGiua3Trai', 'nhietGiua3Phai',
            'nhietCuoiTrai', 'nhietCuoiPhai',
            'ngoaiQuanPhoiMi',  // NEW
            'vanChamBHA',  // NEW
            'camQuanCoTinh', 'camQuanMau', 'camQuanMui', 'camQuanVi',
            'moTaCamQuan'  // NEW
        ];

        const data = {
            timestamp: new Date().toISOString(),
            formType: 'process-data', // ADDED
            sanPham: this.$('#productName').textContent
        };

        fields.forEach(field => {
            const element = this.$(`#${field}`);
            if (element) {
                data[field] = element.value;
            }
        });

        return data;
    }

    resetForm() {
        const form = this.$('#processDataForm');
        if (form) {
            form.reset();
            this.$('#productName').textContent = '-';
            this.$$('.form-helper span').forEach(span => {
                if (span.id !== 'productName') {
                    span.textContent = '-';
                }
            });
            // Hide mô tả container
            const moTaContainer = this.$('#moTaSoiContainer');
            if (moTaContainer) {
                moTaContainer.style.display = 'none';
            }
            
            // Reset date and time to current
            this.$('#nsx').value = new Date().toISOString().split('T')[0];
            this.$('#gioKiemTra').value = new Date().toTimeString().slice(0, 8);
        }
    }
}

// Register component
componentLoader.register('process-data', ProcessDataComponent);
