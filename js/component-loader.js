// js/component-loader.js - Component Loading System

// Base Component Class
class BaseComponent {
    constructor(container) {
        this.container = container;
        this.state = {};
        this.eventListeners = [];
    }

    // Initialize component (override in child classes)
    async initialize() {
        // Override in child classes
    }

    // Render component (override in child classes)
    async render() {
        // Override in child classes
    }

    // Helper method to safely query elements
    $(selector) {
        return this.container.querySelector(selector);
    }

    // Helper method to safely query all elements
    $$(selector) {
        return this.container.querySelectorAll(selector);
    }

    // Safe event listener with cleanup
    addEventListener(element, event, handler) {
        if (element) {
            element.addEventListener(event, handler);
            this.eventListeners.push({ element, event, handler });
        }
    }

    // Cleanup method
    destroy() {
        // Remove all event listeners
        this.eventListeners.forEach(({ element, event, handler }) => {
            if (element) {
                element.removeEventListener(event, handler);
            }
        });
        this.eventListeners = [];
        
        // Clear container
        if (this.container) {
            this.container.innerHTML = '';
        }
    }

    // Utility methods
    formatNumber(num) {
        return new Intl.NumberFormat('vi-VN').format(num);
    }

    formatTime(timestamp) {
        return new Date(timestamp).toLocaleString('vi-VN');
    }

    generateId() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 8);
        return `${timestamp}-${random}`;
    }

    // Toast notification
    showToast(title, message, type = 'info') {
        if (typeof app !== 'undefined' && app.showToast) {
            app.showToast(title, message, type);
        } else {
            // Fallback to console
            console.log(`${type.toUpperCase()}: ${title} - ${message}`);
        }
    }
}

// Component Loader Class
class ComponentLoader {
    constructor() {
        this.components = new Map();
        this.activeComponents = new Map();
    }

    // Register a component
    register(name, componentClass) {
        this.components.set(name, componentClass);
        console.log(`Component registered: ${name}`);
    }

    // Load and render a component
    async load(name, container) {
        try {
            // Destroy existing component if any
            if (this.activeComponents.has(container)) {
                const existingComponent = this.activeComponents.get(container);
                existingComponent.destroy();
                this.activeComponents.delete(container);
            }

            // Check if component is registered
            if (!this.components.has(name)) {
                throw new Error(`Component not found: ${name}`);
            }

            // Get component class
            const ComponentClass = this.components.get(name);

            // Create new instance
            const component = new ComponentClass(container);

            // Initialize and render
            await component.initialize();
            await component.render();

            // Store active component
            this.activeComponents.set(container, component);

            console.log(`Component loaded: ${name}`);
            return component;
        } catch (error) {
            console.error(`Error loading component ${name}:`, error);
            
            // Show error in container
            container.innerHTML = `
                <div class="alert alert-danger m-3">
                    <h5 class="alert-heading">
                        <i class="bi bi-exclamation-triangle-fill me-2"></i>
                        Lỗi tải component
                    </h5>
                    <p>Không thể tải component: ${name}</p>
                    <small class="text-muted">${error.message}</small>
                </div>
            `;
            
            throw error;
        }
    }

    // Get active component for container
    getComponent(container) {
        return this.activeComponents.get(container);
    }

    // Unload component
    unload(container) {
        if (this.activeComponents.has(container)) {
            const component = this.activeComponents.get(container);
            component.destroy();
            this.activeComponents.delete(container);
        }
    }

    // Get list of registered components
    getRegisteredComponents() {
        return Array.from(this.components.keys());
    }
}

// Create global instance
const componentLoader = new ComponentLoader();

// Make BaseComponent globally available
window.BaseComponent = BaseComponent;
window.componentLoader = componentLoader;
