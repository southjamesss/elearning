import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar"; // นำเข้า Navbar

const AdminPage = () => {
  const [videos, setVideos] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ฟังก์ชันในการดึงข้อมูลวิดีโอ
  const fetchVideos = async () => {
    try {
      const token = localStorage.getItem("token"); // ดึง token จาก localStorage
      if (!token) {
        setError("กรุณาลงชื่อเข้าใช้");
        return;
      }

      const response = await axios.get("http://localhost:3000/admin/videos", {
        headers: { Authorization: `Bearer ${token}` }, // ส่ง Bearer token
      });

      if (response.status === 200) {
        setVideos(response.data);
      } else {
        setError("ไม่สามารถดึงข้อมูลวิดีโอ");
      }
    } catch (err) {
      console.error("Error fetching videos:", err);
      setError(err.response ? err.response.data.error : "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์");
    }
  };

  // ฟังก์ชันสำหรับบันทึกวิดีโอ (เพิ่มหรืออัปเดต)
  const handleSave = async (e) => {
    e.preventDefault();
    setError(""); // รีเซ็ทข้อผิดพลาดก่อนทำการบันทึก

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("กรุณาลงชื่อเข้าใช้");
        return;
      }

      if (editId) {
        // ถ้ามี editId แสดงว่าเป็นการอัปเดตวิดีโอ
        await axios.put(
          `http://localhost:3000/admin/videos/${editId}`,
          { title, description, url },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // ถ้าไม่มี editId แสดงว่าเป็นการเพิ่มวิดีโอใหม่
        await axios.post(
          "http://localhost:3000/admin/videos",
          { title, description, url },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      setTitle("");
      setDescription("");
      setUrl("");
      setEditId(null);
      fetchVideos(); // รีเฟรชข้อมูลวิดีโอ
    } catch (err) {
      setError("ไม่สามารถบันทึกวิดีโอได้");
    }
  };

  // ฟังก์ชันสำหรับลบวิดีโอ
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("กรุณาลงชื่อเข้าใช้");
        return;
      }
      await axios.delete(`http://localhost:3000/admin/videos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchVideos(); // รีเฟรชข้อมูลหลังจากลบ
    } catch (err) {
      setError("ไม่สามารถลบวิดีโอได้");
    }
  };

  // ฟังก์ชันตั้งค่าข้อมูลสำหรับแก้ไขวิดีโอ
  const handleEdit = (video) => {
    setTitle(video.title);
    setDescription(video.description);
    setUrl(video.url);
    setEditId(video.id); // เก็บ id ของ video ที่จะอัปเดต
  };

  // ฟังก์ชันยกเลิกการแก้ไข
  const handleCancelEdit = () => {
    setTitle("");
    setDescription("");
    setUrl("");
    setEditId(null);
    setError(""); // รีเซ็ทข้อผิดพลาด
  };

  // ดึงข้อมูลเมื่อ Component โหลด
  useEffect(() => {
    fetchVideos();
  }, []);

  return (
    <div>
      <Navbar /> {/* เพิ่ม Navbar ที่นี่ */}

      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">จัดการวิดีโอ</h1>
        </div>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        {/* ฟอร์มสำหรับเพิ่มหรืออัปเดตวิดีโอ */}
        <form onSubmit={handleSave} className="space-y-4 mb-6">
          <div>
            <label className="block font-medium">ชื่อวิดีโอ</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ชื่อวิดีโอ"
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block font-medium">คำอธิบาย</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="คำอธิบาย"
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block font-medium">ลิงก์วิดีโอ</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="ลิงก์วิดีโอ"
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="flex justify-between">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {editId ? "อัปเดตวิดีโอ" : "เพิ่มวิดีโอ"}
            </button>
            {editId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                ยกเลิก
              </button>
            )}
          </div>
        </form>

        {/* แสดงรายการของวิดีโอ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.length === 0 ? (
            <div>ยังไม่มีวิดีโอ</div>
          ) : (
            videos.map((video) => (
              <div key={video.id} className="bg-white rounded-lg shadow-md p-4">
                <h3 className="font-bold">{video.title}</h3>
                <p>{video.description}</p>
                <a
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  ดูวิดีโอ
                </a>
                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => handleEdit(video)}
                    className="px-4 py-2 bg-yellow-500 text-white rounded mr-2"
                  >
                    แก้ไข
                  </button>
                  <button
                    onClick={() => handleDelete(video.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded"
                  >
                    ลบ
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;