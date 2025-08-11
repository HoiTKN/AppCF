// js/auth.js - Development Version (with mock authentication)

class AuthManager {
    constructor() {
        this.msalInstance = null;
        this.account = null;
        this.accessToken = null;
        this.isDevelopmentMode = true; // Development flag
    }

    // Initialize MSAL
    async initialize() {
        if (this.isDevelopmentMode) {
            console.log('Auth Manager: Development mode - using mock authentication');
            return this.initializeMock();
        }
        
        try {
            this.msalInstance = new msal.PublicClientApplication(APP_CONFIG.msalConfig);
            await this.msalInstance.initialize();
            
            // Check if user is already logged in
            const accounts = this.msalInstance.getAllAccounts();
            if (accounts.length > 0) {
                this.account = accounts[0];
                this.msalInstance.setActiveAccount(this.account);
                await this.getAccessToken();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error initializing MSAL:', error);
            return false;
        }
    }

    initializeMock() {
        // Create mock account for development
        this.account = {
            name: 'Development User',
            username: 'dev@company.com',
            localAccountId: 'dev-123',
            homeAccountId: 'dev-456'
        };
        
        this.accessToken = 'mock-access-token-for-development';
        
        // Store mock user info
        localStorage.setItem('userInfo', JSON.stringify({
            name: this.account.name,
            email: this.account.username,
            id: this.account.localAccountId
        }));
        
        console.log('Mock authentication initialized');
        return true;
    }

    // Login with popup
    async login() {
        if (this.isDevelopmentMode) {
            return this.loginMock();
        }
        
        try {
            const loginResponse = await this.msalInstance.loginPopup(APP_CONFIG.loginRequest);
            this.account = loginResponse.account;
            this.msalInstance.setActiveAccount(this.account);
            this.accessToken = loginResponse.accessToken;
            
            // Store user info
            localStorage.setItem('userInfo', JSON.stringify({
                name: this.account.name,
                email: this.account.username,
                id: this.account.localAccountId
            }));
            
            return true;
        } catch (error) {
            console.error('Login failed:', error);
            this.showError('Đăng nhập thất bại. Vui lòng thử lại.');
            return false;
        }
    }

    loginMock() {
        // Simulate login process
        console.log('Mock login successful');
        return Promise.resolve(true);
    }

    // Get access token silently
    async getAccessToken() {
        if (this.isDevelopmentMode) {
            return this.accessToken;
        }
        
        try {
            const tokenRequest = {
                ...APP_CONFIG.loginRequest,
                account: this.account
            };
            
            const response = await this.msalInstance.acquireTokenSilent(tokenRequest);
            this.accessToken = response.accessToken;
            return this.accessToken;
        } catch (error) {
            console.error('Failed to get access token silently, trying popup...', error);
            
            // Try to get token with popup
            try {
                const response = await this.msalInstance.acquireTokenPopup(APP_CONFIG.loginRequest);
                this.accessToken = response.accessToken;
                return this.accessToken;
            } catch (popupError) {
                console.error('Failed to get access token with popup:', popupError);
                throw popupError;
            }
        }
    }

    // Logout
    async logout() {
        if (this.isDevelopmentMode) {
            return this.logoutMock();
        }
        
        try {
            await this.msalInstance.logoutPopup({
                postLogoutRedirectUri: window.location.origin
            });
            
            // Clear local storage
            localStorage.removeItem('userInfo');
            sessionStorage.clear();
            
            this.account = null;
            this.accessToken = null;
        } catch (error) {
            console.error('Logout failed:', error);
            // Force clear session even if logout fails
            localStorage.clear();
            sessionStorage.clear();
            window.location.reload();
        }
    }

    logoutMock() {
        // Clear mock session
        localStorage.removeItem('userInfo');
        sessionStorage.clear();
        
        this.account = null;
        this.accessToken = null;
        
        console.log('Mock logout successful');
        window.location.reload();
    }

    // Get current user info
    getUserInfo() {
        if (this.account) {
            return {
                name: this.account.name,
                email: this.account.username,
                id: this.account.localAccountId
            };
        }
        
        // Try to get from localStorage
        const stored = localStorage.getItem('userInfo');
        return stored ? JSON.parse(stored) : null;
    }

    // Check if user is authenticated
    isAuthenticated() {
        if (this.isDevelopmentMode) {
            return this.account !== null;
        }
        return this.account !== null && this.accessToken !== null;
    }

    // Get headers for API calls
    getAuthHeaders() {
        if (this.isDevelopmentMode) {
            // Return mock headers for development
            return {
                'Authorization': `Bearer ${this.accessToken}`,
                'Content-Type': 'application/json',
                'X-Development-Mode': 'true'
            };
        }
        
        return {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
        };
    }

    // Show error message
    showError(message) {
        const toastElement = document.getElementById('toast');
        const toastTitle = document.getElementById('toastTitle');
        const toastMessage = document.getElementById('toastMessage');
        
        if (toastElement && toastTitle && toastMessage) {
            toastTitle.textContent = 'Lỗi';
            toastMessage.textContent = message;
            
            const toast = new bootstrap.Toast(toastElement);
            toast.show();
        } else {
            alert(message);
        }
    }

    // Development helper methods
    switchToProductionMode() {
        this.isDevelopmentMode = false;
        console.log('Switched to production mode');
        // Clear development data
        this.account = null;
        this.accessToken = null;
        localStorage.removeItem('userInfo');
    }

    switchToDevelopmentMode() {
        this.isDevelopmentMode = true;
        console.log('Switched to development mode');
        this.initializeMock();
    }

    // Get development status
    isDeveloper() {
        return this.isDevelopmentMode;
    }

    // Mock token refresh for development
    async refreshToken() {
        if (this.isDevelopmentMode) {
            console.log('Mock token refresh');
            return this.accessToken;
        }
        
        return await this.getAccessToken();
    }
}

// Create global instance
const authManager = new AuthManager();
