import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useNavigate } from "react-router-dom";

const CertificatePage = () => {
  const navigate = useNavigate();
  
  const [userName, setUserName] = useState("");
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [score, setScore] = useState(null);
  const [isCertificateGenerated, setIsCertificateGenerated] = useState(false);
  const [logoBase64, setLogoBase64] = useState(null);
  const [fontBase64, setFontBase64] = useState(null);

  useEffect(() => {
    const loadAssets = async () => {
      setLogoBase64(await fetchAsset("/222.png"));
      setFontBase64(await fetchAsset("/fonts/THSarabunNew.ttf"));
    };
    loadAssets();
  }, []);

  const fetchAsset = async (path) => {
    try {
      const response = await fetch(path);
      if (!response.ok) throw new Error("Failed to load asset");
      const blob = await response.blob();
      return await convertToBase64(blob);
    } catch (error) {
      console.error(`Error loading asset: ${path}`, error);
      return null;
    }
  };

  const convertToBase64 = (blob) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.readAsDataURL(blob);
    });
  };

  useEffect(() => {
    const fetchUserScores = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return console.error("❌ ไม่พบ userId ใน LocalStorage");
      
      try {
        const response = await axios.get(`http://localhost:3000/api/user-scores/${userId}`);
        if (response.data.length > 0) {
          setUserName(response.data[0].userName || "ไม่พบชื่อ");
          setExercises(response.data);
        }
      } catch (error) {
        console.error("❌ Error fetching user scores:", error);
      }
    };
    fetchUserScores();
  }, []);

  const handleExerciseSelection = (exerciseId) => {
    const selected = exercises.find((ex) => ex.exerciseId === parseInt(exerciseId));
    if (!selected) return console.error("❌ ไม่พบแบบฝึกหัดที่เลือก");
    setSelectedExercise(selected);
    setScore(selected.score || 0);
  };

  const generateCertificate = () => {
    if (!selectedExercise || !userName || score === null) {
      alert("⚠️ ข้อมูลไม่ครบ กรุณาเลือกแบบฝึกหัดและตรวจสอบคะแนน");
      return;
    }
    
    const doc = new jsPDF("p", "mm", "a4");
    if (fontBase64) {
      doc.addFileToVFS("THSarabunNew.ttf", fontBase64);
      doc.addFont("THSarabunNew.ttf", "THSarabunNew", "normal");
      doc.setFont("THSarabunNew", "normal");
    } else {
      doc.setFont("helvetica", "bold");
    }

    if (logoBase64) {
      doc.addImage(logoBase64, "PNG", 80, 20, 50, 50);
    }

    doc.setFontSize(26).text("ใบประกาศนียบัตร", 105, 80, null, null, "center");
    doc.setFontSize(18).text("ขอมอบให้แก่", 105, 100, null, null, "center");
    doc.setFontSize(22).text(userName, 105, 115, null, null, "center");
    doc.setFontSize(18).text("สำหรับการทำแบบฝึกหัด", 105, 130, null, null, "center");
    doc.setFontSize(22).text(selectedExercise.exerciseTitle, 105, 145, null, null, "center");
    doc.setFontSize(20).text(`คะแนนที่ได้รับ: ${score} คะแนน`, 105, 165, null, null, "center");
    
    doc.setLineWidth(0.5).line(50, 175, 160, 175);
    doc.setFontSize(14).text(`ลงวันที่: ${new Date().toLocaleDateString()}`, 105, 190, null, null, "center");
    doc.text("ลงชื่อ", 60, 210).text("_____________________", 50, 215).text("อาจารย์ผู้ดูแล", 60, 225);

    const safeFileName = `${userName.replace(/[^a-zA-Z0-9ก-๙ ]/g, "")}-${selectedExercise.exerciseTitle.replace(/[^a-zA-Z0-9ก-๙ ]/g, "")}-certificate.pdf`;
    doc.save(safeFileName);
    setIsCertificateGenerated(true);
  };

  return (
    <div className="container mx-auto p-6 flex flex-col items-center relative">
      <button className="absolute top-4 right-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700" onClick={() => navigate(-1)}>
        ย้อนกลับ
      </button>
      <h1 className="text-2xl font-bold mb-4">ใบประกาศนียบัตร</h1>
      <p className="text-lg mb-4">เลือกแบบฝึกหัดที่ต้องการปริ้นใบประกาศ</p>
      {exercises.length === 0 ? (
        <p className="text-red-500">ไม่มีแบบฝึกหัดให้เลือก</p>
      ) : (
        <select onChange={(e) => handleExerciseSelection(e.target.value)} className="px-4 py-2 border rounded-md mb-4">
          <option value="">-- เลือกแบบฝึกหัด --</option>
          {exercises.map((ex) => (
            <option key={ex.exerciseId} value={ex.exerciseId}>
              {ex.exerciseTitle} (คะแนนสูงสุด: {ex.score})
            </option>
          ))}
        </select>
      )}
      <button onClick={generateCertificate} className="px-6 py-3 bg-blue-600 text-white rounded-full">
        ดาวน์โหลดใบประกาศ
      </button>
      {isCertificateGenerated && <p className="mt-4 text-green-500">ใบประกาศได้ถูกดาวน์โหลดแล้ว!</p>}
    </div>
  );
};

export default CertificatePage;
