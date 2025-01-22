const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  const email = 'admin@example.com'; // กำหนดอีเมลของ admin
  const password = '123456'; // กำหนดรหัสผ่านที่ต้องการแปลง

  // ใช้ bcrypt แปลงรหัสผ่านเป็น hash
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const adminUser = await prisma.user.create({
      data: {
        name: 'Admin', // ชื่อของ Admin
        email: email,  // อีเมล
        password: hashedPassword, // รหัสผ่านที่ถูกแปลงเป็น hash
        role: 'admin', // ตั้งค่า role เป็น admin
      },
    });

    console.log('Admin user created:', adminUser); // แสดงผลลัพธ์เมื่อสร้าง admin สำเร็จ
  } catch (error) {
    console.error('Error creating admin user:', error); // แสดงข้อผิดพลาด
  } finally {
    await prisma.$disconnect(); // ปิดการเชื่อมต่อกับฐานข้อมูล
  }
}

createAdmin(); // เรียกใช้ฟังก์ชันเพื่อสร้าง admin