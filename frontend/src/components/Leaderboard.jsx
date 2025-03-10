import React, { useState, useEffect } from "react";
import axios from "axios";

// Leaderboard Component
const Leaderboard = ({ setShowLeaderboard }) => {
  const [leaderboardByExercise, setLeaderboardByExercise] = useState({});
  const [selectedExercise, setSelectedExercise] = useState("");

  // Fetch leaderboard data from API
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/leaderboard");
        setLeaderboardByExercise(response.data); // Set the leaderboard data
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };

    fetchLeaderboard();
  }, []);

  // Prevent map error by ensuring data exists
  const selectedExerciseData = selectedExercise && leaderboardByExercise[selectedExercise];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">
          🏆 Leaderboard สำหรับ: {selectedExercise || "เลือกแบบฝึกหัด"}
        </h2>

        {/* Dropdown to select exercise */}
        <div className="mb-4">
          <label htmlFor="exercise-select" className="block text-lg mb-2">
            เลือกแบบฝึกหัด:
          </label>
          <select
            id="exercise-select"
            value={selectedExercise}
            onChange={(e) => setSelectedExercise(e.target.value)}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            <option value="">-- เลือกแบบฝึกหัด --</option>
            {Object.keys(leaderboardByExercise).map((exerciseTitle, index) => (
              <option key={index} value={exerciseTitle}>
                {exerciseTitle}
              </option>
            ))}
          </select>
        </div>

        {/* Display leaderboard data for selected exercise */}
        <div className="space-y-4">
          {selectedExerciseData ? (
            selectedExerciseData.map((user, idx) => {
              const rankEmojis = ["🥇", "🥈", "🥉"];
              const emoji = rankEmojis[idx] || ""; // ใช้แค่อันดับ 1-3 มีอิโมจิ

              return (
                <div key={idx} className="bg-gray-100 p-4 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold mb-2">
                    {idx + 1}. {user.name} {emoji} - {user.score} คะแนน
                  </h3>
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-500">กำลังโหลดข้อมูลอันดับ...</p>
          )}
        </div>

        <button
          onClick={() => setShowLeaderboard(false)}
          className="mt-4 w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          ปิด
        </button>
      </div>
    </div>
  );
};

export default Leaderboard;
