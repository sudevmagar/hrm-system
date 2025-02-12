const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Create HR
  const hr = await prisma.user.create({
    data: {
      email: 'hr@example.com',
      password: 'hrpassword',
      name: 'HR User',
      role: 'HR',
    },
  });

  // Create Manager
  const manager = await prisma.user.create({
    data: {
      email: 'manager@example.com',
      password: 'managerpassword',
      name: 'Manager User',
      role: 'MANAGER',
    },
  });

  // Create Employees
  const employees = await Promise.all(
    Array.from({ length: 5 }).map((_, i) =>
      prisma.user.create({
        data: {
          email: `employee${i + 1}@example.com`,
          password: `employeepassword${i + 1}`,
          name: `Employee ${i + 1}`,
          role: 'EMPLOYEE',
          managerId: manager.id,
        },
      })
    )
  );

  console.log('Database seeded successfully!');
  console.log({ hr, manager, employees });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });