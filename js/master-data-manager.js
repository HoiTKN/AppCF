// js/master-data-manager.js - Master Data Management System

class MasterDataManager {
    constructor() {
        this.employeesData = [];
        this.processConditionsMi = [];
        this.processConditionsPho = [];
        this.lastSync = null;
        this.isLoaded = false;
    }

    async initialize() {
        console.log('Initializing Master Data Manager...');
        
        try {
            // Load cached data first (fast startup)
            await this.loadCachedData();
            
            // Then check for updates (background)
            this.checkForUpdates();
            
            this.isLoaded = true;
            console.log('Master Data Manager initialized successfully');
        } catch (error) {
            console.error('Error initializing Master Data Manager:', error);
            throw error;
        }
    }

    async loadCachedData() {
        // Load from localStorage or static files
        this.employeesData = EMPLOYEES_DATA || [];
        
        // Load process conditions from cache if available
        const cachedMi = localStorage.getItem('masterDataConditionsMi');
        const cachedPho = localStorage.getItem('masterDataConditionsPho');
        
        if (cachedMi) {
            this.processConditionsMi = JSON.parse(cachedMi);
        } else {
            // Load sample data
            this.processConditionsMi = this.generateSampleMiConditions();
        }
        
        if (cachedPho) {
            this.processConditionsPho = JSON.parse(cachedPho);
        } else {
            // Load sample data
            this.processConditionsPho = this.generateSamplePhoConditions();
        }
    }

    generateSampleMiConditions() {
        // Sample data based on your Excel
        return [
            {
                id: "COND_MI_001",
                site: "MHG",
                brand: "Gumi",
                productName: "PHÔI MÌ GUMI BÚN BÒ LINE 2",
                item: "99PH00251",
                maDKSX: "99PH00251-MGP-L2",
                flour: "Blue Key N",
                unifiedName: "Gumi Bún Bò",
                tempRanges: {
                    dauMin: 125, dauMax: 127,
                    giua1Min: 150, giua1Max: 152,
                    giua2Min: 142, giua2Max: 144,
                    giua3Min: 154, giua3Max: 156,
                    cuoiMin: 161, cuoiMax: 163
                },
                thicknessRange: { min: 0.93, max: 0.95 },
                brixKansui: { min: 7.2, max: 7.6 },
                tempKansui: { min: 10, max: 14 },
                brixSea: { min: null, max: null }, // Empty in source
                active: true
            },
            {
                id: "COND_MI_002",
                site: "MHG",
                brand: "Gumi",
                productName: "PHÔI MÌ GUMI CÀ CHUA TRỨNG LINE 2",
                item: "99PH00250",
                maDKSX: "99PH00250-MGP-L2",
                flour: "Blue Key N",
                unifiedName: "Gumi Canh Mây",
                tempRanges: {
                    dauMin: 125, dauMax: 127,
                    giua1Min: 150, giua1Max: 152,
                    giua2Min: 142, giua2Max: 144,
                    giua3Min: 154, giua3Max: 156,
                    cuoiMin: 161, cuoiMax: 163
                },
                thicknessRange: { min: 0.93, max: 0.95 },
                brixKansui: { min: 7.2, max: 7.6 },
                tempKansui: { min: 10, max: 14 },
                brixSea: { min: null, max: null },
                active: true
            },
            {
                id: "COND_MI_003",
                site: "MHG",
                brand: "OTM",
                productName: "PHÔI MÌ NẤU OMTOMI VỊ BÒ HẦM - CANH CHUA",
                item: "99PH00237",
                maDKSX: "99PH00237-MGP-L1",
                flour: "Blue Key N",
                unifiedName: "OTM CANH CHUA - BÒ",
                tempRanges: {
                    dauMin: 130, dauMax: 132,
                    giua1Min: 147, giua1Max: 149,
                    giua2Min: 149, giua2Max: 151,
                    giua3Min: 149, giua3Max: 151,
                    cuoiMin: 154, cuoiMax: 156
                },
                thicknessRange: { min: 1.23, max: 1.25 },
                brixKansui: { min: 5.5, max: 5.7 },
                tempKansui: { min: 16, max: 18 },
                brixSea: { min: null, max: null },
                active: true
            }
        ];
    }

    generateSamplePhoConditions() {
        // Sample data based on your Excel
        return [
            {
                id: "COND_PHO_001",
                site: "MMB",
                brand: "Rise base",
                productName: "BTP Vắt phở khô (block)",
                item: "99RM00015",
                maDKSX: "99RM00015-MBP",
                rice: "IR504",
                unifiedName: "Vắt phở khô",
                baumeKansui: { min: 18, max: 22 },
                baumeDichTrang: { min: 19, max: 21 },
                thicknessAfterSteam: { min: 0.78, max: 0.82 },
                moistureMax: 12,
                active: true
            },
            {
                id: "COND_PHO_002",
                site: "MMB",
                brand: "Rise base",
                productName: "BTP vắt phở story có thịt",
                item: "99RM00018",
                maDKSX: "99RM00018-MBP",
                rice: "IR504",
                unifiedName: "Phở story có thịt",
                baumeKansui: { min: 18, max: 22 },
                baumeDichTrang: { min: 19, max: 21 },
                thicknessAfterSteam: { min: 0.60, max: 0.65 },
                moistureMax: 12,
                active: true
            },
            {
                id: "COND_PHO_003",
                site: "MMB",
                brand: "Rise base",
                productName: "BTP vắt phở story",
                item: "99RM00016",
                maDKSX: "99RM00016-MBP",
                rice: "IR504",
                unifiedName: "Phở story",
                baumeKansui: { min: 18, max: 22 },
                baumeDichTrang: { min: 19, max: 21 },
                thicknessAfterSteam: { min: 0.60, max: 0.65 },
                moistureMax: 12,
                active: true
            }
        ];
    }

    // Employee Management
    getEmployeesBySite(site) {
        return this.employeesData.filter(emp => emp.site === site && emp.active);
    }

    getEmployeesBySiteAndGroup(site, group) {
        return this.employeesData.filter(emp => 
            emp.site === site && 
            emp.group === group && 
            emp.active
        );
    }

    getEmployeeById(id) {
        return this.employeesData.find(emp => emp.id === id);
    }

    // Process Conditions Management
    getProcessConditionsBySite(site, type = 'mi') {
        const data = type === 'mi' ? this.processConditionsMi : this.processConditionsPho;
        return data.filter(cond => cond.site === site && cond.active);
    }

    getProcessConditionByCode(maDKSX, type = 'mi') {
        const data = type === 'mi' ? this.processConditionsMi : this.processConditionsPho;
        return data.find(cond => cond.maDKSX === maDKSX && cond.active);
    }

    getProcessConditionsByBrand(site, brand, type = 'mi') {
        const data = type === 'mi' ? this.processConditionsMi : this.processConditionsPho;
        return data.filter(cond => 
            cond.site === site && 
            cond.brand === brand && 
            cond.active
        );
    }

    // Data Upload and Processing
    async uploadCSVFile(file, dataType) {
        if (!employeeManager.isManager()) {
            throw new Error('Chỉ quản lý mới có thể upload dữ liệu');
        }

        try {
            const text = await file.text();
            const data = this.parseCSV(text);
            
            switch(dataType) {
                case 'employees':
                    await this.processEmployeeData(data);
                    break;
                case 'conditions-mi':
                    await this.processConditionsMiData(data);
                    break;
                case 'conditions-pho':
                    await this.processConditionsPhoData(data);
                    break;
                default:
                    throw new Error('Invalid data type');
            }
            
            // Update last sync time
            this.lastSync = new Date().toISOString();
            localStorage.setItem('masterDataLastSync', this.lastSync);
            
            return { success: true, message: 'Dữ liệu đã được cập nhật thành công' };
        } catch (error) {
            console.error('Error uploading CSV:', error);
            throw error;
        }
    }

    parseCSV(text) {
        // Simple CSV parser - in production, use Papa Parse
        const lines = text.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        const data = [];
        
        for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim()) {
                const values = lines[i].split(',');
                const row = {};
                headers.forEach((header, index) => {
                    row[header] = values[index] ? values[index].trim() : '';
                });
                data.push(row);
            }
        }
        
        return data;
    }

    async processEmployeeData(csvData) {
        // Validate and process employee data
        const processedData = csvData.map((row, index) => {
            // Validate required fields
            if (!row['MNV'] || !row['Tên nhân viên'] || !row['Site']) {
                throw new Error(`Dòng ${index + 2}: Thiếu thông tin bắt buộc`);
            }
            
            return {
                id: row['MNV'],
                name: row['Tên nhân viên'],
                email: row['Mail'] || '',
                site: row['Site'],
                group: row['Nhóm'] || 'Chung',
                role: row['Role'] || 'Nhân viên',
                active: true,
                password: '123', // Default password
                permissions: row['Role'] === 'Quản lý' ? 
                    ['read', 'write', 'delete', 'admin'] : 
                    ['read', 'write'],
                lastUpdated: new Date().toISOString()
            };
        });
        
        // Update employees data
        this.employeesData = processedData;
        
        // Cache the data
        localStorage.setItem('masterDataEmployees', JSON.stringify(processedData));
        
        console.log(`Processed ${processedData.length} employee records`);
    }

    async processConditionsMiData(csvData) {
        // Process mì conditions data
        const processedData = csvData.map((row, index) => {
            if (!row['Mã DKSX'] || !row['Site']) {
                throw new Error(`Dòng ${index + 2}: Thiếu mã ĐKSX hoặc Site`);
            }
            
            return {
                id: `COND_MI_${index + 1}`,
                site: row['Site'],
                brand: row['Brand'] || '',
                productName: row['Tên trên DKSX'] || '',
                item: row['Item'] || '',
                maDKSX: row['Mã DKSX'],
                flour: row['Bột'] || '',
                unifiedName: row['Tên thống nhất'] || '',
                tempRanges: {
                    dauMin: parseFloat(row['Nhiệt Đầu Min']) || 0,
                    dauMax: parseFloat(row['Nhiệt Đầu Max']) || 0,
                    giua1Min: parseFloat(row['Nhiệt Giữa 1 Min']) || 0,
                    giua1Max: parseFloat(row['Nhiệt Giữa 1 Max']) || 0,
                    giua2Min: parseFloat(row['Nhiệt Giữa 2 Min']) || 0,
                    giua2Max: parseFloat(row['Nhiệt Giữa 2 Max']) || 0,
                    giua3Min: parseFloat(row['Nhiệt Giữa 3 Min']) || 0,
                    giua3Max: parseFloat(row['Nhiệt Giữa 3 Max']) || 0,
                    cuoiMin: parseFloat(row['Nhiệt Cuối Min']) || 0,
                    cuoiMax: parseFloat(row['Nhiệt Cuối Max']) || 0
                },
                thicknessRange: {
                    min: parseFloat(row['Độ dày lá bột Min']) || 0,
                    max: parseFloat(row['Độ dày lá bột Max']) || 0
                },
                brixKansui: {
                    min: parseFloat(row['Brix Kansui Min']) || 0,
                    max: parseFloat(row['Brix Kansui Max']) || 0
                },
                tempKansui: {
                    min: parseFloat(row['Nhiệt Kanshui Min']) || 0,
                    max: parseFloat(row['Nhiệt Kanshui Max']) || 0
                },
                brixSea: {
                    min: parseFloat(row['Brix Sea Min']) || null,
                    max: parseFloat(row['Brix Sea Max']) || null
                },
                active: true,
                lastUpdated: new Date().toISOString()
            };
        });
        
        this.processConditionsMi = processedData;
        localStorage.setItem('masterDataConditionsMi', JSON.stringify(processedData));
        
        console.log(`Processed ${processedData.length} mì condition records`);
    }

    async processConditionsPhoData(csvData) {
        // Process phở conditions data
        const processedData = csvData.map((row, index) => {
            if (!row['Mã DKSX'] || !row['Site']) {
                throw new Error(`Dòng ${index + 2}: Thiếu mã ĐKSX hoặc Site`);
            }
            
            return {
                id: `COND_PHO_${index + 1}`,
                site: row['Site'],
                brand: row['Brand'] || '',
                productName: row['Tên trên DKSX'] || '',
                item: row['Item'] || '',
                maDKSX: row['Mã DKSX'],
                rice: row['Gạo'] || '',
                unifiedName: row['Tên thống nhất'] || '',
                baumeKansui: {
                    min: parseFloat(row['Baume Kansui min']) || 0,
                    max: parseFloat(row['Baume Kansui max']) || 0
                },
                baumeDichTrang: {
                    min: parseFloat(row['Baume dịch tráng min']) || 0,
                    max: parseFloat(row['Baume dịch tráng max']) || 0
                },
                thicknessAfterSteam: {
                    min: parseFloat(row['Độ dày tấm sau hấp min']) || 0,
                    max: parseFloat(row['Độ dày tấm sau hấp max']) || 0
                },
                moistureMax: parseFloat(row['Độ ẩm vắt sau sấy Max']) || 0,
                active: true,
                lastUpdated: new Date().toISOString()
            };
        });
        
        this.processConditionsPho = processedData;
        localStorage.setItem('masterDataConditionsPho', JSON.stringify(processedData));
        
        console.log(`Processed ${processedData.length} phở condition records`);
    }

    // Data Export
    exportToCSV(dataType) {
        let data, headers;
        
        switch(dataType) {
            case 'employees':
                data = this.employeesData;
                headers = ['id', 'name', 'email', 'site', 'group', 'role', 'active'];
                break;
            case 'conditions-mi':
                data = this.processConditionsMi;
                headers = ['maDKSX', 'site', 'brand', 'productName', 'unifiedName'];
                break;
            case 'conditions-pho':
                data = this.processConditionsPho;
                headers = ['maDKSX', 'site', 'brand', 'productName', 'unifiedName'];
                break;
            default:
                throw new Error('Invalid data type for export');
        }
        
        // Convert to CSV
        const csvContent = [
            headers.join(','),
            ...data.map(row => headers.map(field => row[field] || '').join(','))
        ].join('\n');
        
        // Download
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${dataType}-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }

    // Background sync check
    async checkForUpdates() {
        // Check if data needs updating (implement based on your strategy)
        const lastSync = localStorage.getItem('masterDataLastSync');
        const now = new Date();
        const lastSyncDate = lastSync ? new Date(lastSync) : new Date(0);
        
        // Check if data is older than 24 hours
        if (now - lastSyncDate > 24 * 60 * 60 * 1000) {
            console.log('Master data may need updating');
            // Implement your sync strategy here
        }
    }

    // Validation helpers
    validateTemperature(value, min, max) {
        const temp = parseFloat(value);
        return !isNaN(temp) && temp >= min && temp <= max;
    }

    validateBrix(value, min, max) {
        const brix = parseFloat(value);
        return !isNaN(brix) && brix >= min && brix <= max;
    }

    validateThickness(value, min, max) {
        const thickness = parseFloat(value);
        return !isNaN(thickness) && thickness >= min && thickness <= max;
    }

    // Get validation ranges for forms
    getValidationRanges(maDKSX, type = 'mi') {
        const condition = this.getProcessConditionByCode(maDKSX, type);
        if (!condition) return null;
        
        if (type === 'mi') {
            return {
                tempRanges: condition.tempRanges,
                thicknessRange: condition.thicknessRange,
                brixKansui: condition.brixKansui,
                tempKansui: condition.tempKansui,
                brixSea: condition.brixSea
            };
        } else {
            return {
                baumeKansui: condition.baumeKansui,
                baumeDichTrang: condition.baumeDichTrang,
                thicknessAfterSteam: condition.thicknessAfterSteam,
                moistureMax: condition.moistureMax
            };
        }
    }
}

// Create global instance
const masterDataManager = new MasterDataManager();
