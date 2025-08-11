// js/form.js - Updated for Sidebar Navigation App

class FormManager {
    constructor() {
        this.currentParameters = null;
        this.isSubmitting = false;
    }

    initialize() {
        // Setup form field listeners
        this.setupFieldListeners();
        
        // Initialize form with current time
        const now = new Date();
        const timeStr = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        
        // Auto-generate ID
        const randomId = Math.random().toString(36).substring(2, 10);
        const idField = document.createElement('input');
        idField.type = 'hidden';
        idField.id = 'recordId';
        idField.value = randomId;
        
        const form = document.getElementById('processDataForm');
        if (form) {
            form.appendChild(idField);
        }
    }

    setupFieldListeners() {
        // Site change listener
        const siteSelect = document.getElementById('site');
        if (siteSelect) {
            siteSelect.addEventListener('change', () => {
                this.filterProductCodes();
            });
        }

        // Product code change listener
        const maDKSXSelect = document.getElementById('maDKSX');
        if (maDKSXSelect) {
            maDKSXSelect.addEventListener('change', () => {
                this.loadProductParameters();
            });
        }

        // Add validation listeners for numeric fields
        const numericFields = [
            'brixKansui', 'nhietDoKansui', 'brixSeasoning', 'doDayLaBot',
            'nhietDauTrai', 'nhietDauPhai', 'nhietGiua1Trai', 'nhietGiua1Phai',
            'nhietGiua2Trai', 'nhietGiua2Phai', 'nhietGiua3Trai', 'nhietGiua3Phai',
            'nhietCuoiTrai', 'nhietCuoiPhai'
        ];

        numericFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('blur', () => {
                    this.validateField(fieldId);
                });
            }
        });
    }

    async loadParameters() {
        try {
            console.log('Loading parameters from SharePoint...');
            const parameters = await sharepointManager.getParameters();
            
            if (parameters && parameters.length > 0) {
                // Populate product codes dropdown
                const maDKSXSelect = document.getElementById('maDKSX');
                if (maDKSXSelect) {
                    maDKSXSelect.innerHTML = '<option value="">Chọn mã ĐKSX...</option>';
                    
                    // Get unique product codes
                    const uniqueCodes = new Set();
                    parameters.forEach(param => {
                        const fields = param.fields || param;
                        const code = fields['M_x00e3__x0020__x0110_KSX'] || fields['MaDKSX'];
                        if (code) {
                            uniqueCodes.add(code);
                        }
                    });
                    
                    // Add to dropdown
                    Array.from(uniqueCodes).sort().forEach(code => {
                        const option = document.createElement('option');
                        option.value = code;
                        option.textContent = code;
                        maDKSXSelect.appendChild(option);
                    });
                    
                    console.log(`Loaded ${uniqueCodes.size} product codes`);
                }
            }
        } catch (error) {
            console.error('Error loading parameters:', error);
            if (typeof app !== 'undefined') {
                app.showToast('Cảnh báo', 'Không thể tải thông số sản phẩm', 'warning');
            }
        }
    }

    filterProductCodes() {
        const site = document.getElementById('site')?.value;
        const maDKSXSelect = document.getElementById('maDKSX');
        
        if (!site || !maDKSXSelect) {
            return;
        }
        
        // Filter product codes based on site
        const allOptions = maDKSXSelect.querySelectorAll('option');
        allOptions.forEach(option => {
            if (option.value && option.value.includes(site)) {
                option.style.display = 'block';
            } else if (option.value) {
                option.style.display = 'none';
            }
        });
    }

    loadProductParameters() {
        const maDKSX = document.getElementById('maDKSX')?.value;
        
        if (!maDKSX) {
            this.clearParameterDisplay();
            return;
        }
        
        // Get parameters for selected product
        const params = sharepointManager.getParameterByCode(maDKSX);
        
        if (params) {
            this.currentParameters = params;
            
            // Display product name
            const productName = params['T_x00ea_n_x0020_tr_x00ea_n_x00'] || params['TenTrenDKSX'] || '-';
            const productNameElement = document.getElementById('productName');
            if (productNameElement) {
                productNameElement.textContent = productName;
            }
            
            // Display validation ranges
            this.displayValidationRanges(params);
        } else {
            this.clearParameterDisplay();
        }
    }

    displayValidationRanges(params) {
        // Brix Kansui range
        const brixKanMin = params['Brix_x0020_Kansui_x0020_Min'] || params['BrixKansuiMin'] || 7;
        const brixKanMax = params['Brix_x0020_Kansui_x0020_Max'] || params['BrixKansuiMax'] || 10;
        const brixKansuiRange = document.getElementById('brixKansuiRange');
        if (brixKansuiRange) {
            brixKansuiRange.textContent = `${brixKanMin} - ${brixKanMax}`;
        }
        
        // Temperature Kansui range
        const tempKanMin = params['Nhi_x1ec7_t_x0020_Kanshui_x00'] || params['NhietKanshuiMin'] || 15;
        const tempKanMax = params['Nhi_x1ec7_t_x0020_Kanshui_x000'] || params['NhietKanshuiMax'] || 30;
        const nhietKansuiRange = document.getElementById('nhietKansuiRange');
        if (nhietKansuiRange) {
            nhietKansuiRange.textContent = `${tempKanMin} - ${tempKanMax}°C`;
        }
        
        // Brix Seasoning range
        const brixSeaMin = params['Brix_x0020_Sea_x0020_Min'] || params['BrixSeaMin'] || 0;
        const brixSeaMax = params['Brix_x0020_Sea_x0020_Max'] || params['BrixSeaMax'] || 50;
        const brixSeaRange = document.getElementById('brixSeaRange');
        if (brixSeaRange) {
            brixSeaRange.textContent = `${brixSeaMin} - ${brixSeaMax}`;
        }
        
        // Thickness range
        const thickMin = params['_x0110__x1ed9__x0020_d_x00e0_y_x0'] || params['DoDayLaBotMin'] || 0.5;
        const thickMax = params['_x0110__x1ed9__x0020_d_x00e0_y_x1'] || params['DoDayLaBotMax'] || 2.0;
        const doDayRange = document.getElementById('doDayRange');
        if (doDayRange) {
            doDayRange.textContent = `${thickMin} - ${thickMax} mm`;
        }
    }

    clearParameterDisplay() {
        const elements = ['productName', 'brixKansuiRange', 'nhietKansuiRange', 'brixSeaRange', 'doDayRange'];
        elements.forEach(elementId => {
            const element = document.getElementById(elementId);
            if (element) {
                element.textContent = '-';
            }
        });
        this.currentParameters = null;
    }

    validateField(fieldId) {
        const field = document.getElementById(fieldId);
        if (!field) return true;
        
        const value = parseFloat(field.value);
        
        if (!field.value || !this.currentParameters) {
            return true;
        }
        
        let min, max;
        let isValid = true;
        
        // Get validation range based on field
        switch(fieldId) {
            case 'brixKansui':
                min = this.currentParameters['Brix_x0020_Kansui_x0020_Min'] || 7;
                max = this.currentParameters['Brix_x0020_Kansui_x0020_Max'] || 10;
                break;
            case 'nhietDoKansui':
                min = this.currentParameters['Nhi_x1ec7_t_x0020_Kanshui_x00'] || 15;
                max = this.currentParameters['Nhi_x1ec7_t_x0020_Kanshui_x000'] || 30;
                break;
            case 'brixSeasoning':
                min = this.currentParameters['Brix_x0020_Sea_x0020_Min'] || 0;
                max = this.currentParameters['Brix_x0020_Sea_x0020_Max'] || 50;
                break;
            case 'doDayLaBot':
                min = this.currentParameters['_x0110__x1ed9__x0020_d_x00e0_y_x0'] || 0.5;
                max = this.currentParameters['_x0110__x1ed9__x0020_d_x00e0_y_x1'] || 2.0;
                break;
            default:
                // Temperature fields
                if (fieldId.includes('Dau')) {
                    min = this.currentParameters['Nhi_x1ec7_t_x0020__x0110__x1ea7_'] || 140;
                    max = this.currentParameters['Nhi_x1ec7_t_x0020__x0110__x1ea7_0'] || 180;
                } else if (fieldId.includes('Giua')) {
                    min = this.currentParameters['Nhi_x1ec7_t_x0020_Gi_x1eef_a_x0'] || 140;
                    max = this.currentParameters['Nhi_x1ec7_t_x0020_Gi_x1eef_a_x00'] || 180;
                } else if (fieldId.includes('Cuoi')) {
                    min = this.currentParameters['Nhi_x1ec7_t_x0020_Cu_x1ed1_i_x0'] || 140;
                    max = this.currentParameters['Nhi_x1ec7_t_x0020_Cu_x1ed1_i_x00'] || 180;
                }
        }
        
        // Check if value is within range
        if (min !== undefined && max !== undefined) {
            isValid = value >= min && value <= max;
            
            if (!isValid) {
                field.classList.add('is-invalid');
                if (typeof app !== 'undefined') {
                    app.showToast('Cảnh báo', `Giá trị nằm ngoài khoảng cho phép (${min} - ${max})`, 'warning');
                }
            } else {
                field.classList.remove('is-invalid');
                field.classList.add('is-valid');
            }
        }
        
        return isValid;
    }

    clearValidation() {
        const form = document.getElementById('processDataForm');
        if (!form) return;
        
        form.classList.remove('was-validated');
        
        // Remove validation classes
        const fields = form.querySelectorAll('.is-valid, .is-invalid');
        fields.forEach(field => {
            field.classList.remove('is-valid', 'is-invalid');
        });
    }

    async handleSubmit(event) {
        event.preventDefault();
        
        if (this.isSubmitting) {
            return;
        }
        
        const form = event.target;
        
        // Check form validity
        if (!form.checkValidity()) {
            event.stopPropagation();
            form.classList.add('was-validated');
            if (typeof app !== 'undefined') {
                app.showToast('Lỗi', 'Vui lòng điền đầy đủ thông tin bắt buộc', 'error');
            }
            return;
        }
        
        this.isSubmitting = true;
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Đang lưu...';
        submitBtn.disabled = true;
        
        try {
            // Collect form data
            const formData = this.collectFormData();
            
            // Save to SharePoint or localStorage
            await sharepointManager.createItem(formData);
            
            if (typeof app !== 'undefined') {
                app.showToast('Thành công', 'Dữ liệu đã được lưu thành công!', 'success');
                
                // Refresh dashboard if it exists
                if (typeof app.refreshDashboard === 'function') {
                    app.refreshDashboard();
                }
            }
            
            // Reset form
            form.reset();
            this.clearValidation();
            this.clearParameterDisplay();
            
        } catch (error) {
            console.error('Submit error:', error);
            
            if (typeof app !== 'undefined') {
                if (error.message.includes('Offline')) {
                    app.showToast('Thông báo', 'Dữ liệu đã được lưu offline', 'warning');
                } else {
                    app.showToast('Lỗi', 'Không thể lưu dữ liệu. Vui lòng thử lại.', 'error');
                }
            }
        } finally {
            this.isSubmitting = false;
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        }
    }

    collectFormData() {
        const getElementValue = (id) => {
            const element = document.getElementById(id);
            return element ? element.value : '';
        };
        
        const getElementText = (id) => {
            const element = document.getElementById(id);
            return element ? element.textContent : '';
        };
        
        const formData = {
            // Basic info
            site: getElementValue('site'),
            maNhanVien: getElementValue('maNhanVien'),
            lineSX: getElementValue('lineSX'),
            maDKSX: getElementValue('maDKSX'),
            sanPham: getElementText('productName'),
            
            // Kansui
            brixKansui: getElementValue('brixKansui'),
            nhietDoKansui: getElementValue('nhietDoKansui'),
            ngoaiQuanKansui: getElementValue('ngoaiQuanKansui'),
            
            // Seasoning
            brixSeasoning: getElementValue('brixSeasoning'),
            ngoaiQuanSeasoning: getElementValue('ngoaiQuanSeasoning'),
            doDayLaBot: getElementValue('doDayLaBot'),
            
            // Temperature
            nhietDauTrai: getElementValue('nhietDauTrai'),
            nhietDauPhai: getElementValue('nhietDauPhai'),
            nhietGiua1Trai: getElementValue('nhietGiua1Trai'),
            nhietGiua1Phai: getElementValue('nhietGiua1Phai'),
            nhietGiua2Trai: getElementValue('nhietGiua2Trai'),
            nhietGiua2Phai: getElementValue('nhietGiua2Phai'),
            nhietGiua3Trai: getElementValue('nhietGiua3Trai'),
            nhietGiua3Phai: getElementValue('nhietGiua3Phai'),
            nhietCuoiTrai: getElementValue('nhietCuoiTrai'),
            nhietCuoiPhai: getElementValue('nhietCuoiPhai'),
            
            // Sensory
            camQuanCoTinh: getElementValue('camQuanCoTinh'),
            camQuanMau: getElementValue('camQuanMau'),
            camQuanMui: getElementValue('camQuanMui'),
            camQuanVi: getElementValue('camQuanVi')
        };
        
        return formData;
    }

    // Helper method to populate form with data (for editing)
    populateForm(data) {
        const setElementValue = (id, value) => {
            const element = document.getElementById(id);
            if (element && value !== undefined && value !== null) {
                element.value = value;
            }
        };
        
        // Basic info
        setElementValue('site', data.site);
        setElementValue('maNhanVien', data.maNhanVien);
        setElementValue('lineSX', data.lineSX);
        setElementValue('maDKSX', data.maDKSX);
        
        // Trigger product parameter loading
        if (data.maDKSX) {
            this.loadProductParameters();
        }
        
        // Kansui
        setElementValue('brixKansui', data.brixKansui);
        setElementValue('nhietDoKansui', data.nhietDoKansui);
        setElementValue('ngoaiQuanKansui', data.ngoaiQuanKansui);
        
        // Seasoning
        setElementValue('brixSeasoning', data.brixSeasoning);
        setElementValue('ngoaiQuanSeasoning', data.ngoaiQuanSeasoning);
        setElementValue('doDayLaBot', data.doDayLaBot);
        
        // Temperature
        setElementValue('nhietDauTrai', data.nhietDauTrai);
        setElementValue('nhietDauPhai', data.nhietDauPhai);
        setElementValue('nhietGiua1Trai', data.nhietGiua1Trai);
        setElementValue('nhietGiua1Phai', data.nhietGiua1Phai);
        setElementValue('nhietGiua2Trai', data.nhietGiua2Trai);
        setElementValue('nhietGiua2Phai', data.nhietGiua2Phai);
        setElementValue('nhietGiua3Trai', data.nhietGiua3Trai);
        setElementValue('nhietGiua3Phai', data.nhietGiua3Phai);
        setElementValue('nhietCuoiTrai', data.nhietCuoiTrai);
        setElementValue('nhietCuoiPhai', data.nhietCuoiPhai);
        
        // Sensory
        setElementValue('camQuanCoTinh', data.camQuanCoTinh);
        setElementValue('camQuanMau', data.camQuanMau);
        setElementValue('camQuanMui', data.camQuanMui);
        setElementValue('camQuanVi', data.camQuanVi);
    }
}

// Create global instance
const formManager = new FormManager();
