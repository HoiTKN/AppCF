// js/login-component.js - Authentication Component

class LoginComponent extends BaseComponent {
    async initialize() {
        this.state = {
            isLoading: false,
            errorMessage: '',
            rememberMe: false
        };
    }

    async render() {
        this.container.innerHTML = `
            <div class="login-wrapper">
                <div class="login-container">
                    <div class="login-card modern-card">
                        <div class="login-header text-center mb-4">
                            <div class="login-logo mb-3">
                                <i class="bi bi-clipboard-pulse text-primary" style="font-size: 3rem;"></i>
                            </div>
                            <h2 class="login-title">QA Smart System</h2>
                            <p class="text-muted">Hệ thống quản lý chất lượng thông minh</p>
                        </div>

                        <form id="loginForm" class="login-form">
                            <div class="form-section">
                                <div class="mb-3">
                                    <label class="form-label">
                                        <i class="bi bi-person-badge me-2"></i>
                                        Mã nhân viên
                                    </label>
                                    <input 
                                        type="text" 
                                        class="modern-input form-control-lg" 
                                        id="employeeId" 
                                        placeholder="VD: 25MB03590"
                                        autocomplete="username"
                                        required
                                    >
                                    <div class="form-helper">
                                        Nhập mã nhân viên của bạn
                                    </div>
                                </div>

                                <div class="mb-3">
                                    <label class="form-label">
                                        <i class="bi bi-lock me-2"></i>
                                        Mật khẩu
                                    </label>
                                    <div class="input-group">
                                        <input 
                                            type="password" 
                                            class="modern-input form-control-lg" 
                                            id="password" 
                                            placeholder="Nhập mật khẩu"
                                            autocomplete="current-password"
                                            required
                                        >
                                        <button 
                                            class="btn btn-outline-secondary" 
                                            type="button" 
                                            id="togglePassword"
                                            tabindex="-1"
                                        >
                                            <i class="bi bi-eye"></i>
                                        </button>
                                    </div>
                                    <div class="form-helper">
                                        Mật khẩu tạm thời: 123
                                    </div>
                                </div>

                                <div class="mb-3">
                                    <div class="form-check">
                                        <input 
                                            class="form-check-input" 
                                            type="checkbox" 
                                            id="rememberMe"
                                        >
                                        <label class="form-check-label" for="rememberMe">
                                            Ghi nhớ đăng nhập
                                        </label>
                                    </div>
                                </div>

                                <div id="errorAlert" class="alert alert-danger" style="display: none;">
                                    <i class="bi bi-exclamation-triangle me-2"></i>
                                    <span id="errorMessage"></span>
                                </div>

                                <div class="d-grid">
                                    <button 
                                        type="submit" 
                                        class="btn btn-primary btn-lg" 
                                        id="loginBtn"
                                    >
                                        <span id="loginBtnText">
                                            <i class="bi bi-box-arrow-in-right me-2"></i>
                                            Đăng nhập
                                        </span>
                                        <span id="loginSpinner" style="display: none;">
                                            <div class="spinner-border spinner-border-sm me-2" role="status">
                                                <span class="visually-hidden">Loading...</span>
                                            </div>
                                            Đang xác thực...
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </form>

                        <div class="login-footer mt-4">
                            <div class="text-center">
                                <small class="text-muted">
                                    <i class="bi bi-shield-check me-1"></i>
                                    Phiên bản ${APP_CONFIG.app.version} - Bảo mật & An toàn
                                </small>
                            </div>
                            
                            <div class="mt-3 text-center">
                                <button 
                                    type="button" 
                                    class="btn btn-outline-secondary btn-sm" 
                                    id="demoLoginBtn"
                                >
                                    <i class="bi bi-play-circle me-1"></i>
                                    Demo - Đăng nhập nhanh
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- User Guide Card -->
                    <div class="user-guide-card modern-card mt-4">
                        <div class="card-body">
                            <h6 class="card-title">
                                <i class="bi bi-info-circle text-primary me-2"></i>
                                Hướng dẫn sử dụng
                            </h6>
                            <div class="row text-center">
                                <div class="col-4">
                                    <i class="bi bi-person-check text-success mb-2" style="font-size: 1.5rem;"></i>
                                    <div class="small">Đăng nhập</div>
                                    <div class="small text-muted">Mã NV + Mật khẩu</div>
                                </div>
                                <div class="col-4">
                                    <i class="bi bi-clipboard-data text-primary mb-2" style="font-size: 1.5rem;"></i>
                                    <div class="small">Nhập liệu</div>
                                    <div class="small text-muted">Forms QA</div>
                                </div>
                                <div class="col-4">
                                    <i class="bi bi-graph-up text-warning mb-2" style="font-size: 1.5rem;"></i>
                                    <div class="small">Báo cáo</div>
                                    <div class="small text-muted">Thống kê</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>
                .login-wrapper {
                    min-height: 100vh;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem 1rem;
                }

                .login-container {
                    width: 100%;
                    max-width: 400px;
                }

                .login-card {
                    padding: 2rem;
                    backdrop-filter: blur(10px);
                    background: rgba(255, 255, 255, 0.95);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                }

                .login-title {
                    color: var(--text-primary);
                    font-weight: 700;
                    margin-bottom: 0.5rem;
                }

                .modern-input {
                    border-radius: 0.5rem;
                    border: 2px solid #e9ecef;
                    transition: all 0.3s ease;
                }

                .modern-input:focus {
                    border-color: var(--primary);
                    box-shadow: 0 0 0 0.2rem rgba(37, 99, 235, 0.1);
                }

                .user-guide-card {
                    backdrop-filter: blur(10px);
                    background: rgba(255, 255, 255, 0.9);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }

                @media (max-width: 576px) {
                    .login-card {
                        padding: 1.5rem;
                    }
                    
                    .login-wrapper {
                        padding: 1rem;
                    }
                }

                /* Animation cho logo */
                .login-logo i {
                    animation: pulse 2s infinite;
                }

                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                    100% { transform: scale(1); }
                }

                /* Form validation styles */
                .is-invalid {
                    border-color: #dc3545;
                }

                .is-valid {
                    border-color: #198754;
                }
            </style>
        `;

        this.attachEventListeners();
    }

    attachEventListeners() {
        // Form submit
        const form = this.$('#loginForm');
        if (form) {
            this.addEventListener(form, 'submit', (e) => this.handleLogin(e));
        }

        // Toggle password visibility
        const togglePassword = this.$('#togglePassword');
        if (togglePassword) {
            this.addEventListener(togglePassword, 'click', () => this.togglePasswordVisibility());
        }

        // Demo login
        const demoLoginBtn = this.$('#demoLoginBtn');
        if (demoLoginBtn) {
            this.addEventListener(demoLoginBtn, 'click', () => this.handleDemoLogin());
        }

        // Remember me
        const rememberMe = this.$('#rememberMe');
        if (rememberMe) {
            this.addEventListener(rememberMe, 'change', (e) => {
                this.state.rememberMe = e.target.checked;
            });
        }

        // Auto-focus on employee ID
        const employeeIdInput = this.$('#employeeId');
        if (employeeIdInput) {
            employeeIdInput.focus();
        }

        // Load remembered credentials
        this.loadRememberedCredentials();
    }

    async handleLogin(e) {
        e.preventDefault();
        
        if (this.state.isLoading) return;

        const employeeId = this.$('#employeeId').value.trim();
        const password = this.$('#password').value;

        // Basic validation
        if (!employeeId || !password) {
            this.showError('Vui lòng nhập đầy đủ thông tin');
            return;
        }

        this.setLoading(true);
        this.hideError();

        try {
            // Simulate network delay
            await this.delay(800);

            // Authenticate
            const result = employeeManager.authenticate(employeeId, password);

            if (result.success) {
                // Update last login
                employeeManager.updateLastLogin(employeeId);

                // Save credentials if remember me is checked
                if (this.state.rememberMe) {
                    this.saveCredentials(employeeId);
                }

                // Show success
                this.showSuccess('Đăng nhập thành công!');

                // Redirect to main app
                await this.delay(500);
                this.redirectToApp();
            } else {
                this.showError(result.message);
                this.shakeForm();
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showError('Có lỗi xảy ra. Vui lòng thử lại.');
        } finally {
            this.setLoading(false);
        }
    }

    handleDemoLogin() {
        // Fill with demo credentials
        this.$('#employeeId').value = '25MB03590';
        this.$('#password').value = '123';
        
        // Trigger login
        this.handleLogin(new Event('submit'));
    }

    togglePasswordVisibility() {
        const passwordInput = this.$('#password');
        const toggleIcon = this.$('#togglePassword i');

        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleIcon.className = 'bi bi-eye-slash';
        } else {
            passwordInput.type = 'password';
            toggleIcon.className = 'bi bi-eye';
        }
    }

    showError(message) {
        this.state.errorMessage = message;
        const errorAlert = this.$('#errorAlert');
        const errorMessage = this.$('#errorMessage');
        
        if (errorAlert && errorMessage) {
            errorMessage.textContent = message;
            errorAlert.style.display = 'block';
            errorAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    hideError() {
        const errorAlert = this.$('#errorAlert');
        if (errorAlert) {
            errorAlert.style.display = 'none';
        }
    }

    showSuccess(message) {
        // Replace error alert with success
        const errorAlert = this.$('#errorAlert');
        if (errorAlert) {
            errorAlert.className = 'alert alert-success';
            errorAlert.innerHTML = `
                <i class="bi bi-check-circle me-2"></i>
                <span>${message}</span>
            `;
            errorAlert.style.display = 'block';
        }
    }

    setLoading(loading) {
        this.state.isLoading = loading;
        const loginBtn = this.$('#loginBtn');
        const loginBtnText = this.$('#loginBtnText');
        const loginSpinner = this.$('#loginSpinner');

        if (loginBtn && loginBtnText && loginSpinner) {
            loginBtn.disabled = loading;
            loginBtnText.style.display = loading ? 'none' : 'inline';
            loginSpinner.style.display = loading ? 'inline' : 'none';
        }
    }

    shakeForm() {
        const loginCard = this.$('.login-card');
        if (loginCard) {
            loginCard.style.animation = 'shake 0.5s';
            setTimeout(() => {
                loginCard.style.animation = '';
            }, 500);
        }

        // Add shake animation to CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }
        `;
        document.head.appendChild(style);
    }

    saveCredentials(employeeId) {
        if (this.state.rememberMe) {
            localStorage.setItem('rememberedEmployeeId', employeeId);
        }
    }

    loadRememberedCredentials() {
        const rememberedId = localStorage.getItem('rememberedEmployeeId');
        if (rememberedId) {
            this.$('#employeeId').value = rememberedId;
            this.$('#rememberMe').checked = true;
            this.state.rememberMe = true;
            
            // Focus on password field
            setTimeout(() => {
                this.$('#password').focus();
            }, 100);
        }
    }

    redirectToApp() {
        // Hide login and show main app
        document.getElementById('loginContainer').style.display = 'none';
        document.getElementById('mainApp').style.display = 'block';
        
        // Initialize main app if exists
        if (typeof app !== 'undefined') {
            app.initializeAfterLogin();
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Register component
componentLoader.register('login', LoginComponent);
