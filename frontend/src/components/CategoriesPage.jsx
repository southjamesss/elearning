import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Chatbot from "./Chatbot";

const CategoriesPage = () => {
  const navigate = useNavigate();
  const [showFAQ, setShowFAQ] = useState(false);

  const categories = [
    { id: 1, name: "บทความเกี่ยวกับ React", description: "อ่านบทความและเนื้อหาที่เกี่ยวข้องกับ React", type: "article" },
    { id: 2, name: "แบบฝึกหัด React", description: "ทดสอบความรู้ของคุณเกี่ยวกับ React", type: "exercise" },
    { id: 3, name: "ทดลองโค้ด", description: "ลองเขียนโค้ด React และดูผลลัพธ์แบบเรียลไทม์", type: "playground" },
  ];

  // ฟังก์ชันเปลี่ยนหน้า
  const handleNavigate = (category) => {
    if (category.type === "article") navigate(`/articles?category=${category.id}`);
    else if (category.type === "exercise") navigate(`/exercises?category=${category.id}`);
    else if (category.type === "playground") navigate(`/playground`);
  };

  // ฟังก์ชันปิด FAQ ด้วยปุ่ม `Esc`
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setShowFAQ(false);
      }
    };

    if (showFAQ) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showFAQ]);

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800">
      {/* Header */}
      <div className="bg-gray-100 py-4 shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">หมวดหมู่การเรียนรู้</h1>
          <button onClick={() => navigate("/home")} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
            ย้อนกลับไปหน้า Home
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto p-6 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div key={category.id} className="p-6 bg-gray-100 rounded-lg shadow-md hover:shadow-lg transition">
              <h2 className="text-xl font-semibold mb-2">{category.name}</h2>
              <p className="mb-4">{category.description}</p>
              <button
                onClick={() => handleNavigate(category)}
                className={`px-4 py-2 ${
                  category.type === "article"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : category.type === "exercise"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-purple-600 hover:bg-purple-700"
                } text-white rounded transition duration-200`}
              >
                {category.type === "article" ? "อ่านบทความ" : category.type === "exercise" ? "ทำแบบฝึกหัด" : "ทดลองโค้ด"}
              </button>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 py-6">
        <div className="container mx-auto text-center text-gray-300">
          <p>© 2025 React Learning Hub. สงวนลิขสิทธิ์ทั้งหมด</p>
          <p>
            <a href="/about" className="hover:underline text-gray-400">
              เกี่ยวกับเรา
            </a>{" "}
            |{" "}
            <a href="/contact" className="hover:underline text-gray-400">
              ติดต่อ
            </a>
          </p>
        </div>
      </footer>

      {/* ปุ่มเปิด FAQ Popup */}
      <button
        onClick={() => setShowFAQ(true)}
        className="fixed bottom-6 right-6 bg-opacity-80 from-purple-500 via-pink-500 to-red-500 text-white p-3 rounded-full shadow-lg hover:from-purple-600 hover:via-pink-600 hover:to-red-600 transition-transform transform hover:scale-105 z-50 flex items-center justify-center border border-gray-300"
      >
        ❓ <span className="ml-2 text-sm font-medium">ถามตอบ</span>
      </button>

      {/* Popup ถามตอบ */}
      {showFAQ && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative p-6 w-11/12 md:w-2/3 lg:w-1/2   ">
            {/* ปุ่มปิด FAQ */}
            <button
              onClick={() => setShowFAQ(false)}
              className="absolute top-4 right-4 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition duration-200"
            >
              ✕
            </button>

            {/* แสดง Chatbot */}
            <Chatbot />
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;