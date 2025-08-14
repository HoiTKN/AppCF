// js/sharepoint.js - Development Version (with mock data) - Updated

class SharePointManager {
    constructor() {
        this.siteId = null;
        this.processDataListId = null;
        this.processParameterListId = null;
        this.parameters = [];
        this.isDevelopmentMode = true; // Development flag
    }

    async initialize() {
        if (this.isDevelopmentMode) {
            console.log('SharePoint Manager: Development mode - using mock data');
            return true;
        }
        
        try {
            console.log('Initializing SharePoint connection...');
            
            // Get site ID
            await this.getSiteId();
            
            // Get list IDs
            await this.getListIds();
            
            console.log('SharePoint initialized successfully');
            return true;
        } catch (error) {
            console.error('SharePoint initialization failed:', error);
            throw error;
        }
    }

    async initializeMock() {
        console.log('Initializing mock SharePoint data...');
        
        // Create mock parameters
        this.createMockParameters();
        
        console.log('Mock SharePoint initialized successfully');
        return true;
    }

    createMockParameters() {
        // Mock parameters data based on FMCG noodle production standards
        this.parameters = [
            {
                id: 'param1',
                fields: {
                    'M_x00e3__x0020__x0110_KSX': 'MMB.L1.001',
                    'T_x00ea_n_x0020_tr_x00ea_n_x00': 'Mì tôm chua cay',
                    'Brix_x0020_Kansui_x0020_Min': 7.5,
                    'Brix_x0020_Kansui_x0020_Max': 8.5,
                    'Nhi_x1ec7_t_x0020_Kanshui_x00': 18,
                    'Nhi_x1ec7_t_x0020_Kanshui_x000': 25,
                    'Brix_x0020_Sea_x0020_Min': 15,
                    'Brix_x0020_Sea_x0020_Max': 25,
                    '_x0110__x1ed9__x0020_d_x00e0_y_x0': 1.2,
                    '_x0110__x1ed9__x0020_d_x00e0_y_x1': 1.8,
                    'Nhi_x1ec7_t_x0020__x0110__x1ea7_': 160,
                    'Nhi_x1ec7_t_x0020__x0110__x1ea7_0': 175,
                    'Nhi_x1ec7_t_x0020_Gi_x1eef_a_x0': 165,
                    'Nhi_x1ec7_t_x0020_Gi_x1eef_a_x00': 180,
                    'Nhi_x1ec7_t_x0020_Cu_x1ed1_i_x0': 155,
                    'Nhi_x1ec7_t_x0020_Cu_x1ed1_i_x00': 170
                }
            },
            {
                id: 'param2',
                fields: {
                    'M_x00e3__x0020__x0110_KSX': 'MMB.L2.002',
                    'T_x00ea_n_x0020_tr_x00ea_n_x00': 'Mì gà nấm hương',
                    'Brix_x0020_Kansui_x0020_Min': 7.0,
                    'Brix_x0020_Kansui_x0020_Max': 9.0,
                    'Nhi_x1ec7_t_x0020_Kanshui_x00': 16,
                    'Nhi_x1ec7_t_x0020_Kanshui_x000': 28,
                    'Brix_x0020_Sea_x0020_Min': 12,
                    'Brix_x0020_Sea_x0020_Max': 22,
                    '_x0110__x1ed9__x0020_d_x00e0_y_x0': 1.0,
                    '_x0110__x1ed9__x0020_d_x00e0_y_x1': 1.6,
                    'Nhi_x1ec7_t_x0020__x0110__x1ea7_': 158,
                    'Nhi_x1ec7_t_x0020__x0110__x1ea7_0': 172,
                    'Nhi_x1ec7_t_x0020_Gi_x1eef_a_x0': 162,
                    'Nhi_x1ec7_t_x0020_Gi_x1eef_a_x00': 178,
                    'Nhi_x1ec7_t_x0020_Cu_x1ed1_i_x0': 152,
                    'Nhi_x1ec7_t_x0020_Cu_x1ed1_i_x00': 168
                }
            },
            {
                id: 'param3',
                fields: {
                    'M_x00e3__x0020__x0110_KSX': 'MSI.L3.003',
                    'T_x00ea_n_x0020_tr_x00ea_n_x00': 'Mì bò hầm',
                    'Brix_x0020_Kansui_x0020_Min': 8.0,
                    'Brix_x0020_Kansui_x0020_Max': 9.5,
                    'Nhi_x1ec7_t_x0020_Kanshui_x00': 20,
                    'Nhi_x1ec7_t_x0020_Kanshui_x000': 30,
                    'Brix_x0020_Sea_x0020_Min': 18,
                    'Brix_x0020_Sea_x0020_Max': 28,
                    '_x0110__x1ed9__x0020_d_x00e0_y_x0': 1.3,
                    '_x0110__x1ed9__x0020_d_x00e0_y_x1': 1.9,
                    'Nhi_x1ec7_t_x0020__x0110__x1ea7_': 162,
                    'Nhi_x1ec7_t_x0020__x0110__x1ea7_0': 177,
                    'Nhi_x1ec7_t_x0020_Gi_x1eef_a_x0': 167,
                    'Nhi_x1ec7_t_x0020_Gi_x1eef_a_x00': 182,
                    'Nhi_x1ec7_t_x0020_Cu_x1ed1_i_x0': 157,
                    'Nhi_x1ec7_t_x0020_Cu_x1ed1_i_x00': 172
                }
            },
            {
                id: 'param4',
                fields: {
                    'M_x00e3__x0020__x0110_KSX': 'MHD.L4.004',
                    'T_x00ea_n_x0020_tr_x00ea_n_x00': 'Mì seafood',
                    'Brix_x0020_Kansui_x0020_Min': 7.2,
                    'Brix_x0020_Kansui_x0020_Max': 8.8,
                    'Nhi_x1ec7_t_x0020_Kanshui_x00': 17,
                    'Nhi_x1ec7_t_x0020_Kanshui_x000': 27,
                    'Brix_x0020_Sea_x0020_Min': 14,
                    'Brix_x0020_Sea_x0020_Max': 24,
                    '_x0110__x1ed9__x0020_d_x00e0_y_x0': 1.1,
                    '_x0110__x1ed9__x0020_d_x00e0_y_x1': 1.7,
                    'Nhi_x1ec7_t_x0020__x0110__x1ea7_': 159,
                    'Nhi_x1ec7_t_x0020__x0110__x1ea7_0': 174,
                    'Nhi_x1ec7_t_x0020_Gi_x1eef_a_x0': 164,
                    'Nhi_x1ec7_t_x0020_Gi_x1eef_a_x00': 179,
                    'Nhi_x1ec7_t_x0020_Cu_x1ed1_i_x0': 154,
                    'Nhi_x1ec7_t_x0020_Cu_x1ed1_i_x00': 169
                }
            },
            {
                id: 'param5',
                fields: {
                    'M_x00e3__x0020__x0110_KSX': 'MHG.L5.005',
                    'T_x00ea_n_x0020_tr_x00ea_n_x00': 'Mì chay nấm',
                    'Brix_x0020_Kansui_x0020_Min': 6.8,
                    'Brix_x0020_Kansui_x0020_Max': 8.2,
                    'Nhi_x1ec7_t_x0020_Kanshui_x00': 15,
                    'Nhi_x1ec7_t_x0020_Kanshui_x000': 25,
                    'Brix_x0020_Sea_x0020_Min': 10,
                    'Brix_x0020_Sea_x0020_Max': 20,
                    '_x0110__x1ed9__x0020_d_x00e0_y_x0': 0.9,
                    '_x0110__x1ed9__x0020_d_x00e0_y_x1': 1.5,
                    'Nhi_x1ec7_t_x0020__x0110__x1ea7_': 156,
                    'Nhi_x1ec7_t_x0020__x0110__x1ea7_0': 171,
                    'Nhi_x1ec7_t_x0020_Gi_x1eef_a_x0': 161,
                    'Nhi_x1ec7_t_x0020_Gi_x1eef_a_x00': 176,
                    'Nhi_x1ec7_t_x0020_Cu_x1ed1_i_x0': 151,
                    'Nhi_x1ec7_t_x0020_Cu_x1ed1_i_x00': 166
                }
            }
        ];
        
        console.log(`Created ${this.parameters.length} mock parameters`);
    }

    async getSiteId() {
        try {
            const response = await fetch(APP_CONFIG.graphEndpoints.site, {
                headers: authManager.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Failed to get site: ${response.status}`);
            }

            const data = await response.json();
            this.siteId = data.id;
            console.log('Site ID:', this.siteId);
            return this.siteId;
        } catch (error) {
            console.error('Error getting site ID:', error);
            throw error;
        }
    }

    async getListIds() {
        try {
            const url = APP_CONFIG.graphEndpoints.lists.replace('{siteId}', this.siteId);
            const response = await fetch(url, {
                headers: authManager.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Failed to get lists: ${response.status}`);
            }

            const data = await response.json();
            const lists = data.value || [];

            // Find Process Data list
            const processDataList = lists.find(list => 
                list.displayName === APP_CONFIG.sharePoint.processDataListName
            );
            
            if (processDataList) {
                this.processDataListId = processDataList.id;
                console.log('Process Data List ID:', this.processDataListId);
            } else {
                console.error('Process Data list not found');
            }

            // Find Process Parameter list
            const processParameterList = lists.find(list => 
                list.displayName === APP_CONFIG.sharePoint.processParameterListName
            );
            
            if (processParameterList) {
                this.processParameterListId = processParameterList.id;
                console.log('Process Parameter List ID:', this.processParameterListId);
            } else {
                console.error('Process Parameter list not found');
            }

            return true;
        } catch (error) {
            console.error('Error getting list IDs:', error);
            throw error;
        }
    }

    async getParameters() {
        if (this.isDevelopmentMode) {
            // Return mock parameters
            console.log(`Returning ${this.parameters.length} mock parameters`);
            return this.parameters;
        }
        
        try {
            if (!this.processParameterListId) {
                console.error('Process Parameter list ID not found');
                return [];
            }

            const url = APP_CONFIG.graphEndpoints.listItems
                .replace('{siteId}', this.siteId)
                .replace('{listId}', this.processParameterListId);

            const response = await fetch(url + '?$expand=fields&$top=100', {
                headers: authManager.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Failed to get parameters: ${response.status}`);
            }

            const data = await response.json();
            this.parameters = data.value || [];
            
            console.log(`Loaded ${this.parameters.length} parameters`);
            return this.parameters;
        } catch (error) {
            console.error('Error getting parameters:', error);
            return [];
        }
    }

    async createItem(formData) {
        if (this.isDevelopmentMode) {
            // Save to localStorage instead of SharePoint
            return this.saveToLocalStorage(formData);
        }
        
        try {
            if (!this.processDataListId) {
                throw new Error('Process Data list ID not found');
            }

            const url = APP_CONFIG.graphEndpoints.listItems
                .replace('{siteId}', this.siteId)
                .replace('{listId}', this.processDataListId);

            // Map form data to SharePoint columns
            const itemData = this.mapFormDataToSharePoint(formData);

            const response = await fetch(url, {
                method: 'POST',
                headers: authManager.getAuthHeaders(),
                body: JSON.stringify({
                    fields: itemData
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('SharePoint error response:', errorText);
                throw new Error(`Failed to create item: ${response.status}`);
            }

            const result = await response.json();
            console.log('Item created successfully:', result.id);
            return result;
        } catch (error) {
            console.error('Error creating item:', error);
            
            // If offline, save to local storage
            if (!navigator.onLine) {
                this.saveOffline(formData);
                throw new Error('Offline mode - data saved locally');
            }
            
            throw error;
        }
    }

    saveToLocalStorage(formData) {
        try {
            // Add timestamp and ID
            formData.timestamp = new Date().toISOString();
            formData.id = Date.now().toString();
            
            // Determine storage key based on form type
            let storageKey = 'qaProcessData';
            if (formData.formType) {
                switch(formData.formType) {
                    case 'metal-detection':
                        storageKey = 'qaMetalDetectionData';
                        break;
                    case 'daily-hygiene':
                        storageKey = 'qaDailyHygieneData';
                        break;
                    case 'ghp-hygiene':
                        storageKey = 'qaGHPHygieneData';
                        break;
                    case 'product-changeover':
                        storageKey = 'qaProductChangeoverData';
                        break;
                    default:
                        storageKey = 'qaProcessData';
                }
            }
            
            // Get existing data
            let existingData = localStorage.getItem(storageKey);
            existingData = existingData ? JSON.parse(existingData) : [];
            
            // Add new record
            existingData.push(formData);
            
            // Keep only last 100 records to avoid localStorage limit
            if (existingData.length > 100) {
                existingData = existingData.slice(-100);
            }
            
            // Save back to localStorage
            localStorage.setItem(storageKey, JSON.stringify(existingData));
            
            console.log(`Data saved to localStorage (${storageKey}):`, formData.id);
            return { success: true, id: formData.id };
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            throw error;
        }
    }

    getLocalStorageItems(type = 'process') {
        try {
            let storageKey = 'qaProcessData';
            switch(type) {
                case 'metal-detection':
                    storageKey = 'qaMetalDetectionData';
                    break;
                case 'daily-hygiene':
                    storageKey = 'qaDailyHygieneData';
                    break;
                case 'ghp-hygiene':
                    storageKey = 'qaGHPHygieneData';
                    break;
                case 'product-changeover':
                    storageKey = 'qaProductChangeoverData';
                    break;
            }
            
            const data = localStorage.getItem(storageKey);
            return data ? JSON.parse(data).reverse() : []; // Reverse to show newest first
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return [];
        }
    }

    mapFormDataToSharePoint(formData) {
        // Determine form type and map accordingly
        if (formData.feSize !== undefined || formData.inoxSize !== undefined) {
            // Metal Detection Form
            return this.mapMetalDetectionData(formData);
        } else {
            // Process Data Form
            return this.mapProcessData(formData);
        }
    }

    mapProcessData(formData) {
        // Map form fields to SharePoint internal column names
        const mappedData = {
            Title: `${formData.site}-${formData.lineSX}-${new Date().toISOString()}`,
            Site: formData.site,
            Line_x0020_SX: formData.lineSX
        };

        // Add employee code - try different possible column names
        if (formData.maNhanVien) {
            mappedData['M_x00e3__x0020_nh_x00e2_n_x0020_'] = formData.maNhanVien;
            mappedData['MaNhanVienQA'] = formData.maNhanVien; // Try both names
        }

        // Add product code
        if (formData.maDKSX) {
            mappedData['M_x00e3__x0020__x0110_KSX'] = formData.maDKSX;
            mappedData['MaDKSX'] = formData.maDKSX; // Try both names
        }

        // Add product name
        if (formData.sanPham) {
            mappedData['S_x1ea3_n_x0020_ph_x1ea9_m'] = formData.sanPham;
            mappedData['SanPham'] = formData.sanPham; // Try both names
        }

        // Add timestamps
        mappedData.NSX = new Date().toISOString();
        mappedData['Gi_x1edd__x0020_ki_x1ec3_m_x002'] = new Date().toLocaleTimeString('vi-VN');

        // Kansui data
        if (formData.brixKansui) {
            mappedData['Brix_x0020_Kansui'] = parseFloat(formData.brixKansui);
        }
        if (formData.nhietDoKansui) {
            mappedData['Nhi_x1ec7_t_x0020__x0111__x1ed9_'] = parseFloat(formData.nhietDoKansui);
        }
        if (formData.ngoaiQuanKansui) {
            mappedData['Ngo_x1ea1_i_x0020_quan_x0020_Kan'] = formData.ngoaiQuanKansui;
        }

        // Seasoning data
        if (formData.brixSeasoning) {
            mappedData['Brix_x0020_Seasoning'] = parseFloat(formData.brixSeasoning);
        }
        if (formData.ngoaiQuanSeasoning) {
            mappedData['Ngo_x1ea1_i_x0020_quan_x0020_sea'] = formData.ngoaiQuanSeasoning;
        }
        if (formData.doDayLaBot) {
            mappedData['_x0110__x1ed9__x0020_d_x00e0_y_x'] = parseFloat(formData.doDayLaBot);
        }

        // NEW FIELDS - Ngoại quan sợi
        if (formData.ngoaiQuanSoi) {
            mappedData['Ngo_x1ea1_i_x0020_quan_x0020_s_x01'] = formData.ngoaiQuanSoi;
        }
        if (formData.moTaSoi) {
            mappedData['M_x00f4__x0020_t_x1ea3__x0020_s_'] = formData.moTaSoi;
        }

        // NEW FIELDS - Áp suất hơi van thành phần
        if (formData.apSuatHoiVan) {
            mappedData['_x00c1_p_x0020_su_x1ea5_t_x0020'] = formData.apSuatHoiVan;
        }

        // Temperature data
        const tempFields = [
            { form: 'nhietDauTrai', sp: 'Nhi_x1ec7_t_x0020__x0111__x1ea7_u' },
            { form: 'nhietDauPhai', sp: 'Nhi_x1ec7_t_x0020__x0111__x1ea7_u0' },
            { form: 'nhietGiua1Trai', sp: 'Nhi_x1ec7_t_x0020_gi_x1eef_a_x00' },
            { form: 'nhietGiua1Phai', sp: 'Nhi_x1ec7_t_x0020_gi_x1eef_a_x000' },
            { form: 'nhietGiua2Trai', sp: 'Nhi_x1ec7_t_x0020_gi_x1eef_a_x001' },
            { form: 'nhietGiua2Phai', sp: 'Nhi_x1ec7_t_x0020_gi_x1eef_a_x002' },
            { form: 'nhietGiua3Trai', sp: 'Nhi_x1ec7_t_x0020_gi_x1eef_a_x003' },
            { form: 'nhietGiua3Phai', sp: 'Nhi_x1ec7_t_x0020_gi_x1eef_a_x004' },
            { form: 'nhietCuoiTrai', sp: 'Nhi_x1ec7_t_x0020_cu_x1ed1_i_x00' },
            { form: 'nhietCuoiPhai', sp: 'Nhi_x1ec7_t_x0020_cu_x1ed1_i_x000' }
        ];

        tempFields.forEach(field => {
            if (formData[field.form]) {
                mappedData[field.sp] = parseFloat(formData[field.form]);
            }
        });

        // NEW FIELDS - Ngoại quan phôi mì
        if (formData.ngoaiQuanPhoiMi) {
            mappedData['Ngo_x1ea1_i_x0020_quan_x0020_ph_x'] = formData.ngoaiQuanPhoiMi;
        }

        // NEW FIELDS - Van châm BHA/BHT
        if (formData.vanChamBHA) {
            mappedData['Van_x0020_ch_x00e2_m_x0020_BHA'] = formData.vanChamBHA;
        }

        // Sensory evaluation
        if (formData.camQuanCoTinh) {
            mappedData['C_x1ea3_m_x0020_quan_x0020_c_x01'] = parseFloat(formData.camQuanCoTinh);
        }
        if (formData.camQuanMau) {
            mappedData['C_x1ea3_m_x0020_quan_x0020_m_x00'] = parseFloat(formData.camQuanMau);
        }
        if (formData.camQuanMui) {
            mappedData['C_x1ea3_m_x0020_quan_x0020_m_x00e'] = parseFloat(formData.camQuanMui);
        }
        if (formData.camQuanVi) {
            mappedData['C_x1ea3_m_x0020_quan_x0020_v_x1ec'] = parseFloat(formData.camQuanVi);
        }

        // NEW FIELDS - Mô tả cảm quan
        if (formData.moTaCamQuan) {
            mappedData['M_x00f4__x0020_t_x1ea3__x0020_c_'] = formData.moTaCamQuan;
        }

        return mappedData;
    }

    mapMetalDetectionData(formData) {
        // Map metal detection form fields to SharePoint internal column names
        const mappedData = {
            Title: `MD-${formData.site}-${formData.line}-${new Date().toISOString()}`,
            Site: formData.site,
            Line: formData.line
        };

        // Basic info
        if (formData.maNhanVien) {
            mappedData['M_x00e3__x0020_nh_x00e2_n_x0020_QA'] = formData.maNhanVien;
        }
        if (formData.ngaySanXuat) {
            mappedData['Ng_x00e0_y_x0020_s_x1ea3_n_x002'] = formData.ngaySanXuat;
        }
        if (formData.gioKiemTra) {
            mappedData['Gi_x1edd__x0020_ki_x1ec3_m_x003'] = formData.gioKiemTra;
        }

        // Detection settings
        if (formData.donViQuaMayDo) {
            mappedData['_x0110_n_x0020_v_x1ecb__x0020_'] = formData.donViQuaMayDo;
        }
        if (formData.nguoiNhiemTu) {
            mappedData['Ng_x01b0__x1edd_i_x0020_nhi_x1ec5_'] = parseFloat(formData.nguoiNhiemTu);
        }
        if (formData.lyDoThayDoi) {
            mappedData['L_x00fd__x0020_do_x0020_thay_x00'] = formData.lyDoThayDoi;
        }

        // NEW FIELDS - Fe testing
        if (formData.feSize) {
            mappedData['K_x00ed_ch_x0020_th_x01b0__x1edb_c0'] = parseFloat(formData.feSize);
        }
        if (formData.feSamples) {
            mappedData['S_x1ed1__x0020_m_x1eabu_x0020_Fe_'] = parseInt(formData.feSamples);
        }

        // NEW FIELDS - Inox testing
        if (formData.inoxSize) {
            mappedData['K_x00ed_ch_x0020_th_x01b0__x1edb_c1'] = parseFloat(formData.inoxSize);
        }
        if (formData.inoxSamples) {
            mappedData['S_x1ed1__x0020_m_x1eabu_x0020_In_'] = parseInt(formData.inoxSamples);
        }

        // NEW FIELDS - Metal color testing
        if (formData.metalSize) {
            mappedData['K_x00ed_ch_x0020_th_x01b0__x1edb_c2'] = parseFloat(formData.metalSize);
        }
        if (formData.metalSamples) {
            mappedData['S_x1ed1__x0020_m_x1eabu_x0020_Ki_'] = parseInt(formData.metalSamples);
        }

        // NEW FIELDS - Wire testing
        if (formData.wireSize) {
            mappedData['K_x00ed_ch_x0020_th_x01b0__x1edb_c3'] = parseFloat(formData.wireSize);
        }
        if (formData.wireSamples) {
            mappedData['S_x1ed1__x0020_m_x1eabu_x0020_gi_'] = parseInt(formData.wireSamples);
        }

        // NEW FIELDS - Test results
        if (formData.ketLuanTest) {
            mappedData['K_x1ebf_t_x0020_lu_x1ead_n_x0020_1'] = formData.ketLuanTest;
        }
        if (formData.soLuongDa) {
            mappedData['S_x1ed1__x0020_l_x01b0__x1ee3_ng_0'] = parseInt(formData.soLuongDa);
        }
        if (formData.soLuongDung) {
            mappedData['S_x1ed1__x0020_l_x01b0__x1ee3_ng_1'] = parseInt(formData.soLuongDung);
        }
        if (formData.nguonNhiem) {
            mappedData['Ngu_x1ed3_n_x0020_nhi_x1ec5_m'] = parseFloat(formData.nguonNhiem);
        }
        if (formData.moTaKimLoai) {
            mappedData['M_x00f4__x0020_t_x1ea3__x0020_ki_'] = formData.moTaKimLoai;
        }
        if (formData.thamTraPQCI) {
            mappedData['Th_x1ea9_m_x0020_tra_x0020_PQCI'] = formData.thamTraPQCI;
        }

        return mappedData;
    }

    async getRecentItems(count = 20, type = 'process') {
        if (this.isDevelopmentMode) {
            // Return data from localStorage
            return this.getLocalStorageItems(type).slice(0, count);
        }
        
        try {
            if (!this.processDataListId) {
                throw new Error('Process Data list ID not found');
            }

            const url = APP_CONFIG.graphEndpoints.listItems
                .replace('{siteId}', this.siteId)
                .replace('{listId}', this.processDataListId);

            const response = await fetch(
                `${url}?$expand=fields&$top=${count}&$orderby=fields/Created desc`,
                {
                    headers: authManager.getAuthHeaders()
                }
            );

            if (!response.ok) {
                throw new Error(`Failed to get items: ${response.status}`);
            }

            const data = await response.json();
            return data.value || [];
        } catch (error) {
            console.error('Error getting recent items:', error);
            return [];
        }
    }

    saveOffline(formData) {
        try {
            let offlineData = localStorage.getItem('offlineData');
            offlineData = offlineData ? JSON.parse(offlineData) : [];
            
            formData.timestamp = new Date().toISOString();
            formData.synced = false;
            
            offlineData.push(formData);
            
            // Keep only last 50 records
            if (offlineData.length > APP_CONFIG.app.maxOfflineRecords) {
                offlineData = offlineData.slice(-APP_CONFIG.app.maxOfflineRecords);
            }
            
            localStorage.setItem('offlineData', JSON.stringify(offlineData));
            console.log('Data saved offline');
        } catch (error) {
            console.error('Error saving offline:', error);
        }
    }

    getParameterByCode(maDKSX) {
        if (!this.parameters || this.parameters.length === 0) {
            return null;
        }

        const param = this.parameters.find(p => {
            const fields = p.fields || p;
            return fields['M_x00e3__x0020__x0110_KSX'] === maDKSX || 
                   fields['MaDKSX'] === maDKSX;
        });

        return param ? (param.fields || param) : null;
    }

    // Development helper methods
    generateSampleData() {
        const sampleRecords = [
            {
                site: 'MMB',
                maNhanVien: 'QA001',
                lineSX: 'L1',
                maDKSX: 'MMB.L1.001',
                sanPham: 'Mì tôm chua cay',
                brixKansui: '8.1',
                nhietDoKansui: '22',
                ngoaiQuanKansui: 'Đạt',
                brixSeasoning: '20',
                ngoaiQuanSeasoning: 'Đạt',
                doDayLaBot: '1.5',
                ngoaiQuanSoi: 'Đạt',
                apSuatHoiVan: 'Đạt',
                nhietDauTrai: '168',
                nhietDauPhai: '170',
                nhietGiua1Trai: '172',
                nhietGiua1Phai: '175',
                nhietGiua2Trai: '170',
                nhietGiua2Phai: '173',
                nhietGiua3Trai: '169',
                nhietGiua3Phai: '171',
                nhietCuoiTrai: '165',
                nhietCuoiPhai: '167',
                ngoaiQuanPhoiMi: 'Đạt',
                vanChamBHA: 'Đạt',
                camQuanCoTinh: '9.2',
                camQuanMau: '9.1',
                camQuanMui: '9.3',
                camQuanVi: '9.2',
                moTaCamQuan: 'Cảm quan tốt, đạt tiêu chuẩn'
            },
            {
                site: 'MSI',
                maNhanVien: 'QA002',
                lineSX: 'L3',
                maDKSX: 'MSI.L3.003',
                sanPham: 'Mì bò hầm',
                brixKansui: '8.7',
                nhietDoKansui: '24',
                ngoaiQuanKansui: 'Đạt',
                brixSeasoning: '23',
                ngoaiQuanSeasoning: 'Đạt',
                doDayLaBot: '1.6',
                ngoaiQuanSoi: 'Đạt',
                apSuatHoiVan: 'Đạt',
                nhietDauTrai: '170',
                nhietDauPhai: '172',
                nhietGiua1Trai: '175',
                nhietGiua1Phai: '178',
                nhietGiua2Trai: '173',
                nhietGiua2Phai: '176',
                nhietGiua3Trai: '171',
                nhietGiua3Phai: '174',
                nhietCuoiTrai: '167',
                nhietCuoiPhai: '169',
                ngoaiQuanPhoiMi: 'Đạt',
                vanChamBHA: 'Đạt',
                camQuanCoTinh: '9.4',
                camQuanMau: '9.3',
                camQuanMui: '9.5',
                camQuanVi: '9.4'
            }
        ];
        
        sampleRecords.forEach(record => {
            this.saveToLocalStorage(record);
        });
        
        console.log('Generated sample data');
        return sampleRecords.length;
    }

    clearLocalStorage() {
        localStorage.removeItem('qaProcessData');
        localStorage.removeItem('qaMetalDetectionData');
        localStorage.removeItem('qaDailyHygieneData');
        localStorage.removeItem('qaGHPHygieneData');
        localStorage.removeItem('qaProductChangeoverData');
        localStorage.removeItem('offlineData');
        console.log('Cleared localStorage');
    }
}

// Create global instance
const sharepointManager = new SharePointManager();
