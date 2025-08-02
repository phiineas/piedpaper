import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/models/drizzle';
import { projects } from '@/lib/schema';
import { desc, eq, count } from 'drizzle-orm';
import { auth } from '@/lib/auth';

const MAX_PROJECTS_PER_USER = 6;

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const allProjects = await db
      .select()
      .from(projects)
      .where(eq(projects.userId, session.user.id))
      .orderBy(desc(projects.lastUpdated));
    
    return NextResponse.json(allProjects);
  } catch (error) {
    console.error('error fetching projects', error);
    return NextResponse.json({ error: 'failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    // check current project count for the user
    const userProjectCount = await db
      .select({ count: count() })
      .from(projects)
      .where(eq(projects.userId, session.user.id));

    const currentCount = userProjectCount[0]?.count || 0;

    if (currentCount >= MAX_PROJECTS_PER_USER) {
      return NextResponse.json(
        { 
          error: `project limit reached. you can create up to ${MAX_PROJECTS_PER_USER} projects`,
          currentCount,
          maxProjects: MAX_PROJECTS_PER_USER
        }, 
        { status: 400 }
      );
    }

    const body = await req.json();
    
    const newProject = await db.insert(projects).values({
      name: body.name,
      description: body.description || '',
      content: body.content || '# ' + body.name + '\n\nayoo !',
      starred: body.starred || false,
      userId: session.user.id,
      createdAt: new Date(),
      lastUpdated: new Date(),
    }).returning();
    
    return NextResponse.json(newProject[0], { status: 201 });
  } catch (error) {
    console.error('error creating project', error);
    return NextResponse.json({ error: 'failed to create project' }, { status: 500 });
  }
}
