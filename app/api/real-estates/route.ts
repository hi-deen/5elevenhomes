import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all real estate sections
export async function GET() {
  try {
    const sections = await prisma.realEstateSection.findMany({
      orderBy: {
        order: 'asc',
      },
    });

    return NextResponse.json(sections);
  } catch (error) {
    console.error('Error fetching real estate sections:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sections' },
      { status: 500 }
    );
  }
}

// POST create new real estate section
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const section = await prisma.realEstateSection.create({
      data: {
        ...data,
        progressPercentage: parseInt(data.progressPercentage),
        order: parseInt(data.order || 0),
      },
    });

    return NextResponse.json(section, { status: 201 });
  } catch (error) {
    console.error('Error creating real estate section:', error);
    return NextResponse.json(
      { error: 'Failed to create section' },
      { status: 500 }
    );
  }
}
