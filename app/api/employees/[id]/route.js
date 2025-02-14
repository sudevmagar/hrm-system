import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Get single employee
export async function GET(req, { params }) {
  try {
    const { id } = params;  // Fix destructuring

    const employee = await prisma.user.findUnique({
      where: { id: parseInt(id) }, // Convert id to integer if necessary
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

// Update employee
export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const { name, email, department, role } = await req.json();

    const updatedEmployee = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { name, email, department, role },
    });

    return NextResponse.json({ employee: updatedEmployee });

  } catch (error) {
    console.error("Error updating employee:", error);
    return NextResponse.json({ error: "Failed to update employee" }, { status: 500 });
  }
}

// Delete employee
export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    await prisma.user.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: "Employee deleted successfully" });

  } catch (error) {
    console.error("Error deleting employee:", error);
    return NextResponse.json({ error: "Failed to delete employee" }, { status: 500 });
  }
}
