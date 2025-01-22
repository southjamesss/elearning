import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// ฟังก์ชันตรวจสอบและดึง Video ID จาก YouTube URL
const extractVideoId = (url) => {
  const match = url.match(
    /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null; // ดึง Video ID ออกมา
};

const VideosPage = () => {
  const [videos, setVideos] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true); // State สำหรับโหลดข้อมูล
  const [error, setError] = useState(null); // State สำหรับจัดการข้อผิดพลาด
  const navigate = useNavigate();

  // ฟังก์ชันดึงข้อมูลวิดีโอจาก API
  useEffect(() => {
    const fetchVideos = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("Token is missing");
        navigate("/login"); // หากไม่มี token พาผู้ใช้ไปหน้า login
        return;
      }

      try {
        // ส่ง token ไปกับ header
        const response = await axios.get("http://localhost:3000/admin/videos", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // หากการร้องขอสำเร็จ ให้เก็บข้อมูลวิดีโอ
        setVideos(response.data);
        setLoading(false); // เปลี่ยนสถานะการโหลด
      } catch (err) {
        console.error("Error fetching videos:", err);
        setError("ไม่สามารถดึงข้อมูลวิดีโอได้"); // เก็บข้อความข้อผิดพลาด
        setLoading(false); // เปลี่ยนสถานะการโหลด
      }
    };

    fetchVideos();
  }, [navigate]); // เรียกใช้ทุกครั้งที่ navigate เปลี่ยน

  // ฟังก์ชันเริ่มต้นวิดีโอ
  const handleStartWatching = (video) => {
    const videoId = extractVideoId(video.url);
    if (videoId) {
      setCurrentVideo(video);
      setIsPlaying(true);
    } else {
      alert("ไม่สามารถดึงข้อมูลวิดีโอได้");
    }
  };

  // ปิดการดูวิดีโอ
  const handleCloseVideo = () => {
    setIsPlaying(false);
    setCurrentVideo(null);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-extrabold text-gray-800">
            วิดีโอการศึกษา React & Node.js
          </h1>
          <button
            onClick={() => navigate("/home")}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300"
          >
            กลับสู่หน้า Home
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center">
            <div className="spinner-border text-indigo-600" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div> // แสดงข้อผิดพลาด
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.length === 0 ? (
              <div className="text-center text-gray-600">ยังไม่มีวิดีโอ</div>
            ) : (
              videos.map((video) => {
                // ตรวจสอบ URL และดึง ID ของ YouTube
                const videoId = extractVideoId(video.url);
                const thumbnailUrl = videoId
                  ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
                  : null;

                return (
                  <div
                    key={video.id}
                    className="bg-white rounded-lg shadow-lg p-4 transition-all hover:shadow-xl hover:scale-105"
                  >
                    {/* แสดงภาพ Thumbnail */}
                    {thumbnailUrl ? (
                      <img
                        src={thumbnailUrl}
                        alt={video.title}
                        className="w-full h-48 object-cover rounded-lg mb-4 transition-transform transform hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-300 rounded-lg mb-4"></div>
                    )}
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">{video.title}</h2>
                    <p className="text-gray-600 mb-4">{video.description}</p>
                    <button
                      onClick={() => handleStartWatching(video)}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
                    >
                      เริ่มดูวิดีโอ
                    </button>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {currentVideo && isPlaying && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{currentVideo.title}</h2>
            <iframe
              width="100%"
              height="315"
              src={`https://www.youtube.com/embed/${extractVideoId(currentVideo.url)}`}
              title={currentVideo.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg shadow-lg"
            ></iframe>
            <button
              onClick={handleCloseVideo}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
            >
              ปิดวิดีโอ
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideosPage;