// Dashboard Component - Updated
class DashboardComponent extends BaseComponent {
    async initialize() {
        // Load data from localStorage
        this.loadData();
    }

    loadData() {
        // Get data from all forms - UPDATED to include pho data
        const processData = JSON.parse(localStorage.getItem('qaProcessData') || '[]');
        const phoTechnologyData = JSON.parse(localStorage.getItem('qaPhoTechnologyData') || '[]'); // NEW
        const metalDetectionData = JSON.parse(localStorage.getItem('qaMetalDetectionData') || '[]');
        const dailyHygieneData = JSON.parse(localStorage.getItem('qaDailyHygieneData') || '[]');
        const ghpHygieneData = JSON.parse(localStorage.getItem('qaGHPHygieneData') || '[]');
        const productChangeoverData = JSON.parse(localStorage.getItem('qaProductChangeoverData') || '[]');

        // Calculate statistics
        const today = new Date().toDateString();
        
        this.state = {
            totalProcess: processData.length,
            totalPho: phoTechnologyData.length, // NEW
            totalMetal: metalDetectionData.length,
            totalHygiene: dailyHygieneData.length,
            totalGHP: ghpHygieneData.length,
            totalChangeover: productChangeoverData.length,
            todayProcess: processData.filter(d => new Date(d.timestamp).toDateString() === today).length,
            todayPho: phoTechnologyData.filter(d => new Date(d.timestamp).toDateString() === today).length, // NEW
            todayMetal: metalDetectionData.filter(d => new Date(d.timestamp).toDateString() === today).length,
            todayHygiene: dailyHygieneData.filter(d => new Date(d.timestamp).toDateString() === today).length,
            todayGHP: ghpHygieneData.filter(d => new Date(d.timestamp).toDateString() === today).length,
            todayChangeover: productChangeoverData.filter(d => new Date(d.timestamp).toDateString() === today).length,
            recentRecords: this.getRecentRecords(processData, phoTechnologyData, metalDetectionData, dailyHygieneData, ghpHygieneData, productChangeoverData), // UPDATED
            qualityStats: this.calculateQualityStats(processData, phoTechnologyData, metalDetectionData, dailyHygieneData, ghpHygieneData, productChangeoverData) // UPDATED
        };
    }

    getRecentRecords(process, pho, metal, hygiene, ghp, changeover) { // UPDATED
        const allRecords = [
            ...process.map(r => ({ ...r, type: 'Data công nghệ mì', icon: 'clipboard-data', color: 'primary' })), // UPDATED
            ...pho.map(r => ({ ...r, type: 'Data công nghệ phở', icon: 'clipboard-data-fill', color: 'info' })), // NEW
            ...metal.map(r => ({ ...r, type: 'Metal Detection', icon: 'shield-check', color: 'success' })),
            ...hygiene.map(r => ({ ...r, type: 'Daily Hygiene', icon: 'droplet-half', color: 'info' })),
            ...ghp.map(r => ({ ...r, type: 'GHP Hygiene', icon: 'clock-history', color: 'warning' })),
            ...changeover.map(r => ({ ...r, type: 'Product Changeover', icon: 'arrow-repeat', color: 'secondary' }))
        ];

        return allRecords
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, 15);
    }

    calculateQualityStats(process, pho, metal, hygiene, ghp, changeover) { // UPDATED
        // Calculate quality metrics
        const processPass = process.filter(r => 
            r.ngoaiQuanKansui === 'Đạt' && 
            r.ngoaiQuanSeasoning === 'Đạt' &&
            r.ngoaiQuanSoi === 'Đạt' &&
            r.ngoaiQuanPhoiMi === 'Đạt' &&
            r.vanChamBHA === 'Đạt'
        ).length;

        // NEW: Pho quality calculation
        const phoPass = pho.filter(r => 
            r.ngoaiQuanKansui === 'Đạt' && 
            r.ngoaiQuanTamPhoSauHap === 'Đạt' &&
            r.ngoaiQuanVatSauSay === 'Đạt'
        ).length;

        const metalPass = metal.filter(r => r.ketLuanTest === 'Đạt').length;
        const hygienePass = hygiene.filter(r => r.conclusion === 'Đạt').length;
        const ghpPass = ghp.filter(r => r.conclusion === 'Đạt').length;
        const changeoverComplete = changeover.filter(r => {
            const items = r.checklistItems || {};
            return Object.keys(items).length === 6; // All 6 checklist items completed
        }).length;

        return {
            processPassRate: process.length > 0 ? ((processPass / process.length) * 100).toFixed(1) : 0,
            phoPassRate: pho.length > 0 ? ((phoPass / pho.length) * 100).toFixed(1) : 0, // NEW
            metalPassRate: metal.length > 0 ? ((metalPass / metal.length) * 100).toFixed(1) : 0,
            hygienePassRate: hygiene.length > 0 ? ((hygienePass / hygiene.length) * 100).toFixed(1) : 0,
            ghpPassRate: ghp.length > 0 ? ((ghpPass / ghp.length) * 100).toFixed(1) : 0,
            changeoverCompletionRate: changeover.length > 0 ? ((changeoverComplete / changeover.length) * 100).toFixed(1) : 0,
            averageTemperature: this.calculateAverageTemperature(process),
            metalDetectionEfficiency: this.calculateMetalDetectionEfficiency(metal)
        };
    }

    calculateAverageTemperature(processData) {
        if (processData.length === 0) return 0;
        
        const tempFields = [
            'nhietDauTrai', 'nhietDauPhai', 'nhietGiua1Trai', 'nhietGiua1Phai',
            'nhietGiua2Trai', 'nhietGiua2Phai', 'nhietGiua3Trai', 'nhietGiua3Phai',
            'nhietCuoiTrai', 'nhietCuoiPhai'
        ];
        
        let totalTemp = 0;
        let count = 0;
        
        processData.forEach(record => {
            tempFields.forEach(field => {
                if (record[field] && !isNaN(record[field])) {
                    totalTemp += parseFloat(record[field]);
                    count++;
                }
            });
        });
        
        return count > 0 ? (totalTemp / count).toFixed(1) : 0;
    }

    calculateMetalDetectionEfficiency(metalData) {
        if (metalData.length === 0) return 0;
        
        let totalDetected = 0;
        let totalSamples = 0;
        
        metalData.forEach(record => {
            ['feSamples', 'inoxSamples', 'metalSamples', 'wireSamples'].forEach(field => {
                if (record[field] && !isNaN(record[field])) {
                    totalSamples += parseInt(record[field]);
                    totalDetected += parseInt(record[field]); // Assuming all samples were correctly detected
                }
            });
        });
        
        return totalSamples > 0 ? ((totalDetected / totalSamples) * 100).toFixed(1) : 0;
    }

    async render() {
        const todayTotal = this.state.todayProcess + this.state.todayPho + this.state.todayMetal + 
                          this.state.todayHygiene + this.state.todayGHP + this.state.todayChangeover; // UPDATED
        
        const totalRecords = this.state.totalProcess + this.state.totalPho + this.state.totalMetal + 
                           this.state.totalHygiene + this.state.totalGHP + this.state.totalChangeover; // UPDATED

        this.container.innerHTML = `
            <div class="fade-in">
                <!-- Page Header -->
                <div class="page-header mb-4">
                    <h2 class="page-title">
                        <i class="bi bi-speedometer2 me-2"></i>
                        Dashboard
                    </h2>
                    <p class="text-muted">Tổng quan hệ thống quản lý chất lượng - Phiên bản ${APP_CONFIG.app.version}</p>
                </div>

                <!-- Stats Cards -->
                <div class="row g-3 mb-4">
                    <div class="col-lg-2 col-md-4 col-6">
                        <div class="stat-card slide-up">
                            <div class="stat-icon primary">
                                <i class="bi bi-clipboard-data"></i>
                            </div>
                            <div class="stat-value">${this.formatNumber(this.state.totalProcess)}</div>
                            <div class="stat-label">Data công nghệ mì</div>
                            <div class="stat-change positive">
                                <i class="bi bi-arrow-up"></i>
                                +${this.state.todayProcess} hôm nay
                            </div>
                            <div class="small text-muted mt-1">
                                Pass rate: ${this.state.qualityStats.processPassRate}%
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-2 col-md-4 col-6">
                        <div class="stat-card slide-up" style="animation-delay: 0.05s;">
                            <div class="stat-icon info">
                                <i class="bi bi-clipboard-data-fill"></i>
                            </div>
                            <div class="stat-value">${this.formatNumber(this.state.totalPho)}</div>
                            <div class="stat-label">Data công nghệ phở</div>
                            <div class="stat-change positive">
                                <i class="bi bi-arrow-up"></i>
                                +${this.state.todayPho} hôm nay
                            </div>
                            <div class="small text-muted mt-1">
                                Pass rate: ${this.state.qualityStats.phoPassRate}%
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
                            <div class="small text-muted mt-1">
                                Pass rate: ${this.state.qualityStats.metalPassRate}%
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
                            <div class="small text-muted mt-1">
                                Pass rate: ${this.state.qualityStats.hygienePassRate}%
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
                            <div class="small text-muted mt-1">
                                Pass rate: ${this.state.qualityStats.ghpPassRate}%
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
                            <div class="small text-muted mt-1">
                                Completion: ${this.state.qualityStats.changeoverCompletionRate}%
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Quality Metrics -->
                <div class="row g-3 mb-4">
                    <div class="col-md-6">
                        <div class="modern-card">
                            <div class="card-header">
                                <h5 class="card-title">
                                    <i class="bi bi-graph-up me-2"></i>
                                    Chỉ số chất lượng
                                </h5>
                            </div>
                            <div class="card-body">
                                <div class="row g-3">
                                    <div class="col-6">
                                        <div class="d-flex align-items-center">
                                            <div class="flex-shrink-0">
                                                <div class="rounded-circle bg-primary bg-opacity-10 p-2">
                                                    <i class="bi bi-clipboard-check text-primary"></i>
                                                </div>
                                            </div>
                                            <div class="flex-grow-1 ms-3">
                                                <div class="fw-semibold">${this.state.qualityStats.processPassRate}%</div>
                                                <div class="small text-muted">Process Pass Rate</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="d-flex align-items-center">
                                            <div class="flex-shrink-0">
                                                <div class="rounded-circle bg-info bg-opacity-10 p-2">
                                                    <i class="bi bi-clipboard-data text-info"></i>
                                                </div>
                                            </div>
                                            <div class="flex-grow-1 ms-3">
                                                <div class="fw-semibold">${this.state.qualityStats.phoPassRate}%</div>
                                                <div class="small text-muted">Pho Pass Rate</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="d-flex align-items-center">
                                            <div class="flex-shrink-0">
                                                <div class="rounded-circle bg-success bg-opacity-10 p-2">
                                                    <i class="bi bi-shield-check text-success"></i>
                                                </div>
                                            </div>
                                            <div class="flex-grow-1 ms-3">
                                                <div class="fw-semibold">${this.state.qualityStats.metalDetectionEfficiency}%</div>
                                                <div class="small text-muted">Metal Detection</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="d-flex align-items-center">
                                            <div class="flex-shrink-0">
                                                <div class="rounded-circle bg-warning bg-opacity-10 p-2">
                                                    <i class="bi bi-thermometer text-warning"></i>
                                                </div>
                                            </div>
                                            <div class="flex-grow-1 ms-3">
                                                <div class="fw-semibold">${this.state.qualityStats.averageTemperature}°C</div>
                                                <div class="small text-muted">Avg Temperature</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-md-6">
                        <div class="modern-card">
                            <div class="card-header">
                                <h5 class="card-title">
                                    <i class="bi bi-pie-chart me-2"></i>
                                    Phân bố dữ liệu
                                </h5>
                            </div>
                            <div class="card-body">
                                <canvas id="dataDistributionChart" height="200"></canvas>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row g-3">
                    <!-- Chart Section -->
                    <div class="col-lg-8">
                        <div class="modern-card">
                            <div class="card-header">
                                <h5 class="card-title">
                                    <i class="bi bi-graph-up me-2"></i>
                                    Biểu đồ hoạt động 7 ngày gần nhất
                                </h5>
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
                                <h5 class="card-title">
                                    <i class="bi bi-clock me-2"></i>
                                    Hoạt động gần đây
                                </h5>
                            </div>
                            <div class="card-body">
                                <div class="recent-records" style="max-height: 400px; overflow-y: auto;">
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
                                <h5 class="card-title">
                                    <i class="bi bi-lightning me-2"></i>
                                    Thao tác nhanh
                                </h5>
                            </div>
                            <div class="card-body">
                                <div class="row g-2">
                                    <div class="col-lg-2 col-md-4 col-6">
                                        <button class="btn btn-modern btn-primary w-100" onclick="app.navigateTo('process-data')">
                                            <i class="bi bi-plus-circle"></i>
                                            Data công nghệ mì
                                        </button>
                                    </div>
                                    <div class="col-lg-2 col-md-4 col-6">
                                        <button class="btn btn-modern btn-outline w-100" onclick="app.navigateTo('pho-technology')">
                                            <i class="bi bi-clipboard-data-fill"></i>
                                            Data công nghệ phở
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
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Render charts after DOM is ready
        setTimeout(() => {
            this.renderActivityChart();
            this.renderDataDistributionChart();
        }, 100);
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
                    ${record.conclusion ? `
                        <span class="badge ${record.conclusion === 'Đạt' ? 'bg-success' : 'bg-danger'} badge-sm">
                            ${record.conclusion}
                        </span>
                    ` : ''}
                </div>
                <button class="btn btn-sm btn-outline-secondary" onclick="app.viewRecord('${record.id}', '${record.type}')">
                    <i class="bi bi-eye"></i>
                </button>
            </div>
        `).join('');
    }

    renderActivityChart() {
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
        const phoDataByDay = []; // NEW
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
            const phoData = JSON.parse(localStorage.getItem('qaPhoTechnologyData') || '[]'); // NEW
            const metalData = JSON.parse(localStorage.getItem('qaMetalDetectionData') || '[]');
            const hygieneData = JSON.parse(localStorage.getItem('qaDailyHygieneData') || '[]');
            const ghpData = JSON.parse(localStorage.getItem('qaGHPHygieneData') || '[]');
            const changeoverData = JSON.parse(localStorage.getItem('qaProductChangeoverData') || '[]');
            
            processDataByDay.push(processData.filter(d => new Date(d.timestamp).toDateString() === dateStr).length);
            phoDataByDay.push(phoData.filter(d => new Date(d.timestamp).toDateString() === dateStr).length); // NEW
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
                        label: 'Data công nghệ mì', // UPDATED
                        data: processDataByDay,
                        backgroundColor: 'rgba(99, 102, 241, 0.5)',
                        borderColor: 'rgba(99, 102, 241, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Data công nghệ phở', // NEW
                        data: phoDataByDay,
                        backgroundColor: 'rgba(59, 130, 246, 0.5)',
                        borderColor: 'rgba(59, 130, 246, 1)',
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
                        backgroundColor: 'rgba(245, 158, 11, 0.5)',
                        borderColor: 'rgba(245, 158, 11, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'GHP Hygiene',
                        data: ghpDataByDay,
                        backgroundColor: 'rgba(251, 191, 36, 0.5)',
                        borderColor: 'rgba(251, 191, 36, 1)',
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

    renderDataDistributionChart() {
        const canvas = document.getElementById('dataDistributionChart');
        if (!canvas || typeof Chart === 'undefined') return;

        new Chart(canvas, {
            type: 'doughnut',
            data: {
                labels: ['Data công nghệ mì', 'Data công nghệ phở', 'Metal Detection', 'Daily Hygiene', 'GHP Hygiene', 'Changeover'], // UPDATED
                datasets: [{
                    data: [
                        this.state.totalProcess,
                        this.state.totalPho, // NEW
                        this.state.totalMetal,
                        this.state.totalHygiene,
                        this.state.totalGHP,
                        this.state.totalChangeover
                    ],
                    backgroundColor: [
                        'rgba(99, 102, 241, 0.8)',
                        'rgba(59, 130, 246, 0.8)', // NEW
                        'rgba(16, 185, 129, 0.8)',
                        'rgba(245, 158, 11, 0.8)',
                        'rgba(251, 191, 36, 0.8)',
                        'rgba(107, 114, 128, 0.8)'
                    ],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    }
                },
                cutout: '60%'
            }
        });
    }
}

// Register component
componentLoader.register('dashboard', DashboardComponent);
