import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req, { params }) {
  try {
    const id = await params.id; // Correct: Await params.id

    const employee = await prisma.user.findUnique({
      where: { id }, // Correct: Find unique employee by ID
    });

    if (!employee) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 }); // Handle not found
    }

    return NextResponse.json({ employee }); // Return the single employee object

  } catch (error) {
    console.error("Error fetching employee:", error);
    return NextResponse.json({ error: "Failed to fetch employee" }, { status: 500 });
  }
}
