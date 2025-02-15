import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req, { params }) {
  try {
    const { id } = params; // No need to await params here in a PUT handler
    const { status } = await req.json(); // Validate status (Important!)

    if (!["REVIEW", "APPROVED", "DECLINED"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid leave request status" },
        { status: 400 }
      );
    }

    const updatedLeaveRequest = await prisma.leaveRequest.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ updatedLeaveRequest });
  } catch (error) {
    console.error("Error updating leave request:", error); // More specific error handling (if needed)

    if (error.code === "P2025") {
      // Record not found
      return NextResponse.json(
        { error: "Leave request not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update leave request", details: error.message },
      { status: 500 }
    ); // Include error details
  }
}
