import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Chatbot from "./Chatbot";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Leaderboard from "./Leaderboard";  // Import the Leaderboard Component

const CategoriesPage = () => {
  const navigate = useNavigate();
  const [showFAQ, setShowFAQ] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [score, setScore] = useState(null);
  const [userName, setUserName] = useState("User");
  const [showCertificateButton, setShowCertificateButton] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboardByExercise, setLeaderboardByExercise] = useState({});
  const [selectedExercise, setSelectedExercise] = useState("No Title");

  const categories = [
    { id: 1, name: "บทความเกี่ยวกับ React", description: "อ่านบทความและเนื้อหาที่เกี่ยวข้องกับ React", type: "article" },
    { id: 2, name: "แบบฝึกหัด React", description: "ทดสอบความรู้ของคุณเกี่ยวกับ React", type: "exercise" },
    { id: 3, name: "ทดลองโค้ด", description: "ลองเขียนโค้ด React และดูผลลัพธ์แบบเรียลไทม์", type: "playground" },
    { id: 4, name: "ใบประกาศ", description: "ออกใบประกาศการทำแบบฝึกหัด", type: "certificate" },
    { id: 5, name: "ห้องประชุม", description: "ห้องประชุมการเรียนการสอน", type: "meet" },
  ];

  // Fetch leaderboard data from API
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/leaderboard");
        const data = response.data;
        console.log("Raw Leaderboard Data:", data);

        const categorizedLeaderboard = data. reduce((acc, entry) => {
          const { exerciseTitle, userName, score, userId } = entry;
          const title = exerciseTitle || "No Title";

          if (!acc[title]) {
            acc[title] = [];
          }

          const existingUser = acc[title].find(user => user.userId === userId);
          if (!existingUser || existingUser.score < score) {
            acc[title] = acc[title].filter(user => user.userId !== userId);
            acc[title].push({ name: userName, score, userId });
          }
          return acc;
        }, {});

        setLeaderboardByExercise(categorizedLeaderboard);
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
      }
    };
    fetchLeaderboard();
  }, []);

  // Navigation function
  const handleNavigate = (category) => {
    if (category.type === "article") navigate(`/articles?category=${category.id}`);
    else if (category.type === "exercise") navigate(`/exercises?category=${category.id}`);
    else if (category.type === "playground") navigate(`/playground`);
    else if (category.type === "certificate") navigate(`/certificate`);
    else if (category.type === "meet") navigate(`/meeting-details`);
  };

  const handleExerciseChange = (event) => {
    setSelectedExercise(event.target.value);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800">
      {/* Header */}
      <div className=" py-4 ">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">หมวดหมู่การเรียนรู้</h1>
          <div className="flex gap-4">
            <button
              onClick={() => setShowLeaderboard(true)}
              className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
            >
              🏆 ดูอันดับ
            </button>
            <button onClick={() => navigate("/home")} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
              ย้อนกลับไปหน้า Home
            </button>
          </div>
        </div>
      </div>

      

      {/* Main Content */}
      <main className="container mx-auto p-6 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div key={category.id} className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition">
              <h2 className="text-2xl font-semibold mb-2">{category.name}</h2>
              <p className="mb-4 text-gray-600">{category.description}</p>
              <button
                onClick={() => handleNavigate(category)}
                className={`px-4 py-2 ${
                  category.type === "article"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : category.type === "exercise"
                    ? "bg-green-600 hover:bg-green-700"
                    : category.type === "certificate"
                    ? "bg-yellow-600 hover:bg-yellow-700"
                    : category.type === "meet"
                    ? "bg-indigo-600 hover:bg-indigo-700"
                    : "bg-purple-600 hover:bg-purple-700"
                } text-white rounded-lg transition duration-200`}
              >
                {category.type === "article"
                  ? "อ่านบทความ"
                  : category.type === "exercise"
                  ? "ทำแบบฝึกหัด"
                  : category.type === "certificate"
                  ? "รับใบประกาศ"
                  : category.type === "meet"
                  ? "เข้าห้องประชุม"
                  : "ทดลองโค้ด"}
              </button>
            </div>
          ))}
        </div>
      </main>

      {/* Pass props to the Leaderboard Component */}
      {showLeaderboard && (
        <Leaderboard 
          leaderboardByExercise={leaderboardByExercise} 
          selectedExercise={selectedExercise} 
          setShowLeaderboard={setShowLeaderboard} 
        />
      )}

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
            |{/* Privacy Policy Modal Button */}
            <button
              className="hover:underline text-gray-400"
              onClick={() => setIsOpen(true)}
            >
              นโยบายความเป็นส่วนตัว
            </button>
          </p>
        </div>
      </footer>

      {/* Privacy Policy Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="relative bg-white p-8 w-11/12 md:w-2/3 lg:w-1/2 rounded-lg shadow-lg overflow-y-auto max-h-[80vh]">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600"
            >
              ✕
            </button>

            {/* Privacy Policy Content */}
            <h2 className="text-2xl font-bold mb-4">นโยบายความเป็นส่วนตัว</h2>
            <p>
              เราที่ React Learning Hub ให้ความสำคัญกับความเป็นส่วนตัวของผู้ใช้บริการของเรา
              ข้อมูลส่วนบุคคลของคุณจะถูกเก็บและใช้งานตามข้อกำหนดดังนี้:
            </p>

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
            <p>
              เราจะไม่แบ่งปันข้อมูลส่วนบุคคลของคุณให้บุคคลภายนอก
              ยกเว้นตามที่กฎหมายกำหนด
            </p>

            <h3 className="text-lg font-semibold mt-4">4. สิทธิของคุณ</h3>
            <ul className="list-disc ml-6 mb-2">
              <li>เข้าถึง แก้ไข หรือลบข้อมูลส่วนบุคคลของคุณ</li>
              <li>ปฏิเสธการรับข่าวสารทางอีเมล</li>
            </ul>

            <h3 className="text-lg font-semibold mt-4">5. ติดต่อเรา</h3>
            <p>
              หากมีคำถามเพิ่มเติม กรุณาติดต่อ: 📧 อีเมล: support@reactlearninghub.com
            </p>
          </div>
        </div>
      )}

      {/* FAQ Popup Button */}
      <button
        onClick={() => setShowFAQ(true)}
        className="fixed bottom-6 right-6 bg-opacity-80 from-purple-500 via-pink-500 to-red-500 text-white p-3 rounded-full shadow-lg hover:from-purple-600 hover:via-pink-600 hover:to-red-600 transition-transform transform hover:scale-105 z-50 flex items-center justify-center border border-gray-300"
      >
        ❓ <span className="ml-2 text-sm font-medium">ถามตอบ</span>
      </button>

      {/* FAQ Popup */}
      {showFAQ && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative p-6 w-11/12 md:w-2/3 lg:w-1/2 rounded-lg shadow-lg">
            {/* Close FAQ Button */}
            <button
              onClick={() => setShowFAQ(false)}
              className="absolute top-4 right-4 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition duration-200"
            >
              ✕
            </button>

            {/* Chatbot Component */}
            <Chatbot />
          </div>
        </div>
      )}

      {/* Certificate Download Button */}
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
