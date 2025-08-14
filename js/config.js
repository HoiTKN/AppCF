// js/config.js - Updated

const APP_CONFIG = {
    // Azure AD / MSAL Configuration
    msalConfig: {
        auth: {
            clientId: "076541aa-c734-405e-8518-ed52b67f8cbd",
            authority: "https://login.microsoftonline.com/81060475-7e7f-4ede-8d8d-bf61f53ca528",
            redirectUri: "https://hoitkn.github.io/AppCF/"
        },
        cache: {
            cacheLocation: "sessionStorage",
            storeAuthStateInCookie: false
        }
    },
    
    // API Scopes
    loginRequest: {
        scopes: ["User.Read", "Sites.ReadWrite.All"]
    },
    
    // SharePoint Configuration
    sharePoint: {
        siteUrl: "https://masangroup.sharepoint.com/sites/MCH.MMB.QA",
        processDataListName: "Process data",
        processParameterListName: "Process parameter",
        metalDetectionListName: "Metal Detection",
        dailyHygieneListName: "Daily Hygiene",
        ghpHygieneListName: "GHP Hygiene",
        productChangeoverListName: "Product Changeover"
    },
    
    // Graph API Endpoints
    graphEndpoints: {
        me: "https://graph.microsoft.com/v1.0/me",
        site: "https://graph.microsoft.com/v1.0/sites/masangroup.sharepoint.com:/sites/MCH.MMB.QA",
        lists: "https://graph.microsoft.com/v1.0/sites/{siteId}/lists",
        listItems: "https://graph.microsoft.com/v1.0/sites/{siteId}/lists/{listId}/items"
    },
    
    // App Settings
    app: {
        version: "1.1.0",
        debug: true, // Set to false in production
        offlineEnabled: true,
        maxOfflineRecords: 50,
        syncInterval: 30000 // 30 seconds
    },
    
    // Column Mappings for Process Data - Updated
    processDataColumns: {
        "Site": "Site",
        "MaNhanVienQA": "M_x00e3__x0020_nh_x00e2_n_x0020_",
        "NSX": "NSX",
        "GioKiemTra": "Gi_x1edd__x0020_ki_x1ec3_m_x002",
        "LineSX": "Line_x0020_SX",
        "SanPham": "S_x1ea3_n_x0020_ph_x1ea9_m",
        "MaDKSX": "M_x00e3__x0020__x0110_KSX",
        "BrixKansui": "Brix_x0020_Kansui",
        "NhietDoKansui": "Nhi_x1ec7_t_x0020__x0111__x1ed9_",
        "NgoaiQuanKansui": "Ngo_x1ea1_i_x0020_quan_x0020_Kan",
        "KetLuanKVKansui": "K_x1ebf_t_x0020_lu_x1ead_n_x0020_",
        "BrixSeasoning": "Brix_x0020_Seasoning",
        "NgoaiQuanSeasoning": "Ngo_x1ea1_i_x0020_quan_x0020_sea",
        "KetLuanSeasoning": "K_x1ebf_t_x0020_lu_x1ead_n_x0020_0",
        "DoDayLaBot": "_x0110__x1ed9__x0020_d_x00e0_y_x",
        // NEW COLUMNS
        "NgoaiQuanSoi": "Ngo_x1ea1_i_x0020_quan_x0020_s_x01",
        "MoTaSoi": "M_x00f4__x0020_t_x1ea3__x0020_s_",
        "ApSuatHoiVan": "_x00c1_p_x0020_su_x1ea5_t_x0020",
        // Temperature columns
        "NhietDauTrai": "Nhi_x1ec7_t_x0020__x0111__x1ea7_u",
        "NhietDauPhai": "Nhi_x1ec7_t_x0020__x0111__x1ea7_u0",
        "NhietGiua1Trai": "Nhi_x1ec7_t_x0020_gi_x1eef_a_x00",
        "NhietGiua1Phai": "Nhi_x1ec7_t_x0020_gi_x1eef_a_x000",
        "NhietGiua2Trai": "Nhi_x1ec7_t_x0020_gi_x1eef_a_x001",
        "NhietGiua2Phai": "Nhi_x1ec7_t_x0020_gi_x1eef_a_x002",
        "NhietGiua3Trai": "Nhi_x1ec7_t_x0020_gi_x1eef_a_x003",
        "NhietGiua3Phai": "Nhi_x1ec7_t_x0020_gi_x1eef_a_x004",
        "NhietCuoiTrai": "Nhi_x1ec7_t_x0020_cu_x1ed1_i_x00",
        "NhietCuoiPhai": "Nhi_x1ec7_t_x0020_cu_x1ed1_i_x000",
        // NEW COLUMNS
        "NgoaiQuanPhoiMi": "Ngo_x1ea1_i_x0020_quan_x0020_ph_x",
        "VanChamBHA": "Van_x0020_ch_x00e2_m_x0020_BHA",
        // Sensory columns
        "CamQuanCoTinh": "C_x1ea3_m_x0020_quan_x0020_c_x01",
        "CamQuanMau": "C_x1ea3_m_x0020_quan_x0020_m_x00",
        "CamQuanMui": "C_x1ea3_m_x0020_quan_x0020_m_x00e",
        "CamQuanVi": "C_x1ea3_m_x0020_quan_x0020_v_x1ec",
        // NEW COLUMNS
        "MoTaCamQuan": "M_x00f4__x0020_t_x1ea3__x0020_c_"
    },

    // Column Mappings for Metal Detection - New
    metalDetectionColumns: {
        "Site": "Site",
        "MaNhanVienQA": "M_x00e3__x0020_nh_x00e2_n_x0020_QA",
        "NgaySanXuat": "Ng_x00e0_y_x0020_s_x1ea3_n_x002",
        "GioKiemTra": "Gi_x1edd__x0020_ki_x1ec3_m_x003",
        "Line": "Line",
        "DonViQuaMayDo": "_x0110_n_x0020_v_x1ecb__x0020_",
        "NguoiNhiemTu": "Ng_x01b0__x1edd_i_x0020_nhi_x1ec5_",
        "LyDoThayDoi": "L_x00fd__x0020_do_x0020_thay_x00",
        // Fe testing
        "KichThuocFe": "K_x00ed_ch_x0020_th_x01b0__x1edb_c0",
        "SoMauFe": "S_x1ed1__x0020_m_x1eabu_x0020_Fe_",
        // Inox testing
        "KichThuocInox": "K_x00ed_ch_x0020_th_x01b0__x1edb_c1",
        "SoMauInox": "S_x1ed1__x0020_m_x1eabu_x0020_In_",
        // Metal color testing
        "KichThuocMetal": "K_x00ed_ch_x0020_th_x01b0__x1edb_c2",
        "SoMauMetal": "S_x1ed1__x0020_m_x1eabu_x0020_Ki_",
        // Wire testing
        "KichThuocWire": "K_x00ed_ch_x0020_th_x01b0__x1edb_c3",
        "SoMauWire": "S_x1ed1__x0020_m_x1eabu_x0020_gi_",
        // Test results
        "KetLuanTest": "K_x1ebf_t_x0020_lu_x1ead_n_x0020_1",
        "SoLuongDa": "S_x1ed1__x0020_l_x01b0__x1ee3_ng_0",
        "SoLuongDung": "S_x1ed1__x0020_l_x01b0__x1ee3_ng_1",
        "NguonNhiem": "Ngu_x1ed3_n_x0020_nhi_x1ec5_m",
        "MoTaKimLoai": "M_x00f4__x0020_t_x1ea3__x0020_ki_",
        "ThamTraPQCI": "Th_x1ea9_m_x0020_tra_x0020_PQCI"
    },

    // Column Mappings for Daily Hygiene
    dailyHygieneColumns: {
        "Site": "Site",
        "KhuVuc": "Khu_x0020_v_x1ef1_c",
        "NgayDanhGia": "Ng_x00e0_y_x0020__x0111__x00e1_nh",
        "CaSX": "Ca_x0020_SX",
        "Line": "Line",
        "KetLuanChung": "K_x1ebf_t_x0020_lu_x1ead_n_x0020_2",
        "MoTaKhongDat": "M_x00f4__x0020_t_x1ea3__x0020_kh",
        "HanhDongKhacPhuc": "H_x00e0_nh_x0020__x0111__x1ed9_ng",
        "QADanhGia": "QA_x0020__x0111__x00e1_nh_x0020",
        "DeoTayDauCa": "_x0110_eo_x0020_tay_x0020__x0111",
        "TinhTrangTayCuoiCa": "T_x00ed_nh_x0020_tr_x1ea1_ng_x00"
    },

    // Column Mappings for GHP Hygiene
    ghpHygieneColumns: {
        "Site": "Site",
        "KhuVuc": "Khu_x0020_v_x1ef1_c",
        "NgaySX": "Ng_x00e0_y_x0020_SX",
        "GioKiemTra": "Gi_x1edd__x0020_ki_x1ec3_m_x004",
        "CaSX": "Ca_x0020_SX",
        "Line": "Line",
        "KetLuanChung": "K_x1ebf_t_x0020_lu_x1ead_n_x0020_3",
        "MoTaKhongDat": "M_x00f4__x0020_t_x1ea3__x0020_kh0",
        "QADanhGia": "QA_x0020__x0111__x00e1_nh_x0020_0"
    },

    // Column Mappings for Product Changeover
    productChangeoverColumns: {
        "Site": "Site",
        "NgaySanXuat": "Ng_x00e0_y_x0020_s_x1ea3_n_x003",
        "Gio": "Gi_x1edd_",
        "TenSanPham": "T_x00ea_n_x0020_s_x1ea3_n_x0020",
        "Item": "Item",
        "Line": "Line",
        "GhiChu": "Ghi_x0020_ch_x00fa_",
        "NguoiThucHien": "Ng_x01b0__x1edd_i_x0020_th_x1ef1",
        // Checklist items
        "DonDiChuyenBTP": "_x0110_on_x0020_di_x0020_chuy_x1ec3",
        "DonDiChuyenNoiLieu": "_x0110_on_x0020_di_x0020_chuy_x1ec4",
        "VeSinhBangTai": "V_x1ec7__x0020_sinh_x0020_b_x00",
        "VeSinhMayDispencer": "V_x1ec7__x0020_sinh_x0020_m_x00",
        "VeSinhCumRungRau": "V_x1ec7__x0020_sinh_x0020_c_x01",
        "VeSinhKhuonLy": "V_x1ec7__x0020_sinh_x0020_khu_x"
    }
};

// Validation rules (will be loaded from SharePoint) - Updated
const VALIDATION_RULES = {
    brixKansui: { min: 3.5, max: 10.0 },
    nhietKansui: { min: 5, max: 20 },
    brixSeasoning: { min: 0, max: 6 },
    doDayLaBot: { min: 0.8, max: 1.3 },
    nhietDau: { min: 110, max: 155 },
    nhietGiua: { min: 130, max: 180 },
    nhietCuoi: { min: 140, max: 180 },
    // New validation rules for metal detection
    feSize: { options: [1.5, 2.0, 2.5] },
    inoxSize: { options: [2.0, 2.5, 3.0] },
    metalSize: { options: [2.5, 3.0, 3.5] },
    wireSize: { options: [7, 10, 12, 15] },
    sampleCount: { min: 1, max: 10 },
    nguoiNhiemTu: { min: 0, max: 100, step: 0.01 }
};

// Form field configurations
const FORM_CONFIGS = {
    processData: {
        requiredFields: ['site', 'maNhanVien', 'lineSX', 'maDKSX'],
        numericFields: [
            'brixKansui', 'nhietDoKansui', 'brixSeasoning', 'doDayLaBot',
            'nhietDauTrai', 'nhietDauPhai', 'nhietGiua1Trai', 'nhietGiua1Phai',
            'nhietGiua2Trai', 'nhietGiua2Phai', 'nhietGiua3Trai', 'nhietGiua3Phai',
            'nhietCuoiTrai', 'nhietCuoiPhai', 'camQuanCoTinh', 'camQuanMau', 
            'camQuanMui', 'camQuanVi'
        ],
        selectFields: [
            'ngoaiQuanKansui', 'ngoaiQuanSeasoning', 'ngoaiQuanSoi', 
            'apSuatHoiVan', 'ngoaiQuanPhoiMi', 'vanChamBHA'
        ],
        textAreaFields: ['moTaSoi', 'moTaCamQuan']
    },
    metalDetection: {
        requiredFields: ['mdSite', 'line'],
        numericFields: ['nguoiNhiemTu', 'soLuongDa', 'soLuongDung', 'nguonNhiem'],
        selectFields: ['donViQuaMayDo', 'ketLuanTest'],
        gridFields: [
            'line', 'feSize', 'feSamples', 'inoxSize', 'inoxSamples',
            'metalSize', 'metalSamples', 'wireSize', 'wireSamples'
        ],
        textAreaFields: ['lyDoThayDoi', 'moTaKimLoai']
    },
    dailyHygiene: {
        requiredFields: ['dhSite', 'dhKhuVuc', 'dhNgay'],
        selectFields: ['dhKetLuanChung'],
        gridFields: ['dhCaSX', 'dhLine'],
        assessmentFields: [
            'dhBHLD', 'dhKhongDeoTrangSuc', 'dhXitConTay', 'dhNenPhongBG',
            'dhKhongCoNVL', 'dhCuaRaVao', 'dhDenBatConTrung', 'dhTuongTran',
            'dhBangChuyenMayMoc', 'dhPalletNhua', 'dhCongCuDungCu', 'dhKhayNhua',
            'dhBTPTP', 'dhKhayPE', 'dhHeThongPhun', 'dhKVGiaVi', 'dhKVThanhPham'
        ],
        textAreaFields: ['dhMoTaKhongDat', 'dhHanhDongKhacPhuc']
    },
    ghpHygiene: {
        requiredFields: ['ghpSite', 'ghpNgay'],
        selectFields: ['ghpKetLuanChung'],
        gridFields: ['ghpKhuVuc', 'ghpCaSX', 'ghpLine'],
        textAreaFields: ['ghpMoTaKhongDat']
    },
    productChangeover: {
        requiredFields: ['pcSite', 'pcNgaySanXuat', 'pcTenSanPham'],
        gridFields: ['pcLine'],
        checklistFields: [
            'pcDonDiChuyenBTP', 'pcDonDiChuyenNoiLieu', 'pcVeSinhBangTai',
            'pcVeSinhMayDispencer', 'pcVeSinhCumRungRau', 'pcVeSinhKhuonLy'
        ],
        textAreaFields: ['pcGhiChu']
    }
};

// Site configurations
const SITE_CONFIGS = {
    'MMB': {
        fullName: 'Masan MB',
        lines: ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8'],
        areas: ['Khu A', 'Khu B', 'Khu C'],
        shifts: ['1', '2', '3', '14', '34']
    },
    'MSI': {
        fullName: 'Masan BD',
        lines: ['L1', 'L2', 'L3', 'L4', 'L5', 'L6'],
        areas: ['F1', 'F2', 'F3'],
        shifts: ['1', '2', '3', '14', '34']
    },
    'MHD': {
        fullName: 'Masan HD',
        lines: ['L1', 'L2', 'L3', 'L4'],
        areas: ['Phân xưởng 1', 'Phân xưởng 2'],
        shifts: ['1', '2', '3']
    },
    'MHG': {
        fullName: 'Masan HG',
        lines: ['L1', 'L2', 'L3', 'L4', 'L5'],
        areas: ['Khu A', 'Khu B'],
        shifts: ['1', '2', '3', '14']
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { APP_CONFIG, VALIDATION_RULES, FORM_CONFIGS, SITE_CONFIGS };
}
