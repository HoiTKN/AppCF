// js/app.js - Development Version (bypassing login)

// Main Application Controller
class App {
    constructor() {
        this.currentView = 'form';
        this.isOffline = false;
        this.isDevelopmentMode = true; // Development flag
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
            
            // Load parameters
            await formManager.loadParameters();
            
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
        
        // View data button
        document.getElementById('viewDataBtn').addEventListener('click', (e) => {
            e.preventDefault();
            this.showDataView();
        });
        
        // Back to form button
        document.getElementById('backToFormBtn').addEventListener('click', (e) => {
            e.preventDefault();
            this.showFormView();
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
    }

    showFormView() {
        document.getElementById('formSection').style.display = 'block';
        document.getElementById('dataSection').style.display = 'none';
        this.currentView = 'form';
    }

    async showDataView() {
        document.getElementById('formSection').style.display = 'none';
        document.getElementById('dataSection').style.display = 'block';
        this.currentView = 'data';
        
        // Load data from localStorage (dev mode) or SharePoint
        await this.loadDataTable();
    }

    async loadDataTable() {
        try {
            const tbody = document.getElementById('dataTableBody');
            tbody.innerHTML = '<tr><td colspan="6" class="text-center">Đang tải dữ liệu...</td></tr>';
            
            let items = [];
            
            if (this.isDevelopmentMode) {
                // Get data from localStorage
                items = sharepointManager.getLocalStorageItems();
            } else {
                // Get recent items from SharePoint
                items = await sharepointManager.getRecentItems(20);
            }
            
            if (items && items.length > 0) {
                tbody.innerHTML = '';
                items.forEach((item, index) => {
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
            
            row.innerHTML = `
                <td>${dateStr}</td>
                <td>${item.site || '-'}</td>
                <td>${item.lineSX || '-'}</td>
                <td>${item.sanPham || '-'}</td>
                <td>${item.maDKSX || '-'}</td>
                <td>
                    <button class="btn btn-sm btn-info me-1" onclick="app.viewItem(${index})">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="app.deleteItem(${index})">
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
                <td>${fields.SanPham || fields.S_x1ea3_n_x0020_ph_x1ea9_m || '-'}</td>
                <td>${fields.MaDKSX || fields.M_x00e3__x0020__x0110_KSX || '-'}</td>
                <td>
                    <button class="btn btn-sm btn-info" onclick="app.viewItem('${item.id}')">
                        <i class="bi bi-eye"></i>
                    </button>
                </td>
            `;
        }
        
        return row;
    }

    async viewItem(itemId) {
        if (this.isDevelopmentMode) {
            // Show item details from localStorage
            const items = JSON.parse(localStorage.getItem('qaProcessData') || '[]');
            const item = items[itemId];
            if (item) {
                const details = JSON.stringify(item, null, 2);
                alert(`Chi tiết bản ghi:\n\n${details}`);
            }
        } else {
            // TODO: Implement view item details from SharePoint
            this.showToast('Thông báo', 'Tính năng xem chi tiết đang phát triển');
        }
    }

    async deleteItem(itemIndex) {
        if (this.isDevelopmentMode && confirm('Bạn có chắc muốn xóa bản ghi này?')) {
            let items = JSON.parse(localStorage.getItem('qaProcessData') || '[]');
            items.splice(itemIndex, 1);
            localStorage.setItem('qaProcessData', JSON.stringify(items));
            await this.loadDataTable();
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
        if (confirm('Xóa toàn bộ dữ liệu development?')) {
            localStorage.removeItem('qaProcessData');
            this.showToast('Thành công', 'Đã xóa toàn bộ dữ liệu', 'success');
            this.loadDataTable();
        }
    }

    exportData() {
        const data = localStorage.getItem('qaProcessData');
        if (data) {
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'qa_process_data.json';
            a.click();
            URL.revokeObjectURL(url);
        } else {
            this.showToast('Thông báo', 'Không có dữ liệu để export');
        }
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
    }
};
