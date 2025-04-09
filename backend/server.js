require('dotenv').config(); // โหลดตัวแปรจากไฟล์ .env
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const multer = require('multer');
const fs = require('fs');  // เพิ่มการ import fs
const FormData = require("form-data")




const upload = multer({ dest: 'uploads/' });  // กำหนดที่เก็บไฟล์ที่อัพโหลด
const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://elearning-n537q4zk1-southjamesss-projects.vercel.app'  // << เพิ่ม domain Vercel ของพี่
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

app.use(express.json());  // สำหรับรับข้อมูล JSON

// Middleware สำหรับตรวจสอบ Token
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // ดึง Bearer token

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized access, token required' });
  }

  try {
    const user = jwt.verify(token, JWT_SECRET); // ใช้ JWT_SECRET ในการตรวจสอบ
    req.user = user;  // เก็บข้อมูลผู้ใช้ใน request
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// Refresh Token Route
app.post('/refresh-token', async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ error: "Refresh token is required" });
  }

  try {
    // ตรวจสอบว่า refresh token ถูกต้องหรือไม่
    const user = jwt.verify(refreshToken, JWT_REFRESH_SECRET);

    // ตรวจสอบว่า refresh token ยังไม่หมดอายุ
    if (Date.now() / 1000 > user.exp) {
      return res.status(401).json({ error: "Refresh token has expired" });
    }

    // ตรวจสอบว่าผู้ใช้ที่ถูกดึงมาจาก token ยังอยู่ในฐานข้อมูลหรือไม่
    const dbUser = await prisma.user.findUnique({
      where: {
        id: user.userId,
      }
    });

    if (!dbUser) {
      return res.status(401).json({ error: "User not found in database" });
    }

    // สร้าง Access Token ใหม่
    const newAccessToken = jwt.sign({ userId: user.userId, role: user.role }, JWT_SECRET, { expiresIn: "1d" });

    // ส่ง access token ใหม่กลับไปให้ client
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    console.error("Error refreshing token:", err);
    return res.status(403).json({ error: "Invalid or malformed refresh token" });
  }
});

//เพิ่ม Middleware ตรวจสอบ Token หมดอายุ
const checkTokenExpiration = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) return next();

  const decoded = jwt.decode(token);

  if (decoded && decoded.exp && decoded.exp < Date.now() / 1000) {
    return res.status(401).json({ error: 'Access token expired' });
  }

  next();
};

app.use(checkTokenExpiration);

// Register User
app.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role },
    });
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (err) {
    res.status(400).json({ error: 'Email already exists' });
  }
});

// Login Route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log('Login attempt with email:', email);

    // ตรวจสอบว่า email และ password ถูกส่งมาครบหรือไม่
    if (!email || !password) {
      console.log("Missing email or password");
      return res.status(400).json({ error: "กรุณากรอกอีเมลและรหัสผ่าน" });
    }

    // ค้นหา user ในฐานข้อมูล
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      console.log("User not found with email:", email);
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // ตรวจสอบความถูกต้องของ password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log("Invalid password for email:", email);
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // ตรวจสอบว่า role ถูกกำหนดในฐานข้อมูล
    if (!user.role) {
      console.log(`User role not defined for userId: ${user.id}`);
      return res.status(400).json({ error: "User role not defined" });
    }

    // สร้าง JWT Token
    const accessToken = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: "1d" }
    );
    const refreshToken = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    console.log('Login successful for userId:', user.id);

    // ส่ง userId, accessToken, refreshToken และ role กลับไปยังไคลเอนต์
    res.json({
      userId: user.id, // user.id จะมีค่าหลังจากผ่าน validation ข้างต้น
      accessToken,
      refreshToken,
      role: user.role,
    });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ" });
  }
});


// Check-in Route
app.post('/api/checkin', authenticateToken, async (req, res) => {
  const { date } = req.body;
  const userId = req.user.userId; // ดึง user ID จาก token

  if (!date || isNaN(new Date(date).getTime())) {
    return res.status(400).json({ message: "Invalid date format" });
  }

  try {
    const startOfDay = new Date(date).setHours(0, 0, 0, 0);
    const endOfDay = new Date(date).setHours(23, 59, 59, 999);

    const existingAttendance = await prisma.attendance.findFirst({
      where: {
        userId: userId,
        date: {
          gte: new Date(startOfDay),
          lt: new Date(endOfDay),
        },
      },
    });

    if (existingAttendance) {
      return res.status(400).json({ message: "วันนี้คุณได้เช็คชื่อไปแล้ว!" });
    }

    const newAttendance = await prisma.attendance.create({
      data: {
        user: {
          connect: { id: userId }
        },
        date: new Date(date),
      },
    });

    return res.status(201).json({ message: "Check-in successful", attendance: newAttendance });
  } catch (error) {
    console.error("Error during check-in:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

//ล้างเช็คชื่อ
app.delete("/api/attendance", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "You are not authorized to delete attendance data" });
    }

    await prisma.attendance.deleteMany(); // ลบข้อมูลทั้งหมดในตาราง attendance
    res.status(200).json({ message: "ล้างข้อมูลสำเร็จ" });
  } catch (error) {
    console.error("Error clearing attendance data:", error);
    res.status(500).json({ error: "ไม่สามารถล้างข้อมูลได้" });
  }
});


// เพิ่มวิดีโอ
app.post('/admin/videos', authenticateToken, async (req, res) => {
  const { title, description, url } = req.body;

  if (!title || !description || !url) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // ตรวจสอบบทบาทของผู้ใช้
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: "You are not authorized to add videos" });
  }

  try {
    const video = await prisma.video.create({
      data: { title, description, url },
    });
    res.status(201).json({ message: "Video added successfully", video });
  } catch (err) {
    console.error("Error adding video:", err);
    res.status(500).json({ error: "Failed to add video" });
  }
});

// แก้ไขวิดีโอ
app.put('/admin/videos/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { title, description, url } = req.body;

  if (!title || !description || !url) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // ตรวจสอบบทบาทของผู้ใช้
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: "You are not authorized to update videos" });
  }

  try {
    const video = await prisma.video.update({
      where: { id: Number(id) },
      data: { title, description, url },
    });
    res.status(200).json({ message: "Video updated successfully", video });
  } catch (err) {
    console.error("Error updating video:", err);
    res.status(500).json({ error: "Failed to update video" });
  }
});

// ลบวิดีโอ
app.delete('/admin/videos/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  // ตรวจสอบบทบาทของผู้ใช้
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: "You are not authorized to delete videos" });
  }

  try {
    const video = await prisma.video.delete({
      where: { id: Number(id) },
    });
    res.status(200).json({ message: "Video deleted successfully", video });
  } catch (err) {
    console.error("Error deleting video:", err);
    res.status(500).json({ error: "Failed to delete video" });
  }
});



// ดึงข้อมูลวิดีโอ
app.get('/admin/videos', authenticateToken, async (req, res) => {
  try {
    const videos = await prisma.video.findMany();

    if (!videos || videos.length === 0) {
      return res.status(404).json({ message: "No videos found" });
    }

    res.status(200).json(videos);
  } catch (err) {
    console.error("Error fetching videos:", err);
    res.status(500).json({ error: "Failed to fetch videos" });
  }
});


// Route สำหรับเพิ่มแบบฝึกหัด
app.post('/admin/exercises', authenticateToken, async (req, res) => {
  const { title, description, questions } = req.body; // รับข้อมูลคำถามที่มีตัวเลือก

  if (!title || !description || !questions) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: "You are not authorized to add exercises" });
  }

  try {
    // เพิ่ม Exercise
    const exercise = await prisma.exercise.create({
      data: {
        title,
        description,
      }
    });

    // เพิ่มคำถามและตัวเลือก
    for (const question of questions) {
      const newQuestion = await prisma.question.create({
        data: {
          question: question.question,
          exerciseId: exercise.id, // อ้างอิง Exercise ที่เพิ่งเพิ่ม
          correctAnswer: question.correctAnswer
        }
      });

      // ในการสร้างตัวเลือก
      for (const option of question.options) {
        await prisma.option.create({
          data: {
            option: option,  // ตัวเลือกเป็น String
            questionId: newQuestion.id  // เชื่อมโยงกับคำถาม
          }
        });
      }
    }

    res.status(201).json({ message: "Exercise added successfully", exercise });
  } catch (err) {
    console.error("Error adding exercise:", err);
    res.status(500).json({ error: "Failed to add exercise" });
  }
});

// Route สำหรับอัปเดตแบบฝึกหัด
app.put('/api/exercises/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { title, description, questions } = req.body;

  if (!title || !description || !questions) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // อัปเดต Exercise
    const exercise = await prisma.exercise.update({
      where: { id: Number(id) },
      data: { title, description }
    });

    // ลบคำถามเก่าและตัวเลือกเก่าออก
    await prisma.option.deleteMany({ where: { questionId: { in: (await prisma.question.findMany({ where: { exerciseId: Number(id) }, select: { id: true } })).map(q => q.id) } } });
    await prisma.question.deleteMany({ where: { exerciseId: Number(id) } });

    // เพิ่มคำถามใหม่
    for (const question of questions) {
      const newQuestion = await prisma.question.create({
        data: {
          question: question.question,
          exerciseId: exercise.id,
          correctAnswer: question.correctAnswer
        }
      });

      // ในโค้ดของคุณที่บันทึกตัวเลือก
      for (const option of question.options) {
        await prisma.option.create({
          data: {
            option: option,  // ส่งเป็นสตริงโดยตรง
            questionId: newQuestion.id  // เชื่อมโยงกับคำถามที่ถูกต้อง
          }
        });
      }
    }

    res.status(200).json({ message: "Exercise updated successfully", exercise });
  } catch (err) {
    console.error("Error updating exercise:", err);
    res.status(500).json({ error: "Failed to update exercise" });
  }
});

// Route สำหรับลบแบบฝึกหัด
app.delete('/admin/exercises/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: "You are not authorized to delete exercises" });
    }

    // ลบคำถามและตัวเลือกที่เกี่ยวข้อง
    await prisma.option.deleteMany({ where: { questionId: { in: (await prisma.question.findMany({ where: { exerciseId: Number(id) }, select: { id: true } })).map(q => q.id) } } });
    await prisma.question.deleteMany({ where: { exerciseId: Number(id) } });

    // ลบ Exercise
    const exercise = await prisma.exercise.delete({
      where: { id: Number(id) }
    });

    res.status(200).json({ message: "Exercise and related data deleted successfully", exercise });
  } catch (err) {
    console.error("Error deleting exercise:", err);
    res.status(500).json({ error: "Failed to delete exercise" });
  }
});

// Route สำหรับดึงข้อมูลแบบฝึกหัดทั้งหมด
app.get('/api/exercises', authenticateToken, async (req, res) => {
  console.log("API ถูกเรียกแล้ว")  // log การเรียก API
  try {
    const exercises = await prisma.exercise.findMany();
    res.json(exercises);  // ส่งข้อมูลกลับ
  } catch (err) {
    console.error("Error fetching exercises:", err);
    res.status(500).json({ error: "Failed to fetch exercises" });
  }
});


// ดึงข้อมูลแบบฝึกหัดพร้อมคำถามและตัวเลือก
app.get('/api/exercises/:id', authenticateToken, async (req, res) => {
  try {
    // ดึงข้อมูล Exercise พร้อมคำถามและตัวเลือก
    const exercise = await prisma.exercise.findUnique({
      where: { id: parseInt(req.params.id) }, // รับ ID จาก URL
      include: {
        questions: { // รวมคำถาม
          include: {
            options: true, // รวมตัวเลือกของแต่ละคำถาม
          },
        },
      },
    });

    // ถ้าหากไม่พบข้อมูลแบบฝึกหัดที่ต้องการ
    if (!exercise) {
      return res.status(404).json({ error: "Exercise not found" });
    }

    // ส่งข้อมูลแบบฝึกหัดที่รวมคำถามและตัวเลือก
    res.status(200).json(exercise);
  } catch (err) {
    console.error("Error fetching exercise:", err);
    res.status(500).json({ error: "Failed to fetch exercise" });
  }
});




// Route สำหรับดึงข้อมูลผู้ใช้งานทั้งหมด
app.get('/admin/users', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: "You are not authorized to view users" });
    }

    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Route สำหรับเพิ่มผู้ใช้งาน
app.post('/admin/users', authenticateToken, async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: "You are not authorized to add users" });
  }

  try {
    const newUser = await prisma.user.create({
      data: { name, email, password, role }
    });
    res.status(201).json({ message: "User added successfully", user: newUser });
  } catch (err) {
    res.status(500).json({ error: "Failed to add user" });
  }
});

// Route สำหรับแก้ไขข้อมูลผู้ใช้งาน
app.put('/admin/users/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, email, password, role } = req.body;

  if (!name || !email || !role) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const updateData = { name, email, role };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: updateData,
    });

    res.status(200).json({ message: "User updated successfully", user: updatedUser });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ error: "Failed to update user" });
  }
});

// Route สำหรับลบผู้ใช้งาน
app.delete('/admin/users/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: "You are not authorized to delete users" });
  }

  try {
    const deletedUser = await prisma.user.delete({
      where: { id: Number(id) },
    });
    res.status(200).json({ message: "User and related attendances deleted successfully", user: deletedUser });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// ดึงข้อมูล Attendance จาก Prisma
app.get("/api/attendance", async (req, res) => {
  try {
    const attendanceData = await prisma.attendance.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
    res.status(200).json(attendanceData);
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({ error: "Failed to fetch attendance data" });
  }
});

//ส่งผ่านไลน์
app.post("/send-line-notify", async (req, res) => {
  try {
    const { message } = req.body;
    const token = process.env.LINE_NOTIFY_TOKEN;

    console.log("✅ Message:", message);

    if (!message) {
      return res.status(400).json({ success: false, error: "Message is required" });
    }

    // สร้าง form data
    const formData = new URLSearchParams();
    formData.append("message", message);

    // ส่ง request ไปยัง LINE Notify
    const response = await fetch("https://notify-api.line.me/api/notify", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    });

    const result = await response.json();
    console.log("📢 LINE Notify Response:", result);

    if (response.ok) {
      res.status(200).json({ success: true, message: "✅ Message sent successfully!" });
    } else {
      res.status(response.status).json({ success: false, error: result });
    }
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});




// Endpoint สำหรับรันโค้ด
app.post("/run-code", (req, res) => {
  const { code, language } = req.body;

  if (!code || !language) {
    return res.status(400).json({ error: "Code and language are required." });
  }

  // สร้างไฟล์ชั่วคราวสำหรับรันโค้ด
  const tempFilePath = path.join(__dirname, `temp.${language}`);
  fs.writeFileSync(tempFilePath, code);

  let command;

  // กำหนดคำสั่งรันตามภาษา
  switch (language) {
    case "js":
      command = `node ${tempFilePath}`;
      break;
    case "py":
      command = `python ${tempFilePath}`;
      break;
    case "java":
      const className = "Main"; // ชื่อคลาสในโค้ด Java ต้องเป็น Main
      fs.writeFileSync(path.join(__dirname, `${className}.java`), code);
      command = `javac ${className}.java && java ${className}`;
      break;
    default:
      return res.status(400).json({ error: "Unsupported language." });
  }

  exec(command, (error, stdout, stderr) => {
    // ลบไฟล์หลังรันโค้ดเสร็จ
    fs.unlinkSync(tempFilePath);

    if (language === "java") {
      const classFilePath = path.join(__dirname, "Main.class");
      if (fs.existsSync(classFilePath)) fs.unlinkSync(classFilePath);
    }

    if (error) {
      return res.status(400).json({ error: stderr || error.message });
    }
    res.json({ output: stdout });
  });
});


// POST /api/scores
app.post("/api/scores", async (req, res) => {
  console.log("Request body received:", req.body);

  const { userId, exerciseId, score } = req.body;

  if (!Number.isInteger(userId) || !Number.isInteger(exerciseId) || score == null) {
    console.error("Invalid or missing data:", { userId, exerciseId, score });
    return res.status(400).json({ error: "ข้อมูลไม่ครบถ้วนหรือรูปแบบข้อมูลไม่ถูกต้อง" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const exercise = await prisma.exercise.findUnique({ where: { id: exerciseId } });

    if (!user) {
      return res.status(404).json({ error: "ไม่พบผู้ใช้งานในระบบ" });
    }

    if (!exercise) {
      return res.status(404).json({ error: "ไม่พบแบบฝึกหัดในระบบ" });
    }

    const lastAttempt = await prisma.score.findMany({
      where: { userId, exerciseId },
      orderBy: { attempt: "desc" },
      take: 1,
    });

    const newAttempt = lastAttempt.length > 0 ? lastAttempt[0].attempt + 1 : 1;

    const newScore = await prisma.score.create({
      data: { userId, exerciseId, score, attempt: newAttempt },
    });

    console.log("New score saved successfully:", newScore);
    res.status(201).json({ message: "บันทึกคะแนนสำเร็จ", newScore });
  } catch (err) {
    console.error("Error saving score:", err.message);
    res.status(500).json({ error: "ไม่สามารถบันทึกคะแนนได้", details: err.message });
  }
});


//  ใบประกาศ
app.get("/api/user-scores/:userId", async (req, res) => {
  const { userId } = req.params;

  if (isNaN(userId)) {
    return res.status(400).json({ error: "❌ Invalid userId" });
  }

  try {
    const scores = await prisma.score.findMany({
      where: { userId: parseInt(userId) },
      include: {
        exercise: { select: { id: true, title: true } },
        user: { select: { id: true, name: true } }, // ดึงชื่อผู้ใช้
      },
      orderBy: { score: "desc" },
    });

    if (scores.length === 0) {
      return res.status(404).json({ error: "❌ ไม่พบคะแนนของผู้ใช้" });
    }

    const highestScores = {};
    scores.forEach((score) => {
      if (!highestScores[score.exerciseId] || highestScores[score.exerciseId].score < score.score) {
        highestScores[score.exerciseId] = score;
      }
    });

    const formattedScores = Object.values(highestScores).map((s) => ({
      userName: s.user.name, // ชื่อผู้ใช้
      exerciseId: s.exercise.id,
      exerciseTitle: s.exercise.title,
      score: s.score,
    }));

    res.json(formattedScores); // ส่งข้อมูลที่ต้องการไปยัง frontend
  } catch (error) {
    console.error("❌ Error fetching user scores:", error);
    res.status(500).json({ error: "❌ เกิดข้อผิดพลาดในการดึงข้อมูลคะแนน" });
  }
});





//ดูคะแคน
app.get("/api/scores", async (req, res) => {
  try {
    const scores = await prisma.score.findMany({
      include: {
        user: { select: { name: true } }, // ดึงชื่อผู้ใช้งาน
        exercise: { select: { title: true } }, // ดึงชื่อแบบฝึกหัด
      },
      orderBy: { createdAt: "desc" }, // เรียงลำดับคะแนนจากล่าสุด
    });
    res.json(scores);
  } catch (err) {
    console.error("Error fetching scores:", err.message);
    res.status(500).json({ error: "ไม่สามารถโหลดข้อมูลคะแนนได้" });
  }
});





// Leaderboard Endpoint
app.get("/api/leaderboard", async (req, res) => {
  try {
    // Fetch all leaderboard entries, including user and exercise details
    const leaderboard = await prisma.score.findMany({
      include: {
        user: { select: { name: true, id: true } }, // Include user name and ID
        exercise: { select: { title: true, id: true } }, // Include exercise title and ID
      },
      orderBy: [
        { exerciseId: "asc" }, // Order by exerciseId first
        { score: "desc" }, // Then order by score descending
      ],
    });

    // Group the data by exerciseTitle and ensure highest score for each user
    const groupedLeaderboard = leaderboard.reduce((acc, entry) => {
      const exerciseTitle = entry.exercise.title;
      const userId = entry.user.id;

      // Initialize the group for this exercise if it doesn't exist
      if (!acc[exerciseTitle]) {
        acc[exerciseTitle] = [];
      }

      // Check if the user already has a score for this exercise
      const existingUser = acc[exerciseTitle].find(user => user.userId === userId);

      // If no user exists or the current score is higher, update the leaderboard
      if (!existingUser || existingUser.score < entry.score) {
        // Remove the old score if the user is already in the leaderboard
        if (existingUser) {
          acc[exerciseTitle] = acc[exerciseTitle].filter(user => user.userId !== userId);
        }

        // Add the user with the highest score
        acc[exerciseTitle].push({
          name: entry.user.name,
          userId: entry.user.id,
          score: entry.score,
        });
      }

      return acc;
    }, {});

    // Send the grouped leaderboard as the response
    res.status(200).json(groupedLeaderboard);
  } catch (err) {
    console.error("❌ Error fetching leaderboard:", err);
    res.status(500).json({ error: "❌ ไม่สามารถโหลดอันดับได้" });
  }
});









// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}` );
});