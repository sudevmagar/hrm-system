import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const leaveRequests = await prisma.leaveRequest.findMany({
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json({ leaveRequests });
  } catch (error) {
    console.error("Error fetching leave requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch leave requests", details: error.message }, // Include error details
      { status: 500 }
    );
  }
}
