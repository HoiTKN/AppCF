// Product Changeover Component
class ProductChangeoverComponent extends BaseComponent {
    async initialize() {
        this.state = {
            selectedLine: null,
            checklistItems: {}
        };

        // Checklist items
        this.checklistItems = [
            { id: 'donDiChuyenBTP', label: 'Dọn và Di Chuyển BTP Đóng Gói', icon: 'box-seam' },
            { id: 'donDiChuyenNoiLieu', label: 'Dọn và Di chuyển BTP khu nối liệu', icon: 'boxes' },
            { id: 'veSinhBangTai', label: 'Vệ Sinh Băng Tải', icon: 'arrows-move' },
            { id: 'veSinhMayDispencer', label: 'Vệ Sinh Máy Dispencer', icon: 'moisture' },
            { id: 'veSinhCumRungRau', label: 'Vệ Sinh cụm rung rau', icon: 'tornado' },
            { id: 'veSinhKhuonLy', label: 'Vệ sinh khuôn ly, tô', icon: 'cup' }
        ];
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
                        <i class="bi bi-arrow-repeat me-2"></i>
                        Checklist chuyển đổi sản phẩm
                    </h2>
                    <p class="text-muted">Kiểm tra và xác nhận các bước chuyển đổi sản phẩm</p>
                </div>

                <!-- Progress Indicator -->
                <div class="modern-card mb-3">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center">
                            <h6 class="mb-0">Tiến độ hoàn thành</h6>
                            <span class="badge bg-primary" id="progressBadge">0/6</span>
                        </div>
                        <div class="progress mt-2" style="height: 8px;">
                            <div class="progress-bar bg-success" id="progressBar" 
                                 role="progressbar" style="width: 0%"></div>
                        </div>
                    </div>
                </div>

                <!-- Form Card -->
                <div class="modern-card">
                    <form id="productChangeoverForm">
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
                                        <input type="text" class="modern-input" id="pcId" 
                                               value="${id}" readonly style="background: var(--bg-tertiary);">
                                    </div>
                                    
                                    <div class="col-md-6">
                                        <label class="form-label">
                                            Site <span class="text-danger">*</span>
                                        </label>
                                        <select class="modern-input modern-select" id="pcSite" required>
                                            <option value="">Chọn site...</option>
                                            <option value="MMB">MMB</option>
                                            <option value="MSI">MSI</option>
                                            <option value="MHD">MHD</option>
                                            <option value="MHG">MHG</option>
                                        </select>
                                    </div>
                                    
                                    <div class="col-md-4">
                                        <label class="form-label">
                                            Ngày Sản Xuất <span class="text-danger">*</span>
                                        </label>
                                        <input type="date" class="modern-input" id="pcNgaySanXuat" 
                                               value="${currentDate}" required>
                                    </div>
                                    
                                    <div class="col-md-4">
                                        <label class="form-label">Giờ</label>
                                        <input type="time" class="modern-input" id="pcGio" 
                                               value="${currentTime}">
                                    </div>
                                    
                                    <div class="col-md-4">
                                        <label class="form-label">
                                            Tên Sản Phẩm <span class="text-danger">*</span>
                                        </label>
                                        <input type="text" class="modern-input" id="pcTenSanPham" 
                                               placeholder="VD: Mì tôm chua cay" required>
                                    </div>
                                    
                                    <div class="col-md-6">
                                        <label class="form-label">Mã Item</label>
                                        <input type="text" class="modern-input" id="pcItem" 
                                               placeholder="Mã item sản phẩm">
                                    </div>
                                    
                                    <div class="col-md-6">
                                        <label class="form-label">Người thực hiện</label>
                                        <input type="text" class="modern-input" id="pcNguoiThucHien" 
                                               placeholder="Tên người thực hiện">
                                    </div>
                                </div>
                                
                                <!-- Line Selection -->
                                <div class="mt-3">
                                    <label class="form-label">Chọn Line</label>
                                    <div class="selection-grid">
                                        ${[1,2,3,4,5,6,7,8,'Phở'].map(line => `
                                            <button type="button" class="grid-btn" data-pcline="${line}">
                                                ${line}
                                            </button>
                                        `).join('')}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Checklist Items -->
                        <div class="card-body border-top">
                            <div class="form-section">
                                <h5 class="form-section-title">
                                    <i class="bi bi-list-check me-2"></i>
                                    Checklist Items
                                </h5>
                                
                                <div class="checklist-container">
                                    ${this.renderChecklistItems()}
                                </div>
                            </div>
                        </div>

                        <!-- Additional Notes -->
                        <div class="card-body border-top">
                            <div class="form-section">
                                <h5 class="form-section-title">
                                    <i class="bi bi-chat-left-text me-2"></i>
                                    Ghi chú bổ sung
                                </h5>
                                
                                <div class="row g-3">
                                    <div class="col-12">
                                        <label class="form-label">Ghi chú</label>
                                        <textarea class="modern-input" id="pcGhiChu" rows="3" 
                                                  placeholder="Ghi chú thêm nếu có..."></textarea>
                                    </div>
                                    
                                    <div class="col-md-6">
                                        <label class="form-label">Hình ảnh trước chuyển đổi</label>
                                        <input type="file" class="modern-input" id="pcHinhAnhTruoc" 
                                               accept="image/*" capture="camera">
                                    </div>
                                    
                                    <div class="col-md-6">
                                        <label class="form-label">Hình ảnh sau chuyển đổi</label>
                                        <input type="file" class="modern-input" id="pcHinhAnhSau" 
                                               accept="image/*" capture="camera">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Summary Section -->
                        <div class="card-body border-top bg-light">
                            <div class="row align-items-center">
                                <div class="col-md-6">
                                    <div class="d-flex align-items-center">
                                        <div class="me-3">
                                            <i class="bi bi-clock-history text-muted" style="font-size: 2rem;"></i>
                                        </div>
                                        <div>
                                            <small class="text-muted">Thời gian bắt đầu</small>
                                            <div class="fw-bold" id="startTime">--:--</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6 text-md-end mt-3 mt-md-0">
                                    <div class="d-flex justify-content-md-end gap-2">
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
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        `;

        // Set start time
        this.$('#startTime').textContent = new Date().toTimeString().slice(0, 5);
        
        this.attachEventListeners();
    }

    renderChecklistItems() {
        return this.checklistItems.map((item, index) => `
            <div class="checklist-item mb-3 p-3 border rounded hover-shadow" 
                 style="transition: all 0.3s;">
                <div class="row align-items-center">
                    <div class="col-auto">
                        <div class="checklist-number">
                            <span class="badge bg-secondary" style="font-size: 1rem;">
                                ${index + 1}
                            </span>
                        </div>
                    </div>
                    <div class="col">
                        <div class="d-flex align-items-center">
                            <i class="bi bi-${item.icon} text-primary me-2" style="font-size: 1.25rem;"></i>
                            <div>
                                <div class="fw-semibold">${item.label}</div>
                                <small class="text-muted status-text" id="status-${item.id}">
                                    Chưa kiểm tra
                                </small>
                            </div>
                        </div>
                    </div>
                    <div class="col-auto">
                        <div class="btn-group" role="group">
                            <button type="button" 
                                    class="btn btn-outline-success checklist-btn" 
                                    data-item="${item.id}" 
                                    data-status="pass">
                                <i class="bi bi-check-lg"></i>
                                Đạt
                            </button>
                            <button type="button" 
                                    class="btn btn-outline-danger checklist-btn" 
                                    data-item="${item.id}" 
                                    data-status="fail">
                                <i class="bi bi-x-lg"></i>
                                Không đạt
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Note field for failed items -->
                <div class="mt-2 fail-note" id="note-${item.id}" style="display: none;">
                    <input type="text" class="modern-input" 
                           placeholder="Ghi chú lý do không đạt..." 
                           id="note-input-${item.id}">
                </div>
            </div>
        `).join('');
    }

    attachEventListeners() {
        // Form submit
        const form = this.$('#productChangeoverForm');
        if (form) {
            this.addEventListener(form, 'submit', (e) => this.handleSubmit(e));
        }

        // Cancel button
        const cancelBtn = this.$('#cancelBtn');
        if (cancelBtn) {
            this.addEventListener(cancelBtn, 'click', () => this.handleCancel());
        }

        // Line selection
        this.$$('[data-pcline]').forEach(btn => {
            this.addEventListener(btn, 'click', () => {
                this.$$('[data-pcline]').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this.state.selectedLine = btn.dataset.pcline;
            });
        });

        // Checklist items
        this.$$('.checklist-btn').forEach(btn => {
            this.addEventListener(btn, 'click', () => {
                const itemId = btn.dataset.item;
                const status = btn.dataset.status;
                
                // Clear other buttons for this item
                this.$$(`.checklist-btn[data-item="${itemId}"]`).forEach(b => {
                    b.classList.remove('btn-success', 'btn-danger');
                    if (b.dataset.status === 'pass') {
                        b.classList.add('btn-outline-success');
                    } else {
                        b.classList.add('btn-outline-danger');
                    }
                });
                
                // Set selected button
                btn.classList.remove('btn-outline-success', 'btn-outline-danger');
                btn.classList.add(status === 'pass' ? 'btn-success' : 'btn-danger');
                
                // Update status text
                const statusText = this.$(`#status-${itemId}`);
                if (statusText) {
                    statusText.textContent = status === 'pass' ? '✅ Đạt' : '❌ Không đạt';
                    statusText.className = status === 'pass' ? 'text-success' : 'text-danger';
                }
                
                // Show/hide note field
                const noteField = this.$(`#note-${itemId}`);
                if (noteField) {
                    noteField.style.display = status === 'fail' ? 'block' : 'none';
                }
                
                // Store status
                this.state.checklistItems[itemId] = {
                    status: status,
                    note: status === 'fail' ? this.$(`#note-input-${itemId}`)?.value || '' : ''
                };
                
                // Update progress
                this.updateProgress();
            });
        });

        // Note inputs
        this.$$('[id^="note-input-"]').forEach(input => {
            this.addEventListener(input, 'input', () => {
                const itemId = input.id.replace('note-input-', '');
                if (this.state.checklistItems[itemId]) {
                    this.state.checklistItems[itemId].note = input.value;
                }
            });
        });
    }

    updateProgress() {
        const totalItems = this.checklistItems.length;
        const completedItems = Object.keys(this.state.checklistItems).length;
        const percentage = (completedItems / totalItems) * 100;
        
        // Update progress bar
        const progressBar = this.$('#progressBar');
        if (progressBar) {
            progressBar.style.width = `${percentage}%`;
            
            // Change color based on completion
            if (percentage === 100) {
                progressBar.className = 'progress-bar bg-success';
            } else if (percentage >= 50) {
                progressBar.className = 'progress-bar bg-warning';
            } else {
                progressBar.className = 'progress-bar bg-primary';
            }
        }
        
        // Update badge
        const progressBadge = this.$('#progressBadge');
        if (progressBadge) {
            progressBadge.textContent = `${completedItems}/${totalItems}`;
            
            // Change badge color
            if (percentage === 100) {
                progressBadge.className = 'badge bg-success';
            } else if (percentage >= 50) {
                progressBadge.className = 'badge bg-warning';
            } else {
                progressBadge.className = 'badge bg-primary';
            }
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        // Validate required fields
        if (!this.$('#pcSite').value || !this.$('#pcNgaySanXuat').value || !this.$('#pcTenSanPham').value) {
            this.showToast('Lỗi', 'Vui lòng điền đầy đủ thông tin bắt buộc', 'error');
            return;
        }

        if (!this.state.selectedLine) {
            this.showToast('Lỗi', 'Vui lòng chọn Line', 'error');
            return;
        }

        // Check if all checklist items are completed
        if (Object.keys(this.state.checklistItems).length < this.checklistItems.length) {
            this.showToast('Cảnh báo', 'Vui lòng hoàn thành tất cả các mục trong checklist', 'warning');
            return;
        }

        // Collect data
        const formData = {
            id: this.$('#pcId').value,
            timestamp: new Date().toISOString(),
            site: this.$('#pcSite').value,
            ngaySanXuat: this.$('#pcNgaySanXuat').value,
            gio: this.$('#pcGio').value,
            tenSanPham: this.$('#pcTenSanPham').value,
            item: this.$('#pcItem').value,
            nguoiThucHien: this.$('#pcNguoiThucHien').value,
            line: this.state.selectedLine,
            checklistItems: this.state.checklistItems,
            ghiChu: this.$('#pcGhiChu').value,
            startTime: this.$('#startTime').textContent,
            endTime: new Date().toTimeString().slice(0, 5)
        };

        // Calculate duration
        const start = new Date(`2000-01-01 ${formData.startTime}`);
        const end = new Date(`2000-01-01 ${formData.endTime}`);
        const duration = Math.round((end - start) / 60000); // in minutes
        formData.duration = duration;

        // Save to localStorage
        let changeoverData = JSON.parse(localStorage.getItem('qaProductChangeoverData') || '[]');
        changeoverData.push(formData);
        localStorage.setItem('qaProductChangeoverData', JSON.stringify(changeoverData));

        this.showToast('Thành công', `Checklist đã được lưu! Thời gian hoàn thành: ${duration} phút`, 'success');
        
        // Reset form
        this.resetForm();
    }

    handleCancel() {
        if (confirm('Bạn có chắc muốn hủy và xóa dữ liệu đã nhập?')) {
            this.resetForm();
        }
    }

    resetForm() {
        const form = this.$('#productChangeoverForm');
        if (form) {
            form.reset();
        }
        
        // Clear all selections
        this.$$('.grid-btn.selected').forEach(btn => btn.classList.remove('selected'));
        this.$$('.btn-success, .btn-danger').forEach(btn => {
            btn.classList.remove('btn-success', 'btn-danger');
            if (btn.classList.contains('checklist-btn')) {
                btn.classList.add(btn.dataset.status === 'pass' ? 'btn-outline-success' : 'btn-outline-danger');
            }
        });
        
        // Reset status texts
        this.$$('[id^="status-"]').forEach(el => {
            el.textContent = 'Chưa kiểm tra';
            el.className = 'text-muted status-text';
        });
        
        // Hide note fields
        this.$$('.fail-note').forEach(el => {
            el.style.display = 'none';
        });
        
        // Reset progress
        const progressBar = this.$('#progressBar');
        if (progressBar) {
            progressBar.style.width = '0%';
            progressBar.className = 'progress-bar bg-primary';
        }
        
        const progressBadge = this.$('#progressBadge');
        if (progressBadge) {
            progressBadge.textContent = '0/6';
            progressBadge.className = 'badge bg-primary';
        }
        
        // Reset state
        this.state = {
            selectedLine: null,
            checklistItems: {}
        };
        
        // Generate new ID and set current date/time
        this.$('#pcId').value = this.generateId();
        this.$('#pcNgaySanXuat').value = new Date().toISOString().split('T')[0];
        this.$('#pcGio').value = new Date().toTimeString().slice(0, 5);
        this.$('#startTime').textContent = new Date().toTimeString().slice(0, 5);
    }

    generateId() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 8);
        return `PC-${timestamp}-${random}`;
    }
}

// Register component
componentLoader.register('product-changeover', ProductChangeoverComponent);
