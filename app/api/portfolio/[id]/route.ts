import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { deleteImage } from '@/lib/cloudinary';

// GET single portfolio project
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const project = await prisma.portfolioProject.findUnique({
      where: { id: params.id },
      include: {
        images: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Get related projects (same client type)
    const relatedProjects = await prisma.portfolioProject.findMany({
      where: {
        clientType: project.clientType,
        id: { not: project.id },
      },
      include: {
        images: {
          orderBy: {
            order: 'asc',
          },
          take: 1,
        },
      },
      take: 3,
    });

    return NextResponse.json({ project, relatedProjects });
  } catch (error) {
    console.error('Error fetching portfolio project:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

// PUT update portfolio project
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const { images, ...projectData } = data;

    // Delete existing images if new ones are provided
    if (images && images.length > 0) {
      const existingImages = await prisma.portfolioImage.findMany({
        where: { projectId: params.id },
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
      await prisma.portfolioImage.deleteMany({
        where: { projectId: params.id },
      });
    }

    const project = await prisma.portfolioProject.update({
      where: { id: params.id },
      data: {
        ...projectData,
        completionDate: new Date(projectData.completionDate),
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

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error updating portfolio project:', error);
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

// DELETE portfolio project
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get project with images
    const project = await prisma.portfolioProject.findUnique({
      where: { id: params.id },
      include: { images: true },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Delete images from Cloudinary
    for (const img of project.images) {
      try {
        await deleteImage(img.publicId);
      } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
      }
    }

    // Delete project (cascades to images)
    await prisma.portfolioProject.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting portfolio project:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}
