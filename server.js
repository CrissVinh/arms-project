const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// --- CẤU HÌNH KẾT NỐI LOCALHOST ---
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: 'Phanvinh2005#', // Điền mật khẩu MySQL Workbench của bạn vào đây
    database: 'login_db' // Tên Database bạn đã tạo trong Workbench
});

db.connect((err) => {
    if (err) {
        console.error('❌ Lỗi kết nối Local MySQL:', err.message);
        return;
    }
    console.log('✅ Đã kết nối thành công tới MySQL Localhost');
});

// API Đăng ký
app.post('/register', (req, res) => {
    const { full_name, email, password } = req.body;
    const sql = "INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)";
    db.query(sql, [full_name, email, password], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: "Email đã tồn tại!" });
            return res.status(500).json({ message: "Lỗi hệ thống!" });
        }
        res.status(200).json({ message: "Đăng ký thành công!" });
    });
});

// API Đăng nhập
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
    db.query(sql, [email, password], (err, results) => {
        if (err) return res.status(500).json({ message: "Lỗi hệ thống!" });
        if (results.length > 0) {
            res.status(200).json({ message: "Đăng nhập thành công!" });
        } else {
            res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu!" });
        }
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
});