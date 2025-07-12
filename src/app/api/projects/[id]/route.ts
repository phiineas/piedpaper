import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/models/drizzle';
import { projects } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const project = await db
      .select()
      .from(projects)
      .where(and(eq(projects.id, id), eq(projects.userId, session.user.id)))
      .limit(1);

    if (project.length === 0) {
      return NextResponse.json({ error: 'project not found' }, { status: 404 });
    }

    return NextResponse.json(project[0]);
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json({ error: 'failed to fetch project' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const updatedProject = await db.update(projects)
      .set({ 
        ...body, 
        lastUpdated: new Date() 
      })
      .where(and(eq(projects.id, id), eq(projects.userId, session.user.id)))
      .returning();

    if (updatedProject.length === 0) {
      return NextResponse.json({ error: 'project not found' }, { status: 404 });
    }

    return NextResponse.json(updatedProject[0]);
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json({ error: 'failed to update project' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const deletedProject = await db
      .delete(projects)
      .where(and(eq(projects.id, id), eq(projects.userId, session.user.id)))
      .returning();

    if (deletedProject.length === 0) {
      return NextResponse.json({ error: 'project not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ error: 'failed to delete project' }, { status: 500 });
  }
}
