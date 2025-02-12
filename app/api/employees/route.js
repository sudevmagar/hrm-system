import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const employees = await prisma.user.findMany({
      where: { role: 'EMPLOYEE' }, // Fetch only employees
      select: {
        id: true,
        name: true,
        email: true,
        department: true,
        role: true,
      },
    });

    return NextResponse.json({ employees });
  } catch (error) {
    console.error('Error fetching employees:', error);
    return NextResponse.json({ error: 'Failed to fetch employees' }, { status: 500 });
  }
}