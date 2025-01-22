import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const PlaygroundPage = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("js"); // ภาษาเริ่มต้นเป็น JavaScript
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRunCode = async () => {
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
        setOutput(data.output);
      } else {
        setOutput(data.error || "Unknown error occurred");
      }
    } catch (error) {
      setOutput("Error: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">ทดลองเขียนโค้ด</h1>
        <button
          onClick={() => navigate(-1)} // กลับไปหน้าก่อนหน้า
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          ย้อนกลับ
        </button>
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-2">เลือกภาษา:</label>
        <select
          className="p-2 border rounded"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="js">JavaScript</option>
          <option value="py">Python</option>
          <option value="java">Java</option>
        </select>
      </div>
      <textarea
        className="w-full h-60 p-4 border rounded mb-4"
        placeholder="พิมพ์โค้ดของคุณที่นี่..."
        value={code}
        onChange={(e) => setCode(e.target.value)}
      ></textarea>
      <button
        onClick={handleRunCode}
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        disabled={isLoading}
      >
        {isLoading ? "กำลังรัน..." : "รันโค้ด"}
      </button>
      <div className="mt-6 p-4 bg-gray-100 border rounded">
        <h2 className="text-lg font-semibold">ผลลัพธ์:</h2>
        <pre>{output}</pre>
      </div>
    </div>
  );
};

export default PlaygroundPage;