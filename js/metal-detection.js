// js/metal-detection.js - Metal Detection Form Module

class MetalDetectionForm {
    constructor() {
        this.formId = 'metalDetectionForm';
        this.isSubmitting = false;
        this.selectedValues = {};
    }

    initialize() {
        console.log('Initializing Metal Detection Form...');
        
        // Generate unique ID
        this.generateId();
        
        // Set current date and time
        this.setCurrentDateTime();
        
        // Setup event listeners
        this.setupEventListeners();
        
        console.log('Metal Detection Form initialized successfully');
    }

    generateId() {
        const now = new Date();
        const timestamp = now.getTime().toString(36);
        const random = Math.random().toString(36).substring(2, 8);
        const id = timestamp + random;
        
        const idField = document.getElementById('mdId');
        if (idField) {
            idField.value = id;
        }
    }

    setCurrentDateTime() {
        const now = new Date();
        
        // Set current date
        const dateField = document.getElementById('mdNgaySanXuat');
        if (dateField) {
            dateField.value = now.toISOString().split('T')[0];
        }
        
        // Set current time
        const timeField = document.getElementById('mdGioKiemTra');
        if (timeField) {
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            timeField.value = `${hours}:${minutes}`;
        }
    }

    setupEventListeners() {
        // Setup grid button listeners
        this.setupGridListeners();
        
        // Setup form submit
        const form = document.getElementById(this.formId);
        if (form) {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
        
        // Setup cancel button
        const cancelBtn = document.getElementById('mdCancelBtn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.handleCancel());
        }
        
        // Setup number input validation
        this.setupNumberInputs();
    }

    setupGridListeners() {
        const gridContainers = [
            'lineGrid', 'fe15Grid', 'fe20Grid', 'fe25Grid', 'fe30Grid',
            'inox15Grid', 'inox20Grid', 'inox30Grid', 'inox40Grid',
            'metal25Grid', 'metal30Grid', 'metal35Grid',
            'wire3Grid', 'wire7Grid', 'wire12Grid', 'wire15Grid', 'wire20Grid'
        ];

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
            'lineGrid': 'mdLine',
            'fe15Grid': 'mdFe15',
            'fe20Grid': 'mdFe20',
            'fe25Grid': 'mdFe25',
            'fe30Grid': 'mdFe30',
            'inox15Grid': 'mdInox15',
            'inox20Grid': 'mdInox20',
            'inox30Grid': 'mdInox30',
            'inox40Grid': 'mdInox40',
            'metal25Grid': 'mdMetal25',
            'metal30Grid': 'mdMetal30',
            'metal35Grid': 'mdMetal35',
            'wire3Grid': 'mdWire3',
            'wire7Grid': 'mdWire7',
            'wire12Grid': 'mdWire12',
            'wire15Grid': 'mdWire15',
            'wire20Grid': 'mdWire20'
        };

        const inputId = hiddenInputMap[gridId];
        if (inputId) {
            const input = document.getElementById(inputId);
            if (input) {
                input.value = value;
            }
        }
    }

    setupNumberInputs() {
        // Make sure number inputs are properly formatted
        const numberInputs = [
            'mdNguoiNhiemTu', 'mdSoLuongDa', 'mdSoLuongDung', 'mdNguonNhiem'
        ];

        numberInputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('input', (e) => {
                    // Ensure proper number formatting
                    let value = parseFloat(e.target.value) || 0;
                    if (inputId === 'mdNguoiNhiemTu') {
                        value = Math.round(value * 100) / 100; // 2 decimal places
                        e.target.value = value.toFixed(2);
                    } else {
                        value = Math.round(value); // Integer
                        e.target.value = value;
                    }
                });
            }
        });
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
                app.showToast('Thành công', 'Dữ liệu kiểm soát kim loại đã được lưu!', 'success');
                app.refreshDashboard?.();
            }
            
            // Reset form
            this.resetForm();
            
        } catch (error) {
            console.error('Error submitting metal detection form:', error);
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
        // Basic validation
        const requiredFields = ['mdSite'];
        
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
        
        return true;
    }

    collectFormData() {
        const getValue = (id) => {
            const element = document.getElementById(id);
            if (!element) return '';
            
            if (element.type === 'radio') {
                const checked = document.querySelector(`input[name="${element.name}"]:checked`);
                return checked ? checked.value : '';
            }
            
            return element.value || '';
        };

        const getSelectedGrid = (gridId) => {
            return this.selectedValues[gridId] || '';
        };

        return {
            // Meta
            timestamp: new Date().toISOString(),
            formType: 'metal-detection',
            
            // Basic info
            id: getValue('mdId'),
            site: getValue('mdSite'),
            maNhanVien: getValue('mdMaNhanVien'),
            ngaySanXuat: getValue('mdNgaySanXuat'),
            gioKiemTra: getValue('mdGioKiemTra'),
            
            // Detection settings
            donViQuaMayDo: document.querySelector('input[name="donViQuaMayDo"]:checked')?.value || '',
            line: getSelectedGrid('lineGrid'),
            nguoiNhiemTu: getValue('mdNguoiNhiemTu'),
            lyDoThayDoi: getValue('mdLyDoThayDoi'),
            
            // Fe standards
            fe15: getSelectedGrid('fe15Grid'),
            fe20: getSelectedGrid('fe20Grid'),
            fe25: getSelectedGrid('fe25Grid'),
            fe30: getSelectedGrid('fe30Grid'),
            
            // Inox standards
            inox15: getSelectedGrid('inox15Grid'),
            inox20: getSelectedGrid('inox20Grid'),
            inox30: getSelectedGrid('inox30Grid'),
            inox40: getSelectedGrid('inox40Grid'),
            
            // Metal color standards
            metal25: getSelectedGrid('metal25Grid'),
            metal30: getSelectedGrid('metal30Grid'),
            metal35: getSelectedGrid('metal35Grid'),
            
            // Wire standards
            wire3: getSelectedGrid('wire3Grid'),
            wire7: getSelectedGrid('wire7Grid'),
            wire12: getSelectedGrid('wire12Grid'),
            wire15: getSelectedGrid('wire15Grid'),
            wire20: getSelectedGrid('wire20Grid'),
            
            // Test results
            ketLuanTest: document.querySelector('input[name="ketLuanTest"]:checked')?.value || '',
            soLuongDa: getValue('mdSoLuongDa'),
            soLuongDung: getValue('mdSoLuongDung'),
            moTaKimLoai: getValue('mdMoTaKimLoai'),
            nguonNhiem: getValue('mdNguonNhiem'),
            
            // Image (file handling would need additional implementation)
            hinhAnh: getValue('mdHinhAnh') ? 'uploaded' : ''
        };
    }

    saveFormData(data) {
        // Save to localStorage for development
        let metalDetectionData = localStorage.getItem('qaMetalDetectionData');
        metalDetectionData = metalDetectionData ? JSON.parse(metalDetectionData) : [];
        
        metalDetectionData.push(data);
        
        // Keep only last 100 records
        if (metalDetectionData.length > 100) {
            metalDetectionData = metalDetectionData.slice(-100);
        }
        
        localStorage.setItem('qaMetalDetectionData', JSON.stringify(metalDetectionData));
        console.log('Metal detection data saved:', data.id);
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
        
        // Reset number fields
        const numberFields = ['mdNguoiNhiemTu', 'mdSoLuongDa', 'mdSoLuongDung', 'mdNguonNhiem'];
        numberFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                if (fieldId === 'mdNguoiNhiemTu') {
                    field.value = '0.00';
                } else {
                    field.value = '0';
                }
            }
        });
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
        const data = localStorage.getItem('qaMetalDetectionData');
        return data ? JSON.parse(data) : [];
    }

    // Public method to clear all stored data
    clearStoredData() {
        localStorage.removeItem('qaMetalDetectionData');
        console.log('Metal detection data cleared');
    }
}

// Global function for number input adjustment (called from HTML)
window.adjustNumber = function(inputId, delta) {
    const input = document.getElementById(inputId);
    if (input) {
        let currentValue = parseFloat(input.value) || 0;
        let newValue = currentValue + delta;
        
        // Ensure non-negative values
        newValue = Math.max(0, newValue);
        
        // Format based on input type
        if (inputId === 'mdNguoiNhiemTu') {
            input.value = newValue.toFixed(2);
        } else {
            input.value = Math.round(newValue);
        }
        
        // Trigger input event for validation
        input.dispatchEvent(new Event('input', { bubbles: true }));
    }
};

// Create global instance
const metalDetectionForm = new MetalDetectionForm();

// Auto-initialize when form becomes visible
document.addEventListener('DOMContentLoaded', function() {
    // Initialize when switching to metal detection form
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                const target = mutation.target;
                if (target.id === 'metal-detection-form' && !target.style.display.includes('none')) {
                    // Form is now visible, initialize if not already done
                    if (!metalDetectionForm.isInitialized) {
                        metalDetectionForm.initialize();
                        metalDetectionForm.isInitialized = true;
                    }
                }
            }
        });
    });
    
    const metalDetectionFormElement = document.getElementById('metal-detection-form');
    if (metalDetectionFormElement) {
        observer.observe(metalDetectionFormElement, {
            attributes: true,
            attributeFilter: ['style']
        });
    }
});
