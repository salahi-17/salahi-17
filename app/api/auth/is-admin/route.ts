// app/api/auth/is-admin/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ isAdmin: false }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { isAdmin: true }
  });

  if (!user || !user.isAdmin) {
    return NextResponse.json({ isAdmin: false }, { status: 403 });
  }

  return NextResponse.json({ isAdmin: true });
}