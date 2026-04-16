// LOAD DANH SÁCH
async function loadCuDan() {
    const res = await fetch('http://localhost:3000/api/cudan');
    const data = await res.json();

    const table = document.getElementById('cudan-table');
    table.innerHTML = "";

    data.forEach(cd => {
        table.innerHTML += `
            <tr>
                <td>${cd.ID_CuDan}</td>
                <td>${cd.HoTen}</td>
                <td>${cd.CCCD}</td>
                <td>${cd.SDT}</td>
                <td>${cd.Email}</td>
                <td>${cd.SoPhong || "Chưa có"}</td>
                <td>
                    <button onclick="sua(${cd.ID_CuDan}, '${cd.HoTen}', '${cd.CCCD}', '${cd.SDT}', '${cd.Email}', '${cd.ID_CanHo || ''}')">Sửa</button>
                    <button onclick="xoa(${cd.ID_CuDan})">Xoá</button>
                </td>
                
            </tr>
        `;
    });
}

// XOÁ
async function xoa(id) {
    if (!confirm("Xoá thật không?")) return;

    await fetch(`http://localhost:3000/api/cudan/${id}`, {
        method: 'DELETE'
    });

    loadCuDan();
}

// THÊM
async function themCuDan() {
    const HoTen = document.getElementById("ten").value;
    const CCCD = document.getElementById("cccd").value;
    const SDT = document.getElementById("sdt").value;
    const Email = document.getElementById("email").value;
    const ID_CanHo = document.getElementById("canho").value;

    if (!HoTen || !CCCD || !SDT || !Email) {
        alert("Nhập đầy đủ thông tin!");
        return;
    }

    await fetch('http://localhost:3000/api/cudan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ HoTen, CCCD, SDT, Email, ID_CanHo })
    });

    // reset form
    document.getElementById("ten").value = "";
    document.getElementById("cccd").value = "";
    document.getElementById("sdt").value = "";
    document.getElementById("email").value = "";
    document.getElementById("canho").value = "";

    loadCuDan();
}
async function loadCanHo() {
    const res = await fetch('http://localhost:3000/api/canho');
    const data = await res.json();

    const select = document.getElementById("canho");

    select.innerHTML = `<option value="">-- Chọn căn hộ --</option>`; // 🔥 thêm dòng này

    data.forEach(ch => {
        select.innerHTML += `
            <option value="${ch.ID_CanHo}">
                ${ch.SoPhong}
            </option>
        `;
    });
}
async function sua(id, HoTenCu, CCCDCu, SDTCu, EmailCu, CanHoCu) {
    const HoTen = prompt("Sửa họ tên:", HoTenCu);
    const CCCD = prompt("Sửa CCCD:", CCCDCu);
    const SDT = prompt("Sửa SDT:", SDTCu);
    const Email = prompt("Sửa Email:", EmailCu);
    const ID_CanHo = prompt("Nhập ID căn hộ:", CanHoCu);

    await fetch(`http://localhost:3000/api/cudan/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ HoTen, CCCD, SDT, Email, ID_CanHo })
    });

    loadCuDan();
}
function showCuDan() {
    document.getElementById("home").style.display = "none";
    document.getElementById("cudan").style.display = "block";

    loadCuDan();
    loadCanHo();
}

function showHome() {
    document.getElementById("home").style.display = "block";
    document.getElementById("cudan").style.display = "none";
}
// CHẠY
window.onload = () => {
    loadCuDan();
    loadCanHo();
};