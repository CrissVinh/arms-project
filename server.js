const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const app = express();

// Cấu hình Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Phục vụ các file tĩnh (HTML, CSS, JS) từ thư mục hiện tại
app.use(express.static(path.join(__dirname)));

// --- CẤU HÌNH KẾT NỐI DATABASE AIVEN (Dựa trên ảnh của Vinh) ---
const db = mysql.createConnection({
    host: 'mysql-32594127-nguyenphanvinh1601-9628.i.aivencloud.com',
    port: 10599,
    user: 'avnadmin',
    password: 'AVNS_tmOksQ9qZ6Iz2b9Zv-X', // Nhớ nhấn hình con mắt trên Aiven để lấy pass!
    database: 'defaultdb',
    ssl: {
        rejectUnauthorized: false // Bắt buộc phải có để chạy trên Cloud Render/Aiven
    }
});

// Kiểm tra kết nối
db.connect((err) => {
    if (err) {
        console.error('❌ Lỗi kết nối Database:', err.message);
        return;
    }
    console.log('✅ Đã kết nối thành công tới Cloud Database (Aiven)');
});

// --- API ĐĂNG KÝ ---
app.post('/register', (req) => {
    const { full_name, email, password } = req.body;

    const sql = "INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)";
    db.query(sql, [full_name, email, password], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return req.res.status(400).json({ message: "Email đã tồn tại!" });
            }
            return req.res.status(500).json({ message: "Lỗi hệ thống khi đăng ký!" });
        }
        req.res.status(200).json({ message: "Đăng ký thành công!" });
    });
});

// --- API ĐĂNG NHẬP ---
app.post('/login', (req) => {
    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
    db.query(sql, [email, password], (err, results) => {
        if (err) return req.res.status(500).json({ message: "Lỗi hệ thống!" });

        if (results.length > 0) {
            req.res.status(200).json({ message: "Đăng nhập thành công!", user: results[0] });
        } else {
            req.res.status(401).json({ message: "Email hoặc mật khẩu không đúng!" });
        }
    });
});

// Trả về file index.html khi truy cập trang chủ
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Lắng nghe cổng (Render sẽ tự cung cấp cổng qua process.env.PORT)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
});