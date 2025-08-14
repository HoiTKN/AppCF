// Modern App Controller - Updated with Authentication
class ModernApp {
    constructor() {
        this.currentPage = 'dashboard';
        this.isDarkMode = false;
        this.sidebarCollapsed = false;
        this.isAuthenticated = false;
        this.currentUser = null;
    }

    async initialize() {
        console.log('Initializing Modern QA App...');
        
        try {
            // Show loading screen
            this.showLoading(true);
            
            // Initialize authentication (mock for dev)
            await this.initializeAuth();
            
            // Check if user is already logged in
            const isLoggedIn = await this.checkExistingSession();
            
            if (isLoggedIn) {
                // User is logged in, proceed to main app
                await this.initializeMainApp();
            } else {
                // Show login screen
                await this.showLoginScreen();
            }
            
            console.log('App initialized successfully');
        } catch (error) {
            console.error('App initialization failed:', error);
            this.showError(error.message);
        }
    }

    async checkExistingSession() {
        try {
            // Check if user session exists
            this.currentUser = employeeManager.getCurrentUser();
            
            if (this.currentUser) {
                console.log('Found existing session:', this.currentUser.name);
                this.isAuthenticated = true;
                return true;
            }
            
            return false;
        } catch (error) {
            console.error('Session check failed:', error);
            return false;
        }
    }

    async showLoginScreen() {
        // Hide main app and show login
        document.getElementById('mainApp').style.display = 'none';
        
        // Create login container if not exists
        let loginContainer = document.getElementById('loginContainer');
        if (!loginContainer) {
            loginContainer = document.createElement('div');
            loginContainer.id = 'loginContainer';
            document.body.appendChild(loginContainer);
        }
        
        loginContainer.style.display = 'block';
        
        // Load login component
        await componentLoader.load('login', loginContainer);
        
        // Hide loading screen
        this.showLoading(false);
    }

    async initializeMainApp() {
        // Initialize SharePoint/Mock data
        await this.initializeData();
        
        // Initialize master data manager
        await this.initializeMasterData();
        
        // Setup navigation based on user role
        this.setupNavigation();
        
        // Setup UI controls
        this.setupUIControls();
        
        // Update user info in UI
        this.updateUserInterface();
        
        // Load initial page
        await this.navigateTo('dashboard');
        
        // Show main app
        this.showLoading(false);
        document.getElementById('mainApp').style.display = 'block';
        
        // Hide login container
        const loginContainer = document.getElementById('loginContainer');
        if (loginContainer) {
            loginContainer.style.display = 'none';
        }
    }

    async initializeMasterData() {
        // Initialize master data manager
        if (typeof masterDataManager !== 'undefined') {
            await masterDataManager.initialize();
            console.log('Master data manager initialized');
        }
    }

    async initializeAfterLogin() {
        // Called from login component after successful login
        this.currentUser = employeeManager.getCurrentUser();
        this.isAuthenticated = true;
        
        console.log('Login successful:', this.currentUser.name);
        
        // Initialize main app
        await this.initializeMainApp();
    }

    async initializeAuth() {
        // Mock authentication for development - already handled by EmployeeManager
        console.log('Authentication system initialized');
    }

    async initializeData() {
        // Initialize SharePoint manager with mock data
        if (typeof sharepointManager !== 'undefined') {
            await sharepointManager.initializeMock();
        }
    }

    setupNavigation() {
        // Navigation structure - Updated with role-based access
        const navigation = this.getNavigationByRole();

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
                        ${item.badge ? `<span class="badge bg-${item.badge.color} ms-auto">${item.badge.text}</span>` : ''}
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

    getNavigationByRole() {
        const baseNavigation = [
            {
                section: 'DASHBOARD',
                items: [
                    { id: 'dashboard', label: 'Tổng quan', icon: 'speedometer2' }
                ]
            },
            {
                section: 'NHẬP DỮ LIỆU',
                items: [
                    { id: 'process-data', label: 'Data công nghệ mì', icon: 'clipboard-data' },
                    { id: 'pho-technology', label: 'Data công nghệ phở', icon: 'clipboard-data-fill' },
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
            }
        ];

        // Add admin section for managers
        if (this.currentUser && employeeManager.isManager()) {
            baseNavigation.push({
                section: 'QUẢN TRỊ',
                items: [
                    { 
                        id: 'user-management', 
                        label: 'Quản lý người dùng', 
                        icon: 'people',
                        badge: { text: 'Admin', color: 'danger' }
                    },
                    { 
                        id: 'master-data', 
                        label: 'Dữ liệu chính', 
                        icon: 'database',
                        badge: { text: 'Admin', color: 'danger' }
                    },
                    { id: 'parameters', label: 'Thông số hệ thống', icon: 'gear' }
                ]
            });
        }

        // Filter navigation based on user permissions and group
        if (this.currentUser) {
            const userGroup = this.currentUser.group;
            
            // Filter forms based on user group
            if (userGroup === 'Mì') {
                // Mì group can access mì and general forms
                baseNavigation[1].items = baseNavigation[1].items.filter(item => 
                    !item.id.includes('pho') // Hide pho-related forms
                );
            } else if (userGroup === 'Phở') {
                // Phở group can access phở and general forms
                baseNavigation[1].items = baseNavigation[1].items.filter(item => 
                    !item.id.includes('process-data') // Hide mì-specific forms
                );
            }
            // Managers and "Chung" group can see all forms
        }

        return baseNavigation;
    }

    updateUserInterface() {
        if (!this.currentUser) return;

        // Update user name in sidebar
        const userName = document.getElementById('userName');
        if (userName) {
            userName.textContent = this.currentUser.name;
        }

        // Update user role badge
        const userRoleElement = document.querySelector('.user-role');
        if (userRoleElement) {
            userRoleElement.textContent = `${this.currentUser.role} - ${this.currentUser.site}`;
        }

        // Update DEV badge for managers
        const devBadge = document.querySelector('.sidebar-header .badge');
        if (devBadge && employeeManager.isManager()) {
            devBadge.textContent = 'ADMIN';
            devBadge.className = 'badge bg-danger ms-auto';
        }

        // Add user info to breadcrumb if needed
        this.addUserContextToBreadcrumb();
    }

    addUserContextToBreadcrumb() {
        const breadcrumb = document.getElementById('breadcrumb');
        if (breadcrumb && this.currentUser) {
            // Add site info to breadcrumb
            const siteInfo = document.createElement('li');
            siteInfo.className = 'breadcrumb-item';
            siteInfo.innerHTML = `<small class="text-muted">${this.currentUser.site}</small>`;
            breadcrumb.insertBefore(siteInfo, breadcrumb.lastElementChild);
        }
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
        
        // Check authentication
        if (!this.isAuthenticated) {
            await this.showLoginScreen();
            return;
        }

        // Check permissions for admin pages
        if (['user-management', 'master-data'].includes(page) && !employeeManager.isManager()) {
            this.showToast('Lỗi', 'Bạn không có quyền truy cập trang này', 'error');
            return;
        }

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
                case 'pho-technology':
                    await componentLoader.load('pho-technology', container);
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
                case 'user-management':
                    await this.loadUserManagement(container);
                    break;
                case 'master-data':
                    await componentLoader.load('file-upload', container);
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
            'process-data': 'Data công nghệ mì',
            'pho-technology': 'Data công nghệ phở',
            'metal-detection': 'Kiểm soát máy dò kim loại',
            'daily-hygiene': 'Đánh giá vệ sinh hàng ngày',
            'ghp-hygiene': 'Đánh giá GHP khi ngưng line >12h',
            'product-changeover': 'Checklist chuyển đổi sản phẩm',
            'data-view': 'Xem dữ liệu',
            'analytics': 'Phân tích',
            'user-management': 'Quản lý người dùng',
            'master-data': 'Dữ liệu chính',
            'parameters': 'Thông số hệ thống'
        };

        document.getElementById('currentPage').textContent = pageNames[page] || page;
    }

    async loadUserManagement(container) {
        if (!employeeManager.isManager()) {
            this.showAccessDenied(container);
            return;
        }

        container.innerHTML = `
            <div class="fade-in">
                <div class="page-header mb-4">
                    <h2 class="page-title">
                        <i class="bi bi-people me-2"></i>
                        Quản lý người dùng
                    </h2>
                    <p class="text-muted">Quản lý thông tin nhân viên và phân quyền</p>
                </div>
                
                <div class="modern-card">
                    <div class="card-header">
                        <h5 class="card-title mb-0">Danh sách nhân viên - Site: ${this.currentUser.site}</h5>
                    </div>
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Mã NV</th>
                                        <th>Họ tên</th>
                                        <th>Site</th>
                                        <th>Nhóm</th>
                                        <th>Vai trò</th>
                                        <th>Trạng thái</th>
                                        <th>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${this.renderEmployeeTable()}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderEmployeeTable() {
        const employees = employeeManager.getEmployeesBySite(this.currentUser.site);
        
        return employees.map(emp => `
            <tr>
                <td><code>${emp.id}</code></td>
                <td>${emp.name}</td>
                <td><span class="badge bg-primary">${emp.site}</span></td>
                <td><span class="badge bg-secondary">${emp.group}</span></td>
                <td>
                    <span class="badge ${emp.role === 'Quản lý' ? 'bg-danger' : 'bg-success'}">
                        ${emp.role}
                    </span>
                </td>
                <td>
                    <span class="badge ${emp.active ? 'bg-success' : 'bg-secondary'}">
                        ${emp.active ? 'Hoạt động' : 'Tạm khóa'}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="app.viewEmployee('${emp.id}')">
                        <i class="bi bi-eye"></i>
                    </button>
                    ${employeeManager.hasPermission('admin') ? `
                        <button class="btn btn-sm btn-outline-warning" onclick="app.editEmployee('${emp.id}')">
                            <i class="bi bi-pencil"></i>
                        </button>
                    ` : ''}
                </td>
            </tr>
        `).join('');
    }

    async loadMasterDataManagement(container) {
        if (!employeeManager.isManager()) {
            this.showAccessDenied(container);
            return;
        }

        container.innerHTML = `
            <div class="fade-in">
                <div class="page-header mb-4">
                    <h2 class="page-title">
                        <i class="bi bi-database me-2"></i>
                        Quản lý dữ liệu chính
                    </h2>
                    <p class="text-muted">Upload và quản lý các file dữ liệu master</p>
                </div>
                
                <div class="alert alert-info">
                    <i class="bi bi-info-circle me-2"></i>
                    Module này đang được phát triển. Sẽ có chức năng upload Excel/CSV files.
                </div>
            </div>
        `;
    }

    showAccessDenied(container) {
        container.innerHTML = `
            <div class="text-center py-5">
                <i class="bi bi-shield-x text-danger" style="font-size: 4rem;"></i>
                <h3 class="mt-3 text-danger">Không có quyền truy cập</h3>
                <p class="text-muted">Bạn không có quyền truy cập vào trang này</p>
                <button class="btn btn-primary" onclick="app.navigateTo('dashboard')">
                    Về trang chủ
                </button>
            </div>
        `;
    }

    async loadDataView(container) {
        // Existing implementation with role-based filtering
        container.innerHTML = `
            <div class="fade-in">
                <div class="page-header mb-4">
                    <h2 class="page-title">
                        <i class="bi bi-table me-2"></i>
                        Xem dữ liệu
                    </h2>
                    <p class="text-muted">Xem và quản lý dữ liệu đã nhập - Site: ${this.currentUser.site}</p>
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
                                        <th>Người nhập</th>
                                        <th>Trạng thái</th>
                                        <th>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody id="dataTableBody">
                                    <tr>
                                        <td colspan="7" class="text-center">
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

        setTimeout(() => this.loadTableData(), 100);
    }

    loadTableData() {
        // Filter data by user's site and permissions
        const allData = this.getAllDataFilteredByUser();

        const tbody = document.getElementById('dataTableBody');
        if (allData.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">Chưa có dữ liệu</td></tr>';
            return;
        }

        tbody.innerHTML = allData.slice(0, 50).map(item => `
            <tr>
                <td>${new Date(item.timestamp).toLocaleString('vi-VN')}</td>
                <td><span class="badge bg-${item.badge}">${item.type}</span></td>
                <td>${item.site || '-'}</td>
                <td>${item.line || item.lineSX || '-'}</td>
                <td><small>${item.maNhanVien || 'N/A'}</small></td>
                <td><span class="badge bg-success">Đã lưu</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="app.viewRecord('${item.id}')">
                        <i class="bi bi-eye"></i>
                    </button>
                    ${employeeManager.hasPermission('delete') ? `
                        <button class="btn btn-sm btn-outline-danger" onclick="app.deleteRecord('${item.id}')">
                            <i class="bi bi-trash"></i>
                        </button>
                    ` : ''}
                </td>
            </tr>
        `).join('');
    }

    getAllDataFilteredByUser() {
        const processData = JSON.parse(localStorage.getItem('qaProcessData') || '[]');
        const phoData = JSON.parse(localStorage.getItem('qaPhoTechnologyData') || '[]');
        const metalData = JSON.parse(localStorage.getItem('qaMetalDetectionData') || '[]');
        const hygieneData = JSON.parse(localStorage.getItem('qaDailyHygieneData') || '[]');
        const ghpData = JSON.parse(localStorage.getItem('qaGHPHygieneData') || '[]');
        const changeoverData = JSON.parse(localStorage.getItem('qaProductChangeoverData') || '[]');

        let allData = [
            ...processData.map(d => ({ ...d, type: 'Data công nghệ mì', badge: 'primary' })),
            ...phoData.map(d => ({ ...d, type: 'Data công nghệ phở', badge: 'info' })),
            ...metalData.map(d => ({ ...d, type: 'Metal Detection', badge: 'success' })),
            ...hygieneData.map(d => ({ ...d, type: 'Daily Hygiene', badge: 'info' })),
            ...ghpData.map(d => ({ ...d, type: 'GHP Hygiene', badge: 'warning' })),
            ...changeoverData.map(d => ({ ...d, type: 'Product Changeover', badge: 'secondary' }))
        ];

        // Filter by user's site unless they're a manager
        if (!employeeManager.isManager()) {
            allData = allData.filter(item => item.site === this.currentUser.site);
        }

        return allData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }

    async loadAnalytics(container) {
        container.innerHTML = `
            <div class="fade-in">
                <div class="page-header mb-4">
                    <h2 class="page-title">
                        <i class="bi bi-graph-up me-2"></i>
                        Phân tích dữ liệu
                    </h2>
                    <p class="text-muted">Phân tích và báo cáo thống kê - Site: ${this.currentUser.site}</p>
                </div>
                
                <div class="alert alert-info">
                    <i class="bi bi-info-circle me-2"></i>
                    Module phân tích đang được phát triển. Sẽ sớm có các biểu đồ và báo cáo chi tiết theo site.
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
                        Thông số hệ thống
                    </h2>
                    <p class="text-muted">Cài đặt và thông số hệ thống</p>
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
            sidebar.classList.toggle('show');
            document.getElementById('sidebarOverlay').classList.toggle('show');
        } else {
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
            // Logout from employee manager
            employeeManager.logout();
            
            // Reset app state
            this.isAuthenticated = false;
            this.currentUser = null;
            
            // Show login screen
            this.showLoginScreen();
            
            this.showToast('Thông báo', 'Đã đăng xuất thành công', 'info');
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

    showToast(title, message, type = 'info') {
        let toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toastContainer';
            toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
            toastContainer.style.zIndex = '9999';
            document.body.appendChild(toastContainer);
        }

        const toastId = 'toast-' + Date.now();
        const bgColor = {
            'success': 'success',
            'error': 'danger',
            'warning': 'warning',
            'info': 'primary'
        }[type] || 'primary';

        const iconClass = {
            'success': 'check-circle-fill',
            'error': 'exclamation-triangle-fill',
            'warning': 'exclamation-triangle-fill',
            'info': 'info-circle-fill'
        }[type] || 'info-circle-fill';

        const toastHtml = `
            <div id="${toastId}" class="toast align-items-center text-bg-${bgColor} border-0" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="d-flex">
                    <div class="toast-body">
                        <div class="d-flex align-items-center">
                            <i class="bi bi-${iconClass} me-2"></i>
                            <div>
                                <div class="fw-bold">${title}</div>
                                <div>${message}</div>
                            </div>
                        </div>
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                </div>
            </div>
        `;

        toastContainer.insertAdjacentHTML('beforeend', toastHtml);

        const toastElement = document.getElementById(toastId);
        const toast = new bootstrap.Toast(toastElement, {
            autohide: true,
            delay: type === 'error' ? 6000 : 4000
        });

        toast.show();

        toastElement.addEventListener('hidden.bs.toast', () => {
            toastElement.remove();
        });
    }

    // Public methods for components
    viewRecord(id, type) {
        console.log('View record:', id, type);
        this.showToast('Thông báo', `Xem chi tiết record: ${id}`, 'info');
    }

    deleteRecord(id) {
        if (!employeeManager.hasPermission('delete')) {
            this.showToast('Lỗi', 'Bạn không có quyền xóa dữ liệu', 'error');
            return;
        }

        if (confirm('Bạn có chắc muốn xóa bản ghi này?')) {
            console.log('Delete record:', id);
            this.showToast('Thành công', 'Đã xóa bản ghi', 'success');
            this.loadTableData();
        }
    }

    viewEmployee(id) {
        console.log('View employee:', id);
        this.showToast('Thông báo', `Xem thông tin nhân viên: ${id}`, 'info');
    }

    editEmployee(id) {
        console.log('Edit employee:', id);
        this.showToast('Thông báo', `Chỉnh sửa nhân viên: ${id}`, 'info');
    }

    // Master Data Management Methods
    viewMasterData(dataType) {
        console.log('View master data:', dataType);
        
        let data, title;
        switch(dataType) {
            case 'employees':
                data = masterDataManager.employeesData;
                title = 'Danh sách nhân viên';
                break;
            case 'conditions-mi':
                data = masterDataManager.processConditionsMi;
                title = 'Điều kiện công nghệ mì';
                break;
            case 'conditions-pho':
                data = masterDataManager.processConditionsPho;
                title = 'Điều kiện công nghệ phở';
                break;
            default:
                this.showToast('Lỗi', 'Loại dữ liệu không hợp lệ', 'error');
                return;
        }
        
        this.showMasterDataModal(title, data, dataType);
    }

    showMasterDataModal(title, data, dataType) {
        // Create modal to show master data
        const modalHtml = `
            <div class="modal fade" id="masterDataModal" tabindex="-1">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${title}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="table-responsive">
                                <table class="table table-hover">
                                    <thead class="table-light">
                                        ${this.renderMasterDataHeaders(dataType)}
                                    </thead>
                                    <tbody>
                                        ${this.renderMasterDataRows(data, dataType)}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                            <button type="button" class="btn btn-primary" onclick="masterDataManager.exportToCSV('${dataType}')">
                                <i class="bi bi-download me-2"></i>Export CSV
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Remove existing modal
        const existingModal = document.getElementById('masterDataModal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Add new modal
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('masterDataModal'));
        modal.show();
    }

    renderMasterDataHeaders(dataType) {
        switch(dataType) {
            case 'employees':
                return `
                    <tr>
                        <th>Mã NV</th>
                        <th>Họ tên</th>
                        <th>Email</th>
                        <th>Site</th>
                        <th>Nhóm</th>
                        <th>Vai trò</th>
                        <th>Trạng thái</th>
                    </tr>
                `;
            case 'conditions-mi':
                return `
                    <tr>
                        <th>Site</th>
                        <th>Brand</th>
                        <th>Mã ĐKSX</th>
                        <th>Sản phẩm</th>
                        <th>Nhiệt độ (Min-Max)</th>
                        <th>Brix Kansui</th>
                        <th>Độ dày</th>
                    </tr>
                `;
            case 'conditions-pho':
                return `
                    <tr>
                        <th>Site</th>
                        <th>Brand</th>
                        <th>Mã ĐKSX</th>
                        <th>Sản phẩm</th>
                        <th>Baume Kansui</th>
                        <th>Độ dày</th>
                        <th>Độ ẩm Max</th>
                    </tr>
                `;
            default:
                return '<tr><th>No data</th></tr>';
        }
    }

    renderMasterDataRows(data, dataType) {
        if (!data || data.length === 0) {
            return '<tr><td colspan="7" class="text-center text-muted">Không có dữ liệu</td></tr>';
        }
        
        switch(dataType) {
            case 'employees':
                return data.map(emp => `
                    <tr>
                        <td><code>${emp.id}</code></td>
                        <td>${emp.name}</td>
                        <td><small>${emp.email}</small></td>
                        <td><span class="badge bg-primary">${emp.site}</span></td>
                        <td><span class="badge bg-secondary">${emp.group}</span></td>
                        <td><span class="badge ${emp.role === 'Quản lý' ? 'bg-danger' : 'bg-success'}">${emp.role}</span></td>
                        <td><span class="badge ${emp.active ? 'bg-success' : 'bg-secondary'}">${emp.active ? 'Hoạt động' : 'Tạm khóa'}</span></td>
                    </tr>
                `).join('');
            
            case 'conditions-mi':
                return data.map(cond => `
                    <tr>
                        <td><span class="badge bg-primary">${cond.site}</span></td>
                        <td>${cond.brand}</td>
                        <td><code>${cond.maDKSX}</code></td>
                        <td><small>${cond.unifiedName}</small></td>
                        <td><small>${cond.tempRanges.dauMin}-${cond.tempRanges.dauMax}°C</small></td>
                        <td><small>${cond.brixKansui.min}-${cond.brixKansui.max}</small></td>
                        <td><small>${cond.thicknessRange.min}-${cond.thicknessRange.max}mm</small></td>
                    </tr>
                `).join('');
            
            case 'conditions-pho':
                return data.map(cond => `
                    <tr>
                        <td><span class="badge bg-info">${cond.site}</span></td>
                        <td>${cond.brand}</td>
                        <td><code>${cond.maDKSX}</code></td>
                        <td><small>${cond.unifiedName}</small></td>
                        <td><small>${cond.baumeKansui.min}-${cond.baumeKansui.max}</small></td>
                        <td><small>${cond.thicknessAfterSteam.min}-${cond.thicknessAfterSteam.max}mm</small></td>
                        <td><small>≤${cond.moistureMax}%</small></td>
                    </tr>
                `).join('');
            
            default:
                return '<tr><td colspan="7" class="text-center text-muted">Không hỗ trợ loại dữ liệu này</td></tr>';
        }
    }

    async backupMasterData() {
        if (!employeeManager.isManager()) {
            this.showToast('Lỗi', 'Chỉ quản lý mới có thể backup dữ liệu', 'error');
            return;
        }
        
        try {
            // Create backup object
            const backup = {
                timestamp: new Date().toISOString(),
                version: APP_CONFIG.app.version,
                user: employeeManager.getCurrentUser().name,
                data: {
                    employees: masterDataManager.employeesData,
                    conditionsMi: masterDataManager.processConditionsMi,
                    conditionsPho: masterDataManager.processConditionsPho
                }
            };
            
            // Download as JSON
            const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `qa-master-data-backup-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            
            this.showToast('Thành công', 'Đã tạo file backup thành công', 'success');
        } catch (error) {
            console.error('Error creating backup:', error);
            this.showToast('Lỗi', 'Không thể tạo backup', 'error');
        }
    }

    async syncMasterData() {
        if (!employeeManager.isManager()) {
            this.showToast('Lỗi', 'Chỉ quản lý mới có thể sync dữ liệu', 'error');
            return;
        }
        
        try {
            // Simulate sync process
            this.showToast('Thông báo', 'Đang đồng bộ dữ liệu...', 'info');
            
            // In real implementation, this would sync with SharePoint or GitHub
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Update last sync time
            masterDataManager.lastSync = new Date().toISOString();
            localStorage.setItem('masterDataLastSync', masterDataManager.lastSync);
            
            this.showToast('Thành công', 'Đồng bộ dữ liệu thành công', 'success');
        } catch (error) {
            console.error('Error syncing data:', error);
            this.showToast('Lỗi', 'Không thể đồng bộ dữ liệu', 'error');
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
