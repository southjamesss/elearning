import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const ExercisesPage = () => {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const categoryId = queryParams.get("category");

  const navigate = useNavigate();

  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchExercises = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3000/api/exercises?category=${categoryId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        setExercises(Array.isArray(response.data) ? response.data : [response.data]);
        setError("");
      } catch (err) {
        console.error("Error fetching exercises:", err);
        setError("ไม่สามารถโหลดข้อมูลข้อสอบได้");
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, [categoryId]);

  const handleSelectAnswer = (questionId, answerIndex) => {
    setSelectedAnswers({ ...selectedAnswers, [questionId]: answerIndex });
  };

  const handleSubmit = () => {
    let scoreCount = 0;
    selectedExercise.questions.forEach((question) => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        scoreCount++;
      }
    });
    setScore(scoreCount);
  };

  const handleExerciseSelection = async (exerciseId) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3000/api/exercises/${exerciseId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setSelectedExercise(response.data);
      setError("");
      setSelectedAnswers({});
      setScore(null);
    } catch (err) {
      console.error("Error fetching exercise:", err);
      setError("ไม่สามารถโหลดแบบฝึกหัดที่เลือกได้");
    } finally {
      setLoading(false);
    }
  };

  // 🆕 ฟังก์ชันสำหรับกลับไปเลือกแบบฝึกหัดใหม่
  const handleBackToSelection = () => {
    setSelectedExercise(null);
    setSelectedAnswers({});
    setScore(null);
  };

  return (
    <div className="container mx-auto p-8 bg-gray-50 min-h-screen rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-blue-700">แบบฝึกหัด React</h1>
        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
        >
          ย้อนกลับ
        </button>
      </div>

      {loading && <div className="text-center text-lg font-medium">กำลังโหลดข้อมูล...</div>}
      {error && <div className="text-center text-red-600 font-semibold">{error}</div>}

      {selectedExercise === null ? (
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">เลือกแบบฝึกหัดที่ต้องการทำ:</h2>
          {exercises.length === 0 ? (
            <div className="text-center text-gray-500">ยังไม่มีแบบฝึกหัด</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {exercises.map((exercise) => (
                <button
                  key={exercise.id}
                  onClick={() => handleExerciseSelection(exercise.id)}
                  className="p-4 bg-white border rounded-lg shadow hover:bg-blue-100 transition duration-300"
                >
                  {exercise.title}
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedExercise.title}</h2>
          <p className="text-gray-600 mb-6">{selectedExercise.description}</p>

          {selectedExercise.questions.map((question) => (
            <div key={question.id} className="mb-6">
              <h3 className="text-lg font-medium text-gray-700">{question.question}</h3>
              <div className="mt-2">
                {question.options.map((option, index) => (
                  <label key={index} className="block cursor-pointer">
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={index}
                      checked={selectedAnswers[question.id] === index}
                      onChange={() => handleSelectAnswer(question.id, index)}
                      className="mr-2"
                    />
                    {option.option}
                  </label>
                ))}
              </div>
            </div>
          ))}

          <div className="flex gap-4 mt-4">
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300"
            >
              ส่งคำตอบ
            </button>

            {/* 🆕 ปุ่มกลับไปเลือกแบบฝึกหัดใหม่ */}
            <button
              onClick={handleBackToSelection}
              className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-300"
            >
              กลับไปเลือกแบบฝึกหัดใหม่
            </button>
          </div>

          {score !== null && (
            <div className="mt-6 text-xl font-bold text-indigo-700">
              คะแนนของคุณ: {score}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExercisesPage;