// Modern App Controller
class ModernApp {
    constructor() {
        this.currentPage = 'dashboard';
        this.isDarkMode = false;
        this.sidebarCollapsed = false;
    }

    async initialize() {
        console.log('Initializing Modern QA App...');
        
        try {
            // Show loading screen
            this.showLoading(true);
            
            // Initialize authentication (mock for dev)
            await this.initializeAuth();
            
            // Initialize SharePoint/Mock data
            await this.initializeData();
            
            // Setup navigation
            this.setupNavigation();
            
            // Setup UI controls
            this.setupUIControls();
            
            // Load initial page
            await this.navigateTo('dashboard');
            
            // Show main app
            this.showLoading(false);
            document.getElementById('mainApp').style.display = 'block';
            
            console.log('App initialized successfully');
        } catch (error) {
            console.error('App initialization failed:', error);
            this.showError(error.message);
        }
    }

    async initializeAuth() {
        // Mock authentication for development
        const userInfo = {
            name: 'QA Manager',
            email: 'qa@company.com',
            role: 'Assistant QA Manager'
        };
        
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        document.getElementById('userName').textContent = userInfo.name;
    }

    async initializeData() {
        // Initialize SharePoint manager with mock data
        if (typeof sharepointManager !== 'undefined') {
            await sharepointManager.initializeMock();
        }
    }

    setupNavigation() {
        // Navigation structure
        const navigation = [
            {
                section: 'DASHBOARD',
                items: [
                    { id: 'dashboard', label: 'Tổng quan', icon: 'speedometer2' }
                ]
            },
            {
                section: 'NHẬP DỮ LIỆU',
                items: [
                    { id: 'process-data', label: 'Process Data', icon: 'clipboard-data' },
                    { id: 'metal-detection', label: 'Kiểm soát máy dò kim loại', icon: 'shield-check' },
                    { id: 'daily-hygiene', label: 'Đánh giá vệ sinh hàng ngày', icon: 'droplet-half' },
                    { id: 'ghp-hygiene', label: 'Đánh giá GHP khi ngưng line >12h', icon: 'clock-history' },
                    { id: 'product-changeover', label: 'Checklist chuyển đổi sản phẩm', icon: 'arrow-repeat' }
                ]
            },
            {
                section: 'BÁO CÁO',
                items: [
                    { id: 'data-view', label: 'Xem dữ liệu', icon: 'table' },
                    { id: 'analytics', label: 'Phân tích', icon: 'graph-up' }
                ]
            },
            {
                section: 'CÀI ĐẶT',
                items: [
                    { id: 'parameters', label: 'Thông số', icon: 'gear' }
                ]
            }
        ];

        // Render navigation
        const navContainer = document.getElementById('sidebarNav');
        navContainer.innerHTML = navigation.map(section => `
            <div class="nav-section">
                <div class="nav-section-title">${section.section}</div>
                ${section.items.map(item => `
                    <a href="#" class="nav-link ${item.id === this.currentPage ? 'active' : ''}" 
                       data-page="${item.id}">
                        <i class="bi bi-${item.icon}"></i>
                        <span>${item.label}</span>
                    </a>
                `).join('')}
            </div>
        `).join('');

        // Attach click handlers
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.dataset.page;
                if (page) {
                    this.navigateTo(page);
                }
            });
        });
    }

    setupUIControls() {
        // Menu toggle
        const menuToggle = document.getElementById('menuToggle');
        menuToggle?.addEventListener('click', () => this.toggleSidebar());

        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        themeToggle?.addEventListener('click', () => this.toggleTheme());

        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        logoutBtn?.addEventListener('click', () => this.handleLogout());

        // Sidebar overlay for mobile
        const overlay = document.getElementById('sidebarOverlay');
        overlay?.addEventListener('click', () => this.hideSidebar());

        // Handle window resize
        window.addEventListener('resize', () => this.handleResize());
    }

    async navigateTo(page) {
        console.log(`Navigating to: ${page}`);
        
        // Update active nav
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.page === page) {
                link.classList.add('active');
            }
        });

        // Update breadcrumb
        this.updateBreadcrumb(page);

        // Get content container
        const container = document.getElementById('contentContainer');
        
        // Load component based on page
        try {
            switch(page) {
                case 'dashboard':
                    await componentLoader.load('dashboard', container);
                    break;
                case 'process-data':
                    await componentLoader.load('process-data', container);
                    break;
                case 'metal-detection':
                    await componentLoader.load('metal-detection', container);
                    break;
                case 'daily-hygiene':
                    await componentLoader.load('daily-hygiene', container);
                    break;
                case 'ghp-hygiene':
                    await componentLoader.load('ghp-hygiene', container);
                    break;
                case 'product-changeover':
                    await componentLoader.load('product-changeover', container);
                    break;
                case 'data-view':
                    await this.loadDataView(container);
                    break;
                case 'analytics':
                    await this.loadAnalytics(container);
                    break;
                case 'parameters':
                    await this.loadParameters(container);
                    break;
                default:
                    this.show404(container);
            }
            
            this.currentPage = page;
            
            // Hide sidebar on mobile after navigation
            if (window.innerWidth <= 768) {
                this.hideSidebar();
            }
        } catch (error) {
            console.error(`Error loading page ${page}:`, error);
            this.showError(error.message, container);
        }
    }

    updateBreadcrumb(page) {
        const pageNames = {
            'dashboard': 'Dashboard',
            'process-data': 'Process Data',
            'metal-detection': 'Kiểm soát máy dò kim loại',
            'daily-hygiene': 'Đánh giá vệ sinh hàng ngày',
            'ghp-hygiene': 'Đánh giá GHP khi ngưng line >12h',
            'product-changeover': 'Checklist chuyển đổi sản phẩm',
            'data-view': 'Xem dữ liệu',
            'analytics': 'Phân tích',
            'parameters': 'Thông số'
        };

        document.getElementById('currentPage').textContent = pageNames[page] || page;
    }

    async loadDataView(container) {
        // Simple data view implementation
        container.innerHTML = `
            <div class="fade-in">
                <div class="page-header mb-4">
                    <h2 class="page-title">
                        <i class="bi bi-table me-2"></i>
                        Xem dữ liệu
                    </h2>
                    <p class="text-muted">Xem và quản lý dữ liệu đã nhập</p>
                </div>
                
                <div class="modern-card">
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Thời gian</th>
                                        <th>Loại</th>
                                        <th>Site</th>
                                        <th>Line</th>
                                        <th>Trạng thái</th>
                                        <th>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody id="dataTableBody">
                                    <tr>
                                        <td colspan="6" class="text-center">
                                            <div class="spinner-border text-primary" role="status">
                                                <span class="visually-hidden">Loading...</span>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Load data
        setTimeout(() => this.loadTableData(), 100);
    }

    loadTableData() {
        // Get all data from localStorage
        const processData = JSON.parse(localStorage.getItem('qaProcessData') || '[]');
        const metalData = JSON.parse(localStorage.getItem('qaMetalDetectionData') || '[]');
        const hygieneData = JSON.parse(localStorage.getItem('qaDailyHygieneData') || '[]');
        const ghpData = JSON.parse(localStorage.getItem('qaGHPHygieneData') || '[]');
        const changeoverData = JSON.parse(localStorage.getItem('qaProductChangeoverData') || '[]');

        const allData = [
            ...processData.map(d => ({ ...d, type: 'Process Data', badge: 'primary' })),
            ...metalData.map(d => ({ ...d, type: 'Metal Detection', badge: 'success' })),
            ...hygieneData.map(d => ({ ...d, type: 'Daily Hygiene', badge: 'info' })),
            ...ghpData.map(d => ({ ...d, type: 'GHP Hygiene', badge: 'warning' })),
            ...changeoverData.map(d => ({ ...d, type: 'Product Changeover', badge: 'secondary' }))
        ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        const tbody = document.getElementById('dataTableBody');
        if (allData.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Chưa có dữ liệu</td></tr>';
            return;
        }

        tbody.innerHTML = allData.slice(0, 50).map(item => `
            <tr>
                <td>${new Date(item.timestamp).toLocaleString('vi-VN')}</td>
                <td><span class="badge bg-${item.badge}">${item.type}</span></td>
                <td>${item.site || '-'}</td>
                <td>${item.line || item.lineSX || '-'}</td>
                <td><span class="badge bg-success">Đã lưu</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="app.viewRecord('${item.id}')">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="app.deleteRecord('${item.id}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    async loadAnalytics(container) {
        container.innerHTML = `
            <div class="fade-in">
                <div class="page-header mb-4">
                    <h2 class="page-title">
                        <i class="bi bi-graph-up me-2"></i>
                        Phân tích dữ liệu
                    </h2>
                    <p class="text-muted">Phân tích và báo cáo thống kê</p>
                </div>
                
                <div class="alert alert-info">
                    <i class="bi bi-info-circle me-2"></i>
                    Module phân tích đang được phát triển. Sẽ sớm có các biểu đồ và báo cáo chi tiết.
                </div>
            </div>
        `;
    }

    async loadParameters(container) {
        container.innerHTML = `
            <div class="fade-in">
                <div class="page-header mb-4">
                    <h2 class="page-title">
                        <i class="bi bi-gear me-2"></i>
                        Cài đặt thông số
                    </h2>
                    <p class="text-muted">Quản lý thông số hệ thống</p>
                </div>
                
                <div class="alert alert-info">
                    <i class="bi bi-info-circle me-2"></i>
                    Module cài đặt đang được phát triển.
                </div>
            </div>
        `;
    }

    show404(container) {
        container.innerHTML = `
            <div class="text-center py-5">
                <i class="bi bi-exclamation-triangle text-warning" style="font-size: 4rem;"></i>
                <h3 class="mt-3">Trang không tồn tại</h3>
                <p class="text-muted">Không tìm thấy trang bạn yêu cầu</p>
                <button class="btn btn-primary" onclick="app.navigateTo('dashboard')">
                    Về trang chủ
                </button>
            </div>
        `;
    }

    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const mainWrapper = document.getElementById('mainWrapper');
        
        if (window.innerWidth <= 768) {
            // Mobile: show/hide sidebar
            sidebar.classList.toggle('show');
            document.getElementById('sidebarOverlay').classList.toggle('show');
        } else {
            // Desktop: collapse/expand
            sidebar.classList.toggle('collapsed');
            mainWrapper.classList.toggle('expanded');
            this.sidebarCollapsed = !this.sidebarCollapsed;
        }
    }

    hideSidebar() {
        document.getElementById('sidebar').classList.remove('show');
        document.getElementById('sidebarOverlay').classList.remove('show');
    }

    toggleTheme() {
        this.isDarkMode = !this.isDarkMode;
        document.body.setAttribute('data-theme', this.isDarkMode ? 'dark' : 'light');
        
        const themeIcon = document.querySelector('#themeToggle i');
        themeIcon.className = this.isDarkMode ? 'bi bi-sun' : 'bi bi-moon';
        
        localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    }

    handleResize() {
        if (window.innerWidth > 768) {
            this.hideSidebar();
        }
    }

    handleLogout() {
        if (confirm('Bạn có chắc muốn đăng xuất?')) {
            localStorage.clear();
            window.location.reload();
        }
    }

    showLoading(show) {
        document.getElementById('loadingScreen').style.display = show ? 'flex' : 'none';
    }

    showError(message, container = null) {
        const errorHtml = `
            <div class="alert alert-danger m-3">
                <h5 class="alert-heading">
                    <i class="bi bi-exclamation-triangle-fill me-2"></i>
                    Lỗi
                </h5>
                <p>${message}</p>
            </div>
        `;
        
        if (container) {
            container.innerHTML = errorHtml;
        } else {
            alert(message);
        }
    }

    // Public methods for components
    viewRecord(id, type) {
        console.log('View record:', id, type);
        // Implementation for viewing record details
        alert(`Xem chi tiết record: ${id}`);
    }

    deleteRecord(id) {
        if (confirm('Bạn có chắc muốn xóa bản ghi này?')) {
            console.log('Delete record:', id);
            // Implementation for deleting record
            this.loadTableData(); // Refresh table
        }
    }
}

// Initialize theme from localStorage
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
    }
});
