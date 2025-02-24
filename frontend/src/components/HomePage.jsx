import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CheckIn from "./CheckIn";

const HomePage = () => {
  const navigate = useNavigate();
  const [checkedIn, setCheckedIn] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        if (showChat) setShowChat(false);
        if (showPrivacyPolicy) setShowPrivacyPolicy(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showChat, showPrivacyPolicy]);

  const handleStartLearning = () => navigate("/videos");
  const handleJoinUs = () => navigate("/categories");
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    alert("คุณได้ออกจากระบบสำเร็จ");
    navigate("/login");
  };

  const openPrivacyPolicy = () => setShowPrivacyPolicy(true);
  const closePrivacyPolicy = () => setShowPrivacyPolicy(false);
  const toggleChat = () => setShowChat(!showChat);

  const handleSendChat = async () => {
    if (!message.trim()) {
      alert("กรุณากรอกข้อความก่อนส่ง");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3000/send-line-notify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      if (response.ok) {
        alert("ส่งข้อความสำเร็จ!");
        setMessage("");
      } else {
        const errorData = await response.json();
        alert("การส่งข้อความล้มเหลว: " + errorData.error);
      }
    } catch (error) {
      alert("เกิดข้อผิดพลาดในการส่งข้อความ");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      <video autoPlay loop muted className="absolute inset-0 w-full h-full object-cover z-0">
        <source src="/1.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="relative z-10 text-white bg-black bg-opacity-50 min-h-screen flex flex-col">
        <header className="bg-teal-700 py-6 shadow-lg bg-opacity-80">
          <div className="container mx-auto flex justify-between items-center">
            <div className="text-center">
              <h1 className="text-3xl font-bold">ยินดีต้อนรับสู่ React Learning Hub</h1>
              <p className="mt-2 text-lg">แหล่งเรียนรู้ที่ดีที่สุดสำหรับการพัฒนา React!</p>
            </div>
            <div className="flex space-x-4">
              <CheckIn setCheckedIn={setCheckedIn} />
              <button onClick={handleLogout} className="px-6 py-3 bg-red-700 hover:bg-red-700 text-white rounded-full">
                ออกจากระบบ
              </button>
            </div>
          </div>
        </header>

        <main className="flex-grow flex items-center justify-center">
          <div className="container mx-auto text-center p-8">
            <h2 className="text-2xl font-semibold mb-4">ค้นพบ เรียนรู้ และเชี่ยวชาญ React</h2>
            <p className="text-lg mb-6">เริ่มต้นการเรียนรู้ของคุณกับบทเรียนที่มีโครงสร้างดี</p>
            <div className="space-x-4">
              <button onClick={handleStartLearning} className="px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-full">
                เริ่มเรียน
              </button>
              <button onClick={handleJoinUs} className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-full">
                เข้าร่วมเรา
              </button>
            </div>
          </div>
        </main>

        <footer className="bg-gray-800 py-6">
          <div className="container mx-auto text-center text-gray-300">
            <p>© 2025 React Learning Hub. สงวนลิขสิทธิ์ทั้งหมด</p>
            <p>
              <a href="/about" className="hover:underline text-gray-400">เกี่ยวกับเรา</a> |{" "}
              <a href="/contact" className="hover:underline text-gray-400">ติดต่อ</a> |{" "}
              <button
                onClick={openPrivacyPolicy}
                className="hover:underline text-gray-400"
              >
                นโยบายความเป็นส่วนตัว
              </button>
            </p>
          </div>
        </footer>
      </div>

      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 bg-opacity-80 from-purple-500 via-pink-500 to-red-500 text-white p-3 rounded-full shadow-lg hover:from-purple-600 hover:via-pink-600 hover:to-red-600 transition-transform transform hover:scale-105 z-50 flex items-center justify-center border border-gray-300"
      >
        {showChat ? <span className="material-icons">close</span> : <span className="material-icons">📝</span>}
        <span className="ml-2 text-sm font-medium">{showChat ? "ปิด" : "แชท"}</span>
      </button>

         {/* รายงานการเรียนรู้ */}
         {showChat && (
        <div className="fixed bottom-20 right-6 bg-white text-black p-6 rounded-lg shadow-xl w-72 z-50">
          <h3 className="text-lg font-bold mb-4 text-gray-800">รายงานการเรียนรู้</h3>

          <textarea
            className="w-full h-24 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="พิมพ์ชื่อและตามด้วยสิ่งที่คุณเรียนรู้วันนี้..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !isLoading) {
                e.preventDefault(); // ป้องกันขึ้นบรรทัดใหม่
                handleSendChat(); // ส่งข้อความ
              }
            }}
          ></textarea>
          <button onClick={handleSendChat} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600" disabled={isLoading}>
            {isLoading ? "กำลังส่ง..." : "ส่งรายงาน"}
          </button>
        </div>
      )}

       {/* Popup นโยบายความเป็นส่วนตัว */}
       {showPrivacyPolicy && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="relative bg-white p-8 w-11/12 md:w-2/3 lg:w-1/2 rounded-lg shadow-lg overflow-y-auto max-h-[80vh]">
            {/* ปุ่มปิด */}
            <button
              onClick={closePrivacyPolicy}
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
    </div>
  );
};

export default HomePage;