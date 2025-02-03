import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const PlaygroundPage = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript"); // ค่าเริ่มต้นเป็น JavaScript
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
  setOutput("กำลังประมวลผล...");

  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3",
        prompt: `รันโค้ดต่อไปนี้แล้วแสดงผลลัพธ์ที่ได้โดยตรง (อย่าอธิบาย):\n\n\`\`\`${language}\n${code}\n\`\`\`\n\nแสดงผลลัพธ์เป็นข้อความเท่านั้น`,
      }),
    });

    if (!response.body) {
      throw new Error("❗ ไม่มีข้อมูลจาก API");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let result = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      try {
        const json = JSON.parse(chunk);
        result += json.response || "";
        setOutput(result); // อัปเดตผลลัพธ์แบบเรียลไทม์
      } catch (error) {
        console.error("JSON Parsing Error:", error);
      }
    }

    setOutput(result || "✅ AI ประมวลผลสำเร็จ แต่ไม่มีผลลัพธ์");
  } catch (error) {
    setOutput(`❗ Error: ${error.message}`);
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">ทดลองเขียนโค้ด</h1>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          ย้อนกลับ
        </button>
      </div>

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

      <textarea
        className="w-full h-60 p-4 border rounded mb-4 font-mono"
        placeholder="พิมพ์โค้ดของคุณที่นี่..."
        value={code}
        onChange={(e) => setCode(e.target.value)}
      ></textarea>

      <button
        onClick={handleRunCode}
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        disabled={isLoading}
      >
        {isLoading ? "🚀 กำลังรัน..." : "▶ รันโค้ด"}
      </button>

      <div className="mt-6 p-4 bg-white border rounded shadow-md">
        <h2 className="text-lg font-semibold">ผลลัพธ์:</h2>
        <pre className="whitespace-pre-wrap bg-gray-50 p-3 rounded border">{output}</pre>
      </div>
    </div>
  );
};

export default PlaygroundPage;