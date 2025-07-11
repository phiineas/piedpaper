import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/models/drizzle';
import { projects } from '@/lib/schema';
import { desc } from 'drizzle-orm';

export async function GET() {
  try {
    const allProjects = await db.select().from(projects).orderBy(desc(projects.lastUpdated));
    return NextResponse.json(allProjects);
  } catch (error) {
    console.error('error fetching projects', error);
    return NextResponse.json({ error: 'failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const newProject = await db.insert(projects).values({
      name: body.name,
      description: body.description || '',
      content: body.content || '# ' + body.name + '\n\nayoo !',
      starred: body.starred || false,
      createdAt: new Date(),
      lastUpdated: new Date(),
    }).returning();
    
    return NextResponse.json(newProject[0], { status: 201 });
  } catch (error) {
    console.error('error creating project', error);
    return NextResponse.json({ error: 'failed to create project' }, { status: 500 });
  }
}
