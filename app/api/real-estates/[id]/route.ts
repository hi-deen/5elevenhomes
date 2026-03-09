import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { deleteImage } from '@/lib/cloudinary';

// GET single real estate section
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const section = await prisma.realEstateSection.findUnique({
      where: { id: params.id },
    });

    if (!section) {
      return NextResponse.json(
        { error: 'Section not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(section);
  } catch (error) {
    console.error('Error fetching real estate section:', error);
    return NextResponse.json(
      { error: 'Failed to fetch section' },
      { status: 500 }
    );
  }
}

// PUT update real estate section
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();

    // If new images are provided, delete old ones from Cloudinary
    if (data.imagePublicIds && data.imagePublicIds.length > 0) {
      const existingSection = await prisma.realEstateSection.findUnique({
        where: { id: params.id },
      });

      if (existingSection && existingSection.imagePublicIds.length > 0) {
        for (const publicId of existingSection.imagePublicIds) {
          try {
            await deleteImage(publicId);
          } catch (error) {
            console.error('Error deleting image from Cloudinary:', error);
          }
        }
      }
    }

    const section = await prisma.realEstateSection.update({
      where: { id: params.id },
      data: {
        ...data,
        progressPercentage: parseInt(data.progressPercentage),
        order: parseInt(data.order),
      },
    });

    return NextResponse.json(section);
  } catch (error) {
    console.error('Error updating real estate section:', error);
    return NextResponse.json(
      { error: 'Failed to update section' },
      { status: 500 }
    );
  }
}

// DELETE real estate section
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get section
    const section = await prisma.realEstateSection.findUnique({
      where: { id: params.id },
    });

    if (!section) {
      return NextResponse.json(
        { error: 'Section not found' },
        { status: 404 }
      );
    }

    // Delete images from Cloudinary
    if (section.imagePublicIds && section.imagePublicIds.length > 0) {
      for (const publicId of section.imagePublicIds) {
        try {
          await deleteImage(publicId);
        } catch (error) {
          console.error('Error deleting image from Cloudinary:', error);
        }
      }
    }

    // Delete section
    await prisma.realEstateSection.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Section deleted successfully' });
  } catch (error) {
    console.error('Error deleting real estate section:', error);
    return NextResponse.json(
      { error: 'Failed to delete section' },
      { status: 500 }
    );
  }
}
