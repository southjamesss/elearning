import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Chatbot from "./Chatbot";
import jsPDF from "jspdf";
import "jspdf-autotable";

const CategoriesPage = () => {
  const navigate = useNavigate();
  const [showFAQ, setShowFAQ] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [score, setScore] = useState(null);
  const [userName, setUserName] = useState("User"); // Example username
  const [showCertificateButton, setShowCertificateButton] = useState(false);

  const categories = [
    { id: 1, name: "บทความเกี่ยวกับ React", description: "อ่านบทความและเนื้อหาที่เกี่ยวข้องกับ React", type: "article" },
    { id: 2, name: "แบบฝึกหัด React", description: "ทดสอบความรู้ของคุณเกี่ยวกับ React", type: "exercise" },
    { id: 3, name: "ทดลองโค้ด", description: "ลองเขียนโค้ด React และดูผลลัพธ์แบบเรียลไทม์", type: "playground" },
    { id: 4, name: "ใบประกาศ", description: "ออกใบประกาศการทำแบบฝึกหัด", type: "certificate" }, // New certificate category
  ];

  // ฟังก์ชันเปลี่ยนหน้า
  const handleNavigate = (category) => {
    if (category.type === "article") navigate(`/articles?category=${category.id}`);
    else if (category.type === "exercise") navigate(`/exercises?category=${category.id}`);
    else if (category.type === "playground") navigate(`/playground`);
    else if (category.type === "certificate") navigate(`/certificate`); // Navigate to certificate page if needed
  };

  // ฟังก์ชันปิด FAQ ด้วยปุ่ม `Esc`
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setShowFAQ(false);
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // ฟังก์ชันสำหรับการออกใบประกาศ
  const generateCertificate = () => {
    const doc = new jsPDF("p", "mm", "a4");
    doc.setFontSize(26);
    doc.text("ใบประกาศนียบัตร", 105, 80, null, null, "center");

    doc.setFontSize(18);
    doc.text("ขอมอบให้แก่", 105, 100, null, null, "center");
    doc.setFontSize(22);
    doc.setFont("Helvetica", "bold");
    doc.text(userName, 105, 115, null, null, "center");

    doc.setFontSize(18);
    doc.setFont("Helvetica", "normal");
    doc.text("สำหรับการทำแบบฝึกหัด", 105, 130, null, null, "center");
    
    doc.setFontSize(20);
    doc.setFont("Helvetica", "bold");
    doc.text(`คะแนนที่ได้รับ: ${score} คะแนน`, 105, 150, null, null, "center");

    doc.setLineWidth(0.5);
    doc.line(50, 175, 160, 175);

    doc.setFontSize(14);
    doc.text(`ลงวันที่: ${new Date().toLocaleDateString()}`, 105, 190, null, null, "center");

    doc.text("ลงชื่อ", 60, 210);
    doc.text("_____________________", 50, 215);
    doc.text("อาจารย์ผู้ดูแล", 60, 225);

    doc.save(`${userName}-certificate.pdf`);
  };

  // ฟังก์ชันที่จำลองการทำแบบฝึกหัดและการได้คะแนน
  const handleScoreSubmit = (newScore) => {
    setScore(newScore);
    setShowCertificateButton(true);  // Display the certificate button when the score is set
  };

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
                className={`px-4 py-2 ${category.type === "article"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : category.type === "exercise"
                    ? "bg-green-600 hover:bg-green-700"
                    : category.type === "certificate" // New certificate type button styling
                    ? "bg-yellow-600 hover:bg-yellow-700"
                    : "bg-purple-600 hover:bg-purple-700"
                  } text-white rounded transition duration-200`}
              >
                {category.type === "article" ? "อ่านบทความ" : category.type === "exercise" ? "ทำแบบฝึกหัด" : category.type === "certificate" ? "รับใบประกาศ" : "ทดลองโค้ด"}
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
            </a>{" "}
            |{" "}
            {/* ปุ่มเปิด Modal */}
            <button
              className="hover:underline text-gray-400"
              onClick={() => setIsOpen(true)}
            >
              นโยบายความเป็นส่วนตัว
            </button>
          </p>
        </div>
      </footer>

      {/* Modal นโยบายความเป็นส่วนตัว */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="relative bg-white p-8 w-11/12 md:w-2/3 lg:w-1/2 rounded-lg shadow-lg overflow-y-auto max-h-[80vh]">
            {/* ปุ่มปิด */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600"
            >
              ✕
            </button>

            {/* เนื้อหานโยบายความเป็นส่วนตัว */}
            <h2 className="text-2xl font-bold mb-4">นโยบายความเป็นส่วนตัว</h2>
            <p>เราที่ React Learning Hub ให้ความสำคัญกับความเป็นส่วนตัวของผู้ใช้บริการของเรา ข้อมูลส่วนบุคคลของคุณจะถูกเก็บและใช้งานตามข้อกำหนดดังนี้:</p>

            <h3 className="text-lg font-semibold mt-4">1. ข้อมูลที่เรารวบรวม</h3>
            <ul className="list-disc ml-6 mb-2">
              <li>ชื่อและนามสกุล</li>
              <li>อีเมล</li>
              <li>ข้อมูลการใช้งานเว็บไซต์ผ่านคุกกี้</li>
            </ul>

            <h3 className="text-lg font-semibold mt-4">2. วิธีการใช้งานข้อมูล</h3>
            <ul className="list-disc ml-6 mb-2">
              <li>เพื่อปรับปรุงบริการและประสบการณ์ของผู้ใช้</li>
              <li>ส่งข้อมูลข่าวสารหรือโปรโมชั่น (หากท่านยินยอม)</li>
            </ul>

            <h3 className="text-lg font-semibold mt-4">3. การแบ่งปันข้อมูล</h3>
            <p>เราจะไม่แบ่งปันข้อมูลส่วนบุคคลของคุณให้บุคคลภายนอก ยกเว้นตามที่กฎหมายกำหนด</p>

            <h3 className="text-lg font-semibold mt-4">4. สิทธิของคุณ</h3>
            <ul className="list-disc ml-6 mb-2">
              <li>เข้าถึง แก้ไข หรือลบข้อมูลส่วนบุคคลของคุณ</li>
              <li>ปฏิเสธการรับข่าวสารทางอีเมล</li>
            </ul>

            <h3 className="text-lg font-semibold mt-4">5. ติดต่อเรา</h3>
            <p>หากมีคำถามเพิ่มเติม กรุณาติดต่อ: 📧 อีเมล: support@reactlearninghub.com</p>
          </div>
        </div>
      )}

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
          <div className="relative p-6 w-11/12 md:w-2/3 lg:w-1/2 rounded-lg shadow-lg">
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

      {/* ปุ่มดาวน์โหลดใบประกาศ */}
      {showCertificateButton && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={generateCertificate}
            className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition duration-300"
          >
            ดาวน์โหลดใบประกาศ
          </button>
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
