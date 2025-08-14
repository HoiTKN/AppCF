// js/ghp-hygiene-component.js - GHP Hygiene Assessment Component
class GHPHygieneComponent extends BaseComponent {
    async initialize() {
        this.state = {
            selectedSite: null,
            selectedKhuVuc: null,
            selectedCa: null,
            selectedLine: null,
            assessmentAnswers: {},
            showConditionalFields: false
        };

        // Assessment questions organized by category
        this.assessmentCategories = [
            {
                title: "Khu vực đóng gói",
                icon: "box-seam",
                questions: [
                    { id: 'khayNhuaGiaKe', label: 'Khay nhựa, giá, kệ, pallet trong phòng đóng gói' },
                    { id: 'bangTaiTrangXuongCa', label: 'Bảng tải (bảng tải trắng, bảng tải xương cá, pallang vận chuyển..)' },
                    { id: 'heThongCanGoi', label: 'Hệ thống cân gói' }
                ]
            },
            {
                title: "Hệ thống máy móc",
                icon: "gear-fill",
                questions: [
                    { id: 'heThongPhunKeo', label: 'Hệ thống phun keo' },
                    { id: 'ongThaNemDauRau', label: 'Ống thả nêm dầu rau' },
                    { id: 'mangHungMiVun', label: 'Máng hứng mì vụn' },
                    { id: 'banThaoTacChinhLieu', label: 'Bàn thao tác chính liệu' }
                ]
            },
            {
                title: "Môi trường sản xuất",
                icon: "building",
                questions: [
                    { id: 'sanNenPhongBaoGoi', label: 'Sàn nền phòng bao gói' },
                    { id: 'tayNamCuaTuongCuaKinh', label: 'Tay nắm cửa, tường, cửa kính, rèm nhựa khu dóng gói' },
                    { id: 'tranQuatMangDien', label: 'Trần, quạt, máng điện, bên ngoài tủ điện, motor' },
                    { id: 'hopGioAHU', label: 'Hợng gió AHU phòng dóng gói' },
                    { id: 'bangTaiVThungCanThung', label: 'Bảng tài V, bảng tài thùng, cân thùng' }
                ]
            },
            {
                title: "Vệ sinh và an toàn",
                icon: "shield-check",
                questions: [
                    { id: 'dungCuVeSinh', label: 'Dụng cụ vệ sinh đúng quy định, sạch sẽ' },
                    { id: 'racSanPhamLoi', label: 'Rác, sản phẩm lỗi đưa ra khu vực riêng chờ xử lý' }
                ]
            }
        ];
    }

    async render() {
        const id = this.generateId();
        const currentDate = new Date().toISOString().split('T')[0];
        const currentTime = new Date().toLocaleTimeString('vi-VN', { 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit'
        });

        this.container.innerHTML = `
            <div class="fade-in">
                <!-- Page Header -->
                <div class="page-header mb-4">
                    <h2 class="page-title">
                        <i class="bi bi-clock-history me-2"></i>
                        Đánh giá GHP khi ngưng line > 12h
                    </h2>
                    <p class="text-muted">Kiểm tra và đánh giá vệ sinh GHP khi dừng sản xuất trên 12 giờ</p>
                </div>

                <!-- Form Card -->
                <div class="modern-card">
                    <form id="ghpHygieneForm">
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
                                        <input type="text" class="modern-input" id="ghpId" 
                                               value="${id}" readonly style="background: var(--bg-tertiary);">
                                    </div>
                                    
                                    <div class="col-md-6">
                                        <label class="form-label">
                                            Site <span class="text-danger">*</span>
                                        </label>
                                        <select class="modern-input modern-select" id="ghpSite" required>
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
                                        <div class="selection-grid">
                                            ${['F1', 'F2', 'F3'].map(khu => `
                                                <button type="button" class="grid-btn" data-khu="${khu}">
                                                    ${khu}
                                                </button>
                                            `).join('')}
                                        </div>
                                    </div>
                                    
                                    <div class="col-md-4">
                                        <label class="form-label">
                                            Ngày SX <span class="text-danger">*</span>
                                        </label>
                                        <input type="date" class="modern-input" id="ghpNgay" 
                                               value="${currentDate}" required>
                                    </div>
                                    
                                    <div class="col-md-4">
                                        <label class="form-label">Giờ kiểm tra</label>
                                        <input type="text" class="modern-input" id="ghpGio" 
                                               value="${currentTime}" readonly>
                                    </div>
                                    
                                    <div class="col-md-6">
                                        <label class="form-label">Ca SX</label>
                                        <div class="selection-grid">
                                            ${['1', '2', '3', '14', '34'].map(ca => `
                                                <button type="button" class="grid-btn" data-ca="${ca}">
                                                    ${ca}
                                                </button>
                                            `).join('')}
                                        </div>
                                    </div>
                                    
                                    <div class="col-md-6">
                                        <label class="form-label">Line SX</label>
                                        <div class="selection-grid">
                                            ${[1,2,3,4,5,6,7,8].map(line => `
                                                <button type="button" class="grid-btn" data-ghpline="${line}">
                                                    ${line}
                                                </button>
                                            `).join('')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Assessment Categories -->
                        ${this.renderAssessmentCategories()}

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
                        <div class="card-body border-top" id="ghpConditionalFields" style="display: none;">
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
                                        <textarea class="modern-input" id="ghpMoTaKhongDat" rows="3" 
                                                  placeholder="Mô tả chi tiết những điểm không đạt..."></textarea>
                                    </div>
                                    
                                    <div class="col-md-6">
                                        <label class="form-label">Hình ảnh không đạt (1)</label>
                                        <input type="file" class="modern-input" id="ghpHinhAnh1" 
                                               accept="image/*" capture="camera">
                                    </div>
                                    
                                    <div class="col-md-6">
                                        <label class="form-label">Hình ảnh không đạt (2)</label>
                                        <input type="file" class="modern-input" id="ghpHinhAnh2" 
                                               accept="image/*" capture="camera">
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
                                    <div class="col-md-12">
                                        <label class="form-label">QA đánh giá</label>
                                        <input type="text" class="modern-input" id="ghpQADanhGia" 
                                               placeholder="Tên người QA đánh giá">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div class="card-body border-top bg-light">
                            <div class="d-flex justify-content-end gap-2">
                                <button type="button" class="btn btn-modern btn-secondary" id="ghpCancelBtn">
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

    renderAssessmentCategories() {
        return this.assessmentCategories.map((category, categoryIndex) => `
            <div class="card-body border-top">
                <div class="form-section">
                    <h5 class="form-section-title">
                        <i class="bi bi-${category.icon} me-2"></i>
                        ${category.title}
                    </h5>
                    
                    <div class="assessment-questions">
                        ${category.questions.map((question, questionIndex) => `
                            <div class="mb-3 p-3 border rounded">
                                <div class="d-flex justify-content-between align-items-start">
                                    <div class="flex-grow-1">
                                        <label class="form-label mb-2">
                                            <span class="badge bg-secondary me-2">
                                                ${categoryIndex + 1}.${questionIndex + 1}
                                            </span>
                                            ${question.label}
                                        </label>
                                    </div>
                                    <div class="btn-group" role="group">
                                        <button type="button" class="btn btn-outline-success assessment-btn" 
                                                data-question="${question.id}" data-answer="Đạt">
                                            <i class="bi bi-check-lg"></i> Đạt
                                        </button>
                                        <button type="button" class="btn btn-outline-danger assessment-btn" 
                                                data-question="${question.id}" data-answer="Không đạt">
                                            <i class="bi bi-x-lg"></i> Không đạt
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `).join('');
    }

    attachEventListeners() {
        // Form submit
        const form = this.$('#ghpHygieneForm');
        if (form) {
            this.addEventListener(form, 'submit', (e) => this.handleSubmit(e));
        }

        // Cancel button
        const cancelBtn = this.$('#ghpCancelBtn');
        if (cancelBtn) {
            this.addEventListener(cancelBtn, 'click', () => this.handleCancel());
        }

        // Site selection
        const siteSelect = this.$('#ghpSite');
        if (siteSelect) {
            this.addEventListener(siteSelect, 'change', () => {
                this.state.selectedSite = siteSelect.value;
            });
        }

        // Khu vuc selection
        this.$$('[data-khu]').forEach(btn => {
            this.addEventListener(btn, 'click', () => {
                this.$$('[data-khu]').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this.state.selectedKhuVuc = btn.dataset.khu;
            });
        });

        // Ca selection
        this.$$('[data-ca]').forEach(btn => {
            this.addEventListener(btn, 'click', () => {
                this.$$('[data-ca]').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this.state.selectedCa = btn.dataset.ca;
            });
        });

        // Line selection
        this.$$('[data-ghpline]').forEach(btn => {
            this.addEventListener(btn, 'click', () => {
                this.$$('[data-ghpline]').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this.state.selectedLine = btn.dataset.ghpline;
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
                const conditionalFields = this.$('#ghpConditionalFields');
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
        if (!this.state.selectedSite || !this.state.selectedKhuVuc || !this.$('#ghpNgay').value) {
            this.showToast('Lỗi', 'Vui lòng điền đầy đủ thông tin bắt buộc', 'error');
            return;
        }

        if (!this.state.conclusion) {
            this.showToast('Lỗi', 'Vui lòng chọn kết luận chung', 'error');
            return;
        }

        if (this.state.conclusion === 'Không đạt' && !this.$('#ghpMoTaKhongDat').value) {
            this.showToast('Lỗi', 'Vui lòng mô tả chi tiết khi không đạt', 'error');
            return;
        }

        // Collect data
        const formData = {
            id: this.$('#ghpId').value,
            timestamp: new Date().toISOString(),
            formType: 'ghp-hygiene',
            site: this.state.selectedSite,
            khuVuc: this.state.selectedKhuVuc,
            ngay: this.$('#ghpNgay').value,
            gio: this.$('#ghpGio').value,
            caSX: this.state.selectedCa,
            line: this.state.selectedLine,
            assessmentAnswers: this.state.assessmentAnswers,
            conclusion: this.state.conclusion,
            moTaKhongDat: this.$('#ghpMoTaKhongDat')?.value || '',
            qaDoanhGia: this.$('#ghpQADanhGia').value
        };

        // Save to localStorage
        let ghpData = JSON.parse(localStorage.getItem('qaGHPHygieneData') || '[]');
        ghpData.push(formData);
        localStorage.setItem('qaGHPHygieneData', JSON.stringify(ghpData));

        this.showToast('Thành công', 'Dữ liệu đánh giá GHP đã được lưu!', 'success');
        
        // Reset form
        this.resetForm();
    }

    handleCancel() {
        if (confirm('Bạn có chắc muốn hủy và xóa dữ liệu đã nhập?')) {
            this.resetForm();
        }
    }

    resetForm() {
        const form = this.$('#ghpHygieneForm');
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
        const conditionalFields = this.$('#ghpConditionalFields');
        if (conditionalFields) {
            conditionalFields.style.display = 'none';
        }
        
        // Reset state
        this.state = {
            selectedSite: null,
            selectedKhuVuc: null,
            selectedCa: null,
            selectedLine: null,
            assessmentAnswers: {},
            showConditionalFields: false,
            conclusion: null
        };
        
        // Generate new ID and set current date/time
        this.$('#ghpId').value = this.generateId();
        this.$('#ghpNgay').value = new Date().toISOString().split('T')[0];
        this.$('#ghpGio').value = new Date().toLocaleTimeString('vi-VN', { 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit'
        });
    }

    generateId() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 8);
        return `GHP-${timestamp}-${random}`;
    }
}

// Register component
componentLoader.register('ghp-hygiene', GHPHygieneComponent);
