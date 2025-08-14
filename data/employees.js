// data/employees.js - Employee Database
const EMPLOYEES_DATA = [
    {
        id: "15MB00270",
        name: "Ta Thị Thái",
        email: "tathithai1983na@gmail.com",
        site: "MMB",
        group: "Mì",
        role: "Nhân viên",
        active: true,
        password: "123", // Temporary password
        permissions: ["read", "write"]
    },
    {
        id: "16MB00649",
        name: "Nguyễn Thị Nhi",
        email: "nguyennhi0594@gmail.com",
        site: "MMB",
        group: "Mì",
        role: "Nhân viên",
        active: true,
        password: "123",
        permissions: ["read", "write"]
    },
    {
        id: "18MB01655",
        name: "Lê Thị Sang",
        email: "lethisangh2bkdn@gmail.com",
        site: "MMB",
        group: "Mì",
        role: "Nhân viên",
        active: true,
        password: "123",
        permissions: ["read", "write"]
    },
    {
        id: "24MB03158",
        name: "Đào Thị Vĩnh",
        email: "daovinh070299@gmail.com",
        site: "MMB",
        group: "Nêm",
        role: "Nhân viên",
        active: true,
        password: "123",
        permissions: ["read", "write"]
    },
    {
        id: "17MB01251",
        name: "Lê Khoa",
        email: "khoal@msc.masangroup.com",
        site: "MMB",
        group: "Mâm, CSD",
        role: "Quản lý",
        active: true,
        password: "123",
        permissions: ["read", "write", "delete", "admin"]
    },
    {
        id: "21MB02303",
        name: "Trần Thị Việt Hà",
        email: "hattv@msc.masangroup.com",
        site: "MMB",
        group: "Chung",
        role: "Quản lý",
        active: true,
        password: "123",
        permissions: ["read", "write", "delete", "admin"]
    },
    {
        id: "24MB03260",
        name: "Nguyễn Công Tuấn",
        email: "nctuan16shbkdn@gmail.com",
        site: "MMB",
        group: "Mì",
        role: "Nhân viên",
        active: true,
        password: "123",
        permissions: ["read", "write"]
    },
    {
        id: "24MB003384",
        name: "Đào Thị Thương",
        email: "daothuong0102@gmail.com",
        site: "MMB",
        group: "Mì",
        role: "Nhân viên",
        active: true,
        password: "123",
        permissions: ["read", "write"]
    },
    {
        id: "20MB01949",
        name: "Bùi Thị Hiên",
        email: "hien13h2b@gmail.com",
        site: "MMB",
        group: "Mì",
        role: "Nhân viên",
        active: true,
        password: "123",
        permissions: ["read", "write"]
    },
    {
        id: "25MB03567",
        name: "Nguyễn Thị Ngân Thảo",
        email: "bsnganthao@gmail.com",
        site: "MMB",
        group: "Mì",
        role: "Nhân viên",
        active: true,
        password: "123",
        permissions: ["read", "write"]
    },
    {
        id: "25MB03590",
        name: "Phạm Thị Hải Quỳnh",
        email: "phamquynh4497@gmail.com",
        site: "MMB",
        group: "Mì",
        role: "Nhân viên",
        active: true,
        password: "123",
        permissions: ["read", "write"]
    },
    {
        id: "25MB03578",
        name: "Lê Thị Kim Chi",
        email: "lechii2901@gmail.com",
        site: "MMB",
        group: "Mì",
        role: "Nhân viên",
        active: true,
        password: "123",
        permissions: ["read", "write"]
    },
    {
        id: "22MB02738",
        name: "Thái Khắc Như Hội",
        email: "Hoitkn@msc.masangroup.com",
        site: "MMB",
        group: "Chung",
        role: "Quản lý",
        active: true,
        password: "123",
        permissions: ["read", "write", "delete", "admin"]
    }
];

// Employee Management Class
class EmployeeManager {
    constructor() {
        this.employees = EMPLOYEES_DATA;
        this.currentUser = null;
    }

    // Authenticate user
    authenticate(employeeId, password) {
        const employee = this.employees.find(emp => 
            emp.id === employeeId && 
            emp.password === password && 
            emp.active
        );

        if (employee) {
            this.currentUser = { ...employee };
            // Store session
            sessionStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            return {
                success: true,
                user: this.currentUser
            };
        }

        return {
            success: false,
            message: 'Mã nhân viên hoặc mật khẩu không đúng'
        };
    }

    // Get current user from session
    getCurrentUser() {
        if (this.currentUser) {
            return this.currentUser;
        }

        const stored = sessionStorage.getItem('currentUser');
        if (stored) {
            this.currentUser = JSON.parse(stored);
            return this.currentUser;
        }

        return null;
    }

    // Check if user is authenticated
    isAuthenticated() {
        return this.getCurrentUser() !== null;
    }

    // Check if user has permission
    hasPermission(permission) {
        const user = this.getCurrentUser();
        return user && user.permissions.includes(permission);
    }

    // Check if user is admin/manager
    isManager() {
        const user = this.getCurrentUser();
        return user && user.role === 'Quản lý';
    }

    // Get employees by site
    getEmployeesBySite(site) {
        return this.employees.filter(emp => emp.site === site && emp.active);
    }

    // Get employees by site and group
    getEmployeesBySiteAndGroup(site, group) {
        return this.employees.filter(emp => 
            emp.site === site && 
            emp.group === group && 
            emp.active
        );
    }

    // Logout
    logout() {
        this.currentUser = null;
        sessionStorage.removeItem('currentUser');
        localStorage.removeItem('userPreferences');
    }

    // Update last login
    updateLastLogin(employeeId) {
        const employee = this.employees.find(emp => emp.id === employeeId);
        if (employee) {
            employee.lastLogin = new Date().toISOString();
        }
    }
}

// Create global instance
const employeeManager = new EmployeeManager();
