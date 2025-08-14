// js/file-upload-component.js - Admin File Upload Interface

class FileUploadComponent extends BaseComponent {
    async initialize() {
        this.state = {
            isUploading: false,
            uploadProgress: 0,
            lastUpload: null,
            previewData: null,
            selectedDataType: null
        };

        this.dataTypes = [
            {
                id: 'employees',
                name: 'Nhân viên',
                description: 'File danh sách nhân viên (CSV)',
                icon: 'people',
                color: 'primary',
                sampleColumns: ['Số HC', 'Site', 'MNV', 'Tên nhân viên', 'Mail', 'Nhóm', 'Role'],
                requiredColumns: ['MNV', 'Tên nhân viên', 'Site']
            },
            {
                id: 'conditions-mi',
                name: 'Điều kiện công nghệ mì',
                description: 'File điều kiện sản xuất mì (CSV/Excel)',
                icon: 'clipboard-data',
                color: 'success',
                sampleColumns: ['Site', 'Brand', 'Tên trên DKSX', 'Mã DKSX', 'Nhiệt Đầu Min', 'Nhiệt Đầu Max', 'Brix Kansui Min', 'Brix Kansui Max'],
                requiredColumns: ['Site', 'Mã DKSX']
            },
            {
                id: 'conditions-pho',
                name: 'Điều kiện công nghệ phở',
                description: 'File điều kiện sản xuất phở (CSV/Excel)',
                icon: 'clipboard-data-fill',
                color: 'info',
                sampleColumns: ['Site', 'Brand', 'Tên trên DKSX', 'Mã DKSX', 'Baume Kansui min', 'Baume Kansui max', 'Độ ẩm vắt sau sấy Max'],
                requiredColumns: ['Site', 'Mã DKSX']
            }
        ];
    }

    async render() {
        if (!employeeManager.isManager()) {
            this.container.innerHTML = this.renderAccessDenied();
            return;
        }

        this.container.innerHTML = `
            <div class="fade-in">
                <!-- Page Header -->
                <div class="page-header mb-4">
                    <h2 class="page-title">
                        <i class="bi bi-cloud-upload me-2"></i>
                        Quản lý dữ liệu chính
                    </h2>
                    <p class="text-muted">Upload và cập nhật các file dữ liệu master của hệ thống</p>
                </div>

                <!-- Quick Stats -->
                <div class="row g-3 mb-4">
                    <div class="col-md-4">
                        <div class="stat-card">
                            <div class="stat-icon primary">
                                <i class="bi bi-people"></i>
                            </div>
                            <div class="stat-value">${masterDataManager.employeesData.length}</div>
                            <div class="stat-label">Nhân viên</div>
                            <div class="stat-change">
                                <small class="text-muted">Cập nhật: ${this.getLastUpdateTime('employees')}</small>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="stat-card">
                            <div class="stat-icon success">
                                <i class="bi bi-clipboard-data"></i>
                            </div>
                            <div class="stat-value">${masterDataManager.processConditionsMi.length}</div>
                            <div class="stat-label">Điều kiện mì</div>
                            <div class="stat-change">
                                <small class="text-muted">Cập nhật: ${this.getLastUpdateTime('conditions-mi')}</small>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="stat-card">
                            <div class="stat-icon info">
                                <i class="bi bi-clipboard-data-fill"></i>
                            </div>
                            <div class="stat-value">${masterDataManager.processConditionsPho.length}</div>
                            <div class="stat-label">Điều kiện phở</div>
                            <div class="stat-change">
                                <small class="text-muted">Cập nhật: ${this.getLastUpdateTime('conditions-pho')}</small>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Data Type Selection -->
                <div class="modern-card mb-4">
                    <div class="card-header">
                        <h5 class="card-title mb-0">
                            <i class="bi bi-gear me-2"></i>
                            Chọn loại dữ liệu cần cập nhật
                        </h5>
                    </div>
                    <div class="card-body">
                        <div class="row g-3">
                            ${this.renderDataTypeCards()}
                        </div>
                    </div>
                </div>

                <!-- Upload Section -->
                <div class="modern-card" id="uploadSection" style="display: none;">
                    <div class="card-header">
                        <h5 class="card-title mb-0" id="uploadTitle">
                            <i class="bi bi-upload me-2"></i>
                            Upload File
                        </h5>
                    </div>
                    <div class="card-body">
                        <!-- File Upload Area -->
                        <div class="upload-area mb-4" id="uploadArea">
                            <div class="upload-drop-zone" id="dropZone">
                                <div class="text-center p-4">
                                    <i class="bi bi-cloud-upload text-primary mb-3" style="font-size: 3rem;"></i>
                                    <h5>Kéo thả file vào đây hoặc click để chọn</h5>
                                    <p class="text-muted mb-3">Hỗ trợ: CSV, Excel (.xlsx)</p>
                                    <input type="file" id="fileInput" class="d-none" accept=".csv,.xlsx,.xls">
                                    <button class="btn btn-primary" id="selectFileBtn">
                                        <i class="bi bi-folder2-open me-2"></i>
                                        Chọn file
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- File Info -->
                        <div id="fileInfo" style="display: none;" class="alert alert-info">
                            <div class="d-flex align-items-center">
                                <i class="bi bi-file-earmark-text me-2"></i>
                                <div class="flex-grow-1">
                                    <strong id="fileName">file.csv</strong>
                                    <div class="small text-muted">
                                        Size: <span id="fileSize">0 KB</span> | 
                                        Type: <span id="fileType">CSV</span>
                                    </div>
                                </div>
                                <button class="btn btn-sm btn-outline-danger" id="removeFileBtn">
                                    <i class="bi bi-x"></i>
                                </button>
                            </div>
                        </div>

                        <!-- Preview Section -->
                        <div id="previewSection" style="display: none;">
                            <h6 class="mb-3">
                                <i class="bi bi-eye me-2"></i>
                                Xem trước dữ liệu (5 dòng đầu)
                            </h6>
                            <div class="table-responsive mb-3">
                                <table class="table table-sm table-bordered" id="previewTable">
                                    <thead class="table-light"></thead>
                                    <tbody></tbody>
                                </table>
                            </div>
                            <div class="preview-stats mb-3" id="previewStats"></div>
                        </div>

                        <!-- Validation Results -->
                        <div id="validationResults" style="display: none;"></div>

                        <!-- Upload Progress -->
                        <div id="uploadProgress" style="display: none;" class="mb-3">
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <span>Đang xử lý dữ liệu...</span>
                                <span id="progressPercent">0%</span>
                            </div>
                            <div class="progress">
                                <div class="progress-bar progress-bar-striped progress-bar-animated" 
                                     id="progressBar" style="width: 0%"></div>
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div class="d-flex justify-content-end gap-2">
                            <button class="btn btn-secondary" id="cancelUploadBtn">
                                <i class="bi bi-x-circle me-2"></i>
                                Hủy
                            </button>
                            <button class="btn btn-primary" id="processFileBtn" disabled>
                                <i class="bi bi-check-circle me-2"></i>
                                Xử lý dữ liệu
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Data Management -->
                <div class="modern-card mt-4">
                    <div class="card-header">
                        <h5 class="card-title mb-0">
                            <i class="bi bi-database me-2"></i>
                            Quản lý dữ liệu hiện tại
                        </h5>
                    </div>
                    <div class="card-body">
                        <div class="row g-3">
                            <div class="col-md-4">
                                <button class="btn btn-outline-primary w-100" onclick="app.viewMasterData('employees')">
                                    <i class="bi bi-people me-2"></i>
                                    Xem danh sách nhân viên
                                </button>
                            </div>
                            <div class="col-md-4">
                                <button class="btn btn-outline-success w-100" onclick="app.viewMasterData('conditions-mi')">
                                    <i class="bi bi-clipboard-data me-2"></i>
                                    Xem điều kiện mì
                                </button>
                            </div>
                            <div class="col-md-4">
                                <button class="btn btn-outline-info w-100" onclick="app.viewMasterData('conditions-pho')">
                                    <i class="bi bi-clipboard-data-fill me-2"></i>
                                    Xem điều kiện phở
                                </button>
                            </div>
                        </div>
                        
                        <hr class="my-3">
                        
                        <div class="row g-3">
                            <div class="col-md-6">
                                <h6 class="text-muted mb-2">Export dữ liệu</h6>
                                <div class="btn-group w-100" role="group">
                                    <button class="btn btn-outline-secondary" onclick="masterDataManager.exportToCSV('employees')">
                                        <i class="bi bi-download me-1"></i>
                                        Nhân viên
                                    </button>
                                    <button class="btn btn-outline-secondary" onclick="masterDataManager.exportToCSV('conditions-mi')">
                                        <i class="bi bi-download me-1"></i>
                                        Điều kiện mì
                                    </button>
                                    <button class="btn btn-outline-secondary" onclick="masterDataManager.exportToCSV('conditions-pho')">
                                        <i class="bi bi-download me-1"></i>
                                        Điều kiện phở
                                    </button>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <h6 class="text-muted mb-2">Backup & Sync</h6>
                                <div class="d-flex gap-2">
                                    <button class="btn btn-outline-warning flex-fill" onclick="app.backupMasterData()">
                                        <i class="bi bi-cloud-arrow-up me-2"></i>
                                        Backup
                                    </button>
                                    <button class="btn btn-outline-info flex-fill" onclick="app.syncMasterData()">
                                        <i class="bi bi-arrow-repeat me-2"></i>
                                        Sync
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>
                .upload-drop-zone {
                    border: 2px dashed #dee2e6;
                    border-radius: 0.5rem;
                    transition: all 0.3s ease;
                    background: var(--bg-tertiary);
                }

                .upload-drop-zone:hover,
                .upload-drop-zone.dragover {
                    border-color: var(--primary);
                    background: rgba(37, 99, 235, 0.05);
                    transform: translateY(-2px);
                }

                .data-type-card {
                    cursor: pointer;
                    transition: all 0.3s ease;
                    border: 2px solid transparent;
                }

                .data-type-card:hover {
                    transform: translateY(-2px);
                    box-shadow: var(--shadow-md);
                }

                .data-type-card.selected {
                    border-color: var(--primary);
                    background: rgba(37, 99, 235, 0.05);
                }

                .preview-stats .stat-item {
                    display: inline-block;
                    margin-right: 1rem;
                    padding: 0.25rem 0.5rem;
                    background: var(--bg-tertiary);
                    border-radius: 0.25rem;
                    font-size: 0.875rem;
                }
            </style>
        `;

        this.attachEventListeners();
    }

    renderDataTypeCards() {
        return this.dataTypes.map(type => `
            <div class="col-lg-4">
                <div class="data-type-card modern-card h-100" data-type="${type.id}">
                    <div class="card-body text-center">
                        <div class="mb-3">
                            <i class="bi bi-${type.icon} text-${type.color}" style="font-size: 2.5rem;"></i>
                        </div>
                        <h6 class="card-title">${type.name}</h6>
                        <p class="card-text text-muted small">${type.description}</p>
                        <div class="mt-3">
                            <button class="btn btn-outline-${type.color} btn-sm">
                                <i class="bi bi-upload me-1"></i>
                                Chọn loại này
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderAccessDenied() {
        return `
            <div class="text-center py-5">
                <i class="bi bi-shield-x text-danger" style="font-size: 4rem;"></i>
                <h3 class="mt-3 text-danger">Không có quyền truy cập</h3>
                <p class="text-muted">Chỉ quản lý mới có thể upload và quản lý dữ liệu master</p>
                <button class="btn btn-primary" onclick="app.navigateTo('dashboard')">
                    Về trang chủ
                </button>
            </div>
        `;
    }

    attachEventListeners() {
        // Data type selection
        this.$$('.data-type-card').forEach(card => {
            this.addEventListener(card, 'click', () => {
                const type = card.dataset.type;
                this.selectDataType(type);
            });
        });

        // File upload
        const fileInput = this.$('#fileInput');
        const selectFileBtn = this.$('#selectFileBtn');
        const dropZone = this.$('#dropZone');

        if (selectFileBtn) {
            this.addEventListener(selectFileBtn, 'click', () => fileInput.click());
        }

        if (fileInput) {
            this.addEventListener(fileInput, 'change', (e) => this.handleFileSelect(e));
        }

        // Drag and drop
        if (dropZone) {
            this.addEventListener(dropZone, 'dragover', (e) => this.handleDragOver(e));
            this.addEventListener(dropZone, 'dragleave', (e) => this.handleDragLeave(e));
            this.addEventListener(dropZone, 'drop', (e) => this.handleFileDrop(e));
        }

        // Action buttons
        const removeFileBtn = this.$('#removeFileBtn');
        const processFileBtn = this.$('#processFileBtn');
        const cancelUploadBtn = this.$('#cancelUploadBtn');

        if (removeFileBtn) {
            this.addEventListener(removeFileBtn, 'click', () => this.removeFile());
        }

        if (processFileBtn) {
            this.addEventListener(processFileBtn, 'click', () => this.processFile());
        }

        if (cancelUploadBtn) {
            this.addEventListener(cancelUploadBtn, 'click', () => this.cancelUpload());
        }
    }

    selectDataType(typeId) {
        this.state.selectedDataType = typeId;
        const selectedType = this.dataTypes.find(t => t.id === typeId);
        
        // Update UI
        this.$$('.data-type-card').forEach(card => {
            card.classList.remove('selected');
        });
        this.$(`[data-type="${typeId}"]`).classList.add('selected');
        
        // Show upload section
        const uploadSection = this.$('#uploadSection');
        const uploadTitle = this.$('#uploadTitle');
        
        if (uploadSection && uploadTitle) {
            uploadSection.style.display = 'block';
            uploadTitle.innerHTML = `
                <i class="bi bi-upload me-2"></i>
                Upload ${selectedType.name}
            `;
        }

        // Show sample format
        this.showSampleFormat(selectedType);
    }

    showSampleFormat(dataType) {
        const dropZone = this.$('#dropZone');
        if (dropZone) {
            dropZone.innerHTML = `
                <div class="text-center p-4">
                    <i class="bi bi-${dataType.icon} text-${dataType.color} mb-3" style="font-size: 3rem;"></i>
                    <h5>Upload ${dataType.name}</h5>
                    <p class="text-muted mb-2">${dataType.description}</p>
                    
                    <div class="alert alert-info text-start mb-3">
                        <h6 class="alert-heading">Cột bắt buộc:</h6>
                        <code>${dataType.requiredColumns.join(', ')}</code>
                        
                        <h6 class="alert-heading mt-2">Cột mẫu:</h6>
                        <small><code>${dataType.sampleColumns.join(', ')}</code></small>
                    </div>
                    
                    <input type="file" id="fileInput" class="d-none" accept=".csv,.xlsx,.xls">
                    <button class="btn btn-${dataType.color}" id="selectFileBtn">
                        <i class="bi bi-folder2-open me-2"></i>
                        Chọn file ${dataType.name}
                    </button>
                </div>
            `;
            
            // Reattach listeners
            this.reattachFileListeners();
        }
    }

    reattachFileListeners() {
        const fileInput = this.$('#fileInput');
        const selectFileBtn = this.$('#selectFileBtn');
        
        if (selectFileBtn) {
            this.addEventListener(selectFileBtn, 'click', () => fileInput.click());
        }
        
        if (fileInput) {
            this.addEventListener(fileInput, 'change', (e) => this.handleFileSelect(e));
        }
    }

    handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        this.$('#dropZone').classList.add('dragover');
    }

    handleDragLeave(e) {
        e.preventDefault();
        e.stopPropagation();
        this.$('#dropZone').classList.remove('dragover');
    }

    handleFileDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        this.$('#dropZone').classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.processSelectedFile(files[0]);
        }
    }

    handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            this.processSelectedFile(file);
        }
    }

    async processSelectedFile(file) {
        // Validate file
        if (!this.validateFile(file)) {
            return;
        }

        this.state.selectedFile = file;

        // Show file info
        this.showFileInfo(file);

        try {
            // Parse and preview file
            const data = await this.parseFile(file);
            this.state.previewData = data;
            
            // Show preview
            this.showPreview(data);
            
            // Validate data
            this.validateData(data);
            
            // Enable process button
            this.$('#processFileBtn').disabled = false;
            
        } catch (error) {
            console.error('Error processing file:', error);
            this.showToast('Lỗi', `Không thể đọc file: ${error.message}`, 'error');
        }
    }

    validateFile(file) {
        const maxSize = 10 * 1024 * 1024; // 10MB
        const allowedTypes = [
            'text/csv',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ];
        
        if (file.size > maxSize) {
            this.showToast('Lỗi', 'File quá lớn. Tối đa 10MB.', 'error');
            return false;
        }
        
        if (!allowedTypes.includes(file.type) && !file.name.endsWith('.csv')) {
            this.showToast('Lỗi', 'Chỉ hỗ trợ file CSV và Excel (.xlsx)', 'error');
            return false;
        }
        
        return true;
    }

    showFileInfo(file) {
        const fileInfo = this.$('#fileInfo');
        const fileName = this.$('#fileName');
        const fileSize = this.$('#fileSize');
        const fileType = this.$('#fileType');
        
        if (fileInfo) {
            fileName.textContent = file.name;
            fileSize.textContent = this.formatFileSize(file.size);
            fileType.textContent = file.name.endsWith('.csv') ? 'CSV' : 'Excel';
            fileInfo.style.display = 'block';
        }
    }

    async parseFile(file) {
        if (file.name.endsWith('.csv')) {
            return await this.parseCSVFile(file);
        } else {
            // For Excel files, you'd need a library like SheetJS
            throw new Error('Excel parsing not implemented yet. Please use CSV files.');
        }
    }

    async parseCSVFile(file) {
        const text = await file.text();
        const lines = text.split('\n');
        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        const rows = [];
        
        for (let i = 1; i < Math.min(lines.length, 100); i++) { // Preview first 100 rows
            if (lines[i].trim()) {
                const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
                const row = {};
                headers.forEach((header, index) => {
                    row[header] = values[index] || '';
                });
                rows.push(row);
            }
        }
        
        return { headers, rows, totalRows: lines.length - 1 };
    }

    showPreview(data) {
        const previewSection = this.$('#previewSection');
        const previewTable = this.$('#previewTable');
        const previewStats = this.$('#previewStats');
        
        if (!previewSection || !previewTable || !previewStats) return;
        
        // Show table header
        const thead = previewTable.querySelector('thead');
        thead.innerHTML = `
            <tr>
                ${data.headers.map(header => `<th>${header}</th>`).join('')}
            </tr>
        `;
        
        // Show preview rows (first 5)
        const tbody = previewTable.querySelector('tbody');
        tbody.innerHTML = data.rows.slice(0, 5).map(row => `
            <tr>
                ${data.headers.map(header => `<td>${row[header] || ''}</td>`).join('')}
            </tr>
        `).join('');
        
        // Show stats
        previewStats.innerHTML = `
            <div class="stat-item">
                <strong>Tổng dòng:</strong> ${data.totalRows}
            </div>
            <div class="stat-item">
                <strong>Cột:</strong> ${data.headers.length}
            </div>
            <div class="stat-item">
                <strong>Xem trước:</strong> ${Math.min(5, data.rows.length)} dòng
            </div>
        `;
        
        previewSection.style.display = 'block';
    }

    validateData(data) {
        const selectedType = this.dataTypes.find(t => t.id === this.state.selectedDataType);
        const validationResults = this.$('#validationResults');
        
        if (!selectedType || !validationResults) return;
        
        const missingColumns = selectedType.requiredColumns.filter(col => 
            !data.headers.includes(col)
        );
        
        let validationHtml = '';
        
        if (missingColumns.length > 0) {
            validationHtml += `
                <div class="alert alert-danger">
                    <h6 class="alert-heading">
                        <i class="bi bi-exclamation-triangle me-2"></i>
                        Thiếu cột bắt buộc
                    </h6>
                    <p>Các cột sau đây bắt buộc phải có:</p>
                    <code>${missingColumns.join(', ')}</code>
                </div>
            `;
            this.$('#processFileBtn').disabled = true;
        } else {
            validationHtml += `
                <div class="alert alert-success">
                    <h6 class="alert-heading">
                        <i class="bi bi-check-circle me-2"></i>
                        Dữ liệu hợp lệ
                    </h6>
                    <p>Tất cả cột bắt buộc đều có. Sẵn sàng xử lý dữ liệu.</p>
                </div>
            `;
        }
        
        validationResults.innerHTML = validationHtml;
        validationResults.style.display = 'block';
    }

    async processFile() {
        if (!this.state.previewData || !this.state.selectedDataType) {
            return;
        }

        this.state.isUploading = true;
        this.$('#processFileBtn').disabled = true;
        
        // Show progress
        const progressSection = this.$('#uploadProgress');
        const progressBar = this.$('#progressBar');
        const progressPercent = this.$('#progressPercent');
        
        progressSection.style.display = 'block';
        
        try {
            // Simulate processing progress
            for (let i = 0; i <= 100; i += 10) {
                await this.delay(100);
                progressBar.style.width = `${i}%`;
                progressPercent.textContent = `${i}%`;
            }
            
            // Process the data
            await masterDataManager.uploadCSVFile(this.state.selectedFile, this.state.selectedDataType);
            
            // Success
            this.showToast('Thành công', 'Dữ liệu đã được cập nhật thành công!', 'success');
            
            // Reset form
            this.resetUploadForm();
            
            // Refresh stats
            this.updateStats();
            
        } catch (error) {
            console.error('Error processing file:', error);
            this.showToast('Lỗi', `Không thể xử lý dữ liệu: ${error.message}`, 'error');
        } finally {
            this.state.isUploading = false;
            progressSection.style.display = 'none';
            this.$('#processFileBtn').disabled = false;
        }
    }

    removeFile() {
        this.state.selectedFile = null;
        this.state.previewData = null;
        
        // Hide sections
        this.$('#fileInfo').style.display = 'none';
        this.$('#previewSection').style.display = 'none';
        this.$('#validationResults').style.display = 'none';
        
        // Reset file input
        this.$('#fileInput').value = '';
        
        // Disable process button
        this.$('#processFileBtn').disabled = true;
        
        // Reset drop zone
        const selectedType = this.dataTypes.find(t => t.id === this.state.selectedDataType);
        if (selectedType) {
            this.showSampleFormat(selectedType);
        }
    }

    cancelUpload() {
        this.resetUploadForm();
        this.$('#uploadSection').style.display = 'none';
        this.state.selectedDataType = null;
        
        // Remove selection
        this.$$('.data-type-card').forEach(card => {
            card.classList.remove('selected');
        });
    }

    resetUploadForm() {
        this.removeFile();
        this.state.selectedFile = null;
        this.state.previewData = null;
        this.state.isUploading = false;
    }

    updateStats() {
        // Update the stats cards
        const statsCards = this.$$('.stat-value');
        if (statsCards.length >= 3) {
            statsCards[0].textContent = masterDataManager.employeesData.length;
            statsCards[1].textContent = masterDataManager.processConditionsMi.length;
            statsCards[2].textContent = masterDataManager.processConditionsPho.length;
        }
    }

    getLastUpdateTime(type) {
        const lastSync = localStorage.getItem('masterDataLastSync');
        if (lastSync) {
            return new Date(lastSync).toLocaleDateString('vi-VN');
        }
        return 'Chưa cập nhật';
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Register component
componentLoader.register('file-upload', FileUploadComponent);
