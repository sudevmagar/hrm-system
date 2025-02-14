import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.email || !body.password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (!user) { // Check for user being null (no user found)
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    if (user.password !== body.password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    if (user.role !== "HR") {
      return NextResponse.json({ error: "You do not have access to the HR dashboard" }, { status: 403 });
    }

    // Explicitly create the user object to avoid potential null issues
    const userData = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    return NextResponse.json({ user: userData }); // Correct: Return an object

  } catch (error) {
    console.error("Error during login:", error);

    // More robust error handling: Include the error message in the JSON
    return NextResponse.json({ error: error.message || "Failed to log in" }, { status: 500 }); // Correct: Return an object with the error
  }
}