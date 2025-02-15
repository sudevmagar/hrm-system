import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET all employees
export async function GET() {
  try {
    const employees = await prisma.user.findMany({
      where: { role: "EMPLOYEE" },
    });
    return NextResponse.json({ employees });
  } catch (error) {
    console.error("Error fetching employees:", error);
    return NextResponse.json(
      { error: "Failed to fetch employees", details: error.message },
      { status: 500 }
    );
  }
}

// POST a new employee
export async function POST(request) {
  try {
    const { name, email, department, role } = await request.json();

    console.log("Request body:", { name, email, department, role }); // Log the request body

    // Validate required fields (Important!)
    if (!name || !email || !role) {
      console.error("Missing required fields"); // Log if validation fails
      return NextResponse.json(
        { error: "Name, email, and role are required" },
        { status: 400 }
      );
    }

    const employee = await prisma.user.create({
      data: { name, email, department, role },
    });

    console.log("Created employee:", employee); // Log the created employee object

    return NextResponse.json({ employee }); // This should now work

  } catch (error) {
    console.error("Error creating employee:", error); // Log the full error object
    console.error("Error message:", error.message);
    if (error.stack) {
      console.error("Error stack:", error.stack);
    }

    // More specific error handling (if possible)
    if (error.code === 'P2002') { // Example: Unique constraint violation
      return NextResponse.json({ error: "Email already exists" }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Failed to create employee", details: error.message },
      { status: 500 }
    );
  }
}