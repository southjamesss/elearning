import React from "react";
import { Navigate } from "react-router-dom";

// Private Route Component สำหรับการตรวจสอบการล็อกอิน
const PrivateRoute = ({ element, ...rest }) => {
  const authToken = localStorage.getItem("authToken"); // ตรวจสอบจาก localStorage ว่ามีการล็อกอินอยู่หรือไม่

  // ถ้าไม่มี authToken จะให้ผู้ใช้งานถูกส่งไปหน้า login
  if (!authToken) {
    return <Navigate to="/login" replace />;
  }

  // ถ้ามี authToken ให้แสดง element (component ที่กำหนดไว้)
  return element;
};

export default PrivateRoute;