import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { deleteImage } from '@/lib/cloudinary';

// GET single showroom item
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const item = await prisma.showroomItem.findUnique({
      where: { id: params.id },
      include: {
        images: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!item) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    // Get related items (same category)
    const relatedItems = await prisma.showroomItem.findMany({
      where: {
        category: item.category,
        id: { not: item.id },
      },
      include: {
        images: {
          orderBy: {
            order: 'asc',
          },
          take: 1,
        },
      },
      take: 4,
    });

    return NextResponse.json({ item, relatedItems });
  } catch (error) {
    console.error('Error fetching showroom item:', error);
    return NextResponse.json(
      { error: 'Failed to fetch item' },
      { status: 500 }
    );
  }
}

// PUT update showroom item
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const { images, ...itemData } = data;

    // Delete existing images if new ones are provided
    if (images && images.length > 0) {
      const existingImages = await prisma.showroomImage.findMany({
        where: { showroomItemId: params.id },
      });

      // Delete from Cloudinary
      for (const img of existingImages) {
        try {
          await deleteImage(img.publicId);
        } catch (error) {
          console.error('Error deleting image from Cloudinary:', error);
        }
      }

      // Delete from database
      await prisma.showroomImage.deleteMany({
        where: { showroomItemId: params.id },
      });
    }

    const item = await prisma.showroomItem.update({
      where: { id: params.id },
      data: {
        ...itemData,
        specifications: itemData.specifications || {},
        ...(images && images.length > 0 && {
          images: {
            create: images.map((img: any, index: number) => ({
              url: img.url,
              publicId: img.publicId,
              order: index,
            })),
          },
        }),
      },
      include: {
        images: true,
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error('Error updating showroom item:', error);
    return NextResponse.json(
      { error: 'Failed to update item' },
      { status: 500 }
    );
  }
}

// DELETE showroom item
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get item with images
    const item = await prisma.showroomItem.findUnique({
      where: { id: params.id },
      include: { images: true },
    });

    if (!item) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    // Delete images from Cloudinary
    for (const img of item.images) {
      try {
        await deleteImage(img.publicId);
      } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
      }
    }

    // Delete item (cascades to images)
    await prisma.showroomItem.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting showroom item:', error);
    return NextResponse.json(
      { error: 'Failed to delete item' },
      { status: 500 }
    );
  }
}
