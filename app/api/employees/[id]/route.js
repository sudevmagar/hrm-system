import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req, { params }) {
  try {
    const id = params.id;

    const employee = await prisma.user.findUnique({
      where: { id },
    });

    if (!employee) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 });
    }

    return NextResponse.json({ employee });
  } catch (error) {
    console.error("Error fetching employee:", error);
    return NextResponse.json({ error: "Failed to fetch employee" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const { id } = params;
  const { name, email, department, role } = await req.json();

  try {
    const employee = await prisma.user.update({
      where: { id },
      data: { name, email, department, role },
    });
    return NextResponse.json({ employee });
  } catch (error) {
    console.error("Error updating employee:", error);
    return NextResponse.json({ error: "Failed to update employee" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ message: "Employee deleted successfully" });
  } catch (error) {
    console.error("Error deleting employee:", error);
    return NextResponse.json({ error: "Failed to delete employee" }, { status: 500 });
  }
}