import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req, context) {
  const { params } = context;

  try {
    const id = await params.id;

    const attendance = await prisma.attendance.findMany({
      where: { userId: id }, 
    });

    return NextResponse.json({ attendance });
  } catch (error) {
    console.error("Error fetching attendance:", error);
    return NextResponse.json({ error: "Failed to fetch attendance" }, { status: 500 });
  }
}