const express = require('express');
const cors = require('cors');
const sql = require('mssql');

const app = express();

app.use(cors());
app.use(express.json());

/* ================= SQL SERVER ================= */

const config = {
    user: "detai2",
    password: "MatKhau123!@#", 
    server: "103.141.177.145",
    database: "detai2db",
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

sql.connect(config)
    .then(() => console.log("✅ Kết nối SQL Server thành công"))
    .catch(err => console.error("❌ Lỗi:", err));


/* ================= API CƯ DÂN ================= */

app.get('/api/cudan', async (req, res) => {
    try {
        const result = await sql.query`
            SELECT CuDan.*, CanHo.SoPhong
            FROM CuDan
            LEFT JOIN CanHo 
            ON CuDan.ID_CanHo = CanHo.ID_CanHo
        `;
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// POST
app.post('/api/cudan', async (req, res) => {
    try {
        const { HoTen, CCCD, SDT, Email, ID_CanHo } = req.body;

        await sql.query`
            INSERT INTO CuDan (HoTen, CCCD, SDT, Email, ID_CanHo)
            VALUES (${HoTen}, ${CCCD}, ${SDT}, ${Email}, ${ID_CanHo})
        `;

        res.json({ message: "Thêm thành công" });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// PUT
app.put('/api/cudan/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { HoTen, CCCD, SDT, Email, ID_CanHo } = req.body;

        await sql.query`
        UPDATE CuDan
        SET HoTen=${HoTen},
            CCCD=${CCCD},
            SDT=${SDT},
            Email=${Email},
            ID_CanHo=${ID_CanHo}
        WHERE ID_CuDan=${id}
    `;

        res.json({ message: "Cập nhật thành công" });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// DELETE
app.delete('/api/cudan/:id', async (req, res) => {
    try {
        const { id } = req.params;

        await sql.query`
            DELETE FROM CuDan WHERE ID_CuDan=${id}
        `;

        res.json({ message: "Xoá thành công" });
    } catch (err) {
        res.status(500).send(err.message);
    }
});
app.get('/api/canho', async (req, res) => {
    try {
        const result = await sql.query`SELECT * FROM CanHo`;
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});
/* ================= RUN SERVER ================= */

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
});