const { PrismaClient, LeaveStatus, LeaveType } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Starting database seeding...");

  // Delete existing records
  console.log("🗑️ Deleting existing attendance records...");
  await prisma.attendance.deleteMany();
  console.log("🗑️ Deleting existing leave requests...");
  await prisma.leaveRequest.deleteMany();
  console.log("🗑️ Deleting existing users...");
  await prisma.user.deleteMany();

  // Hash passwords
  console.log("🔐 Hashing passwords...");
  const hrPassword = await bcrypt.hash("hrpassword", 10);
  const managerPassword = await bcrypt.hash("managerpassword", 10);
  const employeePassword = await bcrypt.hash("employeepassword", 10);

  // Create HR
  console.log("👤 Creating HR...");
  const hr = await prisma.user.create({
    data: {
      email: "hr@mayamatrix.com",
      password: hrPassword,
      name: "Sujit Shrestha",
      role: "HR",
      department: "Human Resources",
    },
  });

  // Create Manager
  console.log("👤 Creating Manager...");
  const manager = await prisma.user.create({
    data: {
      email: "manager@mayamatrix.com",
      password: managerPassword,
      name: "Rajesh Thapa",
      role: "MANAGER",
      department: "Software Development",
    },
  });

  // Create Employees
  console.log("👥 Creating Employees...");
  const employees = await prisma.$transaction(
    ["Amit Paudel", "Sunita Gurung", "Bikram Rai", "Priya Shrestha", "Sandeep Khadka"].map((name) =>
      prisma.user.create({
        data: {
          name,
          email: `${name.toLowerCase().replace(" ", ".")}@mayamatrix.com`,
          password: employeePassword,
          department: "Software Development",
          role: "EMPLOYEE",
          managerId: manager.id,
        },
      })
    )
  );

  console.log("✅ Users seeded successfully!");

  // Create Leave Requests
  console.log("📅 Seeding Leave Requests...");
  if (employees.length < 2) {
    console.error("❌ Not enough employees to seed leave requests.");
    return;
  }

  await prisma.leaveRequest.createMany({
    data: [
      {
        userId: employees[0].id,
        type: LeaveType.SICK,
        subject: "Medical Leave",
        body: "I need medical leave due to illness.",
        status: LeaveStatus.REVIEW,
        startDate: new Date("2025-02-21T00:00:00.000Z"),
        endDate: new Date("2025-02-23T00:00:00.000Z"),
      },
      {
        userId: employees[1].id,
        type: LeaveType.VACATION,
        subject: "Family Vacation",
        body: "I am requesting annual leave for a family vacation.",
        status: LeaveStatus.REVIEW,
        startDate: new Date("2025-02-24T00:00:00.000Z"),
        endDate: new Date("2025-02-28T00:00:00.000Z"),
      },
    ],
  });

  console.log("✅ Leave requests seeded successfully!");

  // Create Attendance Records
  console.log("📊 Seeding Attendance Records...");

  function getRandomTime(date, baseHour, minuteRange) {
    const randomMinute = Math.floor(Math.random() * minuteRange);
    return new Date(`${date}T${String(baseHour).padStart(2, "0")}:${String(randomMinute).padStart(2, "0")}:00.000Z`);
  }

  const attendanceData = [];

  for (const employee of employees) {
    for (let day = 1; day <= 14; day++) {
      const date = `2025-02-${String(day).padStart(2, "0")}`;

      const checkIn = getRandomTime(date, 9, 30); // 9:00 - 9:30 AM
      const checkOut = getRandomTime(date, 17, 30); // 5:00 - 5:30 PM

      if (checkOut <= checkIn) {
        console.warn(`⚠️ Invalid check-out detected for ${date}, adjusting...`);
        checkOut.setHours(17, Math.floor(Math.random() * 30), 0, 0);
      }

      attendanceData.push({ userId: employee.id, checkIn, checkOut });
    }
  }

  await prisma.attendance.createMany({ data: attendanceData });

  console.log("✅ Attendance records seeded successfully!");
  console.log("🎉 Database seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
