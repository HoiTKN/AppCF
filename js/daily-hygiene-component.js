// Daily Hygiene Component
class DailyHygieneComponent extends BaseComponent {
    async initialize() {
        this.state = {
            selectedCa: null,
            selectedLine: null,
            assessmentAnswers: {},
            showConditionalFields: false
        };

        // Assessment questions
        this.questions = [
            { id: 'bhld', label: 'Công nhân tuân thủ BHLD (đồng phục, giày/dép, mũ, khẩu trang)', icon: 'shield-check' },
            { id: 'khongDeoTrangSuc', label: 'Công nhân không đeo mông tay dài, không deo trang sức', icon: 'x-circle' },
            { id: 'xitConTay', label: 'Công nhân trong phòng BG đảm bảo xịt cồn tay 2h/lần', icon: 'droplet' },
            { id: 'nenPhongBG', label: 'Nền phòng BG sạch sẽ, không có phôi mì, gia vị rơi', icon: 'house-check' },
            { id: 'khongCoNVL', label: 'Không có NVL, BTP khác loại hoặc không đạt chất lượng', icon: 'box-seam' },
            { id: 'cuaRaVao', label: 'Cửa ra vào có rèm chắn côn trùng, rèm được vệ sinh sạch sẽ', icon: 'door-open' },
            { id: 'denBatConTrung', label: 'Đèn bắt côn trùng hoạt động bình thường', icon: 'lightbulb' },
            { id: 'tuongTran', label: 'Tường, trần nhà sạch sẽ, không bụi bẩn, mạng nhện', icon: 'building' },
            { id: 'bangChuyenMayMoc', label: 'Băng chuyền, máy móc thiết bị được vệ sinh sạch sẽ', icon: 'gear' },
            { id: 'palletNhua', label: 'Pallet dùng trong phòng BG là pallet nhựa, được vệ sinh', icon: 'stack' },
            { id: 'congCuDungCu', label: 'Công cụ dụng cụ sử dụng đúng mục đích, vệ sinh sạch sẽ', icon: 'tools' },
            { id: 'khayNhua', label: 'Khay nhựa trong phòng BG phải sạch sẽ, khô ráo', icon: 'inbox' },
            { id: 'btpTP', label: 'BTP, TP phải chứa đúng màu khay để nhận dạng hàng lỗi', icon: 'tags' },
            { id: 'khayPE', label: 'Khay chứa phôi phải được lót bao PE khi khay chống đổi', icon: 'archive' },
            { id: 'heThongPhun', label: 'Hệ thống phun keo sạch sẽ, không có mùi lạ', icon: 'spray-can' },
            { id: 'kvGiaVi', label: 'KV cấp gia vị sạch sẽ, NVL để đúng layout quy định', icon: 'basket' },
            { id: 'kvThanhPham', label: 'KV thành phẩm sạch sẽ, gọn gàng, thành phẩm đúng vị trí', icon: 'box-arrow-right' }
        ];
    }

    async render() {
        const id = this.generateId();
        const currentDate = new Date().toISOString().split('T')[0];

        this.container.innerHTML = `
            <div class="fade-in">
                <!-- Page Header -->
                <div class="page-header mb-4">
                    <h2 class="page-title">
                        <i class="bi bi-droplet-half me-2"></i>
                        Đánh giá vệ sinh hàng ngày
                    </h2>
                    <p class="text-muted">Kiểm tra và đánh giá điều kiện vệ sinh sản xuất</p>
                </div>

                <!-- Form Card -->
                <div class="modern-card">
                    <form id="dailyHygieneForm">
                        <!-- Basic Information -->
                        <div class="card-body">
                            <div class="form-section">
                                <h5 class="form-section-title">
                                    <i class="bi bi-info-circle me-2"></i>
                                    Thông tin chung
                                </h5>
                                
                                <div class="row g-3">
                                    <div class="col-md-6">
                                        <label class="form-label">ID</label>
                                        <input type="text" class="modern-input" id="dhId" 
                                               value="${id}" readonly style="background: var(--bg-tertiary);">
                                    </div>
                                    
                                    <div class="col-md-6">
                                        <label class="form-label">
                                            Site <span class="text-danger">*</span>
                                        </label>
                                        <select class="modern-input modern-select" id="dhSite" required>
                                            <option value="">Chọn site...</option>
                                            <option value="MMB">MMB</option>
                                            <option value="MSI">MSI</option>
                                            <option value="MHD">MHD</option>
                                            <option value="MHG">MHG</option>
                                        </select>
                                    </div>
                                    
                                    <div class="col-md-4">
                                        <label class="form-label">
                                            Khu vực/xưởng SX <span class="text-danger">*</span>
                                        </label>
                                        <select class="modern-input modern-select" id="dhKhuVuc" required>
                                            <option value="">Chọn khu vực...</option>
                                            <option value="Khu A">Khu A</option>
                                            <option value="Khu B">Khu B</option>
                                            <option value="Khu C">Khu C</option>
                                            <option value="Phân xưởng 1">Phân xưởng 1</option>
                                            <option value="Phân xưởng 2">Phân xưởng 2</option>
                                        </select>
                                    </div>
                                    
                                    <div class="col-md-4">
                                        <label class="form-label">
                                            Ngày <span class="text-danger">*</span>
                                        </label>
                                        <input type="date" class="modern-input" id="dhNgay" 
                                               value="${currentDate}" required>
                                    </div>
                                    
                                    <div class="col-md-4">
                                        <label class="form-label">Ca SX</label>
                                        <div class="selection-grid">
                                            ${['1', '2', '3', '14', '34'].map(ca => `
                                                <button type="button" class="grid-btn" data-ca="${ca}">
                                                    ${ca}
                                                </button>
                                            `).join('')}
                                        </div>
                                    </div>
                                </div>

                                <!-- Line Selection -->
                                <div class="mt-3">
                                    <label class="form-label">Line</label>
                                    <div class="selection-grid">
                                        ${[1,2,3,4,5,6,7,8,'Phở'].map(line => `
                                            <button type="button" class="grid-btn" data-dhline="${line}">
                                                ${line}
                                            </button>
                                        `).join('')}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Assessment Questions -->
                        <div class="card-body border-top">
                            <div class="form-section">
                                <h5 class="form-section-title">
                                    <i class="bi bi-clipboard-check me-2"></i>
                                    Câu hỏi đánh giá
                                </h5>
                                
                                <div class="assessment-questions">
                                    ${this.renderQuestions()}
                                </div>
                            </div>
                        </div>

                        <!-- Overall Conclusion -->
                        <div class="card-body border-top">
                            <div class="form-section">
                                <h5 class="form-section-title">
                                    <i class="bi bi-check2-square me-2"></i>
                                    Kết luận chung
                                </h5>
                                
                                <div class="row g-3">
                                    <div class="col-12">
                                        <label class="form-label">
                                            Kết luận <span class="text-danger">*</span>
                                        </label>
                                        <div class="d-flex gap-3">
                                            <button type="button" class="btn btn-outline-success flex-fill conclusion-btn" 
                                                    data-conclusion="Đạt">
                                                <i class="bi bi-check-circle me-2"></i>
                                                Đạt
                                            </button>
                                            <button type="button" class="btn btn-outline-danger flex-fill conclusion-btn" 
                                                    data-conclusion="Không đạt">
                                                <i class="bi bi-x-circle me-2"></i>
                                                Không đạt
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Conditional Fields (shown when "Không đạt") -->
                        <div class="card-body border-top" id="conditionalFields" style="display: none;">
                            <div class="form-section">
                                <h5 class="form-section-title text-danger">
                                    <i class="bi bi-exclamation-triangle me-2"></i>
                                    Thông tin chi tiết khi không đạt
                                </h5>
                                
                                <div class="row g-3">
                                    <div class="col-12">
                                        <label class="form-label">
                                            Mô tả chi tiết <span class="text-danger">*</span>
                                        </label>
                                        <textarea class="modern-input" id="dhMoTaKhongDat" rows="3" 
                                                  placeholder="Mô tả chi tiết những điểm không đạt..."></textarea>
                                    </div>
                                    
                                    <div class="col-md-6">
                                        <label class="form-label">Hình ảnh không đạt (1)</label>
                                        <input type="file" class="modern-input" id="dhHinhAnh1" 
                                               accept="image/*" capture="camera">
                                    </div>
                                    
                                    <div class="col-md-6">
                                        <label class="form-label">Hình ảnh không đạt (2)</label>
                                        <input type="file" class="modern-input" id="dhHinhAnh2" 
                                               accept="image/*" capture="camera">
                                    </div>
                                    
                                    <div class="col-12">
                                        <label class="form-label">Hành động khắc phục</label>
                                        <textarea class="modern-input" id="dhHanhDongKhacPhuc" rows="3" 
                                                  placeholder="Mô tả hành động khắc phục đã thực hiện..."></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- QA Information -->
                        <div class="card-body border-top">
                            <div class="form-section">
                                <h5 class="form-section-title">
                                    <i class="bi bi-person-badge me-2"></i>
                                    Thông tin QA
                                </h5>
                                
                                <div class="row g-3">
                                    <div class="col-md-4">
                                        <label class="form-label">QA đánh giá</label>
                                        <input type="text" class="modern-input" id="dhQADanhGia" 
                                               placeholder="Tên người QA đánh giá">
                                    </div>
                                    
                                    <div class="col-md-4">
                                        <label class="form-label">Đeo bao tay đầu ca</label>
                                        <select class="modern-input modern-select" id="dhDeoTayDauCa">
                                            <option value="">Chọn...</option>
                                            <option value="Y">✅ Có</option>
                                            <option value="N">❌ Không</option>
                                        </select>
                                    </div>
                                    
                                    <div class="col-md-4">
                                        <label class="form-label">Tình trạng bao tay cuối ca</label>
                                        <select class="modern-input modern-select" id="dhTinhTrangTayCuoiCa">
                                            <option value="">Chọn...</option>
                                            <option value="Y">✅ Tốt</option>
                                            <option value="N">❌ Không tốt</option>
                                        </select>
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

    renderQuestions() {
        return this.questions.map((q, index) => `
            <div class="mb-3 p-3 border rounded">
                <div class="d-flex justify-content-between align-items-start">
                    <div class="flex-grow-1">
                        <label class="form-label mb-2">
                            <span class="badge bg-secondary me-2">${index + 1}</span>
                            <i class="bi bi-${q.icon} me-1"></i>
                            ${q.label}
                        </label>
                    </div>
                    <div class="btn-group" role="group">
                        <button type="button" class="btn btn-outline-success assessment-btn" 
                                data-question="${q.id}" data-answer="Đạt">
                            <i class="bi bi-check-lg"></i> Đạt
                        </button>
                        <button type="button" class="btn btn-outline-danger assessment-btn" 
                                data-question="${q.id}" data-answer="Không đạt">
                            <i class="bi bi-x-lg"></i> Không đạt
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    attachEventListeners() {
        // Form submit
        const form = this.$('#dailyHygieneForm');
        if (form) {
            this.addEventListener(form, 'submit', (e) => this.handleSubmit(e));
        }

        // Cancel button
        const cancelBtn = this.$('#cancelBtn');
        if (cancelBtn) {
            this.addEventListener(cancelBtn, 'click', () => this.handleCancel());
        }

        // Ca selection
        this.$$('[data-ca]').forEach(btn => {
            this.addEventListener(btn, 'click', () => {
                this.$$('[data-ca]').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this.state.selectedCa = btn.dataset.ca;
            });
        });

        // Line selection
        this.$$('[data-dhline]').forEach(btn => {
            this.addEventListener(btn, 'click', () => {
                this.$$('[data-dhline]').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this.state.selectedLine = btn.dataset.dhline;
            });
        });

        // Assessment questions
        this.$$('.assessment-btn').forEach(btn => {
            this.addEventListener(btn, 'click', () => {
                const question = btn.dataset.question;
                const answer = btn.dataset.answer;
                
                // Clear other buttons for this question
                this.$$(`.assessment-btn[data-question="${question}"]`).forEach(b => {
                    b.classList.remove('btn-success', 'btn-danger');
                    b.classList.add(b.dataset.answer === 'Đạt' ? 'btn-outline-success' : 'btn-outline-danger');
                });
                
                // Set selected button
                btn.classList.remove('btn-outline-success', 'btn-outline-danger');
                btn.classList.add(answer === 'Đạt' ? 'btn-success' : 'btn-danger');
                
                // Store answer
                this.state.assessmentAnswers[question] = answer;
            });
        });

        // Conclusion buttons
        this.$$('.conclusion-btn').forEach(btn => {
            this.addEventListener(btn, 'click', () => {
                const conclusion = btn.dataset.conclusion;
                
                // Clear other buttons
                this.$$('.conclusion-btn').forEach(b => {
                    b.classList.remove('btn-success', 'btn-danger');
                    b.classList.add(b.dataset.conclusion === 'Đạt' ? 'btn-outline-success' : 'btn-outline-danger');
                });
                
                // Set selected button
                btn.classList.remove('btn-outline-success', 'btn-outline-danger');
                btn.classList.add(conclusion === 'Đạt' ? 'btn-success' : 'btn-danger');
                
                // Show/hide conditional fields
                const conditionalFields = this.$('#conditionalFields');
                if (conditionalFields) {
                    conditionalFields.style.display = conclusion === 'Không đạt' ? 'block' : 'none';
                    this.state.showConditionalFields = conclusion === 'Không đạt';
                }
                
                this.state.conclusion = conclusion;
            });
        });
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        // Validate required fields
        if (!this.$('#dhSite').value || !this.$('#dhKhuVuc').value || !this.$('#dhNgay').value) {
            this.showToast('Lỗi', 'Vui lòng điền đầy đủ thông tin bắt buộc', 'error');
            return;
        }

        if (!this.state.conclusion) {
            this.showToast('Lỗi', 'Vui lòng chọn kết luận chung', 'error');
            return;
        }

        if (this.state.conclusion === 'Không đạt' && !this.$('#dhMoTaKhongDat').value) {
            this.showToast('Lỗi', 'Vui lòng mô tả chi tiết khi không đạt', 'error');
            return;
        }

        // Collect data
        const formData = {
            id: this.$('#dhId').value,
            timestamp: new Date().toISOString(),
            site: this.$('#dhSite').value,
            khuVuc: this.$('#dhKhuVuc').value,
            ngay: this.$('#dhNgay').value,
            caSX: this.state.selectedCa,
            line: this.state.selectedLine,
            assessmentAnswers: this.state.assessmentAnswers,
            conclusion: this.state.conclusion,
            moTaKhongDat: this.$('#dhMoTaKhongDat')?.value || '',
            hanhDongKhacPhuc: this.$('#dhHanhDongKhacPhuc')?.value || '',
            qaDoanhGia: this.$('#dhQADanhGia').value,
            deoTayDauCa: this.$('#dhDeoTayDauCa').value,
            tinhTrangTayCuoiCa: this.$('#dhTinhTrangTayCuoiCa').value
        };

        // Save to localStorage
        let hygieneData = JSON.parse(localStorage.getItem('qaDailyHygieneData') || '[]');
        hygieneData.push(formData);
        localStorage.setItem('qaDailyHygieneData', JSON.stringify(hygieneData));

        this.showToast('Thành công', 'Dữ liệu đánh giá vệ sinh đã được lưu!', 'success');
        
        // Reset form
        this.resetForm();
    }

    handleCancel() {
        if (confirm('Bạn có chắc muốn hủy và xóa dữ liệu đã nhập?')) {
            this.resetForm();
        }
    }

    resetForm() {
        const form = this.$('#dailyHygieneForm');
        if (form) {
            form.reset();
        }
        
        // Clear all selections
        this.$$('.grid-btn.selected').forEach(btn => btn.classList.remove('selected'));
        this.$$('.btn-success, .btn-danger').forEach(btn => {
            btn.classList.remove('btn-success', 'btn-danger');
            if (btn.classList.contains('assessment-btn')) {
                btn.classList.add(btn.dataset.answer === 'Đạt' ? 'btn-outline-success' : 'btn-outline-danger');
            } else if (btn.classList.contains('conclusion-btn')) {
                btn.classList.add(btn.dataset.conclusion === 'Đạt' ? 'btn-outline-success' : 'btn-outline-danger');
            }
        });
        
        // Hide conditional fields
        const conditionalFields = this.$('#conditionalFields');
        if (conditionalFields) {
            conditionalFields.style.display = 'none';
        }
        
        // Reset state
        this.state = {
            selectedCa: null,
            selectedLine: null,
            assessmentAnswers: {},
            showConditionalFields: false,
            conclusion: null
        };
        
        // Generate new ID and set current date
        this.$('#dhId').value = this.generateId();
        this.$('#dhNgay').value = new Date().toISOString().split('T')[0];
    }

    generateId() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 8);
        return `DH-${timestamp}-${random}`;
    }
}

// Register component
componentLoader.register('daily-hygiene', DailyHygieneComponent);
