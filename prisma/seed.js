const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Check if HR exists
  let hr = await prisma.user.findUnique({
    where: { email: 'hr@example.com' },
  });

  if (!hr) {
    hr = await prisma.user.create({
      data: {
        email: 'hr@example.com',
        password: 'hrpassword',
        name: 'HR User',
        role: 'HR',
      },
    });
  } else {
    console.log('HR user already exists.');
  }

  // Check if Manager exists
  let manager = await prisma.user.findUnique({
    where: { email: 'manager@example.com' },
  });

  if (!manager) {
    manager = await prisma.user.create({
      data: {
        email: 'manager@example.com',
        password: 'managerpassword',
        name: 'Manager User',
        role: 'MANAGER',
      },
    });
  } else {
    console.log('Manager user already exists.');
  }

  // Create Employees if they don't exist
  for (let i = 1; i <= 5; i++) {
    const email = `employee${i}@example.com`;
    const existingEmployee = await prisma.user.findUnique({
      where: { email },
    });

    if (!existingEmployee) {
      await prisma.user.create({
        data: {
          email,
          password: `employeepassword${i}`,
          name: `Employee ${i}`,
          role: 'EMPLOYEE',
          managerId: manager.id,
        },
      });
    } else {
      console.log(`Employee ${i} already exists.`);
    }
  }

  console.log('Database seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
