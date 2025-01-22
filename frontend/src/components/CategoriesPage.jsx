import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


const CategoriesPage = () => {
  const navigate = useNavigate();
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);

  const categories = [
    {
      id: 1,
      name: "บทความเกี่ยวกับ React",
      description: "อ่านบทความและเนื้อหาที่เกี่ยวข้องกับ React",
      type: "article",
    },
    {
      id: 2,
      name: "แบบฝึกหัด React",
      description: "ทดสอบความรู้ของคุณเกี่ยวกับ React",
      type: "exercise",
    },
    {
      id: 3,
      name: "ทดลองโค้ด",
      description: "ลองเขียนโค้ด React และดูผลลัพธ์แบบเรียลไทม์",
      type: "playground",
    },
  ];

  const handleNavigate = (category) => {
    if (category.type === "article") {
      navigate(`/articles?category=${category.id}`);
    } else if (category.type === "exercise") {
      navigate(`/exercises?category=${category.id}`);
    } else if (category.type === "playground") {
      navigate(`/playground`);
    }
  };

  const openPrivacyPolicy = () => {
    setShowPrivacyPolicy(true);
  };

  const closePrivacyPolicy = () => {
    setShowPrivacyPolicy(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800">
      <div className="bg-gray-100 py-4 shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">หมวดหมู่การเรียนรู้</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => navigate("/home")}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              ย้อนกลับไปหน้า Home
            </button>
          </div>
        </div>
      </div>

      <main className="container mx-auto p-6 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="p-6 bg-gray-100 rounded-lg shadow-md hover:shadow-lg transition"
            >
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
                } text-white rounded`}
              >
                {category.type === "article"
                  ? "อ่านบทความ"
                  : category.type === "exercise"
                  ? "ทำแบบฝึกหัด"
                  : "ทดลองโค้ด"}
              </button>
            </div>
          ))}
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

      {showPrivacyPolicy && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="relative bg-white p-8 w-11/12 md:w-2/3 lg:w-1/2 rounded-lg shadow-lg overflow-y-auto max-h-[80vh]">
            <button
              onClick={closePrivacyPolicy}
              className="absolute top-4 right-4 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600"
            >
              ✕
            </button>

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

export default CategoriesPage;