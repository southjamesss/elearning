import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditExercisePage = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ฟังก์ชันดึงข้อมูลแบบฝึกหัด
  const fetchExerciseData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const { data: exercise } = await axios.get(
        `http://localhost:3000/api/exercises/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ตรวจสอบและแปลง options ให้เป็นอาร์เรย์ของสตริง
      const formattedQuestions = exercise.questions.map((q) => ({
        ...q,
        options: q.options.map((opt) => (typeof opt === "string" ? opt : opt.option || "")),
      }));

      setTitle(exercise.title || "");
      setDescription(exercise.description || "");
      setQuestions(formattedQuestions);
    } catch (err) {
      console.error("Error fetching exercise data:", err);
      setError("ไม่สามารถโหลดข้อมูลแบบฝึกหัดได้");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchExerciseData();
  }, [fetchExerciseData]);

  // ฟังก์ชันบันทึกแบบฝึกหัด
  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const updatedExercise = {
        title,
        description,
        questions: questions.map((q) => ({
          question: q.question,
          options: q.options.map((opt) => opt || ""),
          correctAnswer: parseInt(q.correctAnswer, 10),
        })),
      };

      await axios.put(
        `http://localhost:3000/api/exercises/${id}`,
        updatedExercise,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigate("/admin/exercises");
    } catch (err) {
      console.error("Error saving exercise data:", err);
      setError("ไม่สามารถบันทึกการแก้ไขได้");
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันจัดการคำถาม
  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  // ฟังก์ชันจัดการตัวเลือก
  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(updatedQuestions);
  };

  // ฟังก์ชันเพิ่มคำถาม
  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: ["", "", "", ""], correctAnswer: "" },
    ]);
  };

  // ฟังก์ชันลบคำถาม
  const deleteQuestion = (index) => {
    setQuestions(questions.filter((_, qIndex) => qIndex !== index));
  };

  // ฟังก์ชันเพิ่มตัวเลือก
  const addOption = (questionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options.push("");
    setQuestions(updatedQuestions);
  };

  // ฟังก์ชันลบตัวเลือก
  const deleteOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options.splice(optionIndex, 1);
    setQuestions(updatedQuestions);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-end mb-6">
        <button
          onClick={() => navigate("/admin/exercises")}
          className="text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg shadow-md"
          disabled={loading}
        >
          ย้อนกลับ
        </button>
      </div>

      <div className="text-3xl font-semibold mb-6 text-gray-800">แก้ไขแบบฝึกหัด</div>

      {error && <div className="text-red-500 text-center my-4">{error}</div>}
      {loading ? (
        <div className="text-center text-lg text-gray-700">กำลังโหลดข้อมูล...</div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6 mb-6">
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

          <div>
            {questions.map((q, index) => (
              <div key={index} className="mb-4 p-4 border rounded-lg">
                <div className="flex justify-between items-center">
                  <label className="block font-medium text-gray-700">
                    คำถาม {index + 1}
                  </label>
                  <button
                    type="button"
                    onClick={() => deleteQuestion(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    ลบคำถาม
                  </button>
                </div>
                <input
                  type="text"
                  value={q.question}
                  onChange={(e) => handleQuestionChange(index, "question", e.target.value)}
                  className="w-full p-2 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <div>
                  <label className="block font-medium text-gray-700">ตัวเลือก</label>
                  {q.options.map((opt, optIndex) => (
                    <div key={optIndex} className="flex items-center gap-2 mb-2">
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) =>
                          handleOptionChange(index, optIndex, e.target.value)
                        }
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => deleteOption(index, optIndex)}
                        className="text-red-600 hover:text-red-800"
                      >
                        ลบ
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addOption(index)}
                    className="text-green-600 hover:text-green-800"
                  >
                    เพิ่มตัวเลือก
                  </button>
                </div>
                <div>
                  <label className="block font-medium text-gray-700">คำตอบที่ถูกต้อง</label>
                  <select
                    value={q.correctAnswer}
                    onChange={(e) =>
                      handleQuestionChange(index, "correctAnswer", e.target.value)
                    }
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="">เลือกคำตอบที่ถูกต้อง</option>
                    {q.options.map((opt, optIndex) => (
                      <option key={optIndex} value={optIndex}>
                        ตัวเลือก {optIndex + 1}: {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addQuestion}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              เพิ่มคำถาม
            </button>
          </div>

          <button
            type="submit"
            className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
          </button>
        </form>
      )}
    </div>
  );
};

export default EditExercisePage;