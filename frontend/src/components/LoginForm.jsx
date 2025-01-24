import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
  
    if (!email || !password) {
      setError("กรุณากรอกอีเมลและรหัสผ่าน");
      return;
    }
  
    try {
      setError("");
      setLoading(true);
  
      const response = await axios.post("http://localhost:3000/login", {
        email,
        password,
      });
  
      const { accessToken, refreshToken, role, userId } = response.data;
  
      console.log("Response data:", response.data); // ตรวจสอบ response จากเซิร์ฟเวอร์
  
      localStorage.setItem("token", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("userId", userId); // เพิ่มการเก็บ userId
  
      console.log("Stored userId:", localStorage.getItem("userId")); // ตรวจสอบว่า userId ถูกเก็บใน localStorage หรือไม่
  
      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    } catch (err) {
      setError(err.response?.data?.error || "เข้าสู่ระบบล้มเหลว");
      console.error("Login error:", err.response?.data || err); // เพิ่ม log เมื่อเกิดข้อผิดพลาด
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center h-screen bg-cover bg-center"
      style={{
        backgroundImage: "url('/1.jpg')",
      }}
    >
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md p-8 bg-white/50 backdrop-blur-md shadow-xl rounded-lg space-y-6"
      >
        <h1 className="text-2xl font-bold text-gray-800 text-center">เข้าสู่ระบบ</h1>

        {error && <div className="text-red-500 text-sm text-center">{error}</div>}

        <div>
          <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
            อีเมล
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="กรอกอีเมลของคุณ"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
            รหัสผ่าน
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="กรอกรหัสผ่าน"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <button
          type="submit"
          className={`w-full py-3 text-white rounded-md focus:outline-none ${loading
              ? "bg-indigo-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          disabled={loading}
        >
          {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
        </button>

        <div className="text-center text-sm text-gray-500">
          <p>
            ยังไม่มีบัญชี?{" "}
            <a href="/register" className="text-indigo-600 hover:underline">
              สมัครสมาชิก
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;