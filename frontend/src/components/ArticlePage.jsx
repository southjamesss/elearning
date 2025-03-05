import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./BookAnimation.css";

const ArticlePage = () => {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const categoryId = queryParams.get("category");

  const navigate = useNavigate();

  const bookContent = {
    1: {
      title: "เรียนรู้ React ฉบับสมบูรณ์",
      cover: "📘 React Mastery Guidebook",
      content: [
        // บทที่ 1: React คืออะไร?
        {
          sectionTitle: "บทที่ 1: React คืออะไร?",
          content: `
            React เป็นไลบรารี JavaScript สำหรับการสร้างส่วนติดต่อผู้ใช้ (UI) ที่พัฒนาโดย Facebook
            
            จุดเด่นของ React:
            - Component-based Architecture
            - Virtual DOM
            - Reusable Components
            
            เริ่มต้นด้วยคำสั่ง:
            npx create-react-app my-app
          `
        },

        // บทที่ 2: การติดตั้ง React
        {
          sectionTitle: "บทที่ 2: การติดตั้ง React",
          content: `
            เรียนรู้วิธีการติดตั้ง React ในเครื่องคอมพิวเตอร์ของคุณ
  
            ขั้นตอน:
            1. ติดตั้ง Node.js
            2. ติดตั้ง npm (Node Package Manager)
            3. สร้างโปรเจกต์ด้วยคำสั่ง:
              npx create-react-app my-app
          `
        },

        // บทที่ 3: การใช้งาน Props และ State
        {
          sectionTitle: "บทที่ 3: การใช้งาน Props และ State",
          content: `
            **Props**: ส่งข้อมูลจากพาเรนต์ไปยังชิลด์
            **State**: จัดการข้อมูลภายใน Component
  
            ตัวอย่าง:
            const [count, setCount] = useState(0);
            <button onClick={() => setCount(count + 1)}>เพิ่ม {count}</button>
          `
        },

        // บทที่ 4: การจัดการ Event
        {
          sectionTitle: "บทที่ 4: การจัดการ Event",
          content: `
            React ใช้ camelCase ในการจัดการ Event
  
            ตัวอย่าง:
            <button onClick={() => alert('คลิกแล้ว!')}>คลิกฉัน!</button>
          `
        },
  
        // บทที่ 5: การจัดการฟอร์ม
        {
          sectionTitle: "บทที่ 5: การจัดการฟอร์ม",
          content: `
            ใช้ State จัดการค่าฟอร์ม
  
            ตัวอย่าง:
            const [name, setName] = useState('');
            <input value={name} onChange={(e) => setName(e.target.value)} />
          `
        },
  
        // บทที่ 6: React Hooks (เบื้องต้น)
        {
          sectionTitle: "บทที่ 6: React Hooks",
          content: `
            Hooks เพิ่มความสามารถให้ Functional Component
  
            - useState: จัดการ State
            - useEffect: จัดการ Side Effect
  
            ตัวอย่าง:
            useEffect(() => {
              console.log('Component ถูกเรนเดอร์');
            }, []);
          `
        },
  
        // บทที่ 7: React Router (Routing)
        {
          sectionTitle: "บทที่ 7: การใช้งาน React Router",
          content: `
            React Router จัดการ Routing ใน SPA
  
            ติดตั้ง:
            npm install react-router-dom
  
            ตัวอย่าง:
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
            </Routes>
          `
        },
  
        // บทที่ 8: Context API (ขั้นสูง)
        {
          sectionTitle: "บทที่ 8: การจัดการ State ด้วย Context API",
          content: `
            Context API ช่วยแชร์ข้อมูลข้าม Components
  
            ตัวอย่าง:
            const ThemeContext = createContext('light');
            <ThemeContext.Provider value="dark">
              <Toolbar />
            </ThemeContext.Provider>
          `
        },
  
        // บทที่ 9: Redux (การจัดการ State ขนาดใหญ่)
        {
          sectionTitle: "บทที่ 9: การจัดการ State ด้วย Redux",
          content: `
            Redux จัดการ State ที่ซับซ้อน
  
            ติดตั้ง:
            npm install redux react-redux
  
            หลักการทำงาน:
            - Store
            - Action
            - Reducer
          `
        },
  
        // บทที่ 10: การทำงานร่วมกับ API
        {
          sectionTitle: "บทที่ 10: การเชื่อมต่อ API",
          content: `
            การดึงข้อมูลด้วย fetch และ axios
  
            ตัวอย่าง:
            useEffect(() => {
              fetch('https://api.example.com/data')
                .then(response => response.json())
                .then(data => setData(data));
            }, []);
          `
        },
  
        // บทที่ 11: Styled Components
        {
          sectionTitle: "บทที่ 11: การใช้งาน Styled Components",
          content: `
            Styled Components ช่วยสร้าง CSS ใน JavaScript
  
            ติดตั้ง:
            npm install styled-components
  
            ตัวอย่าง:
            const Button = styled.button\`
              background-color: blue;
              color: white;
            \`;
          `
        },
  
        // บทที่ 12: Next.js (Server-side Rendering)
        {
          sectionTitle: "บทที่ 12: การใช้งาน Next.js",
          content: `
            Next.js เป็น Framework สำหรับ React รองรับ SSR และ Static Generation
  
            ติดตั้ง:
            npx create-next-app
  
            โครงสร้าง:
            - pages/
            - components/
          `
        },
  
        // บทที่ 13: การทดสอบ React ด้วย Jest
        {
          sectionTitle: "บทที่ 13: การทดสอบ React ด้วย Jest",
          content: `
            Jest เป็น Testing Framework สำหรับ React
  
            ติดตั้ง:
            npm install --save-dev jest react-testing-library
  
            ตัวอย่าง:
            test('เพิ่มเลข', () => {
              expect(1 + 1).toBe(2);
            });
          `
        },
  
        // บทที่ 14: Progressive Web App (PWA)
        {
          sectionTitle: "บทที่ 14: สร้าง PWA ด้วย React",
          content: `
            React สามารถสร้าง PWA ได้ง่าย
  
            เปิดใช้งาน service worker:
            npm run build
            serve -s build
          `
        },
  
        // บทที่ 15: การทำงานกับ Firebase
        {
          sectionTitle: "บทที่ 15: การใช้งาน Firebase",
          content: `
            Firebase ให้บริการ Backend สำหรับเว็บและมือถือ
  
            ติดตั้ง:
            npm install firebase
  
            ตัวอย่าง:
            import { initializeApp } from "firebase/app";
            const app = initializeApp(firebaseConfig);
          `
        },
  
        // บทส่งท้าย
        {
          sectionTitle: "บทส่งท้าย: พัฒนา React อย่างมืออาชีพ",
          content: `
            หลังจากเรียนรู้พื้นฐานและเทคนิคต่าง ๆ ของ React แล้ว
            
            - ลองทำโปรเจกต์จริง
            - ศึกษา Next.js และ GraphQL
            - ทดสอบและ Deploy แอปพลิเคชัน
          `
        }
      ],
    },
  };

  const book = bookContent[categoryId] || { title: "บทความไม่พบ", content: [] };
  const [currentPage, setCurrentPage] = useState(0); // ตั้งค่าให้เริ่มต้นที่หน้า 0 (บทที่ 1)

  const handleNextPage = () => {
    if (currentPage < book.content.length - 1) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1); // ป้องกันไม่ให้ลดต่ำกว่า 0
  };

  return (
    <div className="book-container">
      {/* ปุ่มย้อนกลับ */}
      <button className="back-btn" onClick={() => navigate(-1)}>ย้อนกลับ</button>

      <div className="book">
        {currentPage === 0 ? (
          <div className="cover-page" onClick={handleNextPage}>
            <h1>{book.cover}</h1>
            <p>คลิกเพื่อเริ่มอ่าน</p>
          </div>
        ) : (
          book.content.map((section, index) => (
            <div
              key={index}
              className={`page ${index <= currentPage ? "flipped" : ""}`}
              style={{ zIndex: book.content.length - index }}
            >
              <div className="front">
                <h2>{section.sectionTitle}</h2>
                <p>{section.content}</p>
              </div>
              <div className="back"></div>
            </div>
          ))
        )}
      </div>

      {/* ปุ่มเปลี่ยนหน้า */}
      {currentPage > 0 && (
        <>
          <button className="flip-btn left" onClick={handlePrevPage}>❮</button>
          <button className="flip-btn right" onClick={handleNextPage}>❯</button>
        </>
      )}
    </div>
  );
};

export default ArticlePage;