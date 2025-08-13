// js/app.js - Updated for All 4 Forms

// Main Application Controller
class App {
    constructor() {
        this.currentForm = 'process-data';
        this.isOffline = false;
        this.isDevelopmentMode = true; // Development flag
        this.sidebarCollapsed = false;
    }

    async initialize() {
        try {
            console.log('Initializing app in development mode...');
            
            if (this.isDevelopmentMode) {
                // Skip authentication in development mode
                console.log('Development mode: Skipping authentication');
                await this.showMainApp();
            } else {
                // Original authentication flow (for production)
                const isAuthenticated = await authManager.initialize();
                
                if (isAuthenticated) {
                    console.log('User already authenticated');
                    await this.showMainApp();
                } else {
                    console.log('User not authenticated, showing login');
                    this.showLoginScreen();
                }
            }
            
        } catch (error) {
            console.error('App initialization failed:', error);
            if (this.isDevelopmentMode) {
                await this.showMainApp(); // Force show in dev mode
            } else {
                this.showLoginScreen();
            }
        }
    }

    showLoginScreen() {
        document.getElementById('loadingScreen').style.display = 'none';
        document.getElementById('loginScreen').style.display = 'block';
        document.getElementById('mainApp').style.display = 'none';
        
        // Setup login button
        document.getElementById('loginButton').addEventListener('click', async () => {
            await this.handleLogin();
        });
    }

    async handleLogin() {
        try {
            const loginButton = document.getElementById('loginButton');
            loginButton.disabled = true;
            loginButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Đang đăng nhập...';
            
            const success = await authManager.login();
            
            if (success) {
                await this.showMainApp();
            } else {
                loginButton.disabled = false;
                loginButton.innerHTML = '<i class="bi bi-microsoft me-2"></i>Đăng nhập với Microsoft';
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showToast('Lỗi', 'Đăng nhập thất bại. Vui lòng thử lại.');
        }
    }

    async showMainApp() {
        try {
            // Hide other screens
            document.getElementById('loadingScreen').style.display = 'none';
            document.getElementById('loginScreen').style.display = 'none';
            document.getElementById('mainApp').style.display = 'block';
            
            if (this.isDevelopmentMode) {
                // Show development user info
                document.getElementById('userName').textContent = 'Developer Mode';
                
                // Initialize mock SharePoint
                await sharepointManager.initializeMock();
            } else {
                // Show user info
                const userInfo = authManager.getUserInfo();
                if (userInfo) {
                    document.getElementById('userName').textContent = userInfo.name || userInfo.email;
                }
                
                // Initialize SharePoint connection
                await sharepointManager.initialize();
            }
            
            // Initialize form
            formManager.initialize();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Setup sidebar navigation
            this.setupSidebarNavigation();
            
            // Load parameters
            await formManager.loadParameters();
            
            // Initialize dashboard
            this.updateDashboard();
            
            // Register service worker for PWA (only in production)
            if (!this.isDevelopmentMode && 'serviceWorker' in navigator) {
                navigator.serviceWorker.register('/AppCF/sw.js').catch(err => {
                    console.log('Service worker registration failed:', err);
                });
            }
            
        } catch (error) {
            console.error('Error showing main app:', error);
            this.showToast('Lỗi', 'Không thể tải ứng dụng. Vui lòng thử lại.');
        }
    }

    setupEventListeners() {
        // Logout button
        document.getElementById('logoutBtn').addEventListener('click', async (e) => {
            e.preventDefault();
            if (this.isDevelopmentMode) {
                if (confirm('Bạn có chắc muốn reload app?')) {
                    window.location.reload();
                }
            } else {
                if (confirm('Bạn có chắc muốn đăng xuất?')) {
                    await authManager.logout();
                }
            }
        });
        
        // Reset form button
        document.getElementById('resetBtn').addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('Bạn có chắc muốn xóa toàn bộ dữ liệu đã nhập?')) {
                document.getElementById('processDataForm').reset();
                formManager.clearValidation();
            }
        });
        
        // Form submit
        document.getElementById('processDataForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            await formManager.handleSubmit(e);
        });
        
        // Sidebar toggle for mobile
        document.getElementById('sidebarToggle').addEventListener('click', () => {
            this.toggleSidebar();
        });
        
        // Sidebar overlay for mobile
        document.getElementById('sidebarOverlay').addEventListener('click', () => {
            this.hideSidebar();
        });
        
        // Online/Offline detection (disabled in dev mode)
        if (!this.isDevelopmentMode) {
            window.addEventListener('online', () => {
                this.isOffline = false;
                this.showToast('Thông báo', 'Đã kết nối mạng');
                this.syncOfflineData();
            });
            
            window.addEventListener('offline', () => {
                this.isOffline = true;
                this.showToast('Cảnh báo', 'Mất kết nối mạng. Dữ liệu sẽ được lưu offline.');
            });
        }
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    setupSidebarNavigation() {
        // Setup navigation links
        const navLinks = document.querySelectorAll('.sidebar .nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const formName = link.getAttribute('data-form');
                if (formName) {
                    this.switchForm(formName);
                }
            });
        });
        
        // Set initial active form
        this.switchForm(this.currentForm);
    }

    switchForm(formName) {
        // Update active nav link
        document.querySelectorAll('.sidebar .nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        const activeLink = document.querySelector(`[data-form="${formName}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
        
        // Hide all form containers
        document.querySelectorAll('.form-container').forEach(container => {
            container.classList.remove('active');
        });
        
        // Show selected form
        const targetForm = document.getElementById(`${formName}-form`);
        if (targetForm) {
            targetForm.classList.add('active');
            this.currentForm = formName;
            
            // Update breadcrumb
            this.updateBreadcrumb(formName);
            
            // Handle specific form logic
            this.handleFormSwitch(formName);
            
            // Hide sidebar on mobile after selection
            if (window.innerWidth <= 768) {
                this.hideSidebar();
            }
        }
    }

    updateBreadcrumb(formName) {
        const breadcrumbMap = {
            'dashboard': 'Dashboard',
            'process-data': 'Process Data',
            'metal-detection': 'Kiểm soát máy dò kim loại',
            'daily-hygiene': 'Đánh giá vệ sinh hàng ngày',
            'product-changeover': 'Checklist chuyển đổi sản phẩm',
            'data-view': 'Xem dữ liệu',
            'analytics': 'Phân tích',
            'parameters': 'Cài đặt thông số'
        };
        
        const breadcrumbElement = document.getElementById('currentFormBreadcrumb');
        if (breadcrumbElement) {
            breadcrumbElement.textContent = breadcrumbMap[formName] || formName;
        }
    }

    handleFormSwitch(formName) {
        switch(formName) {
            case 'dashboard':
                this.updateDashboard();
                break;
            case 'data-view':
                this.loadDataTable();
                break;
            case 'process-data':
                // Form is already initialized
                break;
            case 'metal-detection':
                this.initializeMetalDetectionForm();
                break;
            case 'daily-hygiene':
                this.initializeDailyHygieneForm();
                break;
            case 'product-changeover':
                this.initializeProductChangeoverForm();
                break;
            default:
                console.log(`Form ${formName} loaded`);
        }
    }

    initializeMetalDetectionForm() {
        // Initialize metal detection form with current date/time and new ID
        const now = new Date();
        const timestamp = now.getTime().toString(36);
        const random = Math.random().toString(36).substring(2, 8);
        
        const idField = document.getElementById('mdId');
        if (idField) {
            idField.value = timestamp + random;
        }
        
        const dateField = document.getElementById('mdNgaySanXuat');
        if (dateField) {
            dateField.value = now.toISOString().split('T')[0];
        }
        
        const timeField = document.getElementById('mdGioKiemTra');
        if (timeField) {
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            timeField.value = `${hours}:${minutes}`;
        }
        
        console.log('Metal detection form initialized');
    }

    initializeDailyHygieneForm() {
        // Initialize daily hygiene form with current date/time and new ID
        const now = new Date();
        const timestamp = now.getTime().toString(36);
        const random = Math.random().toString(36).substring(2, 8);
        
        const idField = document.getElementById('dhId');
        if (idField) {
            idField.value = 'dh' + timestamp + random;
        }
        
        const dateField = document.getElementById('dhNgay');
        if (dateField) {
            dateField.value = now.toISOString().split('T')[0];
        }
        
        console.log('Daily hygiene form initialized');
    }

    initializeProductChangeoverForm() {
        // Initialize product changeover form with current date/time and new ID
        const now = new Date();
        const timestamp = now.getTime().toString(36);
        const random = Math.random().toString(36).substring(2, 8);
        
        const idField = document.getElementById('pcId');
        if (idField) {
            idField.value = 'pc' + timestamp + random;
        }
        
        const dateField = document.getElementById('pcNgaySanXuat');
        if (dateField) {
            dateField.value = now.toISOString().split('T')[0];
        }
        
        const timeField = document.getElementById('pcGio');
        if (timeField) {
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            timeField.value = `${hours}:${minutes}`;
        }
        
        console.log('Product changeover form initialized');
    }

    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        
        if (window.innerWidth <= 768) {
            // Mobile: toggle show/hide
            sidebar.classList.toggle('show');
            overlay.classList.toggle('show');
        } else {
            // Desktop: toggle collapse
            sidebar.classList.toggle('collapsed');
            document.getElementById('mainContent').classList.toggle('expanded');
            document.getElementById('topNavbar').classList.toggle('expanded');
        }
    }

    hideSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        
        sidebar.classList.remove('show');
        overlay.classList.remove('show');
    }

    handleResize() {
        if (window.innerWidth > 768) {
            // Desktop: ensure sidebar is visible and overlay is hidden
            document.getElementById('sidebar').classList.remove('show');
            document.getElementById('sidebarOverlay').classList.remove('show');
        }
    }

    updateDashboard() {
        // Update dashboard statistics
        const processItems = sharepointManager.getLocalStorageItems();
        const metalDetectionItems = this.getMetalDetectionItems();
        const dailyHygieneItems = this.getDailyHygieneItems();
        const productChangeoverItems = this.getProductChangeoverItems();
        
        // Total process records
        document.getElementById('totalRecords').textContent = processItems.length;
        
        // Metal detection records
        const metalDetectionElement = document.getElementById('metalDetectionRecords');
        if (metalDetectionElement) {
            metalDetectionElement.textContent = metalDetectionItems.length;
        }
        
        // Daily hygiene records
        const dailyHygieneElement = document.getElementById('dailyHygieneRecords');
        if (dailyHygieneElement) {
            dailyHygieneElement.textContent = dailyHygieneItems.length;
        }
        
        // Product changeover records
        const productChangeoverElement = document.getElementById('productChangeoverRecords');
        if (productChangeoverElement) {
            productChangeoverElement.textContent = productChangeoverItems.length;
        }
        
        // Today's records (all types)
        const today = new Date().toDateString();
        const todayProcessRecords = processItems.filter(item => {
            const itemDate = new Date(item.timestamp).toDateString();
            return itemDate === today;
        });
        const todayMetalRecords = metalDetectionItems.filter(item => {
            const itemDate = new Date(item.timestamp).toDateString();
            return itemDate === today;
        });
        const todayHygieneRecords = dailyHygieneItems.filter(item => {
            const itemDate = new Date(item.timestamp).toDateString();
            return itemDate === today;
        });
        const todayChangeoverRecords = productChangeoverItems.filter(item => {
            const itemDate = new Date(item.timestamp).toDateString();
            return itemDate === today;
        });
        
        const totalTodayRecords = todayProcessRecords.length + todayMetalRecords.length + 
                                 todayHygieneRecords.length + todayChangeoverRecords.length;
        
        const todayElement = document.getElementById('todayRecords');
        if (todayElement) {
            todayElement.textContent = totalTodayRecords;
        }
        
        // Recent records (combined)
        const allRecords = [
            ...processItems.map(item => ({ ...item, type: 'Process Data' })),
            ...metalDetectionItems.map(item => ({ ...item, type: 'Metal Detection' })),
            ...dailyHygieneItems.map(item => ({ ...item, type: 'Daily Hygiene' })),
            ...productChangeoverItems.map(item => ({ ...item, type: 'Product Changeover' }))
        ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        this.updateRecentRecords(allRecords.slice(0, 5));
    }

    getMetalDetectionItems() {
        try {
            const data = localStorage.getItem('qaMetalDetectionData');
            return data ? JSON.parse(data).reverse() : []; // Reverse to show newest first
        } catch (error) {
            console.error('Error reading metal detection data from localStorage:', error);
            return [];
        }
    }

    getDailyHygieneItems() {
        try {
            const data = localStorage.getItem('qaDailyHygieneData');
            return data ? JSON.parse(data).reverse() : []; // Reverse to show newest first
        } catch (error) {
            console.error('Error reading daily hygiene data from localStorage:', error);
            return [];
        }
    }

    getProductChangeoverItems() {
        try {
            const data = localStorage.getItem('qaProductChangeoverData');
            return data ? JSON.parse(data).reverse() : []; // Reverse to show newest first
        } catch (error) {
            console.error('Error reading product changeover data from localStorage:', error);
            return [];
        }
    }

    updateRecentRecords(recentItems) {
        const container = document.getElementById('recentRecords');
        
        if (recentItems.length === 0) {
            container.innerHTML = '<p class="text-muted">Chưa có dữ liệu</p>';
            return;
        }
        
        const recordsHtml = recentItems.map((item, index) => {
            const date = new Date(item.timestamp);
            const timeStr = date.toLocaleDateString('vi-VN') + ' ' + date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
            
            let displayInfo = '';
            if (item.type === 'Process Data') {
                displayInfo = `<strong>${item.site} - ${item.lineSX}</strong><br><span class="text-muted">${item.sanPham || '-'}</span>`;
            } else if (item.type === 'Metal Detection') {
                displayInfo = `<strong>${item.site} - Line ${item.line}</strong><br><span class="text-muted">Metal Detection</span>`;
            } else if (item.type === 'Daily Hygiene') {
                displayInfo = `<strong>${item.site} - ${item.khuVuc}</strong><br><span class="text-muted">Daily Hygiene</span>`;
            } else if (item.type === 'Product Changeover') {
                displayInfo = `<strong>${item.site} - Line ${item.line}</strong><br><span class="text-muted">${item.tenSanPham}</span>`;
            }
            
            return `
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <div>
                        <small class="text-muted">${timeStr}</small>
                        <br>
                        ${displayInfo}
                        <br>
                        <small class="badge bg-secondary">${item.type}</small>
                    </div>
                    <button class="btn btn-sm btn-outline-primary" onclick="app.viewItem(${index}, '${item.type}')">
                        <i class="bi bi-eye"></i>
                    </button>
                </div>
            `;
        }).join('');
        
        container.innerHTML = recordsHtml;
    }

    async loadDataTable() {
        try {
            const tbody = document.getElementById('dataTableBody');
            tbody.innerHTML = '<tr><td colspan="6" class="text-center">Đang tải dữ liệu...</td></tr>';
            
            let processItems = [];
            let metalDetectionItems = [];
            let dailyHygieneItems = [];
            let productChangeoverItems = [];
            
            if (this.isDevelopmentMode) {
                // Get data from localStorage
                processItems = sharepointManager.getLocalStorageItems();
                metalDetectionItems = this.getMetalDetectionItems();
                dailyHygieneItems = this.getDailyHygieneItems();
                productChangeoverItems = this.getProductChangeoverItems();
            } else {
                // Get recent items from SharePoint
                processItems = await sharepointManager.getRecentItems(20);
                // TODO: Implement SharePoint integration for other forms
            }
            
            // Combine and sort by timestamp
            const allItems = [
                ...processItems.map(item => ({ ...item, type: 'Process Data' })),
                ...metalDetectionItems.map(item => ({ ...item, type: 'Metal Detection' })),
                ...dailyHygieneItems.map(item => ({ ...item, type: 'Daily Hygiene' })),
                ...productChangeoverItems.map(item => ({ ...item, type: 'Product Changeover' }))
            ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            
            if (allItems && allItems.length > 0) {
                tbody.innerHTML = '';
                allItems.forEach((item, index) => {
                    const row = this.createDataRow(item, index);
                    tbody.appendChild(row);
                });
            } else {
                tbody.innerHTML = '<tr><td colspan="6" class="text-center">Chưa có dữ liệu</td></tr>';
            }
        } catch (error) {
            console.error('Error loading data table:', error);
            document.getElementById('dataTableBody').innerHTML = 
                '<tr><td colspan="6" class="text-center text-danger">Lỗi tải dữ liệu</td></tr>';
        }
    }

    createDataRow(item, index) {
        const row = document.createElement('tr');
        
        if (this.isDevelopmentMode) {
            // Format for localStorage data
            const date = new Date(item.timestamp || new Date());
            const dateStr = date.toLocaleDateString('vi-VN') + ' ' + date.toLocaleTimeString('vi-VN');
            
            let lineSX = '';
            let sanPham = '';
            
            if (item.type === 'Process Data') {
                lineSX = item.lineSX || '-';
                sanPham = item.sanPham || '-';
            } else if (item.type === 'Metal Detection') {
                lineSX = `Line ${item.line}` || '-';
                sanPham = 'Metal Detection';
            } else if (item.type === 'Daily Hygiene') {
                lineSX = `Line ${item.line}` || '-';
                sanPham = item.khuVuc || 'Daily Hygiene';
            } else if (item.type === 'Product Changeover') {
                lineSX = `Line ${item.line}` || '-';
                sanPham = item.tenSanPham || 'Product Changeover';
            }
            
            row.innerHTML = `
                <td>${dateStr}</td>
                <td>${item.site || '-'}</td>
                <td>${lineSX}</td>
                <td>${item.type}</td>
                <td>${sanPham}</td>
                <td>
                    <button class="btn btn-sm btn-info me-1" onclick="app.viewItem(${index}, '${item.type}')">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="app.deleteItem(${index}, '${item.type}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;
        } else {
            // Format for SharePoint data
            const fields = item.fields || item;
            const date = new Date(fields.Created || fields.NSX);
            const dateStr = date.toLocaleDateString('vi-VN') + ' ' + date.toLocaleTimeString('vi-VN');
            
            row.innerHTML = `
                <td>${dateStr}</td>
                <td>${fields.Site || '-'}</td>
                <td>${fields.LineSX || fields.Line_x0020_SX || '-'}</td>
                <td>${item.type || 'Process Data'}</td>
                <td>${fields.SanPham || fields.S_x1ea3_n_x0020_ph_x1ea9_m || '-'}</td>
                <td>
                    <button class="btn btn-sm btn-info" onclick="app.viewItem('${item.id}', '${item.type}')">
                        <i class="bi bi-eye"></i>
                    </button>
                </td>
            `;
        }
        
        return row;
    }

    async viewItem(itemId, itemType) {
        if (this.isDevelopmentMode) {
            // Show item details from localStorage
            let items, item;
            
            if (itemType === 'Process Data') {
                items = JSON.parse(localStorage.getItem('qaProcessData') || '[]');
                item = items[itemId];
            } else if (itemType === 'Metal Detection') {
                items = JSON.parse(localStorage.getItem('qaMetalDetectionData') || '[]');
                item = items[itemId];
            } else if (itemType === 'Daily Hygiene') {
                items = JSON.parse(localStorage.getItem('qaDailyHygieneData') || '[]');
                item = items[itemId];
            } else if (itemType === 'Product Changeover') {
                items = JSON.parse(localStorage.getItem('qaProductChangeoverData') || '[]');
                item = items[itemId];
            }
            
            if (item) {
                const details = JSON.stringify(item, null, 2);
                alert(`Chi tiết bản ghi ${itemType}:\n\n${details}`);
            }
        } else {
            // TODO: Implement view item details from SharePoint
            this.showToast('Thông báo', 'Tính năng xem chi tiết đang phát triển');
        }
    }

    async deleteItem(itemIndex, itemType) {
        if (this.isDevelopmentMode && confirm(`Bạn có chắc muốn xóa bản ghi ${itemType} này?`)) {
            let storageKey = '';
            switch(itemType) {
                case 'Process Data':
                    storageKey = 'qaProcessData';
                    break;
                case 'Metal Detection':
                    storageKey = 'qaMetalDetectionData';
                    break;
                case 'Daily Hygiene':
                    storageKey = 'qaDailyHygieneData';
                    break;
                case 'Product Changeover':
                    storageKey = 'qaProductChangeoverData';
                    break;
                default:
                    return;
            }
            
            let items = JSON.parse(localStorage.getItem(storageKey) || '[]');
            items.splice(itemIndex, 1);
            localStorage.setItem(storageKey, JSON.stringify(items));
            
            // Refresh current view
            if (this.currentForm === 'data-view') {
                await this.loadDataTable();
            }
            
            // Update dashboard if visible
            if (this.currentForm === 'dashboard') {
                this.updateDashboard();
            }
            
            this.showToast('Thành công', 'Đã xóa bản ghi', 'success');
        }
    }

    async syncOfflineData() {
        // Only in production mode
        if (this.isDevelopmentMode) return;
        
        try {
            const offlineData = localStorage.getItem('offlineData');
            if (offlineData) {
                const records = JSON.parse(offlineData);
                
                for (const record of records) {
                    try {
                        await sharepointManager.createItem(record);
                    } catch (error) {
                        console.error('Error syncing record:', error);
                    }
                }
                
                localStorage.removeItem('offlineData');
                this.showToast('Thành công', 'Đã đồng bộ dữ liệu offline');
            }
        } catch (error) {
            console.error('Error syncing offline data:', error);
        }
    }

    showToast(title, message, type = 'info') {
        const toastElement = document.getElementById('toast');
        const toastTitle = document.getElementById('toastTitle');
        const toastMessage = document.getElementById('toastMessage');
        
        toastTitle.textContent = title;
        toastMessage.textContent = message;
        
        // Add color class based on type
        toastElement.classList.remove('text-bg-success', 'text-bg-danger', 'text-bg-warning');
        if (type === 'success') {
            toastElement.classList.add('text-bg-success');
        } else if (type === 'error') {
            toastElement.classList.add('text-bg-danger');
        } else if (type === 'warning') {
            toastElement.classList.add('text-bg-warning');
        }
        
        const toast = new bootstrap.Toast(toastElement);
        toast.show();
    }

    // Development helper methods
    clearAllData() {
        if (confirm('Xóa toàn bộ dữ liệu development (tất cả các forms)?')) {
            localStorage.removeItem('qaProcessData');
            localStorage.removeItem('qaMetalDetectionData');
            localStorage.removeItem('qaDailyHygieneData');
            localStorage.removeItem('qaProductChangeoverData');
            this.showToast('Thành công', 'Đã xóa toàn bộ dữ liệu', 'success');
            
            // Update views
            if (this.currentForm === 'data-view') {
                this.loadDataTable();
            }
            if (this.currentForm === 'dashboard') {
                this.updateDashboard();
            }
        }
    }

    exportData() {
        const processData = localStorage.getItem('qaProcessData');
        const metalDetectionData = localStorage.getItem('qaMetalDetectionData');
        const dailyHygieneData = localStorage.getItem('qaDailyHygieneData');
        const productChangeoverData = localStorage.getItem('qaProductChangeoverData');
        
        const exportData = {
            processData: processData ? JSON.parse(processData) : [],
            metalDetectionData: metalDetectionData ? JSON.parse(metalDetectionData) : [],
            dailyHygieneData: dailyHygieneData ? JSON.parse(dailyHygieneData) : [],
            productChangeoverData: productChangeoverData ? JSON.parse(productChangeoverData) : [],
            exportDate: new Date().toISOString()
        };
        
        const totalRecords = exportData.processData.length + exportData.metalDetectionData.length + 
                            exportData.dailyHygieneData.length + exportData.productChangeoverData.length;
        
        if (totalRecords > 0) {
            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'qa_all_data_export.json';
            a.click();
            URL.revokeObjectURL(url);
        } else {
            this.showToast('Thông báo', 'Không có dữ liệu để export');
        }
    }

    // Public method to refresh dashboard
    refreshDashboard() {
        this.updateDashboard();
    }
}

// Create global app instance
const app = new App();

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    await app.initialize();
});

// Development helper functions (accessible from console)
window.devMode = {
    clearData: () => app.clearAllData(),
    exportData: () => app.exportData(),
    switchToProduction: () => {
        app.isDevelopmentMode = false;
        window.location.reload();
    },
    switchForm: (formName) => app.switchForm(formName)
};
