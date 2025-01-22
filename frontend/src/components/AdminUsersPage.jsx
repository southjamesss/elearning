import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");
  const [password, setPassword] = useState(""); // เพิ่มตัวแปร state สำหรับรหัสผ่าน
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // useNavigate hook เพื่อใช้สำหรับการนำทาง

  // ดึงข้อมูลผู้ใช้งาน
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3000/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
      setError("");
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("ไม่สามารถโหลดข้อมูลผู้ใช้งานได้");
    }
  };

  // ฟังก์ชันสำหรับบันทึก (เพิ่มหรืออัปเดตผู้ใช้งาน)
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const userData = { name, email, role };

      // ถ้ามีการกรอกรหัสผ่านใหม่
      if (password) {
        userData.password = password; // เพิ่มรหัสผ่านใหม่ไปในข้อมูล
      }

      if (editId) {
        await axios.put(
          `http://localhost:3000/admin/users/${editId}`,
          userData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          "http://localhost:3000/admin/users",
          userData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      setName("");
      setEmail("");
      setPassword(""); // ล้างช่องรหัสผ่านหลังการบันทึก
      setRole("user");
      setEditId(null);
      fetchUsers();
    } catch (err) {
      setError("ไม่สามารถบันทึกข้อมูลผู้ใช้งานได้");
    }
  };

  // ฟังก์ชันลบผู้ใช้งาน
  const handleDelete = async (id) => {
    console.log("Deleting user with ID:", id);  // ตรวจสอบ ID ที่ส่งไป
    const token = localStorage.getItem("token");
    console.log("Token:", token);  // ตรวจสอบว่า token ถูกส่งไปถูกต้อง
  
    if (!token) {
      setError("ไม่พบ token สำหรับการยืนยันตัวตน");
      return;
    }
  
    try {
      const response = await axios.delete(`http://localhost:3000/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (response.status === 200) {
        fetchUsers();  // รีเฟรชข้อมูลผู้ใช้งานหลังจากลบ
        alert("ผู้ใช้งานถูกลบเรียบร้อย");
      } else {
        console.error("Failed to delete user:", response);  // กรณีที่ลบไม่ได้
        setError("ไม่สามารถลบข้อมูลผู้ใช้งานได้");
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      setError("ไม่สามารถลบข้อมูลผู้ใช้งานได้");
    }
  };

  // ฟังก์ชันแก้ไขข้อมูลผู้ใช้งาน
  const handleEdit = (user) => {
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
    setEditId(user.id);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="container mx-auto p-6">
      {/* ปุ่มย้อนกลับที่มุมขวาบน */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => navigate(-1)} // ใช้ navigate(-1) เพื่อย้อนกลับไปหน้าก่อนหน้า
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          ย้อนกลับ
        </button>
      </div>

      {/* ฟอร์มสำหรับเพิ่มหรืออัปเดตผู้ใช้งาน */}
      <h2 className="text-2xl font-bold mb-6">จัดการผู้ใช้งาน</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSave} className="space-y-4 mb-6">
        <div>
          <label className="block font-medium">ชื่อผู้ใช้งาน</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block font-medium">อีเมล</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block font-medium">บทบาท</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div>
          <label className="block font-medium">รหัสผ่านใหม่ (ถ้าต้องการเปลี่ยน)</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {editId ? "อัปเดตผู้ใช้งาน" : "เพิ่มผู้ใช้งาน"}
        </button>
      </form>

      {/* แสดงรายการผู้ใช้งาน */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div key={user.id} className="bg-white rounded-lg shadow-md p-4">
            <h3 className="font-bold">{user.name}</h3>
            <p>{user.email}</p>
            <p>บทบาท: {user.role}</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => handleEdit(user)}
                className="px-4 py-2 bg-yellow-500 text-white rounded mr-2"
              >
                แก้ไข
              </button>
              <button
                onClick={() => handleDelete(user.id)}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                ลบ
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminUsersPage; 