// Các phần tử giao diện Login
const loginSection = document.getElementById('loginSection');
const registerSection = document.getElementById('registerSection');
const toRegister = document.getElementById('toRegister');
const toLogin = document.getElementById('toLogin');

// Chuyển đổi ẩn/hiện Form
toRegister?.addEventListener('click', (e) => {
    e.preventDefault();
    loginSection.style.display = 'none';
    registerSection.style.display = 'block';
});

toLogin?.addEventListener('click', (e) => {
    e.preventDefault();
    registerSection.style.display = 'none';
    loginSection.style.display = 'block';
});

// --- XỬ LÝ ĐĂNG KÝ ---
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const pass = document.getElementById('regPassword').value;

    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, pass })
        });
        const data = await response.json();
        alert(data.message || data.error);
        if (data.message === "Đăng ký thành công!") toLogin.click();
    } catch (err) {
        alert("Lỗi kết nối Server!");
    }
});

// --- XỬ LÝ ĐĂNG NHẬP ---
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const pass = document.getElementById('loginPassword').value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, pass })
        });
        const data = await response.json();

        if (data.success) {
            renderDashboard(data.user.full_name);
        } else {
            alert(data.message);
        }
    } catch (err) {
        alert("Lỗi kết nối Server!");
    }
});

// --- GIAO DIỆN SAU KHI LOGIN (Dựa trên Ảnh 2 và Sơ đồ Ảnh 3) ---
function renderDashboard(userName) {
    document.body.innerHTML = `
    <div class="dashboard-container">
        <nav class="sidebar">
            <div class="sidebar-header">
                <i class="fa-solid fa-building-circle-check"></i>
                <h2>A&RMS app</h2>
                <p>Hệ thống Quản lý</p>
            </div>
            <ul class="menu-list">
                <li class="menu-item active"><i class="fa-solid fa-chart-pie"></i> Tổng quan tòa nhà</li>
                <li class="menu-item"><i class="fa-solid fa-user-group"></i> Quản lý cư dân</li>
                <li class="menu-item"><i class="fa-solid fa-door-closed"></i> Quản lý căn hộ</li>
                <li class="menu-item"><i class="fa-solid fa-receipt"></i> Báo cáo khoản thu</li>
                <li class="menu-item"><i class="fa-solid fa-money-bill-transfer"></i> Báo cáo khoản chi</li>
                <li class="menu-item"><i class="fa-solid fa-tools"></i> Yêu cầu bảo trì</li>
                <li class="menu-item"><i class="fa-solid fa-p"></i> Quản lý gửi xe</li>
                <li class="menu-item logout" onclick="location.reload()"><i class="fa-solid fa-sign-out-alt"></i> Đăng xuất</li>
            </ul>
        </nav>

        <main class="main-content">
            <header class="top-bar">
                <div class="user-name">Xin chào, <strong>${userName}</strong></div>
            </header>

            <section class="dashboard-body">
                <h2>Báo cáo tình trạng phòng</h2>
                <div class="stats-grid">
                    <div class="card card-total"><p>Tổng số phòng</p><h1>14</h1></div>
                    <div class="card card-empty"><p>Phòng đang trống</p><h1>14</h1></div>
                    <div class="card card-rented"><p>Phòng đang thuê</p><h1>0</h1></div>
                </div>

                <div class="chart-box">
                    <h3>Biểu đồ tình trạng</h3>
                    <div class="pie-chart-fake">
                        <div class="chart-text">100% Trống</div>
                    </div>
                </div>
            </section>
        </main>
    </div>
    `;
}