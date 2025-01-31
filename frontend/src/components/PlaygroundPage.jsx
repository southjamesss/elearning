import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const PlaygroundPage = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript"); // ตั้งค่าเริ่มต้นเป็น JavaScript
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const languages = [
    { label: "JavaScript", value: "javascript" },
    { label: "Python", value: "python" },
    { label: "Java", value: "java" },
    { label: "C++", value: "cpp" },
    { label: "C#", value: "csharp" },
    { label: "PHP", value: "php" },
    { label: "Go", value: "go" },
    { label: "Ruby", value: "ruby" },
    { label: "Swift", value: "swift" },
  ];

  const handleRunCode = async () => {
    if (!code.trim()) {
      setOutput("❌ กรุณาใส่โค้ดก่อนรัน");
      return;
    }

    setIsLoading(true);
    setOutput("");

    try {
      const response = await fetch("http://localhost:3000/run-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
      });

      const data = await response.json();
      if (response.ok) {
        setOutput(data.output || "✅ รันสำเร็จ แต่ไม่มีผลลัพธ์");
      } else {
        setOutput(`⚠️ Error: ${data.error || "เกิดข้อผิดพลาด"}`);
      }
    } catch (error) {
      setOutput(`❗ Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">ทดลองเขียนโค้ด</h1>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          ย้อนกลับ
        </button>
      </div>

      {/* เลือกภาษา */}
      <div className="mb-4">
        <label className="block font-medium mb-2">เลือกภาษา:</label>
        <select
          className="p-2 border rounded w-full"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          {languages.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>

      {/* กล่องใส่โค้ด */}
      <textarea
        className="w-full h-60 p-4 border rounded mb-4 font-mono"
        placeholder="พิมพ์โค้ดของคุณที่นี่..."
        value={code}
        onChange={(e) => setCode(e.target.value)}
      ></textarea>

      {/* ปุ่มรันโค้ด */}
      <button
        onClick={handleRunCode}
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        disabled={isLoading}
      >
        {isLoading ? "🚀 กำลังรัน..." : "▶ รันโค้ด"}
      </button>

      {/* แสดงผลลัพธ์ */}
      <div className="mt-6 p-4 bg-gray-100 border rounded">
        <h2 className="text-lg font-semibold">ผลลัพธ์:</h2>
        <pre className="whitespace-pre-wrap">{output}</pre>
      </div>
    </div>
  );
};

export default PlaygroundPage;