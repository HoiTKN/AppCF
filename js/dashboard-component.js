// Dashboard Component
class DashboardComponent extends BaseComponent {
    async initialize() {
        // Load data from localStorage
        this.loadData();
    }

    loadData() {
        // Get data from all forms
        const processData = JSON.parse(localStorage.getItem('qaProcessData') || '[]');
        const metalDetectionData = JSON.parse(localStorage.getItem('qaMetalDetectionData') || '[]');
        const dailyHygieneData = JSON.parse(localStorage.getItem('qaDailyHygieneData') || '[]');
        const ghpHygieneData = JSON.parse(localStorage.getItem('qaGHPHygieneData') || '[]');
        const productChangeoverData = JSON.parse(localStorage.getItem('qaProductChangeoverData') || '[]');

        // Calculate statistics
        const today = new Date().toDateString();
        
        this.state = {
            totalProcess: processData.length,
            totalMetal: metalDetectionData.length,
            totalHygiene: dailyHygieneData.length,
            totalGHP: ghpHygieneData.length,
            totalChangeover: productChangeoverData.length,
            todayProcess: processData.filter(d => new Date(d.timestamp).toDateString() === today).length,
            todayMetal: metalDetectionData.filter(d => new Date(d.timestamp).toDateString() === today).length,
            todayHygiene: dailyHygieneData.filter(d => new Date(d.timestamp).toDateString() === today).length,
            todayGHP: ghpHygieneData.filter(d => new Date(d.timestamp).toDateString() === today).length,
            todayChangeover: productChangeoverData.filter(d => new Date(d.timestamp).toDateString() === today).length,
            recentRecords: this.getRecentRecords(processData, metalDetectionData, dailyHygieneData, ghpHygieneData, productChangeoverData)
        };
    }

    getRecentRecords(process, metal, hygiene, ghp, changeover) {
        const allRecords = [
            ...process.map(r => ({ ...r, type: 'Process Data', icon: 'clipboard-data', color: 'primary' })),
            ...metal.map(r => ({ ...r, type: 'Metal Detection', icon: 'shield-check', color: 'success' })),
            ...hygiene.map(r => ({ ...r, type: 'Daily Hygiene', icon: 'droplet-half', color: 'info' })),
            ...ghp.map(r => ({ ...r, type: 'GHP Hygiene', icon: 'clock-history', color: 'warning' })),
            ...changeover.map(r => ({ ...r, type: 'Product Changeover', icon: 'arrow-repeat', color: 'secondary' }))
        ];

        return allRecords
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, 10);
    }

    async render() {
        const todayTotal = this.state.todayProcess + this.state.todayMetal + 
                          this.state.todayHygiene + this.state.todayGHP + this.state.todayChangeover;
        
        const totalRecords = this.state.totalProcess + this.state.totalMetal + 
                           this.state.totalHygiene + this.state.totalGHP + this.state.totalChangeover;

        this.container.innerHTML = `
            <div class="fade-in">
                <!-- Page Header -->
                <div class="page-header mb-4">
                    <h2 class="page-title">
                        <i class="bi bi-speedometer2 me-2"></i>
                        Dashboard
                    </h2>
                    <p class="text-muted">Tổng quan hệ thống quản lý chất lượng</p>
                </div>

                <!-- Stats Cards -->
                <div class="row g-3 mb-4">
                    <div class="col-lg-2 col-md-4 col-6">
                        <div class="stat-card slide-up">
                            <div class="stat-icon primary">
                                <i class="bi bi-clipboard-data"></i>
                            </div>
                            <div class="stat-value">${this.formatNumber(this.state.totalProcess)}</div>
                            <div class="stat-label">Process Data</div>
                            <div class="stat-change positive">
                                <i class="bi bi-arrow-up"></i>
                                +${this.state.todayProcess} hôm nay
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-lg-2 col-md-4 col-6">
                        <div class="stat-card slide-up" style="animation-delay: 0.1s;">
                            <div class="stat-icon success">
                                <i class="bi bi-shield-check"></i>
                            </div>
                            <div class="stat-value">${this.formatNumber(this.state.totalMetal)}</div>
                            <div class="stat-label">Metal Detection</div>
                            <div class="stat-change positive">
                                <i class="bi bi-arrow-up"></i>
                                +${this.state.todayMetal} hôm nay
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-lg-2 col-md-4 col-6">
                        <div class="stat-card slide-up" style="animation-delay: 0.2s;">
                            <div class="stat-icon warning">
                                <i class="bi bi-droplet-half"></i>
                            </div>
                            <div class="stat-value">${this.formatNumber(this.state.totalHygiene)}</div>
                            <div class="stat-label">Daily Hygiene</div>
                            <div class="stat-change positive">
                                <i class="bi bi-arrow-up"></i>
                                +${this.state.todayHygiene} hôm nay
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-2 col-md-4 col-6">
                        <div class="stat-card slide-up" style="animation-delay: 0.3s;">
                            <div class="stat-icon warning">
                                <i class="bi bi-clock-history"></i>
                            </div>
                            <div class="stat-value">${this.formatNumber(this.state.totalGHP)}</div>
                            <div class="stat-label">GHP Hygiene</div>
                            <div class="stat-change positive">
                                <i class="bi bi-arrow-up"></i>
                                +${this.state.todayGHP} hôm nay
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-lg-2 col-md-4 col-6">
                        <div class="stat-card slide-up" style="animation-delay: 0.4s;">
                            <div class="stat-icon danger">
                                <i class="bi bi-arrow-repeat"></i>
                            </div>
                            <div class="stat-value">${this.formatNumber(this.state.totalChangeover)}</div>
                            <div class="stat-label">Product Changeover</div>
                            <div class="stat-change positive">
                                <i class="bi bi-arrow-up"></i>
                                +${this.state.todayChangeover} hôm nay
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-2 col-md-4 col-6">
                        <div class="stat-card slide-up" style="animation-delay: 0.5s;">
                            <div class="stat-icon primary">
                                <i class="bi bi-bar-chart"></i>
                            </div>
                            <div class="stat-value">${this.formatNumber(totalRecords)}</div>
                            <div class="stat-label">Tổng cộng</div>
                            <div class="stat-change positive">
                                <i class="bi bi-arrow-up"></i>
                                +${todayTotal} hôm nay
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row g-3">
                    <!-- Chart Section -->
                    <div class="col-lg-8">
                        <div class="modern-card">
                            <div class="card-header">
                                <h5 class="card-title">Biểu đồ hoạt động 7 ngày gần nhất</h5>
                            </div>
                            <div class="card-body">
                                <canvas id="activityChart" height="100"></canvas>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Recent Records -->
                    <div class="col-lg-4">
                        <div class="modern-card">
                            <div class="card-header">
                                <h5 class="card-title">Hoạt động gần đây</h5>
                            </div>
                            <div class="card-body">
                                <div class="recent-records">
                                    ${this.renderRecentRecords()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Quick Actions -->
                <div class="row g-3 mt-3">
                    <div class="col-12">
                        <div class="modern-card">
                            <div class="card-header">
                                <h5 class="card-title">Thao tác nhanh</h5>
                            </div>
                            <div class="card-body">
                                <div class="row g-2">
                                    <div class="col-lg-2 col-md-4 col-6">
                                        <button class="btn btn-modern btn-primary w-100" onclick="app.navigateTo('process-data')">
                                            <i class="bi bi-plus-circle"></i>
                                            Process Data mới
                                        </button>
                                    </div>
                                    <div class="col-lg-2 col-md-4 col-6">
                                        <button class="btn btn-modern btn-outline w-100" onclick="app.navigateTo('metal-detection')">
                                            <i class="bi bi-shield-plus"></i>
                                            Metal Detection
                                        </button>
                                    </div>
                                    <div class="col-lg-2 col-md-4 col-6">
                                        <button class="btn btn-modern btn-outline w-100" onclick="app.navigateTo('daily-hygiene')">
                                            <i class="bi bi-droplet"></i>
                                            Daily Hygiene
                                        </button>
                                    </div>
                                    <div class="col-lg-2 col-md-4 col-6">
                                        <button class="btn btn-modern btn-outline w-100" onclick="app.navigateTo('ghp-hygiene')">
                                            <i class="bi bi-clock-history"></i>
                                            GHP Hygiene
                                        </button>
                                    </div>
                                    <div class="col-lg-2 col-md-4 col-6">
                                        <button class="btn btn-modern btn-outline w-100" onclick="app.navigateTo('product-changeover')">
                                            <i class="bi bi-arrow-left-right"></i>
                                            Changeover
                                        </button>
                                    </div>
                                    <div class="col-lg-2 col-md-4 col-6">
                                        <button class="btn btn-modern btn-outline w-100" onclick="app.navigateTo('data-view')">
                                            <i class="bi bi-table"></i>
                                            Xem dữ liệu
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Render chart after DOM is ready
        setTimeout(() => this.renderChart(), 100);
    }

    renderRecentRecords() {
        if (this.state.recentRecords.length === 0) {
            return '<p class="text-muted text-center">Chưa có dữ liệu</p>';
        }

        return this.state.recentRecords.map(record => `
            <div class="d-flex align-items-center mb-3 pb-3 border-bottom">
                <div class="flex-shrink-0">
                    <div class="rounded-circle bg-${record.color} bg-opacity-10 p-2">
                        <i class="bi bi-${record.icon} text-${record.color}"></i>
                    </div>
                </div>
                <div class="flex-grow-1 ms-3">
                    <div class="fw-semibold small">${record.type}</div>
                    <div class="text-muted small">
                        ${record.site || ''} - ${record.line || record.lineSX || ''}
                    </div>
                    <div class="text-muted small">
                        ${this.formatTime(record.timestamp)}
                    </div>
                </div>
                <button class="btn btn-sm btn-outline-secondary" onclick="app.viewRecord('${record.id}', '${record.type}')">
                    <i class="bi bi-eye"></i>
                </button>
            </div>
        `).join('');
    }

    renderChart() {
        const canvas = document.getElementById('activityChart');
        if (!canvas) return;

        // Check if Chart.js is available
        if (typeof Chart === 'undefined') {
            canvas.parentElement.innerHTML = '<p class="text-muted text-center">Chart.js không khả dụng</p>';
            return;
        }

        // Prepare data for last 7 days
        const last7Days = [];
        const processDataByDay = [];
        const metalDataByDay = [];
        const hygieneDataByDay = [];
        const ghpDataByDay = [];
        const changeoverDataByDay = [];

        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toDateString();
            
            last7Days.push(date.toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit' }));
            
            const processData = JSON.parse(localStorage.getItem('qaProcessData') || '[]');
            const metalData = JSON.parse(localStorage.getItem('qaMetalDetectionData') || '[]');
            const hygieneData = JSON.parse(localStorage.getItem('qaDailyHygieneData') || '[]');
            const ghpData = JSON.parse(localStorage.getItem('qaGHPHygieneData') || '[]');
            const changeoverData = JSON.parse(localStorage.getItem('qaProductChangeoverData') || '[]');
            
            processDataByDay.push(processData.filter(d => new Date(d.timestamp).toDateString() === dateStr).length);
            metalDataByDay.push(metalData.filter(d => new Date(d.timestamp).toDateString() === dateStr).length);
            hygieneDataByDay.push(hygieneData.filter(d => new Date(d.timestamp).toDateString() === dateStr).length);
            ghpDataByDay.push(ghpData.filter(d => new Date(d.timestamp).toDateString() === dateStr).length);
            changeoverDataByDay.push(changeoverData.filter(d => new Date(d.timestamp).toDateString() === dateStr).length);
        }

        new Chart(canvas, {
            type: 'bar',
            data: {
                labels: last7Days,
                datasets: [
                    {
                        label: 'Process Data',
                        data: processDataByDay,
                        backgroundColor: 'rgba(99, 102, 241, 0.5)',
                        borderColor: 'rgba(99, 102, 241, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Metal Detection',
                        data: metalDataByDay,
                        backgroundColor: 'rgba(16, 185, 129, 0.5)',
                        borderColor: 'rgba(16, 185, 129, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Daily Hygiene',
                        data: hygieneDataByDay,
                        backgroundColor: 'rgba(59, 130, 246, 0.5)',
                        borderColor: 'rgba(59, 130, 246, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'GHP Hygiene',
                        data: ghpDataByDay,
                        backgroundColor: 'rgba(245, 158, 11, 0.5)',
                        borderColor: 'rgba(245, 158, 11, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Changeover',
                        data: changeoverDataByDay,
                        backgroundColor: 'rgba(107, 114, 128, 0.5)',
                        borderColor: 'rgba(107, 114, 128, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    }
}

// Register component
componentLoader.register('dashboard', DashboardComponent);
