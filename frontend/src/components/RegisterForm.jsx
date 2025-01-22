import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await axios.post('http://localhost:3000/register', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'การสมัครล้มเหลว กรุณาลองใหม่');
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: "url('/1.jpg')",  // ใส่รูปภาพพื้นหลัง
      }}
    >
      <div className="w-full max-w-md p-8 bg-white/50 backdrop-blur-md shadow-xl rounded-lg space-y-6">
        <h1 className="text-2xl font-bold text-center mb-4">สมัครสมาชิก</h1>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleRegister} className="space-y-4">
          {['name', 'email', 'password'].map((field) => (
            <div key={field}>
              <label className="block text-gray-700 font-semibold capitalize">
                {field === 'name' ? 'ชื่อ' : field === 'email' ? 'อีเมล' : 'รหัสผ่าน'}
              </label>
              <input
                type={field === 'password' ? 'password' : 'text'}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-teal-500"
                required
              />
            </div>
          ))}
          <button
            type="submit"
            className="w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700 focus:outline-none"
          >
            สมัครสมาชิก
          </button>
        </form>
        <div className="text-center mt-4">
          <p>
            มีบัญชีแล้ว?{' '}
            <span
              onClick={() => navigate('/login')}
              className="text-teal-600 font-semibold cursor-pointer hover:underline"
            >
              เข้าสู่ระบบ
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;