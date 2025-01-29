import React, { useState } from "react";
import axios from "axios"; // นำเข้า axios

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false); // state สำหรับโหลด

    // ฟังก์ชันส่งข้อความไปยัง Ollama
    const sendMessage = async () => {
        if (input.trim()) {
            const userMessage = { sender: "user", text: input };
            setMessages([...messages, userMessage]);
            setInput("");
            setLoading(true); // เริ่มโหลด

            try {
                // ส่งข้อความไปยัง Ollama API
                const response = await axios.post("http://127.0.0.1:11434/api/generate", {
                    model: "llama3", // ใช้โมเดล llama3
                    system: "คุณคือ สมชายChat ที่จะตอบกลับเป็นภาษาไทยเท่านั้น", // กำหนดให้ตอบเป็นไทย
                    prompt: `ตอบเป็นภาษาไทยเท่านั้น: ${input}`, // บังคับใช้ภาษาไทย
                    stream: false, // ปิด stream (ให้ได้ข้อความทั้งหมด)
                });

                const botMessage = { sender: "bot", text: response.data.response };
                setMessages((prev) => [...prev, botMessage]);
            } catch (error) {
                console.error("Error communicating with Ollama:", error);
                setMessages((prev) => [...prev, { sender: "bot", text: "ขอโทษค่ะ ฉันไม่สามารถตอบได้ตอนนี้ 😢" }]);
            } finally {
                setLoading(false); // โหลดเสร็จ
            }
        }
    };

    return (
        <div className="flex flex-col h-96 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
            {/* Header */}
            <div className="bg-black text-white py-3.5 px-4 font-bold rounded-t-lg text-center">
                สมชายChat
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                        <div
                            className={`p-3 rounded-lg max-w-xs text-white ${msg.sender === "user" ? "bg-blue-500" : "bg-gray-300 text-black"}`}
                        >
                            {msg.text}
                        </div>
                    </div>
                ))}
                {loading && <div className="text-gray-500 text-sm">กำลังพิมพ์...</div>}
            </div>

            {/* Input */}
            <div className="border-t p-2 flex">
                <input
                    type="text"
                    className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none"
                    placeholder="พิมพ์ข้อความ..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            sendMessage();
                        }
                    }}
                />
                <button
                    onClick={sendMessage}
                    className="bg-black text-white px-4 py-2 rounded-r-lg hover:bg-blue-600"
                    disabled={loading}
                >
                    {loading ? "กำลังส่ง..." : "ส่ง"}
                </button>
            </div>
        </div>
    );
};

export default Chatbot;