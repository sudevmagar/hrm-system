import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET a specific employee by ID
export async function GET(req, { params }) {
  try {
    const id = parseInt(params?.id, 10);

    if (!id || isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid employee ID" },
        { status: 400 }
      );
    }

    const employee = await prisma.user.findUnique({
      where: { id },
    });

    if (!employee || employee.role !== "EMPLOYEE") {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ employee });
  } catch (error) {
    console.error("Error fetching employee:", error);
    return NextResponse.json(
      { error: "Failed to fetch employee", details: error?.message || "Unknown error" },
      { status: 500 }
    );
  }
}

// UPDATE a specific employee by ID
export async function PUT(req, { params }) {
  try {
    const id = params.id; // ID is already a string (UUID) - No need to parse

    const { name, email, department, role } = await req.json();

    if (!name || !email || !role) {
      return NextResponse.json(
        { error: "Name, email, and role are required" },
        { status: 400 }
      );
    }

    const employee = await prisma.user.update({
      where: { id }, // Use the string ID directly
      data: { name, email, department, role },
    });

    return NextResponse.json({ employee });
  } catch (error) {
    console.error("Error updating employee:", error);
    return NextResponse.json(
      { error: "Failed to update employee", details: error?.message || "Unknown error" },
      { status: 500 }
    );
  }
}

// DELETE a specific employee by ID
export async function DELETE(req, { params }) {
  try {
    const id = params.id; // ID is already a string (UUID) - No need to parse

    const employee = await prisma.user.findUnique({
      where: { id }, // Use the string ID directly
    });

    if (!employee || employee.role !== "EMPLOYEE") {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    await prisma.user.delete({
      where: { id }, // Use the string ID directly
    });

    return NextResponse.json({ message: "Employee deleted successfully" });
  } catch (error) {
    console.error("Error deleting employee:", error);
    return NextResponse.json(
      { error: "Failed to delete employee", details: error?.message || "Unknown error" },
      { status: 500 }
    );
  }
}