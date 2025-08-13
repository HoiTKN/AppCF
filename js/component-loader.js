// Component Loader System
// Quản lý việc load và render các component động

class ComponentLoader {
    constructor() {
        this.components = new Map();
        this.currentComponent = null;
    }

    // Register a component
    register(name, component) {
        this.components.set(name, component);
        console.log(`Component registered: ${name}`);
    }

    // Load a component
    async load(name, container, params = {}) {
        const Component = this.components.get(name);
        
        if (!Component) {
            console.error(`Component not found: ${name}`);
            return null;
        }

        try {
            // Clean up previous component
            if (this.currentComponent && this.currentComponent.destroy) {
                this.currentComponent.destroy();
            }

            // Show loading state
            this.showLoading(container);

            // Create new component instance
            const component = new Component(container, params);
            
            // Initialize component
            await component.initialize();
            
            // Render component
            await component.render();
            
            this.currentComponent = component;
            
            return component;
        } catch (error) {
            console.error(`Error loading component ${name}:`, error);
            this.showError(container, error.message);
            return null;
        }
    }

    // Show loading state
    showLoading(container) {
        container.innerHTML = `
            <div class="d-flex justify-content-center align-items-center" style="min-height: 400px;">
                <div class="text-center">
                    <div class="spinner-border text-primary mb-3" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <p class="text-muted">Đang tải...</p>
                </div>
            </div>
        `;
    }

    // Show error state
    showError(container, message) {
        container.innerHTML = `
            <div class="alert alert-danger m-3" role="alert">
                <h5 class="alert-heading">
                    <i class="bi bi-exclamation-triangle-fill me-2"></i>
                    Lỗi tải component
                </h5>
                <p>${message}</p>
            </div>
        `;
    }

    // Get current component
    getCurrent() {
        return this.currentComponent;
    }

    // Destroy current component
    destroyCurrent() {
        if (this.currentComponent && this.currentComponent.destroy) {
            this.currentComponent.destroy();
            this.currentComponent = null;
        }
    }
}

// Base Component Class
class BaseComponent {
    constructor(container, params = {}) {
        this.container = container;
        this.params = params;
        this.state = {};
        this.listeners = [];
    }

    // Initialize component
    async initialize() {
        // Override in child classes
    }

    // Render component
    async render() {
        // Override in child classes
    }

    // Update component state
    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.render();
    }

    // Add event listener
    addEventListener(element, event, handler) {
        element.addEventListener(event, handler);
        this.listeners.push({ element, event, handler });
    }

    // Clean up component
    destroy() {
        // Remove event listeners
        this.listeners.forEach(({ element, event, handler }) => {
            element.removeEventListener(event, handler);
        });
        this.listeners = [];
        
        // Clear container
        if (this.container) {
            this.container.innerHTML = '';
        }
    }

    // Helper: Create element with HTML
    createElement(html) {
        const template = document.createElement('template');
        template.innerHTML = html.trim();
        return template.content.firstChild;
    }

    // Helper: Query selector in container
    $(selector) {
        return this.container.querySelector(selector);
    }

    // Helper: Query selector all in container
    $$(selector) {
        return this.container.querySelectorAll(selector);
    }

    // Helper: Show toast notification
    showToast(title, message, type = 'info') {
        const icons = {
            success: 'bi-check-circle-fill',
            error: 'bi-x-circle-fill',
            warning: 'bi-exclamation-triangle-fill',
            info: 'bi-info-circle-fill'
        };

        const toastHtml = `
            <div class="modern-toast toast-${type} fade-in">
                <i class="bi ${icons[type]} toast-icon"></i>
                <div class="toast-content">
                    <div class="fw-bold">${title}</div>
                    <div class="small">${message}</div>
                </div>
                <button class="btn-close ms-auto" onclick="this.parentElement.remove()"></button>
            </div>
        `;

        const toastContainer = document.getElementById('toastContainer');
        const toastElement = this.createElement(toastHtml);
        toastContainer.appendChild(toastElement);

        // Auto remove after 5 seconds
        setTimeout(() => {
            toastElement.remove();
        }, 5000);
    }

    // Helper: Format date
    formatDate(date) {
        return new Date(date).toLocaleDateString('vi-VN');
    }

    // Helper: Format time
    formatTime(date) {
        return new Date(date).toLocaleTimeString('vi-VN', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }

    // Helper: Format number
    formatNumber(num) {
        return new Intl.NumberFormat('vi-VN').format(num);
    }
}

// Create global component loader instance
window.componentLoader = new ComponentLoader();
