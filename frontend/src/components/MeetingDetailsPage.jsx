import React from "react";
import { useNavigate } from "react-router-dom";

const MeetingDetailsPage = ({ userName, meetingId }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <button
        onClick={() => navigate(-1)} // Go back to the previous page
        className="absolute top-4 right-8 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition"
      >
        ย้อนกลับ
      </button>

      <h1 className="text-2xl font-bold mb-4">ห้องประชุมการเรียนการสอน</h1>

      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-2">ข้อมูลการประชุม</h2>

        <p className="mb-4">
          <strong>ชื่อผู้ใช้: </strong>{userName}
        </p>
        <p className="mb-4">
          <strong>ID ห้องประชุม: sku-jvng-sbi</strong>{meetingId}
        </p>

        <p className="mb-4">
          <strong>วันที่และเวลา:</strong> 26 กุมภาพันธ์ 2025, 10:00am – 28 กันยายน 2030, 11:00am
          <br />
          เขตเวลา: Europe/London
        </p>

        <p className="mb-4">
          <strong>ลิงก์วิดีโอคอล:</strong>{" "}
          <a
            href="https://meet.google.com/sku-jvng-sbi"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-700"
          >
            https://meet.google.com/sku-jvng-sbi
          </a>
        </p>
      </div>
    </div>
  );
};

export default MeetingDetailsPage;
