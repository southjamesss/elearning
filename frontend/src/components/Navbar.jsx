import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Navbar = () => {
    const [showAttendance, setShowAttendance] = useState(false);
    const [attendanceData, setAttendanceData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchAttendance = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:3000/api/attendance", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setAttendanceData(response.data);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setError("Session หมดอายุ กรุณาเข้าสู่ระบบใหม่อีกครั้ง");
            } else if (error.response && error.response.status === 404) {
                setError("ไม่พบข้อมูลการเช็คชื่อ");
            } else {
                setError("เกิดข้อผิดพลาดในการดึงข้อมูล");
            }
            console.error("Error fetching attendance data", error);
        } finally {
            setLoading(false);
        }
    };

    const openAttendancePopup = () => {
        fetchAttendance();
        setShowAttendance(true);
    };

    const closeAttendancePopup = () => {
        setShowAttendance(false);
    };

    return (
        <nav className="bg-cyan-600 p-5 shadow-xl">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-white text-4xl font-extrabold">
                    <Link to="/admin">Management Console</Link>
                </div>

                <div className="space-x-8 text-lg hidden md:flex">
                    <Link
                        to="/admin/score"
                        className="text-white hover:text-indigo-300 font-medium transition-colors duration-300"
                    >
                        คะแนนแบบฝึกหัด
                    </Link>
                    <button
                        onClick={openAttendancePopup}
                        className="text-white hover:text-indigo-300 font-medium transition-colors duration-300"
                    >
                        ดูการเช็คชื่อ
                    </button>
                    <Link
                        to="/admin/exercises"
                        className="text-white hover:text-indigo-200 transition-colors duration-300"
                    >
                        จัดการแบบฝึกหัด
                    </Link>
                    <Link
                        to="/admin/users"
                        className="text-white hover:text-indigo-300 font-medium transition-colors duration-300"
                    >
                        จัดการผู้ใช้งาน
                    </Link>
                    <Link
                        to="/login"
                        className="text-white hover:text-red-400 font-medium transition-colors duration-300"
                    >
                        ออกจากระบบ
                    </Link>
                </div>

                <div className="md:hidden">
                    <button className="text-white">
                        <i className="fas fa-bars text-2xl"></i>
                    </button>
                </div>
            </div>

            {showAttendance && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                    <div className="relative bg-white p-8 w-11/12 md:w-2/3 lg:w-1/2 rounded-lg shadow-lg overflow-y-auto max-h-[80vh]">
                        <button
                            onClick={closeAttendancePopup}
                            className="absolute top-4 right-4 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600"
                        >
                            ✕
                        </button>

                        <h2 className="text-2xl font-bold mb-4">ข้อมูลการเช็คชื่อ</h2>

                        {loading ? (
                            <p>กำลังโหลดข้อมูล...</p>
                        ) : error ? (
                            <p className="text-red-500">{error}</p>
                        ) : (
                            <table className="min-w-full bg-white border">
                                <thead>
                                    <tr>
                                        <th className="py-2 px-4 border-b">ID</th>
                                        <th className="py-2 px-4 border-b">User ID</th>
                                        <th className="py-2 px-4 border-b">ชื่อผู้ใช้</th>
                                        <th className="py-2 px-4 border-b">วันที่</th>
                                        <th className="py-2 px-4 border-b">เวลาที่บันทึก</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {attendanceData.length > 0 ? (
                                        attendanceData.map((record) => (
                                            <tr key={record.id}>
                                                <td className="py-2 px-4 border-b">{record.id}</td>
                                                <td className="py-2 px-4 border-b">{record.userId}</td>
                                                <td className="py-2 px-4 border-b">{record.user?.name || "-"}</td>
                                                <td className="py-2 px-4 border-b">{new Date(record.date).toLocaleDateString()}</td>
                                                <td className="py-2 px-4 border-b">{new Date(record.createdAt).toLocaleString()}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="py-4 text-center">
                                                ไม่มีข้อมูลการเช็คชื่อ
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;