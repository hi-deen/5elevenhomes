import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all portfolio projects
export async function GET() {
  try {
    const projects = await prisma.portfolioProject.findMany({
      include: {
        images: {
          orderBy: {
            order: 'asc',
          },
        },
      },
      orderBy: {
        completionDate: 'desc',
      },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching portfolio projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// POST create new portfolio project
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { images, ...projectData } = data;

    const project = await prisma.portfolioProject.create({
      data: {
        ...projectData,
        completionDate: new Date(projectData.completionDate),
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

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Error creating portfolio project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
