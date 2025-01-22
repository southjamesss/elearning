import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditExercisePage = () => {
  const { id } = useParams(); // ดึง ID ของแบบฝึกหัดจาก URL
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true); // สถานะการโหลด
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ฟังก์ชันดึงข้อมูลแบบฝึกหัดและคำถามที่เกี่ยวข้อง
  const fetchExerciseData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:3000/api/exercises/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const exercise = response.data;

      setTitle(exercise.title || ""); // ตรวจสอบว่ามีค่า title หรือไม่
      setDescription(exercise.description || "");
      setQuestions(exercise.questions || []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching exercise data:", err);
      setError(`ไม่สามารถโหลดข้อมูลแบบฝึกหัดได้: ${err.message}`);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExerciseData();
  }, [id]);

  // ฟังก์ชันบันทึกการแก้ไข
  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const updatedExercise = {
        title,
        description,
        questions: questions.map((q) => ({
          question: q.question,
          options: q.options.map((opt) => opt || ""), // กำจัดค่าที่เป็น undefined หรือ null
          correctAnswer: parseInt(q.correctAnswer, 10),
        })),
      };

      console.log("Updated Exercise Data:", updatedExercise);

      await axios.put(
        `http://localhost:3000/api/exercises/${id}`,
        updatedExercise,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigate("/admin/exercises");
    } catch (err) {
      console.error("Error saving exercise data:", err);
      setError(`ไม่สามารถบันทึกการแก้ไขได้: ${err.message}`);
      setLoading(false);
    }
  };

  // ฟังก์ชันเพิ่มคำถามใหม่
  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: ["", "", "", ""], correctAnswer: "" },
    ]);
  };

  // ฟังก์ชันลบคำถาม
  const deleteQuestion = (index) => {
    const updatedQuestions = questions.filter((_, qIndex) => qIndex !== index);
    setQuestions(updatedQuestions);
  };

  // ฟังก์ชันแก้ไขคำถาม
  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  // ฟังก์ชันแก้ไขตัวเลือก
  const handleOptionChange = (qIndex, oIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options[oIndex] = value;
    setQuestions(updatedQuestions);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-end mb-6">
        <button
          onClick={() => navigate("/admin/exercises")}
          className="text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg shadow-md"
        >
          ย้อนกลับ
        </button>
      </div>

      <div className="text-3xl font-semibold mb-6 text-gray-800">แก้ไขแบบฝึกหัด</div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {loading ? (
        <div className="text-center text-lg">กำลังโหลดข้อมูล...</div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-medium text-gray-700">ชื่อแบบฝึกหัด</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700">คำอธิบาย</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          {/* คำถามและตัวเลือก */}
          <div className="space-y-4">
            {questions.map((q, qIndex) => (
              <div key={qIndex} className="space-y-3 border p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <label className="block font-medium text-gray-700">
                    คำถาม {qIndex + 1}
                  </label>
                  <button
                    type="button"
                    onClick={() => deleteQuestion(qIndex)}
                    className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
                  >
                    ลบคำถาม
                  </button>
                </div>
                <input
                  type="text"
                  value={q.question}
                  onChange={(e) =>
                    handleQuestionChange(qIndex, "question", e.target.value)
                  }
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <div>
                  <label className="block font-medium text-gray-700">ตัวเลือก</label>
                  {q.options.map((option, oIndex) => (
                    <div key={oIndex} className="flex items-center mb-2">
                      <span className="mr-2">{["ก", "ข", "ค", "ง"][oIndex]}.</span>
                      <input
                        type="text"
                        value={option}
                        onChange={(e) =>
                          handleOptionChange(qIndex, oIndex, e.target.value)
                        }
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block font-medium text-gray-700">
                    ตัวเลือกที่ถูกต้อง
                  </label>
                  <select
                    value={q.correctAnswer}
                    onChange={(e) =>
                      handleQuestionChange(qIndex, "correctAnswer", e.target.value)
                    }
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="">เลือกตัวเลือกที่ถูกต้อง</option>
                    {q.options.map((option, i) => (
                      <option key={i} value={i}>
                        {["ก", "ข", "ค", "ง"][i]}. {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addQuestion}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              เพิ่มคำถาม
            </button>
          </div>

          <button
            type="submit"
            className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {loading ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
          </button>
        </form>
      )}
    </div>
  );
};

export default EditExercisePage; 