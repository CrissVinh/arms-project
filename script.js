// --- 1. KHAI BÁO CÁC PHẦN TỬ GIAO DIỆN ---
const container = document.getElementById('container');
const registerBtn = document.getElementById('register'); // Nút chuyển sang Đăng ký (bên phải)
const loginBtn = document.getElementById('login');       // Nút chuyển về Đăng nhập (bên trái)
const registerOverlayBtn = document.getElementById('register-overlay'); // Chữ xanh "Đăng ký" ở dưới

// --- 2. XỬ LÝ HIỆU ỨNG CHUYỂN ĐỔI FORM (ANIMATION) ---
// Khi bấm nút Đăng ký: Thêm class "active" để trượt form
if (registerBtn) {
    registerBtn.addEventListener('click', () => {
        container.classList.add("active");
    });
}

if (registerOverlayBtn) {
    registerOverlayBtn.addEventListener('click', (e) => {
        e.preventDefault(); // Ngăn trang web load lại
        container.classList.add("active");
    });
}

// Khi bấm nút Đăng nhập: Xóa class "active" để quay về form cũ
if (loginBtn) {
    loginBtn.addEventListener('click', () => {
        container.classList.remove("active");
    });
}

// --- 3. XỬ LÝ LOGIC ĐĂNG KÝ (GỬI LÊN SERVER) ---
const registerForm = document.getElementById('register-form');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Ngăn chặn load lại trang mặc định

        const full_name = document.getElementById('reg-name').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;

        try {
            const response = await fetch('http://localhost:3000/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ full_name, email, password })
            });

            const data = await response.json();

            if (response.ok) {
                alert("✅ Đăng ký thành công! Mời bạn đăng nhập.");
                container.classList.remove("active"); // Quay lại màn hình đăng nhập
            } else {
                alert("❌ Lỗi: " + data.message);
            }
        } catch (error) {
            console.error("Lỗi kết nối server:", error);
            alert("❌ Không thể kết nối tới Server. Hãy kiểm tra lại node server.js");
        }
    });
}

// Xử lý Đăng nhập
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                // ĐÃ XÓA DÒNG ALERT Ở ĐÂY
                // Chuyển hướng thẳng lập tức
                window.location.href = 'dashboard.html'; 
            } else {
                // Vẫn giữ alert lỗi để người dùng biết nếu sai mật khẩu
                alert("❌ " + data.message);
            }
        } catch (error) {
            console.error("Lỗi kết nối server:", error);
            alert("❌ Server đang tắt hoặc lỗi kết nối!");
        }
    });
}