import { PrismaClient, LeaveStatus, LeaveType, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Deleting existing leave requests...");
  await prisma.leaveRequest.deleteMany();

  console.log("Fetching employees...");
  const employees = await prisma.user.findMany({
    where: { role: "EMPLOYEE" }, // Fetch only employees
    select: { id: true },
  });

  if (employees.length < 2) {
    console.error("Not enough employees to seed leave requests.");
    return;
  }

  console.log("Seeding new leave requests...");
  await prisma.leaveRequest.createMany({
    data: [
      {
        userId: employees[0].id, // ✅ Assigning to first employee
        type: LeaveType.SICK,
        subject: "Medical Leave",
        body: "I need medical leave due to illness.",
        status: LeaveStatus.REVIEW,
        startDate: new Date("2025-02-21T00:00:00.000Z"),
        endDate: new Date("2025-02-23T00:00:00.000Z"),
      },
      {
        userId: employees[1].id, // ✅ Assigning to second employee
        type: LeaveType.VACATION,
        subject: "Family Vacation",
        body: "I am requesting annual leave for a family vacation.",
        status: LeaveStatus.REVIEW,
        startDate: new Date("2025-02-24T00:00:00.000Z"),
        endDate: new Date("2025-02-28T00:00:00.000Z"),
      },
    ],
  });

  console.log("Leave requests seeded successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding leave requests:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
