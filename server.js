const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

// Phục vụ các file giao diện tĩnh (HTML, CSS, JS)
app.use(express.static(__dirname));

// 1. Cấu hình kết nối MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Phanvinh2005#', // !!! THAY BẰNG MẬT KHẨU WORKBENCH CỦA BẠN
    database: 'arms_db',
    port: 3306
});

db.connect(err => {
    if (err) {
        console.error('❌ Lỗi kết nối MySQL: ' + err.message);
        return;
    }
    console.log('✅ Đã kết nối Database arms_db thành công!');
});

// 2. API Đăng ký
app.post('/register', (req, res) => {
    const { name, email, pass } = req.body;
    const sql = "INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)";
    db.query(sql, [name, email, pass], (err, result) => {
        if (err) return res.status(500).json({ error: "Email đã tồn tại!" });
        res.json({ message: "Đăng ký thành công!" });
    });
});

// 3. API Đăng nhập
app.post('/login', (req, res) => {
    const { email, pass } = req.body;
    const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
    db.query(sql, [email, pass], (err, results) => {
        if (results.length > 0) {
            res.json({ success: true, user: results[0] });
        } else {
            res.status(401).json({ success: false, message: "Sai tài khoản hoặc mật khẩu!" });
        }
    });
});

// Cấu hình cổng cho Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
});