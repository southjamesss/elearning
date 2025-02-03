import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminExercisesPage = () => {
  const [exercises, setExercises] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([
    { question: "", options: ["", "", "", ""], correctAnswer: null }
  ]);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);  //เพื่อจัดการสถานะการโหลด
  const navigate = useNavigate();

  //ฟังก์ชันดึงข้อมูลแบบฝึกหัด
  const fetchExercises = async () => {
    setLoading(true); // เริ่มต้นการโหลด
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3000/api/exercises", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExercises(response.data);
      setError("");
    } catch (err) {
      console.error("Error fetching exercises:", err);
      setError("ไม่สามารถโหลดข้อมูลแบบฝึกหัดได้");
    } finally {
      setLoading(false);  //หยุดการโหลด
    }
  };

  // ฟังก์ชันเพิ่มคำถามใหม่
  const addQuestion = () => {
    setQuestions([...questions, { question: "", options: ["", "", "", ""], correctAnswer: null }]);
  };

  // ฟังก์ชันบันทึกแบบฝึกหัด
  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
  
      const newExercise = {
        title,
        description,
        questions: questions.map((q) => ({
          question: q.question,
          options: q.options.map((option) => option), // ใช้ตัวเลือกแบบตรงๆ
          correctAnswer: q.correctAnswer,
        })),
      };
  
      // ส่งข้อมูลไปยัง API เพิ่ม Exercise
      if (editId) {
        // การแก้ไขแบบฝึกหัด
        await axios.put(
          `http://localhost:3000/admin/exercises/${editId}`,
          newExercise,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        //การสร้างแบบฝึกหัดใหม่
        await axios.post(
          "http://localhost:3000/admin/exercises",
          newExercise,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
  
      // เมื่อเพิ่มแบบฝึกหัดใหม่ จะรีเซ็ตเฉพาะในกรณีที่ไม่ได้แก้ไขแบบฝึกหัด
      if (!editId) {
        setTitle("");
        setDescription("");
        setQuestions([{ question: "", options: ["", "", "", ""], correctAnswer: null }]);
      }
  
      setEditId(null);
      fetchExercises(); // รีเฟรชข้อมูลใหม่
    } catch (err) {
      setError("ไม่สามารถบันทึกแบบฝึกหัดได้");
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันลบแบบฝึกหัด
  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/admin/exercises/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchExercises();
    } catch (err) {
      setError("ไม่สามารถลบแบบฝึกหัดได้");
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันแก้ไขแบบฝึกหัด
  const handleEdit = (exercise) => {
    setTitle(exercise.title);
    setDescription(exercise.description);
    setQuestions(exercise.questions);
    setEditId(exercise.id);
    navigate(`/admin/exercises/edit/${exercise.id}`);
  };

  // ใช้ useEffect เพื่อดึงข้อมูลเมื่อ Component โหลด
  useEffect(() => {
    fetchExercises();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-end mb-6">
        <button
          onClick={() => navigate("/admin")}
          className="text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg shadow-md"
        >
          ย้อนกลับ
        </button>
      </div>

      <div className="text-3xl font-semibold mb-6 text-gray-800">จัดการแบบฝึกหัด</div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* ฟอร์มเพื่อเพิ่มหรืออัปเดตแบบฝึกหัด */}
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
          {questions.map((q, index) => (
            <div key={index} className="space-y-3">
              <div>
                <label className="block font-medium text-gray-700">คำถาม {index + 1}</label>
                <input
                  type="text"
                  value={q.question}
                  onChange={(e) => {
                    const newQuestions = [...questions];
                    newQuestions[index].question = e.target.value;
                    setQuestions(newQuestions);
                  }}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700">ตัวเลือก</label>
                {q.options.map((option, i) => {
                  const optionLabel = ["ก", "ข", "ค", "ง"][i]; // ใช้ตัวอักษรไทยแทนการคำนวณ
                  return (
                    <div key={i} className="flex items-center">
                      <span className="mr-2">{optionLabel}.</span> {/* แสดง ก ข ค ง */}
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => {
                          const newQuestions = [...questions];
                          newQuestions[index].options[i] = e.target.value;
                          setQuestions(newQuestions);
                        }}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                  );
                })}
              </div>
              <div>
                <label className="block font-medium text-gray-700">ตัวเลือกที่ถูกต้อง</label>
                <select
                  value={q.correctAnswer}
                  onChange={(e) => {
                    const newQuestions = [...questions];
                    newQuestions[index].correctAnswer = parseInt(e.target.value);
                    setQuestions(newQuestions);
                  }}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value={null}>เลือกตัวเลือกที่ถูกต้อง</option>
                  {q.options.map((option, i) => {
                    const optionLabel = ["ก", "ข", "ค", "ง"][i]; // ใช้ตัวอักษรไทยแทนการคำนวณ
                    return (
                      <option key={i} value={i}>{`${optionLabel}. ${option}`}</option>
                    );
                  })}
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
          className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
        >
          {editId ? "อัปเดตแบบฝึกหัด" : "เพิ่มแบบฝึกหัด"}
        </button>
      </form>

      {/* แสดงรายการแบบฝึกหัด */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {exercises.length === 0 ? (
          <div>ยังไม่มีแบบฝึกหัด</div>
        ) : (
          exercises.map((exercise) => (
            <div key={exercise.id} className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800">{exercise.title}</h3>
              <p className="text-gray-600 mt-2">{exercise.description}</p>
              <div className="flex justify-end mt-4 space-x-4">
                <button
                  onClick={() => handleEdit(exercise)}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                >
                  แก้ไข
                </button>
                <button
                  onClick={() => handleDelete(exercise.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  ลบ
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminExercisesPage;