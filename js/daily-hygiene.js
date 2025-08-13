// js/daily-hygiene.js - Daily Hygiene Assessment Form Module

class DailyHygieneForm {
    constructor() {
        this.formId = 'dailyHygieneForm';
        this.isSubmitting = false;
        this.selectedValues = {};
    }

    initialize() {
        console.log('Initializing Daily Hygiene Form...');
        
        // Generate unique ID
        this.generateId();
        
        // Set current date and time
        this.setCurrentDateTime();
        
        // Setup event listeners
        this.setupEventListeners();
        
        console.log('Daily Hygiene Form initialized successfully');
    }

    generateId() {
        const now = new Date();
        const timestamp = now.getTime().toString(36);
        const random = Math.random().toString(36).substring(2, 8);
        const id = timestamp + random;
        
        const idField = document.getElementById('dhId');
        if (idField) {
            idField.value = id;
        }
    }

    setCurrentDateTime() {
        const now = new Date();
        
        // Set current date
        const dateField = document.getElementById('dhNgay');
        if (dateField) {
            dateField.value = now.toISOString().split('T')[0];
        }
    }

    setupEventListeners() {
        // Setup grid button listeners
        this.setupGridListeners();
        
        // Setup radio button listeners
        this.setupRadioListeners();
        
        // Setup form submit
        const form = document.getElementById(this.formId);
        if (form) {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
        
        // Setup cancel button
        const cancelBtn = document.getElementById('dhCancelBtn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.handleCancel());
        }

        // Setup file input validation
        this.setupFileInputs();
    }

    setupGridListeners() {
        const gridContainers = ['dhCaSXGrid', 'dhLineGrid'];

        gridContainers.forEach(gridId => {
            const grid = document.getElementById(gridId);
            if (grid) {
                const buttons = grid.querySelectorAll('.grid-btn');
                buttons.forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        this.handleGridSelection(gridId, btn);
                    });
                });
            }
        });
    }

    handleGridSelection(gridId, selectedBtn) {
        const grid = document.getElementById(gridId);
        const buttons = grid.querySelectorAll('.grid-btn');
        const value = selectedBtn.getAttribute('data-value');
        
        // Remove selected class from all buttons in this grid
        buttons.forEach(btn => btn.classList.remove('selected'));
        
        // Add selected class to clicked button
        selectedBtn.classList.add('selected');
        
        // Store the selected value
        this.selectedValues[gridId] = value;
        
        // Update corresponding hidden input
        const hiddenInputMap = {
            'dhCaSXGrid': 'dhCaSX',
            'dhLineGrid': 'dhLine'
        };

        const inputId = hiddenInputMap[gridId];
        if (inputId) {
            const input = document.getElementById(inputId);
            if (input) {
                input.value = value;
            }
        }
    }

    setupRadioListeners() {
        // All radio button groups for assessment questions
        const radioGroups = [
            'dhBHLD', 'dhKhongDeoTrangSuc', 'dhXitConTay', 'dhNenPhongBG',
            'dhKhongCoNVL', 'dhCuaRaVao', 'dhDenBatConTrung', 'dhTuongTran',
            'dhBangChuyenMayMoc', 'dhPalletNhua', 'dhCongCuDungCu', 'dhKhayNhua',
            'dhBTPTP', 'dhKhayPE', 'dhHeThongPhun', 'dhKVGiaVi', 'dhKVThanhPham',
            'dhKetLuanChung', 'dhDeoTayDauCa', 'dhTinhTrangTayCuoiCa'
        ];

        radioGroups.forEach(groupName => {
            const radios = document.querySelectorAll(`input[name="${groupName}"]`);
            radios.forEach(radio => {
                radio.addEventListener('change', () => {
                    this.handleRadioChange(groupName, radio.value);
                });
            });
        });
    }

    handleRadioChange(groupName, value) {
        // Store the selected value
        this.selectedValues[groupName] = value;
        
        // Special handling for conclusion
        if (groupName === 'dhKetLuanChung') {
            this.toggleConditionalFields(value);
        }
    }

    toggleConditionalFields(conclusion) {
        const conditionalFields = document.getElementById('dhConditionalFields');
        if (conditionalFields) {
            if (conclusion === 'Không đạt') {
                conditionalFields.style.display = 'block';
                // Make description required
                const descField = document.getElementById('dhMoTaKhongDat');
                if (descField) {
                    descField.required = true;
                }
            } else {
                conditionalFields.style.display = 'none';
                // Remove required attribute
                const descField = document.getElementById('dhMoTaKhongDat');
                if (descField) {
                    descField.required = false;
                }
            }
        }
    }

    setupFileInputs() {
        // File input validation and preview
        const fileInputs = [
            'dhHinhAnhKhongDat1', 'dhHinhAnhKhongDat2', 
            'dhHinhAnhDat1', 'dhHinhAnhDat2'
        ];

        fileInputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('change', (e) => {
                    this.handleFileInput(e, inputId);
                });
            }
        });
    }

    handleFileInput(event, inputId) {
        const file = event.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Vui lòng chọn file hình ảnh');
                event.target.value = '';
                return;
            }
            
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('File quá lớn. Vui lòng chọn file dưới 5MB');
                event.target.value = '';
                return;
            }
            
            console.log(`File selected for ${inputId}:`, file.name);
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        
        if (this.isSubmitting) {
            return;
        }

        // Validate form
        if (!this.validateForm()) {
            return;
        }

        this.isSubmitting = true;
        
        // Show loading state
        const submitBtn = event.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Đang lưu...';
        submitBtn.disabled = true;

        try {
            // Collect form data
            const formData = this.collectFormData();
            
            // Save data
            this.saveFormData(formData);
            
            // Show success message
            if (typeof app !== 'undefined') {
                app.showToast('Thành công', 'Dữ liệu đánh giá vệ sinh đã được lưu!', 'success');
                app.refreshDashboard?.();
            }
            
            // Reset form
            this.resetForm();
            
        } catch (error) {
            console.error('Error submitting daily hygiene form:', error);
            if (typeof app !== 'undefined') {
                app.showToast('Lỗi', 'Không thể lưu dữ liệu. Vui lòng thử lại.', 'error');
            }
        } finally {
            this.isSubmitting = false;
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    validateForm() {
        // Check required fields
        const requiredFields = ['dhSite', 'dhKhuVuc', 'dhNgay'];
        
        for (const fieldId of requiredFields) {
            const field = document.getElementById(fieldId);
            if (field && !field.value.trim()) {
                if (typeof app !== 'undefined') {
                    app.showToast('Lỗi', 'Vui lòng điền đầy đủ thông tin bắt buộc', 'error');
                }
                field.focus();
                return false;
            }
        }

        // Check if Ca SX is selected
        if (!this.selectedValues['dhCaSXGrid']) {
            if (typeof app !== 'undefined') {
                app.showToast('Lỗi', 'Vui lòng chọn Ca SX', 'error');
            }
            return false;
        }

        // Check if Line is selected
        if (!this.selectedValues['dhLineGrid']) {
            if (typeof app !== 'undefined') {
                app.showToast('Lỗi', 'Vui lòng chọn Line', 'error');
            }
            return false;
        }

        // Check if conclusion is selected
        if (!this.selectedValues['dhKetLuanChung']) {
            if (typeof app !== 'undefined') {
                app.showToast('Lỗi', 'Vui lòng chọn kết luận chung', 'error');
            }
            return false;
        }

        // If conclusion is "Không đạt", check description
        if (this.selectedValues['dhKetLuanChung'] === 'Không đạt') {
            const descField = document.getElementById('dhMoTaKhongDat');
            if (!descField || !descField.value.trim()) {
                if (typeof app !== 'undefined') {
                    app.showToast('Lỗi', 'Vui lòng mô tả chi tiết khi không đạt', 'error');
                }
                if (descField) descField.focus();
                return false;
            }
        }
        
        return true;
    }

    collectFormData() {
        const getValue = (id) => {
            const element = document.getElementById(id);
            return element ? element.value : '';
        };

        const getSelectedGrid = (gridId) => {
            return this.selectedValues[gridId] || '';
        };

        const getSelectedRadio = (groupName) => {
            return this.selectedValues[groupName] || '';
        };

        const getFileInfo = (inputId) => {
            const input = document.getElementById(inputId);
            if (input && input.files && input.files[0]) {
                return {
                    name: input.files[0].name,
                    size: input.files[0].size,
                    type: input.files[0].type,
                    uploaded: true
                };
            }
            return { uploaded: false };
        };

        return {
            // Meta
            timestamp: new Date().toISOString(),
            formType: 'daily-hygiene',
            
            // Basic info
            id: getValue('dhId'),
            site: getValue('dhSite'),
            khuVuc: getValue('dhKhuVuc'),
            ngay: getValue('dhNgay'),
            caSX: getSelectedGrid('dhCaSXGrid'),
            line: getSelectedGrid('dhLineGrid'),
            
            // Assessment questions
            bhld: getSelectedRadio('dhBHLD'),
            khongDeoTrangSuc: getSelectedRadio('dhKhongDeoTrangSuc'),
            xitConTay: getSelectedRadio('dhXitConTay'),
            nenPhongBG: getSelectedRadio('dhNenPhongBG'),
            khongCoNVL: getSelectedRadio('dhKhongCoNVL'),
            cuaRaVao: getSelectedRadio('dhCuaRaVao'),
            denBatConTrung: getSelectedRadio('dhDenBatConTrung'),
            tuongTran: getSelectedRadio('dhTuongTran'),
            bangChuyenMayMoc: getSelectedRadio('dhBangChuyenMayMoc'),
            palletNhua: getSelectedRadio('dhPalletNhua'),
            congCuDungCu: getSelectedRadio('dhCongCuDungCu'),
            khayNhua: getSelectedRadio('dhKhayNhua'),
            btpTP: getSelectedRadio('dhBTPTP'),
            khayPE: getSelectedRadio('dhKhayPE'),
            heThongPhun: getSelectedRadio('dhHeThongPhun'),
            kvGiaVi: getSelectedRadio('dhKVGiaVi'),
            kvThanhPham: getSelectedRadio('dhKVThanhPham'),
            
            // Conclusion
            ketLuanChung: getSelectedRadio('dhKetLuanChung'),
            moTaKhongDat: getValue('dhMoTaKhongDat'),
            hanhDongKhacPhuc: getValue('dhHanhDongKhacPhuc'),
            
            // QA info
            qaDoanhGia: getValue('dhQADanhGia'),
            deoTayDauCa: getSelectedRadio('dhDeoTayDauCa'),
            tinhTrangTayCuoiCa: getSelectedRadio('dhTinhTrangTayCuoiCa'),
            
            // Files info (for reference - actual file handling would need additional implementation)
            hinhAnhKhongDat1: getFileInfo('dhHinhAnhKhongDat1'),
            hinhAnhKhongDat2: getFileInfo('dhHinhAnhKhongDat2'),
            hinhAnhDat1: getFileInfo('dhHinhAnhDat1'),
            hinhAnhDat2: getFileInfo('dhHinhAnhDat2')
        };
    }

    saveFormData(data) {
        // Save to localStorage for development
        let dailyHygieneData = localStorage.getItem('qaDailyHygieneData');
        dailyHygieneData = dailyHygieneData ? JSON.parse(dailyHygieneData) : [];
        
        dailyHygieneData.push(data);
        
        // Keep only last 100 records
        if (dailyHygieneData.length > 100) {
            dailyHygieneData = dailyHygieneData.slice(-100);
        }
        
        localStorage.setItem('qaDailyHygieneData', JSON.stringify(dailyHygieneData));
        console.log('Daily hygiene data saved:', data.id);
    }

    resetForm() {
        // Reset form fields
        const form = document.getElementById(this.formId);
        if (form) {
            form.reset();
        }
        
        // Clear grid selections
        document.querySelectorAll('.grid-btn.selected').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // Clear selected values
        this.selectedValues = {};
        
        // Reset date
        this.setCurrentDateTime();
        
        // Generate new ID
        this.generateId();
        
        // Hide conditional fields
        const conditionalFields = document.getElementById('dhConditionalFields');
        if (conditionalFields) {
            conditionalFields.style.display = 'none';
        }
    }

    handleCancel() {
        if (confirm('Bạn có chắc muốn hủy và xóa toàn bộ dữ liệu đã nhập?')) {
            this.resetForm();
            if (typeof app !== 'undefined') {
                app.showToast('Thông báo', 'Đã hủy và làm mới form', 'info');
            }
        }
    }

    // Public method to get form data for export/view
    getStoredData() {
        const data = localStorage.getItem('qaDailyHygieneData');
        return data ? JSON.parse(data) : [];
    }

    // Public method to clear all stored data
    clearStoredData() {
        localStorage.removeItem('qaDailyHygieneData');
        console.log('Daily hygiene data cleared');
    }
}

// Create global instance
const dailyHygieneForm = new DailyHygieneForm();

// Auto-initialize when form becomes visible
document.addEventListener('DOMContentLoaded', function() {
    // Initialize when switching to daily hygiene form
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const target = mutation.target;
                if (target.id === 'daily-hygiene-form' && target.classList.contains('active')) {
                    // Form is now active, initialize if not already done
                    if (!dailyHygieneForm.isInitialized) {
                        dailyHygieneForm.initialize();
                        dailyHygieneForm.isInitialized = true;
                    }
                }
            }
        });
    });
    
    const dailyHygieneFormElement = document.getElementById('daily-hygiene-form');
    if (dailyHygieneFormElement) {
        observer.observe(dailyHygieneFormElement, {
            attributes: true,
            attributeFilter: ['class']
        });
    }
});
