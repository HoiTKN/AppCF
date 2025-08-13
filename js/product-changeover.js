// js/product-changeover.js - Product Changeover Checklist Form Module

class ProductChangeoverForm {
    constructor() {
        this.formId = 'productChangeoverForm';
        this.isSubmitting = false;
        this.selectedValues = {};
    }

    initialize() {
        console.log('Initializing Product Changeover Form...');
        
        // Generate unique ID
        this.generateId();
        
        // Set current date and time
        this.setCurrentDateTime();
        
        // Setup event listeners
        this.setupEventListeners();
        
        console.log('Product Changeover Form initialized successfully');
    }

    generateId() {
        const now = new Date();
        const timestamp = now.getTime().toString(36);
        const random = Math.random().toString(36).substring(2, 8);
        const id = timestamp + random;
        
        const idField = document.getElementById('pcId');
        if (idField) {
            idField.value = id;
        }
    }

    setCurrentDateTime() {
        const now = new Date();
        
        // Set current date
        const dateField = document.getElementById('pcNgaySanXuat');
        if (dateField) {
            dateField.value = now.toISOString().split('T')[0];
        }
        
        // Set current time
        const timeField = document.getElementById('pcGio');
        if (timeField) {
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            timeField.value = `${hours}:${minutes}`;
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
        const cancelBtn = document.getElementById('pcCancelBtn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.handleCancel());
        }
    }

    setupGridListeners() {
        const gridContainers = ['pcLineGrid'];

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
            'pcLineGrid': 'pcLine'
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
        // All radio button groups for checklist items
        const radioGroups = [
            'pcDonDiChuyenBTP', 'pcDonDiChuyenNoiLieu', 'pcVeSinhBangTai',
            'pcVeSinhMayDispencer', 'pcVeSinhCumRungRau', 'pcVeSinhKhuonLy'
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
                app.showToast('Thành công', 'Checklist chuyển đổi sản phẩm đã được lưu!', 'success');
                app.refreshDashboard?.();
            }
            
            // Reset form
            this.resetForm();
            
        } catch (error) {
            console.error('Error submitting product changeover form:', error);
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
        const requiredFields = ['pcSite', 'pcNgaySanXuat', 'pcTenSanPham'];
        
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

        // Check if Line is selected
        if (!this.selectedValues['pcLineGrid']) {
            if (typeof app !== 'undefined') {
                app.showToast('Lỗi', 'Vui lòng chọn Line', 'error');
            }
            return false;
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

        return {
            // Meta
            timestamp: new Date().toISOString(),
            formType: 'product-changeover',
            
            // Basic info
            id: getValue('pcId'),
            site: getValue('pcSite'),
            line: getSelectedGrid('pcLineGrid'),
            ngaySanXuat: getValue('pcNgaySanXuat'),
            gio: getValue('pcGio'),
            tenSanPham: getValue('pcTenSanPham'),
            item: getValue('pcItem'),
            
            // Checklist items
            donDiChuyenBTP: getSelectedRadio('pcDonDiChuyenBTP'),
            donDiChuyenNoiLieu: getSelectedRadio('pcDonDiChuyenNoiLieu'),
            veSinhBangTai: getSelectedRadio('pcVeSinhBangTai'),
            veSinhMayDispencer: getSelectedRadio('pcVeSinhMayDispencer'),
            veSinhCumRungRau: getSelectedRadio('pcVeSinhCumRungRau'),
            veSinhKhuonLy: getSelectedRadio('pcVeSinhKhuonLy'),
            
            // Additional notes
            ghiChu: getValue('pcGhiChu'),
            nguoiThucHien: getValue('pcNguoiThucHien')
        };
    }

    saveFormData(data) {
        // Save to localStorage for development
        let productChangeoverData = localStorage.getItem('qaProductChangeoverData');
        productChangeoverData = productChangeoverData ? JSON.parse(productChangeoverData) : [];
        
        productChangeoverData.push(data);
        
        // Keep only last 100 records
        if (productChangeoverData.length > 100) {
            productChangeoverData = productChangeoverData.slice(-100);
        }
        
        localStorage.setItem('qaProductChangeoverData', JSON.stringify(productChangeoverData));
        console.log('Product changeover data saved:', data.id);
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
        
        // Reset date and time
        this.setCurrentDateTime();
        
        // Generate new ID
        this.generateId();
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
        const data = localStorage.getItem('qaProductChangeoverData');
        return data ? JSON.parse(data) : [];
    }

    // Public method to clear all stored data
    clearStoredData() {
        localStorage.removeItem('qaProductChangeoverData');
        console.log('Product changeover data cleared');
    }
}

// Create global instance
const productChangeoverForm = new ProductChangeoverForm();

// Auto-initialize when form becomes visible
document.addEventListener('DOMContentLoaded', function() {
    // Initialize when switching to product changeover form
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const target = mutation.target;
                if (target.id === 'product-changeover-form' && target.classList.contains('active')) {
                    // Form is now active, initialize if not already done
                    if (!productChangeoverForm.isInitialized) {
                        productChangeoverForm.initialize();
                        productChangeoverForm.isInitialized = true;
                    }
                }
            }
        });
    });
    
    const productChangeoverFormElement = document.getElementById('product-changeover-form');
    if (productChangeoverFormElement) {
        observer.observe(productChangeoverFormElement, {
            attributes: true,
            attributeFilter: ['class']
        });
    }
});
