import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const employees = await prisma.user.findMany({
      where: { role: "EMPLOYEE" },
    });
    return NextResponse.json({ employees });
  } catch (error) {
    console.error("Error fetching employees:", error);
    return NextResponse.json({ error: "Failed to fetch employees" }, { status: 500 });
  }
}

export async function POST(request) {
  const { name, email, department, role } = await request.json();

  try {
    const employee = await prisma.user.create({
      data: { name, email, department, role },
    });
    return NextResponse.json({ employee });
  } catch (error) {
    console.error("Error creating employee:", error);
    return NextResponse.json({ error: "Failed to create employee" }, { status: 500 });
  }
}