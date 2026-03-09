import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all showroom items
export async function GET() {
  try {
    const items = await prisma.showroomItem.findMany({
      include: {
        images: {
          orderBy: {
            order: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching showroom items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch showroom items' },
      { status: 500 }
    );
  }
}

// POST create new showroom item
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { images, ...itemData } = data;

    const item = await prisma.showroomItem.create({
      data: {
        ...itemData,
        specifications: itemData.specifications || {},
        images: {
          create: images.map((img: any, index: number) => ({
            url: img.url,
            publicId: img.publicId,
            order: index,
          })),
        },
      },
      include: {
        images: true,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('Error creating showroom item:', error);
    return NextResponse.json(
      { error: 'Failed to create showroom item' },
      { status: 500 }
    );
  }
}
