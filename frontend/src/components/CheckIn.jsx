import React, { useState } from "react";

const CheckIn = () => {
  const [checkedIn, setCheckedIn] = useState(false);
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false); // สถานะการโหลด

  const handleCheckIn = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("กรุณาเข้าสู่ระบบก่อนเช็คอิน");
      return;
    }
  
    const today = new Date().toISOString().split('T')[0]; // รับวันที่ปัจจุบัน
  
    try {
      const response = await fetch("http://localhost:3000/api/checkin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,  // ส่ง token ใน Authorization header
        },
        body: JSON.stringify({ date: today }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert("เช็คอินสำเร็จ!");
      } else {
        alert(data.message || "การเช็คอินล้มเหลว");
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาด:", error);
      alert("เกิดข้อผิดพลาดในการเช็คอิน โปรดลองอีกครั้ง");
    }
  };

  return (
    <div>
      <button
        onClick={handleCheckIn}
        className={`px-6 py-3 ${checkedIn
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300"
        } text-white rounded-full text-lg font-medium shadow-lg transition-all duration-300`}
        disabled={checkedIn || loading} // ปิดปุ่มเมื่อเช็คอินแล้ว หรือกำลังโหลด
      >
        {loading ? "กำลังเช็คอิน..." : checkedIn ? `เช็คอินแล้ว: ${date}` : "เช็คชื่อ"}
      </button>
    </div>
  );
};

export default CheckIn;