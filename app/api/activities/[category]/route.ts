import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { category: string } }
) {
  const category = params.category;

  try {
    const activities = await prisma.activity.findMany({
      where: {
        category: {
          contains: category,
          mode: 'insensitive'
        }
      }
    });
    return NextResponse.json(activities);
  } catch (error) {
    console.error('Error fetching activities by category:', error);
    return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 });
  }
}