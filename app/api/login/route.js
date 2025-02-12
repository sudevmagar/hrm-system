import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request) {
  const { email, password } = await request.json();

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || user.password !== password) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  // Set a session cookie (for simplicity, we're just storing the user ID)
  const response = NextResponse.json({ user });
  response.cookies.set('userId', user.id, { httpOnly: true });

  return response;
}