import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const ScoresPage = () => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedExercise, setSelectedExercise] = useState(null); // ใช้เก็บแบบฝึกหัดที่เลือก
  const navigate = useNavigate();

  // ฟังก์ชันดึงข้อมูลคะแนนจาก API
  useEffect(() => {
    const fetchScores = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:3000/api/scores", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setScores(response.data);
        setError("");
      } catch (error) {
        console.error("Error fetching scores:", error);
        setError("ไม่สามารถโหลดข้อมูลคะแนนได้");
      } finally {
        setLoading(false);
      }
    };
    fetchScores();
  }, []);

  // ดึงชื่อแบบฝึกหัดทั้งหมด
  const exercises = Array.from(
    new Set(scores.map((score) => score.exercise.title))
  );

  // ข้อมูลกราฟสำหรับแบบฝึกหัดที่เลือก
  const chartData = selectedExercise
    ? {
        labels: scores
          .filter((score) => score.exercise.title === selectedExercise)
          .map((score) => score.user.name),
        datasets: [
          {
            label: `คะแนนของ ${selectedExercise}`,
            data: scores
              .filter((score) => score.exercise.title === selectedExercise)
              .map((score) => score.score),
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      }
    : null;

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (context) => `คะแนน: ${context.raw}`,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "ผู้ใช้",
        },
      },
      y: {
        title: {
          display: true,
          text: "คะแนน",
        },
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="container mx-auto p-8 bg-gray-50 min-h-screen rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-blue-700">คะแนนแบบฝึกหัด</h1>
        <button
          onClick={() => navigate(-1)} // ย้อนกลับไปหน้าก่อนหน้า
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
        >
          ย้อนกลับ
        </button>
      </div>

      {loading && <div className="text-center text-lg font-medium">กำลังโหลดข้อมูล...</div>}
      {error && <div className="text-center text-red-600 font-semibold">{error}</div>}
      {!loading && !error && scores.length === 0 && (
        <div className="text-center text-gray-500">ยังไม่มีข้อมูลคะแนน</div>
      )}
      {!loading && !error && exercises.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">เลือกแบบฝึกหัด</h2>
          <div className="flex gap-4 flex-wrap">
            {exercises.map((exercise) => (
              <button
                key={exercise}
                onClick={() => setSelectedExercise(exercise)} // ตั้งค่าแบบฝึกหัดที่เลือก
                className={`px-4 py-2 rounded-lg transition duration-300 ${
                  selectedExercise === exercise
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-blue-100"
                }`}
              >
                {exercise}
              </button>
            ))}
          </div>
        </div>
      )}
      {selectedExercise && chartData && (
        <div className="bg-white p-4 rounded-lg shadow">
          <Bar data={chartData} options={chartOptions} />
        </div>
      )}
    </div>
  );
};

export default ScoresPage;